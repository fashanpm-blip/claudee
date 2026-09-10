# Бот консультацій Miші

Telegram-бот для запису на консультації з догляду за шкірою та обличчям.

## Можливості

- Головне меню: про консультації, ціни, запис, контакти
- Покроковий запис на консультацію (вибір послуги → ім'я → контакт → опис проблеми → бажаний час → підтвердження)
- Повідомлення адміну (Miші) про новий запис
- Команда `/mybookings` для Miші — перегляд останніх 10 записів
- Збереження записів у SQLite (`bookings.db`)

## Запуск

1. Створіть бота через [@BotFather](https://t.me/BotFather) і отримайте `BOT_TOKEN`.
2. Дізнайтеся свій `ADMIN_CHAT_ID` — напишіть [@userinfobot](https://t.me/userinfobot), він покаже ваш chat id.
3. Встановіть залежності:

   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. Скопіюйте `.env.example` у `.env` і вкажіть свої значення:

   ```bash
   cp .env.example .env
   ```

5. Запустіть бота:

   ```bash
   python bot.py
   ```

## Налаштування послуг і цін

Список послуг та цін редагується у `keyboards.py`, словник `SERVICES`.

## Структура проєкту

```
misha_consultations_bot/
├── bot.py              # точка входу
├── config.py           # завантаження BOT_TOKEN / ADMIN_CHAT_ID з .env
├── database.py         # SQLite: збереження записів
├── keyboards.py        # inline-клавіатури та список послуг
├── states.py            # FSM-стани для запису
└── handlers/
    ├── start.py         # /start
    ├── info.py           # про консультації / ціни / контакти
    ├── booking.py        # покроковий запис
    └── admin.py          # /mybookings для адміна
```
