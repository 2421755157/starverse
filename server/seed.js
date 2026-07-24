import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { db } from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentPath = join(__dirname, 'data', 'content.json');

const items = JSON.parse(readFileSync(contentPath, 'utf-8'));

const stmt = db.prepare(
  `INSERT OR REPLACE INTO content
   (id, type, title, author, original, translation, vocab_json, tags_json, difficulty, theme)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
);

for (const it of items) {
  stmt.run(
    it.id,
    it.type,
    it.title,
    it.author || null,
    it.original,
    it.translation || null,
    JSON.stringify(it.vocab || []),
    JSON.stringify(it.tags || []),
    it.difficulty || 1,
    it.theme || null
  );
}
console.log(`已导入 ${items.length} 篇内容到数据库。`);
