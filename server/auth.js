import crypto from 'node:crypto';
import { db } from './db.js';

const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 天

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function createUser(username, password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const password_hash = hashPassword(password, salt);
  const stmt = db.prepare(
    'INSERT INTO users (username, password_hash, salt) VALUES (?, ?, ?)'
  );
  const res = stmt.run(username, password_hash, salt);
  return Number(res.lastInsertRowid);
}

export function verifyUser(username, password) {
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) return null;
  const hash = hashPassword(password, user.salt);
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(user.password_hash, 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return { id: user.id, username: user.username };
}

export function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expires_at = new Date(Date.now() + TOKEN_TTL_MS).toISOString();
  db.prepare(
    'INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)'
  ).run(token, userId, expires_at);
  return token;
}

export function getUserByToken(token) {
  if (!token) return null;
  const s = db.prepare('SELECT * FROM sessions WHERE token = ?').get(token);
  if (!s) return null;
  if (new Date(s.expires_at).getTime() < Date.now()) return null;
  return db.prepare('SELECT id, username, created_at FROM users WHERE id = ?').get(s.user_id);
}

export function getTokenFromHeader(req) {
  const h = req.headers['authorization'] || '';
  return h.startsWith('Bearer ') ? h.slice(7) : null;
}
