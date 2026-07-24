// 数据层:有后端(token)走 API,游客或无后端时降级为 localStorage
// 这样本地全栈可用账号持久化,部署成纯静态站点也能完整使用(游客模式)。

const LS = { vocab: 'ev_vocab', fav: 'ev_fav', progress: 'ev_progress', uploads: 'ev_uploads' };
const REVIEW_INTERVALS = { 1: 1, 2: 2, 3: 4, 4: 7, 5: 15, 6: 30 };

let BACKEND = true;

function getToken() { return localStorage.getItem('ev_token'); }
function lsGet(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch { return d; } }
function lsSet(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
function reviewMs(box) { if (box <= 0) return 10 * 60 * 1000; const d = REVIEW_INTERVALS[Math.min(box, 6)] || 30; return d * 86400000; }

export async function api(method, url, body) {
  const headers = { 'Content-Type': 'application/json' };
  const t = getToken();
  if (t) headers['Authorization'] = 'Bearer ' + t;
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) {
    let e = {}; try { e = await res.json(); } catch {}
    const err = new Error(e.error || '请求失败'); err.status = res.status; throw err;
  }
  return res.json();
}

export async function loadContent(filters = {}) {
  const qs = new URLSearchParams();
  if (filters.type) qs.set('type', filters.type);
  if (filters.theme) qs.set('theme', filters.theme);
  if (filters.q) qs.set('q', filters.q);
  const q = qs.toString();
  try {
    const arr = await api('GET', '/api/content' + (q ? '?' + q : ''));
    BACKEND = true;
    return arr;
  } catch {
    BACKEND = false;
    const local = await fetch('./content.json').then(r => r.json()).catch(() => []);
    // 游客模式:合并本地上传的作品
    const uploads = lsGet(LS.uploads, []);
    let items = uploads.concat(local);
    if (filters.type) items = items.filter(i => i.type === filters.type);
    if (filters.theme) items = items.filter(i => i.theme === filters.theme);
    if (filters.q) {
      const s = filters.q.toLowerCase();
      items = items.filter(i => (i.title + ' ' + i.original + ' ' + (i.translation || '')).toLowerCase().includes(s));
    }
    return items;
  }
}

// ---- 用户上传作品(登录→写库成为星;游客→存 localStorage 也成为星) ----
export async function uploadContent(data) {
  if (getToken()) {
    // 后端模式:写入数据库
    return await api('POST', '/api/upload', data);
  }
  // 游客模式:存到本地,下次加载星海时合并显示
  const list = lsGet(LS.uploads, []);
  const item = {
    id: 'u' + Date.now() + Math.floor(Math.random() * 1000),
    type: ['poem', 'essay', 'quote'].includes(data.type) ? data.type : 'quote',
    title: (data.title && data.title.trim()) ? data.title.trim() : '我的作品',
    author: '我(游客)',
    original: (data.original || '').trim(),
    translation: (data.translation || '').trim(),
    vocab: [], tags: Array.isArray(data.tags) ? data.tags : [],
    difficulty: 2,
    theme: data.theme || '梦想',
    source: 'user', is_user: true, user_id: 'guest',
    created_at: new Date().toISOString()
  };
  list.unshift(item);
  lsSet(LS.uploads, list);
  return item;
}

// ---- 个人主页数据 ----
export async function getProfile() {
  if (getToken()) {
    try { return await api('GET', '/api/profile'); } catch { /* 降级 */ }
  }
  // 游客模式:用本地数据拼装
  const uploads = lsGet(LS.uploads, []);
  const vocab = lsGet(LS.vocab, []);
  const favIds = lsGet(LS.fav, []);
  const all = await loadContent();
  const favorites = all.filter(i => favIds.map(String).includes(String(i.id)));
  const stats = await getStats();
  return {
    user: { username: '游客', guest: true, created_at: null },
    stats: {
      uploads: uploads.length,
      favorites: favorites.length,
      vocab: vocab.length,
      masteredVocab: vocab.filter(v => (v.box || 0) >= 5).length,
      read: stats.read || 0,
      dueReview: stats.dueReview || 0,
      streak: stats.streak || 0
    },
    uploads, favorites, vocab
  };
}

export async function getContentById(id) {
  try { return await api('GET', '/api/content/' + id); }
  catch { const a = await loadContent(); return a.find(i => String(i.id) === String(id)) || null; }
}

export async function getDaily() {
  try { const d = await api('GET', '/api/daily'); return d.item; }
  catch {
    const items = await loadContent();
    if (!items.length) return null;
    const day = new Date().toISOString().slice(0, 10);
    let seed = 0; for (const ch of day) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    return items[seed % items.length];
  }
}

// ---- 生词本 ----
export async function getVocab() {
  if (getToken()) { try { return await api('GET', '/api/vocab'); } catch { return []; } }
  return lsGet(LS.vocab, []);
}
export async function addVocab(v, cid) {
  const item = { id: Date.now() + Math.floor(Math.random() * 1000), word: v.word, pos: v.pos || '', meaning: v.meaning || '', content_id: cid || null, box: 0, last_review: null, next_review: Date.now() };
  if (getToken()) {
    try { const r = await api('POST', '/api/vocab', { word: v.word, pos: v.pos, meaning: v.meaning, content_id: cid }); return { ...item, id: r.id }; }
    catch { /* 后端失败则存本地 */ }
  }
  const list = lsGet(LS.vocab, []); list.push(item); lsSet(LS.vocab, list); return item;
}
export async function deleteVocab(id) {
  if (getToken()) { try { await api('DELETE', '/api/vocab/' + id); return; } catch { } }
  lsSet(LS.vocab, lsGet(LS.vocab, []).filter(x => x.id != id));
}

// ---- 收藏 ----
export async function getFavorites() {
  if (getToken()) { try { return (await api('GET', '/api/favorites')).map(r => r.id); } catch { return []; } }
  return lsGet(LS.fav, []);
}
export async function addFavorite(cid) {
  if (getToken()) { try { await api('POST', '/api/favorites', { content_id: cid }); return; } catch { } }
  const l = lsGet(LS.fav, []); if (!l.includes(cid)) l.push(cid); lsSet(LS.fav, l);
}
export async function removeFavorite(cid) {
  if (getToken()) { try { await api('DELETE', '/api/favorites/' + cid); return; } catch { } }
  lsSet(LS.fav, lsGet(LS.fav, []).filter(x => x !== cid));
}

// ---- 复习(艾宾浩斯) ----
export async function getDueReview() {
  if (getToken()) { try { return await api('GET', '/api/review'); } catch { return []; } }
  return lsGet(LS.vocab, []).filter(x => (x.next_review || 0) <= Date.now());
}
export async function reviewWord(id, quality) {
  if (getToken()) { try { await api('POST', '/api/review/' + id, { quality }); return; } catch { } }
  const list = lsGet(LS.vocab, []);
  const x = list.find(v => v.id == id); if (!x) return;
  let box = x.box || 0;
  box = quality === 'known' ? Math.min(box + 1, 6) : 0;
  x.box = box; x.last_review = Date.now(); x.next_review = Date.now() + reviewMs(box);
  lsSet(LS.vocab, list);
}

// ---- 进度 ----
export async function logProgress(action, cid) {
  if (getToken()) { try { await api('POST', '/api/progress', { action, content_id: cid }); return; } catch { } }
  const prog = lsGet(LS.progress, []); prog.push({ action, content_id: cid, created_at: new Date().toISOString() }); lsSet(LS.progress, prog);
}
export async function getStats() {
  if (getToken()) { try { return await api('GET', '/api/stats'); } catch { } }
  const v = lsGet(LS.vocab, []);
  const fav = lsGet(LS.fav, []);
  const prog = lsGet(LS.progress, []);
  const read = new Set(prog.filter(p => p.action === 'read').map(p => p.content_id)).size;
  const due = v.filter(x => (x.next_review || 0) <= Date.now()).length;
  // 连续天数
  const days = [...new Set(prog.filter(p => p.action === 'read').map(p => (p.created_at || '').slice(0, 10)))].filter(Boolean).sort().reverse();
  let streak = 0;
  if (days.length) {
    let cursor = new Date();
    if (days[0] !== cursor.toISOString().slice(0, 10)) cursor.setDate(cursor.getDate() - 1);
    for (const d of days) {
      if (d === cursor.toISOString().slice(0, 10)) { streak++; cursor.setDate(cursor.getDate() - 1); }
      else break;
    }
  }
  const total = (await loadContent()).length;
  return { vocab: v.length, favorites: fav.length, read, dueReview: due, streak, total, guest: true };
}

// ---- 词表导入(游客) ----
export function importWordlist(json) {
  const arr = Array.isArray(json) ? json : [json];
  const list = lsGet(LS.vocab, []);
  let n = 0;
  for (const w of arr) {
    if (!w || !w.word) continue;
    list.push({ id: Date.now() + Math.floor(Math.random() * 1000) + n, word: w.word, pos: w.pos || '', meaning: w.meaning || '', content_id: null, box: 0, last_review: null, next_review: Date.now() });
    n++;
  }
  lsSet(LS.vocab, list);
  return n;
}

export function isBackend() { return BACKEND; }
