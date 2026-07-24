import { createStarfield } from './starfield.js';
import { createIntro } from './intro.js';
import { createTravel } from './travel.js';
import * as store from './store.js';

const TYPE_LABEL = { poem: '诗歌', essay: '美文', quote: '金句' };
const state = {
  token: localStorage.getItem('ev_token'),
  user: null,
  items: [],
  favSet: new Set(),
  field: null,
  filter: { type: '', theme: '', q: '' }
};

const $ = (s) => document.querySelector(s);
const tooltip = $('#tooltip');

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.add('hidden'), 1800);
}
// ---------- 语音朗读(健壮版:解决 cancel 竞态 + 声音未加载) ----------
let _voices = [];
function loadVoices() {
  try { _voices = window.speechSynthesis.getVoices() || []; } catch { _voices = []; }
}
if ('speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}
function pickVoice() {
  if (!_voices.length) loadVoices();
  return _voices.find(v => /^en[-_]?US/i.test(v.lang))
    || _voices.find(v => /^en[-_]?(GB|IE|AU)/i.test(v.lang))
    || _voices.find(v => /^en/i.test(v.lang))
    || _voices.find(v => /english/i.test(v.name))
    || _voices[0] || null;
}
// 多语言语音:按语种/方言选取对应 voice 朗读
const TRANS_LANG = { zh: 'zh-CN', en: 'en', fr: 'fr', ja: 'ja', ru: 'ru', ko: 'ko', de: 'de', es: 'es' };
function pickVoiceFor(code) {
  if (!_voices.length) loadVoices();
  if (!_voices.length) return null;
  let v = _voices.find(x => x.lang === code);
  if (v) return v;
  const pre = (code.split('-')[0] || '').toLowerCase();
  v = _voices.find(x => (x.lang || '').toLowerCase().startsWith(pre));
  return v || _voices[0] || null;
}
function speakText(text, code) {
  if (!('speechSynthesis' in window)) { toast('当前浏览器不支持语音朗读'); return; }
  if (!text) return;
  const synth = window.speechSynthesis;
  if (synth.paused) synth.resume();
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = code || 'en-US'; u.rate = 0.95; u.pitch = 1.0; u.volume = 1.0;
  const v = pickVoiceFor(code || 'en-US');
  if (v) u.voice = v;
  u.onerror = (e) => toast('朗读失败:' + (e.error || '未知错误'));
  // 关键修复:cancel 后再 speak 在部分浏览器会吞掉语音,延迟一帧确保稳定
  setTimeout(() => {
    try { window.speechSynthesis.speak(u); }
    catch (err) { toast('朗读失败:' + err.message); }
  }, 40);
}
// 兼容旧调用(生词朗读用英文)
function speak(text) { speakText(text, 'en-US'); }

// 浏览器端实时翻译(MyMemory,联网可用;离线回退原文)
const transCache = {};
async function translate(text, target) {
  const key = target + '|' + text;
  if (transCache[key] != null) return transCache[key];
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${target}`;
    const r = await fetch(url);
    const d = await r.json();
    const out = d && d.responseData && d.responseData.translatedText;
    if (out && out !== text) { transCache[key] = out; return out; }
  } catch (e) {}
  return null;
}

// 阅读面板:多语言释义 + 中文方言朗读
function wireLang(item) {
  const langSel = document.getElementById('r-lang');
  const dialectSel = document.getElementById('r-dialect');
  const transEl = document.getElementById('r-translation');
  const speakBtn = document.getElementById('r-speak');
  if (!langSel) return;
  const apply = () => {
    const lang = langSel.value;
    if (lang === 'zh') {
      dialectSel.classList.remove('hidden');
      transEl.textContent = item.translation || '';
    } else if (lang === 'en') {
      dialectSel.classList.add('hidden');
      transEl.textContent = item.original;
    } else {
      dialectSel.classList.add('hidden');
      transEl.textContent = '翻译中…';
      const code = TRANS_LANG[lang];
      translate(item.original, code).then(t => {
        if (langSel.value === lang) transEl.textContent = t || '（该语种翻译需要联网,请检查网络后重试）';
      });
    }
  };
  langSel.onchange = apply;
  apply();
  speakBtn.onclick = () => {
    const lang = langSel.value;
    if (lang === 'zh') speakText(transEl.textContent, dialectSel.value);
    else if (lang === 'en') speakText(item.original, 'en-US');
    else speakText(transEl.textContent, TRANS_LANG[lang]);
  };
}
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function highlight(text, vocab) {
  const map = new Map();
  vocab.forEach(v => map.set(v.word.toLowerCase(), v));
  const words = [...map.keys()].sort((a, b) => b.length - a.length).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!words.length) return escapeHtml(text);
  const re = new RegExp('\\b(' + words.join('|') + ')\\b', 'gi');
  return escapeHtml(text).replace(re, (m) => {
    const v = map.get(m.toLowerCase());
    const tip = `${v.pos || ''} ${v.meaning || ''}`.trim();
    return `<span class="word-hl" title="${escapeHtml(tip)}">${m}</span>`;
  });
}

// ---------- 初始化 ----------
async function init() {
  if (state.token) {
    try { const me = await store.api('GET', '/api/me'); state.user = me.user; }
    catch { state.token = null; localStorage.removeItem('ev_token'); }
  }
  updateAuthUI();
  let items;
  try { items = await store.loadContent(); }
  catch (e) { toast('内容加载失败: ' + e.message); return; }
  state.items = items;
  buildFilterBar();
  if (state.token) state.favSet = new Set(await store.getFavorites());
  showDaily();

  // 主星海场景(约 2.8 万颗星几何 + 3000 内容光点)延迟到「进入地球村」时才构建,
  // 避免与开场动画争抢主线程导致开头卡顿;曲速过渡期间构建,用户几乎无感。
  let fieldBuilt = false;
  function buildField() {
    if (fieldBuilt) return;
    fieldBuilt = true;
    state.field = createStarfield($('#scene'), {
      onSelect: (id) => {
        // 点击光点:仅打开阅读面板(朗读交给面板内的 🔊 按钮)
        openReader(id);
      },
      onHover: (item, x, y) => {
        if (!item) { tooltip.classList.add('hidden'); return; }
        tooltip.textContent = `${TYPE_LABEL[item.type] || ''} · ${item.title}`;
        tooltip.style.left = x + 'px'; tooltip.style.top = y + 'px';
        tooltip.classList.remove('hidden');
      }
    });
    state.field.setItems(items);
  }

  // 开场星系:进入后先暂停主星海(省算力),启动时光飞船第一视角旅程,
  // 旅程结束再恢复主场景并以曲速冲刺抵达主银河系。
  try {
    createIntro({
      onEnterStart: () => { buildField(); },
      onEnter: () => {
        if (state.field) state.field.setPaused(true);
        try {
          createTravel({
            onDone: () => {
              if (state.field) { state.field.setPaused(false); state.field.warpBurst(1.6); }
            }
          });
        } catch (e) {
          console.warn('travel scene failed', e);
          if (state.field) { state.field.setPaused(false); state.field.warpBurst(1.6); }
        }
      }
    });
  } catch (e) {
    console.warn('intro scene failed', e);
    const ie = document.getElementById('intro'); if (ie) ie.remove();
    buildField(); // 开场失败也要保证主场景可用
  }
}

// ---------- 筛选栏 ----------
function buildFilterBar() {
  const typeBox = $('#filter-type');
  const themeBox = $('#filter-theme');
  const types = [['', '全部'], ['poem', '诗歌'], ['essay', '美文'], ['quote', '金句']];
  typeBox.innerHTML = types.map(([v, l]) =>
    `<button class="chip ${v === '' ? 'active' : ''}" data-type="${v}">${l}</button>`).join('');
  const themes = [...new Set(state.items.map(i => i.theme).filter(Boolean))];
  themeBox.innerHTML = `<button class="chip active" data-theme="">全部主题</button>` +
    themes.map(t => `<button class="chip" data-theme="${escapeHtml(t)}" style="--c:#${themeHex(t)}">${escapeHtml(t)}</button>`).join('');
  typeBox.querySelectorAll('.chip').forEach(b => b.onclick = () => {
    state.filter.type = b.dataset.type;
    typeBox.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); applyFilters();
  });
  themeBox.querySelectorAll('.chip').forEach(b => b.onclick = () => {
    state.filter.theme = b.dataset.theme;
    themeBox.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); applyFilters();
  });
  $('#search-input').oninput = (e) => { state.filter.q = e.target.value.trim(); applyFilters(); };
}
function themeHex(t) {
  const map = { '自然': '8fd3ff', '人生': 'ffd9a0', '爱情': 'ff9ec4', '励志': 'b6ff9e', '哲思': 'c9a8ff', '时间': 'ffe08a', '梦想': '9effe6', '孤独': 'a8b6ff' };
  return map[t] || 'ffffff';
}
function applyFilters() {
  const { type, theme, q } = state.filter;
  const s = q.toLowerCase();
  const filtered = state.items.filter(it =>
    (!type || it.type === type) &&
    (!theme || it.theme === theme) &&
    (!s || (it.title + ' ' + it.original + ' ' + it.translation).toLowerCase().includes(s))
  );
  state.field.applyFilter(filtered.map(i => i.id));
}

// ---------- 每日一句 ----------
async function showDaily() {
  const item = await store.getDaily();
  if (!item) return;
  $('#daily-title').textContent = `${TYPE_LABEL[item.type] || ''} · ${item.title}`;
  $('#daily-text').textContent = item.original.split('\n')[0];
  $('#daily-open').onclick = () => openReader(item.id);
  $('#daily-card').classList.remove('hidden');
}

// ---------- 阅读面板 ----------
async function openReader(id) {
  let item;
  try { item = await store.getContentById(id); } catch (e) { toast(e.message); return; }
  if (!item) return;
  await store.logProgress('read', item.id);

  const fav = state.favSet.has(item.id);
  const body = $('#reader-body');
  body.innerHTML = `
    <span class="reader-type">${TYPE_LABEL[item.type] || item.type}${item.difficulty ? ' · 难度 ' + '★'.repeat(item.difficulty) : ''}</span>
    <h1 class="reader-title">${escapeHtml(item.title)}</h1>
    <div class="reader-author">${escapeHtml(item.author || '佚名')}</div>
    <div class="reader-actions">
      <button class="btn ghost" id="r-fav">${fav ? '★ 已收藏' : '☆ 收藏'}</button>
    </div>
    <div class="lang-bar">
      <span class="lang-label">🌐 释义语言</span>
      <select id="r-lang" class="lang-select">
        <option value="zh">中文</option>
        <option value="en">English 原文</option>
        <option value="fr">Français 法语</option>
        <option value="ja">日本語 日语</option>
        <option value="ru">Русский 俄语</option>
        <option value="ko">한국어 韩语</option>
        <option value="de">Deutsch 德语</option>
        <option value="es">Español 西语</option>
      </select>
      <button class="btn ghost" id="r-speak">🔊 朗读</button>
      <select id="r-dialect" class="lang-select dialect hidden">
        <option value="zh-CN">普通话</option>
        <option value="zh-HK">粤语·香港</option>
        <option value="zh-TW">台灣華語</option>
      </select>
    </div>
    <div class="reader-original">${highlight(item.original, item.vocab || [])}</div>
    <div class="reader-section-title">释义</div>
    <div class="reader-translation" id="r-translation">${escapeHtml(item.translation || '')}</div>
    ${(item.vocab && item.vocab.length) ? `<div class="reader-section-title">生词卡 · 点击加入生词本</div><div id="vocab-list"></div>` : ''}
    ${(item.tags && item.tags.length) ? `<div class="reader-section-title">标签</div><div>${item.tags.map(t => `<span class="tag">#${escapeHtml(t)}</span>`).join('')}</div>` : ''}
  `;
  $('#r-fav').onclick = () => toggleFav(item);
  wireLang(item);
  if (item.vocab && item.vocab.length) {
    const list = $('#vocab-list');
    item.vocab.forEach(v => {
      const chip = document.createElement('div');
      chip.className = 'vocab-chip';
      chip.innerHTML = `<span class="w">${escapeHtml(v.word)}</span><span class="p">${escapeHtml(v.pos || '')}</span><span class="m">${escapeHtml(v.meaning || '')}</span><button data-word="${escapeHtml(v.word)}" data-pos="${escapeHtml(v.pos || '')}" data-meaning="${escapeHtml(v.meaning || '')}">+ 生词本</button>`;
      chip.querySelector('button').onclick = () => addVocab(v, item.id);
      list.appendChild(chip);
    });
  }
  $('#reader').classList.remove('hidden');
}

function closePanel(id) { $('#' + id).classList.add('hidden'); }

async function addVocab(v, contentId) {
  await store.addVocab(v, contentId);
  toast('已加入生词本 ✦');
}
async function toggleFav(item) {
  if (state.favSet.has(item.id)) { await store.removeFavorite(item.id); state.favSet.delete(item.id); toast('已取消收藏'); }
  else { await store.addFavorite(item.id); state.favSet.add(item.id); toast('已收藏 ★'); }
  const btn = $('#r-fav'); if (btn) btn.textContent = state.favSet.has(item.id) ? '★ 已收藏' : '☆ 收藏';
}

// ---------- 生词本 + 词表导入 ----------
async function openVocab() {
  let rows;
  try { rows = await store.getVocab(); } catch (e) { toast(e.message); return; }
  const body = $('#side-body');
  body.innerHTML = `<div class="reader-section-title">我的生词本 (${rows.length}) <button class="btn ghost" id="import-wl" style="float:right;padding:4px 10px">导入词表</button></div>
    <input type="file" id="wl-file" accept="application/json" style="display:none">`;
  $('#import-wl').onclick = () => $('#wl-file').click();
  $('#wl-file').onchange = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { const n = store.importWordlist(JSON.parse(reader.result)); toast(`已导入 ${n} 个单词`); openVocab(); }
      catch { toast('词表 JSON 解析失败'); }
    };
    reader.readAsText(f);
  };
  if (!rows.length) body.innerHTML += `<div class="empty">还没有生词,去诗海里捞几句吧 ✦</div>`;
  else rows.forEach(r => {
    const el = document.createElement('div'); el.className = 'vocab-chip';
    el.innerHTML = `<span class="w">${escapeHtml(r.word)}</span><span class="p">${escapeHtml(r.pos || '')}</span><span class="m">${escapeHtml(r.meaning || '')}</span><button data-id="${r.id}">删除</button>`;
    el.querySelector('button').onclick = async (ev) => { await store.deleteVocab(r.id); ev.target.closest('.vocab-chip').remove(); toast('已删除'); };
    el.querySelector('.w').ondblclick = () => speak(r.word);
    body.appendChild(el);
  });
  $('#side').classList.remove('hidden');
}

// ---------- 收藏 ----------
async function openFav() {
  let ids;
  try { ids = await store.getFavorites(); } catch (e) { toast(e.message); return; }
  const byId = new Map(state.items.map(i => [i.id, i]));
  const body = $('#side-body');
  body.innerHTML = `<div class="reader-section-title">我的收藏 (${ids.length})</div>`;
  if (!ids.length) body.innerHTML += `<div class="empty">还没有收藏,点开任一篇章右上角 ☆ 即可收藏。</div>`;
  else ids.forEach(id => {
    const it = byId.get(id); if (!it) return;
    const el = document.createElement('div'); el.className = 'list-item';
    el.innerHTML = `<div class="t">${escapeHtml(it.title)}</div><div class="a">${TYPE_LABEL[it.type] || ''} · ${escapeHtml(it.author || '')}</div>`;
    el.onclick = () => openReader(it.id);
    body.appendChild(el);
  });
  $('#side').classList.remove('hidden');
}

// ---------- 复习(艾宾浩斯) ----------
async function openReview() {
  let due;
  try { due = await store.getDueReview(); } catch (e) { toast(e.message); return; }
  if (!due.length) { toast('暂无待复习的生词 🎉'); return; }
  const body = $('#side-body');
  let idx = 0;
  const render = () => {
    if (idx >= due.length) {
      body.innerHTML = `<div class="reader-section-title">复习完成 🎉</div><div class="empty">本次复习 ${due.length} 个单词。坚持就是胜利!</div>`;
      return;
    }
    const w = due[idx];
    body.innerHTML = `<div class="reader-section-title">生词复习 ${idx + 1}/${due.length}</div>
      <div class="flashcard">
        <div class="fc-word">${escapeHtml(w.word)}</div>
        <div class="fc-pos">${escapeHtml(w.pos || '')}</div>
        <div class="fc-meaning">${escapeHtml(w.meaning || '')}</div>
      </div>
      <div class="reader-actions">
        <button class="btn ghost" id="rv-no">😣 不认识</button>
        <button class="btn primary" id="rv-yes">😊 认识</button>
      </div>`;
    $('#rv-yes').onclick = async () => { await store.reviewWord(w.id, 'known'); idx++; render(); };
    $('#rv-no').onclick = async () => { await store.reviewWord(w.id, 'unknown'); idx++; render(); };
  };
  render();
  $('#side').classList.remove('hidden');
}

// ---------- 进度统计 ----------
async function openStats() {
  let s;
  try { s = await store.getStats(); } catch (e) { toast(e.message); return; }
  const body = $('#side-body');
  const bars = [
    ['已学篇章', s.read, s.total],
    ['生词总数', s.vocab, null],
    ['收藏', s.favorites, null],
    ['待复习', s.dueReview, null]
  ];
  body.innerHTML = `<div class="reader-section-title">我的进度${s.guest ? ' (游客模式)' : ''}</div>
    <div class="stat-grid">
      <div class="stat"><div class="stat-n">${s.streak}</div><div class="stat-l">连续天数</div></div>
      <div class="stat"><div class="stat-n">${s.read}</div><div class="stat-l">已学篇章</div></div>
      <div class="stat"><div class="stat-n">${s.vocab}</div><div class="stat-l">生词</div></div>
      <div class="stat"><div class="stat-n">${s.dueReview}</div><div class="stat-l">待复习</div></div>
    </div>
    ${bars.map(([l, v, max]) => `<div class="bar-row"><span>${l}</span><div class="bar"><i style="width:${max ? Math.min(100, v / max * 100) : Math.min(100, v)}%"></i></div><b>${v}</b></div>`).join('')}
    ${s.guest ? '<div class="empty" style="padding:14px 0">游客模式下数据存于本机。登录后可多端同步。</div>' : ''}`;
  $('#side').classList.remove('hidden');
}

// ---------- 上传作品(写下自己的诗歌/短句,发布后成为一颗星) ----------
const THEMES = ['自然', '人生', '爱情', '励志', '哲思', '时间', '梦想', '孤独'];
function openUpload() {
  const body = $('#side-body');
  body.innerHTML = `
    <div class="reader-section-title">✍️ 创作我的星</div>
    <div class="upload-hint">写下你的英文诗歌 / 名言短句,发布后会化作银河中一颗专属于你的星 ✦</div>
    <form id="upload-form" class="upload-form">
      <label>标题</label>
      <input id="up-title" type="text" maxlength="120" placeholder="给作品起个名字(可选)">
      <label>类型</label>
      <div class="up-row" id="up-type">
        <button type="button" class="chip active" data-v="quote">金句</button>
        <button type="button" class="chip" data-v="poem">诗歌</button>
        <button type="button" class="chip" data-v="essay">美文</button>
      </div>
      <label>主题</label>
      <div class="up-row" id="up-theme">
        ${THEMES.map((t, i) => `<button type="button" class="chip ${i === 6 ? 'active' : ''}" data-v="${t}" style="--c:#${themeHex(t)}">${t}</button>`).join('')}
      </div>
      <label>英文原文 <span class="req">*</span></label>
      <textarea id="up-original" rows="4" placeholder="Write your English poem or quote here..." required></textarea>
      <div class="up-tools">
        <select id="up-lang" class="lang-select" title="选择译文语种">
          <option value="zh">中文</option>
          <option value="en">English 原文</option>
          <option value="fr">Français 法语</option>
          <option value="ja">日本語 日语</option>
          <option value="ru">Русский 俄语</option>
          <option value="ko">한국어 韩语</option>
          <option value="de">Deutsch 德语</option>
          <option value="es">Español 西语</option>
        </select>
        <button type="button" class="btn ghost" id="up-translate">🔄 翻译</button>
        <button type="button" class="btn ghost" id="up-speak">🔊 试听</button>
      </div>
      <label id="up-trans-label">中文释义 / 翻译</label>
      <textarea id="up-translation" rows="2" placeholder="可选:选择语种后点「翻译」自动生成对应释义"></textarea>
      <label>标签(逗号分隔,可选)</label>
      <input id="up-tags" type="text" placeholder="dream, hope, light">
      <button type="submit" class="btn primary" id="up-submit" style="margin-top:12px;width:100%">🌟 发布,点亮我的星</button>
    </form>`;
  let upType = 'quote', upTheme = '梦想';
  body.querySelectorAll('#up-type .chip').forEach(b => b.onclick = () => {
    upType = b.dataset.v; body.querySelectorAll('#up-type .chip').forEach(x => x.classList.remove('active')); b.classList.add('active');
  });
  body.querySelectorAll('#up-theme .chip').forEach(b => b.onclick = () => {
    upTheme = b.dataset.v; body.querySelectorAll('#up-theme .chip').forEach(x => x.classList.remove('active')); b.classList.add('active');
  });

  // 译文语种:切换即翻译,「翻译」按钮手动触发,「试听」朗读对应语种
  const upLang = $('#up-lang');
  const upTrans = $('#up-translation');
  const upTransLabel = $('#up-trans-label');
  const UP_LANG_LABEL = { zh: '中文释义 / 翻译', en: 'English 原文对照', fr: 'Français 法语释义', ja: '日本語 释义', ru: 'Русский 俄语释义', ko: '한국어 韩语释义', de: 'Deutsch 德语释义', es: 'Español 西语释义' };
  async function doTranslate() {
    const text = $('#up-original').value.trim();
    if (!text) { toast('请先填写英文原文'); return; }
    const lang = upLang.value;
    if (lang === 'en') { upTrans.value = text; return; }
    upTrans.value = '翻译中…'; upTrans.disabled = true;
    try {
      const t = await translate(text, TRANS_LANG[lang]);
      upTrans.value = t || '（该语种翻译需要联网,请检查网络后重试）';
    } catch { upTrans.value = ''; }
    upTrans.disabled = false;
  }
  upLang.onchange = () => {
    upTransLabel.textContent = UP_LANG_LABEL[upLang.value] || '释义 / 翻译';
    if ($('#up-original').value.trim()) doTranslate();
  };
  $('#up-translate').onclick = doTranslate;
  $('#up-speak').onclick = () => {
    const lang = upLang.value;
    const txt = (upTrans.value.trim() || $('#up-original').value.trim());
    if (!txt) { toast('没有可朗读的内容'); return; }
    if (lang === 'zh') speakText(txt, 'zh-CN');
    else if (lang === 'en') speakText(txt, 'en-US');
    else speakText(txt, TRANS_LANG[lang]);
  };
  $('#upload-form').onsubmit = async (e) => {
    e.preventDefault();
    const original = $('#up-original').value.trim();
    if (!original) { toast('英文原文不能为空'); return; }
    const tags = $('#up-tags').value.split(',').map(s => s.trim()).filter(Boolean);
    const payload = {
      type: upType, theme: upTheme,
      title: $('#up-title').value.trim(),
      original,
      translation: $('#up-translation').value.trim(),
      tags
    };
    $('#up-submit').disabled = true; $('#up-submit').textContent = '发布中...';
    try {
      const item = await store.uploadContent(payload);
      toast('发布成功!你的星已点亮 🌟');
      // 增量添加单颗星(不重建全量星海,彻底解决发布卡顿)
      state.items.push(item);
      state.field.addItem(item);
      if (state.filter.type || state.filter.theme || state.filter.q) applyFilters();
      openReader(item.id);
    } catch (err) {
      toast(err.message || '发布失败');
      $('#up-submit').disabled = false; $('#up-submit').textContent = '🌟 发布,点亮我的星';
    }
  };
  $('#side').classList.remove('hidden');
}

// ---------- 个人主页(账户信息 + 我的作品 + 收藏 + 生词 + 统计) ----------
async function openProfile() {
  let data;
  try { data = await store.getProfile(); } catch (e) { toast(e.message); return; }
  const u = data.user || {};
  const st = data.stats || {};
  const joinDate = u.created_at ? String(u.created_at).slice(0, 10) : (u.guest ? '—' : '今天');
  const body = $('#side-body');
  body.innerHTML = `
    <div class="profile-head">
      <div class="profile-avatar">${escapeHtml((u.username || '游').slice(0, 1).toUpperCase())}</div>
      <div class="profile-meta">
        <div class="profile-name">${escapeHtml(u.username || '游客')}${u.guest ? ' <span class="badge">游客</span>' : ''}</div>
        <div class="profile-sub">加入于 ${escapeHtml(joinDate)} · 银河系诗人</div>
      </div>
    </div>
    <div class="stat-grid" style="margin-top:14px">
      <div class="stat"><div class="stat-n">${st.uploads || 0}</div><div class="stat-l">我的星</div></div>
      <div class="stat"><div class="stat-n">${st.read || 0}</div><div class="stat-l">已学篇章</div></div>
      <div class="stat"><div class="stat-n">${st.vocab || 0}</div><div class="stat-l">生词</div></div>
      <div class="stat"><div class="stat-n">${st.streak || 0}</div><div class="stat-l">连续天数</div></div>
      <div class="stat"><div class="stat-n">${st.favorites || 0}</div><div class="stat-l">收藏</div></div>
      <div class="stat"><div class="stat-n">${st.dueReview || 0}</div><div class="stat-l">待复习</div></div>
    </div>
    <div class="reader-section-title" style="margin-top:18px">我的作品 (${(data.uploads || []).length}) <button class="btn ghost" id="pf-new" style="float:right;padding:4px 10px">✍️ 新建</button></div>
    <div id="pf-uploads"></div>
    <div class="reader-section-title" style="margin-top:16px">我的收藏 (${(data.favorites || []).length})</div>
    <div id="pf-favs"></div>`;
  $('#pf-new').onclick = openUpload;
  const upBox = $('#pf-uploads');
  if (!(data.uploads || []).length) upBox.innerHTML = `<div class="empty">还没有作品。点「新建」写下你的第一颗星 ✦</div>`;
  else data.uploads.forEach(it => {
    const el = document.createElement('div'); el.className = 'list-item';
    el.innerHTML = `<div class="t">${escapeHtml(it.title)}</div><div class="a">${TYPE_LABEL[it.type] || ''} · ${escapeHtml(it.theme || '')} · ${(it.created_at || '').slice(0, 10)}</div>`;
    el.onclick = () => openReader(it.id);
    upBox.appendChild(el);
  });
  const favBox = $('#pf-favs');
  if (!(data.favorites || []).length) favBox.innerHTML = `<div class="empty">还没有收藏。</div>`;
  else data.favorites.forEach(it => {
    const el = document.createElement('div'); el.className = 'list-item';
    el.innerHTML = `<div class="t">${escapeHtml(it.title)}</div><div class="a">${TYPE_LABEL[it.type] || ''} · ${escapeHtml(it.author || '')}</div>`;
    el.onclick = () => openReader(it.id);
    favBox.appendChild(el);
  });
  $('#side').classList.remove('hidden');
}

// ---------- 认证 ----------
let authMode = 'login';
function openAuth(mode) {
  authMode = mode;
  $('#auth-title').textContent = mode === 'login' ? '登录' : '注册';
  $('#auth-submit').textContent = mode === 'login' ? '登录' : '注册';
  $('#auth-toggle-text').textContent = mode === 'login' ? '还没有账号?' : '已有账号?';
  $('#auth-toggle').textContent = mode === 'login' ? '去注册' : '去登录';
  $('#auth-modal').classList.remove('hidden');
}
function closeAuth() { $('#auth-modal').classList.add('hidden'); }
function updateAuthUI() {
  const btn = $('#btn-auth');
  if (state.user) { btn.textContent = '👤 ' + state.user.username; btn.onclick = logout; }
  else { btn.textContent = '登录'; btn.onclick = () => openAuth('login'); }
}
function logout() {
  state.token = null; state.user = null; state.favSet = new Set();
  localStorage.removeItem('ev_token'); updateAuthUI(); toast('已退出登录');
}

$('#auth-toggle').onclick = (e) => { e.preventDefault(); openAuth(authMode === 'login' ? 'register' : 'login'); };
$('#auth-form').onsubmit = async (e) => {
  e.preventDefault();
  const username = $('#auth-user').value.trim();
  const password = $('#auth-pass').value;
  if (!username || !password) { toast('请填写用户名和密码'); return; }
  try {
    const data = await store.api('POST', '/api/' + authMode, { username, password });
    state.token = data.token; state.user = data.user;
    localStorage.setItem('ev_token', data.token);
    closeAuth(); updateAuthUI();
    state.favSet = new Set(await store.getFavorites());
    toast(`欢迎, ${data.user.username} ✦`);
  } catch (err) { toast(err.message); }
};

// ---------- 事件 ----------
$('#btn-random').onclick = async () => { try { const it = await store.loadContent(); const r = it[Math.floor(Math.random() * it.length)]; if (r) openReader(r.id); } catch (e) { toast(e.message); } };
$('#btn-today').onclick = showDaily;
$('#btn-review').onclick = openReview;
$('#btn-vocab').onclick = openVocab;
$('#btn-fav').onclick = openFav;
$('#btn-stats').onclick = openStats;
$('#btn-upload').onclick = openUpload;
$('#btn-profile').onclick = openProfile;
$('#daily-close').onclick = () => $('#daily-card').classList.add('hidden');
document.querySelectorAll('[data-close]').forEach(b => b.onclick = () => closePanel(b.getAttribute('data-close')));
$('#auth-modal').addEventListener('click', (e) => { if (e.target.id === 'auth-modal') closeAuth(); });

init();
