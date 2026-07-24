import { db } from './db.js';
import { readFileSync } from 'node:fs';

function insertContent(items) {
  const stmt = db.prepare(
    `INSERT OR REPLACE INTO content
     (id, type, title, author, original, translation, vocab_json, tags_json, difficulty, theme)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  let maxId = db.prepare('SELECT MAX(id) AS m FROM content').get().m || 0;
  let n = 0;
  for (const it of items) {
    const id = Number.isInteger(it.id) ? it.id : ++maxId;
    stmt.run(
      id,
      it.type || 'poem',
      it.title || 'Untitled',
      it.author || null,
      it.original || '',
      it.translation || '',
      JSON.stringify(it.vocab || []),
      JSON.stringify(it.tags || []),
      it.difficulty || 1,
      it.theme || null
    );
    n++;
  }
  return n;
}

// 免费开源库:PoetryDB(诗歌,公共领域)
export async function fetchPoetryDB(limit = 20) {
  const res = await fetch(`https://poetrydb.org/random/random/${limit}`);
  const data = await res.json();
  const arr = Array.isArray(data) ? data : [data];
  const items = arr.map((d) => ({
    type: 'poem',
    title: d.title || 'Untitled',
    author: d.author || '佚名',
    original: Array.isArray(d.lines) ? d.lines.join('\n') : (d.poem || ''),
    translation: '',
    vocab: [],
    tags: d.tags || [],
    theme: ''
  }));
  return insertContent(items);
}

// 免费开源库:Quotable(名言)
export async function fetchQuotable(limit = 20) {
  const res = await fetch(`https://api.quotable.io/quotes/random?limit=${limit}`);
  const data = await res.json();
  const arr = Array.isArray(data) ? data : [data];
  const items = arr.map((d) => ({
    type: 'quote',
    title: d.author || 'Quote',
    author: d.author || '',
    original: d.content || '',
    translation: '',
    vocab: [],
    tags: d.tags || [],
    theme: ''
  }));
  return insertContent(items);
}

// 本地 JSON 文件(内容或词表),格式见 README/下方说明
export function importFromFile(path) {
  const raw = readFileSync(path, 'utf-8');
  const data = JSON.parse(raw);
  const items = Array.isArray(data) ? data : [data];
  return insertContent(items);
}
