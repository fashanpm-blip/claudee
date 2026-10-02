"""Разбор текста траты: «250 еда», «кофе 80», «потратил двести гривен на такси»."""
from __future__ import annotations

import re
from dataclasses import dataclass

# Ключевые слова для автоопределения стандартных категорий (ru/uk/en).
# Сравнение идёт по началу слова, поэтому «продукт» поймает «продукты», «продуктів».
CATEGORY_KEYWORDS: dict[str, list[str]] = {
    "food": [
        "еда", "еды", "їжа", "їжу", "food", "кофе", "кава", "каву", "coffee", "обед", "обід",
        "ужин", "вечер", "завтрак", "сніданок", "lunch", "dinner", "breakfast", "продукт",
        "магаз", "супермаркет", "grocer", "кафе", "cafe", "ресторан", "restaurant", "пицц",
        "піц", "pizza", "бургер", "burger", "суши", "суші", "sushi", "шаурм", "хлеб", "хліб",
        "молок", "чай", "tea", "снек", "перекус", "доставк", "мак", "kfc", "сильпо", "атб",
        "biedronka", "lidl", "żabka", "zabka", "пиво", "beer", "вода", "water",
    ],
    "transport": [
        "транспорт", "transport", "такси", "таксі", "taxi", "uber", "bolt", "uklon", "уклон",
        "метро", "metro", "автобус", "bus", "маршрут", "трамва", "tram", "троллейб", "тролейб",
        "бензин", "пальн", "топлив", "fuel", "gas", "заправк", "парков", "parking", "поезд",
        "потяг", "train", "билет", "квиток", "ticket", "самол", "літак", "flight", "проезд",
        "проїзд", "каршер",
    ],
    "fun": [
        "развлеч", "розваг", "fun", "entertain", "кино", "кіно", "cinema", "movie", "театр",
        "theatre", "концерт", "concert", "игр", "ігр", "game", "бар", "bar", "клуб", "club",
        "боулинг", "квест", "музей", "museum", "вечерин", "party", "отдых", "відпоч",
    ],
    "shopping": [
        "покуп", "shop", "одежд", "одяг", "cloth", "обув", "взут", "shoes", "техник", "техні",
        "electronics", "телефон", "phone", "ноутбук", "laptop", "подар", "gift", "косметик",
        "cosmetic", "мебел", "меблі", "furniture", "zara", "rozetka", "розетка", "allegro",
        "amazon", "aliexpress", "алиэкспресс",
    ],
    "health": [
        "здоров", "health", "аптек", "pharm", "лекар", "ліки", "medicine", "врач", "лікар",
        "doctor", "стомат", "dentist", "зуб", "анализ", "аналіз", "спортзал", "gym", "фитнес",
        "фітнес", "fitness", "массаж", "масаж", "витамин", "вітамін",
    ],
    "subs": [
        "подписк", "підписк", "subscr", "netflix", "spotify", "youtube", "icloud", "apple",
        "google", "chatgpt", "claude", "megogo", "интернет", "інтернет", "internet",
        "мобильн", "мобільн", "связь", "зв'язок", "телеграм", "telegram",
    ],
    "other": ["другое", "інше", "other", "разное", "різне", "прочее"],
}

# Валюты: слово/символ -> ISO-код
CURRENCY_WORDS: dict[str, str] = {
    "₴": "UAH", "грн": "UAH", "гривн": "UAH", "гривен": "UAH", "гривень": "UAH", "uah": "UAH",
    "hryvn": "UAH",
    "zł": "PLN", "zl": "PLN", "pln": "PLN", "злот": "PLN", "zloty": "PLN", "złot": "PLN",
    "$": "USD", "usd": "USD", "доллар": "USD", "долар": "USD", "dollar": "USD", "бакс": "USD",
    "€": "EUR", "eur": "EUR", "евро": "EUR", "євро": "EUR", "euro": "EUR",
    "₽": "RUB", "руб": "RUB", "rub": "RUB", "рубл": "RUB",
    "₸": "KZT", "kzt": "KZT", "тенге": "KZT",
    "£": "GBP", "gbp": "GBP", "фунт": "GBP", "pound": "GBP",
    "czk": "CZK", "kč": "CZK", "крон": "CZK",
    "gel": "GEL", "лари": "GEL", "лир": "TRY", "lira": "TRY",
}

# Числа словами (для голосового ввода)
NUMBER_WORDS: dict[str, int] = {
    # русский
    "ноль": 0, "один": 1, "одна": 1, "одну": 1, "два": 2, "две": 2, "три": 3, "четыре": 4,
    "пять": 5, "шесть": 6, "семь": 7, "восемь": 8, "девять": 9, "десять": 10,
    "одиннадцать": 11, "двенадцать": 12, "тринадцать": 13, "четырнадцать": 14,
    "пятнадцать": 15, "шестнадцать": 16, "семнадцать": 17, "восемнадцать": 18,
    "девятнадцать": 19, "двадцать": 20, "тридцать": 30, "сорок": 40, "пятьдесят": 50,
    "шестьдесят": 60, "семьдесят": 70, "восемьдесят": 80, "девяносто": 90, "сто": 100,
    "двести": 200, "триста": 300, "четыреста": 400, "пятьсот": 500, "шестьсот": 600,
    "семьсот": 700, "восемьсот": 800, "девятьсот": 900,
    # українська
    "нуль": 0, "одне": 1, "дві": 2, "чотири": 4, "п'ять": 5, "пʼять": 5, "шість": 6,
    "сім": 7, "вісім": 8, "дев'ять": 9, "десять": 10, "одинадцять": 11, "дванадцять": 12,
    "тринадцять": 13, "чотирнадцять": 14, "п'ятнадцять": 15, "шістнадцять": 16,
    "сімнадцять": 17, "вісімнадцять": 18, "дев'ятнадцять": 19, "двадцять": 20,
    "тридцять": 30, "сорок": 40, "п'ятдесят": 50, "шістдесят": 60, "сімдесят": 70,
    "вісімдесят": 80, "дев'яносто": 90, "двісті": 200, "триста": 300, "чотириста": 400,
    "п'ятсот": 500, "шістсот": 600, "сімсот": 700, "вісімсот": 800, "дев'ятсот": 900,
    # english
    "zero": 0, "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7,
    "eight": 8, "nine": 9, "ten": 10, "eleven": 11, "twelve": 12, "thirteen": 13,
    "fourteen": 14, "fifteen": 15, "sixteen": 16, "seventeen": 17, "eighteen": 18,
    "nineteen": 19, "twenty": 20, "thirty": 30, "forty": 40, "fifty": 50, "sixty": 60,
    "seventy": 70, "eighty": 80, "ninety": 90,
}
MULTIPLIERS = {
    "сотня": 100, "hundred": 100, "тысяча": 1000, "тысячи": 1000, "тысяч": 1000,
    "тисяча": 1000, "тисячі": 1000, "тисяч": 1000, "thousand": 1000, "косарь": 1000,
}

# Слова-паразиты, которые убираем из комментария
STOP_WORDS = {
    "потратил", "потратила", "потратили", "витратив", "витратила", "витратили", "spent",
    "на", "за", "в", "у", "и", "і", "й", "on", "for", "the", "a", "an", "and", "купил",
    "купила", "купив", "bought", "заплатил", "заплатила", "заплатив", "paid", "оплатил",
    "оплатив", "сегодня", "сьогодні", "today", "это", "це",
}


@dataclass
class ParsedExpense:
    amount: float
    currency: str | None  # None = основная валюта
    category_key: str | None  # ключ стандартной категории или None
    text: str  # остаток текста (кандидат в комментарий / свою категорию)


def _norm(word: str) -> str:
    return word.lower().strip(".,!?;:«»\"()").replace("’", "'").replace("ʼ", "'")


def words_to_number(words: list[str]) -> tuple[float | None, list[int]]:
    """Находит первое число, записанное словами. Возвращает (число, индексы слов)."""
    total, current, used, started = 0, 0, [], False
    for i, raw in enumerate(words):
        w = _norm(raw)
        if w in NUMBER_WORDS:
            current += NUMBER_WORDS[w]
            used.append(i)
            started = True
        elif w in MULTIPLIERS and started:
            total += max(current, 1) * MULTIPLIERS[w]
            current = 0
            used.append(i)
        elif w in MULTIPLIERS and not started:  # «тысяча на такси»
            total += MULTIPLIERS[w]
            used.append(i)
            started = True
        elif started and w in ("и", "і", "and"):
            continue
        elif started:
            break
    if not started:
        return None, []
    return float(total + current), used


def detect_currency(word: str) -> str | None:
    w = _norm(word)
    if not w:
        return None
    if w in CURRENCY_WORDS:
        return CURRENCY_WORDS[w]
    for key, code in CURRENCY_WORDS.items():
        if len(key) >= 4 and w.startswith(key):
            return code
    return None


def detect_category(text: str) -> str | None:
    """Ищет стандартную категорию по ключевым словам."""
    for word in re.findall(r"[\w'’ʼ]+", text.lower()):
        word = _norm(word)
        if len(word) < 2:
            continue
        for key, keywords in CATEGORY_KEYWORDS.items():
            for kw in keywords:
                if word == kw or (len(kw) >= 3 and word.startswith(kw)):
                    return key
    return None


AMOUNT_RE = re.compile(r"(?<![\w.,])(\d{1,3}(?:[  ]\d{3})+|\d+)(?:[.,](\d{1,2}))?(?![\d])")


def parse_expense(text: str) -> ParsedExpense | None:
    """Пытается извлечь сумму, валюту и категорию из свободного текста."""
    if not text or len(text) > 300:
        return None
    text = text.strip()

    # Отделяем символы валют, приклеенные к числу: «$20», «20€», «20zł»
    spaced = re.sub(r"([$€£₴₽₸])", r" \1 ", text)
    spaced = re.sub(r"(\d)(zł|zl|грн|uah|pln|usd|eur)\b", r"\1 \2", spaced, flags=re.IGNORECASE)

    amount: float | None = None
    rest = spaced
    m = AMOUNT_RE.search(spaced)
    if m:
        integer = m.group(1).replace(" ", "").replace(" ", "")
        amount = float(f"{integer}.{m.group(2)}" if m.group(2) else integer)
        rest = (spaced[: m.start()] + " " + spaced[m.end():]).strip()
    else:
        words = spaced.split()
        value, used = words_to_number(words)
        if value:
            amount = value
            rest = " ".join(w for i, w in enumerate(words) if i not in used)

    if not amount or amount <= 0 or amount >= 1e9:
        return None

    currency = None
    rest_words = []
    for w in rest.split():
        code = detect_currency(w) if currency is None else None
        if code:
            currency = code
            continue
        rest_words.append(w)

    category_key = detect_category(" ".join(rest_words))
    clean = [w for w in rest_words if _norm(w) not in STOP_WORDS]
    comment = " ".join(clean).strip(" ,.-—")
    return ParsedExpense(amount=round(amount, 2), currency=currency, category_key=category_key,
                         text=comment[:200])
