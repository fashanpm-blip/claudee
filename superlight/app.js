/* Superlight 2 review — interactions. Vanilla JS, no dependencies. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var fmt = function (n, digits) {
    return n.toLocaleString('uk-UA', { minimumFractionDigits: digits || 0, maximumFractionDigits: digits || 0 }).replace(/ | /g, ' ');
  };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };

  /* ---------------- mobile menu ---------------- */
  var menuBtn = $('#menu-btn'), menu = $('#mobile-menu');
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
    menuBtn.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
    document.body.classList.toggle('no-scroll', open);
  }
  menuBtn.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
  });
  window.matchMedia('(min-width: 960px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });

  /* ---------------- header, progress, back to top, active nav ---------------- */
  var header = $('#header'), progress = $('.progress'), toTop = $('#to-top'), ticking = false;
  function onScroll() {
    var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('is-scrolled', y > 10);
    progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    toTop.classList.toggle('is-visible', y > 900);
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    $('.brand').focus({ preventScroll: true });
  });

  var navLinks = $$('.nav a');
  if ('IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + en.target.id;
          a.classList.toggle('is-active', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) { var s = $(a.getAttribute('href')); if (s) secObs.observe(s); });
  }

  /* ---------------- reveal + counters ---------------- */
  function runCounter(el) {
    var end = +el.dataset.count;
    if (reduceMotion.matches) { el.textContent = fmt(end); return; }
    var start = performance.now(), dur = 1500;
    (function step(now) {
      var t = Math.min(1, (now - start) / dur);
      el.textContent = fmt(Math.round(end * (1 - Math.pow(1 - t, 4))));
      if (t < 1) requestAnimationFrame(step);
    })(start);
  }
  function initReveal() {
    var els = $$('[data-reveal]'), counters = $$('[data-count]');
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('is-in'); }); return; }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); obs.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { obs.observe(el); });
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { runCounter(en.target); cObs.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cObs.observe(el); });
  }

  /* ---------------- hero tilt + card spotlight ---------------- */
  function initPointerFx() {
    var visual = $('.hero__visual'), photo = $('#hero-photo');
    visual.addEventListener('pointermove', function (e) {
      if (!finePointer.matches || reduceMotion.matches) return;
      var r = visual.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      photo.style.transform = 'rotateY(' + (x * 22) + 'deg) rotateX(' + (-y * 18) + 'deg) rotateZ(' + (x * 5) + 'deg)';
    });
    visual.addEventListener('pointerleave', function () { photo.style.transform = ''; });
    $$('.spec').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------------- anatomy hotspots ---------------- */
  function initAnatomy() {
    var spots = $$('.hotspot'), parts = $$('.part');
    function select(i, fromSpot) {
      spots.forEach(function (s) { s.setAttribute('aria-pressed', String(+s.dataset.part === i)); });
      parts.forEach(function (p) { p.setAttribute('aria-expanded', String(+p.dataset.part === i)); });
      if (fromSpot) {
        var p = parts[i], r = p.getBoundingClientRect();
        if (r.top < 70 || r.bottom > window.innerHeight) p.scrollIntoView({ block: 'nearest', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      }
    }
    spots.forEach(function (s) { s.addEventListener('click', function () { select(+s.dataset.part, true); }); });
    parts.forEach(function (p) { p.addEventListener('click', function () { select(+p.dataset.part, false); }); });
    select(0, false);
  }

  /* ---------------- sensitivity calculator ---------------- */
  function initCalc() {
    var form = $('#calc-form'), dpi = $('#dpi'), dpiOut = $('#dpi-out'), sens = $('#sens');
    var out = { cm: $('#cm360'), inch: $('#in360'), edpi: $('#edpi'), chip: $('#style-chip'), bar: $('#pad-bar') };
    var PAD_CM = 45;
    function update() {
      var yaw = +form.querySelector('input[name="game"]:checked').value;
      var d = +dpi.value, raw = String(sens.value).trim().replace(',', '.'), s = /^\d*\.?\d+$/.test(raw) ? parseFloat(raw) : NaN;
      dpiOut.textContent = fmt(d);
      if (!(s > 0)) {
        sens.setAttribute('aria-invalid', 'true');
        out.cm.textContent = '—'; out.inch.textContent = '—'; out.edpi.textContent = '—';
        out.chip.textContent = 'Введи число більше 0, наприклад 1,2';
        out.bar.style.setProperty('--w', '0%');
        return;
      }
      sens.removeAttribute('aria-invalid');
      var inch = 360 / (d * s * yaw), cm = inch * 2.54;
      out.cm.textContent = fmt(cm, cm < 100 ? 1 : 0);
      out.inch.textContent = fmt(inch, 2);
      out.edpi.textContent = fmt(Math.round(d * s));
      out.chip.textContent = cm < 25 ? 'Висока: швидкі повороти, але важче цілитися'
        : cm <= 50 ? 'Середня, як у багатьох профі'
        : 'Низька: точний приціл, але великі рухи рукою';
      out.bar.style.setProperty('--w', Math.min(100, cm / PAD_CM * 100) + '%');
    }
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    update();
  }

  /* ---------------- aim trainer ---------------- */
  function initTrainer() {
    var arena = $('#arena'), overlay = $('#arena-overlay'), startBtn = $('#arena-start');
    var hud = { time: $('#hud-time'), bar: $('#hud-bar'), hits: $('#hud-hits'), acc: $('#hud-acc'), rt: $('#hud-rt'), best: $('#hud-best'), rank: $('#hud-rank') };
    var DURATION = 20000, state = null, best = +store.get('sl2-best', 0) || 0;
    hud.best.textContent = best;
    function rankFor(h) { return h >= 40 ? 'Глобальна еліта' : h >= 30 ? 'Платина' : h >= 20 ? 'Золото' : h >= 10 ? 'Срібло' : 'Новачок'; }
    function updateHud() {
      var shots = state.hits + state.misses;
      hud.hits.textContent = state.hits;
      hud.acc.textContent = shots ? Math.round(state.hits / shots * 100) : 0;
      hud.rt.textContent = state.rts.length ? Math.round(state.rts.reduce(function (a, b) { return a + b; }, 0) / state.rts.length) + ' мс' : '—';
    }
    function spawn(viaKeyboard) {
      if (state.target) state.target.remove();
      clearTimeout(state.moveT);
      var p = Math.min(1, (performance.now() - state.start) / DURATION), size = Math.round(68 - p * 34);
      var w = arena.clientWidth, h = arena.clientHeight, pad = size / 2 + 8;
      var t = document.createElement('button');
      t.type = 'button'; t.className = 'target'; t.setAttribute('aria-label', 'Мішень');
      t.style.setProperty('--size', size + 'px');
      t.style.left = (pad + Math.random() * Math.max(1, w - pad * 2)) + 'px';
      t.style.top = (pad + Math.random() * Math.max(1, h - pad * 2)) + 'px';
      arena.appendChild(t);
      state.target = t; state.spawnAt = performance.now();
      if (viaKeyboard) t.focus({ preventScroll: true });
      state.moveT = setTimeout(function () { if (state && state.running) spawn(document.activeElement === t); }, 1600 - p * 600);
    }
    function fx(x, y) {
      var ring = document.createElement('span');
      ring.className = 'hit-fx'; ring.style.left = x + 'px'; ring.style.top = y + 'px';
      var s = document.createElement('span');
      s.className = 'hit-score'; s.textContent = '+1'; s.style.left = x + 'px'; s.style.top = (y - 20) + 'px';
      arena.appendChild(ring); arena.appendChild(s);
      setTimeout(function () { ring.remove(); s.remove(); }, 720);
    }
    function tick() {
      if (!state || !state.running) return;
      var left = Math.max(0, DURATION - (performance.now() - state.start));
      hud.time.textContent = (left / 1000).toFixed(1);
      hud.bar.style.transform = 'scaleX(' + (left / DURATION) + ')';
      if (left <= 0) return end();
      state.raf = requestAnimationFrame(tick);
    }
    function start() {
      state = { running: true, hits: 0, misses: 0, rts: [], start: performance.now(), target: null };
      overlay.classList.add('is-hidden');
      hud.rank.textContent = '…';
      updateHud(); spawn(true);
      state.raf = requestAnimationFrame(tick);
    }
    function end() {
      state.running = false;
      cancelAnimationFrame(state.raf); clearTimeout(state.moveT);
      if (state.target) state.target.remove();
      hud.time.textContent = '0.0'; hud.bar.style.transform = 'scaleX(0)';
      var rank = rankFor(state.hits), isBest = state.hits > best;
      if (isBest) { best = state.hits; store.set('sl2-best', best); hud.best.textContent = best; }
      hud.rank.textContent = rank;
      $('#arena-title').textContent = isBest ? 'Новий рекорд: ' + state.hits + '!' : 'Результат: ' + state.hits;
      $('#arena-text').textContent = 'Ранг: ' + rank + '. Точність ' + hud.acc.textContent + '%, середня реакція ' + hud.rt.textContent + '.';
      startBtn.textContent = 'Ще раз';
      overlay.classList.remove('is-hidden');
      startBtn.focus({ preventScroll: true });
    }
    startBtn.addEventListener('click', start);
    arena.addEventListener('click', function (e) {
      if (!state || !state.running) return;
      var r = arena.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (e.target.classList.contains('target')) {
        var t = e.target, keyboard = e.detail === 0;
        if (keyboard) { x = t.offsetLeft; y = t.offsetTop; }
        state.hits++; state.rts.push(performance.now() - state.spawnAt);
        fx(x, y); spawn(keyboard);
      } else if (e.target === arena) {
        state.misses++;
        if (!reduceMotion.matches && arena.animate) arena.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }], { duration: 180 });
      }
      updateHud();
    });
  }

  /* ---------------- boot ---------------- */
  $('#year').textContent = new Date().getFullYear();
  initReveal();
  initPointerFx();
  initAnatomy();
  initCalc();
  initTrainer();
  requestAnimationFrame(function () { requestAnimationFrame(function () { $('.hero').classList.add('is-ready'); }); });
  window.__slReady = true;
})();
