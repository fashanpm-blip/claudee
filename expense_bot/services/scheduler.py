"""Планировщик (APScheduler): напоминания о привычках, воскресный ИИ-отчёт,
окончание Premium. Каждую минуту проверяем, у каких часовых поясов сейчас
наступило нужное местное время — так напоминания учитывают пояс каждого пользователя."""
from __future__ import annotations

import asyncio
import logging

from aiogram import Bot
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy import select

from database import async_session
from database.models import Habit, HabitLog, User, utcnow
from services.core import calc_streak, habit_logs
from services.reports import build_weekly_report
from utils.formatting import local_now
from utils.i18n import t
from utils.send import safe_send

log = logging.getLogger(__name__)

WEEKLY_REPORT_WEEKDAY = 6  # воскресенье
WEEKLY_REPORT_TIME = "20:00"
SEND_DELAY = 0.04  # ~25 сообщений в секунду — в пределах лимитов Telegram


async def _timezones() -> list[str]:
    async with async_session() as session:
        rows = await session.scalars(
            select(User.timezone).where(User.is_blocked.is_(False), User.registered.is_(True)).distinct()
        )
        return [tz for tz in rows if tz]


async def habit_reminders(bot: Bot) -> None:
    from handlers.habits import reminder_kb  # локальный импорт, чтобы избежать циклов

    for tz in await _timezones():
        now = local_now(tz)
        hhmm, today = now.strftime("%H:%M"), now.date()
        async with async_session() as session:
            rows = (await session.execute(
                select(Habit, User).join(User, User.id == Habit.user_id).where(
                    User.timezone == tz, User.is_blocked.is_(False), Habit.is_active.is_(True),
                    Habit.remind_time == hhmm,
                )
            )).all()
            for habit, user in rows:
                done = await session.scalar(
                    select(HabitLog.id).where(HabitLog.habit_id == habit.id, HabitLog.day == today))
                if done:
                    continue  # уже отмечено сегодня — не беспокоим
                streak = calc_streak(await habit_logs(session, habit.id), today)
                await safe_send(bot, user.id, t(user.lang, "habit_reminder", name=habit.name, streak=streak),
                                reply_markup=reminder_kb(user.lang, habit.id, today))
                await asyncio.sleep(SEND_DELAY)


async def weekly_reports(bot: Bot) -> None:
    for tz in await _timezones():
        now = local_now(tz)
        if now.weekday() != WEEKLY_REPORT_WEEKDAY or now.strftime("%H:%M") != WEEKLY_REPORT_TIME:
            continue
        async with async_session() as session:
            users = (await session.scalars(select(User).where(
                User.timezone == tz, User.is_blocked.is_(False), User.weekly_report.is_(True),
                User.premium_until > utcnow(),
            ))).all()
            for user in users:
                try:
                    text = await build_weekly_report(session, user)
                except Exception:  # noqa: BLE001 — один пользователь не должен ломать рассылку
                    log.exception("Не удалось построить отчёт для %s", user.id)
                    continue
                await safe_send(bot, user.id, text)
                await asyncio.sleep(SEND_DELAY)


async def premium_expiry(bot: Bot) -> None:
    """Сообщает пользователям, у которых закончился Premium (сам доступ отключается
    автоматически — проверка идёт по дате premium_until)."""
    async with async_session() as session:
        users = (await session.scalars(select(User).where(
            User.premium_until <= utcnow(), User.premium_notified_expired.is_(False),
        ))).all()
        for user in users:
            user.premium_notified_expired = True
            await session.commit()
            await safe_send(bot, user.id, t(user.lang, "premium_expired"))
            await asyncio.sleep(SEND_DELAY)


async def every_minute(bot: Bot) -> None:
    for job in (habit_reminders, weekly_reports):
        try:
            await job(bot)
        except Exception:  # noqa: BLE001
            log.exception("Ошибка в задаче %s", job.__name__)


def setup_scheduler(bot: Bot) -> AsyncIOScheduler:
    scheduler = AsyncIOScheduler(timezone="UTC")
    scheduler.add_job(every_minute, "cron", second=5, args=[bot], max_instances=1, coalesce=True,
                      misfire_grace_time=50)
    scheduler.add_job(premium_expiry, "interval", minutes=10, args=[bot], max_instances=1,
                      coalesce=True)
    return scheduler
