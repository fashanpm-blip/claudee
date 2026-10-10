/* VANTA — interactions. Vanilla JS, no dependencies. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var fmt = function (n) { return Math.round(n).toLocaleString('uk-UA').replace(/ | /g, ' '); };
  var money = function (n) { return fmt(n) + ' грн'; };

  var store = {
    get: function (k, fallback) {
      try { var v = localStorage.getItem(k); return v === null ? fallback : JSON.parse(v); } catch (e) { return fallback; }
    },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  };

  /* ---------------- data ---------------- */
  var PRODUCTS = [
    {
      id: 'x1', name: 'X1 Pro', price: 4999, badge: 'Хіт продажів',
      desc: 'Флагман для кіберспорту: бездротова, 49 г, сенсор 26K і 8000 Гц.',
      specs: [['Вага', '49 г'], ['DPI', '26K'], ['Гц', '8000']],
      colors: [
        { name: 'Чорний', body: '#18162c', accent: '#f43f5e' },
        { name: 'Білий', body: '#e9e7f2', accent: '#7c3aed' },
        { name: 'Фіолетовий', body: '#3b1d78', accent: '#a78bfa' }
      ]
    },
    {
      id: 'air', name: 'Air', price: 2499, badge: 'Найлегша',
      desc: 'Дротова 39-грамова пушинка з м\'яким кабелем. Ідеальний старт.',
      specs: [['Вага', '39 г'], ['DPI', '16K'], ['Гц', '1000']],
      colors: [
        { name: 'Графіт', body: '#2a2a3a', accent: '#34d399' },
        { name: 'М\'ятний', body: '#bfeee0', accent: '#0f766e' },
        { name: 'Рожевий', body: '#f9c6d3', accent: '#be123c' }
      ]
    },
    {
      id: 'titan', name: 'Titan', price: 3799, badge: '14 кнопок', alt: true,
      desc: 'Для MMO та MOBA: 14 програмованих кнопок і 90 годин без зарядки.',
      specs: [['Вага', '89 г'], ['DPI', '26K'], ['Кнопок', '14']],
      colors: [
        { name: 'Сталь', body: '#3a3f4b', accent: '#f59e0b' },
        { name: 'Чорний', body: '#121218', accent: '#ef4444' },
        { name: 'Синій', body: '#1e3a8a', accent: '#38bdf8' }
      ]
    }
  ];
  var FREE_SHIP = 3000, SHIP_COST = 99;
  var byId = function (id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; };

  /* ---------------- toasts ---------------- */
  var toasts = $('#toasts');
  function toast(msg) {
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = '<svg aria-hidden="true"><use href="#i-check"/></svg><span></span>';
    el.querySelector('span').textContent = msg;
    toasts.appendChild(el);
    setTimeout(function () {
      el.classList.add('is-leaving');
      setTimeout(function () { el.remove(); }, 220);
    }, 2800);
    while (toasts.children.length > 3) toasts.firstChild.remove();
  }

  /* ---------------- products ---------------- */
  var selected = {};
  function renderProducts() {
    var root = $('#products');
    root.innerHTML = PRODUCTS.map(function (p, i) {
      selected[p.id] = 0;
      var c = p.colors[0];
      return '' +
        '<article class="product" data-reveal style="--delay:' + (i * 100) + 'ms" data-id="' + p.id + '">' +
          '<span class="product__badge' + (p.alt ? ' product__badge--alt' : '') + '">' + p.badge + '</span>' +
          '<div class="product__stage">' +
            '<svg class="mouse-svg" viewBox="0 0 200 320" role="img" aria-label="VANTA ' + p.name + ', колір ' + c.name + '" style="--m-body:' + c.body + ';--m-accent:' + c.accent + '"><use href="#mouse"/></svg>' +
          '</div>' +
          '<div class="product__body">' +
            '<div class="product__top"><h3 class="product__name">' + p.name + '</h3><span class="product__price">' + money(p.price) + '</span></div>' +
            '<p class="product__desc">' + p.desc + '</p>' +
            '<dl class="product__specs">' + p.specs.map(function (s) { return '<div><dt>' + s[0] + '</dt><dd>' + s[1] + '</dd></div>'; }).join('') + '</dl>' +
            '<div class="swatches" role="group" aria-label="Колір ' + p.name + '">' +
              '<span class="swatches__label">' + c.name + '</span>' +
              p.colors.map(function (col, ci) {
                return '<button type="button" class="swatch" data-color="' + ci + '" aria-pressed="' + (ci === 0) + '" aria-label="' + col.name + '" style="--sw-body:' + col.body + ';--sw-accent:' + col.accent + '"></button>';
              }).join('') +
            '</div>' +
            '<div class="product__actions"><button type="button" class="btn" data-add>У кошик <svg aria-hidden="true"><use href="#i-cart"/></svg></button></div>' +
          '</div>' +
        '</article>';
    }).join('');

    root.addEventListener('click', function (e) {
      var card = e.target.closest('.product');
      if (!card) return;
      var p = byId(card.dataset.id);
      var sw = e.target.closest('.swatch');
      if (sw) {
        var ci = +sw.dataset.color, col = p.colors[ci];
        selected[p.id] = ci;
        $$('.swatch', card).forEach(function (b) { b.setAttribute('aria-pressed', String(b === sw)); });
        $('.swatches__label', card).textContent = col.name;
        var svg = $('.mouse-svg', card);
        svg.style.setProperty('--m-body', col.body);
        svg.style.setProperty('--m-accent', col.accent);
        svg.setAttribute('aria-label', 'VANTA ' + p.name + ', колір ' + col.name);
        if (!reduceMotion.matches && svg.animate) {
          svg.animate([{ transform: 'rotate(-12deg) scale(.85)', opacity: .4 }, { transform: 'rotate(0) scale(1.08)', opacity: 1 }, { transform: 'rotate(0) scale(1)' }], { duration: 450, easing: 'cubic-bezier(.34,1.56,.64,1)' });
        }
        return;
      }
      var add = e.target.closest('[data-add]');
      if (add) {
        cart.add(p.id, selected[p.id]);
        revealHeader(3000);
        add.classList.add('is-added');
        add.innerHTML = 'Додано <svg aria-hidden="true"><use href="#i-check"/></svg>';
        clearTimeout(add._t);
        add._t = setTimeout(function () {
          add.classList.remove('is-added');
          add.innerHTML = 'У кошик <svg aria-hidden="true"><use href="#i-cart"/></svg>';
        }, 1400);
        toast('VANTA ' + p.name + ' (' + p.colors[selected[p.id]].name.toLowerCase() + ') у кошику');
      }
    });
  }

  /* ---------------- cart ---------------- */
  var cart = (function () {
    var items = store.get('vanta-cart', []);
    if (!Array.isArray(items)) items = [];
    items = items.filter(function (it) { return it && byId(it.id) && byId(it.id).colors[it.color] && it.qty > 0; });

    var list = $('#cart-list'), empty = $('#cart-empty'), foot = $('#cart-foot'), count = $('#cart-count');

    function save() { store.set('vanta-cart', items); }
    function totalQty() { return items.reduce(function (s, it) { return s + it.qty; }, 0); }
    function subtotal() { return items.reduce(function (s, it) { return s + it.qty * byId(it.id).price; }, 0); }

    function render(bump) {
      var q = totalQty();
      count.hidden = q === 0;
      count.textContent = q;
      if (bump && !reduceMotion.matches) { count.classList.remove('bump'); void count.offsetWidth; count.classList.add('bump'); }
      $('#cart-open').setAttribute('aria-label', 'Відкрити кошик, товарів: ' + q);

      empty.hidden = items.length > 0;
      foot.hidden = items.length === 0;
      list.hidden = items.length === 0;
      list.innerHTML = items.map(function (it, idx) {
        var p = byId(it.id), c = p.colors[it.color];
        return '<li class="line-item" data-idx="' + idx + '">' +
          '<div class="line-item__thumb"><svg class="mouse-svg" viewBox="0 0 200 320" aria-hidden="true" style="--m-body:' + c.body + ';--m-accent:' + c.accent + '"><use href="#mouse"/></svg></div>' +
          '<div><div class="line-item__name">VANTA ' + p.name + '</div><div class="line-item__meta">' + c.name + ' · ' + money(p.price) + '</div>' +
            '<div class="qty"><button type="button" data-dec aria-label="Зменшити кількість">−</button><span aria-label="Кількість">' + it.qty + '</span><button type="button" data-inc aria-label="Збільшити кількість">+</button></div></div>' +
          '<div><div class="line-item__price">' + money(p.price * it.qty) + '</div><button type="button" class="remove" data-remove>Видалити</button></div>' +
        '</li>';
      }).join('');

      var sub = subtotal(), ship = sub >= FREE_SHIP || sub === 0 ? 0 : SHIP_COST;
      $('#cart-subtotal').textContent = money(sub);
      $('#cart-ship').textContent = ship === 0 ? 'Безкоштовно' : money(ship);
      $('#cart-total').textContent = money(sub + ship);
      $('#ship-bar').style.width = Math.min(100, sub / FREE_SHIP * 100) + '%';
      $('#ship-note').textContent = sub >= FREE_SHIP ? 'Доставка безкоштовна!' : 'Ще ' + money(FREE_SHIP - sub) + ' до безкоштовної доставки';
    }

    list.addEventListener('click', function (e) {
      var li = e.target.closest('.line-item');
      if (!li) return;
      var idx = +li.dataset.idx, it = items[idx];
      if (!it) return;
      var focusSel = null;
      if (e.target.closest('[data-inc]')) { it.qty = Math.min(99, it.qty + 1); focusSel = '[data-inc]'; }
      else if (e.target.closest('[data-dec]')) { it.qty -= 1; focusSel = '[data-dec]'; }
      else if (e.target.closest('[data-remove]')) { it.qty = 0; }
      else return;
      if (it.qty <= 0) { items.splice(idx, 1); focusSel = null; }
      save(); render(false);
      var target = focusSel && list.querySelector('[data-idx="' + idx + '"] ' + focusSel);
      (target || $('#cart-close')).focus();
    });

    render(false);

    return {
      add: function (id, color) {
        var found = items.filter(function (it) { return it.id === id && it.color === color; })[0];
        if (found) found.qty = Math.min(99, found.qty + 1); else items.push({ id: id, color: color, qty: 1 });
        save(); render(true);
      },
      clear: function () { items = []; save(); render(false); },
      isEmpty: function () { return items.length === 0; }
    };
  })();

  /* ---------------- drawer + menu (focus management) ---------------- */
  var drawer = $('#cart'), scrim = $('#scrim'), openBtn = $('#cart-open'), lastFocus = null;
  function focusables(root) {
    return $$('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])', root).filter(function (el) { return el.offsetParent !== null; });
  }
  function openCart() {
    closeMenu();
    lastFocus = document.activeElement;
    drawer.classList.add('is-open'); scrim.classList.add('is-open');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    setTimeout(function () { $('#cart-close').focus(); }, 50);
  }
  function closeCart(restore) {
    if (!drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open'); scrim.classList.remove('is-open');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    if (restore !== false && lastFocus) lastFocus.focus();
  }
  openBtn.addEventListener('click', openCart);
  $('#cart-close').addEventListener('click', closeCart);
  scrim.addEventListener('click', closeCart);
  $('#cart-browse').addEventListener('click', function () { closeCart(false); });
  drawer.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = focusables(drawer);
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  $('#checkout').addEventListener('click', function () {
    if (cart.isEmpty()) return;
    cart.clear();
    closeCart();
    toast('Дякуємо! Це демо-сайт, тож оплата не списується.');
  });

  var menuBtn = $('#menu-btn'), menu = $('#mobile-menu');
  function openMenu() {
    menu.classList.add('is-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Закрити меню');
    menuBtn.querySelector('use').setAttribute('href', '#i-close');
    document.body.classList.add('no-scroll');
  }
  function closeMenu() {
    if (!menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Відкрити меню');
    menuBtn.querySelector('use').setAttribute('href', '#i-menu');
    document.body.classList.remove('no-scroll');
  }
  menuBtn.addEventListener('click', function () { menu.classList.contains('is-open') ? closeMenu() : openMenu(); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', closeMenu); });
  window.matchMedia('(min-width: 900px)').addEventListener('change', function (e) { if (e.matches) closeMenu(); });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (drawer.classList.contains('is-open')) closeCart();
    else if (menu.classList.contains('is-open')) { closeMenu(); menuBtn.focus(); }
  });

  /* ---------------- header, progress, back-to-top, active nav ---------------- */
  var header = $('#header'), progress = $('.progress'), toTop = $('#to-top');
  var lastY = window.scrollY, ticking = false, pinnedUntil = 0;
  function revealHeader(ms) { pinnedUntil = performance.now() + ms; header.classList.remove('is-hidden'); }
  function onScroll() {
    var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('is-scrolled', y > 10);
    var hide = y > 500 && y > lastY && !menu.classList.contains('is-open') && !header.contains(document.activeElement) && performance.now() > pinnedUntil;
    header.classList.toggle('is-hidden', hide);
    progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    toTop.classList.toggle('is-visible', y > 900);
    lastY = y; ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    $('.logo').focus({ preventScroll: true });
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

  /* ---------------- counters ---------------- */
  function runCounter(el) {
    var end = +el.dataset.count;
    if (reduceMotion.matches) { el.textContent = fmt(end); return; }
    var start = performance.now(), dur = 1600;
    (function step(now) {
      var t = Math.min(1, (now - start) / dur), eased = 1 - Math.pow(1 - t, 4);
      el.textContent = fmt(end * eased);
      if (t < 1) requestAnimationFrame(step);
    })(start);
  }

  /* ---------------- reveal on scroll ---------------- */
  function initReveal() {
    var els = $$('[data-reveal]'), counters = $$('[data-count]');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        obs.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { obs.observe(el); });

    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        runCounter(en.target);
        cObs.unobserve(en.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cObs.observe(el); });
  }

  /* ---------------- hero tilt + feature spotlight ---------------- */
  function initPointerFx() {
    var visual = $('.hero__visual'), mouse = $('#hero-mouse');
    if (visual && mouse) {
      visual.addEventListener('pointermove', function (e) {
        if (!finePointer.matches || reduceMotion.matches) return;
        var r = visual.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        mouse.style.transform = 'rotateY(' + (x * 24) + 'deg) rotateX(' + (-y * 24) + 'deg) rotateZ(' + (x * 6) + 'deg)';
      });
      visual.addEventListener('pointerleave', function () { mouse.style.transform = ''; });
    }
    $$('.feature').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------------- aim trainer ---------------- */
  function initTrainer() {
    var arena = $('#arena'), overlay = $('#arena-overlay'), startBtn = $('#arena-start');
    var hud = { time: $('#hud-time'), bar: $('#hud-bar'), hits: $('#hud-hits'), acc: $('#hud-acc'), rt: $('#hud-rt'), best: $('#hud-best'), rank: $('#hud-rank') };
    var DURATION = 20000;
    var state = null, best = +store.get('vanta-best', 0) || 0;
    hud.best.textContent = best;

    function rankFor(h) {
      if (h >= 40) return 'Глобальна еліта';
      if (h >= 30) return 'Платина';
      if (h >= 20) return 'Золото';
      if (h >= 10) return 'Срібло';
      return 'Новачок';
    }
    function updateHud() {
      var shots = state.hits + state.misses;
      hud.hits.textContent = state.hits;
      hud.acc.textContent = shots ? Math.round(state.hits / shots * 100) : 0;
      hud.rt.textContent = state.rts.length ? Math.round(state.rts.reduce(function (a, b) { return a + b; }, 0) / state.rts.length) + ' мс' : '—';
    }
    function spawn(viaKeyboard) {
      if (state.target) state.target.remove();
      clearTimeout(state.moveT);
      var progress = Math.min(1, (performance.now() - state.start) / DURATION);
      var size = Math.round(68 - progress * 34);
      var w = arena.clientWidth, h = arena.clientHeight, pad = size / 2 + 8;
      var t = document.createElement('button');
      t.type = 'button';
      t.className = 'target';
      t.setAttribute('aria-label', 'Мішень');
      t.style.setProperty('--size', size + 'px');
      t.style.left = (pad + Math.random() * Math.max(1, w - pad * 2)) + 'px';
      t.style.top = (pad + Math.random() * Math.max(1, h - pad * 2)) + 'px';
      arena.appendChild(t);
      state.target = t;
      state.spawnAt = performance.now();
      if (viaKeyboard) t.focus({ preventScroll: true });
      state.moveT = setTimeout(function () { if (state && state.running) spawn(document.activeElement === t); }, 1600 - progress * 600);
    }
    function fx(x, y, text) {
      var ring = document.createElement('span');
      ring.className = 'hit-fx'; ring.style.left = x + 'px'; ring.style.top = y + 'px';
      arena.appendChild(ring);
      setTimeout(function () { ring.remove(); }, 520);
      if (text) {
        var s = document.createElement('span');
        s.className = 'hit-score'; s.textContent = text; s.style.left = x + 'px'; s.style.top = (y - 20) + 'px';
        arena.appendChild(s);
        setTimeout(function () { s.remove(); }, 720);
      }
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
      updateHud();
      spawn(true);
      state.raf = requestAnimationFrame(tick);
    }
    function end() {
      state.running = false;
      cancelAnimationFrame(state.raf);
      clearTimeout(state.moveT);
      if (state.target) state.target.remove();
      hud.time.textContent = '0.0';
      hud.bar.style.transform = 'scaleX(0)';
      var rank = rankFor(state.hits), isBest = state.hits > best;
      if (isBest) { best = state.hits; store.set('vanta-best', best); hud.best.textContent = best; }
      hud.rank.textContent = rank;
      $('#arena-title').textContent = isBest ? 'Новий рекорд: ' + state.hits + '!' : 'Результат: ' + state.hits;
      $('#arena-text').textContent = 'Твій ранг: ' + rank + '. Точність ' + hud.acc.textContent + '%, середня реакція ' + hud.rt.textContent + '.';
      startBtn.textContent = 'Ще раз';
      overlay.classList.remove('is-hidden');
      startBtn.focus({ preventScroll: true });
    }

    startBtn.addEventListener('click', start);
    arena.addEventListener('click', function (e) {
      if (!state || !state.running) return;
      var r = arena.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      if (e.target.classList.contains('target')) {
        var t = e.target, keyboard = e.detail === 0;
        if (keyboard) { x = t.offsetLeft; y = t.offsetTop; }
        state.hits++;
        state.rts.push(performance.now() - state.spawnAt);
        fx(x, y, '+1');
        spawn(keyboard);
      } else if (e.target === arena) {
        state.misses++;
        if (!reduceMotion.matches && arena.animate) arena.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }], { duration: 180 });
      }
      updateHud();
    });
  }

  /* ---------------- newsletter ---------------- */
  function initForm() {
    var form = $('#newsletter'), input = $('#email'), help = $('#email-help');
    var defaultHelp = help.textContent;
    var valid = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); };
    function showError(msg) {
      input.setAttribute('aria-invalid', 'true');
      help.className = 'form__help is-error';
      help.textContent = msg;
    }
    input.addEventListener('blur', function () {
      var v = input.value.trim();
      if (v && !valid(v)) showError('Перевір email: схоже, в адресі помилка (приклад: name@gmail.com).');
    });
    input.addEventListener('input', function () {
      if (input.getAttribute('aria-invalid') === 'true' && valid(input.value.trim())) {
        input.removeAttribute('aria-invalid');
        help.className = 'form__help';
        help.textContent = defaultHelp;
      }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value.trim();
      if (!v) { showError('Введи свій email, щоб отримати промокод.'); input.focus(); return; }
      if (!valid(v)) { showError('Перевір email: схоже, в адресі помилка (приклад: name@gmail.com).'); input.focus(); return; }
      input.removeAttribute('aria-invalid');
      help.className = 'form__help is-ok';
      help.textContent = 'Готово! Твій промокод: VANTA10';
      form.reset();
      toast('Промокод VANTA10 надіслано на ' + v);
    });
  }

  /* ---------------- boot ---------------- */
  $('#year').textContent = new Date().getFullYear();
  renderProducts();
  initReveal();
  initPointerFx();
  initTrainer();
  initForm();
  requestAnimationFrame(function () { requestAnimationFrame(function () { $('.hero').classList.add('is-ready'); }); });
  window.__vantaReady = true;
})();
