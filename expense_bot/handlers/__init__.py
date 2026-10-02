from aiogram import Router

from . import admin, common, expenses, habits, media, premium, start, tools


def setup_routers() -> Router:
    """Порядок важен: быстрый ввод трат (expenses) — последним, он ловит любой текст."""
    root = Router(name="root")
    root.include_routers(
        start.router,
        common.guard_router,
        admin.router,
        premium.router,
        habits.router,
        tools.router,
        media.router,
        expenses.router,
        common.errors_router,
    )
    return root
