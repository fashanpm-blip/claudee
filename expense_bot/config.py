"""Загрузка конфигурации из .env."""
from __future__ import annotations

import os
from dataclasses import dataclass, field

from dotenv import load_dotenv

load_dotenv()


def _int(name: str, default: int) -> int:
    try:
        return int(os.getenv(name, default))
    except (TypeError, ValueError):
        return default


def _admin_ids() -> set[int]:
    # ADMIN_ID может содержать несколько ID через запятую
    raw = os.getenv("ADMIN_ID", "")
    return {int(x) for x in raw.replace(" ", "").split(",") if x.strip().lstrip("-").isdigit()}


@dataclass(frozen=True)
class Config:
    bot_token: str = os.getenv("BOT_TOKEN", "")
    admin_ids: set[int] = field(default_factory=_admin_ids)
    database_url: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///data/bot.db")

    # Premium
    premium_price_stars: int = _int("PREMIUM_PRICE_STARS", 100)  # ~2$
    trial_days: int = _int("TRIAL_DAYS", 7)
    subscription_period: int = 2592000  # 30 дней — единственный период, который поддерживает Telegram

    # Ограничения бесплатного тарифа
    free_habits_limit: int = 3
    family_members_limit: int = 3
    freezes_per_month: int = 2

    # ИИ (Claude) — распознавание чеков, разбор голосовых фраз, недельный анализ
    anthropic_api_key: str = os.getenv("ANTHROPIC_API_KEY", "")
    claude_model: str = os.getenv("CLAUDE_MODEL", "claude-opus-5-5")

    # Распознавание речи: любой OpenAI-совместимый Whisper API (OpenAI, Groq и т.д.)
    stt_api_key: str = os.getenv("STT_API_KEY", "")
    stt_base_url: str = os.getenv("STT_BASE_URL", "https://api.openai.com/v1")
    stt_model: str = os.getenv("STT_MODEL", "whisper-1")

    support_contact: str = os.getenv("SUPPORT_CONTACT", "")
    default_timezone: str = os.getenv("DEFAULT_TIMEZONE", "Europe/Kyiv")


config = Config()
