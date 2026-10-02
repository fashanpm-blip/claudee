"""Точка входа: запуск бота."""
from __future__ import annotations

import asyncio
import logging
import sys

from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import BotCommand

from config import config
from database import init_db
from handlers import setup_routers
from middlewares import DbUserMiddleware
from services.scheduler import setup_scheduler

COMMANDS = {
    "ru": [("start", "Перезапуск"), ("today", "Траты за сегодня"), ("week", "Траты за неделю"),
           ("month", "Траты за месяц"), ("last", "Последние записи"), ("habits", "Привычки"),
           ("premium", "Premium"), ("settings", "Настройки"), ("help", "Помощь"),
           ("paysupport", "Поддержка по оплате")],
    "uk": [("start", "Перезапуск"), ("today", "Витрати за сьогодні"), ("week", "Витрати за тиждень"),
           ("month", "Витрати за місяць"), ("last", "Останні записи"), ("habits", "Звички"),
           ("premium", "Premium"), ("settings", "Налаштування"), ("help", "Допомога"),
           ("paysupport", "Підтримка з оплати")],
    "en": [("start", "Restart"), ("today", "Today's expenses"), ("week", "This week"),
           ("month", "This month"), ("last", "Recent records"), ("habits", "Habits"),
           ("premium", "Premium"), ("settings", "Settings"), ("help", "Help"),
           ("paysupport", "Payment support")],
}


async def set_commands(bot: Bot) -> None:
    for lang, items in COMMANDS.items():
        cmds = [BotCommand(command=c, description=d) for c, d in items]
        await bot.set_my_commands(cmds, language_code=lang)
    await bot.set_my_commands([BotCommand(command=c, description=d) for c, d in COMMANDS["en"]])


async def main() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
        stream=sys.stdout,
    )
    if not config.bot_token:
        sys.exit("BOT_TOKEN не задан. Скопируйте .env.example в .env и укажите токен.")

    await init_db()
    bot = Bot(config.bot_token, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    dp = Dispatcher(storage=MemoryStorage())
    dp.update.outer_middleware(DbUserMiddleware())
    dp.include_router(setup_routers())

    scheduler = setup_scheduler(bot)
    scheduler.start()
    await set_commands(bot)
    try:
        await bot.delete_webhook(drop_pending_updates=False)
        await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())
    finally:
        scheduler.shutdown(wait=False)
        await bot.session.close()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        pass
