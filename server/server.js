import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize } from 'node:path';
import { db } from './db.js';
import {
  createUser,
  verifyUser,
  createSession,
  getUserByToken,
  getTokenFromHeader
} from './auth.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');
const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function sendJSON(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 1e6) req.destroy(); });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch { resolve({}); }
    });
    req.on('error', () => resolve({}));
  });
}

function requireAuth(req) {
  const token = getTokenFromHeader(req);
  return getUserByToken(token);
}

function hydrate(row) {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    author: row.author,
    original: row.original,
    translation: row.translation,
    vocab: row.vocab_json ? JSON.parse(row.vocab_json) : [],
    tags: row.tags_json ? JSON.parse(row.tags_json) : [],
    difficulty: row.difficulty,
    theme: row.theme || null,
    source: row.source || 'builtin',
    user_id: row.user_id || null,
    is_user: (row.source === 'user'),
    created_at: row.created_at || null
  };
}

// 艾宾浩斯复习间隔(天),按 box 索引
const REVIEW_INTERVALS = { 1: 1, 2: 2, 3: 4, 4: 7, 5: 15, 6: 30 };
function reviewSql(box) {
  if (box <= 0) return "datetime('now', '+10 minutes')";
  const days = REVIEW_INTERVALS[Math.min(box, 6)] || 30;
  return `datetime('now', '+${days} day')`;
}

async function serveStatic(req, res, pathname) {
  let rel = pathname === '/' ? '/index.html' : pathname;
  const safe = normalize(rel).replace(/^(\.\.[/\\])+/, '');
  let filePath = join(PUBLIC_DIR, safe);
  if (!filePath.startsWith(PUBLIC_DIR) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    // SPA 回退到 index.html
    filePath = join(PUBLIC_DIR, 'index.html');
  }
  try {
    const buf = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
    res.end(buf);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const p = url.pathname;

  if (p.startsWith('/api/')) {
    let body = {};
    if (req.method === 'POST' || req.method === 'DELETE') body = await readBody(req);

    // ---- 认证 ----
    if (p === '/api/register' && req.method === 'POST') {
      const { username, password } = body;
      if (!username || !password) return sendJSON(res, 400, { error: '用户名和密码不能为空' });
      if (String(username).length < 2 || String(password).length < 4)
        return sendJSON(res, 400, { error: '用户名至少 2 位,密码至少 4 位' });
      if (db.prepare('SELECT id FROM users WHERE username = ?').get(username))
        return sendJSON(res, 409, { error: '用户名已被占用' });
      const uid = createUser(username, password);
      const token = createSession(uid);
      return sendJSON(res, 200, { token, user: { id: uid, username } });
    }
    if (p === '/api/login' && req.method === 'POST') {
      const { username, password } = body;
      const user = verifyUser(username, password);
      if (!user) return sendJSON(res, 401, { error: '用户名或密码错误' });
      const token = createSession(user.id);
      return sendJSON(res, 200, { token, user: { id: user.id, username: user.username } });
    }
    if (p === '/api/me' && req.method === 'GET') {
      const user = requireAuth(req);
      if (!user) return sendJSON(res, 401, { error: '未登录或登录已过期' });
      return sendJSON(res, 200, { user });
    }

    // ---- 个人主页(账户信息 + 我的作品 + 收藏 + 生词 + 统计) ----
    if (p === '/api/profile' && req.method === 'GET') {
      const user = requireAuth(req);
      if (!user) return sendJSON(res, 401, { error: '未登录或登录已过期' });
      const uploads = db.prepare("SELECT * FROM content WHERE source='user' AND user_id = ? ORDER BY id DESC").all(user.id).map(hydrate);
      const favorites = db.prepare('SELECT f.content_id, c.* FROM favorites f JOIN content c ON c.id = f.content_id WHERE f.user_id = ? ORDER BY f.created_at DESC').all(user.id).map(hydrate);
      const vocab = db.prepare('SELECT * FROM vocab WHERE user_id = ? ORDER BY created_at DESC').all(user.id);
      const readCount = db.prepare("SELECT COUNT(DISTINCT content_id) AS c FROM progress WHERE user_id = ? AND action='read'").get(user.id).c;
      const dueReview = db.prepare("SELECT COUNT(*) AS c FROM vocab WHERE user_id = ? AND next_review <= datetime('now')").get(user.id).c;
      const masteredVocab = db.prepare('SELECT COUNT(*) AS c FROM vocab WHERE user_id = ? AND box >= 5').get(user.id).c;
      // 连续学习天数
      const days = db.prepare("SELECT DISTINCT date(created_at) AS d FROM progress WHERE user_id = ? AND action='read' ORDER BY d DESC")
        .all(user.id).map(r => r.d);
      let streak = 0;
      if (days.length) {
        let cursor = new Date();
        const fmt = (dt) => dt.toISOString().slice(0, 10);
        if (days[0] !== fmt(cursor)) cursor.setDate(cursor.getDate() - 1);
        for (const d of days) {
          if (d === fmt(cursor)) { streak++; cursor.setDate(cursor.getDate() - 1); }
          else break;
        }
      }
      return sendJSON(res, 200, {
        user,
        stats: {
          uploads: uploads.length,
          favorites: favorites.length,
          vocab: vocab.length,
          masteredVocab,
          read: readCount,
          dueReview,
          streak
        },
        uploads,
        favorites,
        vocab
      });
    }

    // ---- 内容 ----
    if (p === '/api/content' && req.method === 'GET') {
      const type = url.searchParams.get('type');
      const q = url.searchParams.get('q');
      const theme = url.searchParams.get('theme');
      const where = []; const params = [];
      if (type) { where.push('type = ?'); params.push(type); }
      if (theme) { where.push('theme = ?'); params.push(theme); }
      if (q) { where.push('(title LIKE ? OR original LIKE ? OR translation LIKE ?)'); params.push(`%${q}%`, `%${q}%`, `%${q}%`); }
      const sql = 'SELECT * FROM content' + (where.length ? ' WHERE ' + where.join(' AND ') : '') + ' ORDER BY id';
      const rows = db.prepare(sql).all(...params);
      return sendJSON(res, 200, rows.map(hydrate));
    }
    if (p === '/api/random' && req.method === 'GET') {
      const row = db.prepare('SELECT * FROM content ORDER BY random() LIMIT 1').get();
      if (!row) return sendJSON(res, 404, { error: '内容为空' });
      return sendJSON(res, 200, hydrate(row));
    }
    const m = p.match(/^\/api\/content\/(\d+)$/);
    if (m && req.method === 'GET') {
      const row = db.prepare('SELECT * FROM content WHERE id = ?').get(m[1]);
      if (!row) return sendJSON(res, 404, { error: '未找到该内容' });
      return sendJSON(res, 200, hydrate(row));
    }

    // ---- 用户上传作品(登录后可发布诗歌/短句,发布后成为一颗星) ----
    const VALID_THEMES = ['自然', '人生', '爱情', '励志', '哲思', '时间', '梦想', '孤独'];
    if (p === '/api/upload' && req.method === 'POST') {
      const user = requireAuth(req);
      if (!user) return sendJSON(res, 401, { error: '未登录或登录已过期' });
      let { type, title, original, translation, theme, tags } = body;
      if (!original || !String(original).trim()) return sendJSON(res, 400, { error: '英文原文不能为空' });
      if (String(original).length > 4000) return sendJSON(res, 400, { error: '内容过长(上限 4000 字符)' });
      type = ['poem', 'essay', 'quote'].includes(type) ? type : 'quote';
      theme = VALID_THEMES.includes(theme) ? theme : '梦想';
      title = (title && String(title).trim()) ? String(title).trim().slice(0, 120) : '我的作品';
      const tagsArr = Array.isArray(tags) ? tags.slice(0, 8).map(String) : [];
      const maxId = db.prepare('SELECT MAX(id) AS m FROM content').get().m || 0;
      const newId = Math.max(maxId + 1, 100001); // 用户内容 id 从 100001 起,避免与内置冲突
      db.prepare(`INSERT INTO content (id, type, title, author, original, translation, vocab_json, tags_json, difficulty, theme, source, user_id, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'user', ?, datetime('now'))`)
        .run(newId, type, title, user.username, String(original).trim(), (translation || '').trim(),
             JSON.stringify([]), JSON.stringify(tagsArr), 2, theme, user.id);
      db.prepare('INSERT INTO progress (user_id, action, content_id) VALUES (?, ?, ?)').run(user.id, 'upload', newId);
      const row = db.prepare('SELECT * FROM content WHERE id = ?').get(newId);
      return sendJSON(res, 200, hydrate(row));
    }

    // ---- 生词本 ----
    if (p === '/api/vocab' && req.method === 'POST') {
      const user = requireAuth(req);
      if (!user) return sendJSON(res, 401, { error: '未登录或登录已过期' });
      const { word, pos, meaning, content_id } = body;
      if (!word) return sendJSON(res, 400, { error: '单词不能为空' });
      const info = db.prepare('INSERT INTO vocab (user_id, word, pos, meaning, content_id) VALUES (?, ?, ?, ?, ?)')
        .run(user.id, word, pos || '', meaning || '', content_id || null);
      return sendJSON(res, 200, { id: Number(info.lastInsertRowid), word, pos, meaning, content_id });
    }
    if (p === '/api/vocab' && req.method === 'GET') {
      const user = requireAuth(req);
      if (!user) return sendJSON(res, 401, { error: '未登录或登录已过期' });
      const rows = db.prepare('SELECT * FROM vocab WHERE user_id = ? ORDER BY created_at DESC').all(user.id);
      return sendJSON(res, 200, rows);
    }
    const vm = p.match(/^\/api\/vocab\/(\d+)$/);
    if (vm && req.method === 'DELETE') {
      const user = requireAuth(req);
      if (!user) return sendJSON(res, 401, { error: '未登录或登录已过期' });
      db.prepare('DELETE FROM vocab WHERE id = ? AND user_id = ?').run(vm[1], user.id);
      return sendJSON(res, 200, { ok: true });
    }

    // ---- 收藏 ----
    if (p === '/api/favorites' && req.method === 'POST') {
      const user = requireAuth(req);
      if (!user) return sendJSON(res, 401, { error: '未登录或登录已过期' });
      const { content_id } = body;
      if (!content_id) return sendJSON(res, 400, { error: 'content_id 不能为空' });
      db.prepare('INSERT OR IGNORE INTO favorites (user_id, content_id) VALUES (?, ?)').run(user.id, content_id);
      return sendJSON(res, 200, { ok: true });
    }
    if (p === '/api/favorites' && req.method === 'GET') {
      const user = requireAuth(req);
      if (!user) return sendJSON(res, 401, { error: '未登录或登录已过期' });
      const rows = db.prepare('SELECT f.content_id, c.* FROM favorites f JOIN content c ON c.id = f.content_id WHERE f.user_id = ? ORDER BY f.created_at DESC').all(user.id);
      return sendJSON(res, 200, rows.map(hydrate));
    }
    const fm = p.match(/^\/api\/favorites\/(\d+)$/);
    if (fm && req.method === 'DELETE') {
      const user = requireAuth(req);
      if (!user) return sendJSON(res, 401, { error: '未登录或登录已过期' });
      db.prepare('DELETE FROM favorites WHERE content_id = ? AND user_id = ?').run(fm[1], user.id);
      return sendJSON(res, 200, { ok: true });
    }

    // ---- 每日一句(按日期确定性选取) ----
    if (p === '/api/daily' && req.method === 'GET') {
      const day = new Date().toISOString().slice(0, 10);
      const countRow = db.prepare('SELECT COUNT(*) AS c FROM content').get();
      const n = countRow.c;
      if (!n) return sendJSON(res, 404, { error: '内容为空' });
      // 用日期做种子,保证同一天同一篇
      let seed = 0; for (const ch of day) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
      const idx = seed % n;
      const row = db.prepare('SELECT * FROM content LIMIT 1 OFFSET ?').get(idx);
      return sendJSON(res, 200, { date: day, item: hydrate(row) });
    }

    // ---- 学习进度(记录已读等动作) ----
    if (p === '/api/progress' && req.method === 'POST') {
      const user = requireAuth(req);
      if (!user) return sendJSON(res, 401, { error: '未登录或登录已过期' });
      const { action, content_id } = body;
      if (!action) return sendJSON(res, 400, { error: 'action 不能为空' });
      db.prepare('INSERT INTO progress (user_id, action, content_id) VALUES (?, ?, ?)')
        .run(user.id, action, content_id || null);
      return sendJSON(res, 200, { ok: true });
    }

    // ---- 学习统计 ----
    if (p === '/api/stats' && req.method === 'GET') {
      const user = requireAuth(req);
      if (!user) return sendJSON(res, 401, { error: '未登录或登录已过期' });
      const vocab = db.prepare('SELECT COUNT(*) AS c FROM vocab WHERE user_id = ?').get(user.id).c;
      const fav = db.prepare('SELECT COUNT(*) AS c FROM favorites WHERE user_id = ?').get(user.id).c;
      const readRows = db.prepare("SELECT COUNT(DISTINCT content_id) AS c FROM progress WHERE user_id = ? AND action='read'").get(user.id).c;
      const dueReview = db.prepare("SELECT COUNT(*) AS c FROM vocab WHERE user_id = ? AND next_review <= datetime('now')").get(user.id).c;
      // 连续天数:基于 read 动作的去重日期
      const days = db.prepare("SELECT DISTINCT date(created_at) AS d FROM progress WHERE user_id = ? AND action='read' ORDER BY d DESC")
        .all(user.id).map(r => r.d);
      let streak = 0;
      if (days.length) {
        let cursor = new Date();
        const fmt = (dt) => dt.toISOString().slice(0, 10);
        // 若今天没读,从昨天起算
        if (days[0] !== fmt(cursor)) cursor.setDate(cursor.getDate() - 1);
        for (const d of days) {
          if (d === fmt(cursor)) { streak++; cursor.setDate(cursor.getDate() - 1); }
          else break;
        }
      }
      return sendJSON(res, 200, { vocab, favorites: fav, read: readRows, dueReview, streak, total: db.prepare('SELECT COUNT(*) AS c FROM content').get().c });
    }

    // ---- 生词复习(艾宾浩斯) ----
    if (p === '/api/review' && req.method === 'GET') {
      const user = requireAuth(req);
      if (!user) return sendJSON(res, 401, { error: '未登录或登录已过期' });
      const rows = db.prepare("SELECT * FROM vocab WHERE user_id = ? AND next_review <= datetime('now') ORDER BY next_review")
        .all(user.id);
      return sendJSON(res, 200, rows);
    }
    const rm = p.match(/^\/api\/review\/(\d+)$/);
    if (rm && req.method === 'POST') {
      const user = requireAuth(req);
      if (!user) return sendJSON(res, 401, { error: '未登录或登录已过期' });
      const { quality } = body; // 'known' | 'unknown'
      const v = db.prepare('SELECT * FROM vocab WHERE id = ? AND user_id = ?').get(rm[1], user.id);
      if (!v) return sendJSON(res, 404, { error: '未找到该生词' });
      let box = v.box || 0;
      if (quality === 'known') box = Math.min(box + 1, 6);
      else box = 0;
      db.prepare(`UPDATE vocab SET box = ?, last_review = datetime('now'), next_review = ${reviewSql(box)} WHERE id = ?`)
        .run(box, rm[1]);
      return sendJSON(res, 200, { ok: true, box });
    }

    return sendJSON(res, 404, { error: '接口不存在' });
  }

  // 静态文件
  await serveStatic(req, res, p);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`English Verse 已启动: http://localhost:${PORT}  (同一局域网内其他设备可访问 http://<本机IP>:${PORT})`);
});
