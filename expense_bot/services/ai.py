"""ИИ-функции на базе Claude: распознавание чеков, разбор фраз, недельный анализ.
Если ANTHROPIC_API_KEY не задан — функции возвращают None, а бот использует
встроенные (не-ИИ) алгоритмы там, где это возможно."""
from __future__ import annotations

import base64
import json
import logging

import anthropic

from config import config

log = logging.getLogger(__name__)

_client: anthropic.AsyncAnthropic | None = (
    anthropic.AsyncAnthropic(api_key=config.anthropic_api_key, timeout=90, max_retries=2)
    if config.anthropic_api_key
    else None
)

CATEGORY_KEYS = ["food", "transport", "fun", "shopping", "health", "subs", "other"]

# Схема ответа для чеков и голосовых фраз — Claude обязан вернуть ровно такой JSON
EXPENSE_SCHEMA = {
    "type": "object",
    "properties": {
        "found": {"type": "boolean", "description": "Удалось ли найти сумму"},
        "amount": {"type": "number", "description": "Итоговая сумма к оплате"},
        "currency": {"type": "string", "description": "ISO-код валюты (UAH, PLN...) или пустая строка"},
        "category": {"type": "string", "enum": CATEGORY_KEYS},
        "comment": {"type": "string", "description": "Короткое описание: магазин или что куплено"},
    },
    "required": ["found", "amount", "currency", "category", "comment"],
    "additionalProperties": False,
}

LANG_NAMES = {"ru": "русском", "uk": "украинском", "en": "английском"}


def is_available() -> bool:
    return _client is not None


async def _ask(content, *, system: str, schema: dict | None = None, effort: str = "low",
               max_tokens: int = 4000) -> str | None:
    """Один запрос к Claude. Возвращает текст ответа или None при ошибке."""
    if _client is None:
        return None
    output_config: dict = {"effort": effort}
    if schema:
        output_config["format"] = {"type": "json_schema", "schema": schema}
    try:
        response = await _client.beta.messages.create(
            model=config.claude_model,
            max_tokens=max_tokens,
            system=system,
            messages=[{"role": "user", "content": content}],
            output_config=output_config,
            # Если модель откажет по соображениям безопасности, сервер сам повторит запрос на запасной модели
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
        )
    except anthropic.RateLimitError:
        log.warning("Claude: превышен лимит запросов")
        return None
    except anthropic.APIStatusError as e:
        log.error("Claude: ошибка API %s: %s", e.status_code, e.message)
        return None
    except anthropic.APIConnectionError as e:
        log.error("Claude: нет соединения: %s", e)
        return None

    if response.stop_reason == "refusal":
        log.warning("Claude отказался отвечать")
        return None
    text = "".join(b.text for b in response.content if b.type == "text").strip()
    return text or None


async def _ask_expense(content, system: str) -> dict | None:
    text = await _ask(content, system=system, schema=EXPENSE_SCHEMA)
    if not text:
        return None
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        return None
    if not data.get("found") or not data.get("amount") or data["amount"] <= 0:
        return None
    data["currency"] = (data.get("currency") or "").upper()[:3] or None
    return data


async def recognize_receipt(image: bytes, media_type: str = "image/jpeg") -> dict | None:
    """Находит на фото чека итоговую сумму, валюту и категорию."""
    content = [
        {
            "type": "image",
            "source": {"type": "base64", "media_type": media_type,
                       "data": base64.standard_b64encode(image).decode()},
        },
        {"type": "text", "text": "Распознай этот чек."},
    ]
    system = (
        "Ты помощник по учёту расходов. На изображении — кассовый чек или квитанция. "
        "Найди ИТОГОВУЮ сумму к оплате (строки «Итого», «Сума», «Razem», «Total» и т.п.), "
        "а не отдельные позиции. Определи валюту по символам или стране магазина. "
        "Выбери категорию из списка. В comment — название магазина или что куплено (до 40 символов). "
        "Если это не чек или сумму не видно, верни found=false и amount=0."
    )
    return await _ask_expense(content, system)


async def parse_expense_phrase(text: str) -> dict | None:
    """Извлекает трату из свободной фразы (например, распознанного голосового)."""
    system = (
        "Ты помощник по учёту расходов. Пользователь описывает трату свободной фразой "
        "на русском, украинском или английском. Извлеки сумму (числа словами переведи в цифры), "
        "валюту (если названа, иначе пустая строка), категорию из списка и короткий комментарий "
        "(что куплено, до 40 символов). Если траты во фразе нет — found=false, amount=0."
    )
    return await _ask_expense(text, system)


async def weekly_analysis(stats: dict, lang: str) -> str | None:
    """Готовит текст недельного отчёта с советами по экономии."""
    system = (
        "Ты внимательный финансовый помощник в Telegram-боте. По статистике трат пользователя "
        "напиши короткий еженедельный отчёт на {lang} языке: 1) на что ушло больше всего; "
        "2) сравнение с прошлой неделей (в процентах, по общей сумме и заметным категориям); "
        "3) 2–4 конкретных, реалистичных совета, как сэкономить, опираясь на цифры. "
        "Пиши дружелюбно, без воды, до 900 символов. Форматирование — только HTML-теги "
        "<b> и <i>, никакого Markdown. Суммы указывай с валютой."
    ).format(lang=LANG_NAMES.get(lang, "русском"))
    return await _ask(json.dumps(stats, ensure_ascii=False), system=system, effort="medium")
