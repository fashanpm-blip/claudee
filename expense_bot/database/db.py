"""Подключение к БД и инициализация."""
from __future__ import annotations

import os

from sqlalchemy import select
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from config import config

from .models import Base, Category

# Стандартные категории: ключ -> эмодзи (названия берутся из переводов)
DEFAULT_CATEGORIES: dict[str, str] = {
    "food": "🍔",
    "transport": "🚕",
    "fun": "🎉",
    "shopping": "🛍",
    "health": "💊",
    "subs": "🔁",
    "other": "📦",
}

if config.database_url.startswith("sqlite"):
    # Создаём папку для файла SQLite, если её нет
    path = config.database_url.split(":///", 1)[-1]
    if os.path.dirname(path):
        os.makedirs(os.path.dirname(path), exist_ok=True)

engine = create_async_engine(config.database_url, echo=False, pool_pre_ping=True)
async_session = async_sessionmaker(engine, expire_on_commit=False)


async def init_db() -> None:
    """Создаёт таблицы и стандартные категории."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        existing = set(
            (await session.scalars(select(Category.key).where(Category.ledger_id.is_(None)))).all()
        )
        for key, emoji in DEFAULT_CATEGORIES.items():
            if key not in existing:
                session.add(Category(ledger_id=None, key=key, emoji=emoji))
        await session.commit()
