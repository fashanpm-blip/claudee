"""Бизнес-логика: пользователи, Premium, категории, траты, бюджеты, привычки."""
from __future__ import annotations

import secrets
from dataclasses import dataclass
from datetime import date, datetime, timedelta

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from config import config
from database.models import (
    Budget, Category, Expense, Habit, HabitLog, User, utcnow,
)
from services.currency import convert
from utils.formatting import (
    fmt_money, local_today, period_range, progress_bar,
)
from utils.i18n import t

# ----------------------------------------------------------------- Пользователи / Premium


async def get_user(session: AsyncSession, user_id: int) -> User | None:
    return await session.get(User, user_id)


def grant_premium(user: User, days: int | None = None, until: datetime | None = None) -> None:
    """Продлевает Premium на N дней (от текущей даты окончания, если она в будущем)
    или устанавливает конкретную дату окончания."""
    now = utcnow()
    if until is None:
        base = user.premium_until if user.premium_until and user.premium_until > now else now
        until = base + timedelta(days=days or 30)
    elif user.premium_until and user.premium_until > until:
        until = user.premium_until  # не укорачиваем уже оплаченный срок
    user.premium_until = until
    user.premium_notified_expired = False


def start_trial(user: User) -> bool:
    if user.trial_used:
        return False
    grant_premium(user, days=config.trial_days)
    user.trial_used = True
    return True


async def ledger_currency(session: AsyncSession, user: User) -> str:
    """Основная валюта бюджета (для общего бюджета — валюта владельца)."""
    if user.family_owner_id:
        owner = await session.get(User, user.family_owner_id)
        if owner and owner.currency:
            return owner.currency
    return user.currency or "USD"


def new_invite_code() -> str:
    return secrets.token_urlsafe(9)


# ----------------------------------------------------------------- Категории


def category_label(cat: Category | None, lang: str, with_emoji: bool = True) -> str:
    if cat is None:
        return "—"
    name = t(lang, f"cat_{cat.key}") if cat.key else (cat.name or "?")
    return f"{cat.emoji} {name}" if with_emoji else name


async def list_categories(session: AsyncSession, ledger_id: int) -> list[Category]:
    """Стандартные + свои активные категории бюджета."""
    result = await session.scalars(
        select(Category)
        .where(Category.is_active.is_(True),
               or_(Category.ledger_id.is_(None), Category.ledger_id == ledger_id))
        .order_by(Category.ledger_id.is_not(None), Category.id)
    )
    cats = list(result)
    # «Другое» всегда в конце списка
    cats.sort(key=lambda c: (c.key == "other", c.ledger_id is not None, c.id))
    return cats


async def custom_categories(session: AsyncSession, ledger_id: int) -> list[Category]:
    result = await session.scalars(
        select(Category).where(Category.ledger_id == ledger_id, Category.is_active.is_(True))
    )
    return list(result)


async def category_by_key(session: AsyncSession, key: str) -> Category | None:
    return await session.scalar(
        select(Category).where(Category.ledger_id.is_(None), Category.key == key)
    )


async def get_category(session: AsyncSession, cat_id: int, ledger_id: int) -> Category | None:
    cat = await session.get(Category, cat_id)
    if cat and (cat.ledger_id is None or cat.ledger_id == ledger_id):
        return cat
    return None


async def match_custom_category(session: AsyncSession, ledger_id: int, text: str) -> Category | None:
    """Ищет свою категорию, название которой встречается в тексте."""
    text = text.lower()
    for cat in await custom_categories(session, ledger_id):
        if cat.name and cat.name.lower() in text:
            return cat
    return None


def is_category_word(text: str) -> bool:
    """Текст совпадает с названием стандартной категории на любом языке («еда», «food»)."""
    from utils.i18n import TEXTS  # локальный импорт, чтобы не было циклов

    low = text.strip().lower()
    return any(low == v.lower() for lang in TEXTS.values()
               for k, v in lang.items() if k.startswith("cat_"))


# ----------------------------------------------------------------- Траты


@dataclass
class AddResult:
    expense: Expense
    base_currency: str
    alerts: list[tuple[int, dict]]  # (кому отправить, данные уведомления о бюджете)


async def add_expense(
    session: AsyncSession, user: User, amount: float, currency: str | None,
    category_id: int, comment: str | None, source: str = "text",
) -> AddResult:
    base = await ledger_currency(session, user)
    currency = currency or base
    amount_base = await convert(amount, currency, base)
    if amount_base is None:  # неизвестная валюта — считаем, что это основная
        currency, amount_base = base, amount
    expense = Expense(
        ledger_id=user.ledger_id, user_id=user.id, amount=amount, currency=currency,
        amount_base=amount_base, category_id=category_id,
        comment=(comment or None) and comment[:255], source=source,
    )
    session.add(expense)
    await session.flush()
    alerts = await check_budget(session, user, category_id, base)
    await session.commit()
    return AddResult(expense, base, alerts)


async def check_budget(session: AsyncSession, user: User, category_id: int,
                       base: str) -> list[tuple[int, dict]]:
    """Проверяет месячный бюджет категории; возвращает уведомления (кому, данные)."""
    budget = await session.scalar(
        select(Budget).where(Budget.ledger_id == user.ledger_id, Budget.category_id == category_id)
    )
    if not budget or budget.limit <= 0:
        return []
    start, end = period_range("month", user.timezone)
    spent = await session.scalar(
        select(func.coalesce(func.sum(Expense.amount_base), 0)).where(
            Expense.ledger_id == user.ledger_id, Expense.category_id == category_id,
            Expense.created_at >= start, Expense.created_at < end,
        )
    ) or 0
    month_key = local_today(user.timezone).strftime("%Y-%m")
    if budget.notified_month != month_key:
        budget.notified_month, budget.notified_level = month_key, 0
    pct = spent / budget.limit * 100
    level = 100 if pct >= 100 else 80 if pct >= 80 else 0
    if level <= budget.notified_level:
        return []
    budget.notified_level = level
    cat = await session.get(Category, category_id)
    payload = {
        "key": f"budget_warn_{level}", "pct": round(pct), "cat": cat,
        "spent": fmt_money(spent, base), "limit": fmt_money(budget.limit, base),
    }
    recipients = {user.id, user.ledger_id}
    return [(uid, payload) for uid in recipients]


async def get_expense_for_edit(session: AsyncSession, user: User, exp_id: int) -> Expense | None:
    """Трата, которую пользователь может менять: своя или любая в своём общем бюджете (для владельца)."""
    exp = await session.get(Expense, exp_id)
    if not exp or exp.ledger_id != user.ledger_id:
        return None
    if exp.user_id != user.id and user.id != exp.ledger_id:
        return None
    return exp


async def recalc_base(session: AsyncSession, exp: Expense, base: str) -> None:
    value = await convert(exp.amount, exp.currency, base)
    exp.amount_base = value if value is not None else exp.amount


async def totals_by_category(session: AsyncSession, ledger_id: int, start: datetime,
                             end: datetime) -> list[tuple[Category, float]]:
    rows = await session.execute(
        select(Category, func.sum(Expense.amount_base))
        .join(Expense, Expense.category_id == Category.id)
        .where(Expense.ledger_id == ledger_id, Expense.created_at >= start, Expense.created_at < end)
        .group_by(Category.id)
        .order_by(func.sum(Expense.amount_base).desc())
    )
    return [(cat, float(total or 0)) for cat, total in rows.all()]


async def daily_totals(session: AsyncSession, user: User, period: str) -> list[tuple[date, float]]:
    """Суммы по дням (по местному времени пользователя) за период."""
    from utils.formatting import utc_to_local

    start, end = period_range(period, user.timezone)
    rows = await session.execute(
        select(Expense.created_at, Expense.amount_base)
        .where(Expense.ledger_id == user.ledger_id, Expense.created_at >= start,
               Expense.created_at < end)
    )
    by_day: dict[date, float] = {}
    for created, amount in rows.all():
        d = utc_to_local(created, user.timezone).date()
        by_day[d] = by_day.get(d, 0) + amount
    first = utc_to_local(start, user.timezone).date()
    last = min(utc_to_local(end, user.timezone).date() - timedelta(days=1), local_today(user.timezone))
    days, d = [], first
    while d <= last:
        days.append((d, round(by_day.get(d, 0), 2)))
        d += timedelta(days=1)
    return days


async def recent_expenses(session: AsyncSession, user: User, limit: int = 8) -> list[Expense]:
    q = select(Expense).where(Expense.ledger_id == user.ledger_id)
    if user.ledger_id != user.id:  # участник общего бюджета видит для правки только свои
        q = q.where(Expense.user_id == user.id)
    result = await session.scalars(q.order_by(Expense.created_at.desc()).limit(limit))
    return list(result)


async def month_spent(session: AsyncSession, user: User, category_id: int) -> float:
    start, end = period_range("month", user.timezone)
    return float(await session.scalar(
        select(func.coalesce(func.sum(Expense.amount_base), 0)).where(
            Expense.ledger_id == user.ledger_id, Expense.category_id == category_id,
            Expense.created_at >= start, Expense.created_at < end,
        )
    ) or 0)


def budget_line(lang: str, cat: Category, spent: float, limit: float, cur: str) -> str:
    pct = spent / limit * 100 if limit else 0
    mark = "🚨 " if pct >= 100 else "⚠️ " if pct >= 80 else ""
    return mark + t(lang, "budget_line", category=category_label(cat, lang),
                    spent=fmt_money(spent, cur), limit=fmt_money(limit, cur),
                    bar=progress_bar(pct), pct=round(pct))


# ----------------------------------------------------------------- Привычки

KEEP = ("done", "frozen")  # статусы, которые не прерывают серию


async def habit_logs(session: AsyncSession, habit_id: int) -> dict[date, str]:
    rows = await session.execute(
        select(HabitLog.day, HabitLog.status).where(HabitLog.habit_id == habit_id)
    )
    return {d: s for d, s in rows.all()}


def calc_streak(logs: dict[date, str], today: date) -> int:
    """Серия: сколько дней подряд выполнено (заморозка не прерывает серию).
    Если сегодня ещё не отмечено — считаем со вчерашнего дня."""
    d = today if today in logs else today - timedelta(days=1)
    streak = 0
    while logs.get(d) in KEEP:
        if logs[d] == "done":
            streak += 1
        d -= timedelta(days=1)
    return streak


def calc_best(logs: dict[date, str]) -> int:
    """Рекордная серия за всё время."""
    best = cur = 0
    prev: date | None = None
    for d in sorted(logs):
        if logs[d] not in KEEP:
            cur, prev = 0, None
            continue
        if prev is None or d - prev != timedelta(days=1):
            cur = 0
        cur += logs[d] == "done"
        prev = d
        best = max(best, cur)
    return best


async def habit_streak(session: AsyncSession, habit: Habit, tz: str) -> int:
    return calc_streak(await habit_logs(session, habit.id), local_today(tz))


async def set_habit_status(session: AsyncSession, habit: Habit, day: date, status: str) -> bool:
    """Записывает отметку за день. False — если за этот день уже есть отметка."""
    existing = await session.scalar(
        select(HabitLog).where(HabitLog.habit_id == habit.id, HabitLog.day == day)
    )
    if existing:
        return False
    session.add(HabitLog(habit_id=habit.id, day=day, status=status))
    await session.commit()
    return True


async def freezes_left(session: AsyncSession, user: User) -> int:
    today = local_today(user.timezone)
    month_start = today.replace(day=1)
    used = await session.scalar(
        select(func.count(HabitLog.id)).join(Habit, Habit.id == HabitLog.habit_id)
        .where(Habit.user_id == user.id, HabitLog.status == "frozen", HabitLog.day >= month_start)
    ) or 0
    return max(0, config.freezes_per_month - used)


async def active_habits(session: AsyncSession, user_id: int) -> list[Habit]:
    result = await session.scalars(
        select(Habit).where(Habit.user_id == user_id, Habit.is_active.is_(True)).order_by(Habit.id)
    )
    return list(result)

