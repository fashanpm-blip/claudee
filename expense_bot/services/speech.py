"""Распознавание голосовых сообщений через OpenAI-совместимый Whisper API
(OpenAI, Groq и др. — задаётся STT_BASE_URL / STT_MODEL / STT_API_KEY).
Telegram присылает голосовые в OGG/Opus — Whisper принимает этот формат напрямую."""
from __future__ import annotations

import logging

import aiohttp

from config import config

log = logging.getLogger(__name__)


def is_available() -> bool:
    return bool(config.stt_api_key)


async def transcribe(audio: bytes, lang: str | None = None, filename: str = "voice.ogg") -> str | None:
    if not is_available():
        return None
    form = aiohttp.FormData()
    form.add_field("file", audio, filename=filename, content_type="audio/ogg")
    form.add_field("model", config.stt_model)
    if lang in ("ru", "uk", "en"):
        form.add_field("language", lang)
    url = config.stt_base_url.rstrip("/") + "/audio/transcriptions"
    try:
        timeout = aiohttp.ClientTimeout(total=60)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.post(
                url, data=form, headers={"Authorization": f"Bearer {config.stt_api_key}"}
            ) as resp:
                if resp.status != 200:
                    log.error("STT ошибка %s: %s", resp.status, await resp.text())
                    return None
                data = await resp.json(content_type=None)
    except Exception as e:  # noqa: BLE001
        log.error("STT недоступен: %s", e)
        return None
    text = (data.get("text") or "").strip()
    return text or None
