import { supabase } from '@/lib/supabase';

export type StudentLessonDetail = {
  lesson_no: number;
  current_step: number | null;
  quiz_score: number | null;
  completed: boolean | null;
  updated_at: string | null;
  reflection: string | null;
  reflection_status: 'visible' | 'hidden' | 'deleted' | 'draft' | 'none';
};

export async function loadAdminStudentDetail(
  userId: string,
): Promise<StudentLessonDetail[]> {
  if (!supabase) throw new Error('저장 서비스에 연결하지 못했습니다.');
  const { data, error } = await supabase.rpc('read_admin_student_detail', {
    p_user_id: userId,
  });
  if (error)
    throw new Error(
      error.code === '42501'
        ? '담당 학급의 학생만 조회할 수 있습니다.'
        : '상세 기록을 불러오지 못했습니다. 다시 시도해 주세요.',
    );
  return (data ?? []) as StudentLessonDetail[];
}
