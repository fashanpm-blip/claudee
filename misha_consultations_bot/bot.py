import asyncio
import logging

from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode

from config import load_config
from database import init_db
from handlers import admin, booking, info, start


async def main() -> None:
    logging.basicConfig(level=logging.INFO)
    config = load_config()
    init_db()

    bot = Bot(token=config.bot_token, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    dp = Dispatcher()

    dp.include_router(start.router)
    dp.include_router(info.router)
    dp.include_router(booking.router)
    dp.include_router(admin.router)

    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot, config=config)


if __name__ == "__main__":
    asyncio.run(main())
