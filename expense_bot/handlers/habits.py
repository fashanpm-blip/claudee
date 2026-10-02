"""Привычки: список, добавление, отметки, заморозка серии."""
from __future__ import annotations

import re
from datetime import date

from aiogram import F, Router
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.types import CallbackQuery, InlineKeyboardMarkup, Message
from sqlalchemy.ext.asyncio import AsyncSession

from config import config
from database.models import Habit, User
from keyboards import btn, cancel_kb, kb, premium_kb
from services.core import (
    active_habits, calc_best, calc_streak, freezes_left, habit_logs, set_habit_status,
)
from utils.formatting import local_today, parse_time
from utils.i18n import all_variants, t
from utils.send import safe_edit
from utils.states import HabitForm

router = Router(name="habits")


def reminder_kb(lang: str, habit_id: int, day: date) -> InlineKeyboardMarkup:
    """Кнопки под напоминанием. Дата зашита в callback, чтобы отметка шла за нужный день."""
    d = day.isoformat()
    return kb([btn(t(lang, "btn_done"), f"hab:done:{habit_id}:{d}"),
               btn(t(lang, "btn_skip_habit"), f"hab:skip:{habit_id}:{d}")])


async def habits_overview(session: AsyncSession, user: User) -> tuple[str, InlineKeyboardMarkup]:
    habits = await active_habits(session, user.id)
    today = local_today(user.timezone)
    lines = [t(user.lang, "habits_title"), ""]
    rows = []
    if not habits:
        lines.append(t(user.lang, "habits_empty"))
    for h in habits:
        logs = await habit_logs(session, h.id)
        mark = {"done": "✅", "frozen": "🛡", "skip": "❌"}.get(logs.get(today), "⬜️")
        time_part = t(user.lang, "habit_time", time=h.remind_time) if h.remind_time else ""
        lines.append(t(user.lang, "habit_line", mark=mark, name=h.name,
                       streak=calc_streak(logs, today), time=time_part))
        rows.append([btn(f"{mark} {h.name}", f"hab:open:{h.id}")])
    rows.append([btn(t(user.lang, "btn_habit_add"), "hab:add")])
    return "\n".join(lines), kb(*rows)


@router.message(Command("habits"))
@router.message(F.text.in_(all_variants("btn_habits")))
async def cmd_habits(message: Message, state: FSMContext, session: AsyncSession, user: User) -> None:
    await state.clear()
    text, markup = await habits_overview(session, user)
    await message.answer(text, reply_markup=markup)


@router.callback_query(F.data == "hab:list")
async def cb_habits(call: CallbackQuery, state: FSMContext, session: AsyncSession, user: User) -> None:
    await state.clear()
    await call.answer()
    text, markup = await habits_overview(session, user)
    await safe_edit(call, text, reply_markup=markup)


# ----------------------------------------------------------------- Добавление


@router.callback_query(F.data == "hab:add")
async def habit_add(call: CallbackQuery, state: FSMContext, session: AsyncSession, user: User) -> None:
    await call.answer()
    habits = await active_habits(session, user.id)
    if len(habits) >= config.free_habits_limit and not user.is_premium:
        await call.message.answer(t(user.lang, "habit_limit", limit=config.free_habits_limit),
                                  reply_markup=premium_kb(user.lang))
        return
    await state.set_state(HabitForm.name)
    await call.message.answer(t(user.lang, "ask_habit_name"), reply_markup=cancel_kb(user.lang))


@router.message(HabitForm.name, F.text)
async def habit_name(message: Message, state: FSMContext, user: User) -> None:
    name = re.sub(r"[<>&]", "", message.text).strip()[:64]
    if not name or name.startswith("/"):
        await message.answer(t(user.lang, "ask_habit_name"), reply_markup=cancel_kb(user.lang))
        return
    await state.update_data(name=name, habit_id=None)
    await state.set_state(HabitForm.time)
    await message.answer(t(user.lang, "ask_habit_time"), reply_markup=time_kb(user.lang))


def time_kb(lang: str) -> InlineKeyboardMarkup:
    return kb(
        [btn("08:00", "habt:08:00"), btn("12:00", "habt:12:00"), btn("20:00", "habt:20:00"),
         btn("21:00", "habt:21:00")],
        [btn(t(lang, "btn_no_reminder"), "habt:none")],
        [btn(t(lang, "btn_cancel"), "cancel")],
    )


async def save_habit_time(target: Message, state: FSMContext, session: AsyncSession, user: User,
                          time_value: str | None) -> None:
    data = await state.get_data()
    await state.clear()
    if data.get("habit_id"):  # меняем время существующей привычки
        habit = await session.get(Habit, data["habit_id"])
        if habit and habit.user_id == user.id:
            habit.remind_time = time_value
            await session.commit()
        await target.answer(t(user.lang, "time_updated"))
    else:
        habits = await active_habits(session, user.id)
        if len(habits) >= config.free_habits_limit and not user.is_premium:
            await target.answer(t(user.lang, "habit_limit", limit=config.free_habits_limit),
                                reply_markup=premium_kb(user.lang))
            return
        session.add(Habit(user_id=user.id, name=data["name"], remind_time=time_value))
        await session.commit()
        await target.answer(t(user.lang, "habit_added", name=data["name"]))
    text, markup = await habits_overview(session, user)
    await target.answer(text, reply_markup=markup)


@router.callback_query(HabitForm.time, F.data.startswith("habt:"))
async def habit_time_button(call: CallbackQuery, state: FSMContext, session: AsyncSession, user: User) -> None:
    value = call.data.split(":", 1)[1]
    await call.answer()
    await call.message.delete()
    await save_habit_time(call.message, state, session, user, None if value == "none" else value)


@router.message(HabitForm.time, F.text)
async def habit_time_text(message: Message, state: FSMContext, session: AsyncSession, user: User) -> None:
    value = parse_time(message.text)
    if not value:
        await message.answer(t(user.lang, "bad_time"), reply_markup=time_kb(user.lang))
        return
    await save_habit_time(message, state, session, user, value)


# ----------------------------------------------------------------- Карточка привычки


async def own_habit(session: AsyncSession, user: User, habit_id: str) -> Habit | None:
    habit = await session.get(Habit, int(habit_id))
    return habit if habit and habit.user_id == user.id and habit.is_active else None


async def habit_card(session: AsyncSession, user: User, habit: Habit) -> tuple[str, InlineKeyboardMarkup]:
    logs = await habit_logs(session, habit.id)
    today = local_today(user.timezone)
    text = t(user.lang, "habit_menu", name=habit.name, streak=calc_streak(logs, today),
             best=calc_best(logs), time=habit.remind_time or t(user.lang, "no_reminder"))
    markup = kb(
        [btn(t(user.lang, "btn_mark_done"), f"hab:done:{habit.id}:{today.isoformat()}"),
         btn(t(user.lang, "btn_skip_habit"), f"hab:skip:{habit.id}:{today.isoformat()}")],
        [btn(t(user.lang, "btn_change_time"), f"hab:time:{habit.id}"),
         btn(t(user.lang, "btn_delete"), f"hab:del:{habit.id}")],
        [btn(t(user.lang, "btn_back"), "hab:list")],
    )
    return text, markup


@router.callback_query(F.data.startswith("hab:open:"))
async def habit_open(call: CallbackQuery, session: AsyncSession, user: User) -> None:
    habit = await own_habit(session, user, call.data.split(":")[2])
    if not habit:
        await call.answer(t(user.lang, "not_found"), show_alert=True)
        return
    await call.answer()
    text, markup = await habit_card(session, user, habit)
    await safe_edit(call, text, reply_markup=markup)


@router.callback_query(F.data.startswith("hab:del:"))
async def habit_delete(call: CallbackQuery, session: AsyncSession, user: User) -> None:
    habit = await own_habit(session, user, call.data.split(":")[2])
    if habit:
        habit.is_active = False
        await session.commit()
    await call.answer(t(user.lang, "habit_deleted"))
    text, markup = await habits_overview(session, user)
    await safe_edit(call, text, reply_markup=markup)


@router.callback_query(F.data.startswith("hab:time:"))
async def habit_change_time(call: CallbackQuery, state: FSMContext, session: AsyncSession, user: User) -> None:
    habit = await own_habit(session, user, call.data.split(":")[2])
    await call.answer()
    if not habit:
        return
    await state.set_state(HabitForm.time)
    await state.update_data(habit_id=habit.id, name=habit.name)
    await call.message.answer(t(user.lang, "ask_habit_time"), reply_markup=time_kb(user.lang))


# ----------------------------------------------------------------- Отметки


def _parse_day(raw: str, user: User) -> date:
    try:
        return date.fromisoformat(raw)
    except ValueError:
        return local_today(user.timezone)


@router.callback_query(F.data.startswith("hab:done:"))
async def habit_done(call: CallbackQuery, session: AsyncSession, user: User) -> None:
    _, _, habit_id, raw_day = call.data.split(":")
    habit = await own_habit(session, user, habit_id)
    if not habit:
        await call.answer(t(user.lang, "not_found"), show_alert=True)
        return
    day = _parse_day(raw_day, user)
    if not await set_habit_status(session, habit, day, "done"):
        await call.answer(t(user.lang, "habit_already"), show_alert=True)
        return
    streak = calc_streak(await habit_logs(session, habit.id), local_today(user.timezone))
    await call.answer("💪")
    await safe_edit(call, t(user.lang, "habit_done", name=habit.name, streak=streak),
                    reply_markup=kb([btn(t(user.lang, "btn_back"), "hab:list")]))


@router.callback_query(F.data.startswith("hab:skip:"))
async def habit_skip(call: CallbackQuery, session: AsyncSession, user: User) -> None:
    _, _, habit_id, raw_day = call.data.split(":")
    habit = await own_habit(session, user, habit_id)
    if not habit:
        await call.answer(t(user.lang, "not_found"), show_alert=True)
        return
    day = _parse_day(raw_day, user)
    logs = await habit_logs(session, habit.id)
    if day in logs:
        await call.answer(t(user.lang, "habit_already"), show_alert=True)
        return
    await call.answer()
    # Premium: предлагаем заморозку, если есть что сохранять
    if user.is_premium and calc_streak(logs, day) > 0:
        left = await freezes_left(session, user)
        if left > 0:
            await safe_edit(call, t(user.lang, "freeze_offer", left=left), reply_markup=kb(
                [btn(t(user.lang, "btn_use_freeze"), f"hab:freeze:{habit.id}:{raw_day}"),
                 btn(t(user.lang, "btn_just_skip"), f"hab:skipok:{habit.id}:{raw_day}")]))
            return
    await set_habit_status(session, habit, day, "skip")
    await safe_edit(call, t(user.lang, "habit_skipped", name=habit.name),
                    reply_markup=kb([btn(t(user.lang, "btn_back"), "hab:list")]))


@router.callback_query(F.data.startswith("hab:skipok:"))
async def habit_skip_confirm(call: CallbackQuery, session: AsyncSession, user: User) -> None:
    _, _, habit_id, raw_day = call.data.split(":")
    habit = await own_habit(session, user, habit_id)
    if not habit:
        await call.answer(t(user.lang, "not_found"), show_alert=True)
        return
    await call.answer()
    await set_habit_status(session, habit, _parse_day(raw_day, user), "skip")
    await safe_edit(call, t(user.lang, "habit_skipped", name=habit.name),
                    reply_markup=kb([btn(t(user.lang, "btn_back"), "hab:list")]))


@router.callback_query(F.data.startswith("hab:freeze:"))
async def habit_freeze(call: CallbackQuery, session: AsyncSession, user: User) -> None:
    _, _, habit_id, raw_day = call.data.split(":")
    habit = await own_habit(session, user, habit_id)
    if not habit:
        await call.answer(t(user.lang, "not_found"), show_alert=True)
        return
    if not user.is_premium:
        await call.answer()
        await call.message.answer(t(user.lang, "premium_only"), reply_markup=premium_kb(user.lang))
        return
    left = await freezes_left(session, user)
    if left <= 0:
        await call.answer(t(user.lang, "no_freezes"), show_alert=True)
        return
    day = _parse_day(raw_day, user)
    if not await set_habit_status(session, habit, day, "frozen"):
        await call.answer(t(user.lang, "habit_already"), show_alert=True)
        return
    await call.answer("🛡")
    streak = calc_streak(await habit_logs(session, habit.id), local_today(user.timezone))
    await safe_edit(call, t(user.lang, "habit_frozen", name=habit.name, streak=streak, left=left - 1),
                    reply_markup=kb([btn(t(user.lang, "btn_back"), "hab:list")]))
