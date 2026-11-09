/* LevelUp English — app logic (no frameworks). Progress lives in localStorage. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var app = $('app');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var KEY = 'lu.progress.v2', THEME = 'lu.theme.v1', GOAL = 30;
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  var P = store.get(KEY, null);
  if (!P || typeof P !== 'object') P = {};
  ['units', 'levels', 'days', 'cards', 'tenses', 'badges', 'texts', 'stats', 'daily', 'dialogs', 'bonus'].forEach(function (k) { if (!P[k] || typeof P[k] !== 'object') P[k] = {}; });
  P.xp = P.xp || 0; P.streak = P.streak || { last: null, count: 0 }; P.review = Array.isArray(P.review) ? P.review : [];
  function save() { store.set(KEY, P); paintStats(); }

  /* ---------- helpers ---------- */
  function svgv(x) { return x.replace(/(fill|stroke)="(var\([^"]*\))"/g, 'style="$1:$2"'); }
  function ic(n, cls) { return '<svg class="i' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function md(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }
  function gapQ(s) { return esc(s).replace(/_{3,}/g, '<span class="gap" aria-label="пропуск"></span>'); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pad(n) { return String(n).padStart(2, '0'); }
  function dayKey(off) { var d = new Date(); d.setDate(d.getDate() + (off || 0)); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function plural(n, f) { var a = n % 10, b = n % 100; return a === 1 && b !== 11 ? f[0] : a >= 2 && a <= 4 && (b < 10 || b >= 20) ? f[1] : f[2]; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  var toastT;
  function toast(t) { var el = $('toast'); el.textContent = t; el.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('is-on'); }, 2600); }

  /* answers: lower case, unify apostrophes, drop punctuation, expand contractions */
  var CONTR = { "i'm": 'i am', "you're": 'you are', "we're": 'we are', "they're": 'they are', "he's": 'he is', "she's": 'she is', "it's": 'it is', "that's": 'that is', "there's": 'there is', "what's": 'what is', "where's": 'where is', "who's": 'who is',
    "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not', "weren't": 'were not', "don't": 'do not', "doesn't": 'does not', "didn't": 'did not', "haven't": 'have not', "hasn't": 'has not', "hadn't": 'had not',
    "can't": 'can not', 'cannot': 'can not', "couldn't": 'could not', "won't": 'will not', "wouldn't": 'would not', "shouldn't": 'should not', "mustn't": 'must not',
    "i'll": 'i will', "you'll": 'you will', "he'll": 'he will', "she'll": 'she will', "we'll": 'we will', "they'll": 'they will', "it'll": 'it will',
    "i'd": 'i would', "you'd": 'you would', "he'd": 'he would', "she'd": 'she would', "we'd": 'we would', "they'd": 'they would',
    "i've": 'i have', "you've": 'you have', "we've": 'we have', "they've": 'they have', "let's": 'let us', "'m": 'am', "'re": 'are', "'ll": 'will', "'ve": 'have', "'d": 'would', "'s": 'is' };
  function norm(s) {
    return String(s).toLowerCase().replace(/[’‘`´]/g, "'").replace(/[^a-z0-9' ]+/g, ' ').split(/\s+/).filter(Boolean)
      .map(function (w) { w = w.replace(/^'+(?=[a-z]{3})|'+$/g, ''); return CONTR[w] || w; }).join(' ').trim();
  }
  function matches(input, list) { var n = norm(input); return !!n && list.some(function (a) { return norm(a) === n; }); }

  /* speech (built into the browser; hidden when not available) */
  var canSpeak = 'speechSynthesis' in window && typeof SpeechSynthesisUtterance === 'function';
  var voice = null;
  function pickVoice() { if (!canSpeak) return; var v = speechSynthesis.getVoices(); voice = v.find(function (x) { return /^en[-_]GB/i.test(x.lang); }) || v.find(function (x) { return /^en/i.test(x.lang); }) || null; }
  if (canSpeak) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function speak(text, slow) {
    if (!canSpeak) return;
    try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(String(text).replace(/\s*\/\s*/g, ', ').replace(/[—–]/g, ',')); u.lang = voice ? voice.lang : 'en-GB'; if (voice) u.voice = voice; u.rate = slow ? 0.6 : 0.92; speechSynthesis.speak(u); } catch (e) { /* ignore */ }
  }
  function speakBtn(text) { return canSpeak ? '<button class="speak" type="button" data-say="' + esc(text) + '" aria-label="Послушать: ' + esc(text) + '">' + ic('vol') + '</button>' : ''; }
  document.addEventListener('click', function (e) { var b = e.target.closest('[data-say]'); if (b) speak(b.dataset.say, b.dataset.slow === '1'); });

  /* ---------- data ---------- */
  var G = {}; window.COURSE.forEach(function (lv) { lv.lessons.forEach(function (ls) { G[ls.id] = ls; }); });
  var BOOK = window.BOOK, TENSES = window.TENSES, TN = {}; TENSES.forEach(function (t) { TN[t.id] = t; });
  var U = {}, ORDER = [];
  BOOK.forEach(function (lv, li) { lv.units.forEach(function (u, i) { U[u.id] = { unit: u, level: lv, li: li, i: i }; ORDER.push(u.id); }); });
  var STEPS = [
    { k: 'words', n: 'Слова', icon: 'list', d: function (u) { return u.vocab.length + ' слов темы с примерами'; } },
    { k: 'text', n: 'Текст', icon: 'book', d: function (u) { return '«' + u.text.title + '» + вопросы'; } },
    { k: 'grammar', n: 'Грамматика', icon: 'layers', d: function (u) { return u.grammar.map(function (g) { return G[g].title; }).join(' · '); } },
    { k: 'write', n: 'Письмо', icon: 'pen', d: function () { return 'Свой текст на английском'; } }
  ];
  function ust(id) { return P.units[id] || {}; }
  function stepDone(id, k) { return !!ust(id)[k]; }
  function unitDoneCount(id) { return STEPS.filter(function (s) { return stepDone(id, s.k); }).length; }
  function unitDone(id) { return unitDoneCount(id) === 4; }
  function levelOpen(li) { return li === 0 || !!(P.levels[BOOK[li - 1].id] && P.levels[BOOK[li - 1].id].passed); }
  function unitOpen(id) {
    var x = U[id]; if (!levelOpen(x.li)) return false;
    if (P.levels[x.level.id] && P.levels[x.level.id].passed) return true;
    return x.i === 0 || unitDone(x.level.units[x.i - 1].id);
  }
  function levelUnitsDone(lv) { return lv.units.filter(function (u) { return unitDone(u.id); }).length; }
  function nextStep() {
    for (var li = 0; li < BOOK.length; li++) {
      if (!levelOpen(li)) break;
      var lv = BOOK[li];
      for (var i = 0; i < lv.units.length; i++) {
        var u = lv.units[i];
        if (!unitDone(u.id) && unitOpen(u.id)) { var s = STEPS.find(function (st) { return !stepDone(u.id, st.k); }); return { type: 'unit', id: u.id, step: s }; }
      }
      if (!(P.levels[lv.id] && P.levels[lv.id].passed)) return { type: 'test', id: lv.id };
    }
    return null;
  }
  function lc(li) { return 'var(--l' + (li + 1) + ')'; }

  /* ---------- visual language: glossy 3D icons, colour worlds, floating decorations ---------- */
  var PAL = [['#c4b5fd', '#7c3aed', '#4c1d95'], ['#f9a8d4', '#db2777', '#831843'], ['#fdba74', '#ea580c', '#7c2d12'], ['#fde047', '#eab308', '#854d0e'], ['#86efac', '#16a34a', '#14532d'], ['#5eead4', '#0d9488', '#134e4a'], ['#67e8f9', '#0891b2', '#164e63'], ['#93c5fd', '#2563eb', '#1e3a8a'], ['#a5b4fc', '#4f46e5', '#312e81'], ['#fda4af', '#e11d48', '#881337']];
  var GOLD = ['#fde68a', '#f59e0b', '#92400e'];
  var WORLD = [
    { g: 'linear-gradient(135deg, #6d28d9 0%, #a21caf 52%, #be185d 100%)', bg: '#6d28d9', s: 'rgba(162, 28, 175, .7)', o: ['#fef9c3', '#facc15', '#a16207'] },
    { g: 'linear-gradient(135deg, #1d4ed8 0%, #0369a1 52%, #0e7490 100%)', bg: '#1d4ed8', s: 'rgba(3, 105, 161, .7)', o: ['#fce7f3', '#ec4899', '#9d174d'] },
    { g: 'linear-gradient(135deg, #9a3412 0%, #be123c 52%, #9d174d 100%)', bg: '#9a3412', s: 'rgba(190, 18, 60, .7)', o: ['#cffafe', '#06b6d4', '#155e75'] },
    { g: 'linear-gradient(135deg, #047857 0%, #0f766e 52%, #155e75 100%)', bg: '#047857', s: 'rgba(15, 118, 110, .7)', o: ['#fef9c3', '#facc15', '#a16207'] }
  ];
  var STEPPAL = { words: PAL[1], text: PAL[7], grammar: PAL[0], write: PAL[2] };
  function palStyle(p) { return '--c1:' + p[0] + ';--c2:' + p[1] + ';--c3:' + p[2]; }
  function i3d(icon, pal, cls) { return '<span class="i3d' + (cls ? ' ' + cls : '') + '"' + (pal ? ' style="' + palStyle(pal) + '"' : '') + ' aria-hidden="true">' + ic(icon) + '</span>'; }
  function unitPal(id) { var x = U[id]; return PAL[(x.i + x.li * 3) % PAL.length]; }
  function deco(kind) {
    var d = {
      hero: [['orb', 'right:-46px;top:-56px;width:200px;height:200px;--o1:#fbcfe8;--o2:#db2777;--o3:#831843', 0], ['orb', 'left:46%;bottom:-76px;width:124px;height:124px;--o1:#cffafe;--o2:#0891b2;--o3:#164e63', 1.2], ['ring3d', 'left:59%;top:20px;width:72px;height:72px', 0], ['spark', 'left:50%;top:22px', .4], ['spark', 'right:36%;top:64%;scale:.7', 1.4], ['spark', 'left:24px;bottom:18px;scale:.55', 2]],
      world: [['orb', 'right:-40px;top:-58px;width:150px;height:150px', 0], ['ring3d', 'right:172px;top:12px;width:70px;height:70px', 0], ['orb', 'right:84px;bottom:-62px;width:96px;height:96px;--o1:#fff;--o2:rgba(255, 255, 255, .5);--o3:rgba(255, 255, 255, .1)', 1.5], ['spark', 'right:272px;top:26px', .6], ['spark', 'right:44px;top:112px;scale:.6', 1.8]],
      why: [['orb', 'right:-56px;top:-64px;width:170px;height:170px;--o1:#fef9c3;--o2:#facc15;--o3:#a16207', 0], ['orb', 'right:36%;bottom:-74px;width:120px;height:120px;--o1:#cffafe;--o2:#06b6d4;--o3:#155e75', 1.2], ['ring3d', 'right:7%;bottom:9%;width:62px;height:62px', 0], ['spark', 'right:42%;top:9%', .3], ['spark', 'right:5%;top:44%;scale:.7', 1.2], ['spark', 'right:47%;bottom:14%;scale:.6', 2]],
      banner: [['orb', 'right:-34px;top:-50px;width:156px;height:156px', 0], ['ring3d', 'right:96px;bottom:-22px;width:92px;height:92px', 0], ['spark', 'right:210px;top:24px', .5], ['spark', 'right:44px;bottom:22px;scale:.6', 1.6]]
    }[kind] || [];
    return '<div class="deco" aria-hidden="true">' + d.map(function (x, i) { return '<span class="' + x[0] + ' d' + (i + 1) + '" style="' + x[1] + ';animation-delay:' + x[2] + 's"></span>'; }).join('') + '</div>';
  }
  function pageHead(icon, pal, title, text) { return '<header class="page-h page-h4 rise">' + i3d(icon, pal, 'i3d--lg float') + '<div><h1>' + esc(title) + '</h1><p>' + esc(text) + '</p></div></header>'; }
  function greet() { var h = new Date().getHours(); return h < 5 ? 'Доброй ночи' : h < 12 ? 'Доброе утро' : h < 18 ? 'Добрый день' : 'Добрый вечер'; }

  /* ---------- xp, streak, header ---------- */
  function streakNow() { var s = P.streak; return s.last === dayKey(0) || s.last === dayKey(-1) ? s.count : 0; }
  function todayXP() { return P.days[dayKey(0)] || 0; }
  function addXP(n) {
    P.xp += n; P.days[dayKey(0)] = todayXP() + n;
    var t = dayKey(0), s = P.streak; if (s.last !== t) { s.count = s.last === dayKey(-1) ? s.count + 1 : 1; s.last = t; }
  }
  function paintStats() {
    $('st-xp').children[1].textContent = P.xp; $('st-streak').children[1].textContent = streakNow();
  }
  var themeSaved = store.get(THEME, null); if (themeSaved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  function isDark() { return document.documentElement.getAttribute('data-theme') === 'dark'; }
  function paintTheme() { var d = isDark(); $('theme').innerHTML = ic(d ? 'sun' : 'moon'); $('theme').setAttribute('aria-label', d ? 'Светлая тема' : 'Тёмная тема'); document.querySelector('meta[name="theme-color"]').content = d ? '#0f0e1a' : '#f5f3ff'; }
  $('theme').addEventListener('click', function () { var d = !isDark(); if (d) document.documentElement.setAttribute('data-theme', 'dark'); else document.documentElement.removeAttribute('data-theme'); store.set(THEME, d ? 'dark' : 'light'); paintTheme(); });
  paintTheme();

  /* ---------- achievements ---------- */
  function learnedWords() { return Object.keys(P.cards).filter(function (k) { return P.cards[k].box >= 3; }).length; }
  function tensesMastered() { return Object.keys(P.tenses).filter(function (k) { return P.tenses[k] >= 80; }).length; }
  var BADGES = [
    { id: 'first', n: 'Первый шаг', d: 'Пройди первый шаг раздела', icon: 'play', c: '#7c3aed', ok: function () { return ORDER.some(function (id) { return unitDoneCount(id) > 0; }); } },
    { id: 'unit1', n: 'Раздел покорён', d: 'Пройди все 4 шага одного раздела', icon: 'check', c: '#2563eb', ok: function () { return ORDER.some(unitDone); } },
    { id: 'unit5', n: 'Пять разделов', d: 'Пройди 5 разделов', icon: 'layers', c: '#0f766e', ok: function () { return ORDER.filter(unitDone).length >= 5; } },
    { id: 'level', n: 'Новый уровень', d: 'Сдай тест уровня', icon: 'trophy', c: '#b45309', ok: function () { return Object.keys(P.levels).some(function (k) { return P.levels[k].passed; }); } },
    { id: 'perfect', n: 'Без единой ошибки', d: 'Сделай практику на 100%', icon: 'star', c: '#be185d', ok: function () { return (P.stats.perfect || 0) >= 1; } },
    { id: 'streak3', n: 'Три дня подряд', d: 'Занимайся 3 дня без пропусков', icon: 'flame', c: '#ea580c', ok: function () { return P.streak.count >= 3; } },
    { id: 'streak7', n: 'Неделя силы', d: 'Занимайся 7 дней подряд', icon: 'flame', c: '#dc2626', ok: function () { return P.streak.count >= 7; } },
    { id: 'xp100', n: '100 XP', d: 'Набери 100 очков опыта', icon: 'bolt', c: '#ca8a04', ok: function () { return P.xp >= 100; } },
    { id: 'xp500', n: '500 XP', d: 'Набери 500 очков опыта', icon: 'bolt', c: '#d97706', ok: function () { return P.xp >= 500; } },
    { id: 'xp1000', n: '1000 XP', d: 'Набери 1000 очков опыта', icon: 'bolt', c: '#b45309', ok: function () { return P.xp >= 1000; } },
    { id: 'writer', n: 'Первый текст', d: 'Напиши свой первый текст', icon: 'pen', c: '#0891b2', ok: function () { return Object.keys(P.texts).length >= 1; } },
    { id: 'writer5', n: 'Писатель', d: 'Напиши 5 текстов', icon: 'pen', c: '#0e7490', ok: function () { return Object.keys(P.texts).length >= 5; } },
    { id: 'reader', n: 'Читатель', d: 'Прочитай 5 текстов и ответь на вопросы', icon: 'book', c: '#4f46e5', ok: function () { return ORDER.filter(function (id) { return stepDone(id, 'text'); }).length >= 5; } },
    { id: 'words50', n: '50 слов в памяти', d: 'Запомни 50 слов (3+ повторения)', icon: 'list', c: '#059669', ok: function () { return learnedWords() >= 50; } },
    { id: 'tenses3', n: 'Время пошло', d: 'Освой 3 времени на 80%+', icon: 'clock', c: '#7c3aed', ok: function () { return tensesMastered() >= 3; } },
    { id: 'tensesAll', n: 'Мастер времён', d: 'Освой все 13 времён на 80%+', icon: 'clock', c: '#be185d', ok: function () { return tensesMastered() >= TENSES.length; } },
    { id: 'fixer', n: 'Работа над ошибками', d: 'Исправь 10 своих ошибок', icon: 'reset', c: '#2563eb', ok: function () { return (P.stats.fixed || 0) >= 10; } },
    { id: 'placed', n: 'Знаю свой уровень', d: 'Пройди тест уровня', icon: 'target', c: '#6d28d9', ok: function () { return !!P.placement; } },
    { id: 'daily3', n: 'Три задания дня', d: 'Выполни задание дня 3 раза', icon: 'target', c: '#0f766e', ok: function () { return (P.stats.daily || 0) >= 3; } },
    { id: 'ears', n: 'Острый слух', d: 'Пройди аудирование на 80%+', icon: 'vol', c: '#1d4ed8', ok: function () { return (P.stats.listen || 0) >= 1; } },
    { id: 'talk3', n: 'Разговорчивый', d: 'Пройди 3 диалога', icon: 'chat', c: '#db2777', ok: function () { return Object.keys(P.dialogs || {}).length >= 3; } }
  ];
  function checkBadges() { var fresh = []; BADGES.forEach(function (b) { if (!P.badges[b.id] && b.ok()) { P.badges[b.id] = Date.now(); fresh.push(b); } }); if (fresh.length) save(); return fresh; }
  function medal(b, locked, size) { return svgv(medal0(b, locked, size)); }
  function medal0(b, locked, size) {
    var c = locked ? 'var(--line-2)' : b.c, s = size || 84;
    return '<svg class="medal' + (locked ? ' is-locked' : '') + '" width="' + s + '" height="' + s + '" viewBox="0 0 100 100" aria-hidden="true">' +
      '<path d="M30 58 20 92l16-8 10 14 8-30z" fill="' + (locked ? 'var(--soft)' : '#ef4444') + '"/><path d="M70 58l10 34-16-8-10 14-8-30z" fill="' + (locked ? 'var(--soft)' : '#3b82f6') + '"/>' +
      '<circle cx="50" cy="44" r="34" fill="' + c + '"/><circle cx="50" cy="44" r="27" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3" stroke-dasharray="4 5"/>' +
      '<g transform="translate(36 30) scale(1.17)" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><use href="#i-' + (locked ? 'lock' : b.icon) + '" width="24" height="24"/></g></svg>';
  }

  /* ---------- router ---------- */
  var S = null; // running practice session
  function setNav(name) { document.querySelectorAll('[data-nav]').forEach(function (a) { if (a.dataset.nav === name) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); }); }
  function show(html, nav, li) {
    var L = li === undefined || li < 0 ? -1 : li, W = WORLD[L] || WORLD[0];
    setNav(nav); app.style.setProperty('--lc', L < 0 ? 'var(--accent)' : lc(L)); app.style.setProperty('--lcd', L < 0 ? '#5b21b6' : 'var(--ld' + (L + 1) + ')');
    app.style.setProperty('--world', W.g);
    app.innerHTML = html; window.scrollTo(0, 0); app.focus({ preventScroll: true }); animateIn();
  }
  /* entrance stagger + numbers that count up */
  var revealObs = null;
  function animateIn() {
    if (revealObs) { revealObs.disconnect(); revealObs = null; }
    var vh = window.innerHeight, late = [];
    app.querySelectorAll('.rise').forEach(function (el, i) {
      el.style.setProperty('--d', Math.min(i, 16) * 55 + 'ms');
      if (!reduce && window.IntersectionObserver && el.getBoundingClientRect().top > vh * .94) { el.classList.add('rv'); late.push(el); }
    });
    if (late.length) {
      revealObs = new IntersectionObserver(function (entries) {
        var n = 0;
        entries.forEach(function (en) { if (!en.isIntersecting) return; en.target.style.setProperty('--d', Math.min(n++, 8) * 70 + 'ms'); en.target.classList.remove('rv'); revealObs.unobserve(en.target); });
      }, { rootMargin: '0px 0px -6% 0px' });
      late.forEach(function (el) { revealObs.observe(el); });
    }
    app.querySelectorAll('[data-count]').forEach(function (el) {
      var to = +el.dataset.count, pre = el.dataset.pre || '', suf = el.dataset.suf || '';
      if (reduce || !to) { el.textContent = pre + to + suf; return; }
      var t0 = null; el.textContent = pre + '0' + suf;
      requestAnimationFrame(function step(ts) { if (t0 === null) t0 = ts; var p = Math.min(1, (ts - t0) / 1000); el.textContent = pre + Math.round(to * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(step); });
    });
  }
  /* cards lean towards the mouse in 3D */
  var tiltEl = null, heroEl = null;
  document.addEventListener('pointermove', function (e) {
    if (reduce || e.pointerType !== 'mouse') return;
    var hz = e.target.closest ? e.target.closest('.hero4') : null;
    if (heroEl && heroEl !== hz) { heroEl.style.removeProperty('--px'); heroEl.style.removeProperty('--py'); }
    heroEl = hz;
    if (hz) { var hr = hz.getBoundingClientRect(); hz.style.setProperty('--px', ((e.clientX - hr.left) / hr.width - .5).toFixed(3)); hz.style.setProperty('--py', ((e.clientY - hr.top) / hr.height - .5).toFixed(3)); }
    var el = e.target.closest ? e.target.closest('[data-tilt]') : null;
    if (tiltEl && tiltEl !== el) { tiltEl.style.transform = ''; tiltEl = null; }
    if (!el || el.classList.contains('is-locked')) return;
    var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    tiltEl = el; el.style.transform = 'perspective(800px) rotateX(' + ((0.5 - y) * 9).toFixed(2) + 'deg) rotateY(' + ((x - 0.5) * 11).toFixed(2) + 'deg) translateY(-4px)';
    el.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
  });
  document.addEventListener('mouseleave', function () { if (tiltEl) { tiltEl.style.transform = ''; tiltEl = null; } });
  function route() {
    if (bookCtl) { bookCtl.destroy(); bookCtl = null; }
    dlg = null; spk = null;
    var h = location.hash.replace(/^#\/?/, '').split('/');
    document.body.classList.remove('is-practice'); S = null; cardState = null; if (canSpeak) speechSynthesis.cancel();
    if (h[0] === 'u' && U[h[1]]) {
      if (!unitOpen(h[1]) && h[2]) return go('#/u/' + h[1]);
      if (h[2] === 'words') return viewWordsStep(h[1]);
      if (h[2] === 'text') return viewText(h[1]);
      if (h[2] === 'grammar') return viewGrammar(h[1]);
      if (h[2] === 'write') return viewWrite(h[1]);
      return viewUnit(h[1]);
    }
    if (h[0] === 'learn' && U[h[1]] && unitOpen(h[1])) return startStep(h[1], h[2]);
    if (h[0] === 'test' && BOOK.some(function (l) { return l.id === h[1]; })) return startTest(h[1]);
    if (h[0] === 'review' && h[1] === 'go') return startReview();
    if (h[0] === 'review') return viewReview();
    if (h[0] === 'tenses') return viewTenses();
    if (h[0] === 'tense' && TN[h[1]]) return h[2] === 'go' ? startTense(h[1]) : viewTense(h[1]);
    if (h[0] === 'words' && h[1] === 'cards') return startCards();
    if (h[0] === 'words' && h[1] === 'write') return startWordWrite();
    if (h[0] === 'words') return viewWords();
    if (h[0] === 'ref') return viewRef();
    if (h[0] === 'me') return viewMe();
    if (h[0] === 'practice') return viewPractice();
    if (h[0] === 'placement') return startPlacement();
    if (h[0] === 'daily') return startDaily();
    if (h[0] === 'listen') return startListen();
    if (h[0] === 'speak') return startSpeak();
    if (h[0] === 'dialog' && DIALOGS[h[1]]) return viewDialog(h[1]);
    viewHome();
  }
  function go(h) { if (location.hash === h) route(); else location.hash = h; }
  window.addEventListener('hashchange', route);
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-why-open]')) { if (bookCtl) bookCtl.goTo(0); return; }
    var a = e.target.closest('a[href^="#/"]'); if (!a || e.defaultPrevented) return;
    if (a.dataset.locked === '1') { e.preventDefault(); toast(a.dataset.msg || 'Сначала пройди предыдущий раздел'); return; }
    if (a.getAttribute('href') === location.hash) { e.preventDefault(); route(); }
  });

  /* ---------- home ---------- */
  function ring(val, max, size) {
    var r = 42, c = 2 * Math.PI * r, p = Math.min(1, val / max);
    return '<svg class="ring" width="' + size + '" height="' + size + '" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="' + r + '" class="ring__bg"/><circle cx="50" cy="50" r="' + r + '" class="ring__fg" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - p)).toFixed(1) + '"/></svg>';
  }
  function dueCards() { var t = dayKey(0); return Object.keys(P.cards).filter(function (k) { return P.cards[k].due <= t; }); }
  function qcard(href, icon, pal, t, sub) { return '<a class="qcard rise" data-tilt href="' + href + '">' + i3d(icon, pal) + '<div><b>' + t + '</b><span>' + sub + '</span></div>' + ic('right') + '</a>'; }
  function viewHome() {
    var nx = nextStep(), done = ORDER.filter(unitDone).length, tx = todayXP(), hero, hIc = 'rocket', hPal = PAL[1];
    if (!nx) { hero = { e: 'Курс пройден', t: 'Ты прошёл все уровни!', p: 'Повторяй слова, тренируй времена и пиши тексты — так знания останутся с тобой.', b: '<a class="btn" href="#/tenses">' + ic('clock') + 'Времена</a>' }; hIc = 'trophy'; hPal = GOLD; }
    else if (nx.type === 'test') { var lv = BOOK.find(function (l) { return l.id === nx.id; }); hero = { e: 'Финал уровня ' + lv.code, t: 'Тест уровня ' + lv.code, p: 'Все разделы пройдены. Сдай тест на 80%, чтобы открыть следующий уровень.', b: '<a class="btn" href="#/test/' + lv.id + '">' + ic('trophy') + 'Начать тест</a>' }; hIc = 'trophy'; hPal = GOLD; }
    else { var x = U[nx.id]; hero = { e: (done || unitDoneCount(nx.id) ? 'Продолжаем' : 'Твой первый шаг') + ' · ' + x.level.code + ', раздел ' + (x.i + 1), t: x.unit.title + ' — ' + x.unit.en, p: 'Следующий шаг: ' + nx.step.n + ' (' + nx.step.d(x.unit) + ')', b: '<a class="btn" href="#/u/' + nx.id + '/' + nx.step.k + '">' + (done ? 'Продолжить' : 'Начать') + ic('arrow') + '</a>' }; hIc = x.unit.icon; hPal = unitPal(nx.id); }
    var html = '<section class="hero hero4 rise" data-bg="#5b21b6">' + deco('hero') +
      '<div class="hero4__main"><span class="eyebrow">' + esc(greet() + '! ' + hero.e) + '</span><h1>' + esc(hero.t) + '</h1><p>' + esc(hero.p) + '</p><div class="hero__cta">' + hero.b + '<button type="button" class="btn btn--glass" data-why-open>' + ic('book') + 'Зачем английский?</button></div></div>' +
      '<div class="hero4__side">' + i3d(hIc, hPal, 'i3d--xl float') +
      '<div class="goalchip" aria-label="Цель дня: ' + Math.min(tx, GOAL) + ' из ' + GOAL + ' XP">' + ring(tx, GOAL, 54) + '<div><b>' + Math.min(tx, GOAL) + '/' + GOAL + ' XP</b><span>' + (tx >= GOAL ? 'цель дня выполнена!' : 'цель дня') + '</span></div><span class="goalchip__fire" data-bg="#c2410c" title="Дней подряд">' + ic('flame') + streakNow() + '</span></div></div></section>';
    var fresh = !P.xp, cta = !nx ? '<a class="btn why__cta" href="#/tenses">Тренировать' + ic('arrow') + '</a>' : nx.type === 'test' ? '<a class="btn why__cta" href="#/test/' + nx.id + '">К тесту' + ic('arrow') + '</a>' : '<a class="btn why__cta" href="#/u/' + nx.id + '/' + nx.step.k + '">' + (fresh ? 'Начать курс' : 'Продолжить') + ic('arrow') + '</a>';
    var top = html; html = '';
    top += dailyCard() + (fresh && !P.placement ? '<a class="plban rise" data-tilt href="#/placement">' + lexi('think') + '<div><b>Уже знаешь английский?</b><span>Пройди тест уровня — 20 вопросов — и начни со своего уровня, а не с азов.</span></div>' + ic('right') + '</a>' : '');
    var rv = P.review.length, dc = dueCards().length;
    html += '<div class="quick">' +
      qcard('#/review', 'reset', PAL[9], 'Работа над ошибками', rv ? rv + ' ' + plural(rv, ['задание', 'задания', 'заданий']) + ' ждут' : 'Ошибок нет — красавчик') +
      qcard('#/words', 'list', PAL[5], 'Слова на повторение', dc ? dc + ' ' + plural(dc, ['карточка', 'карточки', 'карточек']) + ' сегодня' : Object.keys(P.cards).length ? 'На сегодня всё повторено' : 'Пройди шаг «Слова»') +
      qcard('#/tenses', 'clock', PAL[0], 'Времена', 'Освоено ' + tensesMastered() + ' из ' + TENSES.length) + '</div>';
    html += '<div class="levels">';
    BOOK.forEach(function (lv, li) {
      var open = levelOpen(li), passed = P.levels[lv.id] && P.levels[lv.id].passed, dcnt = levelUnitsDone(lv), W = WORLD[li];
      html += '<section class="world level rise' + (open ? '' : ' is-locked') + (passed ? ' is-done' : '') + '" style="--wg:' + W.g + ';--ws:' + W.s + ';--wb:' + W.bg + ';--o1:' + W.o[0] + ';--o2:' + W.o[1] + ';--o3:' + W.o[2] + '" data-bg="' + W.bg + '" aria-labelledby="lv-' + lv.id + '">' + deco('world') +
        '<div class="world__head"><span class="world__code">' + lv.code + '</span><div><h2 id="lv-' + lv.id + '">' + esc(lv.name) + '</h2><p>' + esc(lv.ru) + ' · ' + esc(lv.about) + '</p></div><span class="world__pct">' + (passed ? ic('check', 'i--sm') + 'сдан' : open ? dcnt + '/' + lv.units.length : ic('lock', 'i--sm') + 'закрыт') + '</span></div>' +
        '<div class="world__bar" aria-hidden="true"><span style="width:' + (dcnt / lv.units.length * 100) + '%"></span></div>' +
        (open ? '' : '<p class="world__lock">' + ic('lock', 'i--sm') + 'Откроется, когда сдашь тест уровня ' + BOOK[li - 1].code + '</p>') + '<div class="units">';
      lv.units.forEach(function (u, i) {
        var o = unitOpen(u.id), n = unitDoneCount(u.id), isNext = nx && nx.type === 'unit' && nx.id === u.id;
        html += '<a class="utile rise' + (o ? '' : ' is-locked') + (isNext ? ' is-next' : '') + (n === 4 ? ' is-done' : '') + '" data-tilt style="' + palStyle(unitPal(u.id)) + '" href="#/u/' + u.id + '" data-locked="' + (o ? '' : '1') + '"' + (o ? '' : ' aria-disabled="true"') + ' aria-label="Раздел ' + (i + 1) + ': ' + esc(u.title) + (o ? ', шагов пройдено ' + n + ' из 4' : ', закрыт') + '">' +
          '<span class="i3d' + (o ? '' : ' is-lock') + '" aria-hidden="true">' + ic(o ? u.icon : 'lock') + '</span>' + (n === 4 ? '<span class="utile__ok" aria-hidden="true">' + ic('check') + '</span>' : '') +
          '<span class="utile__n">Раздел ' + (i + 1) + '</span><span class="utile__t">' + esc(u.title) + '</span><span class="utile__en">' + esc(u.en) + '</span>' +
          '<span class="dots" aria-hidden="true">' + STEPS.map(function (s) { return '<i class="' + (stepDone(u.id, s.k) ? 'on' : '') + '"></i>'; }).join('') + '</span></a>';
      });
      var best = P.levels[lv.id] && P.levels[lv.id].best;
      html += '<a class="utile utile--test rise' + (passed ? ' is-passed' : '') + (open ? '' : ' is-locked') + '" data-tilt style="' + palStyle(passed ? PAL[4] : GOLD) + '" href="#/test/' + lv.id + '" data-locked="' + (open ? '' : '1') + '" data-msg="Сначала сдай тест предыдущего уровня"' + (open ? '' : ' aria-disabled="true"') + '><span class="i3d' + (open ? '' : ' is-lock') + '" aria-hidden="true">' + ic(passed ? 'check' : open ? 'trophy' : 'lock') + '</span><span class="utile__n">Тест уровня</span><span class="utile__t">' + (passed ? 'Сдан: ' + best + '%' : open ? (dcnt === lv.units.length ? 'Готов к сдаче' : 'Уже знаешь? Сдай и иди дальше') : 'Откроется позже') + '</span></a></div></section>';
    });
    html += '</div>';
    var why = whyHTML(fresh, cta);
    show(top + (fresh ? why + html : html + why), 'course');
    initWhy();
  }

  /* ---------- «Зачем английский»: a 3D book that opens and turns its pages as you scroll ---------- */
  var bookCtl = null;
  var WHY = [
    { k: 'Зачем всё это', t: 'Английский — твой билет в <em>большой мир</em>', p: 'Листай вниз: книга откроется и покажет, что тебе даст этот курс и почему он сработает.' },
    { k: 'Глава 1', icon: 'target', pal: PAL[1], t: 'Зачем этот <em>курс</em>', p: 'Чтобы ты не просто «знал правила», а заговорил: понимал тексты и речь, писал сообщения и письма, спокойно общался. Только то, что реально нужно, — без воды.' },
    { k: 'Глава 2', icon: 'layers', pal: PAL[0], t: 'Почему он <em>сработает</em>', p: 'Каждый раздел — 4 шага: слова, текст, грамматика, письмо. Ты сразу применяешь новое, а умное повторение через 1, 3, 7, 14 и 30 дней не даёт забыть.' },
    { k: 'Глава 3', icon: 'case', pal: GOLD, t: 'Язык <em>бизнеса</em>', p: 'Международные компании ведут переговоры, переписку и созвоны на английском. Хочешь своё дело, клиентов из других стран или работу мечты — начни с английского.' },
    { k: 'Глава 4', icon: 'plane', pal: PAL[7], t: 'Тебя поймут <em>везде</em>', p: 'Около 1,5 миллиарда человек говорят по-английски. Даже пилоты международных рейсов общаются с диспетчерами на английском. Аэропорт, отель, новые друзья — ты везде свой.', src: 'Число говорящих — по данным Ethnologue' },
    { k: 'Глава 5', icon: 'globe', pal: PAL[5], t: 'Весь интернет — <em>твой</em>', p: 'Около половины всех сайтов — на английском. Лучшие курсы, видео, статьи и новые технологии часто выходят сначала на нём. Учись у лучших — бесплатно.', src: 'Языки сайтов — по данным W3Techs' },
    { k: 'Глава 6', icon: 'rocket', pal: PAL[2], t: 'Начни <em>сегодня</em>', p: '«Путь в тысячу ли начинается с первого шага», — говорил Лао-цзы. Один раздел в день — и через месяц ты удивишься, как много понимаешь.' }
  ];
  function whyBook(fresh) {
    var words = ORDER.reduce(function (a, id) { return a + U[id].unit.vocab.length; }, 0);
    function hand(s) { return '<span class="hand">' + s + '</span>'; }
    function head(k, t) { return '<span class="pg__k">' + k + '</span><b class="pg__t">' + t + '</b>'; }
    function face(side, n, inner, cls, inCls) {
      return '<div class="lf lf--' + side + ' pg pg--' + (side === 'f' ? 'r' : 'l') + (cls ? ' ' + cls : '') + '" data-bg="#fffaf0"><div class="pg__in' + (inCls ? ' ' + inCls : '') + '">' + inner + '</div>' + (n ? '<span class="pg__n">' + n + '</span>' : '') + '</div>';
    }
    var memo = [[14, 100, 1], [54, 88, 3], [100, 62, 7], [146, 38, 14], [188, 18, 30]];
    // left pages (back of leaf k) and right pages (front of leaf k + 1; the last one lies on the page block)
    var L = [
      ['<div class="exlib"><small>Ex libris</small><span>Эта книга принадлежит</span><b class="hand">тебе ♥</b><em>Каждый раздел — новая страница твоей истории</em></div>', 'pg--inside', 'pg__in--c'],
      ['<span class="pg__k">Каждый раздел — 4 шага</span><div class="pg__path">' + STEPS.map(function (s) { return '<div>' + i3d(s.icon, STEPPAL[s.k]) + '<span>' + s.n + '</span></div>'; }).join('') + '</div>' + hand('учишь — и сразу применяешь')],
      ['<div class="pg__bc">' + i3d('case', GOLD, 'big') + '<div class="bcard"><b>Твоё имя</b><span>Founder &amp; CEO</span><i>English · fluent ✓</i></div></div>' + hand('представь — это ты'), '', 'pg__in--c'],
      [i3d('globe', PAL[7], 'big') + '<b class="pg__big">1,5 млрд</b><span class="pg__cap">человек в мире говорят по-английски</span>', '', 'pg__in--c'],
      ['<svg class="pg__donut" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="why-dg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#db2777"/></linearGradient></defs><circle cx="50" cy="50" r="38" fill="none" stroke="#ede9fe" stroke-width="13"/><circle cx="50" cy="50" r="38" fill="none" stroke="url(#why-dg)" stroke-width="13" stroke-linecap="round" stroke-dasharray="113 238.8" transform="rotate(-90 50 50)"/></svg><b class="pg__big">≈ 50%</b><span class="pg__cap">всех сайтов в интернете — на английском</span>', '', 'pg__in--c'],
      ['<div class="pg__quote"><span aria-hidden="true">“</span><b>Границы моего языка — это границы моего мира.</b><em>Людвиг Витгенштейн</em></div>', '', 'pg__in--c']
    ];
    var R = [
      head('Глава 1', 'Зачем этот курс') + '<div class="pg__stats"><div><b>' + ORDER.length + '</b><span>разделов</span></div><div><b>' + words + '</b><span>слов</span></div><div><b>' + TENSES.length + '</b><span>времён</span></div><div><b>' + Object.keys(G).length + '</b><span>уроков грамматики</span></div></div>' + hand('только нужное — без воды!'),
      head('Глава 2', 'Почему сработает') + '<svg class="pg__memo" viewBox="0 0 200 116" aria-hidden="true"><defs><linearGradient id="why-mg" x1="0" x2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#db2777"/></linearGradient></defs><path d="M14 100C34 98 40 90 54 88S86 70 100 62S132 44 146 38S176 22 188 18" fill="none" stroke="#c4b5fd" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 7"/>' +
        memo.map(function (m) { return '<circle cx="' + m[0] + '" cy="' + m[1] + '" r="11" fill="url(#why-mg)"/><text x="' + m[0] + '" y="' + (m[1] + 3.6) + '" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">' + m[2] + '</text>'; }).join('') +
        '<text x="128" y="74" font-size="11" font-weight="700" fill="#6b5d42">дней</text></svg>' + hand('повторил — запомнил надолго'),
      head('Глава 3', 'Язык бизнеса') + '<ul class="pg__list"><li>переговоры</li><li>письма партнёрам</li><li>созвоны и презентации</li><li>собеседования</li></ul>' + hand('бизнес мирового уровня говорит по-английски'),
      head('Глава 4', 'Тебя поймут везде') + '<div class="pg__stamps">' + [['London', -9, '#be123c'], ['New York', 7, '#1d4ed8'], ['Sydney', -4, '#047857'], ['Toronto', 9, '#92400e'], ['Dublin', -6, '#7c3aed']].map(function (s) { return '<i style="--r:' + s[1] + 'deg;--c:' + s[2] + '">' + s[0] + '</i>'; }).join('') + '</div>' + hand('весь мир — твой ✈'),
      head('Глава 5', 'Весь интернет — твой') + '<div class="pg__icons"><span>' + i3d('cap', PAL[0]) + 'курсы</span><span>' + i3d('play', PAL[9]) + 'видео</span><span>' + i3d('bulb', GOLD) + 'наука</span><span>' + i3d('news', PAL[7]) + 'новости</span></div>' + hand('учись у лучших — бесплатно'),
      head('Глава 6', 'Твоя история начинается здесь') + '<div class="pg__win">' + i3d('trophy', GOLD, 'big') + '</div>' + hand(fresh ? 'Раздел 1 — поехали!' : 'продолжаем, ты молодец!')
    ];
    var leaves = '';
    for (var k = 5; k >= 0; k--) {
      leaves += '<div class="leaf' + (k ? '' : ' leaf--cover') + '" data-k="' + k + '">' +
        (k ? face('f', 2 * k - 1, R[k - 1]) : '<div class="lf lf--f bk-cover" data-bg="#1e3a8a"><div class="bk-cover__frame"><span class="bk-cover__top">A1 · A2 · B1</span>' + i3d('layers', GOLD, 'big') + '<b class="bk-cover__t">LevelUp<br>English</b><span class="bk-cover__s">Книга твоего английского</span></div><i class="bk-cover__shine"></i></div>') +
        face('b', k ? 2 * k : 0, L[k][0], L[k][1], L[k][2]) + '</div>';
    }
    return '<div class="why__bookwrap" aria-hidden="true" title="Листай страницу — или нажми на книгу"><div class="book"><div class="book__floor"></div><div class="book__body">' +
      '<i class="bk-back bk-back--r"></i><i class="bk-back bk-back--l"></i>' +
      '<div class="bk-block bk-block--l"><i class="bk-edge bk-edge--l"></i><i class="bk-edge bk-edge--b"></i><i class="bk-edge bk-edge--t"></i></div>' +
      '<div class="bk-block bk-block--r"><div class="pg pg--r bk-top" data-bg="#fffaf0"><div class="pg__in">' + R[5] + '</div><span class="pg__n">11</span></div><i class="bk-edge bk-edge--r"></i><i class="bk-edge bk-edge--b"></i><i class="bk-edge bk-edge--t"></i></div>' +
      '<i class="bk-ribbon"></i><i class="bk-spine"></i>' + leaves + '</div><div class="book__fx"></div></div></div>';
  }
  function whyHTML(fresh, cta) {
    var chs = WHY.map(function (c, s) {
      return '<div class="why__ch' + (s ? '' : ' is-on') + '" data-s="' + s + '"><span class="why__k">' + (c.icon ? i3d(c.icon, c.pal) : ic('book', 'i--sm')) + esc(c.k) + '</span>' +
        (s ? '<h3>' + c.t + '</h3>' : '<h2 id="why-h">' + c.t + '</h2>') + '<p>' + esc(c.p) + '</p>' + (c.src ? '<small>' + esc(c.src) + '</small>' : '') +
        (s ? '' : '<span class="why__hint" aria-hidden="true"><i></i>Листай вниз</span>') + '</div>';
    }).join('');
    var dots = WHY.map(function (c, s) { return '<button type="button" data-why-go="' + s + '" aria-label="' + (s ? esc(c.k) + ': ' + c.t.replace(/<[^>]+>/g, '') : 'К началу') + '"' + (s ? '' : ' aria-current="step"') + '></button>'; }).join('');
    return '<section class="why" id="why" aria-labelledby="why-h" data-s="0"><div class="why__pin"><div class="why__stage" data-bg="#5b21b6">' + deco('why') +
      '<div class="why__text"><div class="why__chs">' + chs + '</div><div class="why__foot"><div class="why__dots" role="group" aria-label="Главы книги">' + dots + '</div>' + cta + '</div></div>' + whyBook(fresh) + '</div></div></section>';
  }
  function initWhy() {
    var sec = app.querySelector('.why'); if (!sec) return;
    var pin = sec.querySelector('.why__pin'), bk = sec.querySelector('.book'), body = sec.querySelector('.book__body'), wrap = sec.querySelector('.why__bookwrap'), fx = sec.querySelector('.book__fx');
    var leaves = [].slice.call(sec.querySelectorAll('.leaf')).sort(function (a, b) { return a.dataset.k - b.dataset.k; });
    var chs = [].slice.call(sec.querySelectorAll('.why__ch')), dots = [].slice.call(sec.querySelectorAll('[data-why-go]'));
    var N = leaves.length, SPAN = N + .5, W = 1, T = 1, raf = 0, last = 0, state = 0;
    var cur = { pos: -.25, enter: 1, mx: 0, my: 0 }, tgt = { pos: -.25, enter: 1, mx: 0, my: 0 };
    function cl(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function geom() {
      var root = document.documentElement, nav = document.querySelector('.nav');
      root.style.setProperty('--top-h', Math.round(document.querySelector('.top').getBoundingClientRect().height) + 'px');
      root.style.setProperty('--nav-h', (nav && getComputedStyle(nav).position === 'fixed' ? Math.round(nav.getBoundingClientRect().height) : 0) + 'px');
      W = body.offsetWidth || 1; T = W * .075;
    }
    function stick() { return parseFloat(getComputedStyle(pin).top) || 0; }
    function span() { return Math.max(1, sec.offsetHeight - pin.offsetHeight); }
    function measure() {
      var r = sec.getBoundingClientRect(), vh = window.innerHeight, s = stick();
      tgt.pos = -.25 + SPAN * (s - r.top) / span();
      tgt.enter = cl((vh - r.top) / Math.max(1, vh - s));
    }
    function burst(big) {
      var cols = ['#fde68a', '#fbbf24', '#f9a8d4', '#a5f3fc', '#ffffff', '#c4b5fd'], n = big ? 26 : 12, h = '';
      for (var i = 0; i < n; i++) {
        var a = Math.random() * 6.283, d = (big ? 70 : 45) + Math.random() * (big ? 120 : 70);
        h += '<i style="--x:' + Math.round(Math.cos(a) * d) + 'px;--y:' + Math.round(Math.sin(a) * d - 24) + 'px;--c:' + cols[i % cols.length] + ';--dl:' + (Math.random() * .18).toFixed(2) + 's;--k:' + (.5 + Math.random() * .9).toFixed(2) + '"></i>';
      }
      var b = document.createElement('div'); b.className = 'burst'; b.innerHTML = h; fx.appendChild(b);
      setTimeout(function () { b.remove(); }, 1500);
    }
    function setChapter(s) {
      var fwd = s > state; state = s; sec.dataset.s = s;
      chs.forEach(function (c, i) { c.classList.toggle('is-on', i === s); c.classList.toggle('is-past', i < s); });
      dots.forEach(function (d, i) { if (i === s) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current'); });
      if (fwd && !reduce) burst(s === N);
    }
    function render() {
      var pos = cur.pos, e = 1 - Math.pow(1 - cur.enter, 3), ts = [], k;
      for (k = 0; k < N; k++) ts.push(ease(cl((pos - k - .2) / .6)));
      var o = ts[0], drift = cl((pos + .25) / .45), I = [52, 48, -16, .74], C = [18, 27 - 9 * drift, -5, .95], O = [15, 0, 0, 1], q = [];
      for (k = 0; k < 4; k++) { var c = I[k] + (C[k] - I[k]) * e; q.push(c + (O[k] - c) * o); }
      body.style.transform = 'translate3d(' + (-W / 2 * (1 - o)).toFixed(1) + 'px,' + ((1 - e) * W * .35).toFixed(1) + 'px,0) scale(' + q[3].toFixed(3) + ') rotateX(' + (q[0] - cur.my * 12).toFixed(2) + 'deg) rotateY(' + (q[1] + cur.mx * 18).toFixed(2) + 'deg) rotateZ(' + q[2].toFixed(2) + 'deg)';
      bk.style.setProperty('--o', o.toFixed(3)); bk.style.setProperty('--lo', cl((o - .55) / .4).toFixed(3));
      var d = Math.max(1, W * .006), lift = W * .08;
      leaves.forEach(function (lf, k) {
        var t = ts[k], zr = T + (N - k + (k ? 0 : 1)) * d, zl = T + (k + 1) * d, z = zr + (zl - zr) * t + Math.sin(Math.PI * t) * lift;
        lf.style.transform = 'translateZ(' + z.toFixed(2) + 'px) rotateY(' + (-180 * t).toFixed(2) + 'deg)';
        lf.style.setProperty('--sh', Math.sin(Math.PI * t).toFixed(3));
      });
      var s = Math.max(0, Math.min(N, Math.floor(pos + .5)));
      if (s !== state) setChapter(s);
    }
    function frame(ts) {
      var dt = last ? Math.min(64, ts - last) : 16, a = 1 - Math.pow(1 - .16, dt / 16.7), done = true; last = ts;
      ['pos', 'enter', 'mx', 'my'].forEach(function (p) { var dv = tgt[p] - cur[p]; if (Math.abs(dv) > .0006) { cur[p] += dv * a; done = false; } else cur[p] = tgt[p]; });
      render();
      if (done) { raf = 0; last = 0; } else raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }
    function onScroll() { measure(); kick(); }
    function onResize() { geom(); measure(); kick(); }
    function goTo(s) {
      if (reduce) { sec.scrollIntoView(); return; }
      var top = sec.getBoundingClientRect().top + window.pageYOffset - stick();
      window.scrollTo({ top: Math.round(top + span() * (s + .25) / SPAN), behavior: 'smooth' });
    }
    geom();
    if (reduce) {
      // no scroll-driven motion: the book lies open, every chapter is listed, a click turns to the next spread
      sec.classList.add('why--static'); cur.pos = 1; render();
      wrap.addEventListener('click', function () { cur.pos = cur.pos >= N ? 1 : cur.pos + 1; render(); });
      bookCtl = { goTo: goTo, state: function () { return state; }, destroy: function () {} };
      return;
    }
    wrap.addEventListener('click', function () { goTo(state < N ? state + 1 : 0); });
    wrap.addEventListener('pointermove', function (ev) { if (ev.pointerType !== 'mouse') return; var r = wrap.getBoundingClientRect(); tgt.mx = cl((ev.clientX - r.left) / r.width) - .5; tgt.my = cl((ev.clientY - r.top) / r.height) - .5; kick(); });
    wrap.addEventListener('pointerleave', function () { tgt.mx = tgt.my = 0; kick(); });
    sec.addEventListener('click', function (ev) { var b = ev.target.closest('[data-why-go]'); if (b) goTo(+b.dataset.whyGo); });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    measure(); cur.pos = tgt.pos; cur.enter = tgt.enter; render();
    bookCtl = { goTo: goTo, state: function () { return state; }, destroy: function () { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); if (raf) cancelAnimationFrame(raf); raf = 0; } };
  }
  /* XP chip in the header jumps and counts up after a finished practice */
  function xpBump(n) {
    var s = $('st-xp'); if (!s || reduce || !n) return;
    s.classList.remove('bump'); void s.offsetWidth; s.classList.add('bump');
    var f = document.createElement('span'); f.className = 'xp-fly'; f.setAttribute('aria-hidden', 'true'); f.textContent = '+' + n + ' XP'; s.appendChild(f);
    setTimeout(function () { f.remove(); }, 1500);
    var el = s.children[1], to = P.xp, from = Math.max(0, to - n), t0 = null;
    requestAnimationFrame(function step(ts) { if (t0 === null) t0 = ts; var p = Math.min(1, (ts - t0) / 900); el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); });
  }

  /* ---------- unit ---------- */
  function unitHead(id, sub) {
    var x = U[id], u = x.unit;
    return '<a class="back" href="#/' + (sub ? 'u/' + id : '') + '">' + ic('left', 'i--sm') + (sub ? 'Раздел «' + esc(u.title) + '»' : 'Курс') + '</a>' +
      '<header class="banner banner4 rise" data-bg="' + WORLD[x.li].bg + '">' + deco('banner') + i3d(u.icon, unitPal(id), 'i3d--lg float') + '<div><span class="eyebrow">' + x.level.code + ' · Раздел ' + (x.i + 1) + (sub ? ' · ' + sub : '') + '</span><h1>' + esc(u.title) + '</h1><p>' + esc(u.en) + '</p></div></header>';
  }
  function viewUnit(id) {
    var x = U[id], u = x.unit, open = unitOpen(id);
    var html = unitHead(id) + '<div class="steps">';
    STEPS.forEach(function (s, i) {
      var d = stepDone(id, s.k);
      html += '<a class="step rise' + (d ? ' is-done' : '') + '" data-tilt href="#/u/' + id + '/' + s.k + '" data-locked="' + (open ? '' : '1') + '"><span class="step__n" data-bg="' + (d ? '#047857' : '#7c3aed') + '">' + (d ? ic('check') : i + 1) + '</span>' + i3d(s.icon, STEPPAL[s.k]) + '<div><b>' + s.n + '</b><span>' + esc(s.d(u)) + '</span></div>' + ic('right') + '</a>';
    });
    html += '</div>';
    if (!open) html += '<p class="note">' + ic('lock', 'i--sm') + 'Раздел откроется, когда ты пройдёшь предыдущий. Сейчас можно посмотреть, что в нём будет.</p>';
    html += '<p class="section-h">Что ты будешь уметь</p><ul class="goals"><li class="rise">' + ic('check', 'i--sm') + 'Понимать и использовать ' + u.vocab.length + ' слов по теме «' + esc(u.title) + '»</li><li class="rise">' + ic('check', 'i--sm') + 'Читать текст «' + esc(u.text.title) + '» без словаря</li><li class="rise">' + ic('check', 'i--sm') + 'Грамматика: ' + esc(u.grammar.map(function (g) { return G[g].title; }).join(', ')) + '</li><li class="rise">' + ic('check', 'i--sm') + esc(u.write.task) + '</li></ul>';
    show(html, 'course', x.li);
  }
  function viewWordsStep(id) {
    var x = U[id], u = x.unit;
    var html = unitHead(id, 'Слова') + '<p class="lead">Прочитай слова вслух вместе с примерами — так они запоминаются в 3 раза лучше, чем списком. Нажми на динамик, чтобы услышать.</p><div class="vcards">' +
      u.vocab.map(function (v) { return '<div class="vcard rise">' + speakBtn(v[0]) + '<div><b>' + esc(v[0]) + '</b><span class="vcard__ru">' + esc(v[1]) + '</span><p class="vcard__ex">' + esc(v[2]) + '</p><p class="vcard__exru">' + esc(v[3]) + '</p></div></div>'; }).join('') +
      '</div><div class="start-bar"><a class="btn" href="#/learn/' + id + '/words">' + ic('play') + (stepDone(id, 'words') ? 'Потренировать ещё раз' : 'Тренировать слова') + '</a></div>';
    show(html, 'course', x.li);
  }
  function highlight(sentence, vocab) {
    var h = esc(sentence);
    vocab.forEach(function (v) {
      var w = v[0].split(/\s*\/\s*/)[0].replace(/[.…?!]/g, '').trim(); if (!w) return;
      var re = new RegExp('(^|[^A-Za-z])(' + esc(w).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+') + '(?:s|es|ed|d|ing)?)(?![A-Za-z])', 'i');
      h = h.replace(re, function (m, a, b) { return a + '<mark tabindex="0" data-tip="' + esc(v[1]) + '">' + b + '</mark>'; });
    });
    return h;
  }
  function viewText(id) {
    var x = U[id], u = x.unit, t = u.text;
    var html = unitHead(id, 'Текст') + '<section class="card reading"><div class="reading__bar"><h2>' + esc(t.title) + '</h2><div class="chip-row">' +
      (canSpeak ? '<button class="btn btn--ghost btn--sm" type="button" data-say="' + esc(t.en.join(' ')) + '">' + ic('vol') + 'Слушать</button>' : '') +
      '<button class="btn btn--ghost btn--sm" type="button" id="tr-toggle" aria-pressed="false">' + ic('ru') + 'Перевод</button></div></div>' +
      '<p class="hint">Выделенные слова — из этого раздела: наведи или нажми, чтобы увидеть перевод.</p><div class="reading__text" id="reading">' +
      t.en.map(function (s, i) { return '<p class="sent"><span class="sent__en">' + highlight(s, u.vocab) + '</span><span class="sent__ru">' + esc(t.ru[i] || '') + '</span></p>'; }).join('') +
      '</div></section><div class="start-bar"><a class="btn" href="#/learn/' + id + '/text">' + ic('play') + 'Ответить на вопросы (' + u.quiz.length + ')</a></div>';
    show(html, 'course', x.li);
    $('tr-toggle').addEventListener('click', function () { var on = this.getAttribute('aria-pressed') !== 'true'; this.setAttribute('aria-pressed', String(on)); $('reading').classList.toggle('show-ru', on); });
  }
  function theoryHTML(ls) {
    var h = '';
    ls.rules.forEach(function (r) { h += '<div class="rule"><h3>' + esc(r.h) + '</h3><p>' + md(r.t) + '</p></div>'; });
    h += '<div class="formula">' + ic('bulb') + '<span>' + esc(ls.formula) + '</span></div>';
    h += '<p class="section-h">Примеры</p><ul class="examples">' + ls.ex.map(function (e) { return '<li>' + speakBtn(e[0]) + '<div><div class="en">' + esc(e[0]) + '</div><div class="ru">' + esc(e[1]) + '</div></div></li>'; }).join('') + '</ul>';
    h += '<div class="tip">' + ic('alert') + '<p><b>Частая ошибка.</b> ' + md(ls.tip) + '</p></div>';
    return h;
  }
  function videosHTML(list, q) {
    var yt = 'https://www.youtube.com/', h = '<p class="section-h" style="margin:22px 0 10px">Видео по теме</p><div class="videos">';
    (list || []).forEach(function (v) { h += '<a class="video" href="' + yt + 'watch?v=' + encodeURIComponent(v[1]) + '" target="_blank" rel="noopener"><span class="video__play">' + ic('play') + '</span><span><b>' + esc(v[0]) + '</b><small>YouTube · можно включить субтитры</small></span></a>'; });
    h += '<a class="video video--search" href="' + yt + 'results?search_query=' + encodeURIComponent(q + ' English grammar') + '" target="_blank" rel="noopener"><span class="video__play">' + ic('search') + '</span><span><b>Ещё видео на английском</b><small>Поиск на YouTube</small></span></a>';
    h += '<a class="video video--search" href="' + yt + 'results?search_query=' + encodeURIComponent(q + ' английский объяснение на русском') + '" target="_blank" rel="noopener"><span class="video__play">' + ic('search') + '</span><span><b>Объяснение на русском</b><small>Поиск на YouTube</small></span></a>';
    return h + '</div>';
  }
  function viewGrammar(id) {
    var x = U[id], u = x.unit, n = 0;
    var html = unitHead(id, 'Грамматика');
    u.grammar.forEach(function (gid) { var g = G[gid]; n += g.tasks.length; html += '<section class="card theory" aria-label="' + esc(g.title) + '"><h2 class="theory__h">' + esc(g.title) + '</h2><p class="muted">' + esc(g.short) + '</p>' + theoryHTML(g) + '</section>' + videosHTML(g.videos, g.yt); });
    html += '<div class="start-bar"><a class="btn" href="#/learn/' + id + '/grammar">' + ic('play') + 'Практика (' + n + ' ' + plural(n, ['задание', 'задания', 'заданий']) + ')</a></div>';
    show(html, 'course', x.li);
  }

  /* ---------- writing ---------- */
  function sentences(t) { return t.split(/[.!?]+/).filter(function (s) { return s.trim().split(/\s+/).filter(Boolean).length >= 2; }).length; }
  function wordsCount(t) { return (t.match(/[A-Za-z']+/g) || []).length; }
  function reqState(w, t) {
    var list = w.req.map(function (r) { var m = t.match(new RegExp(r[1], 'gi')) || []; var need = r[2] || 1; return { label: r[0] + (need > 1 ? ' — ' + Math.min(m.length, need) + '/' + need : ''), ok: m.length >= need }; });
    var wc = wordsCount(t), sc = sentences(t);
    list.unshift({ label: 'Минимум ' + w.min + ' слов — сейчас ' + wc, ok: wc >= w.min }, { label: 'Минимум ' + w.sent + ' предложений — сейчас ' + sc, ok: sc >= w.sent });
    return list;
  }
  function viewWrite(id) {
    var x = U[id], u = x.unit, w = u.write, saved = P.texts[id];
    var html = unitHead(id, 'Письмо') + '<section class="card write"><span class="eyebrow">Задание</span><h2>' + esc(w.task) + '</h2>' +
      '<p class="hint">Пиши своими словами — так грамматика переходит из «знаю правило» в «умею говорить». Используй слова раздела. Ошибки — это нормально.</p>' +
      '<div class="write__grid"><div><label class="sr-only" for="w-text">Твой текст</label><textarea id="w-text" class="answer write__area" spellcheck="true" lang="en" placeholder="Start writing here…">' + esc(saved ? saved.text : '') + '</textarea>' +
      '<div class="write__bar"><span id="w-count" class="muted"></span><button class="btn" type="button" id="w-submit" disabled>' + ic('check') + (saved ? 'Сохранить новую версию' : 'Сдать текст') + '</button></div></div>' +
      '<div><p class="section-h" style="margin:0 0 8px">Чек-лист</p><ul class="checklist" id="w-check" aria-live="polite"></ul><p class="section-h" style="margin:16px 0 8px">Слова раздела</p><div class="chip-row">' + u.vocab.map(function (v) { return '<span class="chip" title="' + esc(v[1]) + '">' + esc(v[0]) + '</span>'; }).join('') + '</div></div></div></section>' +
      '<section class="card model" id="w-model"' + (saved ? '' : ' hidden') + '><span class="eyebrow">Пример ответа</span><p class="model__text">' + esc(w.model) + '</p><p class="hint">Сравни со своим текстом: что можно взять отсюда — новое слово, связку, порядок слов?</p></section>';
    show(html, 'course', x.li);
    var ta = $('w-text');
    function upd() {
      var st = reqState(w, ta.value), ok = st.every(function (s) { return s.ok; });
      $('w-check').innerHTML = st.map(function (s) { return '<li class="' + (s.ok ? 'ok' : '') + '">' + ic(s.ok ? 'check' : 'x', 'i--sm') + '<span>' + esc(s.label) + '</span></li>'; }).join('');
      $('w-count').textContent = wordsCount(ta.value) + ' ' + plural(wordsCount(ta.value), ['слово', 'слова', 'слов']);
      $('w-submit').disabled = !ok;
    }
    ta.addEventListener('input', upd); upd();
    $('w-submit').addEventListener('click', function () {
      var first = !stepDone(id, 'write');
      P.texts[id] = { text: ta.value.trim(), at: Date.now() };
      P.units[id] = Object.assign(ust(id), { write: true });
      var xp = first ? 25 : 5, whole = first && unitDone(id); if (whole) xp += 30; addXP(xp); save();
      celebrate({ kind: whole ? 'unit' : 'write', title: whole ? 'Раздел «' + u.title + '» пройден!' : pick(['Красавчик! Текст готов', 'Ты справился! Текст сдан', 'Мощно! Это твой текст']), sub: 'Ты написал ' + wordsCount(ta.value) + ' ' + plural(wordsCount(ta.value), ['слово', 'слова', 'слов']) + ' на английском. Сравни свой текст с примером ответа — и забери оттуда пару удачных фраз.', acc: null, xp: xp, li: x.li,
        extra: '<div class="model" style="margin-top:4px"><span class="eyebrow">Пример ответа</span><p class="model__text">' + esc(u.write.model) + '</p></div>',
        actions: nextUnitActions(id) });
    });
  }
  function nextUnitActions(id) {
    var nx = nextStep(), a = '';
    if (nx && nx.type === 'unit') a += '<a class="btn" href="#/u/' + nx.id + '/' + nx.step.k + '">' + (nx.id === id ? 'Дальше: ' + nx.step.n : 'Следующий раздел') + ic('arrow') + '</a>';
    else if (nx && nx.type === 'test') a += '<a class="btn" href="#/test/' + nx.id + '">' + ic('trophy') + 'Тест уровня</a>';
    return a + '<a class="btn btn--ghost" href="#/u/' + id + '">К разделу</a>';
  }

  /* ---------- practice sessions ---------- */
  function wordTasks(vocab, allVocab) {
    var items = [], pool = allVocab || vocab;
    var pairs = shuffle(vocab).slice(0, 5);
    items.push({ key: 'm:' + pairs[0][0], word: null, task: { t: 'match', pairs: pairs } });
    shuffle(vocab).forEach(function (v, i) {
      var others = shuffle(pool.filter(function (x) { return x[0] !== v[0] && x[1] !== v[1]; })).slice(0, 3), t, kind = i % 3;
      if (kind === 2 && !/[…?!]/.test(v[0])) t = { t: 'input', q: '«' + v[1] + '» по-английски: ___', a: v[0].split(/\s*\/\s*/).concat([v[0]]), why: v[2] + ' — ' + v[3] };
      else if (kind === 1) { var o = shuffle([v].concat(others)); t = { t: 'choice', q: 'Как по-английски «' + v[1] + '»?', o: o.map(function (x) { return x[0]; }), a: o.indexOf(v), why: v[2] + ' — ' + v[3] }; }
      else { var o2 = shuffle([v].concat(others)); t = { t: 'choice', q: 'Что значит «' + v[0] + '»?', o: o2.map(function (x) { return x[1]; }), a: o2.indexOf(v), why: v[2] + ' — ' + v[3] }; }
      items.push({ key: 'w:' + v[0] + ':' + kind, word: v[0], task: t });
    });
    if (canSpeak) shuffle(vocab).slice(0, 2).forEach(function (v, i) { items.splice(i ? 8 : 3, 0, { key: 'l:' + v[0], task: listenWord(v, pool) }); });
    return items;
  }
  function allVocab() { var a = []; ORDER.forEach(function (id) { a = a.concat(U[id].unit.vocab); }); return a; }
  function grammarItems(gids) { var items = []; gids.forEach(function (g) { G[g].tasks.forEach(function (t, i) { items.push({ key: g + ':' + i, ref: { l: g, i: i }, task: t }); }); }); return items; }
  function begin(s) {
    S = s; S.pos = 0; S.firstTry = {}; S.mistakes = []; S.total = S.queue.length; S.right = 0;
    document.body.classList.add('is-practice'); setNav(s.nav || 'course');
    app.style.setProperty('--lc', s.li >= 0 ? lc(s.li) : 'var(--accent)'); renderTask();
  }
  function startStep(id, k) {
    var x = U[id], u = x.unit;
    if (k === 'words') return begin({ mode: 'step', step: 'words', id: id, li: x.li, queue: wordTasks(u.vocab, allVocab()), requeue: true });
    if (k === 'text') return begin({ mode: 'step', step: 'text', id: id, li: x.li, queue: u.quiz.map(function (q, i) { return { key: 'q:' + i, task: { t: 'choice', q: q.q, o: q.o, a: q.a, why: q.why } }; }).concat(textListenItems(u)), requeue: true });
    if (k === 'grammar') return begin({ mode: 'step', step: 'grammar', id: id, li: x.li, queue: grammarItems(u.grammar), requeue: true });
    if (k === 'more' && u.more) return begin({ mode: 'bonus', id: id, li: x.li, queue: u.more.quiz.map(function (q, i) { return { key: 'b:' + i, task: { t: 'choice', q: q.q, o: q.o, a: q.a, why: q.why } }; }), requeue: true });
    go('#/u/' + id);
  }
  function startTest(lvId) {
    var lv = BOOK.find(function (l) { return l.id === lvId; }), li = BOOK.indexOf(lv);
    if (!levelOpen(li)) return go('#/');
    var g = []; lv.units.forEach(function (u) { g = g.concat(u.grammar); });
    begin({ mode: 'test', id: lvId, li: li, queue: shuffle(grammarItems(g)).slice(0, 15), requeue: false });
  }
  function startTense(id) {
    var t = TN[id];
    begin({ mode: 'tense', id: id, li: -1, nav: 'tenses', queue: t.tasks.map(function (task, i) { return { key: 't:' + id + ':' + i, ref: { l: 't:' + id, i: i }, task: task }; }), requeue: true });
  }
  function taskFor(r) { if (r.l.indexOf('t:') === 0) { var t = TN[r.l.slice(2)]; return t && t.tasks[r.i]; } return G[r.l] && G[r.l].tasks[r.i]; }
  function startReview() {
    var items = P.review.filter(taskFor).slice(0, 10).map(function (r) { return { key: r.l + ':' + r.i, ref: r, task: taskFor(r) }; });
    if (!items.length) return go('#/review');
    begin({ mode: 'review', li: -1, queue: shuffle(items), requeue: true });
  }
  function startWordWrite() {
    var keys = Object.keys(P.cards); if (!keys.length) return go('#/words');
    var byWord = {}; allVocab().forEach(function (v) { byWord[v[0]] = v; });
    var pickW = keys.filter(function (k) { return byWord[k]; }).sort(function (a, b) { return (P.cards[a].box - P.cards[b].box) || (Math.random() - 0.5); }).slice(0, 10);
    var items = pickW.filter(function (k) { return !/[…?!]/.test(k); }).map(function (k) { var v = byWord[k]; return { key: 'ww:' + k, word: k, task: { t: 'input', q: '«' + v[1] + '» по-английски: ___', a: k.split(/\s*\/\s*/).concat([k]), why: v[2] + ' — ' + v[3] } }; });
    begin({ mode: 'wordwrite', li: -1, nav: 'words', queue: items, requeue: true });
  }
  var KIND = { choice: 'Выбери правильный вариант', input: 'Впиши ответ', tr: 'Переведи на английский', order: 'Собери предложение', match: 'Соедини слово и перевод', listen: 'Послушай и выбери', dict: 'Послушай и напиши' };
  var cur = null;
  function renderTask() {
    var it = S.queue[S.pos], t = it.task; cur = { item: it, sel: -1, tokens: [], checked: false };
    var pct = S.right / S.total * 100;
    var prefix = { test: 'Тест · ', review: 'Ошибки · ', tense: 'Времена · ', wordwrite: 'Слова · ', placement: 'Тест уровня · ', daily: 'Задание дня · ', listen: 'Аудирование · ', bonus: 'Бонус · ' }[S.mode] || '';
    var head = '<div class="p-top"><button class="icon-btn" type="button" id="p-exit" aria-label="Выйти">' + ic('x') + '</button><div class="p-bar" role="progressbar" aria-label="Прогресс" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(pct) + '"><span style="width:' + pct + '%"></span></div><span class="p-count">' + S.right + '/' + S.total + '</span></div>';
    var body = '<section class="task" aria-labelledby="task-kind"><p class="task__kind" id="task-kind">' + prefix + KIND[t.t] + '</p>';
    if (t.t === 'choice') {
      body += '<h2 class="task__q">' + gapQ(t.q) + '</h2><div class="options" role="radiogroup" aria-labelledby="task-kind">' + t.o.map(function (o, i) { return '<button class="opt" type="button" role="radio" aria-checked="false" data-i="' + i + '"><kbd aria-hidden="true">' + (i + 1) + '</kbd><span>' + esc(o) + '</span></button>'; }).join('') + '</div>';
    } else if (t.t === 'input') {
      body += '<h2 class="task__q">' + gapQ(t.q) + '</h2><label class="sr-only" for="ans">Ответ</label><input class="answer" id="ans" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Твой ответ">';
    } else if (t.t === 'tr') {
      body += '<div class="task__ru">' + ic('ru') + '<span>' + esc(t.ru) + '</span></div><label class="sr-only" for="ans">Перевод на английский</label><textarea class="answer" id="ans" autocomplete="off" autocapitalize="sentences" autocorrect="off" spellcheck="false" placeholder="Напиши по-английски"></textarea>';
    } else if (t.t === 'order') {
      cur.bank = shuffle(t.a.split(' ').concat(t.x || []));
      body += '<div class="task__ru">' + ic('ru') + '<span>' + esc(t.ru) + '</span></div><div class="slot" id="slot" aria-label="Твоё предложение" role="group"></div><div class="bank" id="bank" role="group" aria-label="Слова">' + cur.bank.map(function (w, i) { return '<button class="tok" type="button" data-i="' + i + '">' + esc(w) + '</button>'; }).join('') + '</div>';
    } else if (t.t === 'listen' || t.t === 'dict') {
      body += '<div class="hear"><button class="hear__btn" type="button" id="hear" aria-label="Послушать ещё раз">' + ic('vol') + '</button><button class="btn btn--ghost btn--sm" type="button" id="hear-slow">' + ic('reset') + 'Медленнее</button></div>';
      if (t.t === 'listen') body += '<h2 class="task__q">' + esc(t.q) + '</h2><div class="options" role="radiogroup" aria-labelledby="task-kind">' + t.o.map(function (o, i) { return '<button class="opt" type="button" role="radio" aria-checked="false" data-i="' + i + '"><kbd aria-hidden="true">' + (i + 1) + '</kbd><span>' + esc(o) + '</span></button>'; }).join('') + '</div>';
      else body += '<label class="sr-only" for="ans">Что ты услышал</label><textarea class="answer" id="ans" autocomplete="off" autocapitalize="sentences" autocorrect="off" spellcheck="false" lang="en" placeholder="Напиши по-английски то, что услышал"></textarea>';
    } else if (t.t === 'match') {
      cur.left = shuffle(t.pairs); cur.right = shuffle(t.pairs); cur.done = 0; cur.wrong = 0; cur.pick = null;
      body += '<div class="match"><div class="match__col" role="group" aria-label="Английский">' + cur.left.map(function (p) { return '<button class="mt" type="button" data-side="l" data-k="' + esc(p[0]) + '" aria-pressed="false">' + esc(p[0]) + '</button>'; }).join('') + '</div><div class="match__col" role="group" aria-label="Перевод">' + cur.right.map(function (p) { return '<button class="mt" type="button" data-side="r" data-k="' + esc(p[0]) + '" aria-pressed="false">' + esc(p[1]) + '</button>'; }).join('') + '</div></div>';
    }
    body += '</section>';
    app.innerHTML = head + body + '<div class="p-actions" id="p-actions"><div id="fb"></div><div class="p-actions__in"><button class="btn" type="button" id="check" disabled>Проверить</button></div></div>';
    window.scrollTo(0, 0);
    $('p-exit').addEventListener('click', exitPractice);
    $('check').addEventListener('click', onMain);
    wireTask(t);
  }
  function wireTask(t) {
    var chk = $('check');
    if (t.t === 'listen' || t.t === 'dict') {
      $('hear').addEventListener('click', function () { speak(t.say); }); $('hear-slow').addEventListener('click', function () { speak(t.say, true); });
      setTimeout(function () { if (cur && cur.item.task === t && !cur.checked) speak(t.say); }, 350);
    }
    if (t.t === 'choice' || t.t === 'listen') {
      app.querySelectorAll('.opt').forEach(function (b) { b.addEventListener('click', function () { if (!cur.checked) pickOpt(+b.dataset.i); }); });
      var first = app.querySelector('.opt'); if (first) first.focus({ preventScroll: true });
    } else if (t.t === 'input' || t.t === 'tr' || t.t === 'dict') {
      var a = $('ans'); a.addEventListener('input', function () { chk.disabled = !a.value.trim(); });
      a.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.stopPropagation(); onMain(); } });
      a.focus({ preventScroll: true });
    } else if (t.t === 'order') {
      $('bank').addEventListener('click', function (e) { var b = e.target.closest('.tok'); if (!b || cur.checked) return; cur.tokens.push(+b.dataset.i); b.classList.add('is-used'); b.setAttribute('aria-hidden', 'true'); b.tabIndex = -1; paintSlot(); });
      $('slot').addEventListener('click', function (e) { var b = e.target.closest('.tok'); if (!b || cur.checked) return; var i = +b.dataset.i; cur.tokens.splice(cur.tokens.indexOf(i), 1); var src = $('bank').querySelector('[data-i="' + i + '"]'); src.classList.remove('is-used'); src.removeAttribute('aria-hidden'); src.tabIndex = 0; paintSlot(); });
    } else if (t.t === 'match') {
      app.querySelectorAll('.mt').forEach(function (b) { b.addEventListener('click', function () { matchPick(b); }); });
    }
  }
  function pickOpt(i) { cur.sel = i; app.querySelectorAll('.opt').forEach(function (b) { b.setAttribute('aria-checked', String(+b.dataset.i === i)); }); $('check').disabled = false; }
  function paintSlot() {
    $('slot').innerHTML = cur.tokens.map(function (i) { return '<button class="tok" type="button" data-i="' + i + '" aria-label="Убрать: ' + esc(cur.bank[i]) + '">' + esc(cur.bank[i]) + '</button>'; }).join('');
    $('check').disabled = !cur.tokens.length;
  }
  function matchPick(b) {
    if (b.classList.contains('is-done')) return;
    if (!cur.pick || cur.pick.dataset.side === b.dataset.side) {
      if (cur.pick) cur.pick.setAttribute('aria-pressed', 'false');
      cur.pick = b; b.setAttribute('aria-pressed', 'true'); if (b.dataset.side === 'l') speak(b.dataset.k); return;
    }
    var a = cur.pick; cur.pick = null; a.setAttribute('aria-pressed', 'false');
    if (a.dataset.k === b.dataset.k) {
      [a, b].forEach(function (x) { x.classList.add('is-done'); x.setAttribute('aria-label', x.textContent + ' — соединено'); });
      cur.done++;
      if (cur.done === cur.left.length) { cur.matchOk = cur.wrong === 0; $('check').disabled = false; onMain(); }
    } else {
      cur.wrong++; [a, b].forEach(function (x) { x.classList.add('is-wrong'); setTimeout(function () { x.classList.remove('is-wrong'); }, 450); });
    }
  }
  function answerText(t) {
    if (t.t === 'choice' || t.t === 'listen') return t.o[t.a];
    if (t.t === 'dict') return t.a[0];
    if (t.t === 'order') return t.a;
    if (t.t === 'tr') return t.a[0] + (/^(what|where|when|who|why|how|do|does|did|is|are|was|were|can|could|have|has|had|will|would)\b/i.test(t.a[0]) ? '?' : '.');
    if (t.t === 'input') return t.a[0];
    return '';
  }
  function addReview(r) { if (r && !P.review.some(function (x) { return x.l === r.l && x.i === r.i; })) { P.review.push({ l: r.l, i: r.i, at: Date.now() }); save(); } }
  function onMain() {
    if (!S) return;
    if (cur.checked) return nextTask();
    var t = cur.item.task, ok;
    if (t.t === 'choice' || t.t === 'listen') { if (cur.sel < 0) return; ok = cur.sel === t.a; }
    else if (t.t === 'dict') { var dv = $('ans').value; if (!dv.trim()) return; ok = dictOk(dv, t.a); cur.exact = matches(dv, t.a); $('ans').readOnly = true; }
    else if (t.t === 'input' || t.t === 'tr') { var v = $('ans').value; if (!v.trim()) return; ok = matches(v, t.a); $('ans').readOnly = true; }
    else if (t.t === 'order') { if (!cur.tokens.length) return; ok = norm(cur.tokens.map(function (i) { return cur.bank[i]; }).join(' ')) === norm(t.a); }
    else if (t.t === 'match') { if (cur.done < cur.left.length) return; ok = cur.matchOk; }
    cur.checked = true;
    var key = cur.item.key, first = !(key in S.firstTry);
    if (first) S.firstTry[key] = ok;
    if (first && S.lvRight && cur.item.lv) S.lvRight[cur.item.lv] = (S.lvRight[cur.item.lv] || 0) + (ok ? 1 : 0);
    if (t.t === 'choice' || t.t === 'listen') app.querySelectorAll('.opt').forEach(function (b) { var i = +b.dataset.i; if (i === t.a) b.classList.add('is-right'); else if (i === cur.sel) b.classList.add('is-wrong'); });
    if (ok || t.t === 'match' || !S.requeue) S.right++;
    if (cur.item.word && P.cards[cur.item.word] && !ok) { P.cards[cur.item.word].box = 1; P.cards[cur.item.word].due = dayKey(1); save(); }
    if (cur.item.word) speak(cur.item.word);
    if (!ok) {
      if (S.mode !== 'review') addReview(cur.item.ref);
      if (first && t.t !== 'match') S.mistakes.push({ q: t.say ? 'Аудио: «' + t.say + '»' : (t.q || t.ru), a: answerText(t) });
      if (S.requeue && t.t !== 'match') S.queue.push(cur.item);
    } else if (S.mode === 'review') {
      P.review = P.review.filter(function (r) { return !(r.l === cur.item.ref.l && r.i === cur.item.ref.i); }); P.stats.fixed = (P.stats.fixed || 0) + 1; save();
    }
    var fb = $('fb'), pa = $('p-actions'); if (pa) pa.classList.add(ok ? 'is-ok' : 'is-bad');
    fb.className = 'fb ' + (ok ? 'ok' : 'bad');
    fb.innerHTML = '<span class="fb__ic">' + ic(ok ? 'check' : 'x') + '</span><div><b>' + (ok ? pick(['Верно!', 'Отлично!', 'Так держать!', 'Правильно!', 'Красиво!']) : (t.t === 'match' ? 'Почти' : 'Неверно — разберём')) + '</b>' +
      (t.t === 'match' ? '<p class="why">' + (ok ? 'Все пары без ошибок!' : 'Ошибок: ' + cur.wrong + '. Слова вернутся в повторении.') + '</p>' : (!ok ? '<p>Правильно: <span class="ans">' + esc(answerText(t)) + '</span></p>' : '') + (t.why ? '<p class="why">' + esc(t.why) + '</p>' : '')) + '</div>';
    fb.setAttribute('role', 'status');
    if (t.t === 'dict' && ok && !cur.exact) fb.querySelector('div').insertAdjacentHTML('beforeend', '<p>Почти идеально! Точно: <span class="ans">' + esc(t.a[0]) + '</span></p>');
    fb.insertAdjacentHTML('beforeend', '<span class="fb__lx">' + lexi(ok ? 'happy' : 'sad') + '</span>');
    if (!ok && t.say) speak(t.say);
    var btn = $('check'); btn.disabled = false; btn.textContent = 'Дальше'; btn.className = 'btn ' + (ok ? 'btn--ok' : 'btn--bad'); btn.focus({ preventScroll: true });
    app.querySelector('.p-bar span').style.width = (S.right / S.total * 100) + '%'; app.querySelector('.p-count').textContent = S.right + '/' + S.total;
    if (ok && (t.t === 'tr' || t.t === 'order')) speak(t.t === 'order' ? t.a : t.a[0]);
  }
  function nextTask() { S.pos++; if (S.pos >= S.queue.length) return finish(); renderTask(); }
  function exitPractice() {
    if (S && S.pos > 0 && !confirm('Выйти? Прогресс этого занятия не сохранится.')) return;
    var s = S; S = null;
    go(!s ? '#/' : s.mode === 'step' ? '#/u/' + s.id + '/' + s.step : s.mode === 'review' ? '#/review' : s.mode === 'tense' ? '#/tense/' + s.id : s.mode === 'wordwrite' ? '#/words' : s.mode === 'bonus' ? '#/u/' + s.id + '/text' : /^(placement|daily|listen)$/.test(s.mode) ? '#/practice' : '#/');
  }
  document.addEventListener('keydown', function (e) {
    if (cardState && !S) { if (e.key === ' ' || e.key === 'Enter') { if (!cardState.flipped) { e.preventDefault(); flipCard(); } } else if (cardState.flipped && (e.key === '1' || e.key === '2')) gradeCard(e.key === '2'); return; }
    if (dlg && dlg.cur && !S && /^[1-3]$/.test(e.key) && !e.target.matches('input, textarea')) { dlgPick(+e.key - 1); return; }
    if (!S || !cur) return;
    var t = cur.item.task;
    if (e.key === 'Enter' && e.target.matches('.opt') && !cur.checked) { e.preventDefault(); var oi = +e.target.dataset.i; if (cur.sel === oi) onMain(); else pickOpt(oi); return; }
    if (e.key === 'Enter' && !e.target.matches('textarea, input, button')) { e.preventDefault(); onMain(); return; }
    if ((t.t === 'choice' || t.t === 'listen') && !cur.checked && /^[1-4]$/.test(e.key) && +e.key <= t.o.length && !e.target.matches('input, textarea')) pickOpt(+e.key - 1);
    if (e.key === 'Escape') exitPractice();
  });

  /* ---------- results & celebration ---------- */
  function finish() {
    var s = S, keys = Object.keys(s.firstTry), firstOk = keys.filter(function (k) { return s.firstTry[k]; }).length;
    var acc = keys.length ? Math.round(firstOk / keys.length * 100) : 0, xp = 0, r = { acc: acc, li: s.li, mistakes: s.mistakes, score: firstOk + '/' + keys.length };
    if (acc === 100 && keys.length >= 4) P.stats.perfect = (P.stats.perfect || 0) + 1;
    if (s.mode === 'step') {
      var x = U[s.id], firstTime = !stepDone(s.id, s.step);
      P.units[s.id] = Object.assign(ust(s.id), (function () { var o = {}; o[s.step] = true; return o; })());
      if (s.step === 'words') x.unit.vocab.forEach(function (v) { if (!P.cards[v[0]]) P.cards[v[0]] = { box: 1, due: dayKey(1), unit: s.id }; });
      xp = (firstTime ? 10 : 3) + firstOk * (firstTime ? 2 : 1);
      r.kind = s.step; r.title = praise(acc); r.sub = { words: 'Слова раздела «' + x.unit.title + '» добавлены в карточки — завтра повторим их, чтобы они остались в памяти.', text: 'Ты прочитал текст «' + x.unit.text.title + '» и понял его. Это и есть настоящий английский!', grammar: 'Грамматика раздела «' + x.unit.title + '» отработана.' }[s.step];
      if (unitDone(s.id) && firstTime) { r.title = 'Раздел «' + x.unit.title + '» пройден!'; r.sub = 'Все 4 шага позади: слова, текст, грамматика и письмо. Красавчик!'; r.kind = 'unit'; xp += 30; }
      r.actions = nextUnitActions(s.id);
    } else if (s.mode === 'test') {
      var lv = BOOK.find(function (l) { return l.id === s.id; }), li = BOOK.indexOf(lv), passed = acc >= 80, prevT = P.levels[lv.id] || {};
      if (passed && !prevT.passed) xp = 60; else xp = firstOk;
      P.levels[lv.id] = { passed: !!(prevT.passed || passed), best: Math.max(prevT.best || 0, acc) };
      r.kind = passed ? 'level' : 'try'; r.title = passed ? 'Уровень ' + lv.code + ' взят!' : 'Пока ' + acc + '% — нужно 80%';
      r.sub = passed ? (BOOK[li + 1] ? 'Открыт уровень ' + BOOK[li + 1].code + ' — ' + BOOK[li + 1].ru + '. Ты реально растёшь!' : 'Это был последний уровень. Ты прошёл весь курс!') : 'Ошибки уже в «Работе над ошибками». Повтори их и попробуй снова — ты почти у цели.';
      r.actions = (passed && BOOK[li + 1] ? '<a class="btn" href="#/u/' + BOOK[li + 1].units[0].id + '">Дальше: ' + BOOK[li + 1].code + ic('arrow') + '</a>' : '<a class="btn" href="#/review/go">' + ic('reset') + 'Разобрать ошибки</a>') + '<a class="btn btn--ghost" href="#/">К курсу</a>';
    } else if (s.mode === 'tense') {
      var t = TN[s.id]; P.tenses[s.id] = Math.max(P.tenses[s.id] || 0, acc); xp = 5 + firstOk;
      r.kind = acc >= 80 ? 'tense' : 'try'; r.title = acc >= 80 ? t.name + ' — освоено!' : praise(acc); r.sub = acc >= 80 ? 'Ты знаешь, когда и как использовать ' + t.name + '.' : 'Повтори схему и формулы и попробуй ещё раз — до 80% совсем чуть-чуть.';
      r.actions = '<a class="btn" href="#/tenses">' + ic('clock') + 'Все времена</a><a class="btn btn--ghost" href="#/tense/' + s.id + '">' + ic('reset') + 'К теории</a>';
    } else if (s.mode === 'wordwrite') {
      xp = firstOk; r.kind = 'words'; r.title = praise(acc); r.sub = 'Ты написал слова по памяти — это самый надёжный способ их выучить.';
      r.actions = '<a class="btn" href="#/words/write">' + ic('reset') + 'Ещё 10 слов</a><a class="btn btn--ghost" href="#/words">Слова</a>';
    } else if (s.mode === 'placement') {
      var per = BOOK.map(function (lv) { var n = s.queue.filter(function (it) { return it.lv === lv.code; }).length; return { code: lv.code, r: s.lvRight[lv.code] || 0, n: n }; });
      var place = 0; while (place < BOOK.length - 1 && per[place].n && per[place].r >= Math.ceil(per[place].n * .8)) place++;
      P.placement = { lv: BOOK[place].code, at: Date.now() }; xp = 10;
      r.kind = 'level'; r.title = 'Твой уровень: ' + BOOK[place].code + ' — ' + BOOK[place].name;
      r.sub = place ? 'Ты уверенно знаешь ' + BOOK.slice(0, place).map(function (l) { return l.code; }).join(', ') + '. Начни с уровня ' + BOOK[place].code + ' — там будет и знакомое, и новое.' : 'Отличная точка старта — уровень A1. Начнём с основ и быстро пойдём дальше!';
      r.extra = '<div class="plbars">' + per.map(function (x, i) { return '<div class="plbar' + (i < place ? ' ok' : i === place ? ' now' : '') + '"><b>' + x.code + '</b><span><i style="width:' + (x.n ? x.r / x.n * 100 : 0) + '%"></i></span><em>' + x.r + '/' + x.n + '</em></div>'; }).join('') + '</div>';
      r.actions = place ? '<button class="btn" type="button" data-place="' + place + '">Начать с ' + BOOK[place].code + ic('arrow') + '</button><a class="btn btn--ghost" href="#/">Остаться на A1</a>' : '<a class="btn" href="#/u/' + BOOK[0].units[0].id + '">Начать с A1' + ic('arrow') + '</a>';
    } else if (s.mode === 'daily') {
      var firstD = !dailyDone(); P.daily[dayKey(0)] = { acc: acc };
      Object.keys(P.daily).sort().slice(0, -60).forEach(function (k) { delete P.daily[k]; });
      if (firstD) P.stats.daily = (P.stats.daily || 0) + 1;
      xp = (firstD ? 15 : 0) + firstOk; r.kind = 'medal';
      r.title = firstD ? 'Задание дня выполнено!' : praise(acc); r.sub = 'Завтра будет новое задание — заходи, чтобы не прервать серию.';
      r.actions = '<a class="btn" href="#/">К курсу' + ic('arrow') + '</a><a class="btn btn--ghost" href="#/practice">Практика</a>';
    } else if (s.mode === 'listen') {
      xp = 5 + firstOk; if (acc >= 80) P.stats.listen = (P.stats.listen || 0) + 1;
      r.kind = acc >= 80 ? 'medal' : 'try'; r.title = praise(acc); r.sub = 'Ты тренировал слух: слова, фразы и диктант. На экзаменах аудирование — отдельная часть, и теперь ты к ней готовее.';
      r.actions = '<a class="btn" href="#/listen">' + ic('reset') + 'Ещё раз</a><a class="btn btn--ghost" href="#/practice">Практика</a>';
    } else if (s.mode === 'bonus') {
      var firstB = !P.bonus[s.id]; P.bonus[s.id] = Math.max(P.bonus[s.id] || 0, acc);
      xp = (firstB ? 8 : 2) + firstOk; r.kind = 'words'; r.title = praise(acc); r.sub = 'Бонусный текст прочитан — ещё больше английского по теме «' + U[s.id].unit.title + '».';
      r.actions = nextUnitActions(s.id);
    } else {
      xp = firstOk * 2; r.kind = 'review'; r.title = P.review.length ? praise(acc) : 'Все ошибки исправлены!'; r.sub = P.review.length ? 'Осталось ошибок: ' + P.review.length + '.' : 'Ни одного долга. Красавчик!';
      r.actions = (P.review.length ? '<a class="btn" href="#/review/go">' + ic('reset') + 'Ещё ошибки</a>' : '') + '<a class="btn btn--ghost" href="#/">К курсу</a>';
    }
    addXP(xp); save(); r.xp = xp;
    S = null; document.body.classList.remove('is-practice');
    celebrate(r);
  }
  function praise(acc) {
    if (acc >= 95) return pick(['Красавчик! Ни одной ошибки', 'Идеально! Так держать', 'Огонь! Чистая победа']);
    if (acc >= 80) return pick(['Отличная работа!', 'Мощно! Ты справился', 'Так держать!']);
    if (acc >= 50) return pick(['Ты справился!', 'Хороший результат — расти дальше', 'Неплохо! Ещё чуть-чуть']);
    return pick(['Главное — не сдаваться', 'Ошибки = рост. Продолжай!', 'Сложно? Значит, ты учишься']);
  }
  var QUOTES = ['Каждый день по чуть-чуть — и через месяц ты не узнаешь свой английский.', 'Дисциплина важнее мотивации. Ты сегодня это доказал.', 'Ошибка — это не провал, а следующая ступенька.', '20 минут в день = 120 часов в год. Это целый курс!', 'Тот, кто пишет и говорит, учится в разы быстрее того, кто только читает.', 'Ты делаешь то, что откладывают другие. Уважение.'];
  function illo(kind) { return svgv(illo0(kind)); }
  function illo0(kind) {
    var D = '<defs><linearGradient id="ig1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fef3c7"/><stop offset=".4" stop-color="#fbbf24"/><stop offset="1" stop-color="#b45309"/></linearGradient>' +
      '<linearGradient id="ig2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f59e0b"/><stop offset="1" stop-color="#78350f"/></linearGradient>' +
      '<linearGradient id="ig3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c4b5fd"/><stop offset="1" stop-color="#6d28d9"/></linearGradient>' +
      '<linearGradient id="ig4" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f9a8d4"/><stop offset="1" stop-color="#be185d"/></linearGradient>' +
      '<linearGradient id="ig5" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a5f3fc"/><stop offset="1" stop-color="#0e7490"/></linearGradient>' +
      '<radialGradient id="ig6" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".22" stop-color="#fde68a"/><stop offset=".68" stop-color="#f59e0b"/><stop offset="1" stop-color="#92400e"/></radialGradient></defs>';
    function spark(x, y, k, c) { return '<path transform="translate(' + x + ' ' + y + ') scale(' + k + ')" d="M0-10 2.6-2.6 10 0 2.6 2.6 0 10-2.6 2.6-10 0-2.6-2.6z" fill="' + c + '"/>'; }
    var sp = spark(28, 42, 1.1, '#a78bfa') + spark(192, 36, .9, '#f472b6') + spark(186, 122, 1.2, '#22d3ee') + spark(36, 128, .8, '#fbbf24');
    var open = '<svg viewBox="0 0 220 180" class="illo" aria-hidden="true">' + D + '<ellipse cx="110" cy="168" rx="62" ry="9" fill="#1e1b4b" opacity=".14"/>';
    if (kind === 'level' || kind === 'unit') return open +
      '<path d="M72 40H56a18 18 0 0 0 20 30M148 40h16a18 18 0 0 1-20 30" fill="none" stroke="url(#ig2)" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M70 26h80v44a40 40 0 0 1-80 0z" fill="url(#ig1)"/><path d="M86 36c0 30 6 48 20 56" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="7" stroke-linecap="round"/>' +
      '<rect x="100" y="108" width="20" height="22" fill="url(#ig2)"/><rect x="78" y="128" width="64" height="16" rx="6" fill="url(#ig1)"/><rect x="70" y="142" width="80" height="16" rx="6" fill="url(#ig2)"/>' +
      '<path d="M110 44l6.5 13.2 14.5 2.1-10.5 10.2 2.5 14.5-13-6.8-13 6.8 2.5-14.5-10.5-10.2 14.5-2.1z" fill="#fff"/>' + sp + '</svg>';
    if (kind === 'write') return open +
      '<rect x="52" y="28" width="98" height="126" rx="16" fill="url(#ig3)"/><rect x="60" y="36" width="82" height="110" rx="10" fill="#fff"/>' +
      '<g stroke="#ddd6fe" stroke-width="6" stroke-linecap="round"><path d="M72 58h56M72 76h56M72 94h40M72 112h50"/></g><path d="M74 126l8 8 16-18" fill="none" stroke="#10b981" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<g transform="rotate(32 168 86)"><rect x="158" y="22" width="22" height="96" rx="5" fill="url(#ig1)"/><rect x="158" y="14" width="22" height="16" rx="5" fill="url(#ig4)"/><path d="M158 118h22l-11 22z" fill="#fde68a"/><path d="M165 132h8l-4 8z" fill="#1e1b4b"/></g>' + sp + '</svg>';
    if (kind === 'words') return open +
      '<rect x="44" y="46" width="84" height="108" rx="16" fill="url(#ig5)" transform="rotate(-14 86 100)"/><rect x="92" y="38" width="84" height="108" rx="16" fill="url(#ig4)" transform="rotate(12 134 92)"/>' +
      '<rect x="64" y="26" width="92" height="118" rx="18" fill="#fff" stroke="#ede9fe" stroke-width="3"/><text x="110" y="96" text-anchor="middle" font-family="Unbounded, Manrope, sans-serif" font-weight="800" font-size="32" fill="#6d28d9">Aa</text>' +
      '<circle cx="152" cy="132" r="20" fill="#10b981"/><path d="M142 132l7 7 13-14" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' + sp + '</svg>';
    if (kind === 'try') return open +
      '<g transform="rotate(32 110 92)"><path d="M110 18c24 18 32 48 28 86H82c-4-38 4-68 28-86z" fill="url(#ig3)"/><path d="M98 30c-8 14-12 34-10 60" stroke="#fff" stroke-opacity=".55" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<circle cx="110" cy="64" r="14" fill="#fff"/><circle cx="110" cy="64" r="9" fill="url(#ig5)"/><path d="M82 90 62 118l22-4zM138 90l20 28-22-4z" fill="url(#ig4)"/>' +
      '<path d="M94 104h32l-6 16h-20z" fill="url(#ig2)"/><path d="M100 120q10 30 10 40q0-10 10-40z" fill="#fbbf24"/></g>' + sp + '</svg>';
    return open +
      '<path d="M84 98 66 152l20-10 12 18 12-52z" fill="url(#ig4)"/><path d="M136 98l18 54-20-10-12 18-12-52z" fill="url(#ig3)"/>' +
      '<circle cx="110" cy="80" r="52" fill="url(#ig6)"/><circle cx="110" cy="80" r="40" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="4" stroke-dasharray="6 7"/>' +
      '<path d="M110 56l7.4 15 16.6 2.4-12 11.7 2.8 16.5L110 93.8l-14.8 7.8 2.8-16.5-12-11.7 16.6-2.4z" fill="#fff"/><path d="M76 62a38 38 0 0 1 30-28" stroke="#fff" stroke-opacity=".75" stroke-width="6" fill="none" stroke-linecap="round"/>' + sp + '</svg>';
  }
  function confetti() {
    if (reduce) return '';
    var cols = ['#7c3aed', '#2563eb', '#f59e0b', '#ec4899', '#10b981', '#ef4444'], h = '<div class="confetti" aria-hidden="true">';
    for (var i = 0; i < 46; i++) h += '<i style="left:' + Math.round(Math.random() * 100) + '%;background:' + cols[i % cols.length] + ';animation-delay:' + (Math.random() * .6).toFixed(2) + 's;animation-duration:' + (1.8 + Math.random() * 1.4).toFixed(2) + 's;transform:rotate(' + Math.round(Math.random() * 360) + 'deg)"></i>';
    return h + '</div>';
  }
  function celebrate(r) {
    var fresh = checkBadges(), good = r.acc === null || r.acc === undefined || r.acc >= 80 || r.kind === 'unit' || r.kind === 'level';
    var tx = todayXP(), goalHit = tx >= GOAL && tx - r.xp < GOAL;
    var html = (good ? confetti() : '') + '<section class="card result" aria-labelledby="r-title"><div class="rays" aria-hidden="true"></div>' + illo(r.kind || (good ? 'medal' : 'try')) + '<h1 id="r-title">' + esc(r.title) + '</h1><p class="muted">' + esc(r.sub || '') + '</p>' +
      '<div class="r-stats">' + (r.acc !== null && r.acc !== undefined ? '<div class="r-stat"><b data-count="' + r.acc + '" data-suf="%">' + r.acc + '%</b><span>точность</span></div><div class="r-stat"><b>' + r.score + '</b><span>с первого раза</span></div>' : '') + '<div class="r-stat gold"><b data-count="' + r.xp + '" data-pre="+">+' + r.xp + '</b><span>XP</span></div>' +
      '<div class="r-stat' + (tx >= GOAL ? ' ok' : '') + '"><b>' + Math.min(tx, GOAL) + '/' + GOAL + '</b><span>' + (tx >= GOAL ? 'цель дня ✓' : 'цель дня') + '</span></div></div>';
    if (goalHit) html += '<p class="goal-hit">' + ic('flame') + 'Цель дня выполнена! Серия: ' + streakNow() + ' ' + plural(streakNow(), ['день', 'дня', 'дней']) + ' подряд.</p>';
    if (fresh.length) html += '<div class="new-badges"><p class="section-h">Новая награда</p>' + fresh.map(function (b) { return '<div class="nb">' + medal(b, false, 72) + '<div><b>' + esc(b.n) + '</b><span>' + esc(b.d) + '</span></div></div>'; }).join('') + '</div>';
    if (r.extra) html += r.extra;
    if (r.mistakes && r.mistakes.length) html += '<p class="section-h" style="margin-top:6px">Работа над ошибками</p><ul class="mistakes">' + r.mistakes.map(function (m) { return '<li><div class="q">' + esc(m.q) + '</div><div class="a">' + esc(m.a) + '</div></li>'; }).join('') + '</ul>';
    html += lexiSay(good ? 'cheer' : 'think', pick(QUOTES), 'say--result') + '<div class="r-actions">' + (r.actions || '') + '</div></section>';
    show(html, 'course', r.li); xpBump(r.xp);
    var b = app.querySelector('.r-actions .btn'); if (b) b.focus({ preventScroll: true });
  }

  /* ---------- review ---------- */
  function viewReview() {
    var n = P.review.length;
    var html = pageHead('reset', PAL[9], 'Работа над ошибками', 'Сюда автоматически попадают задания, в которых ты ошибся. Ответь правильно — и задание уйдёт. Это самая полезная тренировка: она бьёт точно в слабые места.');
    if (!n) html += '<section class="card empty" style="margin-top:18px">' + ic('check') + '<p>Ошибок для повторения нет. Красавчик!</p><a class="btn btn--ghost" href="#/">К курсу</a></section>';
    else html += '<section class="card cta-card" style="margin-top:18px"><div><b class="big">' + n + '</b> ' + plural(n, ['задание ждёт', 'задания ждут', 'заданий ждут']) + ' исправления</div><a class="btn" href="#/review/go">' + ic('play') + 'Исправить (до 10)</a></section>';
    show(html, 'course');
  }

  /* ---------- tenses ---------- */
  function timeline(kind, big) {
    var W = 320, H = big ? 120 : 64, y = H / 2 + (big ? 8 : 4), now = 190, a = 'var(--lc, var(--accent))', act = '#f59e0b', txt = big;
    var s = '<svg class="tl' + (big ? ' tl--big' : '') + '" viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true">';
    s += '<line x1="12" y1="' + y + '" x2="' + (W - 14) + '" y2="' + y + '" stroke="var(--line-2)" stroke-width="3"/><path d="M' + (W - 14) + ' ' + (y - 6) + 'l10 6-10 6z" fill="var(--line-2)"/>';
    s += '<line x1="' + now + '" y1="' + (y - (big ? 30 : 20)) + '" x2="' + now + '" y2="' + (y + (big ? 30 : 20)) + '" stroke="var(--bad)" stroke-width="3" stroke-dasharray="4 4"/>';
    if (txt) s += '<text x="' + now + '" y="' + (y + 46) + '" text-anchor="middle" class="tl__t" fill="var(--bad)">сейчас</text><text x="40" y="' + (y + 46) + '" text-anchor="middle" class="tl__t">прошлое</text><text x="' + (W - 40) + '" y="' + (y + 46) + '" text-anchor="middle" class="tl__t">будущее</text>';
    function dot(x, c, r) { return '<circle class="tl__dot" cx="' + x + '" cy="' + y + '" r="' + (r || 8) + '" fill="' + (c || act) + '"/>'; }
    function band(x1, x2, c) { return '<rect x="' + x1 + '" y="' + (y - 9) + '" width="' + (x2 - x1) + '" height="18" rx="9" fill="' + (c || act) + '" fill-opacity=".85"/>'; }
    function wave(x1, x2) { var p = 'M' + x1 + ' ' + y; for (var x = x1; x < x2; x += 12) p += ' q3 -10 6 0 q3 10 6 0'; return '<path d="' + p + '" fill="none" stroke="' + act + '" stroke-width="4" stroke-linecap="round"/>'; }
    function mark(x, label) { return '<line x1="' + x + '" y1="' + (y - 18) + '" x2="' + x + '" y2="' + (y + 18) + '" stroke="' + a + '" stroke-width="4"/>' + (txt && label ? '<text x="' + x + '" y="' + (y - 24) + '" text-anchor="middle" class="tl__t">' + label + '</text>' : ''); }
    function arrow(x1, x2) { return '<path d="M' + x1 + ' ' + (y - 16) + ' Q ' + ((x1 + x2) / 2) + ' ' + (y - 42) + ' ' + x2 + ' ' + (y - 16) + '" fill="none" stroke="' + a + '" stroke-width="3"/><path d="M' + (x2 - 6) + ' ' + (y - 24) + 'l6 8 3-10z" fill="' + a + '"/>'; }
    switch (kind) {
      case 'habit': [40, 90, 140, 190, 240, 290].forEach(function (x) { s += dot(x, null, 7); }); break;
      case 'now': s += wave(160, 222) + dot(now, null, 6); break;
      case 'past': s += dot(90, null, 10); break;
      case 'pastProg': s += wave(50, 130) + mark(110, 'момент'); break;
      case 'will': s += dot(260, null, 10); break;
      case 'goingto': s += dot(now, a, 7) + arrow(now, 262) + dot(262, null, 10); break;
      case 'pp': s += dot(90, null, 10) + arrow(90, now - 4); break;
      case 'ppc': s += band(70, now) ; break;
      case 'pastperf': s += dot(60, null, 10) + mark(125, 'потом') + arrow(60, 121); break;
      case 'futcont': s += wave(225, 296) + mark(260, 'момент'); break;
      case 'futperf': s += dot(232, null, 10) + mark(282, 'к сроку'); break;
      case 'pastperfcont': s += band(30, 120) + mark(122, 'момент'); break;
      case 'futperfcont': s += band(150, 280) + mark(282, 'к сроку'); break;
    }
    return svgv(s + '</svg>');
  }
  var LEVELS = ['A1', 'A2', 'B1', 'B2'], LV_I = { A1: 0, A2: 1, B1: 2, B2: 3 };
  /* official BBC Learning English lessons on YouTube for each tense (where one exists) */
  var BBC = ' — 6 Minute Grammar (BBC)';
  var TVID = {
    ps: [['Present Simple and Present Continuous' + BBC, 'xFsYrTIndhI'], ['How to use present tenses' + BBC, 'X6LuWwb9whM']],
    pc: [['Present Simple and Present Continuous' + BBC, 'xFsYrTIndhI'], ['Present continuous and going to' + BBC, '-8660VeIj4U']],
    pas: [['The past simple tense' + BBC, 'PgsG98vByiw']],
    pac: [['Past simple and past continuous' + BBC, 'uTB5I8V9Eog'], ['How to use narrative tenses' + BBC, '3mi5OI23A6w']],
    fs: [['Talking about the future' + BBC, 'jcAX1RtKq3U'], ['How to talk about the future' + BBC, 'elPHkXNxi2g']],
    gt: [['Present continuous and going to' + BBC, '-8660VeIj4U']],
    pp: [['Present perfect with ever and never' + BBC, 'o-GWYDA4IQY'], ['Present perfect and past simple' + BBC, 'jwmKjgwlMk8']],
    ppc: [['Present perfect continuous' + BBC, '70w98yeKj74']],
    pap: [['The past perfect tense' + BBC, 'vyvGJrB7WNM'], ['How to use narrative tenses' + BBC, '3mi5OI23A6w']],
    papc: [['The past perfect continuous tense' + BBC, 'YXXtNR7JCzY']]
  };
  function viewTenses() {
    var html = pageHead('clock', PAL[0], 'Времена', 'Все 13 форм английского глагола — от простых к сложным. На каждой схеме: красная линия — «сейчас», жёлтое — когда происходит действие.') +
      '<div class="videos tour"><a class="video" href="https://www.youtube.com/watch?v=FGQPFqqduec" target="_blank" rel="noopener"><span class="video__play">' + ic('play') + '</span><span><b>Обзор: Take a tenses tour' + BBC + '</b><small>6 главных времён за 6 минут · YouTube</small></span></a></div>';
    LEVELS.forEach(function (L) {
      var list = TENSES.filter(function (t) { return t.level === L; }); if (!list.length) return;
      html += '<section class="tgroup" style="--lc:' + lc(LV_I[L]) + '"><h2><span class="tbadge" data-bg="' + WORLD[LV_I[L]].bg + '" style="background:' + WORLD[LV_I[L]].g + '">' + L + '</span>' + { A1: 'Начальный', A2: 'Элементарный', B1: 'Средний', B2: 'Выше среднего' }[L] + '</h2><div class="tcards">' +
        list.map(function (t) { var b = P.tenses[t.id]; return '<a class="tcard rise" data-tilt href="#/tense/' + t.id + '">' + timeline(t.tl) + '<div><b>' + esc(t.name) + '</b><span>' + esc(t.ru) + '</span></div><span class="tcard__score' + (b >= 80 ? ' ok' : '') + '">' + (b === undefined ? 'не начато' : b + '%') + '</span></a>'; }).join('') + '</div></section>';
    });
    show(html, 'tenses');
  }
  function viewTense(id) {
    var t = TN[id], li = LV_I[t.level];
    var html = '<a class="back" href="#/tenses">' + ic('left', 'i--sm') + 'Все времена</a><header class="banner banner4 rise" data-bg="' + WORLD[li].bg + '">' + deco('banner') + i3d('clock', PAL[(li * 3) % PAL.length], 'i3d--lg float') + '<div><span class="eyebrow">Уровень ' + t.level + '</span><h1>' + esc(t.name) + '</h1><p>' + esc(t.ru) + '</p></div></header>' +
      '<section class="card theory"><div class="tl-wrap">' + timeline(t.tl, true) + '</div><p class="idea">' + esc(t.idea) + '</p>' +
      '<p class="section-h">Когда используем</p><ul class="uses">' + t.uses.map(function (u) { return '<li>' + md(u) + '</li>'; }).join('') + '</ul>' +
      '<p class="section-h">Как строится</p><div class="ftable">' + t.form.map(function (f) { return '<div class="frow"><span class="fsign">' + esc(f[0]) + '</span><div><b>' + md(f[1]) + '</b><span class="muted">' + esc(f[2]) + '</span></div>' + speakBtn(f[2]) + '</div>'; }).join('') + '</div>' +
      '<p class="section-h">Слова-подсказки</p><div class="chip-row">' + t.markers.map(function (m) { return '<span class="chip">' + esc(m) + '</span>'; }).join('') + '</div>' +
      '<p class="section-h">Примеры</p><ul class="examples">' + t.ex.map(function (e) { return '<li>' + speakBtn(e[0]) + '<div><div class="en">' + esc(e[0]) + '</div><div class="ru">' + esc(e[1]) + '</div></div></li>'; }).join('') + '</ul>' +
      '<div class="tip">' + ic('alert') + '<p><b>Частая ошибка.</b> ' + md(t.mistake) + '</p></div><div class="vs">' + ic('layers') + '<p><b>Не путай.</b> ' + md(t.vs) + '</p></div></section>' +
      videosHTML(TVID[id] || [], t.name + ' tense') +
      '<div class="start-bar"><a class="btn" href="#/tense/' + id + '/go">' + ic('play') + 'Практика (' + t.tasks.length + ' заданий)' + (P.tenses[id] !== undefined ? ' · лучший ' + P.tenses[id] + '%' : '') + '</a></div>';
    show(html, 'tenses', li);
  }

  /* ---------- words: spaced repetition cards ---------- */
  var INTERVAL = [0, 1, 3, 7, 14, 30];
  var cardState = null;
  function viewWords() {
    cardState = null;
    var keys = Object.keys(P.cards), due = dueCards().length, learned = learnedWords();
    var html = pageHead('list', PAL[5], 'Слова', 'Карточки с интервальным повторением: слово возвращается через 1, 3, 7, 14 и 30 дней — ровно тогда, когда ты начинаешь его забывать. Так слова уходят в долгую память.');
    html += '<div class="wstats"><div class="r-stat"><b>' + keys.length + '</b><span>в колоде</span></div><div class="r-stat"><b>' + due + '</b><span>на сегодня</span></div><div class="r-stat gold"><b>' + learned + '</b><span>в памяти</span></div></div>';
    if (!keys.length) html += '<section class="card empty">' + ic('list') + '<p>Колода пустая. Пройди шаг «Слова» в любом разделе — слова появятся здесь.</p><a class="btn" href="#/">К курсу</a></section>';
    else html += '<div class="wactions"><a class="btn' + (due ? '' : ' btn--ghost') + '" href="#/words/cards">' + ic('reset') + (due ? 'Повторить карточки (' + Math.min(due, 20) + ')' : 'Повторить всё равно') + '</a><a class="btn btn--ghost" href="#/words/write">' + ic('pen') + 'Написать по памяти</a></div>';
    var byUnit = {}; keys.forEach(function (k) { var u = P.cards[k].unit; (byUnit[u] = byUnit[u] || []).push(k); });
    var map = {}; allVocab().forEach(function (v) { map[v[0]] = v; });
    ORDER.forEach(function (id) {
      if (!byUnit[id]) return;
      html += '<details class="ref"><summary><span class="code">' + U[id].level.code + '</span>' + esc(U[id].unit.title) + ' <span class="muted" style="font-weight:600">· ' + byUnit[id].length + ' слов</span>' + ic('right') + '</summary><div class="body"><div class="words">' +
        byUnit[id].map(function (k) { var v = map[k] || [k, '']; var bx = P.cards[k].box; return '<div class="word">' + speakBtn(k) + '<div><b>' + esc(k) + '</b><span>' + esc(v[1]) + '</span></div><span class="lvl" role="img" title="Уровень запоминания: ' + Math.min(bx, 5) + ' из 5" aria-label="Уровень запоминания: ' + Math.min(bx, 5) + ' из 5">' + [1, 2, 3, 4, 5].map(function (n) { return '<i' + (n <= bx ? ' class="on"' : '') + '></i>'; }).join('') + '</span></div>'; }).join('') + '</div></div></details>';
    });
    show(html, 'words');
  }
  function startCards() {
    var keys = dueCards(); if (!keys.length) keys = Object.keys(P.cards).sort(function (a, b) { return P.cards[a].box - P.cards[b].box; });
    if (!keys.length) return go('#/words');
    var map = {}; allVocab().forEach(function (v) { map[v[0]] = v; });
    cardState = { queue: shuffle(keys.slice(0, 20)).filter(function (k) { return map[k]; }).map(function (k) { return map[k]; }), pos: 0, ok: 0, total: 0, again: {}, flipped: false };
    cardState.total = cardState.queue.length;
    document.body.classList.add('is-practice'); setNav('words'); app.style.setProperty('--lc', 'var(--accent)');
    renderCard();
  }
  function renderCard() {
    var c = cardState, v = c.queue[c.pos]; c.flipped = false;
    var pct = c.ok / c.total * 100;
    app.innerHTML = '<div class="p-top"><a class="icon-btn" href="#/words" aria-label="Выйти">' + ic('x') + '</a><div class="p-bar"><span style="width:' + pct + '%"></span></div><span class="p-count">' + c.ok + '/' + c.total + '</span></div>' +
      '<section class="flash" aria-live="polite"><p class="task__kind">Вспомни перевод, потом переверни карточку</p><button class="fcard" type="button" id="fcard" aria-label="Перевернуть карточку"><span class="fcard__front"><b>' + esc(v[0]) + '</b><span>' + esc(v[2]) + '</span></span><span class="fcard__back" data-bg="#5b21b6"><b>' + esc(v[1]) + '</b><span>' + esc(v[3]) + '</span></span></button>' +
      '<div class="flash__btns" id="fbtns"><button class="btn btn--ghost" type="button" id="flip">' + ic('reset') + 'Показать перевод</button></div></section>';
    speak(v[0]);
    $('fcard').addEventListener('click', flipCard); $('flip').addEventListener('click', flipCard);
  }
  function flipCard() {
    var c = cardState; if (!c || c.flipped) return; c.flipped = true;
    $('fcard').classList.add('is-flipped');
    $('fbtns').innerHTML = '<button class="btn btn--bad" type="button" id="g-no"><kbd>1</kbd>Не помню</button><button class="btn btn--ok" type="button" id="g-yes"><kbd>2</kbd>Помню</button>';
    $('g-no').addEventListener('click', function () { gradeCard(false); }); $('g-yes').addEventListener('click', function () { gradeCard(true); }); $('g-yes').focus({ preventScroll: true });
  }
  function gradeCard(ok) {
    var c = cardState, v = c.queue[c.pos], card = P.cards[v[0]];
    if (ok) { if (!c.again[v[0]]) { card.box = Math.min(5, card.box + 1); card.due = dayKey(INTERVAL[card.box]); } c.ok++; }
    else { card.box = 1; card.due = dayKey(1); c.again[v[0]] = true; c.queue.push(v); card.miss = (card.miss || 0) + 1; }
    save(); c.pos++;
    if (c.pos >= c.queue.length) {
      var missed = Object.keys(c.again).length, xp = c.total - missed + 2; addXP(xp); save(); cardState = null; document.body.classList.remove('is-practice');
      var acc = Math.round((c.total - missed) / c.total * 100);
      return celebrate({ kind: 'words', title: praise(acc), sub: 'Карточки повторены. Трудные слова вернутся завтра, лёгкие — через несколько дней. Слов в долгой памяти: ' + learnedWords() + '.', acc: acc, score: (c.total - missed) + '/' + c.total, xp: xp, li: -1, actions: '<a class="btn" href="#/words/write">' + ic('pen') + 'Написать по памяти</a><a class="btn btn--ghost" href="#/words">Слова</a>' });
    }
    renderCard();
  }

  /* ---------- grammar reference ---------- */
  function viewRef() {
    var html = pageHead('book', PAL[7], 'Грамматика', 'Все правила курса в одном месте — как шпаргалка перед контрольной.') + '<label class="search">' + ic('search') + '<span class="sr-only">Поиск по грамматике</span><input id="ref-q" type="search" placeholder="Например: was, a/an, will" autocomplete="off"></label><div id="ref-list">';
    BOOK.forEach(function (lv) { lv.units.forEach(function (u) { u.grammar.forEach(function (gid) {
      var g = G[gid], text = (g.title + ' ' + g.short + ' ' + g.formula + ' ' + g.rules.map(function (r) { return r.h + ' ' + r.t; }).join(' ') + ' ' + g.ex.map(function (e) { return e.join(' '); }).join(' ')).toLowerCase();
      html += '<details class="ref" data-text="' + esc(text) + '"><summary><span class="code">' + lv.code + '</span>' + esc(g.title) + ' <span class="muted" style="font-weight:600">· ' + esc(u.title) + '</span>' + ic('right') + '</summary><div class="body">' + theoryHTML(g) + '</div></details>';
    }); }); });
    show(html + '</div><p class="empty" id="ref-empty" hidden>Ничего не найдено.</p>', 'ref');
    $('ref-q').addEventListener('input', function () {
      var q = this.value.trim().toLowerCase(), any = false;
      app.querySelectorAll('details.ref').forEach(function (d) { var hit = !q || d.dataset.text.indexOf(q) >= 0; d.hidden = !hit; if (hit) any = true; d.open = !!q && hit; });
      $('ref-empty').hidden = any;
    });
  }

  /* ---------- profile & achievements ---------- */
  function viewMe() {
    checkBadges();
    var got = BADGES.filter(function (b) { return P.badges[b.id]; }).length;
    var days = []; for (var i = 6; i >= 0; i--) days.push({ k: dayKey(-i), d: new Date(Date.now() - i * 864e5) });
    var max = Math.max(GOAL, Math.max.apply(null, days.map(function (d) { return P.days[d.k] || 0; })));
    var wd = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' });
    var html = pageHead('trophy', GOLD, 'Мои награды', 'Твой путь в цифрах. Маленькие шаги каждый день складываются в большой результат.') +
      '<div class="wstats"><div class="r-stat gold"><b>' + P.xp + '</b><span>XP всего</span></div><div class="r-stat"><b>' + streakNow() + '</b><span>' + plural(streakNow(), ['день', 'дня', 'дней']) + ' подряд</span></div><div class="r-stat"><b>' + ORDER.filter(unitDone).length + '</b><span>разделов</span></div><div class="r-stat"><b>' + learnedWords() + '</b><span>слов в памяти</span></div><div class="r-stat"><b>' + Object.keys(P.texts).length + '</b><span>текстов</span></div><div class="r-stat"><b>' + tensesMastered() + '/' + TENSES.length + '</b><span>времён</span></div></div>' +
      '<section class="card week"><h2>Неделя</h2><div class="bars">' + days.map(function (d) { var v = P.days[d.k] || 0; return '<div class="bar' + (v >= GOAL ? ' hit' : '') + '"><span class="bar__v">' + v + '</span><span class="bar__col" style="height:' + Math.max(4, v / max * 100) + '%"></span><span class="bar__d">' + wd.format(d.d) + '</span></div>'; }).join('') + '</div><p class="hint">Цель дня — ' + GOAL + ' XP: примерно 15 минут занятий.</p></section>' +
      '<p class="section-h" style="margin:22px 0 12px">Медали · ' + got + ' из ' + BADGES.length + '</p><div class="badges">' +
      BADGES.map(function (b) { var on = !!P.badges[b.id]; return '<div class="badge-card rise' + (on ? '' : ' is-locked') + '">' + medal(b, !on) + '<b>' + esc(b.n) + '</b><span>' + esc(b.d) + '</span></div>'; }).join('') + '</div>';
    var texts = Object.keys(P.texts);
    if (texts.length) html += '<p class="section-h" style="margin:22px 0 12px">Мои тексты</p>' + texts.map(function (id) { return U[id] ? '<details class="ref"><summary><span class="code">' + U[id].level.code + '</span>' + esc(U[id].unit.title) + ic('right') + '</summary><div class="body"><p class="model__text">' + esc(P.texts[id].text) + '</p><a class="btn btn--ghost btn--sm" href="#/u/' + id + '/write">' + ic('pen') + 'Переписать</a></div></details>' : ''; }).join('');
    show(html, 'me');
  }

  /* ================= v6: mascot, listening, placement, daily task, practice hub, dialogs, speaking ================= */
  var EX = window.EXTRA || {}, DIALOGS = {};
  (EX.dialogs || []).forEach(function (d) { DIALOGS[d.id] = d; });
  var LX = EX.lexi || { ok: ['Супер!'], bad: ['Не страшно!'], daily: ['Задание ждёт!'], done: ['Готово!'] };

  /* «Лекси» — an original mascot: a little living book */
  function lexi(mood, cls) {
    mood = mood || 'happy';
    var ink = '#1e1550', arm = 'fill="none" stroke="#6d28d9" stroke-width="6" stroke-linecap="round"';
    var mouth = {
      cheer: '<path d="M52 73q11 19 22 0z" fill="' + ink + '"/><path d="M57 81q6 6 12 0" fill="#fb7185"/>',
      sad: '<path d="M55 82q8-7 16 0" fill="none" stroke="' + ink + '" stroke-width="3.6" stroke-linecap="round"/>',
      think: '<path d="M57 79h12" stroke="' + ink + '" stroke-width="3.6" stroke-linecap="round"/>'
    }[mood] || '<path d="M54 76q9 9 18 0" fill="none" stroke="' + ink + '" stroke-width="3.6" stroke-linecap="round"/>';
    var arms = {
      cheer: '<path d="M25 62q-12-8-12-24M95 62q12-8 12-24" ' + arm + '/>',
      wave: '<path d="M25 70q-10 6-9 18" ' + arm + '/><path class="lexi__wave" d="M95 62q12-6 12-22" ' + arm + '/>',
      think: '<path d="M25 70q-10 6-9 18" ' + arm + '/><path d="M95 72q10 8-10 14" ' + arm + '/>'
    }[mood] || '<path d="M25 70q-10 6-9 18M95 70q10 6 9 18" ' + arm + '/>';
    var px = mood === 'think' ? 2 : 0, py = mood === 'think' ? -3 : mood === 'sad' ? 2 : 0;
    var brows = mood === 'sad' ? '<path d="M40 44l13-4M86 44l-13-4" stroke="' + ink + '" stroke-width="3" stroke-linecap="round"/>' : mood === 'think' ? '<path d="M41 39l12 1M73 37l13-2" stroke="' + ink + '" stroke-width="3" stroke-linecap="round"/>' : '';
    return '<svg class="lexi lexi--' + mood + (cls ? ' ' + cls : '') + '" viewBox="0 0 120 130" aria-hidden="true">' +
      '<ellipse cx="60" cy="124" rx="30" ry="5" fill="#1e1b4b" opacity=".16"/><g class="lexi__body">' +
      '<path d="M78 100v22l6-5 6 5v-22z" fill="#e11d48"/>' + arms +
      '<ellipse cx="44" cy="110" rx="10" ry="6" fill="#4c1d95"/><ellipse cx="76" cy="110" rx="10" ry="6" fill="#4c1d95"/>' +
      '<rect x="22" y="12" width="76" height="96" rx="18" fill="url(#lx-cover)"/><path d="M33 16v88" stroke="#4c1d95" stroke-opacity=".45" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M91 24v74" stroke="#fef3c7" stroke-width="5" stroke-linecap="round"/><rect x="46" y="22" width="36" height="5" rx="2.5" fill="#fbbf24"/>' + brows +
      '<g class="lexi__eyes"><ellipse cx="51" cy="56" rx="11" ry="12.5" fill="#fff"/><ellipse cx="77" cy="56" rx="11" ry="12.5" fill="#fff"/>' +
      '<circle cx="' + (53 + px) + '" cy="' + (58 + py) + '" r="5.6" fill="' + ink + '"/><circle cx="' + (79 + px) + '" cy="' + (58 + py) + '" r="5.6" fill="' + ink + '"/>' +
      '<circle cx="' + (55 + px) + '" cy="' + (55 + py) + '" r="2" fill="#fff"/><circle cx="' + (81 + px) + '" cy="' + (55 + py) + '" r="2" fill="#fff"/></g>' +
      '<ellipse cx="41" cy="74" rx="6" ry="4" fill="#f9a8d4" opacity=".85"/><ellipse cx="87" cy="74" rx="6" ry="4" fill="#f9a8d4" opacity=".85"/>' + mouth + '</g></svg>';
  }
  function lexiSay(mood, text, cls) { return '<div class="say' + (cls ? ' ' + cls : '') + '">' + lexi(mood) + '<p class="say__b">' + esc(text) + '</p></div>'; }

  /* ---------- small helpers ---------- */
  function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }
  function topLevel() { var t = 0; BOOK.forEach(function (l, i) { if (levelOpen(i)) t = i; }); return t; }
  function openedUnits() {
    var ids = ORDER.filter(function (id) { return unitOpen(id) && unitDoneCount(id) > 0; });
    return ids.length ? ids : BOOK[topLevel()].units.slice(0, 2).map(function (u) { return u.id; });
  }
  function hashStr(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function seeded(a) { return function () { a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function sshuffle(a, rnd) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function editDist(a, b) {
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) d[i] = [i];
    for (j = 1; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  /* dictation: exact after normalising, or one word off in a longer sentence */
  function dictOk(v, list) { if (matches(v, list)) return true; var a = norm(v).split(' '), b = norm(list[0]).split(' '); return b.length >= 5 && editDist(a, b) <= 1; }

  /* ---------- listening tasks ---------- */
  function listenWord(v, pool, rnd) {
    var sh = rnd ? function (a) { return sshuffle(a, rnd); } : shuffle;
    var o = sh([v].concat(sh(pool.filter(function (x) { return x[0] !== v[0] && x[1] !== v[1]; })).slice(0, 3)));
    return { t: 'listen', say: v[0], q: 'Что ты услышал? Выбери перевод', o: o.map(function (x) { return x[1]; }), a: o.indexOf(v), why: v[0] + ' — ' + v[1] };
  }
  function textPairs(u) { return u.text.en.map(function (s, i) { return [s, u.text.ru[i] || '']; }); }
  function listenSentence(s, all) {
    var o = shuffle([s].concat(shuffle(all.filter(function (p) { return p[0] !== s[0]; })).slice(0, 2)));
    return { t: 'listen', say: s[0], q: 'Что ты услышал? Выбери перевод', o: o.map(function (p) { return p[1]; }), a: o.indexOf(s), why: s[0] };
  }
  function dictTask(s) { return { t: 'dict', say: s[0], a: [s[0]], why: s[1] }; }
  function shortSent(pairs) { var s = pairs.filter(function (p) { var n = p[0].split(/\s+/).length; return n >= 4 && n <= 9; }); return s.length ? s : pairs; }
  function textListenItems(u) {
    if (!canSpeak) return [];
    var pairs = textPairs(u), d = pick(shortSent(pairs)), rest = pairs.filter(function (p) { return p !== d; });
    return [{ key: 'td:' + d[0], task: dictTask(d) }, { key: 'tl:' + u.id, task: listenSentence(pick(rest.length ? rest : pairs), pairs) }];
  }
  function startListen() {
    if (!canSpeak) { toast('В этом браузере нет озвучки — открой сайт в Chrome, Edge или Safari'); return go('#/practice'); }
    var vocab = [], pairs = [], pool = allVocab();
    openedUnits().forEach(function (id) { vocab = vocab.concat(U[id].unit.vocab); pairs = pairs.concat(textPairs(U[id].unit)); });
    var items = shuffle(vocab).slice(0, 5).map(function (v) { return { key: 'lw:' + v[0], task: listenWord(v, pool) }; });
    shuffle(pairs).slice(0, 3).forEach(function (p) { items.push({ key: 'ls:' + p[0], task: listenSentence(p, pairs) }); });
    shuffle(shortSent(pairs)).slice(0, 2).forEach(function (p) { items.push({ key: 'ld:' + p[0], task: dictTask(p) }); });
    begin({ mode: 'listen', li: -1, nav: 'practice', queue: items, requeue: true });
  }

  /* ---------- placement test ---------- */
  function startPlacement() {
    var items = (EX.placement || []).map(function (q, i) { return { key: 'pl:' + i, lv: q.lv, task: q }; });
    begin({ mode: 'placement', li: -1, nav: 'practice', queue: items, requeue: false, lvRight: {} });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-place]'); if (!b) return;
    var place = +b.dataset.place;
    for (var i = 0; i < place; i++) { var lv = BOOK[i], was = P.levels[lv.id] || {}; if (!was.passed) P.levels[lv.id] = { passed: true, best: was.best || 0, placed: true }; }
    save(); toast('Готово! Открыт уровень ' + BOOK[place].code);
    go('#/u/' + BOOK[place].units[0].id);
  });

  /* ---------- daily task: the same 5 tasks for the whole day ---------- */
  function dailyDone() { return !!(P.daily && P.daily[dayKey(0)]); }
  function dailyItems() {
    var rnd = seeded(hashStr('daily:' + dayKey(0))), vocab = [], gids = [], items = [], pool = allVocab();
    openedUnits().forEach(function (id) { vocab = vocab.concat(U[id].unit.vocab); gids = gids.concat(U[id].unit.grammar); });
    sshuffle(vocab.filter(function (v) { return !/[…?!]/.test(v[0]); }), rnd).slice(0, 3).forEach(function (v, i) {
      var o = sshuffle([v].concat(sshuffle(pool.filter(function (x) { return x[0] !== v[0] && x[1] !== v[1]; }), rnd).slice(0, 3)), rnd);
      if (i === 0 && canSpeak) items.push({ key: 'dl:' + v[0], task: listenWord(v, pool, rnd) });
      else if (i < 2) items.push({ key: 'dc:' + v[0], task: { t: 'choice', q: 'Как по-английски «' + v[1] + '»?', o: o.map(function (x) { return x[0]; }), a: o.indexOf(v), why: v[2] + ' — ' + v[3] } });
      else items.push({ key: 'di:' + v[0], task: { t: 'input', q: '«' + v[1] + '» по-английски: ___', a: v[0].split(/\s*\/\s*/).concat([v[0]]), why: v[2] + ' — ' + v[3] } });
    });
    var g = sshuffle(grammarItems(uniq(gids)), rnd)[0]; if (g) items.push(g);
    var ts = TENSES.filter(function (t) { return LV_I[t.level] <= topLevel(); }), tt = ts[Math.floor(rnd() * ts.length)], ti = Math.floor(rnd() * tt.tasks.length);
    items.push({ key: 't:' + tt.id + ':' + ti, ref: { l: 't:' + tt.id, i: ti }, task: tt.tasks[ti] });
    return items;
  }
  function startDaily() { begin({ mode: 'daily', li: -1, nav: 'practice', queue: dailyItems(), requeue: true }); }
  function dailyCard() {
    var done = dailyDone(), when = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(new Date());
    return '<section class="daily rise' + (done ? ' is-done' : '') + '" data-bg="#0f766e">' + lexi(done ? 'cheer' : 'wave') +
      '<div class="daily__main"><span class="eyebrow">Задание дня · ' + when + '</span><h2>' + (done ? 'Выполнено! Возвращайся завтра' : '5 заданий · 2 минуты · +15 XP') + '</h2><p>' + esc(pick(done ? LX.done : LX.daily)) + '</p></div>' +
      (done ? '<a class="daily__ok" href="#/daily" aria-label="Пройти задание дня ещё раз">' + ic('check') + '</a>' : '<a class="btn daily__btn" href="#/daily">' + ic('play') + 'Начать</a>') + '</section>';
  }

  /* ---------- practice hub ---------- */
  function pcard(href, icon, pal, t, sub) { return '<a class="pcard rise" data-tilt href="' + href + '">' + i3d(icon, pal, 'i3d--lg') + '<div><b>' + t + '</b><span>' + sub + '</span></div>' + ic('right') + '</a>'; }
  function viewPractice() {
    var dl = EX.dialogs || [], dn = dl.filter(function (d) { return P.dialogs && P.dialogs[d.id]; }).length, rv = P.review.length;
    var html = pageHead('target', PAL[3], 'Практика', 'Тренируй то, что нужно и на экзамене, и в жизни: слух, произношение и живые диалоги. Плюс задание дня и тест уровня.') + dailyCard() +
      '<div class="pgrid">' +
      pcard('#/placement', 'target', PAL[0], 'Тест уровня', P.placement ? 'Твой уровень: ' + P.placement.lv + ' · пройти ещё раз' : '20 вопросов · узнай, с чего начать') +
      pcard('#/listen', 'vol', PAL[7], 'Аудирование', canSpeak ? 'Послушай и выбери · диктант' : 'В этом браузере нет озвучки') +
      pcard('#/speak', 'mic', PAL[1], 'Произношение', 'Скажи слово — сайт проверит') +
      pcard('#/review', 'reset', PAL[9], 'Работа над ошибками', rv ? rv + ' ' + plural(rv, ['задание ждёт', 'задания ждут', 'заданий ждут']) : 'Ошибок нет — красавчик') + '</div>' +
      '<p class="section-h" style="margin:26px 0 12px">Диалоги · пройдено ' + dn + ' из ' + dl.length + '</p><div class="dgrid">' +
      dl.map(function (d) { var st = P.dialogs && P.dialogs[d.id]; return '<a class="dcard rise' + (st ? ' is-done' : '') + '" data-tilt href="#/dialog/' + d.id + '">' + i3d(d.icon, PAL[d.pal]) + '<div><span class="dcard__lv">' + d.lv + '</span><b>' + esc(d.title) + '</b><span>' + esc(d.en) + '</span></div>' + (st ? '<span class="dcard__ok" aria-label="пройден">' + ic('check') + '</span>' : '') + '</a>'; }).join('') + '</div>';
    show(html, 'practice');
  }

  /* ---------- dialogs ---------- */
  var dlg = null;
  function viewDialog(id) {
    var d = DIALOGS[id], li = LV_I[d.lv];
    var html = '<a class="back" href="#/practice">' + ic('left', 'i--sm') + 'Практика</a><header class="banner banner4 rise" data-bg="' + WORLD[li].bg + '">' + deco('banner') + i3d(d.icon, PAL[d.pal], 'i3d--lg float') +
      '<div><span class="eyebrow">Диалог · ' + d.lv + ' · собеседник: ' + esc(d.who) + '</span><h1>' + esc(d.title) + '</h1><p>' + esc(d.en) + '</p></div></header>' +
      '<section class="card chat"><p class="chat__intro">' + ic('bulb', 'i--sm') + '<span>' + esc(d.intro) + '</span></p><div class="chat__log" id="chat"></div><div class="chat__opts" id="chat-opts" role="group" aria-label="Варианты ответа"></div><div id="chat-coach" aria-live="polite"></div></section>';
    show(html, 'practice', li);
    dlg = { d: d, i: 0, wrong: 0, tok: Math.random() };
    $('chat-opts').addEventListener('click', function (e) { var b = e.target.closest('.chat__opt'); if (b) dlgPick(+b.dataset.j); });
    dlgNext();
  }
  function bubble(side, en, ru) {
    var log = $('chat'); if (!log) return;
    var el = document.createElement('div'); el.className = 'msg msg--' + side;
    el.innerHTML = (side === 'npc' ? '<span class="msg__who">' + esc(dlg.d.who) + '</span>' : '<span class="msg__who">Ты</span>') + '<p class="msg__en" lang="en">' + esc(en) + '</p>' + (ru ? '<p class="msg__ru">' + esc(ru) + '</p>' : '') + speakBtn(en);
    log.appendChild(el);
    el.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  }
  function dlgNext() {
    if (!dlg || !$('chat')) return;
    var st = dlg.d.steps[dlg.i], tok = dlg.tok;
    $('chat-opts').innerHTML = '';
    if (!st) return dlgEnd();
    if (st.npc) {
      var typing = document.createElement('div'); typing.className = 'msg msg--npc msg--typing'; typing.setAttribute('aria-label', dlg.d.who + ' печатает'); typing.innerHTML = '<i></i><i></i><i></i>';
      $('chat').appendChild(typing);
      setTimeout(function () {
        if (!dlg || dlg.tok !== tok || !$('chat')) return;
        typing.remove(); bubble('npc', st.npc, st.ru); speak(st.npc); dlg.i++; dlgNext();
      }, reduce ? 0 : 800);
      return;
    }
    dlg.cur = shuffle(st.me); dlg.tries = 0;
    $('chat-opts').innerHTML = '<p class="chat__ask">Что ответишь?</p>' + dlg.cur.map(function (o, j) { return '<button class="opt chat__opt" type="button" data-j="' + j + '"><kbd aria-hidden="true">' + (j + 1) + '</kbd><span lang="en">' + esc(o[0]) + '</span></button>'; }).join('');
    var f = app.querySelector('.chat__opt'); if (f) f.focus({ preventScroll: true });
  }
  function dlgPick(j) {
    if (!dlg || !dlg.cur) return;
    var o = dlg.cur[j], btn = app.querySelector('.chat__opt[data-j="' + j + '"]');
    if (!o || !btn || btn.disabled) return;
    if (o[1]) {
      $('chat-opts').innerHTML = ''; dlg.cur = null;
      bubble('me', o[0]);
      $('chat-coach').innerHTML = '<div class="coach coach--ok">' + lexi('happy') + '<p><b>' + esc(pick(LX.ok)) + '</b> ' + esc(o[2]) + '</p></div>';
      dlg.i++;
      var tok = dlg.tok; setTimeout(function () { if (dlg && dlg.tok === tok) dlgNext(); }, reduce ? 0 : 700);
    } else {
      dlg.tries++; dlg.wrong++; btn.disabled = true; btn.classList.add('is-wrong');
      $('chat-coach').innerHTML = '<div class="coach coach--bad">' + lexi('sad') + '<p><b>Не совсем.</b> ' + esc(o[2]) + '</p></div>';
    }
  }
  function dlgEnd() {
    var d = dlg.d, prev = (P.dialogs || {})[d.id], xp = prev ? 3 : 12;
    P.dialogs = P.dialogs || {}; P.dialogs[d.id] = { at: Date.now(), wrong: prev ? Math.min(prev.wrong, dlg.wrong) : dlg.wrong };
    addXP(xp); save(); xpBump(xp);
    var fresh = checkBadges(); if (fresh.length) toast('Новая награда: ' + fresh[0].n);
    $('chat-coach').innerHTML = '';
    var box = document.createElement('div'); box.className = 'chat__end';
    box.innerHTML = lexiSay('cheer', dlg.wrong ? 'Диалог пройден! Ошибок: ' + dlg.wrong + '. Пройди ещё раз — и будет чисто. +' + xp + ' XP' : 'Ни одной ошибки — ты говоришь как местный! +' + xp + ' XP') +
      '<p class="section-h">Полезные фразы</p><ul class="examples">' + d.phrases.map(function (p) { return '<li>' + speakBtn(p[0]) + '<div><div class="en">' + esc(p[0]) + '</div><div class="ru">' + esc(p[1]) + '</div></div></li>'; }).join('') + '</ul>' +
      '<div class="r-actions"><a class="btn" href="#/dialog/' + d.id + '">' + ic('reset') + 'Ещё раз</a><a class="btn btn--ghost" href="#/practice">Все диалоги</a></div>';
    $('chat').parentNode.appendChild(box);
    dlg.done = true;
  }

  /* ---------- pronunciation: speech recognition where the browser allows it, self-check otherwise ---------- */
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition, spk = null;
  function startSpeak() {
    var vocab = []; openedUnits().forEach(function (id) { vocab = vocab.concat(U[id].unit.vocab); });
    spk = { list: shuffle(vocab.filter(function (v) { return !/[…?!\/]/.test(v[0]); })).slice(0, 8), pos: 0, good: 0, self: !SR, note: SR ? '' : 'Этот браузер не умеет распознавать речь — включена самопроверка. Для проверки микрофоном открой сайт в Chrome.' };
    renderSpeak();
  }
  function renderSpeak() {
    var s = spk, v = s.list[s.pos], pct = s.pos / s.list.length * 100;
    document.body.classList.add('is-practice'); setNav('practice'); app.style.setProperty('--lc', 'var(--accent)');
    app.innerHTML = '<div class="p-top"><a class="icon-btn" href="#/practice" aria-label="Выйти">' + ic('x') + '</a><div class="p-bar"><span style="width:' + pct + '%"></span></div><span class="p-count">' + s.pos + '/' + s.list.length + '</span></div>' +
      '<section class="speak-card"><p class="task__kind">Произношение · скажи слово вслух</p><div class="speak-word"><b lang="en">' + esc(v[0]) + '</b><span>' + esc(v[1]) + '</span><p lang="en">' + esc(v[2]) + '</p></div>' +
      '<div class="speak-btns">' + (canSpeak ? '<button class="btn btn--ghost" type="button" id="sp-hear">' + ic('vol') + 'Послушать</button><button class="btn btn--ghost" type="button" id="sp-slow">' + ic('reset') + 'Медленно</button>' : '') +
      (s.self ? '' : '<button class="btn mic" type="button" id="sp-mic">' + ic('mic') + '<span>Сказать</span></button>') + '</div>' + (s.self ? '' : '<button class="linkbtn" type="button" id="sp-self">Нет микрофона? Включить самопроверку</button>') +
      '<div id="sp-res" class="speak-res" aria-live="polite">' + (s.self ? '<div class="coach coach--ok">' + lexi('think') + '<p>Послушай образец и скажи слово вслух 2–3 раза. Похоже получилось?</p></div><div class="r-actions"><button class="btn btn--ok" type="button" id="sp-yes">' + ic('check') + 'Получилось</button><button class="btn btn--ghost" type="button" id="sp-again">' + ic('reset') + 'Ещё раз послушать</button></div>' : '') + '</div>' +
      (s.note ? '<p class="note">' + ic('alert', 'i--sm') + esc(s.note) + '</p>' : '') + '</section>';
    if ($('sp-hear')) $('sp-hear').addEventListener('click', function () { speak(v[0]); });
    if ($('sp-slow')) $('sp-slow').addEventListener('click', function () { speak(v[0], true); });
    if ($('sp-mic')) $('sp-mic').addEventListener('click', micListen);
    if ($('sp-self')) $('sp-self').addEventListener('click', function () { toSelf('Включена самопроверка: послушай образец и повтори вслух.'); });
    if ($('sp-yes')) $('sp-yes').addEventListener('click', function () { spk.good++; speakNext(); });
    if ($('sp-again')) $('sp-again').addEventListener('click', function () { speak(v[0], true); });
    if (canSpeak) setTimeout(function () { if (spk === s) speak(v[0]); }, 300);
  }
  function micListen() {
    var btn = $('sp-mic'), r;
    try { r = new SR(); } catch (e) { return toSelf('Распознавание речи недоступно в этом браузере — включена самопроверка.'); }
    r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 5;
    btn.classList.add('is-on'); btn.querySelector('span').textContent = 'Слушаю…';
    var alive = false, me = spk, wd = setTimeout(function () { if (!alive && spk === me && $('sp-mic')) { try { r.abort(); } catch (e) { /* ignore */ } toSelf('Микрофон не ответил — включена самопроверка. Проверь, разрешён ли микрофон в браузере.'); } }, 8000);
    r.onstart = r.onaudiostart = function () { alive = true; };
    r.onresult = function (e) { alive = true; clearTimeout(wd); var alts = []; for (var i = 0; i < e.results[0].length; i++) alts.push(e.results[0][i].transcript); judge(alts); };
    r.onerror = function (e) {
      alive = true; clearTimeout(wd);
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed' || e.error === 'audio-capture') toSelf('Нет доступа к микрофону. На claude.ai микрофон недоступен — для проверки голосом открой сайт по обычной ссылке в Chrome. Пока работает самопроверка.');
      else if (e.error === 'network') toSelf('Для распознавания речи нужен интернет. Пока работает самопроверка.');
      else if (e.error === 'no-speech' && $('sp-res')) $('sp-res').innerHTML = '<div class="coach coach--bad">' + lexi('think') + '<p>Ничего не услышал — нажми «Сказать» и произнеси слово погромче.</p></div>';
    };
    r.onend = function () { var b = $('sp-mic'); if (b) { b.classList.remove('is-on'); b.querySelector('span').textContent = 'Сказать'; } };
    try { r.start(); } catch (e) { toSelf('Не удалось включить микрофон — включена самопроверка.'); }
  }
  function similarity(a, b) { a = norm(a); b = norm(b); if (!a || !b) return 0; return 1 - editDist(a, b) / Math.max(a.length, b.length); }
  function judge(alts) {
    if (!spk || !$('sp-res')) return;
    var target = spk.list[spk.pos][0].split(/\s*\/\s*/)[0], best = 0, heard = alts[0] || '';
    alts.forEach(function (a) { var s = similarity(a, target); if (s > best) { best = s; heard = a; } });
    var lvl = best >= .85 ? 'ok' : best >= .6 ? 'mid' : 'bad';
    if (lvl === 'ok' && !spk.scored) { spk.scored = true; spk.good++; }
    $('sp-res').innerHTML = '<div class="coach coach--' + (lvl === 'bad' ? 'bad' : 'ok') + '">' + lexi(lvl === 'ok' ? 'cheer' : lvl === 'mid' ? 'think' : 'sad') + '<p><b>' + (lvl === 'ok' ? 'Отлично! ' : lvl === 'mid' ? 'Почти! ' : 'Не совсем. ') + '</b>Я услышал: «' + esc(heard) + '» · совпадение ' + Math.round(best * 100) + '%' + (lvl === 'ok' ? '' : '. Послушай образец и скажи ещё раз.') + '</p></div>' +
      '<div class="r-actions"><button class="btn" type="button" id="sp-next">' + (spk.pos + 1 < spk.list.length ? 'Дальше' : 'Готово') + ic('arrow') + '</button></div>';
    $('sp-next').addEventListener('click', speakNext);
  }
  function toSelf(note) { if (!spk) return; spk.self = true; spk.note = note; renderSpeak(); }
  function speakNext() { spk.pos++; spk.scored = false; if (spk.pos >= spk.list.length) return speakEnd(); renderSpeak(); }
  function speakEnd() {
    var n = spk.list.length, xp = 4 + spk.good, acc = Math.round(spk.good / n * 100), self = spk.self;
    P.stats.spoken = (P.stats.spoken || 0) + n; addXP(xp); save(); spk = null; document.body.classList.remove('is-practice');
    celebrate({ kind: acc >= 60 ? 'medal' : 'try', title: praise(acc), sub: self ? 'Ты проговорил вслух ' + n + ' слов. Говорить вслух — лучший способ перестать бояться английского.' : 'Чисто произнесено: ' + Math.round(acc / 100 * n) + ' из ' + n + '. Повторяй вслух каждый день — и произношение станет увереннее.', acc: acc, score: Math.round(acc / 100 * n) + '/' + n, xp: xp, li: -1, actions: '<a class="btn" href="#/speak">' + ic('reset') + 'Ещё 8 слов</a><a class="btn btn--ghost" href="#/practice">Практика</a>' });
  }

  paintStats(); route();
  window.__lu = { norm: norm, matches: matches, P: function () { return P; }, task: function () { return cur && S ? cur.item.task : null; }, card: function () { return cardState; }, why: function () { return bookCtl ? bookCtl.state() : null; }, dialog: function () { return dlg && dlg.cur ? dlg.cur.map(function (o) { return !!o[1]; }) : null; }, dialogDone: function () { return !!(dlg && dlg.done); }, speak: function () { return spk ? { pos: spk.pos, n: spk.list.length, self: spk.self } : null; } }; // for tests
})();
