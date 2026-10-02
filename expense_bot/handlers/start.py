"""Регистрация (/start), настройки, помощь и отмена."""
from __future__ import annotations

from aiogram import Bot, F, Router
from aiogram.filters import Command, CommandObject, CommandStart, StateFilter
from aiogram.fsm.context import FSMContext
from aiogram.types import CallbackQuery, Message
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from config import config
from database.models import Expense, User
from keyboards import btn, currency_kb, kb, lang_kb, main_menu, tz_kb
from services import family
from services.core import new_invite_code, recalc_base, start_trial
from utils.formatting import KNOWN_CURRENCIES, esc, parse_timezone
from utils.i18n import LANGS, all_variants, t
from utils.send import safe_edit, safe_send
from utils.states import Manual, Onboarding

router = Router(name="start")


# ----------------------------------------------------------------- /start


@router.message(CommandStart())
async def cmd_start(message: Message, command: CommandObject, state: FSMContext,
                    session: AsyncSession, user: User, bot: Bot) -> None:
    await state.clear()
    join_code = None
    if command.args and command.args.startswith("join_"):
        join_code = command.args[5:]

    if not user.registered:
        await state.set_state(Onboarding.lang)
        await state.update_data(join_code=join_code)
        await message.answer(t(user.lang, "choose_lang"), reply_markup=lang_kb("lang"))
        return

    await message.answer(t(user.lang, "main_menu"), reply_markup=main_menu(user.lang))
    if join_code:
        await process_join(message, session, user, join_code, bot)


async def process_join(message: Message, session: AsyncSession, user: User, code: str, bot: Bot) -> None:
    result, owner = await family.join(session, user, code)
    if owner:
        await message.answer(t(user.lang, result, owner=esc(family.display_name(owner))))
        if result == "family_joined":
            await safe_send(bot, owner.id, t(owner.lang, "family_new_member",
                                             name=esc(family.display_name(user))))
    else:
        await message.answer(t(user.lang, result))


@router.callback_query(Onboarding.lang, F.data.startswith("lang:"))
async def onboarding_lang(call: CallbackQuery, state: FSMContext, session: AsyncSession, user: User) -> None:
    code = call.data.split(":", 1)[1]
    if code in LANGS:
        user.lang = code
        await session.commit()
    await state.set_state(Onboarding.currency)
    await safe_edit(call, t(user.lang, "choose_currency"), reply_markup=currency_kb(user.lang, "cur"))
    await call.answer()


@router.callback_query(Onboarding.currency, F.data.startswith("cur:"))
async def onboarding_currency(call: CallbackQuery, state: FSMContext, session: AsyncSession, user: User) -> None:
    code = call.data.split(":", 1)[1]
    await call.answer()
    if code == "other":
        await state.set_state(Manual.currency)
        await state.update_data(mode="onboarding")
        await safe_edit(call, t(user.lang, "enter_currency"))
        return
    user.currency = code
    await session.commit()
    await state.set_state(Onboarding.tz)
    await safe_edit(call, t(user.lang, "choose_tz"), reply_markup=tz_kb(user.lang, "tz"))


@router.callback_query(Onboarding.tz, F.data.startswith("tz:"))
async def onboarding_tz(call: CallbackQuery, state: FSMContext, session: AsyncSession,
                        user: User, bot: Bot) -> None:
    value = call.data.split(":", 1)[1]
    await call.answer()
    if value == "manual":
        await state.set_state(Manual.tz)
        await state.update_data(mode="onboarding")
        await safe_edit(call, t(user.lang, "enter_tz"))
        return
    user.timezone = value
    await session.commit()
    await call.message.delete()
    await finish_onboarding(call.message, state, session, user, bot)


async def finish_onboarding(message: Message, state: FSMContext, session: AsyncSession,
                            user: User, bot: Bot) -> None:
    data = await state.get_data()
    await state.clear()
    user.registered = True
    if not user.invite_code:
        user.invite_code = new_invite_code()
    trial = start_trial(user)
    await session.commit()
    await message.answer(t(user.lang, "welcome"), reply_markup=main_menu(user.lang))
    if trial:
        await message.answer(t(user.lang, "trial_started", days=config.trial_days))
    if data.get("join_code"):
        await process_join(message, session, user, data["join_code"], bot)


# ----------------------------------------------------------------- Ручной ввод валюты / пояса


@router.message(Manual.currency, F.text)
async def manual_currency(message: Message, state: FSMContext, session: AsyncSession, user: User) -> None:
    code = message.text.strip().upper()
    if code not in KNOWN_CURRENCIES:
        await message.answer(t(user.lang, "bad_currency"))
        return
    mode = (await state.get_data()).get("mode")
    if mode == "onboarding":
        user.currency = code
        await session.commit()
        await state.set_state(Onboarding.tz)
        await message.answer(t(user.lang, "choose_tz"), reply_markup=tz_kb(user.lang, "tz"))
    else:
        await state.clear()
        await change_currency(session, user, code)
        await message.answer(t(user.lang, "saved"))
        await show_settings(message, user)


@router.message(Manual.tz, F.text)
async def manual_tz(message: Message, state: FSMContext, session: AsyncSession,
                    user: User, bot: Bot) -> None:
    tz = parse_timezone(message.text)
    if not tz:
        await message.answer(t(user.lang, "bad_tz"))
        return
    user.timezone = tz
    await session.commit()
    if (await state.get_data()).get("mode") == "onboarding":
        await finish_onboarding(message, state, session, user, bot)
    else:
        await state.clear()
        await message.answer(t(user.lang, "saved"))
        await show_settings(message, user)


# ----------------------------------------------------------------- Помощь и отмена


@router.message(Command("help"))
async def cmd_help(message: Message, user: User) -> None:
    await message.answer(t(user.lang, "help"), reply_markup=main_menu(user.lang))


@router.message(Command("cancel"))
@router.message(StateFilter("*"), F.text.in_(all_variants("btn_cancel")))
async def cmd_cancel(message: Message, state: FSMContext, user: User) -> None:
    await state.clear()
    await message.answer(t(user.lang, "cancelled"), reply_markup=main_menu(user.lang))


@router.callback_query(F.data == "cancel")
async def cb_cancel(call: CallbackQuery, state: FSMContext, user: User) -> None:
    await state.clear()
    await call.answer()
    await safe_edit(call, t(user.lang, "cancelled"))


# ----------------------------------------------------------------- Настройки


def settings_kb(user: User):
    state = t(user.lang, "on" if user.weekly_report else "off")
    return kb(
        [btn(t(user.lang, "btn_lang"), "set:lang"), btn(t(user.lang, "btn_currency"), "set:cur")],
        [btn(t(user.lang, "btn_tz"), "set:tz"),
         btn(t(user.lang, "btn_weekly", state=state), "set:weekly")],
    )


def settings_text(user: User) -> str:
    return t(user.lang, "settings_title", language=LANGS.get(user.lang, user.lang),
             currency=user.currency or "—", tz=user.timezone,
             weekly=t(user.lang, "on" if user.weekly_report else "off"))


async def show_settings(message: Message, user: User) -> None:
    await message.answer(settings_text(user), reply_markup=settings_kb(user))


@router.message(Command("settings"))
@router.message(F.text.in_(all_variants("btn_settings")))
async def cmd_settings(message: Message, state: FSMContext, user: User) -> None:
    await state.clear()
    await show_settings(message, user)


@router.callback_query(F.data == "set:lang")
async def set_lang_menu(call: CallbackQuery, user: User) -> None:
    await call.answer()
    await safe_edit(call, t(user.lang, "choose_lang"), reply_markup=lang_kb("setlang"))


@router.callback_query(F.data.startswith("setlang:"))
async def set_lang(call: CallbackQuery, session: AsyncSession, user: User) -> None:
    code = call.data.split(":", 1)[1]
    if code in LANGS:
        user.lang = code
        await session.commit()
    await call.answer(t(user.lang, "saved"))
    await call.message.answer(t(user.lang, "main_menu"), reply_markup=main_menu(user.lang))
    await safe_edit(call, settings_text(user), reply_markup=settings_kb(user))


@router.callback_query(F.data == "set:cur")
async def set_cur_menu(call: CallbackQuery, user: User) -> None:
    if user.family_owner_id:
        await call.answer(t(user.lang, "family_currency_locked"), show_alert=True)
        return
    await call.answer()
    await safe_edit(call, t(user.lang, "choose_currency"), reply_markup=currency_kb(user.lang, "setcur"))


async def change_currency(session: AsyncSession, user: User, code: str) -> None:
    """Меняет основную валюту и пересчитывает суммы всех трат бюджета."""
    if user.currency == code:
        return
    user.currency = code
    expenses = await session.scalars(select(Expense).where(Expense.ledger_id == user.id))
    for exp in expenses:
        await recalc_base(session, exp, code)
    await session.commit()


@router.callback_query(F.data.startswith("setcur:"))
async def set_cur(call: CallbackQuery, state: FSMContext, session: AsyncSession, user: User) -> None:
    code = call.data.split(":", 1)[1]
    await call.answer()
    if code == "other":
        await state.set_state(Manual.currency)
        await state.update_data(mode="settings")
        await safe_edit(call, t(user.lang, "enter_currency"))
        return
    await change_currency(session, user, code)
    await safe_edit(call, settings_text(user), reply_markup=settings_kb(user))


@router.callback_query(F.data == "set:tz")
async def set_tz_menu(call: CallbackQuery, user: User) -> None:
    await call.answer()
    await safe_edit(call, t(user.lang, "choose_tz"), reply_markup=tz_kb(user.lang, "settz"))


@router.callback_query(F.data.startswith("settz:"))
async def set_tz(call: CallbackQuery, state: FSMContext, session: AsyncSession, user: User) -> None:
    value = call.data.split(":", 1)[1]
    await call.answer()
    if value == "manual":
        await state.set_state(Manual.tz)
        await state.update_data(mode="settings")
        await safe_edit(call, t(user.lang, "enter_tz"))
        return
    if parse_timezone(value):
        user.timezone = value
        await session.commit()
    await safe_edit(call, settings_text(user), reply_markup=settings_kb(user))


@router.callback_query(F.data == "set:weekly")
async def set_weekly(call: CallbackQuery, session: AsyncSession, user: User) -> None:
    await session.execute(update(User).where(User.id == user.id)
                          .values(weekly_report=not user.weekly_report))
    await session.commit()
    await session.refresh(user)
    await call.answer(t(user.lang, "saved"))
    await safe_edit(call, settings_text(user), reply_markup=settings_kb(user))
