"""ORM-модели. Используются только переносимые типы, поэтому
переход на PostgreSQL — это просто смена DATABASE_URL."""
from __future__ import annotations

from datetime import date, datetime, timezone

from sqlalchemy import (
    BigInteger, Boolean, Date, DateTime, Float, ForeignKey, Integer, String,
    UniqueConstraint,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


def utcnow() -> datetime:
    """Текущее время в UTC без tzinfo (так одинаково работает SQLite и PostgreSQL)."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)  # Telegram ID
    username: Mapped[str | None] = mapped_column(String(64))
    first_name: Mapped[str | None] = mapped_column(String(128))
    lang: Mapped[str] = mapped_column(String(2), default="ru")
    currency: Mapped[str | None] = mapped_column(String(3))  # основная валюта
    timezone: Mapped[str] = mapped_column(String(64), default="Europe/Kyiv")
    registered: Mapped[bool] = mapped_column(Boolean, default=False)  # прошёл онбординг
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    premium_until: Mapped[datetime | None] = mapped_column(DateTime)
    trial_used: Mapped[bool] = mapped_column(Boolean, default=False)
    premium_notified_expired: Mapped[bool] = mapped_column(Boolean, default=True)

    # Общий бюджет: если задан — пользователь ведёт траты в бюджете владельца
    family_owner_id: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("users.id"))
    invite_code: Mapped[str | None] = mapped_column(String(32), unique=True)

    weekly_report: Mapped[bool] = mapped_column(Boolean, default=True)
    is_blocked: Mapped[bool] = mapped_column(Boolean, default=False)  # заблокировал бота

    @property
    def is_premium(self) -> bool:
        return self.premium_until is not None and self.premium_until > utcnow()

    @property
    def ledger_id(self) -> int:
        """ID «кошелька», в который пишутся траты (свой или общий)."""
        return self.family_owner_id or self.id


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    ledger_id: Mapped[int | None] = mapped_column(BigInteger, index=True)  # None = стандартная
    key: Mapped[str | None] = mapped_column(String(32))  # ключ стандартной категории
    name: Mapped[str | None] = mapped_column(String(64))  # имя своей категории
    emoji: Mapped[str] = mapped_column(String(16), default="📦")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class Expense(Base):
    __tablename__ = "expenses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    ledger_id: Mapped[int] = mapped_column(BigInteger, index=True)
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id"), index=True)
    amount: Mapped[float] = mapped_column(Float)  # сумма в исходной валюте
    currency: Mapped[str] = mapped_column(String(3))
    amount_base: Mapped[float] = mapped_column(Float)  # сумма в основной валюте бюджета
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))
    comment: Mapped[str | None] = mapped_column(String(255))
    source: Mapped[str] = mapped_column(String(16), default="text")  # text/manual/voice/receipt
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, index=True)


class Habit(Base):
    __tablename__ = "habits"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id"), index=True)
    name: Mapped[str] = mapped_column(String(64))
    remind_time: Mapped[str | None] = mapped_column(String(5))  # "HH:MM" по местному времени
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)


class HabitLog(Base):
    __tablename__ = "habit_logs"
    __table_args__ = (UniqueConstraint("habit_id", "day"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    habit_id: Mapped[int] = mapped_column(ForeignKey("habits.id", ondelete="CASCADE"), index=True)
    day: Mapped[date] = mapped_column(Date)  # локальная дата пользователя
    status: Mapped[str] = mapped_column(String(8))  # done / skip / frozen


class Budget(Base):
    __tablename__ = "budgets"
    __table_args__ = (UniqueConstraint("ledger_id", "category_id"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    ledger_id: Mapped[int] = mapped_column(BigInteger, index=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))
    limit: Mapped[float] = mapped_column(Float)
    notified_month: Mapped[str | None] = mapped_column(String(7))  # "2026-10"
    notified_level: Mapped[int] = mapped_column(Integer, default=0)  # 0 / 80 / 100


class Goal(Base):
    __tablename__ = "goals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id"), index=True)
    name: Mapped[str] = mapped_column(String(64))
    target: Mapped[float] = mapped_column(Float)
    saved: Mapped[float] = mapped_column(Float, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id"), index=True)
    amount: Mapped[int] = mapped_column(Integer)  # в Stars
    currency: Mapped[str] = mapped_column(String(8), default="XTR")
    charge_id: Mapped[str] = mapped_column(String(128), unique=True)
    is_recurring: Mapped[bool] = mapped_column(Boolean, default=False)
    refunded: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
