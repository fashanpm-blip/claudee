/* Ассистент Claude: a chat panel shared by both pages. It asks Claude on the viewer's own account
   (the artifact `sample` capability) and gives Claude a few page functions to add/change/delete
   tasks, schedule items, expenses and habits. Every change is shown in the chat with an undo button. */
(function () {
  'use strict';
  var K = { chat: 'ai.chat.v1', tasks: 'plan.tasks.v1', blocks: 'plan.blocks.v1', habits: 'plan.habits.v1', hlog: 'plan.habitlog.v1', subjects: 'plan.subjects.v1', sessions: 'plan.sessions.v1', done: 'plan.done.v1', exp: 'budzet.expenses.v1', limit: 'budzet.limit.v1', cur: 'budzet.currency.v1' };
  var ARTIFACT_URL = 'https://claude.ai/artifact/PVUv19BwuRTuQ95P15P8KH';
  function raw(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function get(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
  function put(k, v) { try { localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
  function list(k) { var v = get(k, []); return Array.isArray(v) ? v : []; }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function isISO(s) { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s + 'T00:00').getTime()); }
  function isHM(s) { return typeof s === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(s); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function changed() { window.dispatchEvent(new Event('app:data')); }

  /* ---------- styles (uses the host page's tokens) ---------- */
  var css = document.createElement('style');
  css.textContent = [
    '.ai-fab{position:fixed;right:max(16px,env(safe-area-inset-right,0px));bottom:calc(24px + env(safe-area-inset-bottom,0px));z-index:40;display:inline-flex;align-items:center;gap:8px;min-height:52px;padding:0 18px 0 14px;border:0;border-radius:999px;background:var(--btn-bg,linear-gradient(135deg,var(--btn-a),var(--btn-b)));color:var(--btn-fg,var(--on-accent));font:inherit;font-weight:800;box-shadow:0 14px 34px -12px rgba(0,0,0,.7),0 0 0 1px rgba(255,230,160,.18) inset;cursor:pointer}',
    '.ai-fab svg,.ai-i{width:20px;height:20px;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '@media (max-width:1099px){.ai-fab{bottom:calc(84px + env(safe-area-inset-bottom,0px))}}',
    '.ai-panel{position:fixed;z-index:58;right:max(16px,env(safe-area-inset-right,0px));bottom:24px;width:min(420px,calc(100vw - 32px));height:min(680px,calc(100vh - 48px));display:flex;flex-direction:column;background:var(--card-solid,var(--card));color:var(--fg);border:1px solid var(--line-2,var(--line));border-radius:24px;box-shadow:0 30px 80px -20px rgba(0,0,0,.85);overflow:hidden;animation:ai-in .22s cubic-bezier(.22,1,.36,1)}',
    '@keyframes ai-in{from{opacity:0;transform:translateY(12px)}}',
    '@media (max-width:600px){.ai-panel{inset:env(safe-area-inset-top,0px) 0 0 0;width:100%;height:auto;border-radius:0;right:0;bottom:0}}',
    '.ai-head{display:flex;align-items:center;gap:10px;padding:14px 12px 12px 16px;border-bottom:1px solid var(--line)}',
    '.ai-logo{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:var(--btn-bg,linear-gradient(135deg,var(--btn-a),var(--btn-b)));color:var(--btn-fg,var(--on-accent));flex:none}',
    '.ai-head h2{margin:0;font-size:16px;font-weight:800;letter-spacing:-.01em}.ai-head p{margin:0;font-size:12.5px;color:var(--muted)}',
    '.ai-head>div{flex:1;min-width:0}',
    '.ai-ib{width:42px;height:42px;border-radius:12px;border:0;background:transparent;color:var(--muted);display:grid;place-items:center;cursor:pointer}.ai-ib:hover{background:var(--soft);color:var(--fg)}',
    '.ai-log{flex:1;overflow:auto;padding:16px;display:grid;align-content:start;gap:12px;overscroll-behavior:contain}',
    '.ai-msg{position:relative;max-width:88%;padding:10px 14px;border-radius:18px;line-height:1.5;font-size:14.5px;overflow-wrap:anywhere}',
    '.ai-msg.u{justify-self:end;background:var(--btn-bg,linear-gradient(135deg,var(--btn-a),var(--btn-b)));color:var(--btn-fg,var(--on-accent));border-bottom-right-radius:6px;white-space:pre-wrap;font-weight:600}',
    '.ai-msg.a{justify-self:start;background:var(--soft);border-bottom-left-radius:6px}',
    '.ai-msg.a ul{margin:4px 0;padding-left:20px}.ai-msg.a p{margin:0 0 6px}.ai-msg.a p:last-child{margin:0}.ai-msg.a code{font-size:.92em;padding:1px 5px;border-radius:6px;background:var(--card-solid,var(--card))}',
    '.ai-msg.is-err{border:1px solid var(--danger);background:transparent;color:var(--danger);font-weight:600}',
    '.ai-del{position:absolute;top:-8px;width:26px;height:26px;border-radius:50%;border:1px solid var(--line-2,var(--line));background:var(--card-solid,var(--card));color:var(--muted);display:grid;place-items:center;cursor:pointer;opacity:0;transition:opacity .15s}',
    '.ai-msg.u .ai-del{left:-10px}.ai-msg.a .ai-del{right:-10px}',
    '.ai-msg:hover .ai-del,.ai-msg:focus-within .ai-del{opacity:1}',
    '@media (hover:none){.ai-del{opacity:.85}}',
    '.ai-del svg{width:13px;height:13px}',
    '.ai-acts{display:grid;gap:6px;margin-top:8px}',
    '.ai-act{display:flex;align-items:center;gap:8px;padding:6px 6px 6px 10px;border-radius:12px;background:var(--card-solid,var(--card));border:1px solid var(--line);font-size:13px;font-weight:600}',
    '.ai-act span{flex:1;min-width:0}.ai-act.is-undone span{text-decoration:line-through;color:var(--muted)}',
    '.ai-act svg{width:16px;height:16px;color:var(--gold-ink,var(--accent-ink))}',
    '.ai-act button{border:0;background:transparent;color:var(--gold-ink,var(--accent-ink));font:inherit;font-weight:800;font-size:12.5px;padding:6px 8px;border-radius:8px;cursor:pointer}.ai-act button:hover{background:var(--soft)}',
    '.ai-think{justify-self:start;color:var(--muted);font-size:13.5px;font-weight:600;display:flex;align-items:center;gap:8px}',
    '.ai-dots{display:inline-flex;gap:4px}.ai-dots i{width:6px;height:6px;border-radius:50%;background:var(--gold,var(--accent));animation:ai-b 1s infinite}.ai-dots i:nth-child(2){animation-delay:.15s}.ai-dots i:nth-child(3){animation-delay:.3s}',
    '@keyframes ai-b{0%,80%,100%{opacity:.25}40%{opacity:1}}',
    '.ai-empty{display:grid;gap:12px;padding:6px 2px;color:var(--muted);font-size:14px}',
    '.ai-empty b{color:var(--fg);font-size:17px}',
    '.ai-sugs{display:grid;gap:8px}',
    '.ai-sug{text-align:left;padding:11px 14px;border-radius:14px;border:1px solid var(--line-2,var(--line));background:var(--card-solid,var(--card));color:var(--fg);font:inherit;font-size:14px;font-weight:600;cursor:pointer}.ai-sug:hover{border-color:var(--gold,var(--accent))}',
    '.ai-form{display:flex;gap:8px;align-items:flex-end;padding:12px;border-top:1px solid var(--line);padding-bottom:calc(12px + env(safe-area-inset-bottom,0px))}',
    '.ai-form textarea{flex:1;min-height:48px;max-height:140px;resize:none;padding:12px 14px;border-radius:14px;border:1.5px solid var(--line-2,var(--line));background:var(--soft);color:var(--fg);font:inherit;font-size:15px;line-height:1.4}',
    '.ai-form textarea:focus{outline:none;border-color:var(--gold,var(--accent))}',
    '.ai-send{width:48px;height:48px;border-radius:14px;border:0;flex:none;display:grid;place-items:center;background:var(--btn-bg,linear-gradient(135deg,var(--btn-a),var(--btn-b)));color:var(--btn-fg,var(--on-accent));cursor:pointer}',
    '.ai-send:disabled{opacity:.5;cursor:default}',
    '.ai-off{padding:18px;display:grid;gap:12px;font-size:14.5px}.ai-off a{color:var(--gold-ink,var(--accent-ink));font-weight:800}',
    '@media (prefers-reduced-motion:reduce){.ai-panel,.ai-dots i{animation:none}}'
  ].join('\n');
  document.head.appendChild(css);

  var I = {
    spark: '<path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
    trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>'
  };
  function svg(n, cls) { return '<svg class="' + (cls || 'ai-i') + '" viewBox="0 0 24 24" aria-hidden="true">' + I[n] + '</svg>'; }

  /* ---------- DOM ---------- */
  var fab = document.createElement('button');
  fab.type = 'button'; fab.className = 'ai-fab'; fab.setAttribute('aria-haspopup', 'dialog'); fab.setAttribute('aria-expanded', 'false');
  fab.innerHTML = svg('spark') + '<span>Claude</span>';
  var panel = document.createElement('section');
  panel.className = 'ai-panel'; panel.hidden = true; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Ассистент Claude');
  panel.innerHTML = '<div class="ai-head"><span class="ai-logo">' + svg('spark') + '</span><div><h2>Ассистент Claude</h2><p>Отвечает и сам ведёт твои планы</p></div>' +
    '<button type="button" class="ai-ib" data-ai="clear" aria-label="Очистить чат">' + svg('trash') + '</button><button type="button" class="ai-ib" data-ai="close" aria-label="Закрыть">' + svg('x') + '</button></div>' +
    '<div class="ai-log" aria-live="polite"></div>' +
    '<form class="ai-form"><label class="sr-only" for="ai-input">Сообщение для Claude</label><textarea id="ai-input" rows="1" placeholder="Напиши Claude…" maxlength="4000"></textarea>' +
    '<button type="submit" class="ai-send" aria-label="Отправить">' + svg('send') + '</button></form>';
  document.body.appendChild(fab); document.body.appendChild(panel);
  var log = panel.querySelector('.ai-log'), form = panel.querySelector('.ai-form'), box = panel.querySelector('textarea'), sendBtn = panel.querySelector('.ai-send');

  var sample = null, ready = false, busy = null; // busy = AbortController while a call runs
  var chat = list(K.chat);
  function saveChat() { put(K.chat, chat.slice(-60)); }

  function openPanel() { panel.hidden = false; fab.hidden = true; fab.setAttribute('aria-expanded', 'true'); render(); if (sample) setTimeout(function () { box.focus(); }, 0); }
  function closePanel() { panel.hidden = true; fab.hidden = false; fab.setAttribute('aria-expanded', 'false'); fab.focus(); }
  fab.addEventListener('click', openPanel);
  panel.querySelector('[data-ai="close"]').addEventListener('click', closePanel);
  panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); closePanel(); } });
  panel.querySelector('[data-ai="clear"]').addEventListener('click', function () {
    if (!chat.length) return;
    if (!confirm('Удалить всю переписку? Задачи и дела, которые сделал Claude, останутся.')) return;
    chat = []; saveChat(); render();
  });
  if (/#ai$/.test(location.hash)) openPanel();

  /* ---------- tiny, safe markdown (text is escaped first) ---------- */
  function md(text) {
    var lines = esc(text).split('\n'), out = [], ul = false;
    function inline(s) { return s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>'); }
    lines.forEach(function (l) {
      var m = l.match(/^\s*[-*•]\s+(.*)$/);
      if (m) { if (!ul) { out.push('<ul>'); ul = true; } out.push('<li>' + inline(m[1]) + '</li>'); return; }
      if (ul) { out.push('</ul>'); ul = false; }
      var h = l.match(/^#{1,4}\s+(.*)$/);
      if (h) { out.push('<p><b>' + inline(h[1]) + '</b></p>'); return; }
      if (l.trim()) out.push('<p>' + inline(l) + '</p>');
    });
    if (ul) out.push('</ul>');
    return out.join('');
  }

  /* ---------- render ---------- */
  var SUGS = ['Что мне сделать сегодня?', 'Составь мне распорядок на завтра: пары с 8:00 до 14:30, вечером спорт', 'Добавь задачу: эссе по польскому на пятницу, важно', 'Объясни, что значит «sprawdzian» и «kartkówka»', 'Сколько я потратил в этом месяце и на что больше всего?'];
  var streamEl = null, thinkEl = null;
  function render() {
    log.innerHTML = '';
    if (!sample) {
      var off = document.createElement('div'); off.className = 'ai-off';
      off.innerHTML = ready
        ? '<b>Ассистент здесь недоступен.</b><p>Он работает через твой аккаунт Claude, поэтому включается, когда приложение открыто на claude.ai.</p><p><a href="' + ARTIFACT_URL + '" target="_blank" rel="noopener">Открыть на claude.ai</a></p>'
        : '<p>Подключаюсь к Claude…</p>';
      log.appendChild(off); form.hidden = true; return;
    }
    form.hidden = false;
    if (!chat.length) {
      var em = document.createElement('div'); em.className = 'ai-empty';
      em.innerHTML = '<b>Привет! Я Claude.</b><p>Могу ответить на вопрос по учёбе, объяснить польское слово, а ещё сам добавить или удалить задачи, дела в распорядке, расходы и привычки. Всё, что я меняю, видно здесь, и это можно отменить.</p><div class="ai-sugs"></div>';
      SUGS.forEach(function (s) { var b = document.createElement('button'); b.type = 'button'; b.className = 'ai-sug'; b.textContent = s; b.addEventListener('click', function () { send(s); }); em.querySelector('.ai-sugs').appendChild(b); });
      log.appendChild(em);
    }
    chat.forEach(function (m) { log.appendChild(bubble(m)); });
    if (busy) {
      thinkEl = document.createElement('div'); thinkEl.className = 'ai-think'; thinkEl.innerHTML = '<span class="ai-dots"><i></i><i></i><i></i></span><span>Думаю…</span>';
      streamEl = document.createElement('div'); streamEl.className = 'ai-msg a'; streamEl.hidden = true;
      log.appendChild(streamEl); log.appendChild(thinkEl);
    }
    sendBtn.innerHTML = svg(busy ? 'stop' : 'send'); sendBtn.setAttribute('aria-label', busy ? 'Остановить' : 'Отправить');
    log.scrollTop = log.scrollHeight;
  }
  function bubble(m) {
    var el = document.createElement('div'); el.className = 'ai-msg ' + (m.role === 'user' ? 'u' : 'a') + (m.err ? ' is-err' : '');
    if (m.role === 'user' || m.err) el.textContent = m.text; else el.innerHTML = md(m.text || '…');
    if (m.acts && m.acts.length) {
      var box2 = document.createElement('div'); box2.className = 'ai-acts';
      m.acts.forEach(function (a) {
        var r = document.createElement('div'); r.className = 'ai-act' + (a.undone ? ' is-undone' : '');
        r.innerHTML = svg('check') + '<span></span>' + (a.undone ? '' : '<button type="button">Отменить</button>');
        r.querySelector('span').textContent = a.label;
        var ub = r.querySelector('button');
        if (ub) ub.addEventListener('click', function () { put(a.key, a.before === null ? '[]' : a.before); a.undone = true; saveChat(); changed(); render(); });
        box2.appendChild(r);
      });
      el.appendChild(box2);
    }
    var d = document.createElement('button'); d.type = 'button'; d.className = 'ai-del'; d.setAttribute('aria-label', 'Удалить сообщение'); d.innerHTML = svg('x');
    d.addEventListener('click', function () { chat.splice(chat.indexOf(m), 1); saveChat(); render(); });
    el.appendChild(d);
    return el;
  }

  /* ---------- what Claude sees about the app ---------- */
  var TYPES = { class: 'Пара', study: 'Учёба', sport: 'Спорт', food: 'Еда', work: 'Работа', sleep: 'Сон', rest: 'Отдых', other: 'Другое' };
  var CATS = { food: 'Еда', transport: 'Транспорт', fun: 'Развлечения', study: 'Учёба', other: 'Другое' };
  function snapshot() {
    var now = new Date(), t = iso(now), ym = t.slice(0, 7);
    var wd = new Intl.DateTimeFormat('ru-RU', { weekday: 'long' }).format(now);
    var subj = {}; list(K.subjects).forEach(function (s) { subj[s.id] = s.name; });
    var tasks = list(K.tasks).filter(function (x) { return !x.done; }).slice(0, 50).map(function (x) { return [x.id, x.title, x.due || 'без срока', x.prio === 'high' ? 'важно' : '', x.subjectId && subj[x.subjectId] ? subj[x.subjectId] : ''].join(' | '); });
    var blocks = list(K.blocks).slice(-80).map(function (b) { return [b.id, b.title, b.date, b.start + '–' + b.end, b.type, b.repeat, (b.skip || []).length ? 'пропуски: ' + b.skip.join(',') : ''].join(' | '); });
    var hab = list(K.habits).map(function (h) { return h.emoji + ' ' + h.name; });
    var cur = { PLN: 'zł', USD: '$', EUR: '€', UAH: '₴' }[get(K.cur, 'PLN')] || 'zł';
    var exp = list(K.exp).filter(function (x) { return x && typeof x.date === 'string' && x.date.slice(0, 7) === ym; });
    var total = exp.reduce(function (s, x) { return s + (x.cents || 0); }, 0), lim = get(K.limit, null);
    var expLines = exp.slice(-40).map(function (x) { return [x.id, x.date, (x.cents / 100).toFixed(2) + ' ' + cur, x.cat, x.comment || ''].join(' | '); });
    var mins = list(K.sessions).filter(function (s) { return s.date === t; }).reduce(function (a, s) { return a + (s.minutes || 0); }, 0);
    return 'Сейчас: ' + wd + ', ' + t + ', ' + pad(now.getHours()) + ':' + pad(now.getMinutes()) + '.\n' +
      'ОТКРЫТЫЕ ЗАДАЧИ (id | название | срок | важность | предмет):\n' + (tasks.join('\n') || '— нет') + '\n' +
      'РАСПОРЯДОК (id | название | дата начала | время | категория | повтор none/daily/weekdays/weekly | пропуски):\n' + (blocks.join('\n') || '— пусто') + '\n' +
      'ПРИВЫЧКИ: ' + (hab.join(', ') || 'нет') + '. Учёба сегодня: ' + mins + ' мин.\n' +
      'БЮДЖЕТ за ' + ym + ': потрачено ' + (total / 100).toFixed(2) + ' ' + cur + (lim ? ' из лимита ' + (lim / 100).toFixed(2) + ' ' + cur : ', лимит не задан') + '. Расходы (id | дата | сумма | категория | комментарий):\n' + (expLines.join('\n') || '— нет');
  }
  var RULES = 'Ты ассистент внутри приложения «Бюджет студента / Учёба и день». Пользователь — ученик из Украины, заканчивает лицей в Польше, польский учит всего год. ' +
    'Отвечай на языке сообщения (русский или украинский), коротко и по делу, можно списками. Если встречаются польские слова, объясняй их значение и давай перевод. ' +
    'Помогай с учёбой: объясняй темы просто, с примерами. ' +
    'У тебя есть функции приложения: добавлять/менять/удалять задачи, дела в распорядке, расходы и привычки. Используй их, когда пользователь просит что-то запланировать, записать или удалить; ' +
    'не меняй данные без просьбы. Удаляй только то, что пользователь явно назвал. Даты пиши в формате ГГГГ-ММ-ДД, время ЧЧ:ММ. «Сегодня», «завтра», дни недели считай от текущей даты ниже. ' +
    'После действий кратко скажи, что сделал. Пользователь видит кнопку «Отменить» под каждым действием.\n\nДАННЫЕ ПРИЛОЖЕНИЯ:\n';

  /* ---------- page functions Claude may call ---------- */
  var acts = null; // actions done during the current call
  function track(key, label, mutate) {
    var before = raw(key), v = list(key);
    var res = mutate(v); put(key, v); acts.push({ key: key, before: before, label: label, undone: false }); changed();
    return res;
  }
  function findIn(key, id, what) { var v = list(key), i = v.findIndex(function (x) { return x.id === String(id); }); if (i < 0) throw new Error(what + ' с id ' + id + ' не найден(а)'); return v[i]; }
  var TOOLS = [
    { name: 'add_task', description: 'Добавить задачу/дедлайн. Возвращает id новой задачи.',
      inputSchema: { type: 'object', properties: { title: { type: 'string' }, due: { type: 'string', description: 'ГГГГ-ММ-ДД или пусто, если без срока' }, important: { type: 'boolean' } }, required: ['title'] },
      execute: function (a) {
        var title = String(a.title || '').trim().slice(0, 120); if (!title) throw new Error('Пустое название');
        var due = a.due ? String(a.due) : null; if (due && !isISO(due)) throw new Error('Дата должна быть ГГГГ-ММ-ДД');
        var id = uid();
        track(K.tasks, 'Задача: ' + title + (due ? ' (до ' + due + ')' : ''), function (v) { v.push({ id: id, title: title, subjectId: null, due: due, prio: a.important ? 'high' : 'normal', done: false, created: Date.now() }); });
        return { ok: true, id: id };
      } },
    { name: 'update_task', description: 'Изменить задачу по id: название, срок, важность или отметить выполненной (done=true).',
      inputSchema: { type: 'object', properties: { id: { type: 'string' }, title: { type: 'string' }, due: { type: 'string', description: 'ГГГГ-ММ-ДД, или "none" чтобы убрать срок' }, important: { type: 'boolean' }, done: { type: 'boolean' } }, required: ['id'] },
      execute: function (a) {
        var t = findIn(K.tasks, a.id, 'Задача');
        if (a.due && a.due !== 'none' && !isISO(String(a.due))) throw new Error('Дата должна быть ГГГГ-ММ-ДД');
        track(K.tasks, (a.done ? 'Выполнено: ' : 'Изменено: ') + t.title, function (v) {
          var x = v.find(function (y) { return y.id === t.id; });
          if (a.title) x.title = String(a.title).slice(0, 120);
          if (a.due) x.due = a.due === 'none' ? null : String(a.due);
          if (typeof a.important === 'boolean') x.prio = a.important ? 'high' : 'normal';
          if (typeof a.done === 'boolean') { x.done = a.done; x.doneAt = a.done ? Date.now() : null; }
        });
        return { ok: true };
      } },
    { name: 'delete_task', description: 'Удалить задачу по id.',
      inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
      execute: function (a) { var t = findIn(K.tasks, a.id, 'Задача'); track(K.tasks, 'Удалена задача: ' + t.title, function (v) { v.splice(v.findIndex(function (y) { return y.id === t.id; }), 1); }); return { ok: true }; } },
    { name: 'add_schedule_item', description: 'Добавить дело в распорядок дня. category: class (пара), study, sport, food, work, sleep, rest, other. repeat: none, daily, weekdays, weekly.',
      inputSchema: { type: 'object', properties: { title: { type: 'string' }, date: { type: 'string', description: 'ГГГГ-ММ-ДД (для повторов — с какого дня)' }, start: { type: 'string', description: 'ЧЧ:ММ' }, end: { type: 'string', description: 'ЧЧ:ММ, позже start' }, category: { type: 'string', enum: Object.keys(TYPES) }, repeat: { type: 'string', enum: ['none', 'daily', 'weekdays', 'weekly'] } }, required: ['title', 'date', 'start', 'end'] },
      execute: function (a) {
        var title = String(a.title || '').trim().slice(0, 60); if (!title) throw new Error('Пустое название');
        var date = String(a.date), s = String(a.start), e = String(a.end);
        if (!isISO(date)) throw new Error('Дата должна быть ГГГГ-ММ-ДД');
        if (!isHM(s) || !isHM(e) || e <= s) throw new Error('Время ЧЧ:ММ, конец позже начала');
        var type = TYPES[a.category] ? a.category : 'other', rep = ['none', 'daily', 'weekdays', 'weekly'].indexOf(a.repeat) >= 0 ? a.repeat : 'none', id = uid();
        track(K.blocks, 'В распорядок: ' + title + ', ' + date + ' ' + s + '–' + e + (rep !== 'none' ? ' (повтор)' : ''), function (v) { v.push({ id: id, date: date, skip: [], start: s, end: e, title: title, type: type, repeat: rep }); });
        return { ok: true, id: id };
      } },
    { name: 'delete_schedule_item', description: 'Удалить дело из распорядка по id. Для повторяющегося дела можно передать only_date (ГГГГ-ММ-ДД), чтобы убрать его только в этот день.',
      inputSchema: { type: 'object', properties: { id: { type: 'string' }, only_date: { type: 'string' } }, required: ['id'] },
      execute: function (a) {
        var b = findIn(K.blocks, a.id, 'Дело');
        if (a.only_date) { if (!isISO(String(a.only_date))) throw new Error('Дата должна быть ГГГГ-ММ-ДД'); track(K.blocks, 'Убрано ' + a.only_date + ': ' + b.title, function (v) { var x = v.find(function (y) { return y.id === b.id; }); x.skip = (x.skip || []).concat(String(a.only_date)); }); }
        else track(K.blocks, 'Удалено из распорядка: ' + b.title, function (v) { v.splice(v.findIndex(function (y) { return y.id === b.id; }), 1); });
        return { ok: true };
      } },
    { name: 'add_expense', description: 'Записать расход в бюджет. category: food, transport, fun, study, other. amount — число в валюте пользователя.',
      inputSchema: { type: 'object', properties: { amount: { type: 'number' }, category: { type: 'string', enum: Object.keys(CATS) }, date: { type: 'string', description: 'ГГГГ-ММ-ДД, по умолчанию сегодня' }, comment: { type: 'string' } }, required: ['amount', 'category'] },
      execute: function (a) {
        var cents = Math.round(Number(a.amount) * 100); if (!(cents > 0 && cents <= 100000000)) throw new Error('Сумма должна быть больше 0');
        var date = a.date ? String(a.date) : iso(new Date()); if (!isISO(date)) throw new Error('Дата должна быть ГГГГ-ММ-ДД');
        var cat = CATS[a.category] ? a.category : 'other', id = uid(), cm = String(a.comment || '').slice(0, 80);
        track(K.exp, 'Расход: ' + (cents / 100).toFixed(2) + ' · ' + CATS[cat] + (cm ? ' · ' + cm : ''), function (v) { v.push({ id: id, created: Date.now(), cents: cents, cat: cat, date: date, comment: cm }); });
        return { ok: true, id: id };
      } },
    { name: 'delete_expense', description: 'Удалить расход по id.',
      inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
      execute: function (a) { var x = findIn(K.exp, a.id, 'Расход'); track(K.exp, 'Удалён расход: ' + (x.cents / 100).toFixed(2) + (x.comment ? ' · ' + x.comment : ''), function (v) { v.splice(v.findIndex(function (y) { return y.id === x.id; }), 1); }); return { ok: true }; } },
    { name: 'add_habit', description: 'Добавить привычку для ежедневной отметки.',
      inputSchema: { type: 'object', properties: { name: { type: 'string' }, emoji: { type: 'string' } }, required: ['name'] },
      execute: function (a) { var n = String(a.name || '').trim().slice(0, 40); if (!n) throw new Error('Пустое название'); var e = String(a.emoji || '⭐').slice(0, 4); track(K.habits, 'Привычка: ' + e + ' ' + n, function (v) { v.push({ id: uid(), name: n, emoji: e, created: Date.now() }); }); return { ok: true }; } }
  ];

  /* ---------- talk ---------- */
  var ERR = { not_granted: 'Доступ к Claude не разрешён. Его можно включить в меню артефакта → Permissions.', rate_limited: 'Слишком много запросов. Подожди минуту и попробуй ещё раз.', prompt_too_large: 'Переписка слишком длинная. Очисти чат (значок корзины).', session_expired: 'Сессия закончилась. Обнови страницу.', refused: 'Claude не может ответить на это.', tools_unavailable: 'Здесь Claude не может менять данные приложения.' };
  function send(text) {
    text = String(text || '').trim(); if (!text || busy || !sample) return;
    chat.push({ id: uid(), role: 'user', text: text }); saveChat(); box.value = ''; autosize();
    var ctl = new AbortController(); busy = ctl; acts = [];
    var myActs = acts; render();
    var turns = [{ role: 'user', content: RULES + snapshot() }];
    chat.slice(-16).forEach(function (m) {
      if (m.err) return;
      var c = m.text || ''; if (m.acts && m.acts.length) c += '\n[Сделано в приложении: ' + m.acts.map(function (a) { return a.label + (a.undone ? ' (отменено)' : ''); }).join('; ') + ']';
      if (c.trim()) turns.push({ role: m.role, content: c });
    });
    sample(turns, {
      cache: false, signal: ctl.signal, tools: TOOLS,
      onText: function (u) { if (streamEl) { streamEl.hidden = false; streamEl.innerHTML = md(u.text); if (thinkEl) thinkEl.hidden = true; log.scrollTop = log.scrollHeight; } }
    }).then(function (r) {
      chat.push({ id: uid(), role: 'assistant', text: r.text + (r.truncated ? '\n\n(ответ обрезан)' : ''), acts: myActs });
    }, function (e) {
      var code = e && e.code;
      if (e && e.text) chat.push({ id: uid(), role: 'assistant', text: e.text, acts: myActs });
      else if (myActs.length) chat.push({ id: uid(), role: 'assistant', text: 'Готово.', acts: myActs });
      if (code !== 'cancelled') chat.push({ id: uid(), role: 'assistant', err: true, text: ERR[code] || ('Не получилось: ' + ((e && e.message) || 'ошибка')) });
    }).then(function () { busy = null; acts = null; saveChat(); render(); box.focus(); });
  }
  form.addEventListener('submit', function (e) { e.preventDefault(); if (busy) { busy.abort(); return; } send(box.value); });
  box.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); } });
  function autosize() { box.style.height = 'auto'; box.style.height = Math.min(140, box.scrollHeight) + 'px'; }
  box.addEventListener('input', autosize);

  /* ---------- connect ---------- */
  function done(s) { sample = typeof s === 'function' ? s : null; ready = true; if (!panel.hidden) render(); }
  if (window.claude && typeof window.claude.use === 'function') window.claude.use('sample').then(done, function () { done(null); });
  else done(null);
  window.__aiAssistant = { open: openPanel, tools: TOOLS, snapshot: snapshot }; // for testing
})();
