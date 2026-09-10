from aiogram import Router
from aiogram.filters import CommandStart
from aiogram.fsm.context import FSMContext
from aiogram.types import Message

from keyboards import main_menu

router = Router()


@router.message(CommandStart())
async def cmd_start(message: Message, state: FSMContext) -> None:
    await state.clear()
    await message.answer(
        "Привіт! 👋\n\n"
        "Я бот-помічник Miші — консультанта з догляду за шкірою та обличчям.\n"
        "Тут можна дізнатися про послуги, ціни та записатися на консультацію.",
        reply_markup=main_menu(),
    )
