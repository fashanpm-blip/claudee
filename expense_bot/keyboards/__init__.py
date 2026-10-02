"""Клавиатуры бота."""
from __future__ import annotations

from aiogram.types import (
    InlineKeyboardButton, InlineKeyboardMarkup, KeyboardButton, ReplyKeyboardMarkup,
)
from aiogram.utils.keyboard import InlineKeyboardBuilder

from database.models import Category
from utils.formatting import MAIN_CURRENCIES, TIMEZONES
from utils.i18n import LANGS, t


def btn(text: str, data: str) -> InlineKeyboardButton:
    return InlineKeyboardButton(text=text, callback_data=data)


def kb(*rows: list[InlineKeyboardButton]) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[list(r) for r in rows if r])


def main_menu(lang: str) -> ReplyKeyboardMarkup:
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text=t(lang, "btn_add")), KeyboardButton(text=t(lang, "btn_stats"))],
            [KeyboardButton(text=t(lang, "btn_habits")), KeyboardButton(text=t(lang, "btn_tools"))],
            [KeyboardButton(text=t(lang, "btn_premium")), KeyboardButton(text=t(lang, "btn_settings"))],
        ],
        resize_keyboard=True,
        is_persistent=True,
    )


def cancel_kb(lang: str) -> InlineKeyboardMarkup:
    return kb([btn(t(lang, "btn_cancel"), "cancel")])


def lang_kb(prefix: str = "lang") -> InlineKeyboardMarkup:
    return kb([btn(name, f"{prefix}:{code}") for code, name in LANGS.items()])


def currency_kb(lang: str, prefix: str = "cur") -> InlineKeyboardMarkup:
    b = InlineKeyboardBuilder()
    for code in MAIN_CURRENCIES:
        b.button(text=code, callback_data=f"{prefix}:{code}")
    b.button(text=t(lang, "btn_other_currency"), callback_data=f"{prefix}:other")
    b.adjust(4)
    return b.as_markup()


def tz_kb(lang: str, prefix: str = "tz") -> InlineKeyboardMarkup:
    b = InlineKeyboardBuilder()
    for tz in TIMEZONES:
        b.button(text=tz.split("/")[-1].replace("_", " "), callback_data=f"{prefix}:{tz}")
    b.button(text=t(lang, "btn_tz_manual"), callback_data=f"{prefix}:manual")
    b.adjust(2)
    return b.as_markup()


def categories_kb(cats: list[Category], lang: str, prefix: str,
                  cancel: bool = True) -> InlineKeyboardMarkup:
    from services.core import category_label

    b = InlineKeyboardBuilder()
    for cat in cats:
        b.button(text=category_label(cat, lang), callback_data=f"{prefix}{cat.id}")
    b.adjust(2)
    if cancel:
        b.row(btn(t(lang, "btn_cancel"), "cancel"))
    return b.as_markup()


def expense_added_kb(lang: str, exp_id: int) -> InlineKeyboardMarkup:
    return kb([btn(t(lang, "btn_edit"), f"exp:open:{exp_id}"),
               btn(t(lang, "btn_undo"), f"exp:del:{exp_id}")])


def expense_edit_kb(lang: str, exp_id: int) -> InlineKeyboardMarkup:
    return kb(
        [btn(t(lang, "btn_edit_amount"), f"exp:amount:{exp_id}"),
         btn(t(lang, "btn_edit_category"), f"exp:cat:{exp_id}")],
        [btn(t(lang, "btn_edit_comment"), f"exp:comment:{exp_id}"),
         btn(t(lang, "btn_delete"), f"exp:del:{exp_id}")],
        [btn(t(lang, "btn_back"), "exp:last")],
    )


def stats_kb(lang: str, period: str | None = None) -> InlineKeyboardMarkup:
    rows = [[btn(t(lang, "btn_today"), "stats:today"), btn(t(lang, "btn_week"), "stats:week"),
             btn(t(lang, "btn_month"), "stats:month")]]
    if period:
        rows.append([btn(t(lang, "btn_chart_pie"), f"chart:pie:{period}"),
                     btn(t(lang, "btn_chart_days"), f"chart:days:{period}")])
    rows.append([btn(t(lang, "btn_last"), "exp:last")])
    return kb(*rows)


def premium_kb(lang: str) -> InlineKeyboardMarkup:
    return kb([btn(t(lang, "btn_get_premium"), "premium")])


def tools_kb(lang: str) -> InlineKeyboardMarkup:
    return kb(
        [btn(t(lang, "btn_budgets"), "budgets"), btn(t(lang, "btn_goals"), "goals")],
        [btn(t(lang, "btn_categories"), "cats"), btn(t(lang, "btn_export"), "export")],
        [btn(t(lang, "btn_family"), "family"), btn(t(lang, "btn_ai_report"), "ai_report")],
    )
