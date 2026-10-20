#!/usr/bin/env python3
"""Builds the Toloache concept site: shared components -> five static HTML pages.

Run:  python3 toloache/build.py
Edit the data (MENU, HOURS, CONTACT) or the component functions, then rebuild.
"""
import html
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent

# ---------------------------------------------------------------- data
BOOKING_URL = "https://toloache.metro.bar/?lang=en"
OFFICIAL_URL = "https://toloacheparis.com/"
MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Toloache+49+rue+de+Clignancourt+75018+Paris"
CONTACT = {
    "street": "49 rue de Clignancourt",
    "postcode": "75018",
    "city": "Paris",
    "phone_display": "+33 6 41 84 76 55",
    "phone_tel": "+33641847655",
    "email": "toloacheparis@gmail.com",
}
# Hours as published on the restaurant's own site; other listings differ (to confirm).
HOURS = [
    ("Monday", None),
    ("Tuesday", "12:00–15:00 · 19:00–23:00"),
    ("Wednesday", "12:00–15:00 · 19:00–23:00"),
    ("Thursday", "12:00–15:00 · 19:00–23:00"),
    ("Friday", "12:00–15:00 · 19:00–02:00"),
    ("Saturday", "12:00–15:00 · 19:00–02:00"),
    ("Sunday", None),
]
# Nine items with published prices. Descriptions are not invented.
MENU = [
    ("tacos", "Tacos Arrachera", 14, "d-taco", "marigold"),
    ("tacos", "Tacos Gambas", 15, "d-taco-gambas", "rosa"),
    ("tortas", "Torta Mexicaine", 15, "d-torta", "agave"),
    ("tortas", "Torta Cancún", 14, "d-torta", "enamel"),
    ("tortas", "Burrito Carne", 16, "d-burrito", "chili"),
    ("tortas", "Burrito Chili con Carne", 16, "d-burrito-chili", "marigold"),
    ("share", "Guacamole maison", 12, "d-guac", "rosa"),
    ("share", "Quesadilla", 10, "d-quesadilla", "enamel"),
    ("share", "Courgettes à la mexicaine", 10, "d-courgette", "agave"),
]
CATS = {"tacos": "Tacos", "tortas": "Tortas & burritos", "share": "To share"}
ART_BG = {"marigold": "#f2a516", "rosa": "#f4a6c6", "agave": "#a9d8b8", "enamel": "#b9c8f0", "chili": "#f6b3a8"}

PAGES = [
    ("index.html", "Home"),
    ("menu.html", "Menu"),
    ("story.html", "Our Story"),
    ("events.html", "Events"),
    ("contact.html", "Contact"),
]

e = html.escape


# ---------------------------------------------------------------- svg sprite
SPRITE = """<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
<defs>
<symbol id="i-arrow" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6"/></symbol>
<symbol id="i-external" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></symbol>
<symbol id="i-menu" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M4 7h16M4 12h16M4 17h10"/></symbol>
<symbol id="i-close" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M6 6l12 12M18 6 6 18"/></symbol>
<symbol id="i-pin" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></g></symbol>
<symbol id="i-phone" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></symbol>
<symbol id="i-mail" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></g></symbol>
<symbol id="i-clock" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></g></symbol>
<symbol id="i-metro" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 16V8l4 5 4-5v8"/></g></symbol>
<symbol id="i-info" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></g></symbol>
<symbol id="i-flame" viewBox="0 0 32 32"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"><path d="M16 4c1 5 6 7 6 13a6 6 0 0 1-12 0c0-3 2-5 3-7 0 3 1 4 2 4 0-4-1-6 1-10Z"/><path d="M4 26h24M7 29h18"/></g></symbol>
<symbol id="i-leaf" viewBox="0 0 32 32"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"><path d="M6 26C6 13 14 6 27 5c-1 13-8 21-21 21Z"/><path d="M6 26 18 14"/></g></symbol>
<symbol id="i-music" viewBox="0 0 32 32"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"><path d="M12 24V7l14-3v17"/><circle cx="8.5" cy="24" r="3.5"/><circle cx="22.5" cy="21" r="3.5"/></g></symbol>

<!-- dish illustrations (Lotería art) -->
<symbol id="d-taco" viewBox="0 0 200 200">
  <path d="M26 146a74 74 0 0 1 148 0z" fill="#f7cf74" stroke="#2a0d12" stroke-width="6" stroke-linejoin="round"/>
  <path d="M42 132a58 58 0 0 1 116 0" fill="none" stroke="#7a2e1d" stroke-width="18" stroke-linecap="round"/>
  <path d="M44 112q10-15 21-4 10-16 22-4 12-15 23-3 12-14 22 0 10-11 19 5" fill="none" stroke="#3f9b4f" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  <g fill="#d6262e"><circle cx="70" cy="104" r="6"/><circle cx="104" cy="96" r="6"/><circle cx="134" cy="106" r="6"/></g>
  <g fill="#fff8e8"><circle cx="86" cy="100" r="4"/><circle cx="120" cy="99" r="4"/></g>
  <path d="M22 146h156" stroke="#2a0d12" stroke-width="6" stroke-linecap="round"/>
</symbol>
<symbol id="d-taco-gambas" viewBox="0 0 200 200">
  <path d="M26 146a74 74 0 0 1 148 0z" fill="#f7cf74" stroke="#2a0d12" stroke-width="6" stroke-linejoin="round"/>
  <path d="M44 120q10-15 21-4 10-16 22-4 12-15 23-3 12-14 22 0 10-11 19 5" fill="none" stroke="#3f9b4f" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  <g fill="#ff8a5c" stroke="#2a0d12" stroke-width="4" stroke-linejoin="round">
    <path d="M58 104c-4-22 22-34 38-20-10-2-20 4-20 14 0 6 4 10 8 12-12 4-24 2-26-6Z"/>
    <path d="M106 98c-4-22 22-34 38-20-10-2-20 4-20 14 0 6 4 10 8 12-12 4-24 2-26-6Z"/>
  </g>
  <path d="M22 146h156" stroke="#2a0d12" stroke-width="6" stroke-linecap="round"/>
</symbol>
<symbol id="d-torta" viewBox="0 0 200 200">
  <path d="M30 104c0-36 32-56 70-56s70 20 70 56z" fill="#e3a157" stroke="#2a0d12" stroke-width="6" stroke-linejoin="round"/>
  <g fill="#fff3d6"><ellipse cx="78" cy="72" rx="4" ry="2.5"/><ellipse cx="104" cy="64" rx="4" ry="2.5"/><ellipse cx="128" cy="76" rx="4" ry="2.5"/><ellipse cx="96" cy="84" rx="4" ry="2.5"/></g>
  <path d="M26 112q12-10 24 0t24 0 24 0 24 0 24 0 24 0" fill="none" stroke="#3f9b4f" stroke-width="10" stroke-linecap="round"/>
  <rect x="32" y="116" width="136" height="14" rx="6" fill="#d6262e" stroke="#2a0d12" stroke-width="5"/>
  <rect x="36" y="130" width="128" height="12" rx="5" fill="#f2d16b" stroke="#2a0d12" stroke-width="5"/>
  <path d="M30 144h140a6 6 0 0 1 0 0c0 14-12 20-24 20H54c-12 0-24-6-24-20Z" fill="#e3a157" stroke="#2a0d12" stroke-width="6" stroke-linejoin="round"/>
</symbol>
<symbol id="d-burrito" viewBox="0 0 200 200">
  <g transform="rotate(-28 100 100)">
    <rect x="36" y="70" width="128" height="62" rx="31" fill="#f3dba6" stroke="#2a0d12" stroke-width="6"/>
    <path d="M90 70h44a31 31 0 0 1 0 62H90z" fill="#c9cfdb" stroke="#2a0d12" stroke-width="6" stroke-linejoin="round"/>
    <path d="M100 82l8 10-8 10 8 10-8 10" fill="none" stroke="#8e96a8" stroke-width="4" stroke-linejoin="round"/>
    <ellipse cx="50" cy="101" rx="16" ry="29" fill="#fff8e8" stroke="#2a0d12" stroke-width="5"/>
    <g fill="#7a2e1d"><circle cx="46" cy="92" r="4"/><circle cx="54" cy="104" r="4"/><circle cx="46" cy="112" r="3.5"/></g>
    <g fill="#d6262e"><circle cx="54" cy="88" r="3.5"/><circle cx="44" cy="102" r="3"/></g>
    <circle cx="52" cy="118" r="3.5" fill="#3f9b4f"/>
  </g>
</symbol>
<symbol id="d-burrito-chili" viewBox="0 0 200 200">
  <use href="#d-burrito"/>
  <g transform="translate(118 34) rotate(24)">
    <path d="M4 10c18-4 44 4 52 30-14-12-38-16-52-14z" fill="#d6262e" stroke="#2a0d12" stroke-width="5" stroke-linejoin="round"/>
    <path d="M4 10c-4-6-2-12 4-14" fill="none" stroke="#3f9b4f" stroke-width="6" stroke-linecap="round"/>
  </g>
</symbol>
<symbol id="d-guac" viewBox="0 0 200 200">
  <path d="M60 64l40-40 38 38z" fill="#f7cf74" stroke="#2a0d12" stroke-width="6" stroke-linejoin="round"/>
  <path d="M40 92c6-24 114-24 120 0z" fill="#79b84d" stroke="#2a0d12" stroke-width="6" stroke-linejoin="round"/>
  <g fill="#4e8a2e"><circle cx="76" cy="84" r="5"/><circle cx="100" cy="78" r="5"/><circle cx="124" cy="85" r="5"/></g>
  <g fill="#d6262e"><circle cx="88" cy="86" r="4"/><circle cx="112" cy="84" r="4"/></g>
  <path d="M32 92h136c0 40-30 60-68 60S32 132 32 92Z" fill="#4c3e40" stroke="#2a0d12" stroke-width="6" stroke-linejoin="round"/>
  <g fill="#6b5b5d"><circle cx="64" cy="112" r="4"/><circle cx="92" cy="126" r="3.5"/><circle cx="126" cy="114" r="4"/><circle cx="110" cy="136" r="3"/></g>
  <path d="M62 150l-8 20h20l4-14M138 150l8 20h-20l-4-14" fill="#4c3e40" stroke="#2a0d12" stroke-width="6" stroke-linejoin="round"/>
</symbol>
<symbol id="d-quesadilla" viewBox="0 0 200 200">
  <path d="M24 132a76 76 0 0 1 152 0z" fill="#f2c46b" stroke="#2a0d12" stroke-width="6" stroke-linejoin="round"/>
  <g stroke="#b36b2a" stroke-width="7" stroke-linecap="round"><path d="M58 86l22 40M92 68l22 58M128 76l18 46"/></g>
  <path d="M40 132c4 10 10 12 14 0 4 14 12 16 16 0 6 12 14 12 18 0" fill="#ffe27a" stroke="#2a0d12" stroke-width="5" stroke-linejoin="round"/>
  <path d="M20 132h160" stroke="#2a0d12" stroke-width="6" stroke-linecap="round"/>
</symbol>
<symbol id="d-courgette" viewBox="0 0 200 200">
  <g transform="rotate(-24 100 100)">
    <rect x="28" y="78" width="140" height="40" rx="20" fill="#3f8a3a" stroke="#2a0d12" stroke-width="6"/>
    <path d="M48 92h96M52 104h88" stroke="#7cc06a" stroke-width="5" stroke-linecap="round"/>
    <path d="M168 98h12" stroke="#2a0d12" stroke-width="8" stroke-linecap="round"/>
  </g>
  <g transform="rotate(14 100 140)">
    <rect x="44" y="126" width="112" height="34" rx="17" fill="#5aa64a" stroke="#2a0d12" stroke-width="6"/>
    <circle cx="44" cy="143" r="15" fill="#e8f2c8" stroke="#2a0d12" stroke-width="5"/>
    <g fill="#9cc56f"><circle cx="40" cy="140" r="2.5"/><circle cx="48" cy="146" r="2.5"/><circle cx="42" cy="149" r="2"/></g>
  </g>
</symbol>
<symbol id="d-agave" viewBox="0 0 200 200">
  <g fill="#2f7a55" stroke="#2a0d12" stroke-width="5" stroke-linejoin="round">
    <path d="M100 160 92 40l16 0z"/><path d="M100 160 40 66l14-6z"/><path d="M100 160 160 66l-14-6z"/>
    <path d="M100 160 20 120l8-12z"/><path d="M100 160 180 120l-8-12z"/>
  </g>
  <path d="M60 160h80" stroke="#2a0d12" stroke-width="6" stroke-linecap="round"/>
</symbol>
<symbol id="d-glass" viewBox="0 0 200 200">
  <path d="M60 50h80l-8 100a10 10 0 0 1-10 9H78a10 10 0 0 1-10-9z" fill="#e9f3f7" stroke="#2a0d12" stroke-width="6" stroke-linejoin="round"/>
  <path d="M66 96h68l-5 52a8 8 0 0 1-8 7H79a8 8 0 0 1-8-7z" fill="#f3c34f"/>
  <circle cx="140" cy="54" r="22" fill="#9ccb4a" stroke="#2a0d12" stroke-width="6"/>
  <path d="M140 36v36M122 54h36" stroke="#2a0d12" stroke-width="3"/>
</symbol>
<symbol id="d-plancha" viewBox="0 0 200 200">
  <rect x="24" y="110" width="152" height="24" rx="6" fill="#3b3536" stroke="#2a0d12" stroke-width="6"/>
  <path d="M40 134v22M160 134v22" stroke="#2a0d12" stroke-width="8" stroke-linecap="round"/>
  <g fill="#f7cf74" stroke="#2a0d12" stroke-width="5"><ellipse cx="66" cy="104" rx="26" ry="8"/><ellipse cx="128" cy="104" rx="26" ry="8"/></g>
  <g fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="5" stroke-linecap="round"><path d="M60 80q-8-10 0-20t0-20"/><path d="M100 84q-8-10 0-20t0-20"/><path d="M136 80q-8-10 0-20t0-20"/></g>
</symbol>
<symbol id="d-mic" viewBox="0 0 200 200">
  <rect x="80" y="30" width="40" height="70" rx="20" fill="#e9e3f2" stroke="#2a0d12" stroke-width="6"/>
  <path d="M64 86a36 36 0 0 0 72 0M100 122v34M74 160h52" fill="none" stroke="#2a0d12" stroke-width="6" stroke-linecap="round"/>
  <g fill="#f2a516"><circle cx="40" cy="50" r="6"/><circle cx="162" cy="70" r="5"/><circle cx="152" cy="34" r="4"/></g>
</symbol>
</defs>
</svg>"""


def icon(name, cls=""):
    c = f' class="{cls}"' if cls else ""
    vb = ' viewBox="0 0 200 200"' if name.startswith("d-") else ""
    return f'<svg{c}{vb} aria-hidden="true" focusable="false"><use href="#{name}"/></svg>'


def picado():
    colors = ["#c41e2b", "#f2a516", "#d8126a", "#1f6b4f", "#1d3a8a", "#f2a516", "#c41e2b", "#d8126a", "#1f6b4f", "#1d3a8a", "#f2a516", "#c41e2b"]
    flags = []
    for i, c in enumerate(colors):
        x = 4 + i * 100
        flags.append(
            f'<g class="picado__flag"><path d="M{x} 6h88v40l-11 10-11-10-11 10-11-10-11 10-11-10-11 10-11-10z" fill="{c}"/>'
            f'<circle cx="{x+44}" cy="24" r="7" fill="#fdf3ef"/><path d="M{x+20} 18h8v8h-8zM{x+60} 18h8v8h-8z" fill="#fdf3ef"/></g>'
        )
    return ('<svg class="picado" viewBox="0 0 1200 64" preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">'
            '<path d="M0 6h1200" stroke="#2a0d12" stroke-width="2"/>' + "".join(flags) + "</svg>")


def photo(art, color, caption, cls=""):
    return (f'<figure class="photo photo--{color} {cls}" role="img" aria-label="Placeholder illustration. {e(caption)}">'
            f'<div class="photo__art">{icon(art)}</div>'
            f'<figcaption class="photo__tag"><b>Photo to come</b><span>{e(caption)}</span></figcaption></figure>')


def book_btn(cls="btn", label="Book a table"):
    return (f'<a class="{cls}" href="{BOOKING_URL}" target="_blank" rel="noopener" '
            f'aria-label="{label} (opens Toloache\'s booking page in a new tab)">{label} {icon("i-external")}</a>')


def tbc(text="to confirm"):
    return f'<span class="tbc">{e(text)}</span>'


def hours_table(cls="hours"):
    rows = []
    for i, (day, val) in enumerate(HOURS):
        rows.append(f'<tr data-day="{(i + 1) % 7}"><th scope="row">{day}</th><td>{e(val) if val else "Closed"}</td></tr>')
    return f'<table class="{cls}"><caption class="sr-only">Opening hours</caption><tbody>{"".join(rows)}</tbody></table>'


def lcard(idx, item):
    cat, name, price, art, bg = item
    return (f'<article class="lcard" data-cat="{cat}" data-reveal style="--d:{(idx % 3) * 80}ms">'
            f'<div class="lcard__frame">'
            f'<div class="lcard__top"><span class="lcard__no">No. {idx + 1}</span><span class="lcard__price">{price} €</span></div>'
            f'<div class="lcard__art" style="--art-bg:{ART_BG[bg]}">{icon(art)}</div>'
            f'<h3 class="lcard__name">{e(name)}<span class="lcard__cat">{CATS[cat]}</span></h3>'
            f'</div></article>')


# ---------------------------------------------------------------- layout
def head(page, title, desc, jsonld=None):
    ld = ""
    if jsonld:
        ld = '<script type="application/ld+json">' + json.dumps(jsonld, ensure_ascii=False) + "</script>"
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#fdf3ef">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:type" content="website">
<meta property="og:locale" content="en_GB">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Karla:wght@400;500;700&family=Playfair+Display:ital,wght@0,700;0,800;1,600;1,700;1,800&display=swap">
<link rel="stylesheet" href="assets/styles.css">
<script>document.documentElement.classList.add('js');setTimeout(function(){{if(!window.__tlReady)document.documentElement.classList.remove('js')}},2500);</script>
{ld}
</head>
<body data-page="{page}">
{SPRITE}
<a class="skip-link" href="#main">Skip to content</a>
<div class="concept-bar" role="note"><div class="container"><span>Design concept, not the official Toloache website.</span><a href="{OFFICIAL_URL}" target="_blank" rel="noopener">Visit toloacheparis.com</a></div></div>
"""


def header(active):
    links = "".join(
        f'<li><a href="{href}"{" aria-current=\"page\"" if href == active else ""}>{label}</a></li>'
        for href, label in PAGES[1:]
    )
    return f"""<header class="site-header" id="site-header">
  <div class="container">
    <a class="wordmark" href="index.html" aria-label="Toloache, home"><span class="wordmark__name">Toloache</span><span class="wordmark__sub">Mexicain · Paris 18e</span></a>
    <nav class="nav" aria-label="Main"><ul>{links}</ul></nav>
    <div class="header-actions">
      {book_btn("btn btn--small")}
      <button class="menu-toggle" id="menu-open" type="button" aria-label="Open menu" aria-controls="mobile-nav" aria-expanded="false">{icon("i-menu")}</button>
    </div>
  </div>
</header>
<div class="mobile-nav" id="mobile-nav" role="dialog" aria-modal="true" aria-label="Menu">
  <div class="mobile-nav__top">
    <a class="wordmark" href="index.html"><span class="wordmark__name">Toloache</span><span class="wordmark__sub">Mexicain · Paris 18e</span></a>
    <button class="menu-toggle" id="menu-close" type="button" aria-label="Close menu">{icon("i-close")}</button>
  </div>
  <ul>
    <li><a href="index.html"{' aria-current="page"' if active == "index.html" else ""}>Home</a></li>
    {"".join(f'<li><a href="{h}"' + (' aria-current="page"' if h == active else "") + f'>{l}</a></li>' for h, l in PAGES[1:])}
  </ul>
  {book_btn("btn btn--light")}
</div>
"""


def footer():
    hours = "".join(f'<div><span>{d[:3]}</span><span>{e(v) if v else "Closed"}</span></div>' for d, v in HOURS)
    return f"""<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <a class="wordmark" href="index.html" aria-label="Toloache, home"><span class="wordmark__name">Toloache</span><span class="wordmark__sub">Mexicain · Paris 18e</span></a>
        <p style="margin-top:16px;max-width:34ch">Mexican cooking with a French accent, tacos off the plancha, and La Playita downstairs.</p>
      </div>
      <div>
        <h2>Visit</h2>
        <address style="font-style:normal">{CONTACT["street"]}<br>{CONTACT["postcode"]} {CONTACT["city"]}</address>
        <p style="margin-top:8px"><a href="{MAPS_URL}" target="_blank" rel="noopener">Open in Google Maps</a></p>
      </div>
      <div>
        <h2>Hours</h2>
        <div class="footer-hours">{hours}</div>
      </div>
      <div>
        <h2>Explore</h2>
        <ul>
          {"".join(f'<li><a href="{h}">{l}</a></li>' for h, l in PAGES[1:])}
          <li><a href="{BOOKING_URL}" target="_blank" rel="noopener">Book a table</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-note">
      <span>Design concept for Toloache. Not affiliated with or endorsed by the restaurant.</span>
      <span>Illustrations are placeholders for the restaurant's own photography.</span>
    </div>
  </div>
</footer>
<div class="book-bar" id="book-bar">
  <a class="btn btn--light" href="menu.html">Menu</a>
  {book_btn("btn")}
</div>
<script src="assets/app.js"></script>
</body>
</html>
"""


def visit_section(dark=True):
    cls = "section section--ink" if dark else "section"
    return f"""<section class="{cls}" id="visit" aria-labelledby="visit-title">
  <div class="container visit">
    <div>
      <span class="eyebrow" data-reveal>Find us</span>
      <h2 class="display-l" id="visit-title" data-reveal>At the foot of Montmartre</h2>
      <p class="lead" style="margin-top:16px" data-reveal>Nearest metro: Château Rouge, line 4.</p>
      <ul class="contact-list" style="margin-top:28px" data-reveal>
        <li>{icon("i-pin")}<span><b>{CONTACT["street"]}</b><br>{CONTACT["postcode"]} {CONTACT["city"]}</span></li>
        <li>{icon("i-phone")}<span><a href="tel:{CONTACT["phone_tel"]}">{CONTACT["phone_display"]}</a> {tbc()}</span></li>
        <li>{icon("i-mail")}<span><a href="mailto:{CONTACT["email"]}">{CONTACT["email"]}</a></span></li>
      </ul>
    </div>
    <div data-reveal>
      <p class="status" data-status style="margin-bottom:16px;color:var(--ink)"><span class="status__dot"></span><span data-status-text>Opening hours</span></p>
      {hours_table()}
      <p style="margin-top:12px;font-size:14px">Hours from the restaurant's site. Other listings differ {tbc()}</p>
    </div>
  </div>
</section>"""


def map_card():
    return f"""<div class="map-card" data-reveal>
  <svg viewBox="0 0 600 380" role="img" aria-label="Schematic map: Toloache on rue de Clignancourt, near Château Rouge metro station. Not to scale.">
    <rect width="600" height="380" fill="#efe7f3"/>
    <g stroke="#fff" stroke-width="18" stroke-linecap="round"><path d="M-20 120 620 80"/><path d="M-20 260 620 300"/><path d="M120 -20 160 400"/><path d="M470 -20 430 400"/></g>
    <path d="M300 -20 300 400" stroke="#ffffff" stroke-width="30"/>
    <path d="M300 -20 300 400" stroke="#f2a516" stroke-width="6" stroke-dasharray="2 14" stroke-linecap="round"/>
    <text x="316" y="40" font-family="Barlow Condensed, Arial Narrow, sans-serif" font-weight="700" font-size="20" fill="#1d3a8a" letter-spacing="2">RUE DE CLIGNANCOURT</text>
    <g transform="translate(96 300)"><circle r="20" fill="#1d3a8a"/><text y="7" text-anchor="middle" font-family="Barlow Condensed, sans-serif" font-weight="700" font-size="22" fill="#fff">M</text>
      <text x="30" y="7" font-family="Barlow Condensed, sans-serif" font-weight="700" font-size="18" fill="#2a0d12">Château Rouge · 4</text></g>
    <g transform="translate(300 182)"><path d="M0 0c-16-18-26-30-26-44a26 26 0 0 1 52 0C26-30 16-18 0 0Z" fill="#c41e2b" stroke="#2a0d12" stroke-width="4"/><circle cy="-44" r="9" fill="#fff"/>
      <rect x="34" y="-66" width="128" height="40" rx="8" fill="#2a0d12"/><text x="98" y="-40" text-anchor="middle" font-family="Playfair Display, Georgia, serif" font-style="italic" font-weight="700" font-size="20" fill="#fff">Toloache</text></g>
  </svg>
  <div class="map-card__foot"><span style="font-size:14px">Schematic, not to scale</span><a class="link-arrow" href="{MAPS_URL}" target="_blank" rel="noopener">Directions {icon("i-external")}</a></div>
</div>"""


def book_band(title="Save your seat at the plancha", text="Tables are booked through the restaurant's own reservation page. It takes about a minute."):
    return f"""<section class="section" aria-labelledby="book-title">
  <div class="container">
    <div class="book-band" data-reveal>
      <div>
        <h2 class="display-l" id="book-title">{e(title)}</h2>
        <p style="margin-top:14px">{e(text)}</p>
      </div>
      <div class="book-band__actions">
        {book_btn("btn btn--light")}
        <a class="book-band__phone" href="tel:{CONTACT["phone_tel"]}">or call {CONTACT["phone_display"]}</a>
      </div>
    </div>
  </div>
</section>"""


RESTAURANT_LD = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Toloache",
    "url": OFFICIAL_URL,
    "servesCuisine": "Mexican",
    "email": CONTACT["email"],
    "address": {
        "@type": "PostalAddress",
        "streetAddress": CONTACT["street"],
        "postalCode": CONTACT["postcode"],
        "addressLocality": CONTACT["city"],
        "addressCountry": "FR",
    },
    "acceptsReservations": BOOKING_URL,
    "hasMenu": OFFICIAL_URL + "menu.php",
}


# ---------------------------------------------------------------- pages
def page_home():
    highlights = [MENU[1], MENU[0], MENU[2], MENU[5], MENU[6], MENU[7]]
    cards = "".join(lcard(MENU.index(it), it) for it in highlights)
    body = f"""<main id="main">
  {picado()}
  <section class="hero" aria-labelledby="hero-title">
    <div class="container hero__grid">
      <div>
        <span class="eyebrow">Montmartre · Paris 18e</span>
        <h1 class="hero-title" id="hero-title">Mexico on the plancha. <em class="flourish">Paris</em> at the table.</h1>
        <p class="lead">Toloache brings Mexican cooking and French culinary tradition together on rue de Clignancourt. Fresh produce, tacos and tortas off the plancha, and a stage downstairs called La Playita.</p>
        <div class="hero__actions">
          {book_btn()}
          <a class="btn btn--ghost" href="menu.html">See the menu {icon("i-arrow")}</a>
        </div>
        <p class="status" data-status style="margin-top:24px"><span class="status__dot"></span><span data-status-text>Open Tuesday to Saturday</span></p>
      </div>
      <div class="hero__art">
        {photo("d-taco-gambas", "chili", "Tacos Gambas fresh off the plancha, shot from above on a terracotta plate")}
        <div class="hero__badge" aria-hidden="true"><div><span>Mezcal</span>&amp; tacos</div></div>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="concept-title" style="padding-top:24px">
    <div class="container">
      <div class="section__head section__head--split">
        <div>
          <span class="eyebrow" data-reveal>The idea</span>
          <h2 class="display-l" id="concept-title" data-reveal>Two kitchens, <em class="flourish">one plancha</em></h2>
        </div>
        <p class="lead" data-reveal>Recipes from Mexico, cooked with a Parisian sense of the table. Everything starts with fresh produce and a very hot plancha.</p>
      </div>
      <div class="pillars">
        <article class="pillar" data-reveal><div class="pillar__icon">{icon("i-flame")}</div><h3>Off the plancha</h3><p>Tacos, tortas and burritos are cooked to order on the flat-top grill, the heart of the kitchen.</p></article>
        <article class="pillar" data-reveal style="--d:80ms"><div class="pillar__icon">{icon("i-leaf")}</div><h3>Fresh, every service</h3><p>The kitchen works with fresh products, from the guacamole made in house to the courgettes à la mexicaine.</p></article>
        <article class="pillar" data-reveal style="--d:160ms"><div class="pillar__icon">{icon("i-music")}</div><h3>La Playita downstairs</h3><p>A cultural space for live music, DJ sets, exhibitions, theatre and film screenings.</p></article>
      </div>
    </div>
  </section>

  <section class="section section--marigold" aria-labelledby="menu-title">
    <div class="container">
      <div class="section__head section__head--split">
        <div>
          <span class="eyebrow" data-reveal>From the menu</span>
          <h2 class="display-l" id="menu-title" data-reveal>Draw a card</h2>
        </div>
        <p class="lead" style="color:var(--ink)" data-reveal>Our dishes, Lotería style. Prices from the published menu.</p>
      </div>
      <div class="loteria">{cards}</div>
      <p style="margin-top:36px"><a class="btn btn--ghost" href="menu.html">See the full menu {icon("i-arrow")}</a></p>
    </div>
  </section>

  <section class="section" aria-labelledby="gallery-title">
    <div class="container">
      <div class="section__head section__head--split">
        <div>
          <span class="eyebrow" data-reveal>Atmosphere</span>
          <h2 class="display-l" id="gallery-title" data-reveal>Colour, noise, <em class="flourish">mezcal</em></h2>
        </div>
        <p class="lead" data-reveal>These frames are art direction for the restaurant's own photography. Each caption describes the shot that belongs there.</p>
      </div>
      <div class="gallery" data-reveal>
        {photo("d-plancha", "ink", "The plancha during Friday dinner service, steam and flame, shot at counter height", "g1")}
        {photo("d-glass", "marigold", "A mezcal cocktail on the bar, lime wedge, warm backlight", "g2")}
        {photo("d-guac", "agave", "Guacamole maison in a molcajete, overhead", "g3")}
        {photo("d-agave", "enamel", "The dining room from the door, tables full, rue de Clignancourt behind", "g4")}
        {photo("d-mic", "rosa", "La Playita downstairs during a live set", "g5")}
      </div>
    </div>
  </section>

  <section class="section section--ink" aria-labelledby="playita-title">
    <div class="container playita">
      <div>
        <span class="eyebrow" data-reveal>Downstairs</span>
        <h2 class="display-l" id="playita-title" data-reveal>La Playita</h2>
        <p class="lead" style="margin-top:16px" data-reveal>Below the restaurant is a cultural space where music, art and cinema share the room.</p>
        <ul class="formats" data-reveal><li>Live music</li><li>DJ sets</li><li>Exhibitions</li><li>Theatre</li><li>Screenings</li><li>Private events</li></ul>
        <p style="margin-top:28px" data-reveal><a class="btn btn--light" href="events.html">What's on {icon("i-arrow")}</a></p>
      </div>
      <div style="aspect-ratio:4/3" data-reveal>{photo("d-mic", "rosa", "La Playita lit for a DJ set, crowd in silhouette")}</div>
    </div>
  </section>

  {visit_section(dark=False).replace('<div class="container visit">', '<div class="container visit">', 1)}
  <div class="container" style="margin-top:-48px">{map_card()}</div>
  {book_band()}
</main>"""
    return (head("home", "Toloache · Mexican restaurant & La Playita, Paris 18e (design concept)",
                 "Mexican cooking with a French accent at 49 rue de Clignancourt, Paris 18e. Tacos, tortas and burritos off the plancha, plus La Playita for music and art. Design concept.",
                 RESTAURANT_LD)
            + header("index.html") + body + footer())


def page_menu():
    cards = "".join(lcard(i, it) for i, it in enumerate(MENU))
    filters = '<button class="filter" type="button" data-filter="all" aria-pressed="true">All</button>' + "".join(
        f'<button class="filter" type="button" data-filter="{k}" aria-pressed="false">{v}</button>' for k, v in CATS.items())
    body = f"""<main id="main">
  {picado()}
  <section class="page-hero" aria-labelledby="page-title">
    <div class="container">
      <span class="eyebrow">Menu</span>
      <h1 class="display-xl" id="page-title">Tacos, tortas <em class="flourish">&amp; more</em></h1>
      <p class="lead">Mexican street food with a French touch, cooked on the plancha. Pick a category or browse the whole deck.</p>
    </div>
  </section>
  <section class="section" style="padding-top:0" aria-labelledby="dishes-title">
    <div class="container">
      <h2 class="sr-only" id="dishes-title">Dishes</h2>
      <div class="notice" style="margin-bottom:28px">{icon("i-info")}<p>These are the nine dishes with published prices. The full menu, current prices, drinks and lunch formulas are <b>to be confirmed with the restaurant</b> before launch.</p></div>
      <div class="filters" role="group" aria-label="Filter dishes">{filters}</div>
      <p class="sr-only" aria-live="polite" id="filter-status"></p>
      <div class="loteria" id="menu-grid">{cards}</div>
    </div>
  </section>
  {book_band("Hungry already?", "Book a table through the restaurant's reservation page, or come by for lunch.")}
</main>"""
    return (head("menu", "Menu · Toloache, Mexican restaurant in Paris 18e (design concept)",
                 "Tacos, tortas, burritos and dishes to share at Toloache, 49 rue de Clignancourt, Paris. Prices from the published menu. Design concept.")
            + header("menu.html") + body + footer())


def page_story():
    body = f"""<main id="main">
  {picado()}
  <section class="page-hero" aria-labelledby="page-title">
    <div class="container">
      <span class="eyebrow">Our story</span>
      <h1 class="display-xl" id="page-title">Where Mexico <em class="flourish">meets</em> Paris</h1>
      <p class="lead">Toloache describes itself as a meeting of Mexican and French culinary traditions, on one street in Montmartre.</p>
    </div>
  </section>
  <section class="section" style="padding-top:0" aria-labelledby="idea-title">
    <div class="container story-split">
      <div data-reveal>{photo("d-plancha", "chili", "Hands at the plancha, tortillas warming, close-up")}</div>
      <div class="prose" data-reveal>
        <span class="eyebrow">The idea</span>
        <h2 class="display-m" id="idea-title">Two traditions, one kitchen</h2>
        <p>The menu is built on Mexican classics: tacos, tortas, burritos, quesadillas and guacamole made in house. The restaurant pairs these recipes with French culinary tradition and an emphasis on fresh produce.</p>
        <p>Most dishes go across the plancha, the flat-top grill that sets the rhythm of every service.</p>
      </div>
    </div>
  </section>
  <section class="section section--marigold" aria-labelledby="street-title">
    <div class="container story-split story-split--rev">
      <div data-reveal style="display:grid;place-items:center">
        <div class="street-sign" role="img" aria-label="Paris street sign: 18th arrondissement, Rue de Clignancourt">
          <div class="street-sign__inner"><div class="street-sign__arr">18<sup>e</sup> Arr<sup>t</sup></div><div class="street-sign__name">Rue de<br>Clignancourt</div></div>
        </div>
      </div>
      <div class="prose" data-reveal>
        <span class="eyebrow">The neighbourhood</span>
        <h2 class="display-m" id="street-title">49 rue de Clignancourt</h2>
        <p style="color:var(--ink)">At the foot of Montmartre in the 18th arrondissement. The nearest metro is Château Rouge on line 4.</p>
      </div>
    </div>
  </section>
  <section class="section" aria-labelledby="facts-title">
    <div class="container">
      <span class="eyebrow" data-reveal>At a glance</span>
      <h2 class="display-m" id="facts-title" data-reveal style="margin-bottom:28px">The facts</h2>
      <dl class="facts" data-reveal>
        <div class="fact"><dt>Cuisine</dt><dd>Mexican, French touch</dd></div>
        <div class="fact"><dt>Cooking</dt><dd>On the plancha</dd></div>
        <div class="fact"><dt>Address</dt><dd>49 rue de Clignancourt</dd></div>
        <div class="fact"><dt>Founded</dt><dd>{tbc("Year to confirm")}</dd></div>
        <div class="fact"><dt>Founders</dt><dd>{tbc("Names to confirm")}</dd></div>
        <div class="fact"><dt>Downstairs</dt><dd>La Playita</dd></div>
      </dl>
      <div class="notice notice--confirm" style="margin-top:28px">{icon("i-info")}<p>The founders' names, the opening year and the story behind the name are not published. This page leaves space for them rather than inventing a history. <b>To be supplied by the restaurant.</b></p></div>
    </div>
  </section>
  {book_band()}
</main>"""
    return (head("story", "Our story · Toloache, Mexican-French cooking in Montmartre (design concept)",
                 "Toloache joins Mexican and French culinary traditions on rue de Clignancourt, Paris 18e. Design concept.")
            + header("story.html") + body + footer())


def page_events():
    fmts = [
        ("Live music", "Concerts on the La Playita stage.", "d-mic", "rosa"),
        ("DJ sets", "DJ nights in La Playita.", "d-glass", "marigold"),
        ("Exhibitions", "Art on the walls of the basement space.", "d-agave", "agave"),
        ("Theatre", "Theatre performances downstairs.", "d-mic", "enamel"),
        ("Film screenings", "Cinema nights downstairs.", "d-plancha", "ink"),
        ("Private events", "Hold your own event in La Playita. Send us a message to ask.", "d-taco", "chili"),
    ]
    cards = "".join(
        f'<article class="event" data-reveal style="--d:{(i % 3) * 80}ms">{photo(a, c, "La Playita: " + t)}'
        f'<div class="event__body"><h3>{e(t)}</h3><p>{e(d)}</p></div></article>' for i, (t, d, a, c) in enumerate(fmts))
    body = f"""<main id="main">
  {picado()}
  <section class="page-hero" aria-labelledby="page-title">
    <div class="container">
      <span class="eyebrow">Events</span>
      <h1 class="display-xl" id="page-title">Downstairs at <em class="flourish">La Playita</em></h1>
      <p class="lead">A multicultural space below the restaurant for music, art, theatre and cinema. Listings say it opens Thursday to Sunday {tbc()}.</p>
      <div class="hero__actions"><a class="btn" href="contact.html?subject=private#enquiry">Plan a private event {icon("i-arrow")}</a></div>
    </div>
  </section>
  <section class="section" style="padding-top:0" aria-labelledby="formats-title">
    <div class="container">
      <h2 class="display-m" id="formats-title" data-reveal style="margin-bottom:28px">What happens here</h2>
      <div class="event-grid">{cards}</div>
    </div>
  </section>
  <section class="section section--enamel" aria-labelledby="upcoming-title">
    <div class="container" style="max-width:820px;text-align:center">
      <span class="eyebrow" data-reveal>Upcoming</span>
      <h2 class="display-l" id="upcoming-title" data-reveal>The next dates are being booked</h2>
      <p class="lead" style="margin:16px auto 28px" data-reveal>No dates are published yet. When the programme is confirmed, upcoming nights will appear here.</p>
      <p data-reveal><a class="btn btn--light" href="contact.html?subject=events#enquiry">Ask about the programme</a></p>
    </div>
  </section>
  {book_band("Dinner first, then downstairs", "Book a table upstairs before the show.")}
</main>"""
    return (head("events", "Events at La Playita · Toloache, Paris 18e (design concept)",
                 "Live music, DJ sets, exhibitions, theatre, film screenings and private events at La Playita, below Toloache in Paris 18e. Design concept.")
            + header("events.html") + body + footer())


def page_contact():
    body = f"""<main id="main">
  {picado()}
  <section class="page-hero" aria-labelledby="page-title">
    <div class="container">
      <span class="eyebrow">Contact</span>
      <h1 class="display-xl" id="page-title">Come <em class="flourish">hungry</em></h1>
      <p class="lead">Book online, call, or send a note about private events. We are at 49 rue de Clignancourt.</p>
      <div class="hero__actions">{book_btn()}<a class="btn btn--ghost" href="#enquiry">Send a message</a></div>
    </div>
  </section>
  {visit_section(dark=True)}
  <section class="section" aria-label="Map">
    <div class="container">{map_card()}</div>
  </section>
  <section class="section" style="padding-top:0" id="enquiry" aria-labelledby="form-title">
    <div class="container" style="max-width:820px">
      <span class="eyebrow" data-reveal>Message</span>
      <h2 class="display-l" id="form-title" data-reveal style="margin-bottom:12px">Questions &amp; private events</h2>
      <p class="lead" data-reveal style="margin-bottom:28px">For table bookings, please use the booking page. It's the quickest way to get a confirmed table.</p>
      <form class="form" id="contact-form" novalidate>
        <div class="form__row form__row--2">
          <div class="field"><label for="f-name">Name</label><input id="f-name" name="name" autocomplete="name" required aria-describedby="e-name"><p class="field__error" id="e-name"></p></div>
          <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" required aria-describedby="e-email"><p class="field__error" id="e-email"></p></div>
        </div>
        <div class="form__row form__row--2">
          <div class="field"><label for="f-subject">Subject</label>
            <select id="f-subject" name="subject"><option value="general">General question</option><option value="private">Private event</option><option value="events">La Playita programme</option><option value="press">Press</option></select></div>
          <div class="field"><label for="f-guests">Guests <span class="hint">(optional)</span></label><input id="f-guests" name="guests" type="number" inputmode="numeric" min="1" max="200" aria-describedby="e-guests"><p class="field__error" id="e-guests"></p></div>
        </div>
        <div class="field"><label for="f-msg">Message</label><textarea id="f-msg" name="message" required aria-describedby="e-msg"></textarea><p class="field__error" id="e-msg"></p></div>
        <div><button class="btn" type="submit">Send message</button></div>
        <div class="form__result" id="form-result" hidden tabindex="-1">
          <p><b>Thanks! Your message is ready.</b> This site is a design concept, so it doesn't send messages. To reach Toloache, copy it and email <a href="mailto:{CONTACT["email"]}">{CONTACT["email"]}</a>.</p>
          <div><button class="btn btn--ghost btn--small" type="button" id="copy-msg">Copy message</button> <span id="copy-status" role="status"></span></div>
        </div>
      </form>
    </div>
  </section>
</main>"""
    return (head("contact", "Contact & hours · Toloache, 49 rue de Clignancourt, Paris (design concept)",
                 "Address, opening hours, directions and booking for Toloache, Mexican restaurant at 49 rue de Clignancourt, 75018 Paris. Design concept.",
                 RESTAURANT_LD)
            + header("contact.html") + body + footer())


FAVICON = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#c41e2b"/>'
           '<path d="M5 22a11 11 0 0 1 22 0z" fill="#f2a516" stroke="#2a0d12" stroke-width="2"/></svg>')

if __name__ == "__main__":
    for name, fn in [("index.html", page_home), ("menu.html", page_menu), ("story.html", page_story),
                     ("events.html", page_events), ("contact.html", page_contact)]:
        (OUT / name).write_text(fn(), encoding="utf-8")
        print("wrote", name)
    (OUT / "assets" / "favicon.svg").write_text(FAVICON, encoding="utf-8")
