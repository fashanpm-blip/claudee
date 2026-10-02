"""Траты: быстрый ввод, ввод кнопками, статистика, графики, правка и удаление."""
from __future__ import annotations

from aiogram import Bot, F, Router
from aiogram.filters import Command, StateFilter
from aiogram.fsm.context import FSMContext
from aiogram.types import BufferedInputFile, CallbackQuery, Message
from sqlalchemy.ext.asyncio import AsyncSession

from database.models import Expense, User
from keyboards import (
    btn, cancel_kb, categories_kb, expense_added_kb, expense_edit_kb, kb, premium_kb, stats_kb,
)
from services import charts
from services.core import (
    add_expense, category_by_key, category_label, get_category, get_expense_for_edit,
    get_user, is_category_word, ledger_currency, list_categories, match_custom_category,
    recalc_base, recent_expenses, totals_by_category, daily_totals,
)
from services.parser import parse_expense
from utils.formatting import (
    CURRENCY_SYMBOLS, esc, fmt_money, local_today, month_name, parse_amount, period_range,
    utc_to_local,
)
from utils.i18n import all_variants, t
from utils.send import safe_edit, safe_send
from utils.states import AddExpense, EditExpense

router = Router(name="expenses")


# ----------------------------------------------------------------- Сохранение и ответ


async def save_and_report(message: Message, session: AsyncSession, user: User, bot: Bot,
                          amount: float, currency: str | None, category_id: int,
                          comment: str | None, source: str) -> None:
    """Сохраняет трату, отвечает пользователю и рассылает уведомления о бюджете."""
    result = await add_expense(session, user, amount, currency, category_id, comment, source)
    exp = result.expense
    cat = await get_category(session, category_id, user.ledger_id)
    converted = ""
    if exp.currency != result.base_currency:
        converted = t(user.lang, "converted", base=fmt_money(exp.amount_base, result.base_currency))
    await message.answer(
        t(user.lang, "expense_added", amount=fmt_money(exp.amount, exp.currency) + converted,
          category=category_label(cat, user.lang),
          comment=f"\n💬 {esc(exp.comment)}" if exp.comment else ""),
        reply_markup=expense_added_kb(user.lang, exp.id),
    )
    for recipient_id, alert in result.alerts:
        recipient = user if recipient_id == user.id else await get_user(session, recipient_id)
        if not recipient:
            continue
        text = t(recipient.lang, alert["key"], pct=alert["pct"], spent=alert["spent"],
                 limit=alert["limit"], category=category_label(alert["cat"], recipient.lang))
        if recipient.id == user.id:
            await message.answer(text)
        else:
            await safe_send(bot, recipient.id, text)


async def handle_parsed(message: Message, state: FSMContext, session: AsyncSession, user: User,
                        bot: Bot, amount: float, currency: str | None, category_key: str | None,
                        text: str, source: str) -> None:
    """Общая логика для текста, голоса и чеков: валюта → категория → сохранение."""
    base = await ledger_currency(session, user)
    if currency and currency != base and not user.is_premium:
        # Несколько валют — функция Premium: предлагаем записать в основной валюте
        await state.set_state(None)
        await state.update_data(pending=dict(amount=amount, currency=None,
                                             category_key=category_key, text=text, source=source))
        await message.answer(
            t(user.lang, "multicurrency_premium", amount=fmt_money(amount, base)),
            reply_markup=kb([btn(t(user.lang, "btn_yes_record"), "mcur:yes")],
                            [btn(t(user.lang, "btn_get_premium"), "premium")]),
        )
        return
    if currency == base:
        currency = None

    comment = text.strip() if text else ""
    category = await match_custom_category(session, user.ledger_id, comment) if comment else None
    if not category and category_key:
        category = await category_by_key(session, category_key)
    if comment and is_category_word(comment):
        comment = ""  # «250 еда» — слово «еда» не нужно дублировать в комментарии

    if category:
        await state.clear()
        await save_and_report(message, session, user, bot, amount, currency, category.id,
                              comment or None, source)
        return

    # Категорию не узнали — спрашиваем кнопками
    await state.set_state(AddExpense.category)
    await state.update_data(amount=amount, currency=currency, comment=comment, source=source,
                            quick=True)
    cats = await list_categories(session, user.ledger_id)
    await message.answer(
        t(user.lang, "ask_category", amount=fmt_money(amount, currency or base)),
        reply_markup=categories_kb(cats, user.lang, "addcat:"),
    )


@router.callback_query(F.data == "mcur:yes")
async def multicurrency_yes(call: CallbackQuery, state: FSMContext, session: AsyncSession,
                            user: User, bot: Bot) -> None:
    pending = (await state.get_data()).get("pending")
    await call.answer()
    if not pending:
        await safe_edit(call, t(user.lang, "not_found"))
        return
    await call.message.delete()
    await handle_parsed(call.message, state, session, user, bot, **pending)


# ----------------------------------------------------------------- Ввод кнопками


@router.message(Command("add"))
@router.message(F.text.in_(all_variants("btn_add")))
async def add_start(message: Message, state: FSMContext, user: User) -> None:
    await state.clear()
    await state.set_state(AddExpense.amount)
    await message.answer(t(user.lang, "ask_amount"), reply_markup=cancel_kb(user.lang))


@router.message(AddExpense.amount, F.text)
async def add_amount(message: Message, state: FSMContext, session: AsyncSession,
                     user: User, bot: Bot) -> None:
    amount = parse_amount(message.text)
    if amount is None:
        # Возможно, пользователь сразу написал «250 еда» — разберём как быстрый ввод
        parsed = parse_expense(message.text)
        if parsed:
            await handle_parsed(message, state, session, user, bot, parsed.amount, parsed.currency,
                                parsed.category_key, parsed.text, "text")
        else:
            await message.answer(t(user.lang, "bad_number"), reply_markup=cancel_kb(user.lang))
        return
    if amount <= 0:
        await message.answer(t(user.lang, "bad_number"), reply_markup=cancel_kb(user.lang))
        return
    await state.update_data(amount=amount, currency=None, source="manual", quick=False)
    await state.set_state(AddExpense.category)
    cats = await list_categories(session, user.ledger_id)
    base = await ledger_currency(session, user)
    await message.answer(t(user.lang, "ask_category", amount=fmt_money(amount, base)),
                         reply_markup=categories_kb(cats, user.lang, "addcat:"))


@router.callback_query(AddExpense.category, F.data.startswith("addcat:"))
async def add_category(call: CallbackQuery, state: FSMContext, session: AsyncSession,
                       user: User, bot: Bot) -> None:
    cat = await get_category(session, int(call.data.split(":")[1]), user.ledger_id)
    await call.answer()
    if not cat:
        return
    data = await state.get_data()
    if data.get("quick"):
        # Быстрый ввод: комментарий уже есть (или не нужен) — сразу сохраняем
        await state.clear()
        await call.message.delete()
        await save_and_report(call.message, session, user, bot, data["amount"], data.get("currency"),
                              cat.id, data.get("comment") or None, data.get("source", "text"))
        return
    await state.update_data(category_id=cat.id)
    await state.set_state(AddExpense.comment)
    await safe_edit(call, t(user.lang, "ask_comment"),
                    reply_markup=kb([btn(t(user.lang, "btn_skip"), "addskip")],
                                    [btn(t(user.lang, "btn_cancel"), "cancel")]))


@router.callback_query(AddExpense.comment, F.data == "addskip")
async def add_skip_comment(call: CallbackQuery, state: FSMContext, session: AsyncSession,
                           user: User, bot: Bot) -> None:
    data = await state.get_data()
    await state.clear()
    await call.answer()
    await call.message.delete()
    await save_and_report(call.message, session, user, bot, data["amount"], data.get("currency"),
                          data["category_id"], None, data.get("source", "manual"))


@router.message(AddExpense.comment, F.text)
async def add_comment(message: Message, state: FSMContext, session: AsyncSession,
                      user: User, bot: Bot) -> None:
    data = await state.get_data()
    await state.clear()
    await save_and_report(message, session, user, bot, data["amount"], data.get("currency"),
                          data["category_id"], message.text.strip()[:255], data.get("source", "manual"))


# ----------------------------------------------------------------- Статистика


async def stats_text(session: AsyncSession, user: User, period: str) -> str:
    start, end = period_range(period, user.timezone)
    rows = await totals_by_category(session, user.ledger_id, start, end)
    base = await ledger_currency(session, user)
    if period == "month":
        title = t(user.lang, "period_month", month=month_name(user.lang, local_today(user.timezone).month))
    else:
        title = t(user.lang, f"period_{period}")
    if not rows:
        return f"<b>{title}</b>\n\n{t(user.lang, 'stats_empty')}"
    total = sum(v for _, v in rows)
    lines = [f"<b>{title}</b>", ""]
    for cat, value in rows:
        lines.append(f"{category_label(cat, user.lang)} — {fmt_money(value, base)} "
                     f"({value / total * 100:.0f}%)")
    lines += ["", t(user.lang, "stats_total", total=fmt_money(total, base))]
    return "\n".join(lines)


@router.message(Command("today", "week", "month"))
async def cmd_period(message: Message, session: AsyncSession, user: User) -> None:
    period = message.text.split()[0].lstrip("/").split("@")[0]
    await message.answer(await stats_text(session, user, period),
                         reply_markup=stats_kb(user.lang, period))


@router.message(F.text.in_(all_variants("btn_stats")))
async def stats_menu(message: Message, state: FSMContext, session: AsyncSession, user: User) -> None:
    await state.clear()
    await message.answer(await stats_text(session, user, "today"),
                         reply_markup=stats_kb(user.lang, "today"))


@router.callback_query(F.data.startswith("stats:"))
async def stats_period(call: CallbackQuery, session: AsyncSession, user: User) -> None:
    period = call.data.split(":")[1]
    if period not in ("today", "week", "month"):
        period = "today"
    await call.answer()
    await safe_edit(call, await stats_text(session, user, period),
                    reply_markup=stats_kb(user.lang, period))


@router.callback_query(F.data.startswith("chart:"))
async def send_chart(call: CallbackQuery, session: AsyncSession, user: User) -> None:
    if not user.is_premium:
        await call.answer()
        await call.message.answer(t(user.lang, "premium_only"), reply_markup=premium_kb(user.lang))
        return
    _, kind, period = call.data.split(":")
    await call.answer()
    base = await ledger_currency(session, user)
    if period == "month":
        period_name = month_name(user.lang, local_today(user.timezone).month)
    else:
        period_name = t(user.lang, f"btn_{period}")
    symbol = CURRENCY_SYMBOLS.get(base, base)

    if kind == "pie":
        start, end = period_range(period, user.timezone)
        rows = await totals_by_category(session, user.ledger_id, start, end)
        if not rows:
            await call.message.answer(t(user.lang, "stats_empty"))
            return
        items = [(category_label(c, user.lang, with_emoji=False), v) for c, v in rows]
        image = await charts.pie_chart(items, t(user.lang, "chart_pie_title", period=period_name),
                                       symbol, t(user.lang, "cat_other"))
    else:
        if period == "today":
            period, period_name = "week", t(user.lang, "btn_week")  # по дням за 1 день — бессмысленно
        series = await daily_totals(session, user, period)
        if not any(v for _, v in series):
            await call.message.answer(t(user.lang, "stats_empty"))
            return
        image = await charts.days_chart(series, t(user.lang, "chart_days_title", period=period_name),
                                        symbol)
    await call.message.answer_photo(BufferedInputFile(image, filename="chart.png"))


# ----------------------------------------------------------------- Последние записи / правка


async def expense_card(session: AsyncSession, user: User, exp: Expense) -> str:
    cat = await get_category(session, exp.category_id, exp.ledger_id)
    author = user if exp.user_id == user.id else await get_user(session, exp.user_id)
    when = utc_to_local(exp.created_at, user.timezone).strftime("%d.%m.%Y %H:%M")
    base = await ledger_currency(session, user)
    amount = fmt_money(exp.amount, exp.currency)
    if exp.currency != base:
        amount += t(user.lang, "converted", base=fmt_money(exp.amount_base, base))
    name = (f"@{author.username}" if author and author.username
            else (author.first_name if author else "—"))
    return t(user.lang, "exp_card", date=when, amount=amount, category=category_label(cat, user.lang),
             comment=f"\n💬 {esc(exp.comment)}" if exp.comment else "", author=esc(name))


async def last_markup(session: AsyncSession, user: User):
    items = await recent_expenses(session, user)
    if not items:
        return None
    rows = []
    for exp in items:
        cat = await get_category(session, exp.category_id, exp.ledger_id)
        when = utc_to_local(exp.created_at, user.timezone).strftime("%d.%m")
        label = f"{when} · {fmt_money(exp.amount, exp.currency)} · {category_label(cat, user.lang)}"
        rows.append([btn(label[:60], f"exp:open:{exp.id}")])
    return kb(*rows)


@router.message(Command("last"))
async def cmd_last(message: Message, session: AsyncSession, user: User) -> None:
    markup = await last_markup(session, user)
    await message.answer(t(user.lang, "last_title" if markup else "last_empty"), reply_markup=markup)


@router.callback_query(F.data == "exp:last")
async def cb_last(call: CallbackQuery, state: FSMContext, session: AsyncSession, user: User) -> None:
    await state.clear()
    await call.answer()
    markup = await last_markup(session, user)
    await safe_edit(call, t(user.lang, "last_title" if markup else "last_empty"), reply_markup=markup)


@router.callback_query(F.data.startswith("exp:"))
async def expense_action(call: CallbackQuery, state: FSMContext, session: AsyncSession, user: User) -> None:
    _, action, exp_id = call.data.split(":")
    exp = await get_expense_for_edit(session, user, int(exp_id))
    if not exp:
        await call.answer(t(user.lang, "not_found"), show_alert=True)
        return
    await call.answer()
    if action == "open":
        await safe_edit(call, await expense_card(session, user, exp),
                        reply_markup=expense_edit_kb(user.lang, exp.id))
    elif action == "del":
        await session.delete(exp)
        await session.commit()
        await safe_edit(call, t(user.lang, "deleted"))
    elif action == "amount":
        await state.set_state(EditExpense.amount)
        await state.update_data(exp_id=exp.id)
        await call.message.answer(t(user.lang, "enter_new_amount"), reply_markup=cancel_kb(user.lang))
    elif action == "comment":
        await state.set_state(EditExpense.comment)
        await state.update_data(exp_id=exp.id)
        await call.message.answer(t(user.lang, "enter_new_comment"), reply_markup=cancel_kb(user.lang))
    elif action == "cat":
        cats = await list_categories(session, user.ledger_id)
        await safe_edit(call, t(user.lang, "ask_category", amount=fmt_money(exp.amount, exp.currency)),
                        reply_markup=categories_kb(cats, user.lang, f"expcat:{exp.id}:"))


@router.callback_query(F.data.startswith("expcat:"))
async def expense_set_category(call: CallbackQuery, session: AsyncSession, user: User) -> None:
    _, exp_id, cat_id = call.data.split(":")
    exp = await get_expense_for_edit(session, user, int(exp_id))
    cat = await get_category(session, int(cat_id), user.ledger_id)
    if not exp or not cat:
        await call.answer(t(user.lang, "not_found"), show_alert=True)
        return
    exp.category_id = cat.id
    await session.commit()
    await call.answer(t(user.lang, "updated"))
    await safe_edit(call, await expense_card(session, user, exp),
                    reply_markup=expense_edit_kb(user.lang, exp.id))


@router.message(EditExpense.amount, F.text)
async def expense_new_amount(message: Message, state: FSMContext, session: AsyncSession, user: User) -> None:
    amount = parse_amount(message.text)
    if not amount or amount <= 0:
        await message.answer(t(user.lang, "bad_number"), reply_markup=cancel_kb(user.lang))
        return
    exp = await get_expense_for_edit(session, user, (await state.get_data()).get("exp_id", 0))
    await state.clear()
    if not exp:
        await message.answer(t(user.lang, "not_found"))
        return
    exp.amount = amount
    await recalc_base(session, exp, await ledger_currency(session, user))
    await session.commit()
    await message.answer(t(user.lang, "updated") + "\n\n" + await expense_card(session, user, exp),
                         reply_markup=expense_edit_kb(user.lang, exp.id))


@router.message(EditExpense.comment, F.text)
async def expense_new_comment(message: Message, state: FSMContext, session: AsyncSession, user: User) -> None:
    exp = await get_expense_for_edit(session, user, (await state.get_data()).get("exp_id", 0))
    await state.clear()
    if not exp:
        await message.answer(t(user.lang, "not_found"))
        return
    text = message.text.strip()
    exp.comment = None if text == "-" else text[:255]
    await session.commit()
    await message.answer(t(user.lang, "updated") + "\n\n" + await expense_card(session, user, exp),
                         reply_markup=expense_edit_kb(user.lang, exp.id))


# ----------------------------------------------------------------- Быстрый ввод (последний обработчик)


@router.message(StateFilter(None), F.text & ~F.text.startswith("/"))
async def quick_add(message: Message, state: FSMContext, session: AsyncSession,
                    user: User, bot: Bot) -> None:
    parsed = parse_expense(message.text)
    if not parsed:
        await message.answer(t(user.lang, "not_understood"))
        return
    await handle_parsed(message, state, session, user, bot, parsed.amount, parsed.currency,
                        parsed.category_key, parsed.text, "text")
