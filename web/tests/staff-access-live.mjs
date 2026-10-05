import fs from 'node:fs';
import assert from 'node:assert/strict';

const accounts = fs.readFileSync('../TEST_ACCOUNT.md', 'utf8');
const field = (label) => accounts.match(new RegExp(`^- ${label}:\\s*\x60?([^\x60\\r\\n]+)`, 'm'))?.[1].trim();
const env = Object.fromEntries(fs.readFileSync('.env.local', 'utf8').split(/\r?\n/).filter(x => x.includes('=')).map(x => {
  const i = x.indexOf('='); return [x.slice(0, i), x.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')];
}));
const sessions = [];
async function request(path, body, token, method = 'POST') {
  const r = await fetch(env.VITE_SUPABASE_URL + path, {
    method, signal: AbortSignal.timeout(20000),
    headers: { apikey: env.VITE_SUPABASE_PUBLISHABLE_KEY, 'Content-Type': 'application/json', Prefer: 'return=representation', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  return { status: r.status, data: await r.json().catch(() => null) };
}
function ok(r, label) { assert.ok(r.status >= 200 && r.status < 300, `${label}: ${r.status}`); return r.data; }
async function login(email, password) {
  const data = ok(await request('/auth/v1/token?grant_type=password', { email, password }), 'login');
  sessions.push(data.access_token); return data;
}
try {
  const admin = await login(field('관리자 이메일'), field('관리자 비밀번호'));
  const student = await login(field('이메일'), field('임시 비밀번호'));
  const staff = ok(await request('/rest/v1/rpc/read_staff_access', {}, admin.access_token), 'staff access');
  assert.equal(staff.length, 1); assert.equal(staff[0].role, 'super_admin');
  console.log('PASS actual admin staff RPC');
  assert.deepEqual(ok(await request('/rest/v1/rpc/read_staff_access', {}, student.access_token), 'student staff'), []);
  console.log('PASS actual student staff RPC empty');
  assert.ok([401, 403].includes((await request('/rest/v1/rpc/read_staff_access', {})).status));
  console.log('PASS signed-out staff RPC denied');
  const assignments = ok(await request('/rest/v1/teacher_class_assignments?select=grade,class_no&order=class_no', undefined, admin.access_token, 'GET'), 'assignments');
  assert.deepEqual(assignments, Array.from({ length: 7 }, (_, i) => ({ grade: 6, class_no: i + 1 })));
  console.log('PASS seven persisted class assignments');
  assert.deepEqual(ok(await request('/rest/v1/teacher_class_assignments?select=*', undefined, student.access_token, 'GET'), 'student assignments'), []);
  console.log('PASS student cannot read assignments');
  const profiles = ok(await request('/rest/v1/student_profiles?select=user_id', undefined, student.access_token, 'GET'), 'student profile');
  assert.deepEqual(profiles.map(x => x.user_id), [student.user.id]);
  const records = ok(await request('/rest/v1/lesson_progress?select=*&user_id=eq.' + student.user.id, undefined, student.access_token, 'GET'), 'student progress');
  assert.ok(records.length > 0);
  const original = records[0];
  // Idempotent self-service update: preserve every stored value, including timestamp.
  const saved = ok(await request(`/rest/v1/lesson_progress?user_id=eq.${student.user.id}&lesson_no=eq.${original.lesson_no}`, { reflection: original.reflection, updated_at: original.updated_at }, student.access_token, 'PATCH'), 'student save');
  assert.deepEqual(saved, [original]);
  console.log('PASS student own progress save preserves original data');
  console.log('ALL STAFF ACCESS LIVE API CHECKS PASSED (teacher JWT simulation is separate)');
} finally {
  for (const token of sessions) await request('/auth/v1/logout?scope=local', {}, token);
}
