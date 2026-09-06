/* ==================================================================
   ZapClone — lógica do aplicativo
   Sem dependências, sem build, sem rede. Tudo roda no navegador.
   ================================================================== */
'use strict';

const STORE_KEY = 'zapclone.state.v1';
const THEME_KEY = 'zapclone.theme';

/* ------------------------------------------------------------------
   Utilidades
------------------------------------------------------------------ */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const rand  = (a, b) => a + Math.random() * (b - a);
const pick  = (arr) => arr[Math.floor(Math.random() * arr.length)];
const uid   = () => 'm' + Math.random().toString(36).slice(2, 10);

function linkify(html) {
  return html.replace(/\b(https?:\/\/[^\s<]+)/g, (u) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a>`);
}

/* --- datas ------------------------------------------------------ */
const DAYS   = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const dayDiff = (a, b) => Math.round((startOfDay(a) - startOfDay(b)) / 86400000);

const hhmm = (ts) => new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

function dayLabel(ts) {
  const d = dayDiff(new Date(), ts);
  if (d === 0) return 'Hoje';
  if (d === 1) return 'Ontem';
  if (d < 7) return DAYS[new Date(ts).getDay()];
  const x = new Date(ts);
  return `${x.getDate()} de ${MONTHS[x.getMonth()]} de ${x.getFullYear()}`;
}

function listTime(ts) {
  const d = dayDiff(new Date(), ts);
  if (d === 0) return hhmm(ts);
  if (d === 1) return 'Ontem';
  if (d < 7) return DAYS[new Date(ts).getDay()].slice(0, 3);
  const x = new Date(ts);
  return `${String(x.getDate()).padStart(2, '0')}/${String(x.getMonth() + 1).padStart(2, '0')}/${x.getFullYear()}`;
}

const mmss = (sec) => `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, '0')}`;

/* --- avatares gerados ------------------------------------------- */
function initials(name) {
  const parts = String(name).replace(/[^\p{L}\p{N} ]/gu, '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

function avatarSVG(name, color) {
  const t = esc(initials(name));
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
       <rect width="100" height="100" fill="${color}"/>
       <text x="50" y="50" font-family="Helvetica,Arial,sans-serif" font-size="40" font-weight="600"
             fill="rgba(255,255,255,.95)" text-anchor="middle" dominant-baseline="central">${t}</text>
     </svg>`)}`;
}

function paintAvatar(elm, name, color) {
  elm.style.backgroundImage = `url("${avatarSVG(name, color || '#6b7c85')}")`;
  elm.style.backgroundSize = 'cover';
  elm.textContent = '';
  elm.setAttribute('aria-hidden', 'true');
}

/* --- imagens fictícias (SVG gerado, nenhuma rede) ---------------- */
const MEDIA = {
  sunset: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
      <defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#1b2a4a"/><stop offset=".45" stop-color="#c2557a"/>
        <stop offset=".72" stop-color="#f0894f"/><stop offset="1" stop-color="#ffc86b"/>
      </linearGradient></defs>
      <rect width="400" height="300" fill="url(#s)"/>
      <circle cx="288" cy="196" r="34" fill="#fff3c4" opacity=".92"/>
      <path d="M0 232h400v68H0z" fill="#2b1f33" opacity=".82"/>
      <path d="M0 232 46 206l38 26 44-34 52 34 40-22 56 30 48-24 76 16v10H0z" fill="#241a2c"/>
      <g fill="#1b1422"><rect x="60" y="196" width="16" height="38"/><rect x="122" y="182" width="20" height="52"/>
        <rect x="196" y="190" width="14" height="44"/><rect x="300" y="186" width="22" height="48"/></g>
    </svg>`,
  grill: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="#cfd8dc"/>
      <rect y="210" width="400" height="90" fill="#a5b1b7"/>
      <ellipse cx="200" cy="150" rx="112" ry="34" fill="#37474f"/>
      <path d="M88 150h224l-16 62a26 26 0 0 1-25 20H129a26 26 0 0 1-25-20z" fill="#455a64"/>
      <g stroke="#90a4ae" stroke-width="5" stroke-linecap="round">
        <path d="M112 148h176M118 138h164M126 128h148"/></g>
      <g stroke="#546e7a" stroke-width="9" stroke-linecap="round">
        <path d="M126 226 96 288M274 226l30 62M200 232v56"/></g>
      <g fill="#ff7043" opacity=".85"><circle cx="168" cy="152" r="9"/><circle cx="204" cy="146" r="7"/><circle cx="236" cy="154" r="8"/></g>
    </svg>`,
  flowers: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="#f5eee6"/>
      <g stroke="#5c8a4a" stroke-width="6" fill="none" stroke-linecap="round">
        <path d="M120 300V168M200 300V140M280 300V180"/></g>
      <g fill="#e57ea0">
        <g transform="translate(120,158)"><circle r="26" cy="-16"/><circle r="26" cx="24" cy="8"/><circle r="26" cx="-24" cy="8"/></g>
        <g transform="translate(200,130)" fill="#f0a44a"><circle r="28" cy="-18"/><circle r="28" cx="26" cy="9"/><circle r="28" cx="-26" cy="9"/></g>
        <g transform="translate(280,170)" fill="#c77dff"><circle r="24" cy="-15"/><circle r="24" cx="22" cy="8"/><circle r="24" cx="-22" cy="8"/></g>
      </g>
      <g fill="#fff8e1"><circle cx="120" cy="152" r="12"/><circle cx="200" cy="124" r="13"/><circle cx="280" cy="164" r="11"/></g>
      <g fill="#5c8a4a" opacity=".8"><ellipse cx="146" cy="232" rx="24" ry="10" transform="rotate(-20 146 232)"/>
        <ellipse cx="230" cy="212" rx="26" ry="11" transform="rotate(18 230 212)"/></g>
    </svg>`,
  photo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#7fb3d5"/><stop offset="1" stop-color="#2e6f8e"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#g)"/>
      <circle cx="316" cy="70" r="30" fill="#fdf6d8" opacity=".9"/>
      <path d="M0 214l90-74 74 60 66-52 170 106v46H0z" fill="#1f4a5e" opacity=".85"/>
      <path d="M0 246l120-58 96 44 184-52v120H0z" fill="#15333f"/>
    </svg>`
};
const mediaURL = (key) => `data:image/svg+xml,${encodeURIComponent((MEDIA[key] || MEDIA.photo).replace(/\s+/g, ' '))}`;

/* --- papel de parede -------------------------------------------- */
(function doodle() {
  const marks = [];
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 46; i++) {
    const x = rnd() * 400, y = rnd() * 400, r = 6 + rnd() * 13, k = Math.floor(rnd() * 4);
    if (k === 0) marks.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}"/>`);
    else if (k === 1) marks.push(`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(r * 1.6).toFixed(1)}" height="${(r * 1.2).toFixed(1)}" rx="3"/>`);
    else if (k === 2) marks.push(`<path d="M${x.toFixed(1)} ${y.toFixed(1)}h${(r * 2).toFixed(1)}"/>`);
    else marks.push(`<path d="M${x.toFixed(1)} ${y.toFixed(1)}a${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${(r * 1.4).toFixed(1)} ${(r * .6).toFixed(1)}"/>`);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round">${marks.join('')}</svg>`;
  const apply = () => {
    const c = getComputedStyle(document.documentElement).getPropertyValue('--doodle').trim();
    document.documentElement.style.setProperty('--doodle-url',
      `url("data:image/svg+xml,${encodeURIComponent(svg.replace('COLOR', c))}")`);
  };
  window.__applyDoodle = apply;
  apply();
})();

/* ------------------------------------------------------------------
   Estado
------------------------------------------------------------------ */
let state = null;
let current = null;      // id da conversa aberta
let replyTo = null;      // id da mensagem sendo respondida
let findHits = [];
let findIdx = 0;
let botTimer = null;

function hydrate(raw) {
  const now = Date.now();
  const data = JSON.parse(JSON.stringify(raw));
  data.chats.forEach((c) => {
    c.type ??= 'dm';
    c.members ??= [];
    c.messages ??= [];
    c.messages.forEach((m, i) => {
      m.id ??= uid();
      m._ts = m.ts ?? (now + (Number(m.t) || 0) * 60000);
      m.type ??= 'text';
      if (m.from === 'me') m.status ??= 'read';
      m._i = i;
    });
    // resolve respostas declaradas por índice
    c.messages.forEach((m) => {
      if (m.replyToIdx != null && c.messages[m.replyToIdx]) m.replyTo = c.messages[m.replyToIdx].id;
    });
  });
  return data;
}

function dehydrate(s) {
  const now = Date.now();
  const out = JSON.parse(JSON.stringify(s));
  out.chats.forEach((c) => c.messages.forEach((m) => {
    m.t = Math.round((m._ts - now) / 60000);
    delete m._ts; delete m._i; delete m.replyToIdx;
  }));
  return out;
}

function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(dehydrate(state))); } catch (_) { /* modo privado */ }
}

function load() {
  let raw = null;
  try {
    const s = localStorage.getItem(STORE_KEY);
    if (s) raw = JSON.parse(s);
  } catch (_) { raw = null; }
  if (!raw || !Array.isArray(raw.chats)) raw = window.DEFAULT_DATA;
  state = hydrate(raw);
}

/* --- consultas -------------------------------------------------- */
const chatById = (id) => state.chats.find((c) => c.id === id);
const msgById  = (c, id) => c.messages.find((m) => m.id === id);
const lastMsg  = (c) => c.messages[c.messages.length - 1];

function speaker(chat, from) {
  if (from === 'me') return { id: 'me', name: state.profile.name, color: state.profile.color };
  if (from === chat.id || chat.type !== 'group') return { id: chat.id, name: chat.name, color: chat.color };
  return chat.members.find((m) => m.id === from) || { id: from, name: from, color: '#8696a0' };
}

function preview(chat) {
  const m = lastMsg(chat);
  if (!m) return { text: 'Sem mensagens', ts: 0 };
  let body;
  if (m.type === 'image') body = '📷 ' + (m.text || 'Foto');
  else if (m.type === 'audio') body = '🎤 Mensagem de voz (' + mmss(m.dur || 0) + ')';
  else if (m.type === 'doc') body = '📄 ' + (m.filename || 'Documento');
  else if (m.type === 'system') body = m.text;
  else body = m.text || '';
  const who = chat.type === 'group' && m.type !== 'system'
    ? (m.from === 'me' ? 'Você: ' : speaker(chat, m.from).name.split(' ')[0] + ': ')
    : '';
  return { text: who + body, ts: m._ts, out: m.from === 'me', status: m.status, system: m.type === 'system' };
}

/* ------------------------------------------------------------------
   Lista de conversas
------------------------------------------------------------------ */
let filter = 'all';
let query = '';

function matchesQuery(chat, q) {
  if (!q) return true;
  if (chat.name.toLowerCase().includes(q)) return true;
  return chat.messages.some((m) => (m.text || m.filename || '').toLowerCase().includes(q));
}

function renderList() {
  const list = $('#list');
  const q = query.trim().toLowerCase();

  let chats = state.chats.filter((c) => {
    if (filter === 'archived') return c.archived;
    if (c.archived) return false;
    if (filter === 'unread') return (c.unread || 0) > 0;
    if (filter === 'groups') return c.type === 'group';
    return true;
  }).filter((c) => matchesQuery(c, q));

  chats.sort((a, b) => {
    if (!!b.pinned !== !!a.pinned) return b.pinned ? 1 : -1;
    return (preview(b).ts || 0) - (preview(a).ts || 0);
  });

  if (!chats.length) {
    list.innerHTML = `<p class="empty-list">Nenhuma conversa encontrada${q ? ` para “${esc(query)}”` : ''}.</p>`;
    return;
  }

  const frag = document.createDocumentFragment();
  const archivedCount = state.chats.filter((c) => c.archived).length;
  if (filter === 'all' && archivedCount && !q) {
    const lbl = document.createElement('div');
    lbl.className = 'list-label';
    lbl.textContent = `${archivedCount} conversa${archivedCount > 1 ? 's' : ''} arquivada${archivedCount > 1 ? 's' : ''}`;
    frag.appendChild(lbl);
  }

  chats.forEach((c) => {
    const p = preview(c);
    const row = document.createElement('div');
    row.className = 'row' + (c.id === current ? ' sel' : '') + (c.unread ? ' has-unread' : '');
    row.dataset.id = c.id;
    row.setAttribute('role', 'listitem');
    row.tabIndex = 0;

    let tick = '';
    if (p.out && !p.system) {
      const read = p.status === 'read';
      tick = `<svg class="tick${read ? ' read' : ''}" width="16" height="15"><use href="#${p.status === 'sent' ? 'i-tick1' : 'i-tick2'}"></use></svg>`;
    }

    row.innerHTML = `
      <span class="avatar"></span>
      <div class="row-body">
        <div class="row-top">
          <span class="row-name">${esc(c.name)}</span>
          <span class="row-time">${p.ts ? listTime(p.ts) : ''}</span>
        </div>
        <div class="row-bot">
          <span class="row-prev">${tick}<span>${esc(p.text).slice(0, 120)}</span></span>
          <span class="row-flags">
            ${c.muted ? '<svg><use href="#i-mute"></use></svg>' : ''}
            ${c.pinned ? '<svg><use href="#i-pin"></use></svg>' : ''}
          </span>
          ${c.unread ? `<span class="badge">${c.unread}</span>` : ''}
        </div>
      </div>`;
    paintAvatar($('.avatar', row), c.name, c.color);
    frag.appendChild(row);
  });

  list.replaceChildren(frag);
}

/* ------------------------------------------------------------------
   Mensagens
------------------------------------------------------------------ */
function tickSVG(status) {
  if (!status) return '';
  const read = status === 'read';
  const sym = status === 'sent' ? 'i-tick1' : 'i-tick2';
  return `<svg class="tick${read ? ' read' : ''}" width="16" height="15" aria-label="${
    status === 'sent' ? 'Enviada' : read ? 'Lida' : 'Entregue'}"><use href="#${sym}"></use></svg>`;
}

function quoteHTML(chat, m) {
  if (!m.replyTo) return '';
  const src = msgById(chat, m.replyTo);
  if (!src) return '';
  const sp = speaker(chat, src.from);
  let body = src.text || '';
  if (src.type === 'image') body = '📷 ' + (src.text || 'Foto');
  if (src.type === 'audio') body = '🎤 Mensagem de voz';
  if (src.type === 'doc') body = '📄 ' + src.filename;
  return `<span class="quote" data-goto="${src.id}" style="--qc:${sp.color}">
    <b>${esc(src.from === 'me' ? 'Você' : sp.name)}</b><span>${esc(body)}</span></span>`;
}

function bodyHTML(chat, m, meta) {
  switch (m.type) {
    case 'image':
      return `<span class="thumb" data-img="${esc(m.media || 'photo')}">
                <img src="${mediaURL(m.media)}" alt="${esc(m.text || 'Foto enviada na conversa')}" loading="lazy">
              </span>` + (m.text ? `<div class="text">${linkify(esc(m.text))}${meta}</div>` : meta);
    case 'audio': {
      const bars = Array.from({ length: 34 }, (_, i) => {
        const h = 4 + Math.abs(Math.sin((i + 1) * 1.7 + (m.dur || 5))) * 20;
        return `<i style="height:${h.toFixed(0)}px"></i>`;
      }).join('');
      return `<div class="audio" data-audio="${m.id}" data-dur="${m.dur || 10}">
                <button class="play" aria-label="Reproduzir"><svg><use href="#i-play"></use></svg></button>
                <span class="wave">${bars}</span>
                <span class="dur">${mmss(m.dur || 10)}</span>
              </div><div class="metabar">${meta}</div>`;
    }
    case 'doc':
      return `<div class="doc"><svg><use href="#i-doc"></use></svg>
                <span class="dn"><b>${esc(m.filename || 'arquivo')}</b>
                <span>${m.pages ? m.pages + ' páginas · ' : ''}${esc(m.size || '')}</span></span>
              </div><div class="metabar">${meta}</div>`;
    default:
      return `<div class="text">${linkify(esc(m.text || ''))}${meta}</div>`;
  }
}

function renderMessages(keepScroll = false) {
  const chat = chatById(current);
  const box = $('#messages');
  const inner = $('#msgInner');
  if (!chat) return;

  const prevTop = box.scrollTop;
  const frag = document.createDocumentFragment();
  let lastDay = null, lastFrom = null;

  const notice = document.createElement('div');
  notice.className = 'notice';
  notice.textContent = 'As mensagens desta conversa são fictícias e foram geradas por um app de demonstração.';
  frag.appendChild(notice);

  chat.messages.forEach((m) => {
    const d = startOfDay(m._ts).getTime();
    if (d !== lastDay) {
      const div = document.createElement('div');
      div.className = 'divider';
      div.textContent = dayLabel(m._ts);
      frag.appendChild(div);
      lastDay = d; lastFrom = null;
    }

    if (m.type === 'system') {
      const s = document.createElement('div');
      s.className = 'sysmsg';
      s.textContent = m.text;
      frag.appendChild(s);
      lastFrom = null;
      return;
    }

    const out = m.from === 'me';
    const first = m.from !== lastFrom;
    lastFrom = m.from;
    const sp = speaker(chat, m.from);

    const wrap = document.createElement('div');
    wrap.className = `msg ${out ? 'out' : 'in'}${first ? ' first' : ''}`;
    wrap.dataset.id = m.id;

    const meta = `<span class="meta">${hhmm(m._ts)}${out ? tickSVG(m.status) : ''}</span>`;
    const isMediaOnly = m.type === 'image' && !m.text;
    const showSender = chat.type === 'group' && !out && first;

    const reacts = m.reactions && Object.keys(m.reactions).length
      ? `<span class="reacts">${Object.entries(m.reactions).map(([e, n]) => `${e}${n > 1 ? ' ' + n : ''}`).join(' ')}</span>`
      : '';

    wrap.innerHTML = `
      <div class="bubble${m.type === 'image' ? ' media' : ''}${isMediaOnly ? ' no-caption' : ''}">
        ${showSender ? `<div class="sender" style="color:${sp.color}">${esc(sp.name)}</div>` : ''}
        ${quoteHTML(chat, m)}
        ${bodyHTML(chat, m, meta)}
        ${reacts}
      </div>
      <button class="act" aria-label="Opções da mensagem"><svg><use href="#i-down"></use></svg></button>`;
    frag.appendChild(wrap);
  });

  inner.replaceChildren(frag);
  if (keepScroll) {
    box.scrollTop = prevTop;
  } else {
    // imagens só entram no layout depois; reencosta no fim quando isso acontecer
    box.scrollTop = box.scrollHeight;
    requestAnimationFrame(() => { box.scrollTop = box.scrollHeight; });
    $$('img', inner).forEach((img) => {
      if (!img.complete) img.addEventListener('load', () => { box.scrollTop = box.scrollHeight; }, { once: true });
    });
  }
  applyFindHighlight();
}

function nearBottom() {
  const b = $('#messages');
  return b.scrollHeight - b.scrollTop - b.clientHeight < 140;
}
const scrollBottom = (smooth) => {
  const b = $('#messages');
  b.scrollTo({ top: b.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
};

/* ------------------------------------------------------------------
   Abrir / fechar conversa
------------------------------------------------------------------ */
function openChat(id) {
  const chat = chatById(id);
  if (!chat) return;
  clearTimeout(botTimer);
  current = id;
  chat.unread = 0;
  replyTo = null;
  $('#replyBar').classList.remove('on');
  closeFind();

  $('#paneEmpty').hidden = true;
  $('#paneEmpty').style.display = 'none';
  $('#paneChat').hidden = false;
  document.body.classList.add('chat-open');

  paintAvatar($('#headAvatar'), chat.name, chat.color);
  $('#headName').textContent = chat.name;
  $('#headSub').textContent = chat.type === 'group'
    ? ['Você', ...chat.members.map((m) => m.name)].join(', ')
    : (chat.presence || chat.about || 'clique aqui para ver os dados');

  renderMessages();
  renderList();
  save();
  if (window.innerWidth > 860) $('#input').focus();
}

function closeChat() {
  current = null;
  document.body.classList.remove('chat-open');
  $('#paneChat').hidden = true;
  $('#paneEmpty').hidden = false;
  $('#paneEmpty').style.display = '';
  renderList();
}

/* ------------------------------------------------------------------
   Envio + motor de respostas
------------------------------------------------------------------ */
function pushMessage(chat, msg) {
  msg.id ??= uid();
  msg._ts ??= Date.now();
  chat.messages.push(msg);
  return msg;
}

function send() {
  const chat = chatById(current);
  const ta = $('#input');
  const text = ta.value.trim();
  if (!chat || !text) return;

  const m = pushMessage(chat, { from: 'me', type: 'text', text, status: 'sent', replyTo });
  ta.value = ''; ta.style.height = 'auto';
  replyTo = null;
  $('#replyBar').classList.remove('on');
  updateSendIcon();
  renderMessages();
  renderList();
  save();

  // ticks progressivos
  setTimeout(() => { m.status = 'delivered'; if (current === chat.id) renderMessages(true); renderList(); save(); }, rand(500, 1100));
  setTimeout(() => { m.status = 'read'; if (current === chat.id) renderMessages(true); renderList(); save(); }, rand(1600, 3000));

  scheduleReply(chat, text);
}

function scheduleReply(chat, userText) {
  const bot = chat.bot;
  if (!bot) return;
  clearTimeout(botTimer);

  const low = userText.toLowerCase();
  let outgoing = null;

  for (const rule of (bot.rules || [])) {
    let re;
    try { re = new RegExp(rule.match, 'i'); } catch (_) { continue; }
    if (re.test(low)) {
      outgoing = { from: rule.from || chat.id, text: pick(rule.replies) };
      break;
    }
  }
  if (!outgoing) {
    const f = pick(bot.fallback || []);
    if (!f) return;
    outgoing = typeof f === 'string' ? { from: chat.id, text: f } : { from: f.from, text: f.text };
  }

  const [lo, hi] = bot.typingMs || [800, 2000];
  const delay = rand(lo, hi);

  showTyping(chat, outgoing.from, delay);
  botTimer = setTimeout(() => {
    hideTyping();
    pushMessage(chat, { from: outgoing.from, type: 'text', text: outgoing.text });
    if (current === chat.id) {
      const stick = nearBottom();
      renderMessages(!stick);
      if (stick) scrollBottom(true);
    } else {
      chat.unread = (chat.unread || 0) + 1;
    }
    renderList();
    save();
  }, delay);
}

let typingEl = null;
function showTyping(chat, from, ms) {
  if (current !== chat.id) return;
  hideTyping();
  const sp = speaker(chat, from);
  typingEl = document.createElement('div');
  typingEl.className = 'msg in first';
  typingEl.innerHTML = `<div class="bubble">
      ${chat.type === 'group' ? `<div class="sender" style="color:${sp.color}">${esc(sp.name)}</div>` : ''}
      <div class="typing"><i></i><i></i><i></i></div>
    </div>`;
  $('#msgInner').appendChild(typingEl);
  if (ms) $('#headSub').textContent = 'digitando…';
  if (nearBottom()) scrollBottom(true);
}
function hideTyping() {
  typingEl?.remove();
  typingEl = null;
  const chat = chatById(current);
  if (chat) $('#headSub').textContent = chat.type === 'group'
    ? ['Você', ...chat.members.map((m) => m.name)].join(', ')
    : (chat.presence || chat.about || '');
}

/* ------------------------------------------------------------------
   Busca dentro da conversa
------------------------------------------------------------------ */
function openFind() {
  $('#findBar').classList.add('on');
  $('#findInput').focus();
}
function closeFind() {
  $('#findBar').classList.remove('on');
  $('#findInput').value = '';
  findHits = []; findIdx = 0;
  $('#findCount').textContent = '';
  $$('#msgInner mark').forEach((m) => m.replaceWith(...m.childNodes));
}

function applyFindHighlight() {
  const q = $('#findInput').value.trim().toLowerCase();
  findHits = [];
  if (!q) { $('#findCount').textContent = ''; return; }

  $$('#msgInner .msg').forEach((el) => {
    const t = $('.text', el);
    if (!t) return;
    if (t.textContent.toLowerCase().includes(q)) {
      findHits.push(el);
      highlightIn(t, q);
    }
  });
  findIdx = clamp(findIdx, 0, Math.max(0, findHits.length - 1));
  $('#findCount').textContent = findHits.length ? `${findIdx + 1} de ${findHits.length}` : 'nenhum resultado';
}

function highlightIn(root, q) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((n) => {
    const idx = n.nodeValue.toLowerCase().indexOf(q);
    if (idx < 0 || !n.parentElement || n.parentElement.closest('.meta')) return;
    const mark = document.createElement('mark');
    const after = n.splitText(idx);
    after.splitText(q.length);
    mark.textContent = after.nodeValue;
    after.replaceWith(mark);
  });
}

function gotoHit(step) {
  if (!findHits.length) return;
  findIdx = (findIdx + step + findHits.length) % findHits.length;
  $('#findCount').textContent = `${findIdx + 1} de ${findHits.length}`;
  flashTo(findHits[findIdx]);
}

function flashTo(el) {
  el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  el.classList.remove('flash');
  void el.offsetWidth;
  el.classList.add('flash');
}

/* ------------------------------------------------------------------
   Menu flutuante
------------------------------------------------------------------ */
function showMenu(x, y, items) {
  const menu = $('#menu');
  menu.innerHTML = '';
  items.forEach((it) => {
    if (it === '-') { menu.appendChild(document.createElement('hr')); return; }
    if (it.reactions) {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;gap:2px;padding:4px 10px 8px;';
      ['👍', '❤️', '😂', '😮', '😢', '🙏'].forEach((e) => {
        const b = document.createElement('button');
        b.textContent = e;
        b.style.cssText = 'font-size:20px;padding:4px 6px;border-radius:6px;width:auto;';
        b.onclick = () => { hideMenu(); it.onPick(e); };
        row.appendChild(b);
      });
      menu.appendChild(row);
      return;
    }
    const b = document.createElement('button');
    b.textContent = it.label;
    if (it.danger) b.className = 'danger';
    b.onclick = () => { hideMenu(); it.run(); };
    menu.appendChild(b);
  });
  menu.classList.add('on');
  const r = menu.getBoundingClientRect();
  menu.style.left = clamp(x, 8, innerWidth - r.width - 8) + 'px';
  menu.style.top = clamp(y, 8, innerHeight - r.height - 8) + 'px';
}
const hideMenu = () => $('#menu').classList.remove('on');

/* ------------------------------------------------------------------
   Modal
------------------------------------------------------------------ */
function modal(title, bodyHTMLStr, footerNodes = []) {
  $('#modalTitle').textContent = title;
  $('#modalBody').innerHTML = bodyHTMLStr;
  const foot = $('#modalFoot');
  foot.replaceChildren(...footerNodes);
  $('#overlay').classList.add('on');
  return $('#modalBody');
}
const closeModal = () => $('#overlay').classList.remove('on');

function btn(label, cls, fn) {
  const b = document.createElement('button');
  b.className = 'btn ' + (cls || '');
  b.textContent = label;
  b.onclick = fn;
  return b;
}

/* ------------------------------------------------------------------
   Ações da conversa
------------------------------------------------------------------ */
function exportChat(chat) {
  const lines = chat.messages.map((m) => {
    const d = new Date(m._ts);
    const stamp = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${hhmm(m._ts)}`;
    if (m.type === 'system') return `${stamp} - ${m.text}`;
    const who = m.from === 'me' ? state.profile.name : speaker(chat, m.from).name;
    let body = m.text || '';
    if (m.type === 'image') body = `<Arquivo de mídia oculto>${m.text ? ' ' + m.text : ''}`;
    if (m.type === 'audio') body = '<Arquivo de mídia oculto>';
    if (m.type === 'doc') body = `${m.filename} <anexado>`;
    return `${stamp} - ${who}: ${body}`;
  });
  lines.unshift('*** Conversa fictícia gerada pelo ZapClone — não é um registro real. ***', '');
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `conversa-ficticia-${chat.id}.txt`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

function showProfile(chat) {
  const members = chat.type === 'group'
    ? `<div class="field"><small>${chat.members.length + 1} participantes</small><div class="members" id="mlist"></div></div>`
    : '';
  const body = modal(chat.type === 'group' ? 'Dados do grupo' : 'Dados do contato', `
    <div class="profile">
      <span class="avatar" id="pAvatar"></span>
      <h4>${esc(chat.name)}</h4>
      <div class="sub">${esc(chat.type === 'group' ? `Grupo · ${chat.members.length + 1} participantes` : (chat.phone || 'número fictício'))}</div>
      <div class="field"><small>Recado</small>${esc(chat.about || '—')}</div>
      <div class="field"><small>Mensagens</small>${chat.messages.length} nesta conversa</div>
      ${members}
    </div>`, [btn('Fechar', '', closeModal)]);

  paintAvatar($('#pAvatar', body), chat.name, chat.color);
  const ml = $('#mlist', body);
  if (ml) {
    const meName = /^voc[êe]$/i.test(state.profile.name) ? state.profile.name : `${state.profile.name} (você)`;
    [{ id: 'me', name: meName, color: state.profile.color }, ...chat.members].forEach((p) => {
      const row = document.createElement('div');
      row.innerHTML = '<span class="avatar xs"></span><span></span>';
      paintAvatar($('.avatar', row), p.name, p.color);
      $('span:last-child', row).textContent = p.name;
      ml.appendChild(row);
    });
  }
}

function chatMenu(x, y, chat) {
  showMenu(x, y, [
    { label: chat.type === 'group' ? 'Dados do grupo' : 'Dados do contato', run: () => showProfile(chat) },
    { label: 'Pesquisar na conversa', run: openFind },
    '-',
    { label: chat.pinned ? 'Desafixar' : 'Fixar conversa', run: () => { chat.pinned = !chat.pinned; renderList(); save(); } },
    { label: chat.muted ? 'Reativar notificações' : 'Silenciar', run: () => { chat.muted = !chat.muted; renderList(); save(); } },
    { label: chat.archived ? 'Desarquivar' : 'Arquivar', run: () => { chat.archived = !chat.archived; if (chat.archived) closeChat(); renderList(); save(); } },
    { label: 'Marcar como não lida', run: () => { chat.unread = 1; closeChat(); save(); } },
    '-',
    { label: 'Exportar conversa (.txt)', run: () => exportChat(chat) },
    { label: 'Limpar conversa', danger: true, run: () => { chat.messages = []; renderMessages(); renderList(); save(); } },
    { label: 'Apagar conversa', danger: true, run: () => {
        state.chats = state.chats.filter((c) => c.id !== chat.id);
        closeChat(); save();
      } }
  ]);
}

function messageMenu(x, y, chat, m) {
  showMenu(x, y, [
    { reactions: true, onPick: (e) => {
        m.reactions ??= {};
        m.reactions[e] = (m.reactions[e] || 0) + 1;
        renderMessages(true); save();
      } },
    { label: 'Responder', run: () => startReply(chat, m) },
    { label: 'Copiar texto', run: () => navigator.clipboard?.writeText(m.text || m.filename || '') },
    '-',
    { label: 'Apagar mensagem', danger: true, run: () => {
        chat.messages = chat.messages.filter((x) => x.id !== m.id);
        renderMessages(true); renderList(); save();
      } }
  ]);
}

function startReply(chat, m) {
  replyTo = m.id;
  const sp = speaker(chat, m.from);
  const bar = $('#replyBar');
  bar.classList.add('on');
  bar.style.setProperty('--qc', sp.color);
  $('#replyWho').textContent = m.from === 'me' ? 'Você' : sp.name;
  $('#replyText').textContent = m.text || (m.type === 'image' ? '📷 Foto' : m.type === 'audio' ? '🎤 Mensagem de voz' : '📄 ' + (m.filename || 'Documento'));
  $('#input').focus();
}

/* ------------------------------------------------------------------
   Editor de roteiro
------------------------------------------------------------------ */
function openEditor() {
  const json = JSON.stringify(dehydrate(state), null, 2);
  const status = document.createElement('span');
  status.className = 'msgline';
  status.textContent = 'Edite o JSON e clique em Aplicar.';

  const body = modal('Editor de roteiro', `
    <p>
      Todo o app é gerado a partir deste objeto. Altere nomes, adicione contatos, escreva as mensagens
      que quiser e clique em <b>Aplicar</b>. O campo <code>t</code> é “minutos atrás” (negativo = passado);
      <code>type</code> aceita <code>text</code>, <code>image</code>, <code>audio</code>, <code>doc</code> e
      <code>system</code>. As respostas automáticas ficam em <code>bot</code>.
      Mantenha os personagens fictícios.
    </p>
    <textarea class="editor" id="edit" spellcheck="false"></textarea>`, [
      status,
      btn('Restaurar exemplo', '', () => {
        $('#edit').value = JSON.stringify(window.DEFAULT_DATA, null, 2);
        status.className = 'msgline'; status.textContent = 'Exemplo carregado — clique em Aplicar.';
      }),
      btn('Cancelar', '', closeModal),
      btn('Aplicar', 'primary', () => {
        try {
          const parsed = JSON.parse($('#edit').value);
          if (!parsed || !Array.isArray(parsed.chats)) throw new Error('Falta a lista "chats".');
          state = hydrate(parsed);
          current = null;
          save(); renderList(); closeChat(); closeModal();
        } catch (e) {
          status.className = 'msgline err';
          status.textContent = 'JSON inválido: ' + e.message;
        }
      })
    ]);
  $('#edit', body).value = json;
}

/* ------------------------------------------------------------------
   Nova conversa
------------------------------------------------------------------ */
function openNew() {
  const status = document.createElement('span');
  status.className = 'msgline';

  const body = modal('Nova conversa fictícia', `
    <p>Crie um contato ou grupo inventado. Use nomes fictícios — este app não é para reconstruir conversas de pessoas reais.</p>
    <label style="display:block;margin-bottom:12px">
      <small style="display:block;color:var(--text-2);margin-bottom:4px">Nome</small>
      <input id="nName" class="editor" style="min-height:0;height:40px;padding:8px 12px;font-family:var(--font);font-size:14.5px" placeholder="Ex.: Joana Vilar">
    </label>
    <label style="display:block;margin-bottom:12px">
      <small style="display:block;color:var(--text-2);margin-bottom:4px">Tipo</small>
      <select id="nType" class="editor" style="min-height:0;height:40px;padding:8px 12px;font-family:var(--font);font-size:14.5px">
        <option value="dm">Contato</option>
        <option value="group">Grupo</option>
      </select>
    </label>
    <label style="display:block">
      <small style="display:block;color:var(--text-2);margin-bottom:4px">Participantes do grupo (um por linha)</small>
      <textarea id="nMembers" class="editor" style="min-height:90px" placeholder="Joana Vilar&#10;Rui Bastos"></textarea>
    </label>`, [
      status,
      btn('Cancelar', '', closeModal),
      btn('Criar', 'primary', () => {
        const name = $('#nName').value.trim();
        if (!name) { status.className = 'msgline err'; status.textContent = 'Dê um nome à conversa.'; return; }
        const type = $('#nType').value;
        const palette = ['#e57373', '#6a8cff', '#c77dff', '#4db6ac', '#f0a44a', '#ec9bb6', '#8d6e63', '#5b8def'];
        const members = type === 'group'
          ? $('#nMembers').value.split('\n').map((s) => s.trim()).filter(Boolean)
              .map((n, i) => ({ id: 'p' + i + Math.random().toString(36).slice(2, 5), name: n, color: palette[i % palette.length] }))
          : [];
        const id = 'c' + Math.random().toString(36).slice(2, 8);
        const color = palette[state.chats.length % palette.length];
        const chat = {
          id, name, type, color, members,
          about: type === 'group' ? 'grupo fictício' : 'contato fictício',
          messages: type === 'group'
            ? [{ id: uid(), from: 'system', type: 'system', text: `Você criou o grupo "${name}"`, _ts: Date.now() }]
            : [],
          bot: { typingMs: [800, 2000], rules: [], fallback: type === 'group'
            ? (members.length ? members.map((m) => ({ from: m.id, text: 'ok!' })) : ['ok!'])
            : ['oi!', 'tudo bem?', 'combinado', '👍'] }
        };
        state.chats.unshift(chat);
        save(); closeModal(); renderList(); openChat(id);
      })
    ]);
  setTimeout(() => $('#nName', body)?.focus(), 30);
}

/* ------------------------------------------------------------------
   Sobre
------------------------------------------------------------------ */
function openAbout() {
  modal('Sobre o ZapClone', `
    <p><b>O que é:</b> uma recriação da interface de um aplicativo de mensagens, escrita do zero em
    HTML, CSS e JavaScript puro — sem frameworks, sem build e sem nenhuma chamada de rede.
    As fotos são SVGs gerados no próprio navegador.</p>
    <p><b>O que não é:</b> uma ferramenta para fabricar conversas atribuídas a pessoas reais.
    Os contatos que vêm de exemplo são inventados, e o texto de rodapé deixa isso explícito na tela.
    Prints gerados aqui não são registro de nada.</p>
    <p><b>Onde ficam os dados:</b> apenas no <code>localStorage</code> deste navegador. Nada é enviado
    a lugar nenhum. Limpar os dados do site apaga tudo.</p>
    <p><b>Atalhos:</b><br>
      <code>/</code> — pesquisar conversas &nbsp;·&nbsp;
      <code>Ctrl/⌘ + F</code> — pesquisar na conversa aberta<br>
      <code>Esc</code> — fechar menu, busca ou modal &nbsp;·&nbsp;
      <code>Enter</code> — enviar &nbsp;·&nbsp; <code>Shift + Enter</code> — quebrar linha</p>`,
    [btn('Editor de roteiro', '', () => { closeModal(); openEditor(); }),
     btn('Fechar', 'primary', closeModal)]);
}

/* ------------------------------------------------------------------
   Tema
------------------------------------------------------------------ */
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  $('#btnTheme use').setAttribute('href', t === 'dark' ? '#i-sun' : '#i-moon');
  try { localStorage.setItem(THEME_KEY, t); } catch (_) {}
  window.__applyDoodle();
}

/* ------------------------------------------------------------------
   Composer helpers
------------------------------------------------------------------ */
function updateSendIcon() {
  const has = $('#input').value.trim().length > 0;
  $('#btnSend use').setAttribute('href', has ? '#i-send' : '#i-mic');
  $('#btnSend').title = has ? 'Enviar' : 'Gravar áudio (simulado)';
}

function autoGrow() {
  const ta = $('#input');
  ta.style.height = 'auto';
  ta.style.height = Math.min(ta.scrollHeight, 100) + 'px';
}

const EMOJIS = ['😀','😂','🥹','😅','😊','😍','😘','🤔','🙃','😴','😭','😡','👍','👎','🙏','👏','💪','🔥','✨','🎉','❤️','💚','💔','☕','🍺','🍕','🍔','🥗','⚽','🚗','✈️','🏖️','🌧️','☀️','🌙','💡','📌','✅','❌','🤝','🐶','🐱','🎸','📷','🎧','💻','📚','⏰'];

function buildEmoji() {
  const pop = $('#emojiPop');
  EMOJIS.forEach((e) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = e;
    b.onclick = () => {
      const ta = $('#input');
      const s = ta.selectionStart ?? ta.value.length;
      ta.value = ta.value.slice(0, s) + e + ta.value.slice(ta.selectionEnd ?? s);
      ta.focus();
      ta.selectionStart = ta.selectionEnd = s + e.length;
      autoGrow(); updateSendIcon();
    };
    pop.appendChild(b);
  });
}

function attachMenu(x, y) {
  const chat = chatById(current);
  if (!chat) return;
  const add = (msg) => {
    pushMessage(chat, Object.assign({ from: 'me', status: 'sent' }, msg));
    renderMessages(); renderList(); save();
    setTimeout(() => { const l = lastMsg(chat); if (l) l.status = 'read'; renderMessages(true); renderList(); save(); }, 1400);
  };
  showMenu(x, y, [
    { label: '📷  Foto (gerada)', run: () => add({ type: 'image', media: pick(['photo', 'sunset', 'flowers', 'grill']) }) },
    { label: '🎤  Mensagem de voz', run: () => add({ type: 'audio', dur: Math.round(rand(6, 95)) }) },
    { label: '📄  Documento', run: () => add({ type: 'doc', filename: 'anotacoes.pdf', pages: Math.round(rand(1, 12)), size: Math.round(rand(40, 900)) + ' kB' }) }
  ]);
}

/* --- reprodução simulada de áudio -------------------------------- */
const audioTimers = new Map();
function toggleAudio(el) {
  const id = el.dataset.audio;
  const dur = Number(el.dataset.dur) || 10;
  const bars = $$('.wave i', el);
  const durEl = $('.dur', el);
  const icon = $('.play use', el);

  if (audioTimers.has(id)) {
    clearInterval(audioTimers.get(id).timer);
    audioTimers.delete(id);
    icon.setAttribute('href', '#i-play');
    durEl.textContent = mmss(dur);
    bars.forEach((b) => b.classList.remove('on'));
    return;
  }
  let t = 0;
  icon.setAttribute('href', '#i-pause');
  const timer = setInterval(() => {
    t += 0.12;
    const p = t / dur;
    if (p >= 1) {
      clearInterval(timer); audioTimers.delete(id);
      icon.setAttribute('href', '#i-play');
      durEl.textContent = mmss(dur);
      bars.forEach((b) => b.classList.remove('on'));
      return;
    }
    durEl.textContent = mmss(dur - t);
    bars.forEach((b, i) => b.classList.toggle('on', i / bars.length <= p));
  }, 120);
  audioTimers.set(id, { timer });
}

/* ------------------------------------------------------------------
   Eventos
------------------------------------------------------------------ */
function wire() {
  /* lista */
  $('#list').addEventListener('click', (e) => {
    const row = e.target.closest('.row');
    if (row) openChat(row.dataset.id);
  });
  $('#list').addEventListener('keydown', (e) => {
    const row = e.target.closest('.row');
    if (row && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openChat(row.dataset.id); }
  });
  $('#list').addEventListener('contextmenu', (e) => {
    const row = e.target.closest('.row');
    if (!row) return;
    e.preventDefault();
    chatMenu(e.clientX, e.clientY, chatById(row.dataset.id));
  });

  /* filtros e busca global */
  $$('.chip').forEach((c) => c.addEventListener('click', () => {
    $$('.chip').forEach((o) => o.setAttribute('aria-pressed', String(o === c)));
    filter = c.dataset.filter;
    renderList();
  }));
  $('#q').addEventListener('input', (e) => { query = e.target.value; renderList(); });

  /* cabeçalho */
  $('#btnBack').onclick = closeChat;
  $('#btnProfile').onclick = () => showProfile(chatById(current));
  $('#btnProfile').onkeydown = (e) => { if (e.key === 'Enter') showProfile(chatById(current)); };
  $('#btnFind').onclick = openFind;
  $('#btnChatMenu').onclick = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    chatMenu(r.right - 210, r.bottom + 4, chatById(current));
  };

  /* busca na conversa */
  $('#findInput').addEventListener('input', () => { findIdx = 0; renderMessages(true); if (findHits[0]) flashTo(findHits[0]); });
  $('#findInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); gotoHit(e.shiftKey ? -1 : 1); }
    if (e.key === 'Escape') closeFind();
  });
  $('#findNext').onclick = () => gotoHit(1);
  $('#findPrev').onclick = () => gotoHit(-1);
  $('#findClose').onclick = () => { closeFind(); renderMessages(true); };

  /* área de mensagens */
  $('#messages').addEventListener('click', (e) => {
    const audio = e.target.closest('[data-audio]');
    if (audio) { toggleAudio(audio); return; }

    const img = e.target.closest('[data-img]');
    if (img) {
      $('#lightboxImg').src = mediaURL(img.dataset.img);
      $('#lightbox').classList.add('on');
      return;
    }
    const quote = e.target.closest('[data-goto]');
    if (quote) {
      const el = $(`#msgInner .msg[data-id="${quote.dataset.goto}"]`);
      if (el) flashTo(el);
      return;
    }
    const act = e.target.closest('.act');
    if (act) {
      const wrap = act.closest('.msg');
      const chat = chatById(current);
      const m = msgById(chat, wrap.dataset.id);
      const r = act.getBoundingClientRect();
      messageMenu(r.left - 150, r.bottom + 4, chat, m);
    }
  });
  $('#messages').addEventListener('contextmenu', (e) => {
    const wrap = e.target.closest('.msg');
    if (!wrap || !wrap.dataset.id) return;
    e.preventDefault();
    const chat = chatById(current);
    messageMenu(e.clientX, e.clientY, chat, msgById(chat, wrap.dataset.id));
  });
  $('#messages').addEventListener('dblclick', (e) => {
    const wrap = e.target.closest('.msg');
    if (!wrap?.dataset.id) return;
    const chat = chatById(current);
    startReply(chat, msgById(chat, wrap.dataset.id));
  });
  $('#messages').addEventListener('scroll', () => {
    $('#btnJump').classList.toggle('on', !nearBottom());
  });
  $('#btnJump').onclick = () => scrollBottom(true);

  /* compositor */
  const ta = $('#input');
  ta.addEventListener('input', () => { autoGrow(); updateSendIcon(); });
  ta.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
  $('#btnSend').onclick = () => {
    if ($('#input').value.trim()) send();
    else {
      const chat = chatById(current);
      if (!chat) return;
      pushMessage(chat, { from: 'me', type: 'audio', dur: Math.round(rand(4, 40)), status: 'sent' });
      renderMessages(); renderList(); save();
    }
  };
  $('#btnEmoji').onclick = (e) => { e.stopPropagation(); $('#emojiPop').classList.toggle('on'); };
  $('#btnAttach').onclick = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    attachMenu(r.left, r.top - 130);
  };
  $('#replyCancel').onclick = () => { replyTo = null; $('#replyBar').classList.remove('on'); };

  /* topo */
  $('#btnTheme').onclick = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  $('#btnEditor').onclick = openEditor;
  $('#btnNew').onclick = openNew;
  $('#btnAbout').onclick = openAbout;

  /* modais e camadas */
  $('#modalClose').onclick = closeModal;
  $('#overlay').addEventListener('click', (e) => { if (e.target.id === 'overlay') closeModal(); });
  $('#lightboxClose').onclick = () => $('#lightbox').classList.remove('on');
  $('#lightbox').addEventListener('click', (e) => { if (e.target.id === 'lightbox') $('#lightbox').classList.remove('on'); });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#menu')) hideMenu();
    if (!e.target.closest('#emojiPop') && !e.target.closest('#btnEmoji')) $('#emojiPop').classList.remove('on');
  });

  /* atalhos */
  document.addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
    if (e.key === 'Escape') {
      if ($('#lightbox').classList.contains('on')) return $('#lightbox').classList.remove('on');
      if ($('#overlay').classList.contains('on')) return closeModal();
      if ($('#menu').classList.contains('on')) return hideMenu();
      if ($('#findBar').classList.contains('on')) { closeFind(); return renderMessages(true); }
      if (document.body.classList.contains('chat-open') && innerWidth <= 860) return closeChat();
    }
    if (e.key === '/' && !typing) { e.preventDefault(); $('#q').focus(); }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f' && current) { e.preventDefault(); openFind(); }
  });

  window.addEventListener('resize', () => {
    if (innerWidth > 860 && !current) document.body.classList.remove('chat-open');
  });
}

/* ------------------------------------------------------------------
   Boot
------------------------------------------------------------------ */
(function init() {
  let t = 'light';
  try { t = localStorage.getItem(THEME_KEY) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); } catch (_) {}
  setTheme(t);

  load();
  paintAvatar($('#meAvatar'), state.profile.name, state.profile.color);
  buildEmoji();
  wire();
  renderList();
  updateSendIcon();

  if (innerWidth > 860) {
    const first = state.chats.find((c) => !c.archived);
    if (first) openChat(first.id);
  }
})();
