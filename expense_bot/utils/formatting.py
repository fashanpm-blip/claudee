"""Форматирование сумм, дат, прогресс-баров и работа с часовыми поясами."""
from __future__ import annotations

import re
from html import escape
from datetime import date, datetime, time, timedelta, timezone
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from utils.i18n import MONTHS

CURRENCY_SYMBOLS = {
    "UAH": "₴", "PLN": "zł", "USD": "$", "EUR": "€", "RUB": "₽", "KZT": "₸",
    "GBP": "£", "CZK": "Kč", "GEL": "₾", "TRY": "₺", "BYN": "Br", "MDL": "L",
    "CHF": "CHF", "JPY": "¥", "CNY": "¥", "CAD": "C$", "AUD": "A$", "INR": "₹",
}

# Список ISO-кодов, которые принимаем при вводе вручную
KNOWN_CURRENCIES = set(CURRENCY_SYMBOLS) | {
    "AED", "AMD", "AZN", "BGN", "BRL", "DKK", "HKD", "HUF", "ILS", "ISK", "KGS",
    "KRW", "MXN", "NOK", "NZD", "RON", "RSD", "SEK", "SGD", "THB", "TJS", "UZS",
    "VND", "ZAR", "EGP", "IDR", "MYR", "PHP", "SAR",
}

MAIN_CURRENCIES = ["UAH", "PLN", "USD", "EUR", "RUB", "KZT", "GBP", "CZK"]

TIMEZONES = [
    "Europe/Kyiv", "Europe/Warsaw", "Europe/Berlin", "Europe/London",
    "Europe/Moscow", "Europe/Minsk", "Asia/Almaty", "Asia/Tbilisi",
    "America/New_York", "America/Los_Angeles",
]


def fmt_num(value: float) -> str:
    """1234.5 -> '1 234.50', 1200 -> '1 200'."""
    value = round(float(value), 2)
    if value == int(value):
        s = f"{int(value):,}"
    else:
        s = f"{value:,.2f}"
    return s.replace(",", " ")


def fmt_money(value: float, currency: str | None) -> str:
    currency = currency or ""
    return f"{fmt_num(value)} {CURRENCY_SYMBOLS.get(currency, currency)}".strip()


def progress_bar(pct: float, length: int = 10) -> str:
    filled = max(0, min(length, round(pct / 100 * length)))
    return "▓" * filled + "░" * (length - filled)


def parse_amount(text: str) -> float | None:
    """Разбирает введённое число: '1 250,50' -> 1250.5. Возвращает None, если не число."""
    if not text:
        return None
    cleaned = text.strip().replace(" ", "").replace(" ", "").replace(",", ".")
    if not re.fullmatch(r"-?\d+(\.\d{1,2})?", cleaned):
        return None
    value = float(cleaned)
    return value if abs(value) < 1e10 else None


def parse_time(text: str) -> str | None:
    """'9:5', '21.00', '0700' -> 'HH:MM'."""
    m = re.fullmatch(r"\s*(\d{1,2})[:.\- ]?(\d{2})\s*", text or "")
    if not m:
        return None
    h, mnt = int(m.group(1)), int(m.group(2))
    if h > 23 or mnt > 59:
        return None
    return f"{h:02d}:{mnt:02d}"


def parse_timezone(text: str) -> str | None:
    """Принимает IANA-имя (Europe/Warsaw) или смещение (+3, -5, UTC+2)."""
    text = (text or "").strip()
    m = re.fullmatch(r"(?:UTC|GMT)?\s*([+-]?)(\d{1,2})(?::00)?", text, re.IGNORECASE)
    if m:
        hours = int(m.group(2))
        if hours > 14:
            return None
        if hours == 0:
            return "UTC"
        sign = "-" if m.group(1) != "-" else "+"  # в Etc/GMT знак инвертирован
        return f"Etc/GMT{sign}{hours}"
    try:
        ZoneInfo(text)
        return text
    except (ZoneInfoNotFoundError, ValueError):
        return None


def get_tz(name: str | None) -> ZoneInfo:
    try:
        return ZoneInfo(name or "UTC")
    except (ZoneInfoNotFoundError, ValueError):
        return ZoneInfo("UTC")


def local_now(tz_name: str | None) -> datetime:
    return datetime.now(get_tz(tz_name))


def local_today(tz_name: str | None) -> date:
    return local_now(tz_name).date()


def to_utc_naive(dt: datetime) -> datetime:
    return dt.astimezone(timezone.utc).replace(tzinfo=None)


def utc_to_local(dt: datetime, tz_name: str | None) -> datetime:
    return dt.replace(tzinfo=timezone.utc).astimezone(get_tz(tz_name))


def day_start_utc(day: date, tz_name: str | None) -> datetime:
    return to_utc_naive(datetime.combine(day, time.min, tzinfo=get_tz(tz_name)))


def period_range(period: str, tz_name: str | None, offset: int = 0) -> tuple[datetime, datetime]:
    """Границы периода (today/week/month) в UTC. offset=-1 — предыдущий период."""
    today = local_today(tz_name)
    if period == "today":
        start = today + timedelta(days=offset)
        end = start + timedelta(days=1)
    elif period == "week":
        start = today - timedelta(days=today.weekday()) + timedelta(weeks=offset)
        end = start + timedelta(weeks=1)
    else:  # month
        year, month = today.year, today.month + offset
        while month < 1:
            month += 12
            year -= 1
        start = date(year, month, 1)
        end = date(year + (month == 12), month % 12 + 1, 1)
    return day_start_utc(start, tz_name), day_start_utc(end, tz_name)


def month_name(lang: str, month: int) -> str:
    return MONTHS.get(lang, MONTHS["ru"])[month - 1]


def fmt_date(d: date | datetime) -> str:
    return d.strftime("%d.%m.%Y")


def esc(text: str | None) -> str:
    """Экранирует пользовательский текст для HTML-разметки Telegram."""
    return escape(text or "", quote=False)
