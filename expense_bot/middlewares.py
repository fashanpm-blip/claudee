"""Middleware: сессия БД и пользователь для каждого апдейта."""
from __future__ import annotations

from typing import Any, Awaitable, Callable

from aiogram import BaseMiddleware
from aiogram.types import TelegramObject
from aiogram.types import User as TgUser

from config import config
from database import async_session
from database.models import User


class DbUserMiddleware(BaseMiddleware):
    async def __call__(
        self,
        handler: Callable[[TelegramObject, dict[str, Any]], Awaitable[Any]],
        event: TelegramObject,
        data: dict[str, Any],
    ) -> Any:
        tg_user: TgUser | None = data.get("event_from_user")
        async with async_session() as session:
            data["session"] = session
            user = None
            if tg_user and not tg_user.is_bot:
                user = await session.get(User, tg_user.id)
                if user is None:
                    lang = (tg_user.language_code or "ru")[:2]
                    user = User(
                        id=tg_user.id, username=tg_user.username, first_name=tg_user.first_name,
                        lang=lang if lang in ("ru", "uk", "en") else "ru",
                        timezone=config.default_timezone,
                    )
                    session.add(user)
                    await session.commit()
                elif user.username != tg_user.username or user.is_blocked:
                    user.username = tg_user.username
                    user.first_name = tg_user.first_name
                    user.is_blocked = False
                    await session.commit()
            data["user"] = user
            data["lang"] = user.lang if user else "ru"
            return await handler(event, data)
