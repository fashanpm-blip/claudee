import sqlite3
from contextlib import closing

from aiogram import Router
from aiogram.filters import Command
from aiogram.types import Message

from config import Config
from database import DB_PATH

router = Router()


@router.message(Command("mybookings"))
async def list_bookings(message: Message, config: Config) -> None:
    if message.from_user.id != config.admin_chat_id:
        return

    with closing(sqlite3.connect(DB_PATH)) as conn:
        rows = conn.execute(
            """
            SELECT id, full_name, contact, service, concern, preferred_time, created_at
            FROM bookings
            ORDER BY id DESC
            LIMIT 10
            """
        ).fetchall()

    if not rows:
        await message.answer("Записів поки немає.")
        return

    chunks = []
    for row_id, full_name, contact, service, concern, preferred_time, created_at in rows:
        chunks.append(
            f"#{row_id} | {created_at}\n"
            f"{full_name} ({contact})\n"
            f"{service}\n"
            f"Запит: {concern}\n"
            f"Бажаний час: {preferred_time}"
        )

    await message.answer("\n\n".join(chunks))
