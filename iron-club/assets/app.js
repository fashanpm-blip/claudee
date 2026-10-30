/* IRON CLUB concept — shared behaviour. Vanilla JS, no dependencies. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var RU = document.documentElement.lang === 'ru';
  var T = function (en, ru) { return RU ? ru : en; };
  var params = new URLSearchParams(location.search);

  /* ---------- mobile navigation ---------- */
  var nav = $('#mobile-nav'), openBtn = $('#menu-open'), closeBtn = $('#menu-close'), lastFocus;
  function setNav(open) {
    nav.classList.toggle('is-open', open);
    openBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
    if (open) { lastFocus = document.activeElement; setTimeout(function () { closeBtn.focus(); }, 60); }
    else if (lastFocus) lastFocus.focus();
  }
  openBtn.addEventListener('click', function () { setNav(true); });
  closeBtn.addEventListener('click', function () { setNav(false); });
  nav.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { setNav(false); return; }
    if (e.key !== 'Tab') return;
    var f = $$('a[href], button', nav), first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  window.matchMedia('(min-width: 1100px)').addEventListener('change', function (e) { if (e.matches && nav.classList.contains('is-open')) setNav(false); });

  /* ---------- header + mobile CTA bar ---------- */
  var header = $('#site-header'), bar = $('#cta-bar'), ticking = false;
  var onTrial = document.body.dataset.page === 'free-trial.html';
  function onScroll() {
    ticking = false;
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    var nearEnd = window.innerHeight + y > document.documentElement.scrollHeight - 380;
    bar.classList.toggle('is-visible', !onTrial && y > 560 && !nearEnd);
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- reveal + counters ---------- */
  var els = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce.matches) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
    $$('[data-count]').forEach(function (el) {
      var end = +el.dataset.count, start = null;
      el.textContent = '0';
      requestAnimationFrame(function step(t) {
        if (start === null) start = t;
        var p = Math.min(1, (t - start) / 1200);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      });
    });
  } else {
    els.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- billing toggle (all plan groups on the page) ---------- */
  var billingBtns = $$('[data-billing]');
  function setBilling(mode) {
    billingBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.billing === mode)); });
    $$('.price__num').forEach(function (n) { n.textContent = '€' + (mode === 'yearly' ? n.dataset.yearly : n.dataset.monthly); });
    $$('.price__per').forEach(function (n) { n.textContent = mode === 'yearly' ? n.dataset.perYear : n.dataset.perMonth; });
    $$('.price__note').forEach(function (n) { n.textContent = mode === 'yearly' ? n.dataset.noteYear : ''; });
  }
  billingBtns.forEach(function (b) { b.addEventListener('click', function () { setBilling(b.dataset.billing); }); });

  /* ---------- timetable filter + today ---------- */
  var tt = $('#timetable');
  if (tt) {
    var today = new Date().getDay();
    $$('.day[data-day="' + today + '"]', tt).forEach(function (d) { d.classList.add('is-today'); });
    var chips = $$('.chip'), status = $('#tt-status');
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        var f = c.dataset.filter, shown = 0;
        chips.forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
        $$('.day', tt).forEach(function (day) {
          var any = false;
          $$('.cls', day).forEach(function (cl) { var on = f === 'all' || cl.dataset.type === f; cl.hidden = !on; if (on) { any = true; shown++; } });
          $('.day__empty', day).hidden = any;
        });
        status.textContent = T(shown + ' classes shown', 'Показано занятий: ' + shown);
      });
    });
  }

  /* ---------- open now (sample hours, visitor's local time) ---------- */
  var st = $$('[data-status]');
  if (st.length) {
    var d = new Date(), day = d.getDay(), m = d.getHours() * 60 + d.getMinutes();
    var wk = day >= 1 && day <= 5, open = wk ? [360, 1380] : [480, 1260];
    var isOpen = m >= open[0] && m < open[1];
    var fmt = function (x) { return String(Math.floor(x / 60)).padStart(2, '0') + ':' + String(x % 60).padStart(2, '0'); };
    var text;
    if (isOpen) text = T('Open now · until ', 'Открыто · до ') + fmt(open[1]);
    else {
      var nextOpen = m < open[0] ? open[0] : ((day + 1) % 7 >= 1 && (day + 1) % 7 <= 5 ? 360 : 480);
      text = T('Closed now · opens ', 'Закрыто · откроется ') + (m < open[0] ? T('today at ', 'сегодня в ') : T('tomorrow at ', 'завтра в ')) + fmt(nextOpen);
    }
    st.forEach(function (el) { el.classList.add(isOpen ? 'is-open' : 'is-closed'); $('[data-status-text]', el).textContent = text; });
  }

  /* ---------- forms ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function setError(id, msg, input) {
    var err = $('#e-' + id); if (err) err.textContent = msg;
    var target = input || $('#' + id);
    if (target) { if (msg) target.setAttribute('aria-invalid', 'true'); else target.removeAttribute('aria-invalid'); }
    return !msg;
  }
  function wire(form, rules, onOk) {
    Object.keys(rules).forEach(function (id) {
      var el = $('#' + id);
      if (!el || el.tagName === 'DIV') return;
      el.addEventListener('blur', function () { if (el.value) rules[id](); });
      el.addEventListener('input', function () { if (el.getAttribute('aria-invalid')) rules[id](); });
      el.addEventListener('change', function () { if (el.getAttribute('aria-invalid')) rules[id](); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = null;
      Object.keys(rules).forEach(function (id) {
        if (!rules[id]() && !bad) bad = $('#' + id).tagName === 'DIV' ? $('#' + id + ' input') : $('#' + id);
      });
      if (bad) { bad.focus(); return; }
      onOk();
    });
  }
  function req(id, msg) { return function () { return setError(id, $('#' + id).value.trim() ? '' : msg); }; }
  function email(id) {
    return function () {
      var v = $('#' + id).value.trim();
      return setError(id, !v ? T('Please enter your email.', 'Введи email.') : EMAIL_RE.test(v) ? '' : T('Check the email, e.g. name@example.com.', 'Проверь email, например name@example.com.'));
    };
  }
  function radio(id, name, msg) {
    return function () { var ok = !!$('input[name="' + name + '"]:checked'); setError(id, ok ? '' : msg, $('#' + id)); return ok; };
  }
  function show(form, success) { form.hidden = true; success.hidden = false; success.focus(); }

  var contact = $('#contact-form');
  if (contact) {
    var cOk = $('#contact-success');
    wire(contact, {
      'c-name': req('c-name', T('Please enter your name.', 'Введи имя.')),
      'c-email': email('c-email'),
      'c-msg': function () { return setError('c-msg', $('#c-msg').value.trim().length >= 10 ? '' : T('Write at least 10 characters.', 'Напиши хотя бы 10 символов.')); }
    }, function () { show(contact, cOk); });
  }

  var trial = $('#trial-form');
  if (trial) {
    var tOk = $('#trial-success');
    var goal = params.get('goal');
    if (goal && $('#goal-' + goal)) $('#goal-' + goal).checked = true;
    $$('input[name="goal"], input[name="time"]').forEach(function (r) {
      r.addEventListener('change', function () { setError(r.name === 'goal' ? 't-goal' : 't-time', '', $('#' + (r.name === 'goal' ? 't-goal' : 't-time'))); });
    });
    $('#t-consent').addEventListener('change', function () { if ($('#t-consent').checked) setError('t-consent', ''); });
    wire(trial, {
      't-name': req('t-name', T('Please enter your name.', 'Введи имя.')),
      't-email': email('t-email'),
      't-phone': function () { var v = $('#t-phone').value.trim(); return setError('t-phone', !v || /^[+\d][\d\s()-]{6,}$/.test(v) ? '' : T('Use digits, spaces and + only.', 'Только цифры, пробелы и +.')); },
      't-goal': radio('t-goal', 'goal', T('Choose a goal.', 'Выбери цель.')),
      't-day': function () { return setError('t-day', $('#t-day').value ? '' : T('Choose a day.', 'Выбери день.')); },
      't-time': radio('t-time', 'time', T('Choose a time of day.', 'Выбери время.')),
      't-consent': function () { return setError('t-consent', $('#t-consent').checked ? '' : T('Please confirm we may contact you.', 'Подтверди, что мы можем с тобой связаться.')); }
    }, function () {
      var g = $('input[name="goal"]:checked'), tm = $('input[name="time"]:checked');
      var plan = params.get('plan');
      $('#trial-summary').textContent = T('Name: ', 'Имя: ') + $('#t-name').value.trim() + ' · ' + $('#t-day').value + ', ' + $('label[for="' + tm.id + '"]').textContent.toLowerCase() +
        ' · ' + T('Goal: ', 'Цель: ') + $('label[for="' + g.id + '"]').textContent + (plan ? ' · ' + T('Plan: ', 'Тариф: ') + plan.charAt(0).toUpperCase() + plan.slice(1) : '');
      show(trial, tOk);
    });
  }
  $$('[data-reset]').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.dataset.reset === 'trial' ? trial : contact, ok = b.closest('.success');
      f.reset(); ok.hidden = true; f.hidden = false; $('input, select, textarea', f).focus();
    });
  });

  window.__icReady = true;
})();
