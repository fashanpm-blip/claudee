import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


@dataclass
class Config:
    bot_token: str
    admin_chat_id: int


def load_config() -> Config:
    token = os.getenv("BOT_TOKEN")
    if not token:
        raise RuntimeError("BOT_TOKEN не задано. Додайте його у файл .env")

    admin_id = os.getenv("ADMIN_CHAT_ID")
    if not admin_id:
        raise RuntimeError("ADMIN_CHAT_ID не задано. Додайте його у файл .env")

    return Config(bot_token=token, admin_chat_id=int(admin_id))
