"""Еженедельный отчёт и экспорт данных."""
from __future__ import annotations

import asyncio
import csv
import io
from datetime import timedelta

from openpyxl import Workbook
from openpyxl.styles import Font
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database.models import Category, Expense, User, utcnow
from services import ai
from services.core import category_label, ledger_currency, totals_by_category
from utils.formatting import fmt_money, utc_to_local
from utils.i18n import t

async def weekly_stats(session: AsyncSession, user: User) -> dict | None:
    """Статистика за последние 7 дней и предыдущие 7 дней — основа отчёта."""
    now = utcnow()
    cur_start, prev_start = now - timedelta(days=7), now - timedelta(days=14)
    cur = await totals_by_category(session, user.ledger_id, cur_start, now)
    if not cur:
        return None
    prev = await totals_by_category(session, user.ledger_id, prev_start, cur_start)
    base = await ledger_currency(session, user)

    rows = (await session.execute(
        select(Expense.amount_base, Expense.comment, Category)
        .join(Category, Category.id == Expense.category_id)
        .where(Expense.ledger_id == user.ledger_id, Expense.created_at >= cur_start)
        .order_by(Expense.amount_base.desc())
    )).all()
    return {
        "currency": base,
        "this_week_total": round(sum(v for _, v in cur), 2),
        "previous_week_total": round(sum(v for _, v in prev), 2),
        "this_week_by_category": {category_label(c, user.lang, False): round(v, 2) for c, v in cur},
        "previous_week_by_category": {category_label(c, user.lang, False): round(v, 2) for c, v in prev},
        "expenses_count": len(rows),
        "largest_expenses": [
            {"amount": round(a, 2), "category": category_label(c, user.lang, False), "comment": cm or ""}
            for a, cm, c in rows[:10]
        ],
        "_raw": {"cur": cur, "prev": prev, "amounts": [a for a, _, _ in rows]},
    }


def basic_report(stats: dict, lang: str) -> str:
    """Отчёт без ИИ — на случай, если Claude не подключён или недоступен."""
    base = stats["currency"]
    cur = stats["_raw"]["cur"]
    total, prev_total = stats["this_week_total"], stats["previous_week_total"]
    top_cat, top_value = cur[0]
    if prev_total > 0:
        diff = (total - prev_total) / prev_total * 100
        key = "compare_more" if diff >= 0 else "compare_less"
        compare = t(lang, key, pct=abs(round(diff)), prev=fmt_money(prev_total, base))
    else:
        compare = t(lang, "compare_none")

    tips = [t(lang, "tip_top", cat=category_label(top_cat, lang, False))]
    amounts = stats["_raw"]["amounts"]
    if amounts:
        limit = max(sorted(amounts)[len(amounts) // 2], 1)  # медиана — граница «мелочей»
        small = [a for a in amounts if a <= limit]
        if len(small) >= 5:
            tips.append(t(lang, "tip_small", count=len(small), limit=fmt_money(limit, base),
                          sum=fmt_money(sum(small), base)))
    if any(c.key == "subs" for c, _ in cur):
        tips.append(t(lang, "tip_subs"))
    tips.append(t(lang, "tip_generic"))

    return t(lang, "weekly_basic", total=fmt_money(total, base),
             top=category_label(top_cat, lang), top_amount=fmt_money(top_value, base),
             top_pct=round(top_value / total * 100) if total else 0, compare=compare,
             tips="\n".join(tips))


async def build_weekly_report(session: AsyncSession, user: User) -> str:
    stats = await weekly_stats(session, user)
    title = t(user.lang, "weekly_title")
    if not stats:
        return f"{title}\n\n{t(user.lang, 'weekly_empty')}"
    public = {k: v for k, v in stats.items() if not k.startswith("_")}
    text = await ai.weekly_analysis(public, user.lang) if ai.is_available() else None
    return f"{title}\n\n{text or basic_report(stats, user.lang)}"


# ----------------------------------------------------------------- Экспорт


async def export_rows(session: AsyncSession, user: User) -> list[list]:
    base = await ledger_currency(session, user)
    result = await session.execute(
        select(Expense, Category, User)
        .join(Category, Category.id == Expense.category_id)
        .join(User, User.id == Expense.user_id)
        .where(Expense.ledger_id == user.ledger_id)
        .order_by(Expense.created_at)
    )
    rows = []
    for exp, cat, author in result.all():
        rows.append([
            utc_to_local(exp.created_at, user.timezone).strftime("%Y-%m-%d %H:%M"),
            round(exp.amount, 2), exp.currency, round(exp.amount_base, 2), base,
            category_label(cat, user.lang, False), exp.comment or "",
            author.username or author.first_name or str(author.id), exp.source,
        ])
    return rows


HEADERS = {
    "ru": ["Дата", "Сумма", "Валюта", "Сумма в основной валюте", "Основная валюта", "Категория",
           "Комментарий", "Автор", "Источник"],
    "uk": ["Дата", "Сума", "Валюта", "Сума в основній валюті", "Основна валюта", "Категорія",
           "Коментар", "Автор", "Джерело"],
    "en": ["Date", "Amount", "Currency", "Amount in main currency", "Main currency", "Category",
           "Comment", "Author", "Source"],
}


def to_csv(rows: list[list], lang: str) -> bytes:
    buf = io.StringIO()
    writer = csv.writer(buf, delimiter=";")
    writer.writerow(HEADERS.get(lang, HEADERS["en"]))
    writer.writerows(rows)
    return buf.getvalue().encode("utf-8-sig")  # BOM — чтобы Excel открыл кириллицу правильно


def _to_xlsx(rows: list[list], lang: str) -> bytes:
    wb = Workbook()
    ws = wb.active
    ws.title = "Expenses"
    ws.append(HEADERS.get(lang, HEADERS["en"]))
    for cell in ws[1]:
        cell.font = Font(bold=True)
    for row in rows:
        ws.append(row)
    for col, width in zip("ABCDEFGHI", (17, 12, 9, 14, 10, 18, 40, 16, 10)):
        ws.column_dimensions[col].width = width
    ws.freeze_panes = "A2"
    buf = io.BytesIO()
    wb.save(buf)
    return buf.getvalue()


async def to_xlsx(rows: list[list], lang: str) -> bytes:
    return await asyncio.to_thread(_to_xlsx, rows, lang)
