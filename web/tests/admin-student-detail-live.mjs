// Read-only RPC integration checks; no existing board or progress writes.
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
  const path = '/rest/v1/rpc/read_admin_student_detail';
  const args = { p_user_id: student.user.id };
  assert.ok([401,403].includes((await request(path,args)).status));
  assert.ok([401,403].includes((await request(path,args,student.access_token)).status));
  assert.equal((await request(path,{p_user_id:randomUUID()},admin.access_token)).data?.code,'42501');
  console.log('PASS signed-out, student and unknown-target detail denied');
  const details = ok(await request(path,args,admin.access_token),'admin detail');
  assert.equal(details.length,10);
  assert.deepEqual(details.map(item=>item.lesson_no),[1,2,3,4,5,6,7,8,9,10]);
  assert.ok(details.every(item=>['visible','hidden','deleted','draft','none'].includes(item.reflection_status)));
  assert.ok(details.filter(item=>item.reflection_status==='deleted').every(item=>item.reflection===null));
  const board = ok(await request('/rest/v1/rpc/query_admin_reflection_board',{p_search:student.user.id},admin.access_token),'current board');
  for (const entry of board.entries) {
    const detail=details.find(item=>item.lesson_no===entry.lesson_no);
    assert.equal(detail.reflection,entry.reflection);
    assert.equal(detail.reflection_status,entry.is_hidden?'hidden':'visible');
  }
  const ownResponse=await fetch(env.VITE_SUPABASE_URL+'/rest/v1/lesson_progress?select=lesson_no,current_step,quiz_score,completed,updated_at&user_id=eq.'+student.user.id,{
    signal:AbortSignal.timeout(20000),headers:{apikey:env.VITE_SUPABASE_PUBLISHABLE_KEY,Authorization:`Bearer ${student.access_token}`},
  });
  assert.equal(ownResponse.status,200);
  for(const progress of await ownResponse.json()) {
    const detail=details.find(item=>item.lesson_no===progress.lesson_no);
    for(const key of ['current_step','quiz_score','completed','updated_at'])assert.equal(detail[key],progress[key]);
  }
  console.log('PASS current board body, deleted body suppression and preserved lesson progress');
  assert.deepEqual(ok(await request(path,args,admin.access_token),'reopened detail'),details);
  console.log('PASS repeated current-detail reads');
  console.log('ALL ADMIN STUDENT DETAIL LIVE CHECKS PASSED');
} finally {
  for (const token of sessions) await request('/auth/v1/logout?scope=local',{},token);
}
