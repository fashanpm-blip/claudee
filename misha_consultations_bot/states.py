from aiogram.fsm.state import State, StatesGroup


class BookingForm(StatesGroup):
    choosing_service = State()
    full_name = State()
    contact = State()
    concern = State()
    preferred_time = State()
    confirm = State()
