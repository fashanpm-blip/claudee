"""Безопасная отправка сообщений: учитывает блокировку бота, флуд-лимиты и ошибки разметки."""
from __future__ import annotations

import asyncio
import logging

from aiogram import Bot
from aiogram.exceptions import (
    TelegramBadRequest, TelegramForbiddenError, TelegramRetryAfter,
)
from aiogram.types import CallbackQuery, Message
from sqlalchemy import update

from database import async_session
from database.models import User

log = logging.getLogger(__name__)


async def mark_blocked(user_id: int) -> None:
    async with async_session() as session:
        await session.execute(update(User).where(User.id == user_id).values(is_blocked=True))
        await session.commit()


async def safe_send(bot: Bot, chat_id: int, text: str, **kwargs) -> Message | None:
    """Отправляет сообщение; не падает, если пользователь заблокировал бота."""
    for _ in range(3):
        try:
            return await bot.send_message(chat_id, text, **kwargs)
        except TelegramRetryAfter as e:
            await asyncio.sleep(e.retry_after + 1)
        except TelegramForbiddenError:
            await mark_blocked(chat_id)
            return None
        except TelegramBadRequest as e:
            if "parse" in str(e).lower() and kwargs.get("parse_mode") != "":
                # Например, ИИ вернул некорректный HTML — отправляем без разметки
                kwargs["parse_mode"] = None
                continue
            log.warning("Не удалось отправить %s: %s", chat_id, e)
            return None
    return None


async def safe_edit(call: CallbackQuery, text: str, **kwargs) -> None:
    """Редактирует сообщение кнопки; если нельзя — отправляет новое."""
    try:
        await call.message.edit_text(text, **kwargs)
    except TelegramBadRequest as e:
        if "not modified" in str(e):
            return
        await call.message.answer(text, **kwargs)
