"""Состояния FSM (пошаговые диалоги)."""
from aiogram.fsm.state import State, StatesGroup


class Onboarding(StatesGroup):
    lang = State()
    currency = State()
    tz = State()


class Manual(StatesGroup):
    currency = State()  # ввод кода валюты вручную (онбординг или настройки)
    tz = State()  # ввод часового пояса вручную


class AddExpense(StatesGroup):
    amount = State()
    category = State()
    comment = State()


class EditExpense(StatesGroup):
    amount = State()
    comment = State()


class HabitForm(StatesGroup):
    name = State()
    time = State()


class ToolsForm(StatesGroup):
    budget_limit = State()
    goal_new = State()
    goal_deposit = State()
    category_new = State()


class AdminForm(StatesGroup):
    broadcast = State()
    grant = State()
