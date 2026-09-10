from aiogram import F, Router
from aiogram.types import CallbackQuery

from keyboards import SERVICES, main_menu

router = Router()


@router.callback_query(F.data == "about")
async def show_about(callback: CallbackQuery) -> None:
    await callback.message.edit_text(
        "🧴 Консультації з догляду за шкірою та обличчям\n\n"
        "Miша допоможе:\n"
        "• підібрати схему домашнього догляду під тип шкіри;\n"
        "• розібратися зі складом косметики;\n"
        "• скласти план боротьби з висипаннями, тьмяністю, зморшками;\n"
        "• відповісти на будь-які питання про шкіру та обличчя.\n\n"
        "Консультації проходять онлайн (відеозв'язок/переписка) або офлайн.",
        reply_markup=main_menu(),
    )
    await callback.answer()


@router.callback_query(F.data == "prices")
async def show_prices(callback: CallbackQuery) -> None:
    lines = "\n".join(f"• {label}" for label in SERVICES.values())
    await callback.message.edit_text(
        f"💰 Ціни на послуги:\n\n{lines}\n\nТочна вартість може уточнюватись індивідуально.",
        reply_markup=main_menu(),
    )
    await callback.answer()


@router.callback_query(F.data == "contacts")
async def show_contacts(callback: CallbackQuery) -> None:
    await callback.message.edit_text(
        "📞 Контакти\n\n"
        "Написати напряму: @misha_username\n"
        "Або натисніть «Записатися», і Miша зв'яжеться з вами сам.",
        reply_markup=main_menu(),
    )
    await callback.answer()


@router.callback_query(F.data == "back_to_menu")
async def back_to_menu(callback: CallbackQuery) -> None:
    await callback.message.edit_text(
        "Головне меню. Оберіть дію:",
        reply_markup=main_menu(),
    )
    await callback.answer()
