# The Point im Stadtpark Uerdingen — сайт

Новая версия сайта ресторана: статический сайт на **Astro**, языки DE (основной) и EN.
Сайт не использует трекинг и не ставит cookies, поэтому cookie-баннер не нужен.

## Быстрый старт

```bash
cd the-point
npm install
npm run dev        # локально: http://localhost:4321  (англ. версия: /en/)
npm run build      # готовый сайт попадает в папку dist/
npm run preview    # посмотреть собранную версию
```

## Готовая папка сайта: `site/` (чистые HTML + CSS)

В корне репозитория лежит папка **`site/`**. Это готовый сайт без Node.js и Astro: только HTML-страницы, один `css/style.css`, шрифты и фото. Все ссылки в нём относительные, поэтому:
- сайт открывается **двойным кликом** по `site/index.html` прямо с компьютера;
- папку можно загрузить на **любой хостинг** как есть: Netlify, Cloudflare Pages, GitHub Pages или обычный FTP.

```
site/
├── index.html            ← главная (DE)
├── en/index.html         ← главная (EN)
├── impressum/  datenschutz/  en/imprint/  en/privacy/
├── css/style.css         ← все стили
├── fonts/                ← шрифты (без Google Fonts)
├── images/               ← фото (WebP + оригиналы)
├── robots.txt  sitemap.xml  favicon.svg
```

**Важно:** `site/` создаётся автоматически. Правки делаются в `the-point/` (данные, тексты, стили), а потом папка пересобирается:

```bash
cd the-point
npm run export     # собирает сайт и заново создаёт ../site/
```

Если отредактировать `site/` вручную, при следующем `npm run export` правки пропадут.

## Где что лежит

| Что менять | Файл |
|---|---|
| Часы работы | `src/data/hours.json` |
| Меню (блюда, цены) | `src/data/menu.json` |
| События (Events) | `src/data/events.json` |
| Адрес, телефон, e-mail, Instagram/Facebook, ссылка на отзывы | `src/site.ts` |
| Все тексты сайта (DE и EN) | `src/i18n.ts` |
| Фото | `public/images/original/` → потом `npm run images` |
| Домен сайта | `astro.config.mjs` → `site` |
| Impressum / Datenschutz | `src/components/Legal.astro` |

После каждого изменения выполните `npm run build` или просто сделайте push на GitHub: Netlify пересоберёт сайт сам.

---

## Как менять часы работы

Файл `src/data/hours.json`. Один день — одна строка:

```json
{ "day": "tu", "open": "10:00", "close": "22:00" }
```

- `day`: `mo` (Пн), `tu`, `we`, `th`, `fr`, `sa`, `su` (Вс)
- выходной: `{ "day": "mo", "closed": true }`
- время закрытия неизвестно: `"close": null`. На сайте появится `[PLATZHALTER: Uhrzeit]`.

Таблица часов, бейдж «Jetzt geöffnet / Geschlossen» (считается по берлинскому времени) и данные для Google (Schema.org) берутся **из этого одного файла**.

> ⚠️ Нужно уточнить у владельца: на старом сайте в субботу указано **13:00–22:00**, а в ТЗ было «ab 11:00». Сейчас на сайте 13:00–22:00. Время закрытия в воскресенье неизвестно.

## Как менять меню

Файл `src/data/menu.json`. Структура: **категория → блюдо → описание → цена**.

```json
{
  "id": "mittagessen",
  "name": { "de": "Mittagessen", "en": "Lunch" },
  "items": [
    {
      "name": { "de": "Schnitzel Wiener Art", "en": "Vienna-style schnitzel" },
      "description": { "de": "mit Pommes und Salat", "en": "with fries and salad" },
      "price": 14.5
    }
  ]
}
```

- `price` записывается числом с точкой (`14.5` → на сайте «14,50 €»). Если цены нет, пишите `null`.
- Каждая категория автоматически становится вкладкой.
- Записи с `"placeholder": true` — это жёлтые плейсхолдеры. Удалите их, когда внесёте настоящие блюда.
- Ссылки «Karte herunterladen» лежат в разделе `pdfs`. **Совет:** сохраните оба PDF в `public/menu/` и укажите ссылки вида `/menu/Hauptkarte.pdf`, потому что после ухода с eatbu.com старые ссылки на CDN могут перестать работать.

> На момент сборки PDF меню скачать не удалось (доступ был заблокирован), поэтому настоящих блюд в `menu.json` пока нет. Ничего не выдумано: заполнены только Wochenangebote из ТЗ (Schnitzelbuffet 13,90 € и т. д.).

## Как добавлять события

Файл `src/data/events.json`:

```json
{
  "id": "spare-ribs-buffet",
  "date": "2026-11-14",
  "endDate": "2026-11-15",
  "time": "ab 18:00",
  "image": "spanferkel-grill",
  "title":    { "de": "Spare Ribs Buffet", "en": "Spare Ribs Buffet" },
  "subtitle": { "de": "Wir gehen in die zweite Runde!", "en": "We're going for round two!" },
  "text":     { "de": "Schnell noch einen Platz ergattern!", "en": "Grab your seat while you still can!" }
}
```

- `date` **обязательна** (формат `ГГГГ-ММ-ДД`), без неё сборка остановится с ошибкой.
- `endDate` и `time` необязательны.
- Прошедшие события скрываются сами: при сборке и в браузере посетителя, даже если сайт давно не пересобирали. Если событий нет, показывается текст «Gerade sind keine Events geplant …».
- `image`: имя фото без размера и расширения (см. ниже).
- `"dateIsPlaceholder": true` показывает `[PLATZHALTER: Datum]` вместо даты. Сейчас так отмечен Spare Ribs Buffet, потому что настоящей даты нет. Впишите дату и удалите этот флаг.

## Как добавить фото

1. Положите JPG/PNG в `public/images/original/`, например `terrasse.jpg`.
2. Выполните `npm run images`. Появятся `terrasse-400.webp` и `terrasse-800.webp`.
3. Используйте имя `terrasse` в `src/i18n.ts` → `gallery.items`. Обязательно добавьте `alt`: короткое описание фото на немецком и английском.

Чтобы заменить фото на главном экране (Hero), поменяйте `innenraum-tische` в `src/components/Home.astro`, в блоке `<!-- HERO -->`.

---

## Публикация на Cloudflare Pages (через GitHub)

1. Зайдите на https://dash.cloudflare.com → **Workers & Pages → Create → Pages → Connect to Git** и выберите репозиторий.
2. Настройки:
   - **Framework preset:** None
   - **Build command:** оставить пустым
   - **Build output directory:** `site`
3. **Save and Deploy**. Сайт появится по адресу `имя.pages.dev`, и каждый push будет обновлять его автоматически (после `npm run export` и коммита папки `site/`).
4. Свой домен: **Custom domains → Set up a custom domain**. Если домен уже в Cloudflare, DNS настроится сам.

## Публикация на Netlify

1. Зарегистрируйтесь на https://app.netlify.com через GitHub.
2. Нажмите **Add new site → Import an existing project → GitHub** и выберите репозиторий.
3. Настройки сборки (они уже записаны в `the-point/netlify.toml`):
   - **Base directory:** `the-point`
   - **Build command:** `npm run build`
   - **Publish directory:** `the-point/dist`

   Самый быстрый вариант без настроек: перетащите папку `site/` на https://app.netlify.com/drop.
4. Нажмите **Deploy**. Через минуту сайт будет доступен по адресу вида `имя.netlify.app`.

Дальше каждый `git push` в выбранную ветку автоматически обновляет сайт.

## Подключение своего домена (например, thepoint-uerdingen.de)

1. **Купите домен** у любого регистратора: IONOS, Strato, INWX и т. п. Домены `.de` стоят примерно 1–12 € в год.
2. В Netlify откройте **Site configuration → Domain management → Add a domain** и введите `thepoint-uerdingen.de`.
3. Настройте DNS. Есть два варианта:
   - **Проще:** выберите «Netlify DNS» и пропишите у регистратора 4 nameserver'а, которые покажет Netlify (`dns1.p0X.nsone.net` …).
   - **Или вручную у регистратора:**
     - запись `A` для `thepoint-uerdingen.de` → `75.2.60.5`
     - запись `CNAME` для `www` → `имя-сайта.netlify.app`
4. HTTPS-сертификат Netlify выпустит сам (Let's Encrypt), бесплатно. Обычно это занимает от 10 минут до нескольких часов.
5. **Если домен другой**, замените его в `astro.config.mjs` (`site: 'https://…'`) и сделайте push. От этого зависят canonical-ссылки, `sitemap.xml` и `robots.txt`.
6. После запуска:
   - в **Google Business Profile** (Google Maps) укажите новый адрес сайта;
   - добавьте сайт в **Google Search Console** и отправьте `https://thepoint-uerdingen.de/sitemap.xml`;
   - старый сайт на eatbu.com попросите отключить или поставить на нём ссылку на новый адрес, чтобы в Google не было двух сайтов.

---

## Что ещё заполнить (поиск: `PLATZHALTER`)

- [ ] Время закрытия в воскресенье, подтвердить часы в субботу
- [ ] Меню из Hauptkarte.pdf / Speisekarte.pdf
- [ ] Дата Spare Ribs Buffet
- [ ] 2–3 настоящих отзыва из Google (`src/components/Home.astro`, блок `BEWERTUNGEN`)
- [ ] Ссылки Instagram/Facebook и на отзывы Google (`src/site.ts`)
- [ ] Фото террасы или вида на теннисный корт для Hero (в хорошем качестве)
- [ ] Проверить Impressum и Datenschutz у юриста

## Проверено

- Lighthouse (production-сборка): mobile — Performance 95–97, Accessibility 100, Best Practices 100, SEO 100; desktop — 100/100/100/100.
- Ширина 390 px и 1440 px: без горизонтальной прокрутки, кнопки ≥ 44 px.
- Шрифты Bricolage Grotesque и Source Sans 3 хранятся на самом сайте (`@fontsource`), без запросов к Google Fonts.
