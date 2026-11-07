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
  ['units', 'levels', 'days', 'cards', 'tenses', 'badges', 'texts', 'stats'].forEach(function (k) { if (!P[k] || typeof P[k] !== 'object') P[k] = {}; });
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
    { id: 'fixer', n: 'Работа над ошибками', d: 'Исправь 10 своих ошибок', icon: 'reset', c: '#2563eb', ok: function () { return (P.stats.fixed || 0) >= 10; } }
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
    setNav(nav); app.style.setProperty('--lc', li === undefined || li < 0 ? 'var(--accent)' : lc(li)); app.style.setProperty('--lcd', li === undefined || li < 0 ? '#5b21b6' : 'var(--ld' + (li + 1) + ')');
    app.innerHTML = html; window.scrollTo(0, 0); app.focus({ preventScroll: true });
  }
  function route() {
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
    viewHome();
  }
  function go(h) { if (location.hash === h) route(); else location.hash = h; }
  window.addEventListener('hashchange', route);
  document.addEventListener('click', function (e) {
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
  function viewHome() {
    var nx = nextStep(), done = ORDER.filter(unitDone).length, tx = todayXP();
    var hero;
    if (!nx) hero = { e: 'Курс пройден', t: 'Ты прошёл все уровни!', p: 'Повторяй слова, тренируй времена и пиши тексты — так знания останутся с тобой.', b: '<a class="btn" href="#/tenses">' + ic('clock') + 'Времена</a>' };
    else if (nx.type === 'test') { var lv = BOOK.find(function (l) { return l.id === nx.id; }); hero = { e: 'Финал уровня ' + lv.code, t: 'Тест уровня ' + lv.code, p: 'Все разделы пройдены. Сдай тест на 80%, чтобы открыть следующий уровень.', b: '<a class="btn" href="#/test/' + lv.id + '">' + ic('trophy') + 'Начать тест</a>' }; }
    else { var x = U[nx.id]; hero = { e: (done || unitDoneCount(nx.id) ? 'Продолжай' : 'Твой первый шаг') + ' · ' + x.level.code + ', раздел ' + (x.i + 1), t: x.unit.title + ' — ' + x.unit.en, p: 'Следующий шаг: ' + nx.step.n + ' (' + nx.step.d(x.unit) + ')', b: '<a class="btn" href="#/u/' + nx.id + '/' + nx.step.k + '">' + (done ? 'Продолжить' : 'Начать') + ic('arrow') + '</a>' }; }
    var html = '<section class="card hero"><div class="hero__main"><span class="eyebrow">' + esc(hero.e) + '</span><h1>' + esc(hero.t) + '</h1><p>' + esc(hero.p) + '</p><div class="hero__cta">' + hero.b + '</div></div>' +
      '<div class="hero__goal" aria-label="Цель дня: ' + Math.min(tx, GOAL) + ' из ' + GOAL + ' XP">' + ring(tx, GOAL, 112) + '<div class="hero__goal-txt"><b>' + Math.min(tx, GOAL) + '<small>/' + GOAL + '</small></b><span>' + (tx >= GOAL ? 'цель выполнена' : 'XP сегодня') + '</span></div></div></section>';
    var rv = P.review.length, dc = dueCards().length;
    html += '<div class="quick">' +
      '<a class="qcard" href="#/review" style="--qc:#be123c">' + ic('reset') + '<div><b>Работа над ошибками</b><span>' + (rv ? rv + ' ' + plural(rv, ['задание', 'задания', 'заданий']) + ' ждут' : 'Ошибок нет') + '</span></div></a>' +
      '<a class="qcard" href="#/words" style="--qc:#0f766e">' + ic('list') + '<div><b>Слова на повторение</b><span>' + (dc ? dc + ' ' + plural(dc, ['карточка', 'карточки', 'карточек']) + ' сегодня' : Object.keys(P.cards).length ? 'На сегодня всё повторено' : 'Пройди шаг «Слова»') + '</span></div></a>' +
      '<a class="qcard" href="#/tenses" style="--qc:#7c3aed">' + ic('clock') + '<div><b>Времена</b><span>Освоено ' + tensesMastered() + ' из ' + TENSES.length + '</span></div></a></div>';
    html += '<div class="levels">';
    BOOK.forEach(function (lv, li) {
      var open = levelOpen(li), passed = P.levels[lv.id] && P.levels[lv.id].passed, dcnt = levelUnitsDone(lv);
      html += '<section class="card level' + (open ? '' : ' is-locked') + (passed ? ' is-done' : '') + '" style="--lc:' + lc(li) + '" aria-labelledby="lv-' + lv.id + '">' +
        '<div class="level__head"><span class="level__code">' + lv.code + '</span><div><h2 id="lv-' + lv.id + '">' + esc(lv.name) + ' · ' + esc(lv.ru) + '</h2><p>' + esc(lv.about) + '</p></div><span class="level__pct">' + (passed ? 'сдан' : open ? dcnt + '/' + lv.units.length : ic('lock', 'i--sm')) + '</span></div>' +
        '<div class="level__bar" aria-hidden="true"><span style="width:' + (dcnt / lv.units.length * 100) + '%"></span></div><div class="units">';
      lv.units.forEach(function (u, i) {
        var o = unitOpen(u.id), n = unitDoneCount(u.id), isNext = nx && nx.type === 'unit' && nx.id === u.id;
        html += '<a class="utile' + (o ? '' : ' is-locked') + (isNext ? ' is-next' : '') + (n === 4 ? ' is-done' : '') + '" href="#/u/' + u.id + '" data-locked="' + (o ? '' : '1') + '"' + (o ? '' : ' aria-disabled="true"') + ' aria-label="Раздел ' + (i + 1) + ': ' + esc(u.title) + (o ? ', шагов пройдено ' + n + ' из 4' : ', закрыт') + '">' +
          '<span class="utile__ic">' + ic(o ? u.icon : 'lock') + '</span><span class="utile__n">Раздел ' + (i + 1) + '</span><span class="utile__t">' + esc(u.title) + '</span><span class="utile__en">' + esc(u.en) + '</span>' +
          '<span class="dots" aria-hidden="true">' + STEPS.map(function (s) { return '<i class="' + (stepDone(u.id, s.k) ? 'on' : '') + '"></i>'; }).join('') + '</span></a>';
      });
      var best = P.levels[lv.id] && P.levels[lv.id].best;
      html += '<a class="utile utile--test' + (passed ? ' is-passed' : '') + (open ? '' : ' is-locked') + '" href="#/test/' + lv.id + '" data-locked="' + (open ? '' : '1') + '" data-msg="Сначала сдай тест предыдущего уровня"' + (open ? '' : ' aria-disabled="true"') + '><span class="utile__ic">' + ic(passed ? 'check' : open ? 'trophy' : 'lock') + '</span><span class="utile__n">Тест уровня</span><span class="utile__t">' + (passed ? 'Сдан: ' + best + '%' : open ? (dcnt === lv.units.length ? 'Готов к сдаче' : 'Уже знаешь? Сдай и иди дальше') : 'Откроется позже') + '</span></a></div></section>';
    });
    show(html + '</div>', 'course');
  }

  /* ---------- unit ---------- */
  function unitHead(id, sub) {
    var x = U[id], u = x.unit;
    return '<a class="back" href="#/' + (sub ? 'u/' + id : '') + '">' + ic('left', 'i--sm') + (sub ? 'Раздел «' + esc(u.title) + '»' : 'Курс') + '</a>' +
      '<header class="banner"><span class="banner__ic">' + ic(u.icon) + '</span><div><span class="eyebrow">' + x.level.code + ' · Раздел ' + (x.i + 1) + (sub ? ' · ' + sub : '') + '</span><h1>' + esc(u.title) + '</h1><p>' + esc(u.en) + '</p></div></header>';
  }
  function viewUnit(id) {
    var x = U[id], u = x.unit, open = unitOpen(id);
    var html = unitHead(id) + '<div class="steps">';
    STEPS.forEach(function (s, i) {
      var d = stepDone(id, s.k);
      html += '<a class="step' + (d ? ' is-done' : '') + '" href="#/u/' + id + '/' + s.k + '" data-locked="' + (open ? '' : '1') + '"><span class="step__n">' + (d ? ic('check') : i + 1) + '</span><div><b>' + s.n + '</b><span>' + esc(s.d(u)) + '</span></div>' + ic('right') + '</a>';
    });
    html += '</div>';
    if (!open) html += '<p class="note">' + ic('lock', 'i--sm') + 'Раздел откроется, когда ты пройдёшь предыдущий. Сейчас можно посмотреть, что в нём будет.</p>';
    html += '<p class="section-h">Что ты будешь уметь</p><ul class="goals"><li>' + ic('check', 'i--sm') + 'Понимать и использовать ' + u.vocab.length + ' слов по теме «' + esc(u.title) + '»</li><li>' + ic('check', 'i--sm') + 'Читать текст «' + esc(u.text.title) + '» без словаря</li><li>' + ic('check', 'i--sm') + 'Грамматика: ' + esc(u.grammar.map(function (g) { return G[g].title; }).join(', ')) + '</li><li>' + ic('check', 'i--sm') + esc(u.write.task) + '</li></ul>';
    show(html, 'course', x.li);
  }
  function viewWordsStep(id) {
    var x = U[id], u = x.unit;
    var html = unitHead(id, 'Слова') + '<p class="lead">Прочитай слова вслух вместе с примерами — так они запоминаются в 3 раза лучше, чем списком. Нажми на динамик, чтобы услышать.</p><div class="vcards">' +
      u.vocab.map(function (v) { return '<div class="vcard">' + speakBtn(v[0]) + '<div><b>' + esc(v[0]) + '</b><span class="vcard__ru">' + esc(v[1]) + '</span><p class="vcard__ex">' + esc(v[2]) + '</p><p class="vcard__exru">' + esc(v[3]) + '</p></div></div>'; }).join('') +
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
    if (k === 'text') return begin({ mode: 'step', step: 'text', id: id, li: x.li, queue: u.quiz.map(function (q, i) { return { key: 'q:' + i, task: { t: 'choice', q: q.q, o: q.o, a: q.a, why: q.why } }; }), requeue: true });
    if (k === 'grammar') return begin({ mode: 'step', step: 'grammar', id: id, li: x.li, queue: grammarItems(u.grammar), requeue: true });
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
  var KIND = { choice: 'Выбери правильный вариант', input: 'Впиши ответ', tr: 'Переведи на английский', order: 'Собери предложение', match: 'Соедини слово и перевод' };
  var cur = null;
  function renderTask() {
    var it = S.queue[S.pos], t = it.task; cur = { item: it, sel: -1, tokens: [], checked: false };
    var pct = S.right / S.total * 100;
    var prefix = { test: 'Тест · ', review: 'Ошибки · ', tense: 'Времена · ', wordwrite: 'Слова · ' }[S.mode] || '';
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
    if (t.t === 'choice') {
      app.querySelectorAll('.opt').forEach(function (b) { b.addEventListener('click', function () { if (!cur.checked) pickOpt(+b.dataset.i); }); });
      var first = app.querySelector('.opt'); if (first) first.focus({ preventScroll: true });
    } else if (t.t === 'input' || t.t === 'tr') {
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
    if (t.t === 'choice') return t.o[t.a];
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
    if (t.t === 'choice') { if (cur.sel < 0) return; ok = cur.sel === t.a; }
    else if (t.t === 'input' || t.t === 'tr') { var v = $('ans').value; if (!v.trim()) return; ok = matches(v, t.a); $('ans').readOnly = true; }
    else if (t.t === 'order') { if (!cur.tokens.length) return; ok = norm(cur.tokens.map(function (i) { return cur.bank[i]; }).join(' ')) === norm(t.a); }
    else if (t.t === 'match') { if (cur.done < cur.left.length) return; ok = cur.matchOk; }
    cur.checked = true;
    var key = cur.item.key, first = !(key in S.firstTry);
    if (first) S.firstTry[key] = ok;
    if (t.t === 'choice') app.querySelectorAll('.opt').forEach(function (b) { var i = +b.dataset.i; if (i === t.a) b.classList.add('is-right'); else if (i === cur.sel) b.classList.add('is-wrong'); });
    if (ok || t.t === 'match' || !S.requeue) S.right++;
    if (cur.item.word && P.cards[cur.item.word] && !ok) { P.cards[cur.item.word].box = 1; P.cards[cur.item.word].due = dayKey(1); save(); }
    if (cur.item.word) speak(cur.item.word);
    if (!ok) {
      if (S.mode !== 'review') addReview(cur.item.ref);
      if (first && t.t !== 'match') S.mistakes.push({ q: t.q || t.ru, a: answerText(t) });
      if (S.requeue && t.t !== 'match') S.queue.push(cur.item);
    } else if (S.mode === 'review') {
      P.review = P.review.filter(function (r) { return !(r.l === cur.item.ref.l && r.i === cur.item.ref.i); }); P.stats.fixed = (P.stats.fixed || 0) + 1; save();
    }
    var fb = $('fb');
    fb.className = 'fb ' + (ok ? 'ok' : 'bad');
    fb.innerHTML = '<span class="fb__ic">' + ic(ok ? 'check' : 'x') + '</span><div><b>' + (ok ? pick(['Верно!', 'Отлично!', 'Так держать!', 'Правильно!', 'Красиво!']) : (t.t === 'match' ? 'Почти' : 'Неверно — разберём')) + '</b>' +
      (t.t === 'match' ? '<p class="why">' + (ok ? 'Все пары без ошибок!' : 'Ошибок: ' + cur.wrong + '. Слова вернутся в повторении.') + '</p>' : (!ok ? '<p>Правильно: <span class="ans">' + esc(answerText(t)) + '</span></p>' : '') + (t.why ? '<p class="why">' + esc(t.why) + '</p>' : '')) + '</div>';
    fb.setAttribute('role', 'status');
    var btn = $('check'); btn.disabled = false; btn.textContent = 'Дальше'; btn.className = 'btn ' + (ok ? 'btn--ok' : 'btn--bad'); btn.focus({ preventScroll: true });
    app.querySelector('.p-bar span').style.width = (S.right / S.total * 100) + '%'; app.querySelector('.p-count').textContent = S.right + '/' + S.total;
    if (ok && (t.t === 'tr' || t.t === 'order')) speak(t.t === 'order' ? t.a : t.a[0]);
  }
  function nextTask() { S.pos++; if (S.pos >= S.queue.length) return finish(); renderTask(); }
  function exitPractice() {
    if (S && S.pos > 0 && !confirm('Выйти? Прогресс этого занятия не сохранится.')) return;
    var s = S; S = null;
    go(!s ? '#/' : s.mode === 'step' ? '#/u/' + s.id + '/' + s.step : s.mode === 'review' ? '#/review' : s.mode === 'tense' ? '#/tense/' + s.id : s.mode === 'wordwrite' ? '#/words' : '#/');
  }
  document.addEventListener('keydown', function (e) {
    if (cardState && !S) { if (e.key === ' ' || e.key === 'Enter') { if (!cardState.flipped) { e.preventDefault(); flipCard(); } } else if (cardState.flipped && (e.key === '1' || e.key === '2')) gradeCard(e.key === '2'); return; }
    if (!S || !cur) return;
    var t = cur.item.task;
    if (e.key === 'Enter' && e.target.matches('.opt') && !cur.checked) { e.preventDefault(); var oi = +e.target.dataset.i; if (cur.sel === oi) onMain(); else pickOpt(oi); return; }
    if (e.key === 'Enter' && !e.target.matches('textarea, input, button')) { e.preventDefault(); onMain(); return; }
    if (t.t === 'choice' && !cur.checked && /^[1-4]$/.test(e.key) && +e.key <= t.o.length && !e.target.matches('input, textarea')) pickOpt(+e.key - 1);
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
    var gold = '#f59e0b', g2 = '#fbbf24', v = '#7c3aed', b = '#2563eb';
    if (kind === 'level' || kind === 'unit') return '<svg viewBox="0 0 200 160" class="illo" aria-hidden="true"><circle cx="100" cy="82" r="70" fill="var(--accent-soft)"/><path d="M68 30h64v34a32 32 0 0 1-64 0z" fill="' + gold + '"/><path d="M68 40H50a18 18 0 0 0 18 28M132 40h18a18 18 0 0 1-18 28" fill="none" stroke="' + gold + '" stroke-width="8" stroke-linecap="round"/><rect x="90" y="94" width="20" height="18" fill="' + g2 + '"/><rect x="72" y="112" width="56" height="14" rx="4" fill="' + gold + '"/><path d="M100 40l5 10 11 1.6-8 7.8 2 11-10-5.4-10 5.4 2-11-8-7.8L95 50z" fill="#fff"/><g fill="' + v + '"><circle cx="34" cy="40" r="4"/><circle cx="168" cy="30" r="5"/><circle cx="160" cy="112" r="4"/></g><g fill="' + b + '"><rect x="26" y="96" width="8" height="8" rx="2" transform="rotate(20 30 100)"/><rect x="170" y="70" width="8" height="8" rx="2" transform="rotate(-20 174 74)"/></g></svg>';
    if (kind === 'write') return '<svg viewBox="0 0 200 160" class="illo" aria-hidden="true"><circle cx="100" cy="82" r="70" fill="var(--accent-soft)"/><rect x="56" y="34" width="80" height="100" rx="10" fill="#fff" stroke="' + v + '" stroke-width="4"/><g stroke="#c4b5fd" stroke-width="5" stroke-linecap="round"><path d="M70 58h52M70 74h52M70 90h40M70 106h46"/></g><path d="M150 40l14 14-50 50-18 4 4-18z" fill="' + gold + '" stroke="#b45309" stroke-width="3" stroke-linejoin="round"/><path d="M100 104l4-18 14 14z" fill="#fde68a"/><g fill="' + b + '"><circle cx="40" cy="50" r="4"/><circle cx="168" cy="118" r="5"/></g></svg>';
    if (kind === 'words') return '<svg viewBox="0 0 200 160" class="illo" aria-hidden="true"><circle cx="100" cy="82" r="70" fill="var(--accent-soft)"/><rect x="44" y="50" width="70" height="86" rx="10" fill="' + b + '" transform="rotate(-12 79 93)"/><rect x="66" y="38" width="70" height="86" rx="10" fill="#fff" stroke="' + v + '" stroke-width="4"/><text x="101" y="86" text-anchor="middle" font-family="Inter,sans-serif" font-weight="900" font-size="22" fill="' + v + '">ABC</text><path d="M120 110l10 10 24-26" fill="none" stroke="#10b981" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><g fill="' + gold + '"><circle cx="160" cy="44" r="5"/><circle cx="36" cy="120" r="4"/></g></svg>';
    if (kind === 'try') return '<svg viewBox="0 0 200 160" class="illo" aria-hidden="true"><circle cx="100" cy="82" r="70" fill="var(--accent-soft)"/><path d="M46 128l34-44 22 22 18-30 34 52z" fill="' + b + '"/><path d="M80 84l10 13 12-9z" fill="#fff"/><path d="M120 76l8 12 8-6" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round"/><path d="M120 76V30" stroke="' + v + '" stroke-width="4"/><path d="M120 30h30l-8 10 8 10h-30z" fill="' + gold + '"/></svg>';
    return '<svg viewBox="0 0 200 160" class="illo" aria-hidden="true"><circle cx="100" cy="82" r="70" fill="var(--accent-soft)"/><path d="M76 108 62 146l18-8 10 14 8-34z" fill="#ef4444"/><path d="M124 108l14 38-18-8-10 14-8-34z" fill="' + b + '"/><circle cx="100" cy="78" r="44" fill="' + gold + '"/><circle cx="100" cy="78" r="34" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="4" stroke-dasharray="5 6"/><path d="M100 54l7 15 16 2.3-11.7 11.3 2.8 16L100 91l-14.1 7.6 2.8-16L77 71.3 93 69z" fill="#fff"/><g fill="' + v + '"><circle cx="34" cy="44" r="4"/><circle cx="170" cy="40" r="5"/></g></svg>';
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
    var html = (good ? confetti() : '') + '<section class="card result" aria-labelledby="r-title">' + illo(r.kind || (good ? 'medal' : 'try')) + '<h1 id="r-title">' + esc(r.title) + '</h1><p class="muted">' + esc(r.sub || '') + '</p>' +
      '<div class="r-stats">' + (r.acc !== null && r.acc !== undefined ? '<div class="r-stat"><b>' + r.acc + '%</b><span>точность</span></div><div class="r-stat"><b>' + r.score + '</b><span>с первого раза</span></div>' : '') + '<div class="r-stat gold"><b>+' + r.xp + '</b><span>XP</span></div>' +
      '<div class="r-stat' + (tx >= GOAL ? ' ok' : '') + '"><b>' + Math.min(tx, GOAL) + '/' + GOAL + '</b><span>' + (tx >= GOAL ? 'цель дня ✓' : 'цель дня') + '</span></div></div>';
    if (goalHit) html += '<p class="goal-hit">' + ic('flame') + 'Цель дня выполнена! Серия: ' + streakNow() + ' ' + plural(streakNow(), ['день', 'дня', 'дней']) + ' подряд.</p>';
    if (fresh.length) html += '<div class="new-badges"><p class="section-h">Новая награда</p>' + fresh.map(function (b) { return '<div class="nb">' + medal(b, false, 72) + '<div><b>' + esc(b.n) + '</b><span>' + esc(b.d) + '</span></div></div>'; }).join('') + '</div>';
    if (r.extra) html += r.extra;
    if (r.mistakes && r.mistakes.length) html += '<p class="section-h" style="margin-top:6px">Работа над ошибками</p><ul class="mistakes">' + r.mistakes.map(function (m) { return '<li><div class="q">' + esc(m.q) + '</div><div class="a">' + esc(m.a) + '</div></li>'; }).join('') + '</ul>';
    html += '<p class="quote">' + ic('bulb', 'i--sm') + esc(pick(QUOTES)) + '</p><div class="r-actions">' + (r.actions || '') + '</div></section>';
    show(html, 'course', r.li);
    var b = app.querySelector('.r-actions .btn'); if (b) b.focus({ preventScroll: true });
  }

  /* ---------- review ---------- */
  function viewReview() {
    var n = P.review.length;
    var html = '<header class="page-h"><h1>Работа над ошибками</h1><p>Сюда автоматически попадают задания, в которых ты ошибся. Ответь правильно — и задание уйдёт. Это самая полезная тренировка: она бьёт точно в слабые места.</p></header>';
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
    var html = '<header class="page-h"><h1>Времена</h1><p>Все 13 форм английского глагола — от простых к сложным. На каждой схеме: красная линия — «сейчас», жёлтое — когда происходит действие.</p></header>' +
      '<div class="videos tour"><a class="video" href="https://www.youtube.com/watch?v=FGQPFqqduec" target="_blank" rel="noopener"><span class="video__play">' + ic('play') + '</span><span><b>Обзор: Take a tenses tour' + BBC + '</b><small>6 главных времён за 6 минут · YouTube</small></span></a></div>';
    LEVELS.forEach(function (L) {
      var list = TENSES.filter(function (t) { return t.level === L; }); if (!list.length) return;
      html += '<section class="tgroup" style="--lc:' + lc(LV_I[L]) + '"><h2><span class="level__code sm">' + L + '</span>' + { A1: 'Начальный', A2: 'Элементарный', B1: 'Средний', B2: 'Выше среднего' }[L] + '</h2><div class="tcards">' +
        list.map(function (t) { var b = P.tenses[t.id]; return '<a class="tcard" href="#/tense/' + t.id + '">' + timeline(t.tl) + '<div><b>' + esc(t.name) + '</b><span>' + esc(t.ru) + '</span></div><span class="tcard__score' + (b >= 80 ? ' ok' : '') + '">' + (b === undefined ? 'не начато' : b + '%') + '</span></a>'; }).join('') + '</div></section>';
    });
    show(html, 'tenses');
  }
  function viewTense(id) {
    var t = TN[id], li = LV_I[t.level];
    var html = '<a class="back" href="#/tenses">' + ic('left', 'i--sm') + 'Все времена</a><header class="banner"><span class="banner__ic">' + ic('clock') + '</span><div><span class="eyebrow">Уровень ' + t.level + '</span><h1>' + esc(t.name) + '</h1><p>' + esc(t.ru) + '</p></div></header>' +
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
    var html = '<header class="page-h"><h1>Слова</h1><p>Карточки с интервальным повторением: слово возвращается через 1, 3, 7, 14 и 30 дней — ровно тогда, когда ты начинаешь его забывать. Так слова уходят в долгую память.</p></header>';
    html += '<div class="wstats"><div class="r-stat"><b>' + keys.length + '</b><span>в колоде</span></div><div class="r-stat"><b>' + due + '</b><span>на сегодня</span></div><div class="r-stat gold"><b>' + learned + '</b><span>в памяти</span></div></div>';
    if (!keys.length) html += '<section class="card empty">' + ic('list') + '<p>Колода пустая. Пройди шаг «Слова» в любом разделе — слова появятся здесь.</p><a class="btn" href="#/">К курсу</a></section>';
    else html += '<div class="wactions"><a class="btn' + (due ? '' : ' btn--ghost') + '" href="#/words/cards">' + ic('reset') + (due ? 'Повторить карточки (' + Math.min(due, 20) + ')' : 'Повторить всё равно') + '</a><a class="btn btn--ghost" href="#/words/write">' + ic('pen') + 'Написать по памяти</a></div>';
    var byUnit = {}; keys.forEach(function (k) { var u = P.cards[k].unit; (byUnit[u] = byUnit[u] || []).push(k); });
    var map = {}; allVocab().forEach(function (v) { map[v[0]] = v; });
    ORDER.forEach(function (id) {
      if (!byUnit[id]) return;
      html += '<details class="ref"><summary><span class="code">' + U[id].level.code + '</span>' + esc(U[id].unit.title) + ' <span class="muted" style="font-weight:600">· ' + byUnit[id].length + ' слов</span>' + ic('right') + '</summary><div class="body"><div class="words">' +
        byUnit[id].map(function (k) { var v = map[k] || [k, '']; var bx = P.cards[k].box; return '<div class="word">' + speakBtn(k) + '<div><b>' + esc(k) + '</b><span>' + esc(v[1]) + '</span></div><span class="lvl" title="Уровень запоминания">' + '●'.repeat(Math.min(bx, 5)) + '<i>' + '●'.repeat(5 - Math.min(bx, 5)) + '</i></span></div>'; }).join('') + '</div></div></details>';
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
      '<section class="flash" aria-live="polite"><p class="task__kind">Вспомни перевод, потом переверни карточку</p><button class="fcard" type="button" id="fcard" aria-label="Перевернуть карточку"><span class="fcard__front"><b>' + esc(v[0]) + '</b><span>' + esc(v[2]) + '</span></span><span class="fcard__back"><b>' + esc(v[1]) + '</b><span>' + esc(v[3]) + '</span></span></button>' +
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
    var html = '<header class="page-h"><h1>Грамматика</h1><p>Все правила курса в одном месте — как шпаргалка перед контрольной.</p></header><label class="search">' + ic('search') + '<span class="sr-only">Поиск по грамматике</span><input id="ref-q" type="search" placeholder="Например: was, a/an, will" autocomplete="off"></label><div id="ref-list">';
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
    var html = '<header class="page-h"><h1>Мои награды</h1><p>Твой путь в цифрах. Маленькие шаги каждый день складываются в большой результат.</p></header>' +
      '<div class="wstats"><div class="r-stat gold"><b>' + P.xp + '</b><span>XP всего</span></div><div class="r-stat"><b>' + streakNow() + '</b><span>' + plural(streakNow(), ['день', 'дня', 'дней']) + ' подряд</span></div><div class="r-stat"><b>' + ORDER.filter(unitDone).length + '</b><span>разделов</span></div><div class="r-stat"><b>' + learnedWords() + '</b><span>слов в памяти</span></div><div class="r-stat"><b>' + Object.keys(P.texts).length + '</b><span>текстов</span></div><div class="r-stat"><b>' + tensesMastered() + '/' + TENSES.length + '</b><span>времён</span></div></div>' +
      '<section class="card week"><h2>Неделя</h2><div class="bars">' + days.map(function (d) { var v = P.days[d.k] || 0; return '<div class="bar' + (v >= GOAL ? ' hit' : '') + '"><span class="bar__v">' + v + '</span><span class="bar__col" style="height:' + Math.max(4, v / max * 100) + '%"></span><span class="bar__d">' + wd.format(d.d) + '</span></div>'; }).join('') + '</div><p class="hint">Цель дня — ' + GOAL + ' XP: примерно 15 минут занятий.</p></section>' +
      '<p class="section-h" style="margin:22px 0 12px">Медали · ' + got + ' из ' + BADGES.length + '</p><div class="badges">' +
      BADGES.map(function (b) { var on = !!P.badges[b.id]; return '<div class="badge-card' + (on ? '' : ' is-locked') + '">' + medal(b, !on) + '<b>' + esc(b.n) + '</b><span>' + esc(b.d) + '</span></div>'; }).join('') + '</div>';
    var texts = Object.keys(P.texts);
    if (texts.length) html += '<p class="section-h" style="margin:22px 0 12px">Мои тексты</p>' + texts.map(function (id) { return U[id] ? '<details class="ref"><summary><span class="code">' + U[id].level.code + '</span>' + esc(U[id].unit.title) + ic('right') + '</summary><div class="body"><p class="model__text">' + esc(P.texts[id].text) + '</p><a class="btn btn--ghost btn--sm" href="#/u/' + id + '/write">' + ic('pen') + 'Переписать</a></div></details>' : ''; }).join('');
    show(html, 'me');
  }

  paintStats(); route();
  window.__lu = { norm: norm, matches: matches, P: function () { return P; }, task: function () { return cur && S ? cur.item.task : null; }, card: function () { return cardState; } }; // for tests
})();
