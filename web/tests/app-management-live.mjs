// Read-only RPC integration checks; no existing app or progress writes.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
const accounts = fs.readFileSync('../TEST_ACCOUNT.md', 'utf8');
const field = (label) => accounts.match(new RegExp(`^- ${label}:\\s*\x60?([^\x60\\r\\n]+)`, 'm'))?.[1].trim();
const env = Object.fromEntries(fs.readFileSync('.env.local', 'utf8').split(/\r?\n/).filter((line) => line.includes('=')).map((line) => { const index = line.indexOf('='); return [line.slice(0, index), line.slice(index + 1).trim().replace(/^['"]|['"]$/g, '')]; }));
const sessions = [];
async function request(path, body, token) {
  const response = await fetch(env.VITE_SUPABASE_URL + path, {
    method: 'POST', signal: AbortSignal.timeout(20000),
    headers: { apikey: env.VITE_SUPABASE_PUBLISHABLE_KEY, 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  return { status: response.status, data: await response.json().catch(() => null) };
}
async function login(email, password) {
  const result = await request('/auth/v1/token?grant_type=password', { email, password });
  assert.equal(result.status, 200, 'test login'); sessions.push(result.data.access_token); return result.data;
}
const ok = (result, label) => { assert.ok(result.status >= 200 && result.status < 300, `${label}: ${result.status}`); return result.data; };
try {
  const admin = await login(field('관리자 이메일'), field('관리자 비밀번호'));
  const student = await login(field('이메일'), field('임시 비밀번호'));
  const query = '/rest/v1/rpc/query_admin_student_apps';
  const manage = '/rest/v1/rpc/manage_student_apps';
  const missingId = randomUUID();
  const payload = { p_entries: [{ id: missingId, management_version: 0, updated_at: '2000-01-01T00:00:00Z' }], p_action: 'delete', p_reason: '존재하지 않는 대상 차단 검증' };
  assert.ok([401, 403].includes((await request(query, {})).status));
  assert.ok([401, 403].includes((await request(manage, payload)).status));
  assert.ok([401, 403].includes((await request(query, {}, student.access_token)).status));
  assert.ok([401, 403].includes((await request(manage, payload, student.access_token)).status));
  console.log('PASS signed-out and student management denied');
  const empty = ok(await request(query, { p_search: missingId }, admin.access_token), 'empty admin query');
  assert.deepEqual(empty.entries, []); assert.equal(empty.total, 0); assert.equal(empty.visible, 0); assert.equal(empty.hidden, 0); assert.ok(Array.isArray(empty.classes));
  console.log('PASS scoped empty query and statistics');
  const missing = await request(manage, payload, admin.access_token);
  assert.equal(missing.data?.code, 'P0002');
  const invalid = await request(manage, { ...payload, p_entries: [] }, admin.access_token);
  assert.equal(invalid.data?.code, '22023');
  console.log('PASS missing target and empty batch rejected without writes');
  const own = ok(await request(query, { p_search: student.user.id }, admin.access_token), 'test student query');
  assert.ok(own.entries.every((entry) => entry.user_id === student.user.id));
  assert.equal(own.visible + own.hidden, own.total);
  console.log('PASS test-account search and count consistency');
  console.log('ALL APP MANAGEMENT LIVE CHECKS PASSED');
} finally {
  for (const token of sessions) await request('/auth/v1/logout?scope=local', {}, token);
}
