import { supabase } from '@/lib/supabase';

export type StudentApp = {
  id: string;
  title: string;
  lesson_no: number;
  url: string;
  deleted_at: string | null;
};

export function validateApp(title: string, lessonNo: number, url: string) {
  if (!title.trim() || title.trim().length > 80)
    throw new Error('앱 이름을 1~80자로 적어 주세요.');
  if (!Number.isInteger(lessonNo) || lessonNo < 5 || lessonNo > 10)
    throw new Error('5~10차시 중에서 선택해 주세요.');
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    throw new Error('https://로 시작하는 공유 링크를 입력해 주세요.');
  }
  if (
    !['https:', 'http:'].includes(parsed.protocol) ||
    parsed.username ||
    parsed.password ||
    parsed.href.length > 2000
  )
    throw new Error('올바른 http 또는 https 공유 링크를 입력해 주세요.');
  return { title: title.trim(), lesson_no: lessonNo, url: parsed.href };
}

async function client() {
  if (!supabase) throw new Error('저장 서비스에 연결하지 못했어요.');
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user || data.user.is_anonymous)
    throw new Error('학생 로그인이 필요해요.');
  return { db: supabase, userId: data.user.id };
}

export async function loadStudentApps(): Promise<StudentApp[]> {
  const { db, userId } = await client();
  const { data, error } = await db
    .from('student_apps')
    .select('id,title,lesson_no,url,deleted_at')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });
  if (error)
    throw new Error(
      '앱 보관함을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
    );
  return data ?? [];
}

export async function saveStudentApp(
  title: string,
  lessonNo: number,
  url: string,
) {
  const values = validateApp(title, lessonNo, url);
  const { db, userId } = await client();
  const query = db.from('student_apps').insert({ ...values, user_id: userId });
  const { data, error } = await query.select('id').single();
  if (error || !data)
    throw new Error(
      '저장하지 못했어요. 입력 내용은 유지돼요. 다시 시도해 주세요.',
    );
}
