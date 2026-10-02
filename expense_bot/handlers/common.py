"""Защита от незарегистрированных пользователей и глобальный обработчик ошибок."""
from __future__ import annotations

import logging

from aiogram import Router
from aiogram.filters import Filter
from aiogram.fsm.context import FSMContext
from aiogram.types import CallbackQuery, ErrorEvent, Message, TelegramObject

from database.models import User
from keyboards import lang_kb
from utils.i18n import t
from utils.states import Onboarding

log = logging.getLogger(__name__)

guard_router = Router(name="guard")
errors_router = Router(name="errors")


class NotRegistered(Filter):
    async def __call__(self, event: TelegramObject, user: User | None = None) -> bool:
        return user is None or not user.registered


@guard_router.message(NotRegistered())
async def guard_message(message: Message, state: FSMContext, user: User | None) -> None:
    # Пока онбординг не пройден — сначала выбор языка
    await state.set_state(Onboarding.lang)
    await message.answer(t(user.lang if user else "ru", "choose_lang"), reply_markup=lang_kb("lang"))


@guard_router.callback_query(NotRegistered())
async def guard_callback(call: CallbackQuery, state: FSMContext, user: User | None) -> None:
    await call.answer()
    await state.set_state(Onboarding.lang)
    await call.message.answer(t(user.lang if user else "ru", "choose_lang"), reply_markup=lang_kb("lang"))


@errors_router.errors()
async def on_error(event: ErrorEvent) -> bool:
    """Логируем ошибку и вежливо сообщаем пользователю — бот продолжает работать."""
    log.exception("Ошибка при обработке апдейта: %s", event.exception, exc_info=event.exception)
    update = event.update
    event_obj = update.message or update.callback_query
    code = (getattr(getattr(event_obj, "from_user", None), "language_code", None) or "ru")[:2]
    lang = code if code in ("ru", "uk", "en") else "ru"
    try:
        if update.message:
            await update.message.answer(t(lang, "error"))
        elif update.callback_query:
            await update.callback_query.answer(t(lang, "error"), show_alert=True)
    except Exception:  # noqa: BLE001 — не даём ошибке в обработчике ошибок уронить бота
        pass
    return True
