from aiogram.types import InlineKeyboardMarkup
from aiogram.utils.keyboard import InlineKeyboardBuilder

SERVICES = {
    "consult_online": "Онлайн-консультація (30 хв) — 400 грн",
    "consult_full": "Повна консультація з планом догляду — 900 грн",
    "care_program": "Індивідуальна програма домашнього догляду — 600 грн",
    "cleaning": "Чистка обличчя (офлайн) — 800 грн",
}


def main_menu() -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    builder.button(text="💬 Про консультації", callback_data="about")
    builder.button(text="💰 Ціни", callback_data="prices")
    builder.button(text="📅 Записатися", callback_data="book")
    builder.button(text="📞 Контакти", callback_data="contacts")
    builder.adjust(1)
    return builder.as_markup()


def services_menu() -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    for key, label in SERVICES.items():
        builder.button(text=label, callback_data=f"service:{key}")
    builder.button(text="⬅️ Назад", callback_data="back_to_menu")
    builder.adjust(1)
    return builder.as_markup()


def confirm_menu() -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    builder.button(text="✅ Підтвердити запис", callback_data="confirm_booking")
    builder.button(text="❌ Скасувати", callback_data="cancel_booking")
    builder.adjust(1)
    return builder.as_markup()
