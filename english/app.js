/* LevelUp English — app logic (no frameworks). Progress lives in localStorage. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var app = $('app');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var KEY = 'lu.progress.v1', THEME = 'lu.theme.v1';
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };
  var P = store.get(KEY, null);
  if (!P || typeof P !== 'object') P = {};
  P.lessons = P.lessons || {}; P.levels = P.levels || {}; P.xp = P.xp || 0; P.streak = P.streak || { last: null, count: 0 }; P.review = Array.isArray(P.review) ? P.review : [];
  function save() { store.set(KEY, P); paintStats(); }

  /* ---------- helpers ---------- */
  function ic(n, cls) { return '<svg class="i' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function md(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }
  function gapQ(s) { return esc(s).replace(/_{3,}/g, '<span class="gap" aria-label="пропуск"></span>'); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pad(n) { return String(n).padStart(2, '0'); }
  function today() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function yesterday() { var d = new Date(); d.setDate(d.getDate() - 1); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function plural(n, f) { var a = n % 10, b = n % 100; return a === 1 && b !== 11 ? f[0] : a >= 2 && a <= 4 && (b < 10 || b >= 20) ? f[1] : f[2]; }
  var toastT;
  function toast(t) { var el = $('toast'); el.textContent = t; el.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('is-on'); }, 2400); }

  /* answers: lower case, unify apostrophes, drop punctuation, expand contractions */
  var CONTR = { "i'm": 'i am', "you're": 'you are', "we're": 'we are', "they're": 'they are', "he's": 'he is', "she's": 'she is', "it's": 'it is', "that's": 'that is', "there's": 'there is', "what's": 'what is', "where's": 'where is',
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
    try { speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(text.replace(/\s*\/\s*/g, ', ')); u.lang = voice ? voice.lang : 'en-GB'; if (voice) u.voice = voice; u.rate = slow ? 0.6 : 0.92; speechSynthesis.speak(u); } catch (e) { /* ignore */ }
  }
  function speakBtn(text) { return canSpeak ? '<button class="speak" type="button" data-say="' + esc(text) + '" aria-label="Послушать: ' + esc(text) + '">' + ic('vol') + '</button>' : ''; }
  document.addEventListener('click', function (e) { var b = e.target.closest('[data-say]'); if (b) speak(b.dataset.say, b.dataset.slow === '1'); });

  /* ---------- course index + unlocking ---------- */
  var C = window.COURSE, L = {}, ORDER = [];
  C.forEach(function (lv, li) { lv.lessons.forEach(function (ls, i) { L[ls.id] = { lesson: ls, level: lv, li: li, i: i }; ORDER.push(ls.id); }); });
  function levelOpen(li) { return li === 0 || !!(P.levels[C[li - 1].id] && P.levels[C[li - 1].id].passed); }
  function lessonDone(id) { return !!(P.lessons[id] && P.lessons[id].done); }
  function lessonOpen(id) {
    var x = L[id]; if (!levelOpen(x.li)) return false;
    if (P.levels[x.level.id] && P.levels[x.level.id].passed) return true;
    return x.i === 0 || lessonDone(x.level.lessons[x.i - 1].id);
  }
  function levelDoneCount(lv) { return lv.lessons.filter(function (l) { return lessonDone(l.id); }).length; }
  function nextStep() {
    for (var li = 0; li < C.length; li++) {
      if (!levelOpen(li)) break;
      var lv = C[li], passed = P.levels[lv.id] && P.levels[lv.id].passed;
      for (var i = 0; i < lv.lessons.length; i++) if (!lessonDone(lv.lessons[i].id)) return { type: 'lesson', id: lv.lessons[i].id };
      if (!passed) return { type: 'test', id: lv.id };
    }
    return null;
  }

  /* ---------- header ---------- */
  function streakNow() { var s = P.streak; return s.last === today() || s.last === yesterday() ? s.count : 0; }
  function paintStats() {
    $('st-xp').children[1].textContent = P.xp; $('st-streak').children[1].textContent = streakNow();
    var n = P.review.length; $('rev-badge').hidden = !n; $('rev-badge').textContent = n > 99 ? '99+' : n;
  }
  function bumpStreak() { var t = today(), s = P.streak; if (s.last === t) return; s.count = s.last === yesterday() ? s.count + 1 : 1; s.last = t; }
  var themeSaved = store.get(THEME, null); if (themeSaved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  function isDark() { return document.documentElement.getAttribute('data-theme') === 'dark'; }
  function paintTheme() { var d = isDark(); $('theme').innerHTML = ic(d ? 'sun' : 'moon'); $('theme').setAttribute('aria-label', d ? 'Светлая тема' : 'Тёмная тема'); document.querySelector('meta[name="theme-color"]').content = d ? '#0f0e1a' : '#f5f3ff'; }
  $('theme').addEventListener('click', function () { var d = !isDark(); if (d) document.documentElement.setAttribute('data-theme', 'dark'); else document.documentElement.removeAttribute('data-theme'); store.set(THEME, d ? 'dark' : 'light'); paintTheme(); });
  paintTheme();

  /* ---------- router ---------- */
  var S = null; // running practice session
  function setNav(name) { document.querySelectorAll('[data-nav]').forEach(function (a) { if (a.dataset.nav === name) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); }); }
  function route() {
    var h = location.hash.replace(/^#\/?/, '').split('/');
    document.body.classList.remove('is-practice'); S = null; if (canSpeak) speechSynthesis.cancel();
    if (h[0] === 'lesson' && L[h[1]]) return viewLesson(h[1]);
    if (h[0] === 'learn' && L[h[1]]) return lessonOpen(h[1]) ? startLesson(h[1]) : go('#/');
    if (h[0] === 'test' && C.some(function (l) { return l.id === h[1]; })) return startTest(h[1]);
    if (h[0] === 'review' && h[1] === 'go') return startReview();
    if (h[0] === 'review') return viewReview();
    if (h[0] === 'ref') return viewRef();
    if (h[0] === 'words' && h[1] === 'go') return startWords();
    if (h[0] === 'words') return viewWords();
    viewCourse();
  }
  function go(h) { if (location.hash === h) route(); else location.hash = h; }
  function lc(li) { return 'var(--l' + (li + 1) + ')'; }
  function show(html, nav, li) { setNav(nav); app.style.setProperty('--lc', li === undefined ? 'var(--accent)' : lc(li)); app.style.setProperty('--lcd', li === undefined ? '#6d28d9' : 'var(--ld' + (li + 1) + ')'); app.innerHTML = html; window.scrollTo(0, 0); app.focus({ preventScroll: true }); }
  window.addEventListener('hashchange', route);
  // a link to the page we are already on (e.g. «Ещё раз» after a lesson) should still start it again
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#/"]'); if (!a || e.defaultPrevented || a.dataset.locked === '1') return;
    if (a.getAttribute('href') === location.hash) { e.preventDefault(); route(); }
  });

  /* ---------- course map ---------- */
  function stars(n, cls) { var s = ''; for (var i = 1; i <= 3; i++) s += '<svg class="i ' + (cls || 'i--sm') + (i <= n ? ' on' : '') + '" aria-hidden="true"><use href="#i-star"/></svg>'; return s; }
  function viewCourse() {
    var nx = nextStep(), total = ORDER.length, done = ORDER.filter(lessonDone).length;
    var heroT, heroP, heroBtn;
    if (!nx) { heroT = 'Курс пройден!'; heroP = 'Ты прошёл все уровни. Повторяй ошибки и заглядывай в справочник.'; heroBtn = '<a class="btn" href="#/review">' + ic('reset') + 'Повторение</a>'; }
    else if (nx.type === 'test') { var lv = C.find(function (l) { return l.id === nx.id; }); heroT = 'Тест уровня ' + lv.code; heroP = 'Все уроки пройдены. Сдай тест (80%), чтобы открыть следующий уровень.'; heroBtn = '<a class="btn" href="#/test/' + lv.id + '">' + ic('trophy') + 'Начать тест</a>'; }
    else { var x = L[nx.id]; heroT = x.lesson.title; heroP = 'Уровень ' + x.level.code + ' · урок ' + (x.i + 1) + ' из ' + x.level.lessons.length + ' · ' + x.lesson.short; heroBtn = '<a class="btn" href="#/lesson/' + nx.id + '">' + (done ? 'Продолжить' : 'Начать') + ic('arrow') + '</a>'; }
    var html = '<section class="card hero"><div><span class="eyebrow">' + (done ? 'Продолжай' : 'Твой первый шаг') + '</span><h1>' + esc(heroT) + '</h1><p>' + esc(heroP) + '</p>' +
      '<div class="overall"><span class="meter" aria-hidden="true"><span style="width:' + (done / total * 100) + '%"></span></span><span>' + done + ' из ' + total + ' уроков</span></div></div>' + heroBtn + '</section><div class="levels">';
    C.forEach(function (lv, li) {
      var open = levelOpen(li), passed = P.levels[lv.id] && P.levels[lv.id].passed, dc = levelDoneCount(lv);
      html += '<section class="card level' + (open ? '' : ' is-locked') + (passed ? ' is-done' : '') + '" style="--lc:' + lc(li) + '" aria-labelledby="lv-' + lv.id + '"><div class="level__head"><span class="level__code">' + lv.code + '</span><div><h2 id="lv-' + lv.id + '">' + esc(lv.name) + '</h2><p>' + esc(lv.about) + '</p></div><span class="level__pct">' + (passed ? 'сдан' : open ? dc + '/' + lv.lessons.length : ic('lock', 'i--sm')) + '</span></div><div class="level__bar" aria-hidden="true"><span style="width:' + (dc / lv.lessons.length * 100) + '%"></span></div><div class="lessons">';
      lv.lessons.forEach(function (ls, i) {
        var o = lessonOpen(ls.id), d = P.lessons[ls.id], isNext = nx && nx.type === 'lesson' && nx.id === ls.id;
        var label = 'Урок ' + (i + 1) + ': ' + ls.title + (o ? (d && d.done ? ', пройден, звёзд: ' + d.stars : '') : ', закрыт');
        html += '<a class="tile' + (o ? '' : ' is-locked') + (isNext ? ' is-next' : '') + '" href="' + (o ? '#/lesson/' + ls.id : '#/') + '" data-locked="' + (o ? '' : '1') + '" aria-label="' + esc(label) + '"' + (o ? '' : ' aria-disabled="true"') + '>' +
          '<span class="tile__n">УРОК ' + (i + 1) + '</span><span class="tile__t">' + esc(ls.title) + '</span><span class="tile__s">' + (o ? stars(d ? d.stars : 0) : ic('lock', 'i--sm')) + '</span></a>';
      });
      var tOpen = open, best = P.levels[lv.id] && P.levels[lv.id].best;
      html += '<a class="tile tile--test' + (passed ? ' is-passed' : '') + (tOpen ? '' : ' is-locked') + '" href="' + (tOpen ? '#/test/' + lv.id : '#/') + '" data-locked="' + (tOpen ? '' : '1') + '"' + (tOpen ? '' : ' aria-disabled="true"') + '>' +
        '<span class="tile__n">ТЕСТ УРОВНЯ</span><span class="tile__t">' + (passed ? 'Сдан: ' + best + '%' : tOpen ? (dc === lv.lessons.length ? 'Готов к сдаче' : 'Уже знаешь? Сдай и иди дальше') : 'Откроется позже') + '</span><span class="tile__s">' + ic(passed ? 'check' : tOpen ? 'trophy' : 'lock', 'i--sm') + '</span></a></div></section>';
    });
    show(html + '</div>', 'course');
    app.querySelectorAll('[data-locked="1"]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); toast(a.classList.contains('tile--test') ? 'Сначала сдай тест предыдущего уровня' : 'Сначала пройди предыдущий урок'); }); });
  }

  /* ---------- lesson theory ---------- */
  function theoryHTML(ls) {
    var h = '';
    ls.rules.forEach(function (r) { h += '<div class="rule"><h3>' + esc(r.h) + '</h3><p>' + md(r.t) + '</p></div>'; });
    h += '<div class="formula">' + ic('bulb') + '<span>' + esc(ls.formula) + '</span></div>';
    h += '<p class="section-h">Примеры</p><ul class="examples">' + ls.ex.map(function (e) { return '<li>' + speakBtn(e[0]) + '<div><div class="en">' + esc(e[0]) + '</div><div class="ru">' + esc(e[1]) + '</div></div></li>'; }).join('') + '</ul>';
    h += '<div class="tip">' + ic('bulb') + '<p>' + md(ls.tip) + '</p></div>';
    return h;
  }
  function viewLesson(id) {
    var x = L[id], ls = x.lesson, open = lessonOpen(id), d = P.lessons[id];
    var html = '<a class="back" href="#/">' + ic('left', 'i--sm') + 'Курс</a><header class="lesson-head"><span class="eyebrow">Уровень ' + x.level.code + ' · урок ' + (x.i + 1) + '</span><h1>' + esc(ls.title) + '</h1><p>' + esc(ls.short) + '</p></header>' +
      '<section class="card theory" aria-label="Теория">' + theoryHTML(ls) + '</section>' +
      videosHTML(ls) +
      '<p class="section-h" style="margin:22px 0 10px">Слова урока</p><div class="vocab">' + ls.vocab.map(function (v) { return '<div class="word">' + speakBtn(v[0]) + '<div><b>' + esc(v[0]) + '</b><span>' + esc(v[1]) + '</span></div></div>'; }).join('') + '</div>' +
      '<div class="start-bar"' + (open ? '' : ' style="position:static"') + '>' + (open ? '<a class="btn" href="#/learn/' + id + '">' + ic('play') + (d && d.done ? 'Пройти ещё раз' : 'Начать практику') + '</a>' : '<span class="btn" aria-disabled="true" style="opacity:.5">' + ic('lock') + 'Сначала пройди предыдущий урок</span>') + '</div>';
    show(html, 'course', x.li);
  }
  function videosHTML(ls) {
    var yt = 'https://www.youtube.com/', h = '<p class="section-h" style="margin:22px 0 10px">Видео по теме</p><div class="videos">';
    ls.videos.forEach(function (v) { h += '<a class="video" href="' + yt + 'watch?v=' + encodeURIComponent(v[1]) + '" target="_blank" rel="noopener"><span class="video__play">' + ic('play') + '</span><span><b>' + esc(v[0]) + '</b><small>YouTube · на английском, можно включить субтитры</small></span></a>'; });
    h += '<a class="video video--search" href="' + yt + 'results?search_query=' + encodeURIComponent(ls.yt + ' English grammar') + '" target="_blank" rel="noopener"><span class="video__play">' + ic('search') + '</span><span><b>Ещё видео на английском</b><small>Поиск на YouTube: ' + esc(ls.yt) + '</small></span></a>';
    h += '<a class="video video--search" href="' + yt + 'results?search_query=' + encodeURIComponent(ls.yt + ' английский объяснение на русском') + '" target="_blank" rel="noopener"><span class="video__play">' + ic('search') + '</span><span><b>Объяснение на русском</b><small>Поиск на YouTube</small></span></a>';
    return h + '</div>';
  }

  /* ---------- practice sessions ---------- */
  function itemsForLesson(id, withExtras) {
    var ls = L[id].lesson, items = ls.tasks.map(function (t, i) { return { key: id + ':' + i, lesson: id, idx: i, task: t }; });
    if (!withExtras) return items;
    var pairs = shuffle(ls.vocab).slice(0, 5);
    items.unshift({ key: id + ':match', lesson: id, idx: 'match', task: { t: 'match', pairs: pairs } });
    if (canSpeak) {
      var exs = shuffle(ls.ex).slice(0, 3), a = Math.floor(Math.random() * exs.length);
      items.splice(4, 0, { key: id + ':listen', lesson: id, idx: 'listen', task: { t: 'listen', say: exs[a][0], o: exs.map(function (e) { return e[0]; }), a: a } });
    }
    return items;
  }
  function begin(s) { S = s; S.pos = 0; S.firstTry = {}; S.mistakes = []; S.total = S.queue.length; S.right = 0; document.body.classList.add('is-practice'); setNav(s.mode === 'review' ? 'review' : s.mode === 'words' ? 'words' : 'course');
    var li = s.mode === 'lesson' ? L[s.id].li : s.mode === 'test' ? C.findIndex(function (l) { return l.id === s.id; }) : -1;
    app.style.setProperty('--lc', li >= 0 ? lc(li) : 'var(--accent)'); renderTask(); }
  function startLesson(id) { begin({ mode: 'lesson', id: id, queue: itemsForLesson(id, true), requeue: true }); }
  function startTest(lvId) {
    var lv = C.find(function (l) { return l.id === lvId; }), li = C.indexOf(lv);
    if (!levelOpen(li)) return go('#/');
    var all = []; lv.lessons.forEach(function (ls) { all = all.concat(itemsForLesson(ls.id, false)); });
    begin({ mode: 'test', id: lvId, queue: shuffle(all).slice(0, 15), requeue: false });
  }
  function startReview() {
    var items = P.review.filter(function (r) { return L[r.l] && L[r.l].lesson.tasks[r.i]; }).slice(0, 10).map(function (r) { return { key: r.l + ':' + r.i, lesson: r.l, idx: r.i, task: L[r.l].lesson.tasks[r.i] }; });
    if (!items.length) return go('#/review');
    begin({ mode: 'review', queue: shuffle(items), requeue: true });
  }
  /* word trainer: 10 words, trouble words first, three question types */
  P.words = P.words || {};
  function allWords() { var a = []; C.forEach(function (lv) { lv.lessons.forEach(function (ls) { ls.vocab.forEach(function (v) { a.push({ en: v[0], ru: v[1], lesson: ls.id }); }); }); }); return a; }
  function wordPool() { var all = allWords(), learned = all.filter(function (w) { return lessonDone(w.lesson); }); return learned.length >= 8 ? learned : all.slice(0, Math.max(16, learned.length)); }
  function troubleCount() { return Object.keys(P.words).filter(function (k) { return P.words[k] > 0; }).length; }
  function startWords() {
    var pool = wordPool(), all = allWords();
    var pick = shuffle(pool).sort(function (a, b) { return (P.words[b.en] || 0) - (P.words[a.en] || 0); }).slice(0, 10);
    var items = pick.map(function (w, i) {
      var kind = i % 3, others = shuffle(all.filter(function (x) { return x.en !== w.en && x.ru !== w.ru; })).slice(0, 3), t;
      var typeable = !/[…?!]/.test(w.en);
      if (kind === 2 && typeable) t = { t: 'input', q: '«' + w.ru + '» по-английски: ___', a: w.en.split(/\s*\/\s*/).concat([w.en]), why: w.en + ' — ' + w.ru };
      else if (kind === 1) { var o = shuffle([w].concat(others)); t = { t: 'choice', q: 'Как по-английски «' + w.ru + '»?', o: o.map(function (x) { return x.en; }), a: o.indexOf(w), why: w.en + ' — ' + w.ru }; }
      else { var o2 = shuffle([w].concat(others)); t = { t: 'choice', q: 'Как переводится «' + w.en + '»?', o: o2.map(function (x) { return x.ru; }), a: o2.indexOf(w), why: w.en + ' — ' + w.ru }; }
      return { key: 'w:' + w.en + ':' + kind, lesson: w.lesson, idx: 'word', word: w.en, task: t };
    });
    begin({ mode: 'words', queue: items, requeue: true });
  }
  var KIND = { choice: 'Выбери правильный вариант', input: 'Впиши пропущенное', tr: 'Переведи на английский', order: 'Собери предложение', match: 'Соедини слово и перевод', listen: 'Послушай и выбери, что прозвучало' };
  var cur = null; // {item, sel, tokens, checked}
  function renderTask() {
    var it = S.queue[S.pos], t = it.task; cur = { item: it, sel: -1, tokens: [], checked: false };
    var pct = S.right / S.total * 100;
    var head = '<div class="p-top"><button class="icon-btn" type="button" id="p-exit" aria-label="Выйти из урока">' + ic('x') + '</button><div class="p-bar" role="progressbar" aria-label="Прогресс" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(pct) + '"><span style="width:' + pct + '%"></span></div><span class="p-count">' + S.right + '/' + S.total + '</span></div>';
    var body = '<section class="task" aria-labelledby="task-kind"><p class="task__kind" id="task-kind">' + (S.mode === 'test' ? 'Тест · ' : S.mode === 'review' ? 'Повторение · ' : S.mode === 'words' ? 'Слова · ' : '') + KIND[t.t] + '</p>';
    if (t.t === 'choice' || t.t === 'listen') {
      if (t.t === 'choice') body += '<h2 class="task__q">' + gapQ(t.q) + '</h2>';
      else body += '<div class="listen"><button class="big" type="button" data-say="' + esc(t.say) + '" aria-label="Прослушать ещё раз">' + ic('vol') + '</button><button class="btn btn--ghost btn--sm slow" type="button" data-say="' + esc(t.say) + '" data-slow="1">Медленнее</button></div>';
      body += '<div class="options" role="radiogroup" aria-labelledby="task-kind">' + t.o.map(function (o, i) { return '<button class="opt" type="button" role="radio" aria-checked="false" data-i="' + i + '"><kbd aria-hidden="true">' + (i + 1) + '</kbd><span>' + esc(o) + '</span></button>'; }).join('') + '</div>';
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
    var actions = '<div class="p-actions" id="p-actions"><div id="fb"></div><div class="p-actions__in"><button class="btn" type="button" id="check" disabled>Проверить</button></div></div>';
    app.innerHTML = head + body + actions; window.scrollTo(0, 0);
    $('p-exit').addEventListener('click', exitPractice);
    $('check').addEventListener('click', onMain);
    wireTask(t);
    if (t.t === 'listen') setTimeout(function () { speak(t.say); }, 350);
  }
  function wireTask(t) {
    var chk = $('check');
    if (t.t === 'choice' || t.t === 'listen') {
      app.querySelectorAll('.opt').forEach(function (b) { b.addEventListener('click', function () { if (cur.checked) return; pickOpt(+b.dataset.i); }); });
      var first = app.querySelector('.opt'); if (first && t.t === 'choice') first.focus({ preventScroll: true });
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
    if (t.t === 'choice' || t.t === 'listen') return t.o[t.a];
    if (t.t === 'order') return t.a;
    if (t.t === 'tr') return t.a[0] + (/[?]$/.test(t.a[0]) ? '' : /^(what|where|when|who|why|how|do|does|did|is|are|was|were|can|could|have|has|will|would)\b/i.test(t.a[0]) ? '?' : '.');
    if (t.t === 'input') return t.a[0];
    return '';
  }
  function onMain() {
    if (!S) return;
    if (cur.checked) return nextTask();
    var t = cur.item.task, ok;
    if (t.t === 'choice' || t.t === 'listen') { if (cur.sel < 0) return; ok = cur.sel === t.a; }
    else if (t.t === 'input' || t.t === 'tr') { var v = $('ans').value; if (!v.trim()) return; ok = matches(v, t.a); $('ans').readOnly = true; }
    else if (t.t === 'order') { if (!cur.tokens.length) return; ok = norm(cur.tokens.map(function (i) { return cur.bank[i]; }).join(' ')) === norm(t.a); }
    else if (t.t === 'match') { if (cur.done < cur.left.length) return; ok = cur.matchOk; }
    cur.checked = true;
    var key = cur.item.key, first = !(key in S.firstTry);
    if (first) S.firstTry[key] = ok;
    if (t.t === 'choice' || t.t === 'listen') app.querySelectorAll('.opt').forEach(function (b) { var i = +b.dataset.i; if (i === t.a) b.classList.add('is-right'); else if (i === cur.sel) b.classList.add('is-wrong'); });
    if (cur.item.word) { var wk = cur.item.word; if (!ok) P.words[wk] = (P.words[wk] || 0) + 1; else if (first && P.words[wk]) P.words[wk]--; if (!P.words[wk]) delete P.words[wk]; save(); speak(wk); }
    if (ok || t.t === 'match' || !S.requeue) S.right++;
    if (!ok) {
      if (typeof cur.item.idx === 'number' && S.mode !== 'review') addReview(cur.item.lesson, cur.item.idx);
      if (first && t.t !== 'match') S.mistakes.push({ q: t.q || t.ru || 'Аудио', a: answerText(t) });
      if (S.requeue && t.t !== 'match') S.queue.push(cur.item);
    } else if (S.mode === 'review') {
      P.review = P.review.filter(function (r) { return !(r.l === cur.item.lesson && r.i === cur.item.idx); }); save();
    }
    var fb = $('fb'), msg;
    if (t.t === 'match') msg = ok ? 'Все пары без ошибок!' : 'Готово. Ошибок: ' + cur.wrong;
    fb.className = 'fb ' + (ok ? 'ok' : 'bad');
    fb.innerHTML = '<span class="fb__ic">' + ic(ok ? 'check' : 'x') + '</span><div><b>' + (ok ? ['Верно!', 'Отлично!', 'Так держать!', 'Правильно!'][Math.floor(Math.random() * 4)] : (t.t === 'match' ? 'Почти' : 'Неверно')) + '</b>' +
      (t.t === 'match' ? '<p class="why">' + msg + '</p>' : (!ok ? '<p>Правильно: <span class="ans">' + esc(answerText(t)) + '</span></p>' : '') + (t.why ? '<p class="why">' + esc(t.why) + '</p>' : '')) + '</div>';
    fb.setAttribute('role', 'status');
    var btn = $('check'); btn.disabled = false; btn.textContent = 'Дальше'; btn.className = 'btn ' + (ok ? 'btn--ok' : 'btn--bad'); btn.focus({ preventScroll: true });
    var bar = app.querySelector('.p-bar span'); bar.style.width = (S.right / S.total * 100) + '%'; app.querySelector('.p-count').textContent = S.right + '/' + S.total;
    if (ok && (t.t === 'tr' || t.t === 'order')) speak(t.t === 'order' ? t.a : t.a[0]);
  }
  function nextTask() { S.pos++; if (S.pos >= S.queue.length) return finish(); renderTask(); }
  function addReview(l, i) { if (!P.review.some(function (r) { return r.l === l && r.i === i; })) { P.review.push({ l: l, i: i, at: Date.now() }); save(); } }
  function exitPractice() {
    if (S && S.pos > 0 && !confirm('Выйти? Прогресс этого занятия не сохранится.')) return;
    var dest = S && S.mode === 'lesson' ? '#/lesson/' + S.id : S && S.mode === 'review' ? '#/review' : S && S.mode === 'words' ? '#/words' : '#/';
    S = null; go(dest);
  }
  document.addEventListener('keydown', function (e) {
    if (!S || !cur) return;
    var t = cur.item.task;
    if (e.key === 'Enter' && e.target.matches('.opt') && !cur.checked) { e.preventDefault(); var oi = +e.target.dataset.i; if (cur.sel === oi) onMain(); else pickOpt(oi); return; }
    if (e.key === 'Enter' && !e.target.matches('textarea, input, button')) { e.preventDefault(); onMain(); return; }
    if ((t.t === 'choice' || t.t === 'listen') && !cur.checked && /^[1-4]$/.test(e.key) && +e.key <= t.o.length && !e.target.matches('input, textarea')) pickOpt(+e.key - 1);
    if (e.key === 'Escape') exitPractice();
  });

  /* ---------- results ---------- */
  function finish() {
    var s = S, keys = Object.keys(s.firstTry), firstOk = keys.filter(function (k) { return s.firstTry[k]; }).length;
    var acc = keys.length ? Math.round(firstOk / keys.length * 100) : 0, xp = 0, title, sub, starsN = 0, actions = '';
    bumpStreak();
    if (s.mode === 'lesson') {
      starsN = acc >= 95 ? 3 : acc >= 80 ? 2 : 1;
      var prev = P.lessons[s.id] || {}, firstTime = !prev.done;
      xp = (firstTime ? 10 : 5) + firstOk * (firstTime ? 2 : 1);
      P.lessons[s.id] = { done: true, stars: Math.max(prev.stars || 0, starsN), best: Math.max(prev.best || 0, acc), at: Date.now() };
      title = starsN === 3 ? 'Идеально!' : starsN === 2 ? 'Отличная работа!' : 'Урок пройден!';
      sub = L[s.id].lesson.title;
      var nx = nextStep();
      actions = (nx ? '<a class="btn" href="' + (nx.type === 'test' ? '#/test/' + nx.id : '#/lesson/' + nx.id) + '">' + (nx.type === 'test' ? ic('trophy') + 'Тест уровня' : 'Следующий урок' + ic('arrow')) + '</a>' : '') +
        '<a class="btn btn--ghost" href="#/learn/' + s.id + '">' + ic('reset') + 'Ещё раз</a>';
    } else if (s.mode === 'test') {
      var lv = C.find(function (l) { return l.id === s.id; }), li = C.indexOf(lv), passed = acc >= 80, prevT = P.levels[lv.id] || {};
      starsN = acc >= 95 ? 3 : acc >= 80 ? 2 : acc >= 50 ? 1 : 0;
      if (passed && !prevT.passed) xp = 50;
      P.levels[lv.id] = { passed: !!(prevT.passed || passed), best: Math.max(prevT.best || 0, acc) };
      title = passed ? 'Уровень ' + lv.code + ' сдан!' : 'Пока не сдано';
      sub = passed ? (C[li + 1] ? 'Открыт уровень ' + C[li + 1].code + ' — ' + C[li + 1].name : 'Это был последний уровень. Ты молодец!') : 'Нужно 80% правильных ответов. Ошибки добавлены в «Повторение».';
      actions = passed && C[li + 1] ? '<a class="btn" href="#/lesson/' + C[li + 1].lessons[0].id + '">Дальше: ' + C[li + 1].code + ic('arrow') + '</a>' : '<a class="btn" href="#/test/' + lv.id + '">' + ic('reset') + 'Пересдать</a>';
      actions += '<a class="btn btn--ghost" href="#/">К курсу</a>';
    } else if (s.mode === 'words') {
      xp = firstOk; starsN = acc >= 95 ? 3 : acc >= 80 ? 2 : 1; title = acc >= 80 ? 'Слова повторены!' : 'Хорошая тренировка';
      var tc = troubleCount(); sub = tc ? 'Трудных слов: ' + tc + '. Они попадутся снова в следующей тренировке.' : 'Трудных слов нет — отлично!';
      actions = '<a class="btn" href="#/words/go">' + ic('reset') + 'Ещё 10 слов</a><a class="btn btn--ghost" href="#/words">Словарь</a>';
    } else {
      xp = firstOk * 2; title = 'Повторение готово'; sub = P.review.length ? 'Осталось ошибок: ' + P.review.length : 'Все ошибки исправлены!'; starsN = acc >= 95 ? 3 : acc >= 80 ? 2 : 1;
      actions = (P.review.length ? '<a class="btn" href="#/review/go">' + ic('reset') + 'Ещё повторение</a>' : '') + '<a class="btn btn--ghost" href="#/">К курсу</a>';
    }
    P.xp += xp; save();
    S = null; document.body.classList.remove('is-practice');
    var html = '<section class="card result" aria-labelledby="r-title"><div class="stars" aria-label="Звёзд: ' + starsN + ' из 3">' + stars(starsN, 'i--lg') + '</div><h1 id="r-title">' + esc(title) + '</h1><p class="muted">' + esc(sub) + '</p>' +
      '<div class="r-stats"><div class="r-stat"><b>' + acc + '%</b><span>точность</span></div><div class="r-stat"><b>' + firstOk + '/' + keys.length + '</b><span>с первого раза</span></div><div class="r-stat gold"><b>+' + xp + '</b><span>XP</span></div></div>';
    if (s.mistakes.length) html += '<p class="section-h" style="margin-top:8px">Работа над ошибками</p><ul class="mistakes">' + s.mistakes.map(function (m) { return '<li><div class="q">' + esc(m.q) + '</div><div class="a">' + esc(m.a) + '</div></li>'; }).join('') + '</ul>';
    html += '<div class="r-actions">' + actions + '</div></section>';
    show(html, s.mode === 'review' ? 'review' : s.mode === 'words' ? 'words' : 'course', s.mode === 'lesson' ? L[s.id].li : s.mode === 'test' ? C.findIndex(function (l) { return l.id === s.id; }) : undefined);
    var b = app.querySelector('.r-actions .btn'); if (b) b.focus({ preventScroll: true });
  }

  /* ---------- review ---------- */
  function viewReview() {
    var n = P.review.length;
    var html = '<header class="page-h"><h1>Повторение</h1><p>Сюда попадают задания, в которых ты ошибся. Ответь правильно — и задание уйдёт из списка.</p></header>' + trainerCard();
    if (!n) html += '<section class="card empty" style="margin-top:18px">' + ic('check') + '<p>Ошибок для повторения нет. Отлично!</p><a class="btn btn--ghost" href="#/">К курсу</a></section>';
    else {
      html += '<section class="card" style="margin-top:18px;display:grid;gap:14px"><p><b style="font-size:28px">' + n + '</b> ' + plural(n, ['задание ждёт', 'задания ждут', 'заданий ждут']) + ' повторения.</p><a class="btn" href="#/review/go">' + ic('play') + 'Начать (до 10 заданий)</a></section>';
      var by = {}; P.review.forEach(function (r) { if (L[r.l]) by[r.l] = (by[r.l] || 0) + 1; });
      html += '<p class="section-h" style="margin:22px 0 10px">Где ошибки</p><div class="words">' + Object.keys(by).map(function (id) { return '<a class="word" href="#/lesson/' + id + '" style="text-decoration:none;color:inherit"><div><b>' + esc(L[id].lesson.title) + '</b><span>' + L[id].level.code + ' · ' + by[id] + ' ' + plural(by[id], ['ошибка', 'ошибки', 'ошибок']) + '</span></div></a>'; }).join('') + '</div>';
    }
    show(html, 'review');
  }

  function trainerCard() {
    var tc = troubleCount();
    return '<section class="card trainer" style="margin-top:18px"><div><h2>Тренировка слов</h2><p>10 слов за пару минут: перевод туда и обратно и написание. ' + (tc ? 'Трудных слов: ' + tc + ' — они будут первыми.' : 'Слова из пройденных уроков.') + '</p></div><a class="btn" href="#/words/go">' + ic('play') + 'Тренировать</a></section>';
  }

  /* ---------- reference ---------- */
  function viewRef() {
    var html = '<header class="page-h"><h1>Справочник</h1><p>Вся грамматика курса в одном месте — коротко и по делу.</p></header><label class="search">' + ic('search') + '<span class="sr-only">Поиск по справочнику</span><input id="ref-q" type="search" placeholder="Например: was, a/an, will" autocomplete="off"></label><div id="ref-list">';
    C.forEach(function (lv) { lv.lessons.forEach(function (ls) {
      var text = (ls.title + ' ' + ls.short + ' ' + ls.formula + ' ' + ls.rules.map(function (r) { return r.h + ' ' + r.t; }).join(' ') + ' ' + ls.ex.map(function (e) { return e.join(' '); }).join(' ')).toLowerCase();
      html += '<details class="ref" data-text="' + esc(text) + '"><summary><span class="code">' + lv.code + '</span>' + esc(ls.title) + ic('right') + '</summary><div class="body">' + theoryHTML(ls) + '</div></details>';
    }); });
    show(html + '</div><p class="empty" id="ref-empty" hidden>Ничего не найдено.</p>', 'ref');
    $('ref-q').addEventListener('input', function () {
      var q = this.value.trim().toLowerCase(), any = false;
      app.querySelectorAll('details.ref').forEach(function (d) { var hit = !q || d.dataset.text.indexOf(q) >= 0; d.hidden = !hit; if (hit) any = true; d.open = !!q && hit; });
      $('ref-empty').hidden = any;
    });
  }

  /* ---------- words ---------- */
  function viewWords() {
    var all = []; C.forEach(function (lv) { lv.lessons.forEach(function (ls) { ls.vocab.forEach(function (v) { all.push({ en: v[0], ru: v[1], lv: lv.code, learned: lessonDone(ls.id) }); }); }); });
    var learned = all.filter(function (w) { return w.learned; }).length;
    var html = trainerCard() + '<header class="page-h" style="margin-top:22px"><h1>Словарь</h1><p>' + all.length + ' слов и фраз курса · выучено в уроках: ' + learned + '. Нажми на динамик, чтобы услышать произношение.</p></header><label class="search">' + ic('search') + '<span class="sr-only">Поиск слова</span><input id="w-q" type="search" placeholder="Слово по-английски или по-русски" autocomplete="off"></label><div class="words" id="w-list">' +
      all.map(function (w) { return '<div class="word' + (w.learned ? '' : ' is-new') + '" data-text="' + esc((w.en + ' ' + w.ru).toLowerCase()) + '">' + speakBtn(w.en) + '<div><b>' + esc(w.en) + '</b><span>' + esc(w.ru) + ' · ' + w.lv + '</span></div></div>'; }).join('') + '</div><p class="empty" id="w-empty" hidden>Ничего не найдено.</p>';
    show(html, 'words');
    $('w-q').addEventListener('input', function () {
      var q = this.value.trim().toLowerCase(), any = false;
      app.querySelectorAll('#w-list .word').forEach(function (d) { var hit = !q || d.dataset.text.indexOf(q) >= 0; d.hidden = !hit; if (hit) any = true; });
      $('w-empty').hidden = any;
    });
  }

  paintStats(); route();
  window.__lu = { norm: norm, matches: matches, P: function () { return P; }, task: function () { return cur && S ? cur.item.task : null; } }; // for tests
})();
