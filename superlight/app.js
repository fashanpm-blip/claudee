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
  window.matchMedia('(min-width: 1040px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });

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


  /* ---------------- colour switcher ---------------- */
  var COLORS = [
    { id: 'black', name: 'Чорний', dot: '#1d1d22', alt: 'чорного кольору з білим логотипом' },
    { id: 'white', name: 'Білий', dot: '#eeeef2', alt: 'білого кольору з чорним логотипом' },
    { id: 'magenta', name: 'Magenta', dot: '#ff2674', alt: 'рожевого кольору Magenta' }
  ];
  function initColors() {
    var groups = $$('.colors'), current = store.get('sl2-color', 'magenta');
    if (!COLORS.some(function (c) { return c.id === current; })) current = 'magenta';
    COLORS.forEach(function (c) { if (c.id !== 'magenta') { var i = new Image(); i.src = 'img/superlight2-' + c.id + '.webp'; } });
    groups.forEach(function (g) {
      g.innerHTML = COLORS.map(function (c) {
        return '<button type="button" class="color-opt" role="radio" data-color="' + c.id + '" aria-checked="false" style="--dot:' + c.dot + '">' +
          '<span class="color-opt__dot" aria-hidden="true"></span><span class="color-opt__name">' + c.name + '</span></button>';
      }).join('');
    });
    function apply(id, animate) {
      var c = COLORS.filter(function (x) { return x.id === id; })[0];
      current = id;
      $$('.color-opt').forEach(function (b) {
        var on = b.dataset.color === id;
        b.setAttribute('aria-checked', String(on));
        b.tabIndex = on ? 0 : -1;
      });
      $$('.mouse-photo').forEach(function (img) {
        img.src = 'img/superlight2-' + id + '.webp';
        if (img.id === 'hero-photo') img.alt = 'Мишка Logitech G Pro X Superlight 2 ' + c.alt + ', вигляд зверху';
        if (animate && !reduceMotion.matches) { img.classList.remove('is-swapping'); void img.offsetWidth; img.classList.add('is-swapping'); }
      });
    }
    groups.forEach(function (g) {
      g.addEventListener('click', function (e) {
        var b = e.target.closest('.color-opt'); if (!b) return;
        apply(b.dataset.color, true); store.set('sl2-color', b.dataset.color);
      });
      g.addEventListener('keydown', function (e) {
        var keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        if (!keys[e.key]) return;
        e.preventDefault();
        var idx = COLORS.findIndex(function (c) { return c.id === current; });
        var next = COLORS[(idx + keys[e.key] + COLORS.length) % COLORS.length].id;
        apply(next, true); store.set('sl2-color', next);
        g.querySelector('[data-color="' + next + '"]').focus();
      });
    });
    apply(current, false);
  }

  /* ---------------- button tester ---------------- */
  function initTester() {
    var stage = $('#tester-stage'), last = $('#tester-last'), arrow = $('#scroll-arrow');
    var LABEL = { left: 'Ліва кнопка', right: 'Права кнопка', middle: 'Клік колесом', back: 'Бокова «Назад»', fwd: 'Бокова «Вперед»' };
    var BTN = { 0: 'left', 1: 'middle', 2: 'right', 3: 'back', 4: 'fwd' };
    var counts = { left: 0, right: 0, middle: 0, back: 0, fwd: 0, scroll: 0 };
    var clicks = [], cpsBest = +store.get('sl2-cps', 0) || 0, wheelY = 0, wheelAcc = 0, scrollT, arrowT;
    $('#c-cps-best').textContent = cpsBest;
    function zone(name) { return name === 'middle' ? $('.zone--wheel', stage) : $('.zone--' + name, stage); }
    function say(text) { last.textContent = text; last.classList.remove('flash'); void last.offsetWidth; last.classList.add('flash'); }
    function bump(key) {
      var el = $('#c-' + key); el.textContent = counts[key];
      var box = el.closest('.count'); box.classList.add('bump'); clearTimeout(box._t);
      box._t = setTimeout(function () { box.classList.remove('bump'); }, 250);
    }
    function cps() {
      var now = performance.now();
      clicks = clicks.filter(function (t) { return now - t < 1000; });
      $('#c-cps').textContent = clicks.length;
      if (clicks.length > cpsBest) { cpsBest = clicks.length; store.set('sl2-cps', cpsBest); $('#c-cps-best').textContent = cpsBest; }
    }
    setInterval(function () { if (clicks.length) cps(); }, 250);
    function press(name) {
      zone(name).classList.add('is-down');
      stage.classList.add('is-pressing');
      counts[name]++; bump(name); say(LABEL[name]);
      if (name === 'left' || name === 'right') { clicks.push(performance.now()); cps(); }
    }
    function release(name) {
      zone(name).classList.remove('is-down');
      if (!$('.is-down', stage)) stage.classList.remove('is-pressing');
    }
    function releaseAll() { ['left', 'right', 'middle', 'back', 'fwd'].forEach(release); }
    function scroll(dir) {
      counts.scroll++; bump('scroll');
      wheelY += dir < 0 ? -7 : 7;
      stage.style.setProperty('--wheel-y', wheelY + 'px');
      stage.classList.add('is-scrolling');
      arrow.textContent = dir < 0 ? '↑' : '↓';
      arrow.classList.add('is-on');
      say(dir < 0 ? 'Колесо вгору' : 'Колесо вниз');
      clearTimeout(scrollT); clearTimeout(arrowT);
      scrollT = setTimeout(function () { stage.classList.remove('is-scrolling'); }, 500);
      arrowT = setTimeout(function () { arrow.classList.remove('is-on'); }, 450);
    }

    // real mouse: every button, including middle and side buttons
    stage.addEventListener('mousedown', function (e) {
      var name = BTN[e.button]; if (!name) return;
      e.preventDefault();               // no autoscroll / text selection
      press(name);
    });
    window.addEventListener('mouseup', function (e) {
      var name = BTN[e.button]; if (!name) return;
      if (stage.contains(e.target) && e.button > 2) e.preventDefault(); // stop browser Back/Forward
      release(name);
    });
    stage.addEventListener('auxclick', function (e) { e.preventDefault(); });
    stage.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    stage.addEventListener('mouseleave', releaseAll);
    window.addEventListener('blur', releaseAll);

    // touch / pen: press the zone under the finger
    stage.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') return;
      var r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      var name = y < .14 && x > .42 && x < .6 ? 'middle' : y < .3 ? (x < .508 ? 'left' : 'right') : x < .12 && y > .33 && y < .5 ? (y < .415 ? 'fwd' : 'back') : null;
      if (!name) return;
      press(name);
      var up = function () { release(name); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); };
      window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    });

    // wheel: one tick per notch (trackpads send many small events)
    stage.addEventListener('wheel', function (e) {
      e.preventDefault();
      var dy = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaMode === 2 ? e.deltaY * 400 : e.deltaY;
      if (Math.abs(dy) >= 60) { scroll(dy); wheelAcc = 0; return; }
      wheelAcc += dy;
      if (Math.abs(wheelAcc) >= 60) { scroll(wheelAcc); wheelAcc = 0; }
    }, { passive: false });

    // keyboard
    stage.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); press('left'); }
      else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); scroll(e.key === 'ArrowUp' ? -1 : 1); }
    });
    stage.addEventListener('keyup', function (e) { if (e.key === 'Enter' || e.key === ' ') release('left'); });

    $('#tester-reset').addEventListener('click', function () {
      Object.keys(counts).forEach(function (k) { counts[k] = 0; $('#c-' + k).textContent = 0; });
      clicks = []; $('#c-cps').textContent = 0;
      say('Лічильники скинуто');
    });
  }

  /* ---------------- boot ---------------- */
  $('#year').textContent = new Date().getFullYear();
  initReveal();
  initPointerFx();
  initAnatomy();
  initColors();
  initTester();
  initCalc();
  initTrainer();
  requestAnimationFrame(function () { requestAnimationFrame(function () { $('.hero').classList.add('is-ready'); }); });
  window.__slReady = true;
})();
