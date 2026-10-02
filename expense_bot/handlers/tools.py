"""Premium-инструменты: бюджеты, цели, свои категории, экспорт, общий бюджет, ИИ-отчёт."""
from __future__ import annotations

import re
from datetime import timedelta

from aiogram import Bot, F, Router
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.types import BufferedInputFile, CallbackQuery, Message
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from config import config
from database.models import Budget, Category, Goal, User, utcnow
from keyboards import btn, cancel_kb, categories_kb, kb, premium_kb, tools_kb
from services import family, reports
from services.core import (
    budget_line, category_label, custom_categories, get_category, ledger_currency,
    list_categories, month_spent, new_invite_code,
)
from utils.formatting import (
    esc, fmt_date, fmt_money, local_today, parse_amount, progress_bar,
)
from utils.i18n import all_variants, t
from utils.send import safe_edit, safe_send
from utils.states import ToolsForm

router = Router(name="tools")

FORBIDDEN = re.compile(r"[<>&]")  # не даём HTML-символы в названиях


async def premium_gate(event: Message | CallbackQuery, user: User) -> bool:
    """True — доступ есть. Иначе показывает предложение Premium."""
    if user.is_premium:
        return True
    message = event.message if isinstance(event, CallbackQuery) else event
    if isinstance(event, CallbackQuery):
        await event.answer()
    await message.answer(t(user.lang, "premium_only"), reply_markup=premium_kb(user.lang))
    return False


@router.message(Command("tools"))
@router.message(F.text.in_(all_variants("btn_tools")))
async def cmd_tools(message: Message, state: FSMContext, user: User) -> None:
    await state.clear()
    await message.answer(t(user.lang, "tools_title"), reply_markup=tools_kb(user.lang))


@router.callback_query(F.data == "tools")
async def cb_tools(call: CallbackQuery, state: FSMContext, user: User) -> None:
    await state.clear()
    await call.answer()
    await safe_edit(call, t(user.lang, "tools_title"), reply_markup=tools_kb(user.lang))


BACK = "tools"

# ----------------------------------------------------------------- Бюджеты


async def budgets_view(session: AsyncSession, user: User):
    base = await ledger_currency(session, user)
    budgets = (await session.scalars(select(Budget).where(Budget.ledger_id == user.ledger_id))).all()
    lines, rows = [t(user.lang, "budgets_title"), ""], []
    if not budgets:
        lines.append(t(user.lang, "budgets_empty"))
    for b in budgets:
        cat = await session.get(Category, b.category_id)
        spent = await month_spent(session, user, b.category_id)
        lines += [budget_line(user.lang, cat, spent, b.limit, base), ""]
        rows.append([btn(f"🗑 {category_label(cat, user.lang)}", f"bud:del:{b.id}")])
    rows.append([btn(t(user.lang, "btn_budget_add"), "bud:add")])
    rows.append([btn(t(user.lang, "btn_back"), BACK)])
    return "\n".join(lines), kb(*rows)


@router.callback_query(F.data == "budgets")
async def cb_budgets(call: CallbackQuery, session: AsyncSession, user: User) -> None:
    if not await premium_gate(call, user):
        return
    await call.answer()
    text, markup = await budgets_view(session, user)
    await safe_edit(call, text, reply_markup=markup)


@router.callback_query(F.data == "bud:add")
async def budget_add(call: CallbackQuery, session: AsyncSession, user: User) -> None:
    if not await premium_gate(call, user):
        return
    await call.answer()
    cats = await list_categories(session, user.ledger_id)
    await safe_edit(call, t(user.lang, "budget_choose_cat"),
                    reply_markup=categories_kb(cats, user.lang, "budcat:"))


@router.callback_query(F.data.startswith("budcat:"))
async def budget_category(call: CallbackQuery, state: FSMContext, session: AsyncSession, user: User) -> None:
    cat = await get_category(session, int(call.data.split(":")[1]), user.ledger_id)
    await call.answer()
    if not cat:
        return
    await state.set_state(ToolsForm.budget_limit)
    await state.update_data(category_id=cat.id)
    await safe_edit(call, t(user.lang, "budget_ask_limit", category=category_label(cat, user.lang)),
                    reply_markup=cancel_kb(user.lang))


@router.message(ToolsForm.budget_limit, F.text)
async def budget_limit(message: Message, state: FSMContext, session: AsyncSession, user: User) -> None:
    limit = parse_amount(message.text)
    if not limit or limit <= 0:
        await message.answer(t(user.lang, "bad_number"), reply_markup=cancel_kb(user.lang))
        return
    data = await state.get_data()
    await state.clear()
    cat = await get_category(session, data["category_id"], user.ledger_id)
    budget = await session.scalar(select(Budget).where(
        Budget.ledger_id == user.ledger_id, Budget.category_id == data["category_id"]))
    if budget:
        budget.limit, budget.notified_level = limit, 0
    else:
        session.add(Budget(ledger_id=user.ledger_id, category_id=data["category_id"], limit=limit))
    await session.commit()
    base = await ledger_currency(session, user)
    await message.answer(t(user.lang, "budget_set", category=category_label(cat, user.lang),
                           limit=fmt_money(limit, base)))
    text, markup = await budgets_view(session, user)
    await message.answer(text, reply_markup=markup)


@router.callback_query(F.data.startswith("bud:del:"))
async def budget_delete(call: CallbackQuery, session: AsyncSession, user: User) -> None:
    await session.execute(delete(Budget).where(
        Budget.id == int(call.data.split(":")[2]), Budget.ledger_id == user.ledger_id))
    await session.commit()
    await call.answer(t(user.lang, "budget_deleted"))
    text, markup = await budgets_view(session, user)
    await safe_edit(call, text, reply_markup=markup)


# ----------------------------------------------------------------- Цели


def goal_text(user: User, goal: Goal, cur: str) -> str:
    pct = min(100, goal.saved / goal.target * 100) if goal.target else 0
    forecast = ""
    if 0 < goal.saved < goal.target:
        days = max(1, (utcnow() - goal.created_at).days or 1)
        per_day = goal.saved / days
        eta = local_today(user.timezone) + timedelta(days=round((goal.target - goal.saved) / per_day))
        forecast = t(user.lang, "goal_forecast", date=fmt_date(eta))
    return t(user.lang, "goal_line", name=goal.name, bar=progress_bar(pct), pct=round(pct),
             saved=fmt_money(goal.saved, cur), target=fmt_money(goal.target, cur), forecast=forecast)


async def goals_view(session: AsyncSession, user: User):
    cur = await ledger_currency(session, user)
    goals = (await session.scalars(select(Goal).where(Goal.user_id == user.id).order_by(Goal.id))).all()
    lines, rows = [t(user.lang, "goals_title"), ""], []
    if not goals:
        lines.append(t(user.lang, "goals_empty"))
    for g in goals:
        lines += [goal_text(user, g, cur), ""]
        rows.append([btn(f"💵 {g.name}"[:40], f"goal:dep:{g.id}"), btn("🗑", f"goal:del:{g.id}")])
    rows.append([btn(t(user.lang, "btn_goal_add"), "goal:add")])
    rows.append([btn(t(user.lang, "btn_back"), BACK)])
    return "\n".join(lines), kb(*rows)


@router.callback_query(F.data == "goals")
async def cb_goals(call: CallbackQuery, session: AsyncSession, user: User) -> None:
    if not await premium_gate(call, user):
        return
    await call.answer()
    text, markup = await goals_view(session, user)
    await safe_edit(call, text, reply_markup=markup)


@router.callback_query(F.data == "goal:add")
async def goal_add(call: CallbackQuery, state: FSMContext, user: User) -> None:
    if not await premium_gate(call, user):
        return
    await call.answer()
    await state.set_state(ToolsForm.goal_new)
    await call.message.answer(t(user.lang, "goal_ask"), reply_markup=cancel_kb(user.lang))


@router.message(ToolsForm.goal_new, F.text)
async def goal_new(message: Message, state: FSMContext, session: AsyncSession, user: User) -> None:
    name, _, amount_raw = message.text.rpartition(":")
    name = FORBIDDEN.sub("", name).strip()[:64]
    target = parse_amount(amount_raw)
    if not name or not target or target <= 0:
        await message.answer(t(user.lang, "goal_bad"), reply_markup=cancel_kb(user.lang))
        return
    await state.clear()
    session.add(Goal(user_id=user.id, name=name, target=target))
    await session.commit()
    cur = await ledger_currency(session, user)
    await message.answer(t(user.lang, "goal_added", name=name, target=fmt_money(target, cur)))
    text, markup = await goals_view(session, user)
    await message.answer(text, reply_markup=markup)


@router.callback_query(F.data.startswith("goal:dep:"))
async def goal_deposit(call: CallbackQuery, state: FSMContext, session: AsyncSession, user: User) -> None:
    goal = await session.get(Goal, int(call.data.split(":")[2]))
    await call.answer()
    if not goal or goal.user_id != user.id:
        return
    await state.set_state(ToolsForm.goal_deposit)
    await state.update_data(goal_id=goal.id)
    await call.message.answer(t(user.lang, "goal_deposit_ask", name=goal.name),
                              reply_markup=cancel_kb(user.lang))


@router.message(ToolsForm.goal_deposit, F.text)
async def goal_deposit_amount(message: Message, state: FSMContext, session: AsyncSession, user: User) -> None:
    amount = parse_amount(message.text)
    if not amount:
        await message.answer(t(user.lang, "bad_number"), reply_markup=cancel_kb(user.lang))
        return
    goal = await session.get(Goal, (await state.get_data()).get("goal_id", 0))
    await state.clear()
    if not goal or goal.user_id != user.id:
        await message.answer(t(user.lang, "not_found"))
        return
    was_reached = goal.saved >= goal.target
    goal.saved = max(0.0, goal.saved + amount)
    await session.commit()
    cur = await ledger_currency(session, user)
    await message.answer(t(user.lang, "goal_updated", name=goal.name,
                           saved=fmt_money(goal.saved, cur), target=fmt_money(goal.target, cur)))
    if goal.saved >= goal.target and not was_reached:
        await message.answer(t(user.lang, "goal_reached", name=goal.name))
    text, markup = await goals_view(session, user)
    await message.answer(text, reply_markup=markup)


@router.callback_query(F.data.startswith("goal:del:"))
async def goal_delete(call: CallbackQuery, session: AsyncSession, user: User) -> None:
    await session.execute(delete(Goal).where(Goal.id == int(call.data.split(":")[2]),
                                             Goal.user_id == user.id))
    await session.commit()
    await call.answer(t(user.lang, "goal_deleted"))
    text, markup = await goals_view(session, user)
    await safe_edit(call, text, reply_markup=markup)


# ----------------------------------------------------------------- Свои категории


async def cats_view(session: AsyncSession, user: User):
    cats = await custom_categories(session, user.ledger_id)
    lines = [t(user.lang, "cats_title"), ""]
    if not cats:
        lines.append(t(user.lang, "cats_empty"))
    rows = [[btn(f"🗑 {category_label(c, user.lang)}", f"cat:del:{c.id}")] for c in cats]
    lines += [category_label(c, user.lang) for c in cats]
    rows.append([btn(t(user.lang, "btn_cat_add"), "cat:add")])
    rows.append([btn(t(user.lang, "btn_back"), BACK)])
    return "\n".join(lines), kb(*rows)


@router.callback_query(F.data == "cats")
async def cb_cats(call: CallbackQuery, session: AsyncSession, user: User) -> None:
    if not await premium_gate(call, user):
        return
    await call.answer()
    text, markup = await cats_view(session, user)
    await safe_edit(call, text, reply_markup=markup)


@router.callback_query(F.data == "cat:add")
async def cat_add(call: CallbackQuery, state: FSMContext, user: User) -> None:
    if not await premium_gate(call, user):
        return
    await call.answer()
    await state.set_state(ToolsForm.category_new)
    await call.message.answer(t(user.lang, "cat_ask"), reply_markup=cancel_kb(user.lang))


@router.message(ToolsForm.category_new, F.text)
async def cat_new(message: Message, state: FSMContext, session: AsyncSession, user: User) -> None:
    parts = message.text.strip().split(maxsplit=1)
    if len(parts) != 2 or parts[0][0].isalnum() or len(parts[0]) > 8:
        await message.answer(t(user.lang, "cat_bad"), reply_markup=cancel_kb(user.lang))
        return
    emoji, name = parts[0], FORBIDDEN.sub("", parts[1]).strip()[:30]
    if not name:
        await message.answer(t(user.lang, "cat_bad"), reply_markup=cancel_kb(user.lang))
        return
    await state.clear()
    session.add(Category(ledger_id=user.ledger_id, name=name, emoji=emoji))
    await session.commit()
    await message.answer(t(user.lang, "cat_added", emoji=emoji, name=name))
    text, markup = await cats_view(session, user)
    await message.answer(text, reply_markup=markup)


@router.callback_query(F.data.startswith("cat:del:"))
async def cat_delete(call: CallbackQuery, session: AsyncSession, user: User) -> None:
    cat = await session.get(Category, int(call.data.split(":")[2]))
    if cat and cat.ledger_id == user.ledger_id:
        cat.is_active = False  # скрываем, чтобы старые траты не потеряли категорию
        await session.commit()
    await call.answer(t(user.lang, "cat_deleted"))
    text, markup = await cats_view(session, user)
    await safe_edit(call, text, reply_markup=markup)


# ----------------------------------------------------------------- Экспорт


@router.callback_query(F.data == "export")
async def cb_export(call: CallbackQuery, user: User) -> None:
    if not await premium_gate(call, user):
        return
    await call.answer()
    await safe_edit(call, t(user.lang, "export_choose"), reply_markup=kb(
        [btn("📗 Excel (.xlsx)", "exp_file:xlsx"), btn("📄 CSV", "exp_file:csv")],
        [btn(t(user.lang, "btn_back"), BACK)]))


@router.callback_query(F.data.startswith("exp_file:"))
async def export_file(call: CallbackQuery, session: AsyncSession, user: User) -> None:
    if not await premium_gate(call, user):
        return
    await call.answer()
    rows = await reports.export_rows(session, user)
    if not rows:
        await call.message.answer(t(user.lang, "export_empty"))
        return
    fmt = call.data.split(":")[1]
    stamp = local_today(user.timezone).isoformat()
    if fmt == "csv":
        data, name = reports.to_csv(rows, user.lang), f"expenses_{stamp}.csv"
    else:
        data, name = await reports.to_xlsx(rows, user.lang), f"expenses_{stamp}.xlsx"
    await call.message.answer_document(BufferedInputFile(data, filename=name),
                                       caption=t(user.lang, "export_done"))


# ----------------------------------------------------------------- ИИ-отчёт по запросу


@router.callback_query(F.data == "ai_report")
async def ai_report(call: CallbackQuery, session: AsyncSession, user: User, bot: Bot) -> None:
    if not await premium_gate(call, user):
        return
    await call.answer("🤖")
    await bot.send_chat_action(call.message.chat.id, "typing")
    await safe_send(bot, call.message.chat.id, await reports.build_weekly_report(session, user))


# ----------------------------------------------------------------- Общий бюджет


async def family_view(session: AsyncSession, user: User, bot: Bot):
    if user.family_owner_id:
        owner = await session.get(User, user.family_owner_id)
        text = t(user.lang, "family_member", owner=esc(family.display_name(owner)) if owner else "—")
        return text, kb([btn(t(user.lang, "btn_family_leave"), "fam:leave")],
                        [btn(t(user.lang, "btn_back"), BACK)])
    if not user.invite_code:
        user.invite_code = new_invite_code()
        await session.commit()
    me = await bot.me()
    link = f"https://t.me/{me.username}?start=join_{user.invite_code}"
    members = await family.members(session, user.id)
    member_lines = "\n".join(f"• {esc(family.display_name(m))}" for m in members) \
        or t(user.lang, "family_no_members")
    rows = [[btn(f"❌ {family.display_name(m)}", f"fam:kick:{m.id}")] for m in members]
    rows.append([btn(t(user.lang, "btn_new_link"), "fam:newlink")])
    rows.append([btn(t(user.lang, "btn_back"), BACK)])
    text = t(user.lang, "family_owner", limit=config.family_members_limit, link=link,
             members=member_lines)
    return text, kb(*rows)


@router.callback_query(F.data == "family")
async def cb_family(call: CallbackQuery, session: AsyncSession, user: User, bot: Bot) -> None:
    # Участник может посмотреть и выйти всегда; приглашать — только с Premium
    if not user.family_owner_id and not await premium_gate(call, user):
        return
    await call.answer()
    text, markup = await family_view(session, user, bot)
    await safe_edit(call, text, reply_markup=markup, disable_web_page_preview=True)


@router.callback_query(F.data == "fam:newlink")
async def family_new_link(call: CallbackQuery, session: AsyncSession, user: User, bot: Bot) -> None:
    user.invite_code = new_invite_code()  # старая ссылка перестаёт работать
    await session.commit()
    await call.answer(t(user.lang, "saved"))
    text, markup = await family_view(session, user, bot)
    await safe_edit(call, text, reply_markup=markup, disable_web_page_preview=True)


@router.callback_query(F.data == "fam:leave")
async def family_leave(call: CallbackQuery, session: AsyncSession, user: User) -> None:
    user.family_owner_id = None
    await session.commit()
    await call.answer()
    await safe_edit(call, t(user.lang, "family_left"))


@router.callback_query(F.data.startswith("fam:kick:"))
async def family_kick(call: CallbackQuery, session: AsyncSession, user: User, bot: Bot) -> None:
    member = await session.get(User, int(call.data.split(":")[2]))
    if member and member.family_owner_id == user.id:
        member.family_owner_id = None
        await session.commit()
        await safe_send(bot, member.id, t(member.lang, "family_kicked"))
    await call.answer(t(user.lang, "family_removed"))
    text, markup = await family_view(session, user, bot)
    await safe_edit(call, text, reply_markup=markup, disable_web_page_preview=True)
