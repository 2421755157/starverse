import { DatabaseSync } from 'node:sqlite';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'app.db');

export const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    author TEXT,
    original TEXT NOT NULL,
    translation TEXT,
    vocab_json TEXT,
    tags_json TEXT,
    difficulty INTEGER DEFAULT 1,
    theme TEXT
  );

  CREATE TABLE IF NOT EXISTS vocab (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    word TEXT NOT NULL,
    pos TEXT,
    meaning TEXT,
    content_id INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    box INTEGER DEFAULT 0,
    last_review TEXT,
    next_review TEXT DEFAULT '1970-01-01 00:00:00',
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    content_id INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content_id INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, content_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// 兼容已有数据库:补齐新增列(已存在则忽略)
for (const sql of [
  'ALTER TABLE content ADD COLUMN theme TEXT',
  'ALTER TABLE content ADD COLUMN user_id INTEGER',            // 用户上传作品所属用户
  "ALTER TABLE content ADD COLUMN source TEXT DEFAULT 'builtin'", // builtin | user
  "ALTER TABLE content ADD COLUMN created_at TEXT",            // 上传时间
  'ALTER TABLE vocab ADD COLUMN box INTEGER DEFAULT 0',
  'ALTER TABLE vocab ADD COLUMN last_review TEXT',
  "ALTER TABLE vocab ADD COLUMN next_review TEXT DEFAULT '1970-01-01 00:00:00'"
]) {
  try { db.exec(sql); } catch { /* 列已存在 */ }
}

// ---- 首次启动自动导入内置内容(若 content 表为空则填充,无需手动 seed) ----
function ensureSeeded() {
  try {
    const count = db.prepare('SELECT COUNT(*) AS c FROM content').get().c;
    if (count > 0) return;
    const dataPath = join(__dirname, 'data', 'content.json');
    if (!existsSync(dataPath)) {
      console.warn('[seed] 未找到内置内容文件,请保留 server/data/content.json:', dataPath);
      return;
    }
    const items = JSON.parse(readFileSync(dataPath, 'utf-8'));
    if (!Array.isArray(items) || !items.length) return;
    const stmt = db.prepare(
      `INSERT OR REPLACE INTO content
       (id, type, title, author, original, translation, vocab_json, tags_json, difficulty, theme)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    // 注意:Node 22 的 node:sqlite(DatabaseSync)未提供 db.transaction(),
    // 使用标准 BEGIN/COMMIT 手动事务以保证在他人电脑上首次运行也能正常导入。
    db.exec('BEGIN IMMEDIATE');
    try {
      for (const it of items) {
        stmt.run(
          it.id, it.type, it.title, it.author || null, it.original,
          it.translation || null, JSON.stringify(it.vocab || []),
          JSON.stringify(it.tags || []), it.difficulty || 1, it.theme || null
        );
      }
      db.exec('COMMIT');
    } catch (e) {
      db.exec('ROLLBACK');
      throw e;
    }
    console.log(`[seed] 首次启动:已自动导入 ${items.length} 篇内容到数据库。`);
  } catch (e) {
    console.warn('[seed] 自动导入内置内容失败:', e && e.message);
  }
}
ensureSeeded();

export default db;
