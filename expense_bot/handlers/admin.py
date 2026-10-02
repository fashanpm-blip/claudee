"""Админ-панель (только для ADMIN_ID)."""
from __future__ import annotations

import asyncio
import logging

from aiogram import Bot, F, Router
from aiogram.exceptions import TelegramForbiddenError, TelegramRetryAfter
from aiogram.filters import Command, CommandObject, Filter
from aiogram.fsm.context import FSMContext
from aiogram.types import CallbackQuery, Message, TelegramObject
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from config import config
from database import async_session
from database.models import Expense, Payment, User, utcnow
from keyboards import btn, kb
from services.core import grant_premium
from utils.formatting import fmt_date, period_range
from utils.i18n import t
from utils.send import mark_blocked, safe_edit, safe_send
from utils.states import AdminForm

router = Router(name="admin")
log = logging.getLogger(__name__)

STAR_TO_USD = 0.013  # примерная выплата разработчику за 1 Star


class IsAdmin(Filter):
    async def __call__(self, event: TelegramObject) -> bool:
        user = getattr(event, "from_user", None)
        return bool(user and user.id in config.admin_ids)


router.message.filter(IsAdmin())
router.callback_query.filter(IsAdmin())


def admin_kb():
    return kb([btn("📣 Рассылка", "adm:broadcast"), btn("🎁 Выдать Premium", "adm:grant")],
              [btn("🔄 Обновить", "adm:stats")])


async def stats_text(session: AsyncSession) -> str:
    now = utcnow()
    users = await session.scalar(select(func.count(User.id)))
    active = await session.scalar(select(func.count(User.id)).where(User.is_blocked.is_(False)))
    premium = await session.scalar(select(func.count(User.id)).where(User.premium_until > now))
    paying = await session.scalar(
        select(func.count(func.distinct(Payment.user_id))).where(Payment.refunded.is_(False)))
    month_start, _ = period_range("month", "UTC")
    stars = await session.scalar(
        select(func.coalesce(func.sum(Payment.amount), 0))
        .where(Payment.created_at >= month_start, Payment.refunded.is_(False))) or 0
    total_stars = await session.scalar(
        select(func.coalesce(func.sum(Payment.amount), 0)).where(Payment.refunded.is_(False))) or 0
    expenses = await session.scalar(select(func.count(Expense.id)))
    return (
        "🛠 <b>Админ-панель</b>\n\n"
        f"👥 Пользователей: <b>{users}</b> (не заблокировали бота: {active})\n"
        f"⭐ Premium сейчас: <b>{premium}</b> (платящих за всё время: {paying})\n"
        f"💰 Доход за месяц: <b>{stars} ⭐</b> ≈ ${stars * STAR_TO_USD:.2f}\n"
        f"💰 Доход всего: {total_stars} ⭐ ≈ ${total_stars * STAR_TO_USD:.2f}\n"
        f"🧾 Трат записано: {expenses}\n\n"
        "Команды: /refund &lt;charge_id&gt; — вернуть платёж"
    )


@router.message(Command("admin"))
async def cmd_admin(message: Message, state: FSMContext, session: AsyncSession) -> None:
    await state.clear()
    await message.answer(await stats_text(session), reply_markup=admin_kb())


@router.callback_query(F.data == "adm:stats")
async def cb_stats(call: CallbackQuery, session: AsyncSession) -> None:
    await call.answer()
    await safe_edit(call, await stats_text(session), reply_markup=admin_kb())


# ----------------------------------------------------------------- Рассылка


@router.callback_query(F.data == "adm:broadcast")
async def broadcast_start(call: CallbackQuery, state: FSMContext) -> None:
    await call.answer()
    await state.set_state(AdminForm.broadcast)
    await call.message.answer("Отправьте сообщение для рассылки (текст, фото, видео — что угодно). "
                              "Оно будет скопировано всем пользователям.",
                              reply_markup=kb([btn("✖️ Отмена", "cancel")]))


@router.message(AdminForm.broadcast)
async def broadcast_message(message: Message, state: FSMContext, bot: Bot) -> None:
    await state.clear()
    await message.answer("📣 Рассылка запущена. Отчёт придёт по завершении.")
    asyncio.create_task(run_broadcast(bot, message.chat.id, message.message_id, message.from_user.id))


async def run_broadcast(bot: Bot, from_chat: int, message_id: int, admin_id: int) -> None:
    """Копирует сообщение всем пользователям с соблюдением лимитов Telegram (~25 сообщений/с)."""
    async with async_session() as session:
        ids = (await session.scalars(select(User.id).where(User.is_blocked.is_(False)))).all()
    sent = failed = 0
    for uid in ids:
        for _ in range(3):
            try:
                await bot.copy_message(uid, from_chat, message_id)
                sent += 1
                break
            except TelegramRetryAfter as e:
                await asyncio.sleep(e.retry_after + 1)
            except TelegramForbiddenError:
                await mark_blocked(uid)
                failed += 1
                break
            except Exception as e:  # noqa: BLE001
                log.warning("Рассылка: ошибка для %s: %s", uid, e)
                failed += 1
                break
        await asyncio.sleep(0.04)
    await safe_send(bot, admin_id, f"✅ Рассылка завершена.\nДоставлено: {sent}\nОшибок: {failed}")


# ----------------------------------------------------------------- Выдача Premium


@router.callback_query(F.data == "adm:grant")
async def grant_start(call: CallbackQuery, state: FSMContext) -> None:
    await call.answer()
    await state.set_state(AdminForm.grant)
    await call.message.answer("Введите ID пользователя и количество дней через пробел, например:\n"
                              "<code>123456789 30</code>\n(0 дней — отключить Premium)",
                              reply_markup=kb([btn("✖️ Отмена", "cancel")]))


@router.message(AdminForm.grant, F.text)
async def grant_input(message: Message, state: FSMContext, session: AsyncSession, bot: Bot) -> None:
    parts = message.text.split()
    if len(parts) != 2 or not parts[0].isdigit() or not parts[1].isdigit():
        await message.answer("❌ Формат: <code>ID дни</code>")
        return
    target = await session.get(User, int(parts[0]))
    if not target:
        await message.answer("❌ Пользователь не найден (он должен хотя бы раз запустить бота).")
        return
    days = int(parts[1])
    await state.clear()
    if days == 0:
        target.premium_until = utcnow()
        target.premium_notified_expired = True
        await session.commit()
        await message.answer(f"Premium у {target.id} отключён.")
        return
    grant_premium(target, days=days)
    await session.commit()
    until = fmt_date(target.premium_until)
    await message.answer(f"✅ Premium для {target.id} активен до {until} (UTC).")
    await safe_send(bot, target.id, t(target.lang, "payment_success", date=until))


# ----------------------------------------------------------------- Возврат платежа


@router.message(Command("refund"))
async def cmd_refund(message: Message, command: CommandObject, session: AsyncSession, bot: Bot) -> None:
    charge_id = (command.args or "").strip()
    payment = await session.scalar(select(Payment).where(Payment.charge_id == charge_id)) if charge_id else None
    if not payment:
        await message.answer("Использование: /refund <code>charge_id</code> (ID есть в логах и таблице payments)")
        return
    if payment.refunded:
        await message.answer("Этот платёж уже возвращён.")
        return
    try:
        await bot.refund_star_payment(payment.user_id, payment.charge_id)
    except Exception as e:  # noqa: BLE001
        await message.answer(f"❌ Telegram отклонил возврат: {e}")
        return
    payment.refunded = True
    target = await session.get(User, payment.user_id)
    if target:
        target.premium_until = utcnow()
        target.premium_notified_expired = True
    await session.commit()
    await message.answer(f"✅ Возвращено {payment.amount} ⭐ пользователю {payment.user_id}, Premium отключён.")
