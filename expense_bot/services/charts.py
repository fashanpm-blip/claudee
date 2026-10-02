"""Построение графиков (matplotlib). Рисование выполняется в отдельном потоке,
чтобы не блокировать event loop бота."""
from __future__ import annotations

import asyncio
import io
from datetime import date

import matplotlib

matplotlib.use("Agg")  # без GUI — для сервера
import matplotlib.pyplot as plt  # noqa: E402

# Палитра: категориальные цвета в фиксированном порядке (проверены на различимость
# при дальтонизме), нейтральные цвета текста и фона.
SERIES = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#4a3aa7", "#e34948"]
OTHER_COLOR = "#a3a29c"
SURFACE = "#fcfcfb"
TEXT = "#0b0b0b"
TEXT_2 = "#52514e"
GRID = "#e6e5e0"
MAX_SLICES = 7  # остальное сворачивается в «Другое»


def _style(ax) -> None:
    ax.set_facecolor(SURFACE)
    for side in ("top", "right", "left"):
        ax.spines[side].set_visible(False)
    ax.spines["bottom"].set_color(GRID)
    ax.tick_params(colors=TEXT_2, labelsize=9, length=0)
    ax.yaxis.grid(True, color=GRID, linewidth=0.8)
    ax.set_axisbelow(True)


def _pie(items: list[tuple[str, float]], title: str, currency: str, other_label: str) -> bytes:
    items = sorted(items, key=lambda x: x[1], reverse=True)
    folded = len(items) > MAX_SLICES
    if folded:
        rest = sum(v for _, v in items[MAX_SLICES - 1:])
        items = items[: MAX_SLICES - 1] + [(other_label, rest)]
    values = [v for _, v in items]
    colors = SERIES[: len(items)]
    if folded:
        colors[-1] = OTHER_COLOR  # свёрнутый остаток — нейтральным цветом
    total = sum(values) or 1

    fig, ax = plt.subplots(figsize=(8, 5.2), dpi=150)
    fig.patch.set_facecolor(SURFACE)
    wedges, _ = ax.pie(
        values, colors=colors, startangle=90, counterclock=False,
        wedgeprops={"width": 0.42, "edgecolor": SURFACE, "linewidth": 2},
    )
    ax.text(0, 0.06, f"{total:,.0f}".replace(",", " "), ha="center", va="center",
            fontsize=18, fontweight="bold", color=TEXT)
    ax.text(0, -0.14, currency, ha="center", va="center", fontsize=10, color=TEXT_2)
    # Легенда с суммами и процентами — цвет не единственный способ различить категории
    legend_labels = [
        f"{name}  {v:,.0f} ({v / total * 100:.0f}%)".replace(",", " ") for name, v in items
    ]
    ax.legend(wedges, legend_labels, loc="center left", bbox_to_anchor=(1.0, 0.5),
              frameon=False, fontsize=10, labelcolor=TEXT, handlelength=1, handleheight=1)
    ax.set_title(title, color=TEXT, fontsize=13, fontweight="bold", loc="left", pad=12)
    ax.axis("equal")
    return _save(fig)


def _days(series: list[tuple[date, float]], title: str, currency: str) -> bytes:
    fig, ax = plt.subplots(figsize=(9, 4.6), dpi=150)
    fig.patch.set_facecolor(SURFACE)
    _style(ax)
    xs = list(range(len(series)))
    values = [v for _, v in series]
    ax.bar(xs, values, width=0.62, color=SERIES[0], edgecolor=SURFACE, linewidth=1)
    step = max(1, len(series) // 12)
    ax.set_xticks(xs[::step])
    ax.set_xticklabels([d.strftime("%d.%m") for d, _ in series][::step])
    ax.yaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(
        lambda v, _: f"{v:,.0f}".replace(",", " ")))
    # Подписываем только максимум и среднее — не загромождаем график
    if any(values):
        peak = max(range(len(values)), key=lambda i: values[i])
        ax.annotate(f"{values[peak]:,.0f}".replace(",", " "), (peak, values[peak]),
                    textcoords="offset points", xytext=(0, 4), ha="center",
                    fontsize=9, color=TEXT, fontweight="bold")
        avg = sum(values) / len(values)
        ax.axhline(avg, color=TEXT_2, linewidth=1, linestyle=(0, (4, 3)))
        ax.text(len(values) - 0.5, avg, f" ⌀ {avg:,.0f}".replace(",", " "), va="bottom",
                ha="right", fontsize=8, color=TEXT_2)
    ax.set_ylabel(currency, color=TEXT_2, fontsize=10, rotation=0, labelpad=12)
    ax.set_title(title, color=TEXT, fontsize=13, fontweight="bold", loc="left", pad=12)
    return _save(fig)


def _save(fig) -> bytes:
    buf = io.BytesIO()
    fig.tight_layout()
    fig.savefig(buf, format="png", facecolor=fig.get_facecolor())
    plt.close(fig)
    return buf.getvalue()


async def pie_chart(items, title, currency, other_label) -> bytes:
    return await asyncio.to_thread(_pie, items, title, currency, other_label)


async def days_chart(series, title, currency) -> bytes:
    return await asyncio.to_thread(_days, series, title, currency)
