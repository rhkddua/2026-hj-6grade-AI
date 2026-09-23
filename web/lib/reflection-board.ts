import { supabase } from '@/lib/supabase';

export const lessonTitles = [
  '코딩은 어떻게 발전했을까?',
  '전통 코딩과 AI 코딩',
  'AI는 무엇을 잘하고 못할까?',
  'AI에게 잘 지시하는 방법',
  'Canva AI 코드 시작하기',
  '한 기능 앱 만들기',
  '앱 기능 설계하기',
  '두 기능 앱 만들기',
  '나에게 필요한 앱 만들기',
  '공유하고 개선하기',
] as const;

export type ReflectionBoardEntry = {
  lesson_no: number;
  reflection: string;
  updated_at: string;
};

function requireSupabase() {
  if (!supabase)
    throw new Error('게시판에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.');
  return supabase;
}

export async function publishLessonReflection(
  lessonNo: number,
  reflection: string,
) {
  const client = requireSupabase();
  const { error } = await client.rpc('publish_lesson_reflection', {
    p_lesson_no: lessonNo,
    p_reflection: reflection.trim(),
  });
  if (error) throw error;
}

export async function loadReflectionBoard(lessonNo: number | null) {
  const client = requireSupabase();
  const { data, error } = await client.rpc('read_lesson_reflection_board', {
    p_lesson_no: lessonNo,
  });
  if (error) throw error;
  return (Array.isArray(data) ? data : []) as ReflectionBoardEntry[];
}
