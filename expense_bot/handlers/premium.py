"""Premium-подписка через Telegram Stars (XTR)."""
from __future__ import annotations

import logging
from datetime import datetime, timezone

from aiogram import Bot, F, Router
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.types import (
    CallbackQuery, InlineKeyboardButton, InlineKeyboardMarkup, LabeledPrice, Message,
    PreCheckoutQuery,
)
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from config import config
from database.models import Payment, User
from services.core import grant_premium
from utils.formatting import fmt_date, utc_to_local
from utils.i18n import all_variants, t

router = Router(name="premium")
log = logging.getLogger(__name__)

PAYLOAD_PREFIX = "premium_sub"


async def premium_text_and_kb(bot: Bot, user: User) -> tuple[str, InlineKeyboardMarkup | None]:
    if user.is_premium:
        status = t(user.lang, "premium_active",
                   date=fmt_date(utc_to_local(user.premium_until, user.timezone)))
    else:
        status = t(user.lang, "premium_inactive")
    text = t(user.lang, "premium_info", stars=config.premium_price_stars, status=status)

    # Ссылка на подписку: Telegram сам будет списывать Stars каждые 30 дней
    try:
        link = await bot.create_invoice_link(
            title=t(user.lang, "invoice_title"),
            description=t(user.lang, "invoice_desc"),
            payload=f"{PAYLOAD_PREFIX}:{user.id}",
            currency="XTR",
            prices=[LabeledPrice(label="Premium", amount=config.premium_price_stars)],
            subscription_period=config.subscription_period,
        )
    except Exception as e:  # noqa: BLE001
        log.error("Не удалось создать ссылку на оплату: %s", e)
        return text, None
    markup = InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(
        text=t(user.lang, "btn_buy", stars=config.premium_price_stars), url=link)]])
    return text, markup


@router.message(Command("premium"))
@router.message(F.text.in_(all_variants("btn_premium")))
async def cmd_premium(message: Message, state: FSMContext, user: User, bot: Bot) -> None:
    await state.clear()
    text, markup = await premium_text_and_kb(bot, user)
    await message.answer(text, reply_markup=markup)


@router.callback_query(F.data == "premium")
async def cb_premium(call: CallbackQuery, user: User, bot: Bot) -> None:
    await call.answer()
    text, markup = await premium_text_and_kb(bot, user)
    await call.message.answer(text, reply_markup=markup)


@router.message(Command("paysupport"))
async def cmd_paysupport(message: Message, user: User) -> None:
    contact = f": {config.support_contact}" if config.support_contact else ""
    await message.answer(t(user.lang, "paysupport", contact=contact))


@router.pre_checkout_query()
async def pre_checkout(query: PreCheckoutQuery) -> None:
    """Telegram ждёт ответа в течение 10 секунд — проверяем быстро."""
    ok = (query.currency == "XTR" and query.invoice_payload.startswith(PAYLOAD_PREFIX)
          and query.total_amount == config.premium_price_stars)
    if ok:
        await query.answer(ok=True)
    else:
        await query.answer(ok=False, error_message="Invoice is outdated, please open /premium again.")


@router.message(F.successful_payment)
async def successful_payment(message: Message, session: AsyncSession, user: User) -> None:
    sp = message.successful_payment
    # Повторная доставка одного и того же платежа не должна продлевать подписку дважды
    exists = await session.scalar(
        select(Payment).where(Payment.charge_id == sp.telegram_payment_charge_id)
    )
    if not exists:
        session.add(Payment(
            user_id=user.id, amount=sp.total_amount, currency=sp.currency,
            charge_id=sp.telegram_payment_charge_id, is_recurring=bool(sp.is_recurring),
        ))
        if sp.subscription_expiration_date:
            until = datetime.fromtimestamp(sp.subscription_expiration_date, tz=timezone.utc)
            grant_premium(user, until=until.replace(tzinfo=None))
        else:
            grant_premium(user, days=30)
        await session.commit()
        log.info("Оплата Premium: user=%s amount=%s recurring=%s", user.id, sp.total_amount,
                 sp.is_recurring)
    await message.answer(t(user.lang, "payment_success",
                           date=fmt_date(utc_to_local(user.premium_until, user.timezone))))
