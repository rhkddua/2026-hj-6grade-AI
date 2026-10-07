// Read-only integration checks against saved lesson completions.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { getStudentBadges } from '../lib/student-badge.ts';
import { summarizeCourseProgress } from '../lib/student-course-progress.ts';
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
try {
  const student = await login(field('이메일'),field('임시 비밀번호'));
  const response = await fetch(env.VITE_SUPABASE_URL+'/rest/v1/lesson_progress?select=lesson_no,current_step,completed&user_id=eq.'+student.user.id,{
    signal:AbortSignal.timeout(20000),headers:{apikey:env.VITE_SUPABASE_PUBLISHABLE_KEY,Authorization:`Bearer ${student.access_token}`},
  });
  assert.equal(response.status,200);
  const records=(await response.json()).map(row=>({lessonNo:row.lesson_no,currentStep:row.current_step,completed:row.completed}));
  const course=summarizeCourseProgress(records);
  const result=getStudentBadges(course.lessons);
  const completed=records.filter(row=>row.completed && row.lessonNo>=1 && row.lessonNo<=10).map(row=>row.lessonNo).sort((a,b)=>a-b);
  assert.deepEqual(result.badges.filter(badge=>badge.earned).map(badge=>badge.lessonNo),completed);
  assert.equal(result.earnedCount,course.completedCount);
  console.log('PASS real saved completions match all lesson badges');
  console.log(JSON.stringify({earnedCount:result.earnedCount,completedLessons:completed,nextLesson:result.nextBadge?.lessonNo??null}));
} finally {
  for(const token of sessions)await request('/auth/v1/logout?scope=local',{},token);
}
