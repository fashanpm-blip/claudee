from aiogram import Bot, F, Router
from aiogram.fsm.context import FSMContext
from aiogram.types import CallbackQuery, Message

from config import Config
from database import save_booking
from keyboards import SERVICES, confirm_menu, main_menu, services_menu
from states import BookingForm

router = Router()


@router.callback_query(F.data == "book")
async def start_booking(callback: CallbackQuery, state: FSMContext) -> None:
    await state.set_state(BookingForm.choosing_service)
    await callback.message.edit_text(
        "Оберіть послугу, на яку хочете записатися:",
        reply_markup=services_menu(),
    )
    await callback.answer()


@router.callback_query(BookingForm.choosing_service, F.data.startswith("service:"))
async def choose_service(callback: CallbackQuery, state: FSMContext) -> None:
    service_key = callback.data.split(":", 1)[1]
    await state.update_data(service=SERVICES[service_key])
    await state.set_state(BookingForm.full_name)
    await callback.message.edit_text("Як до вас звертатися? Напишіть ім'я:")
    await callback.answer()


@router.message(BookingForm.full_name)
async def get_full_name(message: Message, state: FSMContext) -> None:
    await state.update_data(full_name=message.text)
    await state.set_state(BookingForm.contact)
    await message.answer("Залиште номер телефону або нікнейм у Telegram для зв'язку:")


@router.message(BookingForm.contact)
async def get_contact(message: Message, state: FSMContext) -> None:
    await state.update_data(contact=message.text)
    await state.set_state(BookingForm.concern)
    await message.answer(
        "Опишіть коротко вашу проблему або мету консультації "
        "(наприклад: висипання, сухість шкіри, підбір догляду тощо):"
    )


@router.message(BookingForm.concern)
async def get_concern(message: Message, state: FSMContext) -> None:
    await state.update_data(concern=message.text)
    await state.set_state(BookingForm.preferred_time)
    await message.answer("Який день і час вам зручні для консультації?")


@router.message(BookingForm.preferred_time)
async def get_preferred_time(message: Message, state: FSMContext) -> None:
    await state.update_data(preferred_time=message.text)
    data = await state.get_data()
    await state.set_state(BookingForm.confirm)
    await message.answer(
        "Перевірте дані запису:\n\n"
        f"Послуга: {data['service']}\n"
        f"Ім'я: {data['full_name']}\n"
        f"Контакт: {data['contact']}\n"
        f"Запит: {data['concern']}\n"
        f"Бажаний час: {data['preferred_time']}\n\n"
        "Все вірно?",
        reply_markup=confirm_menu(),
    )


@router.callback_query(BookingForm.confirm, F.data == "confirm_booking")
async def confirm_booking(
    callback: CallbackQuery, state: FSMContext, bot: Bot, config: Config
) -> None:
    data = await state.get_data()
    booking_id = save_booking(
        user_id=callback.from_user.id,
        username=callback.from_user.username,
        full_name=data["full_name"],
        contact=data["contact"],
        service=data["service"],
        concern=data["concern"],
        preferred_time=data["preferred_time"],
    )

    await callback.message.edit_text(
        "✅ Запис оформлено! Miша зв'яжеться з вами найближчим часом.",
        reply_markup=main_menu(),
    )
    await callback.answer()
    await state.clear()

    await bot.send_message(
        config.admin_chat_id,
        "🆕 Новий запис на консультацію #{}\n\n"
        "Послуга: {}\n"
        "Ім'я: {}\n"
        "Контакт: {}\n"
        "Запит: {}\n"
        "Бажаний час: {}\n"
        "Telegram: @{}".format(
            booking_id,
            data["service"],
            data["full_name"],
            data["contact"],
            data["concern"],
            data["preferred_time"],
            callback.from_user.username or "—",
        ),
    )


@router.callback_query(BookingForm.confirm, F.data == "cancel_booking")
async def cancel_booking(callback: CallbackQuery, state: FSMContext) -> None:
    await state.clear()
    await callback.message.edit_text("Запис скасовано.", reply_markup=main_menu())
    await callback.answer()
