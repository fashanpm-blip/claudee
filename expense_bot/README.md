# 💸 Бот учёта трат и привычек (aiogram 3)

Telegram-бот для учёта ежедневных трат и отслеживания привычек. Поддерживает много пользователей,
три языка интерфейса (русский / украинский / английский) и Premium-подписку через Telegram Stars.

## Возможности

**Бесплатно**
- Быстрый ввод одним сообщением: `250 еда`, `кофе 80`, `такси 120.50`: бот сам находит сумму и категорию.
- Ввод кнопками: сумма → категория → комментарий (необязательно).
- `/today`, `/week`, `/month`: сумма и разбивка по категориям.
- `/last`: последние записи, правка суммы, категории и комментария, удаление.
- До 3 привычек, ежедневное напоминание с кнопками «Выполнено ✅ / Пропустить ❌», серия (streak), `/habits`.

**Premium (100 ⭐ ≈ 2$ / 30 дней, 7 дней бесплатно для новых пользователей)**
1. 📸 Чеки по фото (Claude Vision).
2. 🎤 Голосовой ввод (Whisper + встроенный разбор, Claude для сложных фраз).
3. 📊 Графики: круговая диаграмма и траты по дням.
4. 🤖 ИИ-анализ каждое воскресенье в 20:00 по местному времени, также по кнопке.
5. 💰 Месячные бюджеты по категориям, уведомления при 80% и 100%.
6. 🎯 Цели накопления с прогресс-баром и прогнозом даты.
7. 🌍 Траты в любых валютах с автоконвертацией (`20 eur обед`, `$15 такси`).
8. ♾ Безлимитные привычки и свои категории с эмодзи.
9. 🛡 Заморозка серии 2 раза в месяц.
10. 📁 Экспорт в Excel / CSV.
11. 👨‍👩‍👧 Общий бюджет: приглашение до 3 человек по ссылке.

**Админ (`/admin`, только для `ADMIN_ID`)**: статистика (пользователи, Premium, доход за месяц),
рассылка, ручная выдача Premium, `/refund <charge_id>` для возврата Stars.

## Структура

```
expense_bot/
├── main.py              # точка входа
├── config.py            # настройки из .env
├── middlewares.py       # сессия БД + пользователь в каждом апдейте
├── database/            # модели SQLAlchemy и подключение
├── handlers/            # start/настройки, траты, привычки, premium, медиа, инструменты, админ
├── keyboards/           # inline- и reply-клавиатуры
├── services/            # парсер, валюты, ИИ, речь, графики, отчёты, планировщик, логика
└── utils/               # переводы (i18n), форматирование, FSM-состояния, безопасная отправка
```

## Установка и запуск

### 1. Получите токен бота у @BotFather
1. Откройте в Telegram [@BotFather](https://t.me/BotFather) и отправьте `/newbot`.
2. Введите имя бота (например, «Мои траты»), затем username, который заканчивается на `bot`
   (например, `my_expenses_bot`).
3. BotFather пришлёт токен вида `123456789:AAH...`. Это `BOT_TOKEN`, никому его не показывайте.
4. Ваш Telegram ID (для `ADMIN_ID`) можно узнать у [@userinfobot](https://t.me/userinfobot).

Оплата Stars **не требует** подключения платёжного провайдера: она работает сразу.
В `/mybots → Bot Settings` можно добавить описание и аватар.

### 2. Установите зависимости (нужен Python 3.11+)
```bash
cd expense_bot
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # и впишите BOT_TOKEN и ADMIN_ID
```

### 3. Запустите локально
```bash
python main.py
```
База SQLite создастся автоматически в `data/bot.db`.

### 4. Запуск на сервере (Ubuntu, systemd)
```bash
sudo apt update && sudo apt install -y python3.11 python3.11-venv git
sudo useradd -r -m -d /opt/expense_bot bot
sudo -u bot git clone <ваш-репозиторий> /tmp/repo && sudo -u bot cp -r /tmp/repo/expense_bot/. /opt/expense_bot/
cd /opt/expense_bot
sudo -u bot python3.11 -m venv .venv
sudo -u bot .venv/bin/pip install -r requirements.txt
sudo -u bot cp .env.example .env && sudo -u bot nano .env

sudo cp expense-bot.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now expense-bot
sudo journalctl -u expense-bot -f      # логи
```

Через Docker:
```bash
docker build -t expense-bot .
docker run -d --name expense-bot --restart=always --env-file .env -v $(pwd)/data:/app/data expense-bot
```

### 5. Подключение ИИ (необязательно)
- `ANTHROPIC_API_KEY` ([console.anthropic.com](https://console.anthropic.com)) включает чеки,
  разбор сложных голосовых фраз и ИИ-отчёт. Без ключа отчёт строится встроенным алгоритмом,
  а чеки недоступны. Модель задаётся в `CLAUDE_MODEL`. Если модель отклонит запрос, сервер
  автоматически повторит его на запасной модели (параметр `fallbacks`).
- `STT_API_KEY` + `STT_BASE_URL` нужны для голосового ввода. Подойдёт любой Whisper-совместимый API
  (OpenAI, Groq и т.д.).

### Переход на PostgreSQL
```bash
pip install asyncpg
# в .env:
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/expense_bot
```
Таблицы создаются автоматически при запуске.

## Заметки
- Все напоминания идут через APScheduler. Каждую минуту бот проверяет, у каких часовых поясов
  наступило время напоминания, поэтому пояс каждого пользователя учитывается.
- Premium хранится как дата окончания (`premium_until`) и отключается автоматически. Продления
  подписки Telegram присылает как новые `successful_payment`; бот их учитывает (без двойного
  начисления по одному платежу).
- Курсы валют берутся с open.er-api.com (кеш 6 часов). Если API недоступен, используются
  примерные встроенные курсы.
- Состояния диалогов (FSM) хранятся в памяти. Если бот перезапустится посреди ввода, пользователь
  начнёт этот шаг заново. Для нескольких копий бота подключите `RedisStorage` из aiogram.
- В общем бюджете траты считаются в валюте владельца.
