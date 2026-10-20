/* Toloache concept — shared behaviour for every page. Vanilla JS, no dependencies. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

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
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { if (a.getAttribute('href').charAt(0) === '#') setNav(false); }); });
  window.matchMedia('(min-width: 980px)').addEventListener('change', function (e) { if (e.matches && nav.classList.contains('is-open')) setNav(false); });

  /* ---------- header + mobile booking bar ---------- */
  var header = $('#site-header'), bar = $('#book-bar'), ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    var nearEnd = window.innerHeight + y > document.documentElement.scrollHeight - 420;
    bar.classList.toggle('is-visible', y > 520 && !nearEnd);
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- reveal ---------- */
  var els = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- opening hours: today + open now (Paris time) ---------- */
  // Minutes from midnight; values over 1440 run past midnight. Source: restaurant's site (to confirm).
  var SCHEDULE = { 0: [], 1: [], 2: [[720, 900], [1140, 1380]], 3: [[720, 900], [1140, 1380]], 4: [[720, 900], [1140, 1380]], 5: [[720, 900], [1140, 1560]], 6: [[720, 900], [1140, 1560]] };
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function parisNow() {
    var parts = {};
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday);
    return { day: day, min: (+parts.hour) * 60 + (+parts.minute) };
  }
  function hhmm(m) { m = m % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }
  function status(now) {
    var prev = (now.day + 6) % 7;
    var spill = SCHEDULE[prev].filter(function (r) { return r[1] > 1440 && now.min < r[1] - 1440; })[0];
    if (spill) return { open: true, text: 'Open now · until ' + hhmm(spill[1]) };
    var cur = SCHEDULE[now.day].filter(function (r) { return now.min >= r[0] && now.min < r[1]; })[0];
    if (cur) return { open: true, text: 'Open now · until ' + hhmm(cur[1]) };
    for (var k = 0; k < 7; k++) {
      var d = (now.day + k) % 7;
      var next = SCHEDULE[d].filter(function (r) { return k > 0 || r[0] > now.min; })[0];
      if (next) {
        var when = k === 0 ? 'today at ' : k === 1 ? 'tomorrow at ' : DAYS[d] + ' at ';
        return { open: false, text: 'Closed now · opens ' + when + hhmm(next[0]) };
      }
    }
    return { open: false, text: 'Closed' };
  }
  try {
    var now = parisNow();
    if (now.day >= 0) {
      // before 2 am on Sat/Sun the "service day" is still the previous evening; highlight the calendar day
      $$('.hours tr[data-day="' + now.day + '"]').forEach(function (tr) { tr.classList.add('is-today'); });
      var st = status(now);
      $$('[data-status]').forEach(function (el) {
        el.classList.add(st.open ? 'is-open' : 'is-closed');
        $('[data-status-text]', el).textContent = st.text;
      });
    }
  } catch (err) { /* Intl not available: static text stays */ }

  /* ---------- menu filters ---------- */
  var grid = $('#menu-grid');
  if (grid) {
    var btns = $$('.filter'), live = $('#filter-status');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.dataset.filter, shown = 0;
        btns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        $$('.lcard', grid).forEach(function (c) {
          var on = f === 'all' || c.dataset.cat === f;
          c.hidden = !on; if (on) { shown++; c.classList.add('is-in'); }
        });
        live.textContent = shown + (shown === 1 ? ' dish' : ' dishes') + ' shown';
      });
    });
  }

  /* ---------- contact form ---------- */
  var form = $('#contact-form');
  if (form) {
    var subj = new URLSearchParams(location.search).get('subject');
    var sel = $('#f-subject');
    if (subj && sel.querySelector('option[value="' + subj + '"]')) sel.value = subj;
    var rules = {
      'f-name': function (v) { return v.trim() ? '' : 'Please enter your name.'; },
      'f-email': function (v) { return !v.trim() ? 'Please enter your email.' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Check the email address, e.g. name@example.com.'; },
      'f-guests': function (v) { return !v ? '' : (/^\d+$/.test(v) && +v >= 1 && +v <= 200) ? '' : 'Enter a number between 1 and 200.'; },
      'f-msg': function (v) { return v.trim().length >= 10 ? '' : 'Please write a short message (at least 10 characters).'; }
    };
    function check(id) {
      var input = $('#' + id), msg = rules[id](input.value);
      var err = $('#e-' + id.slice(2));
      err.textContent = msg;
      if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
      return !msg;
    }
    Object.keys(rules).forEach(function (id) {
      var input = $('#' + id);
      input.addEventListener('blur', function () { if (input.value) check(id); });
      input.addEventListener('input', function () { if (input.getAttribute('aria-invalid')) check(id); });
    });
    var result = $('#form-result'), composed = '';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      Object.keys(rules).forEach(function (id) { if (!check(id) && !firstBad) firstBad = $('#' + id); });
      if (firstBad) { result.hidden = true; firstBad.focus(); return; }
      composed = 'Subject: ' + sel.options[sel.selectedIndex].text + '\nName: ' + $('#f-name').value.trim() + '\nEmail: ' + $('#f-email').value.trim() +
        ($('#f-guests').value ? '\nGuests: ' + $('#f-guests').value : '') + '\n\n' + $('#f-msg').value.trim();
      result.hidden = false;
      $('#copy-status').textContent = '';
      result.focus();
    });
    $('#copy-msg').addEventListener('click', function () {
      var done = function () { $('#copy-status').textContent = 'Copied.'; };
      var fail = function () { $('#copy-status').textContent = 'Copy failed. Select the text in the form and copy it manually.'; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(composed).then(done, fail); else fail();
    });
  }

  window.__tlReady = true;
})();
