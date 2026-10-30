#!/usr/bin/env python3
"""IRON CLUB concept site generator: shared components + EN/RU copy -> 14 static pages.

Run:  python3 iron-club/build.py
English pages land in iron-club/, Russian pages in iron-club/ru/.
Every text is written as L("English", "Русский") so both languages stay in sync.
"""
import argparse
import html
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent
LANG = "en"


def L(en, ru):
    return en if LANG == "en" else ru


e = html.escape

PAGES = [  # file, nav label EN, nav label RU (index is reached via the logo)
    ("index.html", "Home", "Главная"),
    ("training.html", "Training", "Тренировки"),
    ("membership.html", "Membership", "Абонементы"),
    ("coaches.html", "Coaches", "Тренеры"),
    ("about.html", "About", "О клубе"),
    ("contact.html", "Contact", "Контакты"),
    ("free-trial.html", "Free trial", "Пробная"),
]
NAV = PAGES[1:6]
EMAIL = "hello@ironclub.example"
HOURS = [("Mon–Fri", "Пн–Пт", "06:00–23:00"), ("Sat–Sun", "Сб–Вс", "08:00–21:00")]


PHOTO_ON = False
PHOTO_SIZE = {"athlete": (746, 934), "gym": (750, 720), "ropes": (750, 936), "coaching": (750, 936), "led": (608, 416)}


def photo(key, alt, art, caption, cls="", ratio=None):
    """Real photo when available (private preview build), neon slot otherwise."""
    if PHOTO_ON and key in PHOTO_SIZE:
        w, h = PHOTO_SIZE[key]
        st = f' style="aspect-ratio:{ratio}"' if ratio else ""
        return (f'<figure class="photo {cls}"{st}><img src="{prefix()}assets/img/{key}.webp" width="{w}" height="{h}" '
                f'alt="{e(alt)}" loading="lazy" decoding="async"></figure>')
    return slot(art, caption, cls, ratio)


def prefix():
    return "" if LANG == "en" else "../"


# ---------------------------------------------------------------- svg
def led_corridor():
    """Perspective corridor of LED frames, drawn from the club-interior concept."""
    vx, vy = 1120, 420
    far = (vx - 70, vy - 46, vx + 70, vy + 46)
    near = (-260, -420, 2500, 1300)

    def rect(t):
        s = t ** 2.2
        return tuple(f + (n - f) * s for f, n in zip(far, near))

    parts = []
    for i, t in enumerate([0.18, 0.32, 0.46, 0.6, 0.74, 0.88]):
        x1, y1, x2, y2 = rect(t)
        op = 0.25 + t * 0.6
        parts.append(f'<rect x="{x1:.0f}" y="{y1:.0f}" width="{x2 - x1:.0f}" height="{y2 - y1:.0f}" fill="none" stroke="#ff5a1f" stroke-opacity="{op:.2f}" stroke-width="{1 + t * 5:.1f}" filter="url(#glow)"/>')
    # ceiling LED strips (animated) and floor seams
    for fx, nx in [(vx - 30, 300), (vx + 30, 1900)]:
        parts.append(f'<path class="led-flow" d="M{fx} {far[1]} L{nx} -420" stroke="#ff7a45" stroke-width="5" filter="url(#glow)"/>')
    for k in range(-4, 5):
        parts.append(f'<path d="M{vx + k * 12} {far[3]} L{vx + k * 520} 1300" stroke="#ffffff" stroke-opacity=".05" stroke-width="2"/>')
    # rack silhouettes along the floor
    for t in [0.4, 0.55, 0.7]:
        x1, y1, x2, y2 = rect(t)
        h = (y2 - y1) * 0.22
        w = (x2 - x1) * 0.05
        for x in (x1 + (x2 - x1) * 0.08, x2 - (x2 - x1) * 0.13):
            parts.append(f'<rect x="{x:.0f}" y="{y2 - h:.0f}" width="{w:.0f}" height="{h:.0f}" fill="#1a1a1a" stroke="#ff5a1f" stroke-opacity=".25"/>')
    return f"""<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
<defs>
  <radialGradient id="bgGlow" cx="0.7" cy="0.47" r="0.6"><stop offset="0" stop-color="#3a1a0c"/><stop offset=".5" stop-color="#140d0a"/><stop offset="1" stop-color="#0b0b0b"/></radialGradient>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<rect width="1600" height="900" fill="url(#bgGlow)"/>
{''.join(parts)}
</svg>"""


SPRITE = """<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<symbol id="i-arrow" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6"/></symbol>
<symbol id="i-menu" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16"/></symbol>
<symbol id="i-close" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M6 6l12 12M18 6 6 18"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="m5 12 5 5 9-10"/></symbol>
<symbol id="i-x" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M7 7l10 10M17 7 7 17"/></symbol>
<symbol id="i-pin" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></g></symbol>
<symbol id="i-phone" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></symbol>
<symbol id="i-mail" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></g></symbol>
<symbol id="i-clock" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></g></symbol>
<symbol id="n-dumbbell" viewBox="0 0 200 200"><g class="neon"><rect x="22" y="70" width="18" height="60" rx="4"/><rect x="42" y="58" width="22" height="84" rx="5"/><rect x="136" y="58" width="22" height="84" rx="5"/><rect x="160" y="70" width="18" height="60" rx="4"/><path d="M64 100h72"/></g></symbol>
<symbol id="n-barbell" viewBox="0 0 200 200"><g class="neon"><path d="M8 100h184"/><rect x="30" y="52" width="14" height="96" rx="4"/><rect x="48" y="64" width="10" height="72" rx="3"/><rect x="156" y="52" width="14" height="96" rx="4"/><rect x="142" y="64" width="10" height="72" rx="3"/></g><g class="neon neon--soft"><path d="M78 100v58M122 100v58M70 160h60"/></g></symbol>
<symbol id="n-kettlebell" viewBox="0 0 200 200"><g class="neon"><path d="M70 74a30 30 0 0 1 60 0"/><path d="M62 82h76"/><path d="M58 92c-14 18-12 52 8 66h68c20-14 22-48 8-66z"/></g><g class="neon neon--soft"><path d="M84 122h32"/></g></symbol>
<symbol id="n-rope" viewBox="0 0 200 200"><g class="neon"><path d="M12 80c20-28 36 28 56 0s36 28 56 0 36 28 56 0"/><path d="M12 124c20-28 36 28 56 0s36 28 56 0 36 28 56 0"/></g><g class="neon neon--soft"><circle cx="186" cy="102" r="8"/></g></symbol>
<symbol id="n-glove" viewBox="0 0 200 200"><g class="neon"><path d="M70 150V96c0-30 14-50 42-50s40 18 40 40v24c0 16-8 26-20 30v10z"/><path d="M70 110c-14 0-20-10-20-20s8-16 20-14"/><path d="M68 162h66"/></g><g class="neon neon--soft"><path d="M96 76c10-6 24-4 32 4"/></g></symbol>
<symbol id="n-mobility" viewBox="0 0 200 200"><g class="neon"><rect x="24" y="132" width="152" height="16" rx="8"/><circle cx="100" cy="70" r="14"/><path d="M100 84v26l-34 22M100 110l34 22M100 92l-36-10M100 92l36-10"/></g></symbol>
<symbol id="n-coach" viewBox="0 0 200 200"><g class="neon"><circle cx="100" cy="72" r="28"/><path d="M40 178c4-38 30-58 60-58s56 20 60 58"/></g><g class="neon neon--soft"><path d="M84 132l16 18 16-18"/></g></symbol>
<symbol id="n-heart" viewBox="0 0 200 200"><g class="neon"><path d="M100 160S34 120 34 78a30 30 0 0 1 66-14 30 30 0 0 1 66 14c0 42-66 82-66 82z"/></g><g class="neon neon--soft"><path d="M40 104h34l10-20 14 40 12-28 8 8h42"/></g></symbol>
<symbol id="n-sauna" viewBox="0 0 200 200"><g class="neon"><path d="M30 150h140M44 150V96h112v54"/><path d="M60 122h80"/></g><g class="neon neon--soft"><path d="M76 82c-10-12 10-20 0-34M100 82c-10-12 10-20 0-34M124 82c-10-12 10-20 0-34"/></g></symbol>
<symbol id="n-timer" viewBox="0 0 200 200"><g class="neon"><circle cx="100" cy="112" r="56"/><path d="M88 44h24M100 44v12M100 112V80M146 66l10-10"/></g></symbol>
<symbol id="n-gym" viewBox="0 0 200 200"><g class="neon"><path d="M20 160V60l80-30 80 30v100"/><path d="M20 160h160"/></g><g class="neon neon--soft"><path d="M60 140h80M70 120v40M130 120v40M52 120h12M136 120h12"/></g></symbol>
</defs></svg>"""


def icon(name):
    vb = ' viewBox="0 0 200 200"' if name.startswith("n-") else ""
    return f'<svg{vb} aria-hidden="true" focusable="false"><use href="#{name}"/></svg>'


def slot(art, caption, cls="", ratio=None):
    st = f' style="aspect-ratio:{ratio}"' if ratio else ""
    tag = L("Photo slot", "Место для фото")
    return (f'<figure class="slot {cls}"{st} role="img" aria-label="{e(tag)}: {e(caption)}">'
            f'<div class="slot__art">{icon(art)}</div>'
            f'<figcaption class="slot__cap"><b>{tag}</b><span>{e(caption)}</span></figcaption></figure>')


LOGO = ('<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><circle cx="20" cy="20" r="17" fill="none" stroke="#ff5a1f" stroke-width="3"/>'
        '<circle cx="20" cy="20" r="8" fill="none" stroke="#f5f5f5" stroke-width="3"/><circle cx="20" cy="20" r="2.5" fill="#ff5a1f"/></svg>')


def link(page):
    return page


def other_lang(page):
    return ("ru/" + page) if LANG == "en" else ("../" + page)


def cta_trial(cls="btn"):
    return f'<a class="{cls}" href="free-trial.html">{L("Free trial", "Бесплатная тренировка")} {icon("i-arrow")}</a>'


# ---------------------------------------------------------------- layout
def head(page, title, desc):
    p = prefix()
    other = other_lang(page)
    ld = {"@context": "https://schema.org", "@type": "ExerciseGym", "name": "Iron Club",
          "description": L("Premium strength and conditioning club (design concept).", "Премиальный клуб силовых и функциональных тренировок (дизайн-концепт).")}
    return f"""<!DOCTYPE html>
<html lang="{LANG}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#0b0b0b">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:type" content="website">
<meta property="og:locale" content="{'en_GB' if LANG == 'en' else 'ru_RU'}">
<link rel="alternate" hreflang="{'ru' if LANG == 'en' else 'en'}" href="{other}">
<link rel="icon" href="{p}assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Oswald:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="{p}assets/styles.css">
<script>document.documentElement.classList.add('js');setTimeout(function(){{if(!window.__icReady)document.documentElement.classList.remove('js')}},2500);</script>
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>
<body data-page="{page}" data-lang="{LANG}">
{SPRITE}
<a class="skip-link" href="#main">{L("Skip to content", "Перейти к содержимому")}</a>
<div class="concept-bar" role="note"><div class="container">{L("Design concept. Prices, coaches, schedule and address are sample content.", "Дизайн-концепт. Цены, тренеры, расписание и адрес — примерный контент.")}</div></div>
"""


def header(active):
    lab = lambda en, ru: en if LANG == "en" else ru
    items = "".join(f'<li><a href="{f}"{" aria-current=\"page\"" if f == active else ""}>{lab(en, ru)}</a></li>' for f, en, ru in NAV)
    mitems = "".join(f'<li><a href="{f}"{" aria-current=\"page\"" if f == active else ""}>{lab(en, ru)} {icon("i-arrow")}</a></li>' for f, en, ru in PAGES[:6])
    other_label = "RU" if LANG == "en" else "EN"
    other_aria = "Русская версия" if LANG == "en" else "English version"
    other_hl = "ru" if LANG == "en" else "en"
    langlink = f'<a class="lang" href="{other_lang(active)}" hreflang="{other_hl}" lang="{other_hl}" aria-label="{other_aria}">{other_label}</a>'
    return f"""<header class="site-header" id="site-header">
  <div class="container">
    <a class="logo" href="index.html" aria-label="{L('Iron Club, home', 'Iron Club, главная')}">{LOGO}<span>IRON <b>CLUB</b></span></a>
    <nav class="nav" aria-label="{L('Main', 'Основное меню')}"><ul>{items}</ul></nav>
    <div class="header-actions">
      {langlink}
      {cta_trial("btn btn--small")}
      <button class="menu-toggle" id="menu-open" type="button" aria-label="{L('Open menu', 'Открыть меню')}" aria-controls="mobile-nav" aria-expanded="false">{icon("i-menu")}</button>
    </div>
  </div>
</header>
<div class="mobile-nav" id="mobile-nav" role="dialog" aria-modal="true" aria-label="{L('Menu', 'Меню')}">
  <div class="mobile-nav__top">
    <a class="logo" href="index.html">{LOGO}<span>IRON <b>CLUB</b></span></a>
    <div class="header-actions">{langlink}<button class="menu-toggle" id="menu-close" type="button" aria-label="{L('Close menu', 'Закрыть меню')}">{icon("i-close")}</button></div>
  </div>
  <ul>{mitems}</ul>
  {cta_trial("btn btn--block")}
</div>
"""


def footer():
    lab = lambda en, ru: en if LANG == "en" else ru
    hours = "".join(f'<li>{lab(a, b)}: {h}</li>' for a, b, h in HOURS)
    return f"""<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <a class="logo" href="index.html" aria-label="{L('Iron Club, home', 'Iron Club, главная')}">{LOGO}<span>IRON <b>CLUB</b></span></a>
        <p style="margin-top:14px;max-width:36ch">{L("Strength, conditioning and coaching for people who want results they can measure.", "Сила, выносливость и тренерская работа для тех, кому нужен измеримый результат.")}</p>
      </div>
      <div><h2>{L("Club", "Клуб")}</h2><ul>{"".join(f'<li><a href="{f}">{lab(en, ru)}</a></li>' for f, en, ru in NAV)}</ul></div>
      <div><h2>{L("Hours", "Часы работы")}</h2><ul style="color:#cfcfcf">{hours}</ul><p style="margin-top:8px;font-size:13px">{L("Sample hours", "Примерный график")}</p></div>
      <div><h2>{L("Start", "Начать")}</h2><ul><li><a href="free-trial.html">{L("Book a free trial", "Записаться на пробную")}</a></li><li><a href="membership.html">{L("Compare plans", "Сравнить тарифы")}</a></li><li><a href="mailto:{EMAIL}">{EMAIL}</a></li></ul></div>
    </div>
    <div class="footer-note"><span>© IRON CLUB · {L("Design concept", "Дизайн-концепт")}</span><span>{L("Neon line art marks where club photography will go.", "Неоновые рисунки отмечают места для фотографий клуба.")}</span></div>
  </div>
</footer>
<div class="cta-bar" id="cta-bar">
  <a class="btn btn--ghost" href="membership.html">{L("Plans", "Тарифы")}</a>
  <a class="btn" href="free-trial.html">{L("Free trial", "Пробная")}</a>
</div>
<script src="{prefix()}assets/app.js"></script>
</body>
</html>
"""


def page_hero(kicker, title_html, lead, extra=""):
    return f"""<section class="page-hero" aria-labelledby="page-title">
  <div class="container">
    <span class="kicker">{kicker}</span>
    <h1 class="h-l" id="page-title">{title_html}</h1>
    <p class="lead">{lead}</p>{extra}
  </div>
</section>"""


def cta_band():
    return f"""<section class="section" aria-labelledby="cta-title">
  <div class="container">
    <div class="cta-band" data-reveal>
      <div>
        <h2 class="h-l" id="cta-title">{L("Your first session is on us", "Первая тренировка — за наш счёт")}</h2>
        <p>{L("Book a free trial, meet a coach and leave with a plan for your first four weeks.", "Запишись на бесплатную тренировку, познакомься с тренером и уйди с планом на первые четыре недели.")}</p>
      </div>
      <div class="cta-band__actions">{cta_trial()}</div>
    </div>
  </div>
</section>"""


# ---------------------------------------------------------------- content
def programs():
    return [
        ("01", L("Strength", "Сила"), L("Barbell technique, progressive overload and coached lifting in small groups.", "Техника со штангой, прогрессия нагрузки и силовые тренировки в мини-группах."), "n-barbell", "strength"),
        ("02", L("HIIT", "HIIT"), L("Short, hard intervals with ropes, sleds and bikes. Forty-five minutes, done.", "Короткие жёсткие интервалы: канаты, сани, велотренажёры. Сорок пять минут — и готово."), "n-rope", "hiit"),
        ("03", L("Personal training", "Персональные тренировки"), L("One coach, one plan, one goal. Sessions built around your body and schedule.", "Один тренер, один план, одна цель. Тренировки под твоё тело и график."), "n-dumbbell", "personal"),
        ("04", L("Mobility & recovery", "Мобильность и восстановление"), L("Stretching, breathing and sauna to keep you training without pain.", "Растяжка, дыхание и сауна, чтобы тренироваться без боли."), "n-mobility", "mobility"),
    ]


def coaches():
    return [
        ("Max Keller", L("Head coach · Strength", "Главный тренер · Сила"), L("Builds strength programmes from the first deadlift to competition prep.", "Строит силовые программы — от первой становой до подготовки к соревнованиям."), [L("Powerlifting", "Пауэрлифтинг"), L("Technique", "Техника")]),
        ("Lena Ortiz", L("HIIT & conditioning", "HIIT и выносливость"), L("Runs the loudest classes in the club and keeps every rep honest.", "Ведёт самые громкие занятия в клубе и следит за каждым повтором."), [L("HIIT", "HIIT"), L("Endurance", "Выносливость")]),
        ("Daniel Novak", L("Personal training", "Персональный тренер"), L("Plans around busy calendars, injuries and real-life goals.", "Планирует с учётом плотного графика, травм и реальных целей."), [L("Body recomposition", "Рекомпозиция тела"), L("Beginners", "Новички")]),
        ("Sara Lind", L("Mobility & recovery", "Мобильность и восстановление"), L("Fixes the movement problems that stop people from training.", "Исправляет проблемы с движением, которые мешают тренироваться."), [L("Mobility", "Мобильность"), L("Breathing", "Дыхание")]),
    ]


def founders():
    return [
        ("Viktor Hahn", L("Co-founder · Head of training", "Сооснователь · Руководитель тренировок"),
         L("Former competitive powerlifter with fifteen years of coaching. He designed every programme in the club and still coaches the Saturday strength class.",
           "Бывший пауэрлифтер, пятнадцать лет тренерского стажа. Разработал все программы клуба и до сих пор сам ведёт субботнюю силовую."),
         L("“Technique first. The weight will come.”", "«Сначала техника. Вес придёт.»")),
        ("Mira Sokolova", L("Co-founder · Managing director", "Сооснователь · Управляющий директор"),
         L("Physiotherapist who built the recovery zone and the movement check every new member goes through. She runs the club day to day.",
           "Физиотерапевт, создала зону восстановления и проверку движений, которую проходит каждый новичок. Отвечает за работу клуба каждый день."),
         L("“A good club makes you want to come back tomorrow.”", "«Хороший клуб — это тот, куда хочется вернуться завтра.»")),
    ]


def founder_cards(short=False):
    out = []
    for i, (name, role, bio, quote) in enumerate(founders()):
        text = "" if short else f'<p>{bio}</p><blockquote class="quote">{quote}</blockquote>'
        out.append(f"""<article class="founder" data-reveal style="--d:{i * 100}ms">
  {slot("n-coach", L("Portrait of ", "Портрет: ") + name, ratio="1/1")}
  <div class="founder__body"><span class="coach__role">{role}</span><h3>{name}</h3>{text}</div>
</article>""")
    return "".join(out)


def plans():
    return [
        ("basic", "Basic", L("For independent training on the gym floor.", "Для самостоятельных тренировок в зале."), 29, False,
         [(True, L("Gym floor, 7 days", "Тренажёрный зал, 7 дней")), (True, L("Lockers & showers", "Шкафчики и душ")), (True, L("Intro session with a coach", "Вводная тренировка с тренером")), (False, L("Group classes", "Групповые занятия")), (False, L("Personal training", "Персональные тренировки"))]),
        ("pro", "Pro", L("The full club: gym floor plus every group class.", "Весь клуб: зал плюс все групповые занятия."), 49, True,
         [(True, L("Everything in Basic", "Всё из Basic")), (True, L("Unlimited group classes", "Безлимитные групповые занятия")), (True, L("Sauna & recovery zone", "Сауна и зона восстановления")), (True, L("Monthly progress check", "Ежемесячная проверка прогресса")), (False, L("Personal training", "Персональные тренировки"))]),
        ("elite", "Elite", L("Coached every week with a personal plan.", "Тренер каждую неделю и личный план."), 89, False,
         [(True, L("Everything in Pro", "Всё из Pro")), (True, L("4 personal sessions a month", "4 персональные тренировки в месяц")), (True, L("Nutrition guidance", "Рекомендации по питанию")), (True, L("2 guest passes a month", "2 гостевых визита в месяц")), (True, L("Priority class booking", "Приоритетная запись на занятия"))]),
    ]


def plan_cards():
    out = []
    for key, name, desc, price, featured, feats in plans():
        lis = "".join(f'<li class="{"" if ok else "is-off"}">{icon("i-check" if ok else "i-x")}<span>{"" if ok else "<span class=sr-only>" + L("Not included: ", "Не входит: ") + "</span>"}{e(t)}</span></li>' for ok, t in feats)
        flag = f'<span class="plan__flag">{L("Most popular", "Популярный")}</span>' if featured else ""
        out.append(f"""<article class="plan{' plan--featured' if featured else ''}" data-reveal>
  {flag}
  <div><h3>{name}</h3><p class="plan__desc">{desc}</p></div>
  <div>
    <div class="price"><span class="price__num" data-monthly="{price}" data-yearly="{price * 10}">€{price}</span><span class="price__per" data-per-month="{L('/ month', '/ месяц')}" data-per-year="{L('/ year', '/ год')}">{L('/ month', '/ месяц')}</span></div>
    <p class="price__note" data-note-year="{L('Two months free', 'Два месяца бесплатно')}"></p>
  </div>
  <ul>{lis}</ul>
  <a class="btn{'' if featured else ' btn--ghost'}" href="free-trial.html?plan={key}">{L("Start with a free trial", "Начать с пробной")}</a>
</article>""")
    return "".join(out)


def billing_toggle():
    return f"""<div class="billing" role="group" aria-label="{L('Billing period', 'Период оплаты')}">
  <button type="button" data-billing="monthly" aria-pressed="true">{L("Monthly", "Помесячно")}</button>
  <button type="button" data-billing="yearly" aria-pressed="false">{L("Yearly", "За год")}<small>−17%</small></button>
</div>"""


def timetable():
    D = [L("Mon", "Пн"), L("Tue", "Вт"), L("Wed", "Ср"), L("Thu", "Чт"), L("Fri", "Пт"), L("Sat", "Сб"), L("Sun", "Вс")]
    N = {"strength": L("Strength", "Сила"), "hiit": "HIIT", "mobility": L("Mobility", "Мобильность"), "boxing": L("Boxing", "Бокс")}
    C = {"strength": "Max Keller", "hiit": "Lena Ortiz", "mobility": "Sara Lind", "boxing": "Daniel Novak"}
    week = [
        [("07:00", "hiit"), ("18:00", "strength"), ("19:30", "mobility")],
        [("07:00", "strength"), ("18:30", "boxing"), ("20:00", "hiit")],
        [("07:00", "hiit"), ("18:00", "strength"), ("19:30", "mobility")],
        [("07:00", "strength"), ("18:30", "boxing"), ("20:00", "hiit")],
        [("07:00", "hiit"), ("18:00", "strength")],
        [("10:00", "strength"), ("11:30", "hiit"), ("13:00", "mobility")],
        [("10:00", "mobility")],
    ]
    days = []
    for i, cls in enumerate(week):
        items = "".join(f'<div class="cls" data-type="{t}"><span class="cls__time">{tm}</span><span class="cls__name">{N[t]}</span><span class="cls__coach">{C[t]}</span></div>' for tm, t in cls)
        empty = f'<p class="day__empty" hidden>{L("No classes of this type", "Нет занятий этого типа")}</p>'
        days.append(f'<div class="day" data-day="{(i + 1) % 7}"><h3 data-today="{L("Today", "Сегодня")}">{D[i]}</h3>{items}{empty}</div>')
    chips = f'<button class="chip" type="button" data-filter="all" aria-pressed="true">{L("All", "Все")}</button>' + "".join(
        f'<button class="chip" type="button" data-filter="{k}" aria-pressed="false">{v}</button>' for k, v in N.items())
    return f"""<div class="filters" role="group" aria-label="{L('Filter classes', 'Фильтр занятий')}">{chips}</div>
<p class="sr-only" aria-live="polite" id="tt-status"></p>
<div class="timetable" id="timetable">{''.join(days)}</div>"""


def hours_table():
    rows = "".join(f'<tr><th scope="row">{L(a, b)}</th><td>{h}</td></tr>' for a, b, h in HOURS)
    return f'<table class="hours"><caption class="sr-only">{L("Opening hours", "Часы работы")}</caption><tbody>{rows}</tbody></table>'


# ---------------------------------------------------------------- pages
def page_index():
    pkeys = {"strength": "athlete", "hiit": "ropes", "personal": "coaching"}
    progs = "".join(f"""<article class="pcard" data-reveal style="--d:{i * 80}ms">
  {photo(pkeys.get(key, ""), t + ": " + cap, art, cap)}
  <div class="pcard__body"><span class="pcard__no">{no}</span><h3>{t}</h3><p>{d}</p><a class="text-link" href="training.html#{key}">{L("Explore", "Подробнее")} {icon("i-arrow")}</a></div>
</article>""" for i, ((no, t, d, art, key), cap) in enumerate(zip(programs(), [
        L("Lifter at the rack, red side light, chalk in the air", "Атлет у стойки, красный боковой свет, магнезия в воздухе"),
        L("Battle ropes mid-wave, water spray on rubber floor", "Канаты в движении, брызги на резиновом полу"),
        L("Coach spotting a squat, warm light", "Тренер страхует присед, тёплый свет"),
        L("Stretching on mats in the recovery zone", "Растяжка на ковриках в зоне восстановления")])))
    coach_cards = "".join(f"""<article class="coach" data-reveal style="--d:{i * 80}ms">
  {slot("n-coach", L("Portrait of ", "Портрет: ") + name)}
  <div class="coach__body"><span class="coach__role">{role}</span><h3>{name}</h3></div>
</article>""" for i, (name, role, _d, _t) in enumerate(coaches()))
    body = f"""<main id="main">
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__stage">{led_corridor()}</div>
    <div class="container hero__grid">
      <div>
      <span class="kicker">{L("Premium fitness club", "Премиальный фитнес-клуб")}</span>
      <h1 class="h-xl" id="hero-title"><span>{L("Train hard.", "Тренируйся")}</span><span class="accent">{L("Live strong.", "на пределе.")}</span></h1>
      <p class="hero__sub">{L("Your limits are only the beginning.", "Твои пределы — только начало.")}</p>
      <p class="lead">{L("Strength, HIIT and personal coaching in a club built for focus: serious equipment, coaches on the floor and a plan for every member.", "Сила, HIIT и персональные тренировки в клубе, где ничто не отвлекает: серьёзное оборудование, тренеры в зале и план для каждого.")}</p>
      <div class="hero__actions">
        <a class="btn" href="membership.html">{L("Start now", "Начать сейчас")} {icon("i-arrow")}</a>
        <a class="btn btn--ghost" href="free-trial.html">{L("Free trial", "Бесплатная тренировка")}</a>
      </div>
      <div class="hero__meta">
        <div><div class="meta-num"><span data-count="7">7</span><small>{L("days", "дней")}</small></div><div class="meta-label">{L("a week", "в неделю")}</div></div>
        <div><div class="meta-num"><span data-count="4">4</span></div><div class="meta-label">{L("coaches", "тренера")}</div></div>
        <div><div class="meta-num"><span data-count="20">20</span><small>+</small></div><div class="meta-label">{L("classes a week", "занятий в неделю")}</div></div>
      </div>
      </div>
      {('<div class="hero__media" data-reveal>' + photo("athlete", L("Athlete doing dumbbell curls under red neon light", "Атлет делает подъём гантели под красным неоновым светом"), "n-dumbbell", "") + '<span class="hero__badge">' + L("Open 7 days", "Открыто 7 дней") + '</span></div>') if PHOTO_ON else ''}
    </div>
  </section>

  <div class="ticker" aria-hidden="true"><div class="ticker__track">{''.join('<div class="ticker__group">' + ''.join(f'<span class="ticker__item">{w}</span>' for w in [L("Strength", "Сила"), "HIIT", L("Personal training", "Персональные"), L("Mobility", "Мобильность"), L("Recovery", "Восстановление"), L("Boxing", "Бокс")]) + '</div>' for _ in range(2))}</div></div>

  <section class="section" aria-labelledby="prog-title">
    <div class="container">
      <div class="section__head section__head--split">
        <div><span class="kicker" data-reveal>{L("Training", "Тренировки")}</span><h2 class="h-l" id="prog-title" data-reveal>{L("Four ways to", "Четыре пути к")} <span class="accent">{L("get stronger", "силе")}</span></h2></div>
        <p class="lead" data-reveal>{L("Pick one or mix them. Every programme is coached, and every member gets a starting plan.", "Выбери одно направление или комбинируй. Все программы ведут тренеры, а каждый участник получает стартовый план.")}</p>
      </div>
      <div class="cards cards--4">{progs}</div>
    </div>
  </section>

  <section class="section section--alt" aria-labelledby="steps-title">
    <div class="container">
      <div class="section__head"><span class="kicker" data-reveal>{L("How to start", "Как начать")}</span><h2 class="h-l" id="steps-title" data-reveal>{L("Three steps to your", "Три шага к твоей")} <span class="accent">{L("first result", "первой цели")}</span></h2></div>
      <ol class="steps">
        <li class="step" data-reveal><h3>{L("Book a free trial", "Запишись на пробную")}</h3><p>{L("Choose a day and time. It takes a minute.", "Выбери день и время. Это займёт минуту.")}</p></li>
        <li class="step" data-reveal style="--d:80ms"><h3>{L("Meet your coach", "Познакомься с тренером")}</h3><p>{L("We test how you move and talk about your goal.", "Проверим, как ты двигаешься, и обсудим цель.")}</p></li>
        <li class="step" data-reveal style="--d:160ms"><h3>{L("Get your plan", "Получи свой план")}</h3><p>{L("Leave with four weeks of training written for you.", "Уйди с программой на четыре недели, составленной для тебя.")}</p></li>
      </ol>
    </div>
  </section>

  <section class="section" aria-labelledby="plans-title">
    <div class="container">
      <div class="section__head section__head--split">
        <div><span class="kicker" data-reveal>{L("Membership", "Абонементы")}</span><h2 class="h-l" id="plans-title" data-reveal>{L("Simple plans.", "Простые тарифы.")} <span class="accent">{L("No hidden fees.", "Без скрытых платежей.")}</span></h2></div>
        <p class="lead" data-reveal>{L("Monthly or yearly. Cancel monthly plans with one month's notice.", "Помесячно или за год. Месячный тариф можно отменить, предупредив за месяц.")}</p>
      </div>
      {billing_toggle()}
      <div class="plans">{plan_cards()}</div>
      <p style="margin-top:28px"><a class="text-link" href="membership.html">{L("Compare all features", "Сравнить все возможности")} {icon("i-arrow")}</a></p>
    </div>
  </section>

  <section class="section section--alt" aria-labelledby="coaches-title">
    <div class="container">
      <div class="section__head section__head--split">
        <div><span class="kicker" data-reveal>{L("Coaches", "Тренеры")}</span><h2 class="h-l" id="coaches-title" data-reveal>{L("Coaches on the", "Тренеры — в")} <span class="accent">{L("floor", "зале")}</span></h2></div>
        <p class="lead" data-reveal>{L("Not behind a desk. Ask for a spot, a cue or a new programme.", "А не за стойкой. Попроси подстраховать, подсказать технику или составить программу.")}</p>
      </div>
      <div class="cards cards--4">{coach_cards}</div>
      <p style="margin-top:28px"><a class="text-link" href="coaches.html">{L("Meet the team", "Познакомиться с командой")} {icon("i-arrow")}</a></p>
    </div>
  </section>

  <section class="section" aria-labelledby="club-title">
    <div class="container split">
      <div data-reveal>{photo("led", L("The main floor at night with LED lines along the ceiling", "Главный зал вечером, LED-линии на потолке"), "n-gym", L("The main floor at night, orange LED lines along the ceiling", "Главный зал вечером, оранжевые LED-линии на потолке"), ratio="16/11")}</div>
      <div class="prose" data-reveal>
        <span class="kicker">{L("The club", "Клуб")}</span>
        <h2 class="h-l" id="club-title">{L("Built for", "Создан для")} <span class="accent">{L("focus", "фокуса")}</span></h2>
        <p>{L("Free weights, machines, a functional zone and a recovery area with sauna. Dark, quiet light and room to move.", "Свободные веса, тренажёры, функциональная зона и зона восстановления с сауной. Приглушённый свет и много места.")}</p>
        <p><a class="text-link" href="about.html">{L("Inside the club", "Подробнее о клубе")} {icon("i-arrow")}</a></p>
      </div>
    </div>
  </section>

  <section class="section section--alt" aria-labelledby="owners-title">
    <div class="container">
      <div class="section__head section__head--split">
        <div><span class="kicker" data-reveal>{L("The owners", "Владельцы")}</span><h2 class="h-l" id="owners-title" data-reveal>{L("Built by", "Создан")} <span class="accent">{L("lifters", "атлетами")}</span></h2></div>
        <p class="lead" data-reveal>{L("Iron Club is owned and run by a coach and a physiotherapist. They are on the floor most days.", "Iron Club принадлежит тренеру и физиотерапевту. Они сами почти каждый день в зале.")}</p>
      </div>
      <div class="founders founders--short">{founder_cards(short=True)}</div>
      <p style="margin-top:28px"><a class="text-link" href="about.html#founders">{L("Read their story", "Их история")} {icon("i-arrow")}</a></p>
    </div>
  </section>
  {cta_band()}
</main>"""
    return head("index.html", L("Iron Club · Premium fitness club: strength, HIIT, personal training", "Iron Club · Премиальный фитнес-клуб: сила, HIIT, персональные тренировки"),
                L("Train hard. Live strong. Strength, HIIT and personal training with coaches on the floor. Book a free trial at Iron Club.", "Тренируйся на пределе. Сила, HIIT и персональные тренировки с тренерами в зале. Запишись на бесплатную тренировку в Iron Club.")) + header("index.html") + body + footer()


def page_training():
    blocks = []
    for i, (no, t, d, art, key) in enumerate(programs()):
        rev = " split--rev" if i % 2 else ""
        bullets = {
            "strength": [L("Small groups, max 8 people", "Мини-группы, до 8 человек"), L("Squat, bench, deadlift, press", "Присед, жим, становая, жим стоя"), L("Progress tracked every week", "Прогресс отслеживается каждую неделю")],
            "hiit": [L("45 minutes, all levels", "45 минут, любой уровень"), L("Ropes, sleds, bikes, rowers", "Канаты, сани, велотренажёры, гребля"), L("Heart-rate zones on screen", "Пульсовые зоны на экране")],
            "personal": [L("1:1 sessions with your coach", "Занятия один на один с тренером"), L("Plan adjusted every month", "План корректируется каждый месяц"), L("Works around injuries", "С учётом травм")],
            "mobility": [L("Stretching and breathing classes", "Растяжка и дыхательные практики"), L("Sauna and recovery zone", "Сауна и зона восстановления"), L("Good for every training day", "Подходит для любого тренировочного дня")],
        }[key]
        lis = "".join(f'<li style="display:flex;gap:10px"><span class="accent">{icon("i-check")}</span>{b}</li>' for b in bullets)
        blocks.append(f"""<section class="section{' section--alt' if i % 2 else ''}" id="{key}" aria-labelledby="t-{key}">
  <div class="container split{rev}">
    <div data-reveal>{photo({"strength": "athlete", "hiit": "ropes", "personal": "coaching"}.get(key, ""), t, art, t)}</div>
    <div class="prose" data-reveal>
      <span class="kicker">{no}</span>
      <h2 class="h-l" id="t-{key}">{t}</h2>
      <p>{d}</p>
      <ul style="list-style:none;padding:0;margin:0;display:grid;gap:10px">{lis.replace('<svg', '<svg style="width:20px;height:20px"')}</ul>
      <p><a class="btn btn--ghost" href="free-trial.html?goal={key}">{L("Try it free", "Попробовать бесплатно")}</a></p>
    </div>
  </div>
</section>""")
    body = f"""<main id="main">
  {page_hero(L("Training", "Тренировки"), L("Train with", "Тренируйся с") + ' <span class="accent">' + L("purpose", "целью") + '</span>', L("Four coached programmes and a weekly timetable. Mix them to fit your goal.", "Четыре программы с тренером и расписание на неделю. Комбинируй под свою цель."))}
  {''.join(blocks)}
  <section class="section" id="timetable-section" aria-labelledby="tt-title">
    <div class="container">
      <div class="section__head section__head--split">
        <div><span class="kicker" data-reveal>{L("Timetable", "Расписание")}</span><h2 class="h-l" id="tt-title" data-reveal>{L("This week", "На этой неделе")}</h2></div>
        <p class="lead" data-reveal>{L("Sample timetable. Filter by class type; today is highlighted.", "Примерное расписание. Отфильтруй по типу занятия; сегодняшний день подсвечен.")}</p>
      </div>
      {timetable()}
    </div>
  </section>
  {cta_band()}
</main>"""
    return head("training.html", L("Training programmes & timetable · Iron Club", "Программы и расписание тренировок · Iron Club"),
                L("Strength, HIIT, personal training and mobility at Iron Club, plus a weekly class timetable you can filter.", "Сила, HIIT, персональные тренировки и мобильность в Iron Club, а также расписание занятий на неделю с фильтром.")) + header("training.html") + body + footer()


def page_membership():
    rows = [
        (L("Gym floor access", "Доступ в тренажёрный зал"), True, True, True),
        (L("Intro session with a coach", "Вводная тренировка"), True, True, True),
        (L("Group classes", "Групповые занятия"), False, True, True),
        (L("Sauna & recovery zone", "Сауна и зона восстановления"), False, True, True),
        (L("Monthly progress check", "Проверка прогресса"), False, True, True),
        (L("Personal training", "Персональные тренировки"), False, False, L("4 / month", "4 / месяц")),
        (L("Nutrition guidance", "Рекомендации по питанию"), False, False, True),
        (L("Guest passes", "Гостевые визиты"), False, False, L("2 / month", "2 / месяц")),
    ]

    def cell(v, hl=False):
        c = ' class="hl"' if hl else ""
        if v is True:
            return f'<td{c}><span class="yes" aria-hidden="true">✓</span><span class="sr-only">{L("Included", "Входит")}</span></td>'
        if v is False:
            return f'<td{c}><span class="no" aria-hidden="true">—</span><span class="sr-only">{L("Not included", "Не входит")}</span></td>'
        return f'<td{c}>{v}</td>'
    trs = "".join(f'<tr><th scope="row">{n}</th>{cell(a)}{cell(b, True)}{cell(c)}</tr>' for n, a, b, c in rows)
    faqs = [
        (L("Is there a joining fee?", "Есть ли вступительный взнос?"), L("No. You pay the plan price and nothing else.", "Нет. Ты платишь только стоимость тарифа.")),
        (L("How do I cancel?", "Как отменить абонемент?"), L("Monthly plans can be cancelled with one month's notice. Yearly plans run for twelve months.", "Месячный тариф можно отменить, предупредив за месяц. Годовой действует двенадцать месяцев.")),
        (L("Can I try before I join?", "Можно попробовать до покупки?"), L("Yes. Book a free trial: one coached session and a starting plan, no obligation.", "Да. Запишись на бесплатную тренировку: одно занятие с тренером и стартовый план, без обязательств.")),
        (L("What should I bring?", "Что взять с собой?"), L("Training clothes, clean indoor shoes, a towel and a water bottle.", "Спортивную одежду, чистую сменную обувь, полотенце и бутылку воды.")),
    ]
    fq = "".join(f'<details data-reveal><summary>{q}</summary><div class="faq__body">{a}</div></details>' for q, a in faqs)
    body = f"""<main id="main">
  {page_hero(L("Membership", "Абонементы"), L("Pick your", "Выбери свой") + ' <span class="accent">' + L("plan", "тариф") + '</span>', L("Three plans, monthly or yearly. Yearly plans include two months free.", "Три тарифа, помесячно или за год. В годовом тарифе два месяца бесплатно."))}
  <section class="section" style="padding-top:56px" aria-labelledby="plans-title">
    <div class="container">
      <h2 class="sr-only" id="plans-title">{L("Plans", "Тарифы")}</h2>
      {billing_toggle()}
      <div class="plans">{plan_cards()}</div>
    </div>
  </section>
  <section class="section section--alt" aria-labelledby="cmp-title">
    <div class="container">
      <div class="section__head"><span class="kicker" data-reveal>{L("Compare", "Сравнение")}</span><h2 class="h-l" id="cmp-title" data-reveal>{L("What's included", "Что входит")}</h2></div>
      <div class="table-wrap" data-reveal><table class="table"><caption class="sr-only">{L("Plan comparison", "Сравнение тарифов")}</caption>
        <thead><tr><th scope="col">{L("Feature", "Возможность")}</th><th scope="col">Basic</th><th scope="col" class="hl">Pro</th><th scope="col">Elite</th></tr></thead>
        <tbody>{trs}</tbody></table></div>
      <p class="scroll-hint">{L("Scroll the table sideways", "Прокрути таблицу вбок")}</p>
    </div>
  </section>
  <section class="section" aria-labelledby="faq-title">
    <div class="container">
      <div class="section__head"><span class="kicker" data-reveal>FAQ</span><h2 class="h-l" id="faq-title" data-reveal>{L("Questions", "Вопросы")}</h2></div>
      <div class="faq">{fq}</div>
    </div>
  </section>
  {cta_band()}
</main>"""
    return head("membership.html", L("Membership plans & prices · Iron Club", "Абонементы и цены · Iron Club"),
                L("Compare Basic, Pro and Elite memberships at Iron Club. Monthly or yearly, no joining fee, free trial first.", "Сравни абонементы Basic, Pro и Elite в Iron Club. Помесячно или за год, без вступительного взноса, сначала — бесплатная тренировка.")) + header("membership.html") + body + footer()


def page_coaches():
    cards = "".join(f"""<article class="coach" data-reveal style="--d:{(i % 4) * 80}ms">
  {slot("n-coach", L("Portrait of ", "Портрет: ") + name)}
  <div class="coach__body"><span class="coach__role">{role}</span><h3>{name}</h3><p>{d}</p><ul class="tags">{''.join(f'<li>{t}</li>' for t in tags)}</ul></div>
</article>""" for i, (name, role, d, tags) in enumerate(coaches()))
    body = f"""<main id="main">
  {page_hero(L("Coaches", "Тренеры"), L("The team behind", "Команда за") + ' <span class="accent">' + L("your progress", "твоим прогрессом") + '</span>', L("Every member works with a coach from day one. Names and profiles below are sample content.", "Каждый участник работает с тренером с первого дня. Имена и профили ниже — примерный контент."))}
  <section class="section" style="padding-top:56px" aria-labelledby="team-title">
    <div class="container">
      <h2 class="sr-only" id="team-title">{L("Team", "Команда")}</h2>
      <div class="cards cards--4">{cards}</div>
    </div>
  </section>
  {cta_band()}
</main>"""
    return head("coaches.html", L("Coaches · Iron Club", "Тренеры · Iron Club"),
                L("Meet the Iron Club coaching team: strength, HIIT, personal training and mobility specialists.", "Познакомься с тренерами Iron Club: специалисты по силе, HIIT, персональным тренировкам и мобильности.")) + header("coaches.html") + body + footer()


def page_about():
    zones = [
        ("n-barbell", L("Free weights", "Свободные веса"), L("Racks, platforms and plates up to competition standard.", "Стойки, помосты и диски соревновательного уровня.")),
        ("n-dumbbell", L("Machines", "Тренажёры"), L("Selectorised and plate-loaded machines for every muscle group.", "Блочные и рычажные тренажёры на все группы мышц.")),
        ("n-rope", L("Functional zone", "Функциональная зона"), L("Turf lane, sleds, ropes and rigs for HIIT.", "Дорожка с покрытием, сани, канаты и рамы для HIIT.")),
        ("n-sauna", L("Recovery", "Восстановление"), L("Sauna, stretching area and quiet space to cool down.", "Сауна, зона растяжки и тихое место, чтобы остыть.")),
    ]
    zs = "".join(f'<div class="zone">{icon(a)}<h3>{t}</h3><p>{d}</p></div>' for a, t, d in zones)
    body = f"""<main id="main">
  {page_hero(L("About", "О клубе"), L("More than", "Больше, чем") + ' <span class="accent">' + L("a gym", "просто зал") + '</span>', L("Iron Club is a coached training club. This story is sample content for the concept.", "Iron Club — клуб тренировок с тренерами. Эта история — примерный контент для концепта."))}
  <section class="section" aria-labelledby="story-title">
    <div class="container split">
      <div data-reveal>{photo("gym", L("Dumbbell racks along the free-weights floor under orange light", "Ряды гантелей в зоне свободных весов под оранжевой подсветкой"), "n-gym", L("The club entrance at dusk, logo lit in orange", "Вход в клуб в сумерках, логотип подсвечен оранжевым"))}</div>
      <div class="prose" data-reveal>
        <span class="kicker">{L("Our story", "Наша история")}</span>
        <h2 class="h-l" id="story-title">{L("Coaching first", "Тренер — прежде всего")}</h2>
        <p>{L("We started Iron Club for people who wanted more than a membership card: a coach who knows their name, a plan that changes as they get stronger, and a room that makes them want to train.", "Мы создали Iron Club для тех, кому мало просто карты в зал: нужен тренер, который знает тебя по имени, план, который меняется по мере роста силы, и место, где хочется тренироваться.")}</p>
        <p>{L("Every new member starts with a movement check and a written plan.", "Каждый новый участник начинает с проверки движений и письменного плана.")}</p>
      </div>
    </div>
  </section>
  <section class="section section--alt" id="founders" aria-labelledby="founders-title">
    <div class="container">
      <div class="section__head section__head--split">
        <div><span class="kicker" data-reveal>{L("The owners", "Владельцы")}</span><h2 class="h-l" id="founders-title" data-reveal>{L("Meet the", "Знакомься:")} <span class="accent">{L("founders", "основатели")}</span></h2></div>
        <p class="lead" data-reveal>{L("Two people, one idea: a club where coaching comes first.", "Два человека, одна идея: клуб, где главное — работа тренера.")}</p>
      </div>
      <div class="founders">{founder_cards()}</div>
      <ol class="timeline" data-reveal>
        <li><span class="timeline__year">2019</span><span>{L("Viktor and Mira start coaching together in a rented garage.", "Виктор и Мира начинают тренировать вместе в арендованном гараже.")}</span></li>
        <li><span class="timeline__year">2021</span><span>{L("Iron Club opens with one floor and twelve racks.", "Открывается Iron Club: один зал и двенадцать стоек.")}</span></li>
        <li><span class="timeline__year">2023</span><span>{L("The functional zone and group HIIT classes arrive.", "Появляются функциональная зона и групповые HIIT-занятия.")}</span></li>
        <li><span class="timeline__year">2025</span><span>{L("Recovery zone with sauna opens.", "Открывается зона восстановления с сауной.")}</span></li>
      </ol>
    </div>
  </section>
  <section class="section" aria-labelledby="zones-title">
    <div class="container">
      <div class="section__head"><span class="kicker" data-reveal>{L("Facilities", "Оснащение")}</span><h2 class="h-l" id="zones-title" data-reveal>{L("Four zones", "Четыре зоны")}</h2></div>
      <div class="zones" data-reveal>{zs}</div>
    </div>
  </section>
  <section class="section section--alt" aria-labelledby="values-title">
    <div class="container">
      <div class="section__head"><span class="kicker" data-reveal>{L("Values", "Ценности")}</span><h2 class="h-l" id="values-title" data-reveal>{L("What we stand for", "Во что мы верим")}</h2></div>
      <ol class="steps">
        <li class="step" data-reveal><h3>{L("Progress you can measure", "Измеримый прогресс")}</h3><p>{L("Numbers, not guesses: lifts, times and check-ins.", "Цифры, а не догадки: веса, время и регулярные замеры.")}</p></li>
        <li class="step" data-reveal style="--d:80ms"><h3>{L("Technique before load", "Сначала техника, потом вес")}</h3><p>{L("We add weight when the movement is right.", "Добавляем вес, когда движение правильное.")}</p></li>
        <li class="step" data-reveal style="--d:160ms"><h3>{L("Everyone belongs", "Здесь место каждому")}</h3><p>{L("First session or tenth year, you get the same attention.", "Первая тренировка или десятый год — внимание одинаковое.")}</p></li>
      </ol>
    </div>
  </section>
  {cta_band()}
</main>"""
    return head("about.html", L("About the club · Iron Club", "О клубе · Iron Club"),
                L("Iron Club is a coached strength and conditioning club with free weights, machines, a functional zone and a recovery area.", "Iron Club — клуб силовых и функциональных тренировок со свободными весами, тренажёрами, функциональной зоной и зоной восстановления.")) + header("about.html") + body + footer()


def field_err(id_):
    return f'<p class="field__error" id="e-{id_}"></p>'


def page_contact():
    body = f"""<main id="main">
  {page_hero(L("Contact", "Контакты"), L("Come", "Приходи") + ' <span class="accent">' + L("train with us", "тренироваться") + '</span>', L("Questions about plans, coaching or the club? Write to us or book a free trial.", "Вопросы о тарифах, тренерах или клубе? Напиши нам или запишись на пробную тренировку."))}
  <section class="section" style="padding-top:56px" aria-label="{L('Contact details', 'Контактные данные')}">
    <div class="container info-grid">
      <div class="panel" data-reveal>
        <h2 class="h-m" style="margin-bottom:20px">{L("Visit", "Адрес")}</h2>
        <ul class="info-list">
          <li>{icon("i-pin")}<span><span class="ph">{L("Street and number", "Улица и дом")}</span><br><span class="ph">{L("Postcode, city", "Индекс, город")}</span></span></li>
          <li>{icon("i-phone")}<span class="ph">{L("Phone number to add", "Номер телефона")}</span></li>
          <li>{icon("i-mail")}<span><a href="mailto:{EMAIL}">{EMAIL}</a></span></li>
        </ul>
        <p style="margin-top:18px;font-size:14px;color:var(--muted)">{L("Dashed details are placeholders for the club's real address and phone.", "Подчёркнутые пунктиром данные — заглушки для реального адреса и телефона клуба.")}</p>
      </div>
      <div class="panel" data-reveal style="--d:80ms">
        <h2 class="h-m" style="margin-bottom:12px">{L("Opening hours", "Часы работы")}</h2>
        <p class="status" data-status style="margin-bottom:12px"><span class="status__dot"></span><span data-status-text>{L("Open every day", "Открыто каждый день")}</span></p>
        {hours_table()}
        <p style="margin-top:12px;font-size:14px;color:var(--muted)">{L("Sample hours, shown in your local time.", "Примерный график, по твоему местному времени.")}</p>
      </div>
    </div>
  </section>
  <section class="section section--alt" id="message" aria-labelledby="form-title">
    <div class="container" style="max-width:820px">
      <span class="kicker" data-reveal>{L("Message", "Сообщение")}</span>
      <h2 class="h-l" id="form-title" data-reveal style="margin-bottom:28px">{L("Write to us", "Напиши нам")}</h2>
      <form class="form panel" id="contact-form" novalidate data-form="contact">
        <div class="form__row form__row--2">
          <div class="field"><label for="c-name">{L("Name", "Имя")}</label><input id="c-name" name="name" autocomplete="name" required aria-describedby="e-c-name">{field_err("c-name")}</div>
          <div class="field"><label for="c-email">Email</label><input id="c-email" name="email" type="email" inputmode="email" autocomplete="email" required aria-describedby="e-c-email">{field_err("c-email")}</div>
        </div>
        <div class="field"><label for="c-topic">{L("Topic", "Тема")}</label><select id="c-topic" name="topic"><option>{L("Membership", "Абонементы")}</option><option>{L("Personal training", "Персональные тренировки")}</option><option>{L("Corporate offers", "Корпоративные предложения")}</option><option>{L("Other", "Другое")}</option></select></div>
        <div class="field"><label for="c-msg">{L("Message", "Сообщение")}</label><textarea id="c-msg" name="message" required aria-describedby="e-c-msg"></textarea>{field_err("c-msg")}</div>
        <div><button class="btn" type="submit">{L("Send message", "Отправить")}</button></div>
      </form>
      <div class="success" id="contact-success" hidden tabindex="-1">
        <h3>{L("Message ready", "Сообщение готово")}</h3>
        <p>{L("Thanks! This is a design concept, so nothing was sent. On the live site this goes straight to the club.", "Спасибо! Это дизайн-концепт, поэтому ничего не отправлено. На рабочем сайте сообщение сразу уйдёт в клуб.")}</p>
        <p><button class="btn btn--ghost btn--small" type="button" data-reset="contact">{L("Write another", "Написать ещё")}</button></p>
      </div>
    </div>
  </section>
</main>"""
    return head("contact.html", L("Contact & opening hours · Iron Club", "Контакты и часы работы · Iron Club"),
                L("Contact Iron Club: opening hours, email and a message form. Questions about membership and coaching welcome.", "Контакты Iron Club: часы работы, email и форма для сообщения. Ответим на вопросы об абонементах и тренировках.")) + header("contact.html") + body + footer()


def page_trial():
    goals = [("strength", L("Build strength", "Стать сильнее")), ("hiit", L("Get fit, lose weight", "Форма и похудение")), ("personal", L("Personal coaching", "Личный тренер")), ("mobility", L("Move without pain", "Двигаться без боли"))]
    times = [("morning", L("Morning", "Утро")), ("afternoon", L("Afternoon", "День")), ("evening", L("Evening", "Вечер"))]
    days = [L(d, r) for d, r in [("Monday", "Понедельник"), ("Tuesday", "Вторник"), ("Wednesday", "Среда"), ("Thursday", "Четверг"), ("Friday", "Пятница"), ("Saturday", "Суббота"), ("Sunday", "Воскресенье")]]
    radios = lambda name, opts: "".join(f'<input type="radio" id="{name}-{v}" name="{name}" value="{v}"><label for="{name}-{v}">{t}</label>' for v, t in opts)
    body = f"""<main id="main">
  {page_hero(L("Free trial", "Пробная тренировка"), L("Your first session", "Первая тренировка") + ' <span class="accent">' + L("is free", "бесплатно") + '</span>', L("One coached session, a movement check and a four-week starting plan. No card needed.", "Одно занятие с тренером, проверка движений и стартовый план на четыре недели. Карта не нужна."))}
  <section class="section" style="padding-top:56px" aria-labelledby="trial-title">
    <div class="container" style="max-width:860px">
      <h2 class="sr-only" id="trial-title">{L("Book your free trial", "Запись на пробную тренировку")}</h2>
      <form class="form panel" id="trial-form" novalidate data-form="trial">
        <div class="form__row form__row--2">
          <div class="field"><label for="t-name">{L("Full name", "Имя и фамилия")}</label><input id="t-name" name="name" autocomplete="name" required aria-describedby="e-t-name">{field_err("t-name")}</div>
          <div class="field"><label for="t-email">Email</label><input id="t-email" name="email" type="email" inputmode="email" autocomplete="email" required aria-describedby="e-t-email">{field_err("t-email")}</div>
        </div>
        <div class="field"><label for="t-phone">{L("Phone", "Телефон")} <span class="opt">({L("optional", "необязательно")})</span></label><input id="t-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" aria-describedby="e-t-phone">{field_err("t-phone")}</div>
        <fieldset class="field" aria-describedby="e-t-goal"><legend>{L("Your main goal", "Твоя главная цель")}</legend><div class="radios" id="t-goal">{radios("goal", goals)}</div>{field_err("t-goal")}</fieldset>
        <div class="form__row form__row--2">
          <div class="field"><label for="t-day">{L("Preferred day", "Удобный день")}</label><select id="t-day" name="day" required aria-describedby="e-t-day"><option value="">{L("Choose a day", "Выбери день")}</option>{''.join(f'<option>{d}</option>' for d in days)}</select>{field_err("t-day")}</div>
          <fieldset class="field" aria-describedby="e-t-time"><legend>{L("Time of day", "Время")}</legend><div class="radios" id="t-time">{radios("time", times)}</div>{field_err("t-time")}</fieldset>
        </div>
        <label class="check"><input type="checkbox" id="t-consent" name="consent" required aria-describedby="e-t-consent"><span>{L("I agree that the club may contact me about my free trial.", "Я согласен(на), что клуб свяжется со мной по поводу пробной тренировки.")}</span></label>
        {field_err("t-consent")}
        <div><button class="btn" type="submit">{L("Book my free trial", "Записаться бесплатно")} {icon("i-arrow")}</button></div>
      </form>
      <div class="success" id="trial-success" hidden tabindex="-1">
        <h3>{L("You're booked in (demo)", "Ты записан(а) (демо)")}</h3>
        <p id="trial-summary"></p>
        <p>{L("This is a design concept, so no booking was made. On the live site the club would confirm by email.", "Это дизайн-концепт, поэтому запись не создана. На рабочем сайте клуб подтвердит её по email.")}</p>
        <p><button class="btn btn--ghost btn--small" type="button" data-reset="trial">{L("Book another", "Новая запись")}</button></p>
      </div>
    </div>
  </section>
  <section class="section section--alt" aria-labelledby="expect-title">
    <div class="container">
      <div class="section__head"><span class="kicker" data-reveal>{L("What to expect", "Что тебя ждёт")}</span><h2 class="h-l" id="expect-title" data-reveal>{L("60 minutes,", "60 минут,")} <span class="accent">{L("three parts", "три части")}</span></h2></div>
      <ol class="steps">
        <li class="step" data-reveal><h3>{L("Talk", "Разговор")}</h3><p>{L("Your goal, your history, your schedule.", "Твоя цель, опыт и расписание.")}</p></li>
        <li class="step" data-reveal style="--d:80ms"><h3>{L("Move", "Движение")}</h3><p>{L("A movement check and a short coached workout.", "Проверка движений и короткая тренировка с тренером.")}</p></li>
        <li class="step" data-reveal style="--d:160ms"><h3>{L("Plan", "План")}</h3><p>{L("Four weeks of training written for you.", "Программа на четыре недели, составленная для тебя.")}</p></li>
      </ol>
    </div>
  </section>
</main>"""
    return head("free-trial.html", L("Book a free trial session · Iron Club", "Бесплатная пробная тренировка · Iron Club"),
                L("Book a free trial at Iron Club: one coached session, a movement check and a four-week starting plan.", "Запишись на бесплатную тренировку в Iron Club: занятие с тренером, проверка движений и план на четыре недели.")) + header("free-trial.html") + body + footer()


FAVICON = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#0b0b0b"/>'
           '<circle cx="16" cy="16" r="10" fill="none" stroke="#ff5a1f" stroke-width="3"/><circle cx="16" cy="16" r="3" fill="#ff5a1f"/></svg>')

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(ROOT), help="output folder (default: this folder)")
    ap.add_argument("--photos", help="folder with athlete/gym/ropes/coaching/led .webp files for a photo build")
    args = ap.parse_args()
    OUTDIR = Path(args.out)
    if args.photos:
        PHOTO_ON = True
        (OUTDIR / "assets" / "img").mkdir(parents=True, exist_ok=True)
        for k in PHOTO_SIZE:
            shutil.copy(Path(args.photos) / f"{k}.webp", OUTDIR / "assets" / "img" / f"{k}.webp")
        if OUTDIR != ROOT:
            for f in ("styles.css", "app.js"):
                shutil.copy(ROOT / "assets" / f, OUTDIR / "assets" / f)
    builders = [("index.html", page_index), ("training.html", page_training), ("membership.html", page_membership),
                ("coaches.html", page_coaches), ("about.html", page_about), ("contact.html", page_contact), ("free-trial.html", page_trial)]
    for lang, out in [("en", OUTDIR), ("ru", OUTDIR / "ru")]:
        LANG = lang
        out.mkdir(exist_ok=True)
        for name, fn in builders:
            (out / name).write_text(fn(), encoding="utf-8")
        print("built", lang, len(builders), "pages")
    (OUTDIR / "assets").mkdir(parents=True, exist_ok=True)
    (OUTDIR / "assets" / "favicon.svg").write_text(FAVICON, encoding="utf-8")
