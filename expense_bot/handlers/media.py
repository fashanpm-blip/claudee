"""Premium: распознавание чеков (фото) и голосовой ввод."""
from __future__ import annotations

import io

from aiogram import Bot, F, Router
from aiogram.filters import StateFilter
from aiogram.fsm.context import FSMContext
from aiogram.types import Message
from sqlalchemy.ext.asyncio import AsyncSession

from database.models import User
from handlers.expenses import handle_parsed
from keyboards import premium_kb
from services import ai, speech
from services.parser import parse_expense
from utils.formatting import esc
from utils.i18n import t

router = Router(name="media")

MAX_FILE_SIZE = 10 * 1024 * 1024


async def download(bot: Bot, file_id: str) -> bytes:
    buf = io.BytesIO()
    await bot.download(file_id, destination=buf)
    return buf.getvalue()


@router.message(StateFilter(None), F.photo | (F.document & F.document.mime_type.startswith("image/")))
async def receipt(message: Message, state: FSMContext, session: AsyncSession, user: User, bot: Bot) -> None:
    if not user.is_premium:
        await message.answer(t(user.lang, "premium_only"), reply_markup=premium_kb(user.lang))
        return
    if not ai.is_available():
        await message.answer(t(user.lang, "ai_unavailable"))
        return
    if message.photo:
        file_id, size, mime = message.photo[-1].file_id, message.photo[-1].file_size, "image/jpeg"
    else:
        file_id, size, mime = message.document.file_id, message.document.file_size, message.document.mime_type
    if mime not in ("image/jpeg", "image/png", "image/webp", "image/gif"):
        mime = "image/jpeg"
    if size and size > MAX_FILE_SIZE:
        await message.answer(t(user.lang, "receipt_fail"))
        return

    wait = await message.answer(t(user.lang, "receipt_processing"))
    await bot.send_chat_action(message.chat.id, "typing")
    data = await ai.recognize_receipt(await download(bot, file_id), mime)
    await wait.delete()
    if not data:
        await message.answer(t(user.lang, "receipt_fail"))
        return
    await handle_parsed(message, state, session, user, bot, round(float(data["amount"]), 2),
                        data["currency"], data["category"], data.get("comment", ""), "receipt")


@router.message(StateFilter(None), F.voice | F.audio)
async def voice(message: Message, state: FSMContext, session: AsyncSession, user: User, bot: Bot) -> None:
    if not user.is_premium:
        await message.answer(t(user.lang, "premium_only"), reply_markup=premium_kb(user.lang))
        return
    if not speech.is_available():
        await message.answer(t(user.lang, "ai_unavailable"))
        return
    media = message.voice or message.audio
    if media.file_size and media.file_size > MAX_FILE_SIZE:
        await message.answer(t(user.lang, "voice_fail"))
        return

    wait = await message.answer(t(user.lang, "voice_processing"))
    filename = "voice.ogg" if message.voice else (message.audio.file_name or "audio.mp3")
    text = await speech.transcribe(await download(bot, media.file_id), user.lang, filename)
    await wait.delete()
    if not text:
        await message.answer(t(user.lang, "voice_fail"))
        return
    await message.answer(t(user.lang, "voice_heard", text=esc(text)))

    # Сначала пробуем встроенный разборщик, если он не справился — спрашиваем Claude
    parsed = parse_expense(text)
    if parsed:
        await handle_parsed(message, state, session, user, bot, parsed.amount, parsed.currency,
                            parsed.category_key, parsed.text, "voice")
        return
    data = await ai.parse_expense_phrase(text)
    if data:
        await handle_parsed(message, state, session, user, bot, round(float(data["amount"]), 2),
                            data["currency"], data["category"], data.get("comment", ""), "voice")
    else:
        await message.answer(t(user.lang, "not_understood"))
