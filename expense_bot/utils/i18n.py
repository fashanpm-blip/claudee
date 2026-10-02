"""Переводы интерфейса: русский, украинский, английский."""
from __future__ import annotations

LANGS = {"ru": "🇷🇺 Русский", "uk": "🇺🇦 Українська", "en": "🇬🇧 English"}
DEFAULT_LANG = "ru"

TEXTS: dict[str, dict[str, str]] = {
    # ------------------------------------------------------------------ РУССКИЙ
    "ru": {
        "choose_lang": "🌍 Выберите язык / Оберіть мову / Choose language:",
        "choose_currency": "💱 Выберите основную валюту. В ней будет вестись весь учёт:",
        "btn_other_currency": "✏️ Другая",
        "enter_currency": "Введите трёхбуквенный код валюты (например, CZK, GEL, TRY):",
        "bad_currency": "❌ Не знаю такую валюту. Введите код из 3 букв, например CZK.",
        "choose_tz": "🕐 Выберите часовой пояс — он нужен, чтобы напоминания приходили вовремя:",
        "btn_tz_manual": "✏️ Ввести вручную",
        "enter_tz": "Введите часовой пояс в формате <code>Europe/Warsaw</code> или смещение от UTC, например <code>+3</code>:",
        "bad_tz": "❌ Не получилось распознать часовой пояс. Пример: <code>Europe/Kyiv</code> или <code>+2</code>.",
        "welcome": (
            "👋 Готово! Я помогу считать траты и держать полезные привычки.\n\n"
            "<b>Как добавить трату:</b> просто напишите сообщение, например\n"
            "<code>250 еда</code> или <code>кофе 80</code> — я сам пойму сумму и категорию.\n\n"
            "Или пользуйтесь кнопками внизу 👇"
        ),
        "trial_started": "🎁 Вам подарен <b>Premium на {days} дней</b> бесплатно — попробуйте все функции!",
        "main_menu": "Главное меню 👇",
        "help": (
            "<b>Что я умею</b>\n\n"
            "💸 <b>Траты:</b> напишите «250 еда» или «такси 120».\n"
            "/today, /week, /month — статистика\n"
            "/last — последние записи (изменить/удалить)\n\n"
            "✅ <b>Привычки:</b> /habits\n\n"
            "⭐ /premium — Premium-подписка\n"
            "/settings — настройки\n"
            "/paysupport — помощь с оплатой"
        ),
        # Главное меню
        "btn_add": "➕ Трата",
        "btn_stats": "📊 Статистика",
        "btn_habits": "✅ Привычки",
        "btn_tools": "💎 Инструменты",
        "btn_premium": "⭐ Premium",
        "btn_settings": "⚙️ Настройки",
        # Общие
        "btn_cancel": "✖️ Отмена",
        "btn_back": "⬅️ Назад",
        "btn_skip": "⏭ Пропустить",
        "btn_delete": "🗑 Удалить",
        "cancelled": "Отменено.",
        "error": "😔 Что-то пошло не так. Попробуйте ещё раз.",
        "not_found": "Запись не найдена.",
        "bad_number": "❌ Введите положительное число, например <code>250</code> или <code>99.90</code>.",
        "bad_time": "❌ Введите время в формате ЧЧ:ММ, например <code>21:00</code>.",
        # Категории
        "cat_food": "Еда",
        "cat_transport": "Транспорт",
        "cat_fun": "Развлечения",
        "cat_shopping": "Покупки",
        "cat_health": "Здоровье",
        "cat_subs": "Подписки",
        "cat_other": "Другое",
        # Добавление траты
        "ask_amount": "💸 Введите сумму траты:",
        "ask_category": "📂 Выберите категорию для <b>{amount}</b>:",
        "ask_comment": "💬 Добавьте комментарий или нажмите «Пропустить»:",
        "expense_added": "✅ Записано: <b>{amount}</b> — {category}{comment}",
        "converted": " (≈ {base})",
        "not_understood": "🤔 Не понял. Напишите, например: <code>250 еда</code> или <code>кофе 80</code>.",
        "btn_edit": "✏️ Изменить",
        "btn_undo": "↩️ Отменить",
        # Статистика
        "stats_choose": "📊 За какой период показать траты?",
        "btn_today": "Сегодня",
        "btn_week": "Неделя",
        "btn_month": "Месяц",
        "period_today": "📅 Сегодня",
        "period_week": "🗓 Эта неделя",
        "period_month": "📆 {month}",
        "stats_total": "Итого: <b>{total}</b>",
        "stats_empty": "Трат за этот период нет 🙌",
        "btn_chart_pie": "🥧 Диаграмма",
        "btn_chart_days": "📈 По дням",
        "btn_last": "🧾 Последние записи",
        "chart_pie_title": "Траты по категориям — {period}",
        "chart_days_title": "Траты по дням — {period}",
        # Последние записи
        "last_title": "🧾 Последние записи. Нажмите, чтобы изменить или удалить:",
        "last_empty": "Записей пока нет.",
        "exp_card": "{date}\n<b>{amount}</b> — {category}{comment}\nДобавил: {author}",
        "btn_edit_amount": "💰 Сумма",
        "btn_edit_category": "📂 Категория",
        "btn_edit_comment": "💬 Комментарий",
        "deleted": "🗑 Запись удалена.",
        "updated": "✅ Запись обновлена.",
        "enter_new_amount": "Введите новую сумму:",
        "enter_new_comment": "Введите новый комментарий (или «-», чтобы удалить):",
        # Привычки
        "habits_title": "✅ <b>Ваши привычки</b>",
        "habits_empty": "Привычек пока нет. Добавьте первую — например «спорт», «вода 2л» или «чтение».",
        "habit_line": "{mark} <b>{name}</b> — 🔥 {streak} дн.{time}",
        "habit_time": " · ⏰ {time}",
        "btn_habit_add": "➕ Новая привычка",
        "habit_limit": "В бесплатной версии можно вести до {limit} привычек. 💎 В Premium — без ограничений.",
        "ask_habit_name": "Как называется привычка? Например: <i>спорт</i>, <i>вода 2л</i>, <i>чтение</i>.",
        "ask_habit_time": "⏰ Во сколько напоминать? Введите время, например <code>21:00</code>, или выберите:",
        "btn_no_reminder": "🔕 Без напоминаний",
        "habit_added": "✅ Привычка «{name}» добавлена!",
        "habit_reminder": "⏰ Пора: <b>{name}</b>\nСерия: 🔥 {streak} дн.",
        "btn_done": "Выполнено ✅",
        "btn_skip_habit": "Пропустить ❌",
        "habit_done": "💪 Отлично! «{name}» — серия 🔥 {streak} дн.",
        "habit_already": "Сегодня уже отмечено.",
        "habit_skipped": "Пропущено. Серия «{name}» начнётся заново — завтра получится! 🙂",
        "freeze_offer": "🛡 Использовать заморозку серии? Серия не сгорит.\nОсталось заморозок в этом месяце: {left}",
        "btn_use_freeze": "🛡 Заморозить",
        "btn_just_skip": "Просто пропустить",
        "habit_frozen": "🛡 Серия «{name}» сохранена: 🔥 {streak} дн. Осталось заморозок: {left}",
        "no_freezes": "Заморозки в этом месяце закончились.",
        "habit_menu": "<b>{name}</b>\nСерия: 🔥 {streak} дн. · Рекорд: {best} дн.\nНапоминание: {time}",
        "btn_mark_done": "✅ Отметить сегодня",
        "btn_change_time": "⏰ Время",
        "habit_deleted": "🗑 Привычка удалена.",
        "time_updated": "⏰ Время напоминания обновлено.",
        "no_reminder": "нет",
        # Premium
        "premium_info": (
            "⭐ <b>Premium — {stars} Stars в месяц</b> (≈ 2$)\n\n"
            "📸 Распознавание чеков по фото\n"
            "🎤 Голосовой ввод трат\n"
            "📊 Красивые графики\n"
            "🤖 ИИ-анализ каждое воскресенье с советами\n"
            "💰 Бюджеты по категориям с уведомлениями\n"
            "🎯 Цели накопления с прогнозом\n"
            "🌍 Несколько валют с автоконвертацией\n"
            "♾ Безлимитные привычки и свои категории\n"
            "🛡 Заморозка серии 2 раза в месяц\n"
            "📁 Экспорт в Excel/CSV\n"
            "👨‍👩‍👧 Общий бюджет до 3 человек\n\n"
            "{status}"
        ),
        "premium_active": "✅ Ваш Premium активен до <b>{date}</b>.",
        "premium_inactive": "Сейчас у вас бесплатный тариф.",
        "btn_buy": "⭐ Оформить за {stars} Stars / мес",
        "invoice_title": "Premium на 30 дней",
        "invoice_desc": "Чеки, голос, графики, ИИ-анализ, бюджеты, цели и многое другое.",
        "payment_success": "🎉 Спасибо! Premium активен до <b>{date}</b>.",
        "premium_expired": "⌛ Срок Premium закончился. Данные сохранены — продлите подписку, чтобы вернуть все функции: /premium",
        "premium_only": "💎 Эта функция доступна в <b>Premium</b>.",
        "btn_get_premium": "⭐ Подробнее о Premium",
        "paysupport": (
            "💳 <b>Поддержка по оплате</b>\n\n"
            "Оплата проходит через Telegram Stars. Если списание прошло, а Premium не включился, "
            "или вы хотите вернуть средства — напишите нам{contact} и укажите дату платежа.\n"
            "Подписку можно отменить в любой момент в настройках Telegram → Мои Stars."
        ),
        # Инструменты
        "tools_title": "💎 <b>Инструменты</b>",
        "btn_budgets": "💰 Бюджеты",
        "btn_goals": "🎯 Цели",
        "btn_export": "📁 Экспорт",
        "btn_family": "👨‍👩‍👧 Общий бюджет",
        "btn_categories": "🏷 Мои категории",
        "btn_ai_report": "🤖 ИИ-анализ сейчас",
        # Чеки и голос
        "receipt_processing": "🔍 Распознаю чек…",
        "receipt_fail": "😕 Не удалось найти сумму на чеке. Попробуйте фото почётче или введите сумму вручную.",
        "voice_processing": "🎤 Слушаю…",
        "voice_heard": "🎤 Распознал: «{text}»",
        "voice_fail": "😕 Не удалось распознать голосовое. Попробуйте ещё раз.",
        "ai_unavailable": "⚙️ Функция временно недоступна: администратор ещё не подключил ИИ-сервис.",
        # Недельный отчёт
        "weekly_title": "🤖 <b>Еженедельный анализ трат</b>",
        "weekly_empty": "На этой неделе трат не было — отличный повод начать записывать 🙂",
        "weekly_basic": (
            "Потрачено за неделю: <b>{total}</b>\n"
            "Больше всего ушло на: {top} — {top_amount} ({top_pct}%)\n"
            "{compare}\n\n💡 <b>Советы:</b>\n{tips}"
        ),
        "compare_more": "📈 Это на {pct}% больше, чем на прошлой неделе ({prev}).",
        "compare_less": "📉 Это на {pct}% меньше, чем на прошлой неделе ({prev}). Так держать!",
        "compare_none": "Прошлой недели для сравнения пока нет.",
        "tip_top": "• Установите месячный бюджет на «{cat}» — я предупрежу при 80%.",
        "tip_small": "• Мелкие траты ({count} шт. до {limit}) дали {sum}. Попробуйте лимит на «мелочи».",
        "tip_subs": "• Проверьте подписки: возможно, какими-то вы давно не пользуетесь.",
        "tip_generic": "• Планируйте крупные покупки заранее и откладывайте на них через «Цели».",
        "weekly_off": "🔕 Еженедельный отчёт выключен.",
        # Бюджеты
        "budgets_title": "💰 <b>Бюджеты на месяц</b>",
        "budgets_empty": "Бюджетов пока нет. Задайте лимит на категорию — я предупрежу при 80% и 100%.",
        "budget_line": "{category}: {spent} / {limit}\n{bar} {pct}%",
        "btn_budget_add": "➕ Задать лимит",
        "budget_choose_cat": "Для какой категории задать месячный лимит?",
        "budget_ask_limit": "Введите лимит на месяц для {category}:",
        "budget_set": "✅ Лимит для {category}: {limit} в месяц.",
        "budget_deleted": "🗑 Лимит удалён.",
        "budget_warn_80": "⚠️ Вы потратили {pct}% бюджета на {category}: {spent} из {limit}.",
        "budget_warn_100": "🚨 Бюджет на {category} исчерпан: {spent} из {limit}!",
        # Цели
        "goals_title": "🎯 <b>Цели накопления</b>",
        "goals_empty": "Целей пока нет. Например: «Новый телефон: 15000».",
        "goal_line": "<b>{name}</b>\n{bar} {pct}%\n{saved} из {target}{forecast}",
        "goal_forecast": "\n📅 Прогноз: {date}",
        "btn_goal_add": "➕ Новая цель",
        "goal_ask": "Отправьте название и сумму через двоеточие, например:\n<code>Новый телефон: 15000</code>",
        "goal_bad": "❌ Формат: <code>Название: сумма</code>",
        "goal_added": "🎯 Цель «{name}» на {target} создана!",
        "goal_deposit_ask": "Сколько отложили на «{name}»? (отрицательное число — снять)",
        "btn_goal_deposit": "💵 Пополнить",
        "goal_updated": "✅ «{name}»: {saved} из {target}",
        "goal_reached": "🎉 Поздравляю! Цель «{name}» достигнута!",
        "goal_deleted": "🗑 Цель удалена.",
        # Свои категории
        "cats_title": "🏷 <b>Мои категории</b>",
        "cats_empty": "Своих категорий пока нет.",
        "btn_cat_add": "➕ Добавить категорию",
        "cat_ask": "Отправьте эмодзи и название, например: <code>🐶 Питомец</code>",
        "cat_bad": "❌ Формат: <code>🐶 Питомец</code> (эмодзи, пробел, название до 30 символов)",
        "cat_added": "✅ Категория {emoji} {name} добавлена.",
        "cat_deleted": "🗑 Категория скрыта. Старые траты сохранены.",
        # Экспорт
        "export_choose": "📁 В каком формате выгрузить все траты?",
        "export_done": "📁 Ваши данные",
        "export_empty": "Нечего выгружать — трат пока нет.",
        # Общий бюджет
        "family_owner": (
            "👨‍👩‍👧 <b>Общий бюджет</b>\n\nПригласите до {limit} человек — их траты будут попадать в ваш бюджет.\n"
            "Ссылка-приглашение:\n<code>{link}</code>\n\nУчастники:\n{members}"
        ),
        "family_no_members": "— пока никого",
        "family_member": "👨‍👩‍👧 Вы ведёте траты в общем бюджете пользователя <b>{owner}</b>.",
        "btn_family_leave": "🚪 Выйти из общего бюджета",
        "btn_new_link": "🔄 Новая ссылка",
        "family_joined": "✅ Вы присоединились к общему бюджету {owner}! Все ваши траты теперь общие.",
        "family_new_member": "👋 {name} присоединился(-ась) к вашему общему бюджету.",
        "family_full": "😕 В этом общем бюджете уже максимум участников.",
        "family_bad_link": "😕 Ссылка недействительна или устарела.",
        "family_owner_no_premium": "😕 У владельца бюджета нет Premium — присоединиться нельзя.",
        "family_self": "Это ваша собственная ссылка 🙂",
        "family_already": "Вы уже состоите в общем бюджете. Сначала выйдите из него в «💎 Инструменты».",
        "family_has_members": "У вас есть свои участники — общий бюджет может быть только один.",
        "family_left": "🚪 Вы вышли из общего бюджета. Теперь траты снова личные.",
        "family_removed": "Участник удалён.",
        "family_kicked": "Владелец удалил вас из общего бюджета. Траты снова личные.",
        # Настройки
        "settings_title": (
            "⚙️ <b>Настройки</b>\n\nЯзык: {language}\nВалюта: {currency}\nЧасовой пояс: {tz}\n"
            "Еженедельный ИИ-отчёт: {weekly}"
        ),
        "btn_lang": "🌍 Язык",
        "btn_currency": "💱 Валюта",
        "btn_tz": "🕐 Часовой пояс",
        "btn_weekly": "🤖 Отчёт: {state}",
        "on": "вкл",
        "off": "выкл",
        "saved": "✅ Сохранено.",
        "family_currency_locked": "Валюту общего бюджета меняет только его владелец.",
        "multicurrency_premium": "🌍 Траты в других валютах с автоконвертацией доступны в Premium.\nЗаписать как <b>{amount}</b> в основной валюте?",
        "btn_yes_record": "✅ Да, записать",
    },
    # ------------------------------------------------------------------ УКРАЇНСЬКА
    "uk": {
        "choose_lang": "🌍 Выберите язык / Оберіть мову / Choose language:",
        "choose_currency": "💱 Оберіть основну валюту. У ній вестиметься весь облік:",
        "btn_other_currency": "✏️ Інша",
        "enter_currency": "Введіть трилітерний код валюти (наприклад, CZK, GEL, TRY):",
        "bad_currency": "❌ Не знаю такої валюти. Введіть код з 3 літер, наприклад CZK.",
        "choose_tz": "🕐 Оберіть часовий пояс — він потрібен, щоб нагадування приходили вчасно:",
        "btn_tz_manual": "✏️ Ввести вручну",
        "enter_tz": "Введіть часовий пояс у форматі <code>Europe/Warsaw</code> або зсув від UTC, наприклад <code>+3</code>:",
        "bad_tz": "❌ Не вдалося розпізнати часовий пояс. Приклад: <code>Europe/Kyiv</code> або <code>+2</code>.",
        "welcome": (
            "👋 Готово! Я допоможу рахувати витрати й тримати корисні звички.\n\n"
            "<b>Як додати витрату:</b> просто напишіть повідомлення, наприклад\n"
            "<code>250 їжа</code> або <code>кава 80</code> — я сам зрозумію суму й категорію.\n\n"
            "Або користуйтеся кнопками внизу 👇"
        ),
        "trial_started": "🎁 Вам подаровано <b>Premium на {days} днів</b> безкоштовно — спробуйте всі функції!",
        "main_menu": "Головне меню 👇",
        "help": (
            "<b>Що я вмію</b>\n\n"
            "💸 <b>Витрати:</b> напишіть «250 їжа» або «таксі 120».\n"
            "/today, /week, /month — статистика\n"
            "/last — останні записи (змінити/видалити)\n\n"
            "✅ <b>Звички:</b> /habits\n\n"
            "⭐ /premium — Premium-підписка\n"
            "/settings — налаштування\n"
            "/paysupport — допомога з оплатою"
        ),
        "btn_add": "➕ Витрата",
        "btn_stats": "📊 Статистика",
        "btn_habits": "✅ Звички",
        "btn_tools": "💎 Інструменти",
        "btn_premium": "⭐ Premium",
        "btn_settings": "⚙️ Налаштування",
        "btn_cancel": "✖️ Скасувати",
        "btn_back": "⬅️ Назад",
        "btn_skip": "⏭ Пропустити",
        "btn_delete": "🗑 Видалити",
        "cancelled": "Скасовано.",
        "error": "😔 Щось пішло не так. Спробуйте ще раз.",
        "not_found": "Запис не знайдено.",
        "bad_number": "❌ Введіть додатне число, наприклад <code>250</code> або <code>99.90</code>.",
        "bad_time": "❌ Введіть час у форматі ГГ:ХХ, наприклад <code>21:00</code>.",
        "cat_food": "Їжа",
        "cat_transport": "Транспорт",
        "cat_fun": "Розваги",
        "cat_shopping": "Покупки",
        "cat_health": "Здоров'я",
        "cat_subs": "Підписки",
        "cat_other": "Інше",
        "ask_amount": "💸 Введіть суму витрати:",
        "ask_category": "📂 Оберіть категорію для <b>{amount}</b>:",
        "ask_comment": "💬 Додайте коментар або натисніть «Пропустити»:",
        "expense_added": "✅ Записано: <b>{amount}</b> — {category}{comment}",
        "converted": " (≈ {base})",
        "not_understood": "🤔 Не зрозумів. Напишіть, наприклад: <code>250 їжа</code> або <code>кава 80</code>.",
        "btn_edit": "✏️ Змінити",
        "btn_undo": "↩️ Скасувати",
        "stats_choose": "📊 За який період показати витрати?",
        "btn_today": "Сьогодні",
        "btn_week": "Тиждень",
        "btn_month": "Місяць",
        "period_today": "📅 Сьогодні",
        "period_week": "🗓 Цей тиждень",
        "period_month": "📆 {month}",
        "stats_total": "Разом: <b>{total}</b>",
        "stats_empty": "Витрат за цей період немає 🙌",
        "btn_chart_pie": "🥧 Діаграма",
        "btn_chart_days": "📈 По днях",
        "btn_last": "🧾 Останні записи",
        "chart_pie_title": "Витрати за категоріями — {period}",
        "chart_days_title": "Витрати по днях — {period}",
        "last_title": "🧾 Останні записи. Натисніть, щоб змінити або видалити:",
        "last_empty": "Записів поки немає.",
        "exp_card": "{date}\n<b>{amount}</b> — {category}{comment}\nДодав: {author}",
        "btn_edit_amount": "💰 Сума",
        "btn_edit_category": "📂 Категорія",
        "btn_edit_comment": "💬 Коментар",
        "deleted": "🗑 Запис видалено.",
        "updated": "✅ Запис оновлено.",
        "enter_new_amount": "Введіть нову суму:",
        "enter_new_comment": "Введіть новий коментар (або «-», щоб видалити):",
        "habits_title": "✅ <b>Ваші звички</b>",
        "habits_empty": "Звичок поки немає. Додайте першу — наприклад «спорт», «вода 2л» чи «читання».",
        "habit_line": "{mark} <b>{name}</b> — 🔥 {streak} дн.{time}",
        "habit_time": " · ⏰ {time}",
        "btn_habit_add": "➕ Нова звичка",
        "habit_limit": "У безкоштовній версії можна вести до {limit} звичок. 💎 У Premium — без обмежень.",
        "ask_habit_name": "Як називається звичка? Наприклад: <i>спорт</i>, <i>вода 2л</i>, <i>читання</i>.",
        "ask_habit_time": "⏰ О котрій нагадувати? Введіть час, наприклад <code>21:00</code>, або оберіть:",
        "btn_no_reminder": "🔕 Без нагадувань",
        "habit_added": "✅ Звичку «{name}» додано!",
        "habit_reminder": "⏰ Час: <b>{name}</b>\nСерія: 🔥 {streak} дн.",
        "btn_done": "Виконано ✅",
        "btn_skip_habit": "Пропустити ❌",
        "habit_done": "💪 Чудово! «{name}» — серія 🔥 {streak} дн.",
        "habit_already": "Сьогодні вже відмічено.",
        "habit_skipped": "Пропущено. Серія «{name}» почнеться заново — завтра вийде! 🙂",
        "freeze_offer": "🛡 Використати заморозку серії? Серія не згорить.\nЗалишилось заморозок цього місяця: {left}",
        "btn_use_freeze": "🛡 Заморозити",
        "btn_just_skip": "Просто пропустити",
        "habit_frozen": "🛡 Серію «{name}» збережено: 🔥 {streak} дн. Залишилось заморозок: {left}",
        "no_freezes": "Заморозки цього місяця закінчились.",
        "habit_menu": "<b>{name}</b>\nСерія: 🔥 {streak} дн. · Рекорд: {best} дн.\nНагадування: {time}",
        "btn_mark_done": "✅ Відмітити сьогодні",
        "btn_change_time": "⏰ Час",
        "habit_deleted": "🗑 Звичку видалено.",
        "time_updated": "⏰ Час нагадування оновлено.",
        "no_reminder": "немає",
        "premium_info": (
            "⭐ <b>Premium — {stars} Stars на місяць</b> (≈ 2$)\n\n"
            "📸 Розпізнавання чеків за фото\n"
            "🎤 Голосове введення витрат\n"
            "📊 Гарні графіки\n"
            "🤖 ШІ-аналіз щонеділі з порадами\n"
            "💰 Бюджети за категоріями зі сповіщеннями\n"
            "🎯 Цілі накопичення з прогнозом\n"
            "🌍 Кілька валют з автоконвертацією\n"
            "♾ Безлімітні звички та власні категорії\n"
            "🛡 Заморозка серії 2 рази на місяць\n"
            "📁 Експорт в Excel/CSV\n"
            "👨‍👩‍👧 Спільний бюджет до 3 людей\n\n"
            "{status}"
        ),
        "premium_active": "✅ Ваш Premium активний до <b>{date}</b>.",
        "premium_inactive": "Зараз у вас безкоштовний тариф.",
        "btn_buy": "⭐ Оформити за {stars} Stars / міс",
        "invoice_title": "Premium на 30 днів",
        "invoice_desc": "Чеки, голос, графіки, ШІ-аналіз, бюджети, цілі та багато іншого.",
        "payment_success": "🎉 Дякуємо! Premium активний до <b>{date}</b>.",
        "premium_expired": "⌛ Термін Premium закінчився. Дані збережено — продовжте підписку, щоб повернути всі функції: /premium",
        "premium_only": "💎 Ця функція доступна в <b>Premium</b>.",
        "btn_get_premium": "⭐ Детальніше про Premium",
        "paysupport": (
            "💳 <b>Підтримка з оплати</b>\n\n"
            "Оплата проходить через Telegram Stars. Якщо кошти списано, а Premium не ввімкнувся, "
            "або ви хочете повернути кошти — напишіть нам{contact} і вкажіть дату платежу.\n"
            "Підписку можна скасувати будь-коли в налаштуваннях Telegram → Мої Stars."
        ),
        "tools_title": "💎 <b>Інструменти</b>",
        "btn_budgets": "💰 Бюджети",
        "btn_goals": "🎯 Цілі",
        "btn_export": "📁 Експорт",
        "btn_family": "👨‍👩‍👧 Спільний бюджет",
        "btn_categories": "🏷 Мої категорії",
        "btn_ai_report": "🤖 ШІ-аналіз зараз",
        "receipt_processing": "🔍 Розпізнаю чек…",
        "receipt_fail": "😕 Не вдалося знайти суму на чеку. Спробуйте чіткіше фото або введіть суму вручну.",
        "voice_processing": "🎤 Слухаю…",
        "voice_heard": "🎤 Розпізнав: «{text}»",
        "voice_fail": "😕 Не вдалося розпізнати голосове. Спробуйте ще раз.",
        "ai_unavailable": "⚙️ Функція тимчасово недоступна: адміністратор ще не підключив ШІ-сервіс.",
        "weekly_title": "🤖 <b>Щотижневий аналіз витрат</b>",
        "weekly_empty": "Цього тижня витрат не було — чудовий привід почати записувати 🙂",
        "weekly_basic": (
            "Витрачено за тиждень: <b>{total}</b>\n"
            "Найбільше пішло на: {top} — {top_amount} ({top_pct}%)\n"
            "{compare}\n\n💡 <b>Поради:</b>\n{tips}"
        ),
        "compare_more": "📈 Це на {pct}% більше, ніж минулого тижня ({prev}).",
        "compare_less": "📉 Це на {pct}% менше, ніж минулого тижня ({prev}). Так тримати!",
        "compare_none": "Минулого тижня для порівняння поки немає.",
        "tip_top": "• Встановіть місячний бюджет на «{cat}» — я попереджу на 80%.",
        "tip_small": "• Дрібні витрати ({count} шт. до {limit}) склали {sum}. Спробуйте ліміт на «дрібниці».",
        "tip_subs": "• Перевірте підписки: можливо, якимись ви давно не користуєтесь.",
        "tip_generic": "• Плануйте великі покупки заздалегідь і відкладайте на них через «Цілі».",
        "weekly_off": "🔕 Щотижневий звіт вимкнено.",
        "budgets_title": "💰 <b>Бюджети на місяць</b>",
        "budgets_empty": "Бюджетів поки немає. Задайте ліміт на категорію — я попереджу на 80% і 100%.",
        "budget_line": "{category}: {spent} / {limit}\n{bar} {pct}%",
        "btn_budget_add": "➕ Задати ліміт",
        "budget_choose_cat": "Для якої категорії задати місячний ліміт?",
        "budget_ask_limit": "Введіть ліміт на місяць для {category}:",
        "budget_set": "✅ Ліміт для {category}: {limit} на місяць.",
        "budget_deleted": "🗑 Ліміт видалено.",
        "budget_warn_80": "⚠️ Ви витратили {pct}% бюджету на {category}: {spent} з {limit}.",
        "budget_warn_100": "🚨 Бюджет на {category} вичерпано: {spent} з {limit}!",
        "goals_title": "🎯 <b>Цілі накопичення</b>",
        "goals_empty": "Цілей поки немає. Наприклад: «Новий телефон: 15000».",
        "goal_line": "<b>{name}</b>\n{bar} {pct}%\n{saved} з {target}{forecast}",
        "goal_forecast": "\n📅 Прогноз: {date}",
        "btn_goal_add": "➕ Нова ціль",
        "goal_ask": "Надішліть назву та суму через двокрапку, наприклад:\n<code>Новий телефон: 15000</code>",
        "goal_bad": "❌ Формат: <code>Назва: сума</code>",
        "goal_added": "🎯 Ціль «{name}» на {target} створено!",
        "goal_deposit_ask": "Скільки відклали на «{name}»? (від'ємне число — зняти)",
        "btn_goal_deposit": "💵 Поповнити",
        "goal_updated": "✅ «{name}»: {saved} з {target}",
        "goal_reached": "🎉 Вітаю! Ціль «{name}» досягнуто!",
        "goal_deleted": "🗑 Ціль видалено.",
        "cats_title": "🏷 <b>Мої категорії</b>",
        "cats_empty": "Власних категорій поки немає.",
        "btn_cat_add": "➕ Додати категорію",
        "cat_ask": "Надішліть емодзі та назву, наприклад: <code>🐶 Улюбленець</code>",
        "cat_bad": "❌ Формат: <code>🐶 Улюбленець</code> (емодзі, пробіл, назва до 30 символів)",
        "cat_added": "✅ Категорію {emoji} {name} додано.",
        "cat_deleted": "🗑 Категорію приховано. Старі витрати збережено.",
        "export_choose": "📁 У якому форматі вивантажити всі витрати?",
        "export_done": "📁 Ваші дані",
        "export_empty": "Нічого вивантажувати — витрат поки немає.",
        "family_owner": (
            "👨‍👩‍👧 <b>Спільний бюджет</b>\n\nЗапросіть до {limit} людей — їхні витрати потраплятимуть у ваш бюджет.\n"
            "Посилання-запрошення:\n<code>{link}</code>\n\nУчасники:\n{members}"
        ),
        "family_no_members": "— поки нікого",
        "family_member": "👨‍👩‍👧 Ви ведете витрати в спільному бюджеті користувача <b>{owner}</b>.",
        "btn_family_leave": "🚪 Вийти зі спільного бюджету",
        "btn_new_link": "🔄 Нове посилання",
        "family_joined": "✅ Ви приєдналися до спільного бюджету {owner}! Усі ваші витрати тепер спільні.",
        "family_new_member": "👋 {name} приєднався(-лася) до вашого спільного бюджету.",
        "family_full": "😕 У цьому спільному бюджеті вже максимум учасників.",
        "family_bad_link": "😕 Посилання недійсне або застаріле.",
        "family_owner_no_premium": "😕 У власника бюджету немає Premium — приєднатися не можна.",
        "family_self": "Це ваше власне посилання 🙂",
        "family_already": "Ви вже в спільному бюджеті. Спочатку вийдіть із нього в «💎 Інструменти».",
        "family_has_members": "У вас є власні учасники — спільний бюджет може бути лише один.",
        "family_left": "🚪 Ви вийшли зі спільного бюджету. Тепер витрати знову особисті.",
        "family_removed": "Учасника видалено.",
        "family_kicked": "Власник видалив вас зі спільного бюджету. Витрати знову особисті.",
        "settings_title": (
            "⚙️ <b>Налаштування</b>\n\nМова: {language}\nВалюта: {currency}\nЧасовий пояс: {tz}\n"
            "Щотижневий ШІ-звіт: {weekly}"
        ),
        "btn_lang": "🌍 Мова",
        "btn_currency": "💱 Валюта",
        "btn_tz": "🕐 Часовий пояс",
        "btn_weekly": "🤖 Звіт: {state}",
        "on": "увімк",
        "off": "вимк",
        "saved": "✅ Збережено.",
        "family_currency_locked": "Валюту спільного бюджету змінює лише його власник.",
        "multicurrency_premium": "🌍 Витрати в інших валютах з автоконвертацією доступні в Premium.\nЗаписати як <b>{amount}</b> в основній валюті?",
        "btn_yes_record": "✅ Так, записати",
    },
    # ------------------------------------------------------------------ ENGLISH
    "en": {
        "choose_lang": "🌍 Выберите язык / Оберіть мову / Choose language:",
        "choose_currency": "💱 Choose your main currency. All tracking will be done in it:",
        "btn_other_currency": "✏️ Other",
        "enter_currency": "Enter a 3-letter currency code (e.g. CZK, GEL, TRY):",
        "bad_currency": "❌ Unknown currency. Enter a 3-letter code such as CZK.",
        "choose_tz": "🕐 Choose your time zone so reminders arrive on time:",
        "btn_tz_manual": "✏️ Enter manually",
        "enter_tz": "Enter a time zone like <code>Europe/Warsaw</code> or a UTC offset like <code>+3</code>:",
        "bad_tz": "❌ Couldn't recognize the time zone. Example: <code>Europe/London</code> or <code>+2</code>.",
        "welcome": (
            "👋 All set! I'll help you track spending and keep good habits.\n\n"
            "<b>To add an expense</b> just send a message like\n"
            "<code>250 food</code> or <code>coffee 4</code> — I'll figure out the amount and category.\n\n"
            "Or use the buttons below 👇"
        ),
        "trial_started": "🎁 You've got <b>{days} days of Premium</b> for free — try every feature!",
        "main_menu": "Main menu 👇",
        "help": (
            "<b>What I can do</b>\n\n"
            "💸 <b>Expenses:</b> send “250 food” or “taxi 12”.\n"
            "/today, /week, /month — stats\n"
            "/last — recent records (edit/delete)\n\n"
            "✅ <b>Habits:</b> /habits\n\n"
            "⭐ /premium — Premium subscription\n"
            "/settings — settings\n"
            "/paysupport — payment support"
        ),
        "btn_add": "➕ Expense",
        "btn_stats": "📊 Stats",
        "btn_habits": "✅ Habits",
        "btn_tools": "💎 Tools",
        "btn_premium": "⭐ Premium",
        "btn_settings": "⚙️ Settings",
        "btn_cancel": "✖️ Cancel",
        "btn_back": "⬅️ Back",
        "btn_skip": "⏭ Skip",
        "btn_delete": "🗑 Delete",
        "cancelled": "Cancelled.",
        "error": "😔 Something went wrong. Please try again.",
        "not_found": "Record not found.",
        "bad_number": "❌ Enter a positive number, e.g. <code>250</code> or <code>99.90</code>.",
        "bad_time": "❌ Enter the time as HH:MM, e.g. <code>21:00</code>.",
        "cat_food": "Food",
        "cat_transport": "Transport",
        "cat_fun": "Entertainment",
        "cat_shopping": "Shopping",
        "cat_health": "Health",
        "cat_subs": "Subscriptions",
        "cat_other": "Other",
        "ask_amount": "💸 Enter the amount:",
        "ask_category": "📂 Choose a category for <b>{amount}</b>:",
        "ask_comment": "💬 Add a comment or tap “Skip”:",
        "expense_added": "✅ Saved: <b>{amount}</b> — {category}{comment}",
        "converted": " (≈ {base})",
        "not_understood": "🤔 I didn't get that. Try: <code>250 food</code> or <code>coffee 4</code>.",
        "btn_edit": "✏️ Edit",
        "btn_undo": "↩️ Undo",
        "stats_choose": "📊 Which period?",
        "btn_today": "Today",
        "btn_week": "Week",
        "btn_month": "Month",
        "period_today": "📅 Today",
        "period_week": "🗓 This week",
        "period_month": "📆 {month}",
        "stats_total": "Total: <b>{total}</b>",
        "stats_empty": "No expenses for this period 🙌",
        "btn_chart_pie": "🥧 Pie chart",
        "btn_chart_days": "📈 By day",
        "btn_last": "🧾 Recent records",
        "chart_pie_title": "Spending by category — {period}",
        "chart_days_title": "Spending by day — {period}",
        "last_title": "🧾 Recent records. Tap one to edit or delete:",
        "last_empty": "No records yet.",
        "exp_card": "{date}\n<b>{amount}</b> — {category}{comment}\nAdded by: {author}",
        "btn_edit_amount": "💰 Amount",
        "btn_edit_category": "📂 Category",
        "btn_edit_comment": "💬 Comment",
        "deleted": "🗑 Record deleted.",
        "updated": "✅ Record updated.",
        "enter_new_amount": "Enter the new amount:",
        "enter_new_comment": "Enter a new comment (or “-” to remove it):",
        "habits_title": "✅ <b>Your habits</b>",
        "habits_empty": "No habits yet. Add one — e.g. “workout”, “2L water” or “reading”.",
        "habit_line": "{mark} <b>{name}</b> — 🔥 {streak} d{time}",
        "habit_time": " · ⏰ {time}",
        "btn_habit_add": "➕ New habit",
        "habit_limit": "The free plan allows up to {limit} habits. 💎 Premium has no limit.",
        "ask_habit_name": "What's the habit called? E.g. <i>workout</i>, <i>2L water</i>, <i>reading</i>.",
        "ask_habit_time": "⏰ When should I remind you? Enter a time like <code>21:00</code> or choose:",
        "btn_no_reminder": "🔕 No reminder",
        "habit_added": "✅ Habit “{name}” added!",
        "habit_reminder": "⏰ Time for: <b>{name}</b>\nStreak: 🔥 {streak} d",
        "btn_done": "Done ✅",
        "btn_skip_habit": "Skip ❌",
        "habit_done": "💪 Great! “{name}” — streak 🔥 {streak} d",
        "habit_already": "Already marked today.",
        "habit_skipped": "Skipped. The “{name}” streak starts over — you'll get it tomorrow! 🙂",
        "freeze_offer": "🛡 Use a streak freeze? Your streak won't be lost.\nFreezes left this month: {left}",
        "btn_use_freeze": "🛡 Freeze",
        "btn_just_skip": "Just skip",
        "habit_frozen": "🛡 “{name}” streak saved: 🔥 {streak} d. Freezes left: {left}",
        "no_freezes": "No freezes left this month.",
        "habit_menu": "<b>{name}</b>\nStreak: 🔥 {streak} d · Best: {best} d\nReminder: {time}",
        "btn_mark_done": "✅ Mark today",
        "btn_change_time": "⏰ Time",
        "habit_deleted": "🗑 Habit deleted.",
        "time_updated": "⏰ Reminder time updated.",
        "no_reminder": "none",
        "premium_info": (
            "⭐ <b>Premium — {stars} Stars per month</b> (≈ $2)\n\n"
            "📸 Receipt recognition from photos\n"
            "🎤 Voice input\n"
            "📊 Beautiful charts\n"
            "🤖 AI analysis every Sunday with tips\n"
            "💰 Category budgets with alerts\n"
            "🎯 Savings goals with forecasts\n"
            "🌍 Multiple currencies with auto-conversion\n"
            "♾ Unlimited habits and custom categories\n"
            "🛡 Streak freeze twice a month\n"
            "📁 Export to Excel/CSV\n"
            "👨‍👩‍👧 Shared budget for up to 3 people\n\n"
            "{status}"
        ),
        "premium_active": "✅ Your Premium is active until <b>{date}</b>.",
        "premium_inactive": "You're on the free plan.",
        "btn_buy": "⭐ Subscribe for {stars} Stars / mo",
        "invoice_title": "Premium for 30 days",
        "invoice_desc": "Receipts, voice, charts, AI analysis, budgets, goals and more.",
        "payment_success": "🎉 Thank you! Premium is active until <b>{date}</b>.",
        "premium_expired": "⌛ Your Premium has expired. Your data is safe — renew to get every feature back: /premium",
        "premium_only": "💎 This feature is available in <b>Premium</b>.",
        "btn_get_premium": "⭐ About Premium",
        "paysupport": (
            "💳 <b>Payment support</b>\n\n"
            "Payments are made with Telegram Stars. If you were charged but Premium didn't turn on, "
            "or you'd like a refund — contact us{contact} and include the payment date.\n"
            "You can cancel the subscription anytime in Telegram Settings → My Stars."
        ),
        "tools_title": "💎 <b>Tools</b>",
        "btn_budgets": "💰 Budgets",
        "btn_goals": "🎯 Goals",
        "btn_export": "📁 Export",
        "btn_family": "👨‍👩‍👧 Shared budget",
        "btn_categories": "🏷 My categories",
        "btn_ai_report": "🤖 AI analysis now",
        "receipt_processing": "🔍 Reading the receipt…",
        "receipt_fail": "😕 Couldn't find the total on the receipt. Try a sharper photo or enter the amount manually.",
        "voice_processing": "🎤 Listening…",
        "voice_heard": "🎤 Heard: “{text}”",
        "voice_fail": "😕 Couldn't recognize the voice message. Please try again.",
        "ai_unavailable": "⚙️ This feature is temporarily unavailable: the admin hasn't connected the AI service yet.",
        "weekly_title": "🤖 <b>Weekly spending analysis</b>",
        "weekly_empty": "No expenses this week — a great time to start tracking 🙂",
        "weekly_basic": (
            "Spent this week: <b>{total}</b>\n"
            "Biggest category: {top} — {top_amount} ({top_pct}%)\n"
            "{compare}\n\n💡 <b>Tips:</b>\n{tips}"
        ),
        "compare_more": "📈 That's {pct}% more than last week ({prev}).",
        "compare_less": "📉 That's {pct}% less than last week ({prev}). Keep it up!",
        "compare_none": "No previous week to compare yet.",
        "tip_top": "• Set a monthly budget for “{cat}” — I'll warn you at 80%.",
        "tip_small": "• Small purchases ({count} under {limit}) added up to {sum}. Try a “small stuff” limit.",
        "tip_subs": "• Review your subscriptions — you may not use some of them anymore.",
        "tip_generic": "• Plan big purchases in advance and save for them with “Goals”.",
        "weekly_off": "🔕 Weekly report is off.",
        "budgets_title": "💰 <b>Monthly budgets</b>",
        "budgets_empty": "No budgets yet. Set a category limit — I'll warn you at 80% and 100%.",
        "budget_line": "{category}: {spent} / {limit}\n{bar} {pct}%",
        "btn_budget_add": "➕ Set a limit",
        "budget_choose_cat": "Which category should get a monthly limit?",
        "budget_ask_limit": "Enter the monthly limit for {category}:",
        "budget_set": "✅ Limit for {category}: {limit} per month.",
        "budget_deleted": "🗑 Limit removed.",
        "budget_warn_80": "⚠️ You've spent {pct}% of the {category} budget: {spent} of {limit}.",
        "budget_warn_100": "🚨 The {category} budget is used up: {spent} of {limit}!",
        "goals_title": "🎯 <b>Savings goals</b>",
        "goals_empty": "No goals yet. Example: “New phone: 800”.",
        "goal_line": "<b>{name}</b>\n{bar} {pct}%\n{saved} of {target}{forecast}",
        "goal_forecast": "\n📅 Forecast: {date}",
        "btn_goal_add": "➕ New goal",
        "goal_ask": "Send the name and amount separated by a colon, e.g.:\n<code>New phone: 800</code>",
        "goal_bad": "❌ Format: <code>Name: amount</code>",
        "goal_added": "🎯 Goal “{name}” for {target} created!",
        "goal_deposit_ask": "How much did you save for “{name}”? (negative number to withdraw)",
        "btn_goal_deposit": "💵 Add money",
        "goal_updated": "✅ “{name}”: {saved} of {target}",
        "goal_reached": "🎉 Congratulations! Goal “{name}” reached!",
        "goal_deleted": "🗑 Goal deleted.",
        "cats_title": "🏷 <b>My categories</b>",
        "cats_empty": "No custom categories yet.",
        "btn_cat_add": "➕ Add category",
        "cat_ask": "Send an emoji and a name, e.g.: <code>🐶 Pet</code>",
        "cat_bad": "❌ Format: <code>🐶 Pet</code> (emoji, space, name up to 30 characters)",
        "cat_added": "✅ Category {emoji} {name} added.",
        "cat_deleted": "🗑 Category hidden. Old expenses are kept.",
        "export_choose": "📁 Which format should I export all expenses in?",
        "export_done": "📁 Your data",
        "export_empty": "Nothing to export — no expenses yet.",
        "family_owner": (
            "👨‍👩‍👧 <b>Shared budget</b>\n\nInvite up to {limit} people — their expenses will go into your budget.\n"
            "Invite link:\n<code>{link}</code>\n\nMembers:\n{members}"
        ),
        "family_no_members": "— nobody yet",
        "family_member": "👨‍👩‍👧 You're tracking expenses in <b>{owner}</b>'s shared budget.",
        "btn_family_leave": "🚪 Leave shared budget",
        "btn_new_link": "🔄 New link",
        "family_joined": "✅ You've joined {owner}'s shared budget! All your expenses are now shared.",
        "family_new_member": "👋 {name} joined your shared budget.",
        "family_full": "😕 This shared budget already has the maximum number of members.",
        "family_bad_link": "😕 This link is invalid or expired.",
        "family_owner_no_premium": "😕 The budget owner doesn't have Premium — you can't join.",
        "family_self": "That's your own link 🙂",
        "family_already": "You're already in a shared budget. Leave it first in “💎 Tools”.",
        "family_has_members": "You have your own members — you can only be in one shared budget.",
        "family_left": "🚪 You left the shared budget. Your expenses are personal again.",
        "family_removed": "Member removed.",
        "family_kicked": "The owner removed you from the shared budget. Your expenses are personal again.",
        "settings_title": (
            "⚙️ <b>Settings</b>\n\nLanguage: {language}\nCurrency: {currency}\nTime zone: {tz}\n"
            "Weekly AI report: {weekly}"
        ),
        "btn_lang": "🌍 Language",
        "btn_currency": "💱 Currency",
        "btn_tz": "🕐 Time zone",
        "btn_weekly": "🤖 Report: {state}",
        "on": "on",
        "off": "off",
        "saved": "✅ Saved.",
        "family_currency_locked": "Only the owner can change the shared budget currency.",
        "multicurrency_premium": "🌍 Expenses in other currencies with auto-conversion are a Premium feature.\nSave it as <b>{amount}</b> in your main currency?",
        "btn_yes_record": "✅ Yes, save it",
    },
}

MONTHS = {
    "ru": ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август",
           "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    "uk": ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень",
           "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
    "en": ["January", "February", "March", "April", "May", "June", "July", "August",
           "September", "October", "November", "December"],
}


def t(lang: str | None, key: str, **kwargs) -> str:
    """Возвращает перевод строки. Если перевода нет — берёт русский, затем сам ключ."""
    lang = lang if lang in TEXTS else DEFAULT_LANG
    text = TEXTS[lang].get(key) or TEXTS[DEFAULT_LANG].get(key) or key
    if kwargs:
        try:
            return text.format(**kwargs)
        except (KeyError, IndexError, ValueError):
            return text
    return text


def all_variants(key: str) -> set[str]:
    """Все переводы кнопки — чтобы распознавать её текст на любом языке."""
    return {TEXTS[lang][key] for lang in TEXTS if key in TEXTS[lang]}
