"""Курсы валют и конвертация. Источник — бесплатный API open.er-api.com,
курсы кешируются на 6 часов. Если API недоступен — используются примерные курсы."""
from __future__ import annotations

import logging
import time

import aiohttp

log = logging.getLogger(__name__)

RATES_URL = "https://open.er-api.com/v6/latest/USD"
CACHE_TTL = 6 * 3600
RETRY_AFTER_FAIL = 600  # при ошибке API не стучимся повторно 10 минут

# Запасные курсы (единиц валюты за 1 USD) — на случай недоступности API
FALLBACK_RATES = {
    "USD": 1.0, "EUR": 0.92, "UAH": 41.5, "PLN": 3.95, "RUB": 92.0, "KZT": 480.0,
    "GBP": 0.79, "CZK": 23.0, "GEL": 2.7, "TRY": 34.0, "BYN": 3.3, "MDL": 17.8,
    "CHF": 0.88, "JPY": 150.0, "CNY": 7.2, "CAD": 1.37, "AUD": 1.5, "INR": 84.0,
}

_cache: dict = {"rates": None, "ts": 0.0}


async def get_rates() -> dict[str, float]:
    if _cache["rates"] and time.time() - _cache["ts"] < CACHE_TTL:
        return _cache["rates"]
    try:
        timeout = aiohttp.ClientTimeout(total=10)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(RATES_URL) as resp:
                data = await resp.json(content_type=None)
        if data.get("result") == "success" and data.get("rates"):
            _cache.update(rates=data["rates"], ts=time.time())
            return data["rates"]
    except Exception as e:  # noqa: BLE001 — сеть может упасть как угодно
        log.warning("Не удалось получить курсы валют: %s", e)
    rates = _cache["rates"] or FALLBACK_RATES
    _cache.update(rates=rates, ts=time.time() - CACHE_TTL + RETRY_AFTER_FAIL)
    return rates


async def convert(amount: float, from_cur: str, to_cur: str) -> float | None:
    """Конвертирует сумму. None — если валюта неизвестна."""
    if from_cur == to_cur:
        return amount
    rates = await get_rates()
    if from_cur not in rates or to_cur not in rates:
        return None
    return round(amount / rates[from_cur] * rates[to_cur], 2)
