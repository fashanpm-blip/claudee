"""Общий бюджет: приглашения и участники."""
from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from config import config
from database.models import User


async def members(session: AsyncSession, owner_id: int) -> list[User]:
    result = await session.scalars(select(User).where(User.family_owner_id == owner_id))
    return list(result)


def display_name(u: User) -> str:
    return f"@{u.username}" if u.username else (u.first_name or str(u.id))


async def join(session: AsyncSession, user: User, code: str) -> tuple[str, User | None]:
    """Присоединяет пользователя к общему бюджету по коду.
    Возвращает (ключ перевода результата, владелец)."""
    owner = await session.scalar(select(User).where(User.invite_code == code))
    if not owner:
        return "family_bad_link", None
    if owner.id == user.id:
        return "family_self", None
    if user.family_owner_id == owner.id:
        return "family_joined", owner
    if user.family_owner_id:
        return "family_already", None
    if owner.family_owner_id:  # владелец сам участник чужого бюджета
        return "family_bad_link", None
    count = await session.scalar(select(func.count(User.id)).where(User.family_owner_id == user.id))
    if count:
        return "family_has_members", None
    if not owner.is_premium:
        return "family_owner_no_premium", None
    total = await session.scalar(select(func.count(User.id)).where(User.family_owner_id == owner.id))
    if total >= config.family_members_limit:
        return "family_full", None
    user.family_owner_id = owner.id
    await session.commit()
    return "family_joined", owner
