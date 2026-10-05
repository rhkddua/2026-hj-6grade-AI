// Read-only baseline for the dedicated account. Never writes lesson records.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(new URL('../web/package.json', import.meta.url));
const { createClient } = require('@supabase/supabase-js');
let client;
try {
  const account = await readFile(path.join(root, 'TEST_ACCOUNT.md'), 'utf8');
  const field = label => account.match(new RegExp(`^- ${label}:\\s*\x60?([^\x60\\r\\n]+)\x60?`, 'm'))?.[1]?.trim();
  const email = field('이메일');
  const password = field('임시 비밀번호');
  const envText = await readFile(path.join(root, 'web/.env.local'), 'utf8');
  const envValue = key => {
    const value = envText.match(new RegExp(`^${key}\\s*=\\s*(.+)$`, 'm'))?.[1]?.trim();
    return value?.replace(/^(['"])(.*)\1$/, '$2');
  };
  const url = envValue('VITE_SUPABASE_URL');
  const key = envValue('VITE_SUPABASE_PUBLISHABLE_KEY');
  if (!email || !password || !url || !key) throw new Error('missing-config');
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  const login = await client.auth.signInWithPassword({ email, password });
  if (login.error || !login.data.user || login.data.user.is_anonymous) throw new Error('login');
  const userId = login.data.user.id;
  const query = await client.from('lesson_progress')
    .select('lesson_no,current_step,quiz_score,reflection,completed,activity_data,updated_at')
    .eq('user_id', userId).order('lesson_no');
  if (query.error) throw new Error('query');
  const lessons = Array.from({ length: 10 }, (_, index) => {
    const row = query.data.find(item => item.lesson_no === index + 1);
    return {
      lesson: index + 1, hasRecord: Boolean(row), step: row?.current_step ?? null,
      quizScore: row?.quiz_score ?? null, completed: row?.completed ?? false,
      reflectionLength: row?.reflection?.trim().length ?? 0,
      activityFieldCount: Object.keys(row?.activity_data ?? {}).length,
      updatedAt: row?.updated_at ?? null,
    };
  });
  // Only lengths/counts/state are exported: no account identifiers or answers.
  const report = { capturedAt: new Date().toISOString(), source: 'dedicated-test-account', lessons };
  const folder = path.join(root, 'web/outputs/lesson-e2e');
  await mkdir(folder, { recursive: true });
  await writeFile(path.join(folder, 'baseline.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} catch {
  console.error('기준 기록을 확인하지 못했습니다. TEST_ACCOUNT.md와 로컬 Supabase 설정·연결을 확인하세요. 비밀정보는 출력하지 않습니다.');
  process.exitCode = 1;
} finally {
  if (client) await client.auth.signOut().catch(() => {});
}
