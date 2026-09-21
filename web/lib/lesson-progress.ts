import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export type LessonProgress = {
  lessonNo: number;
  currentStep: number;
  quizScore: number | null;
  reflection: string;
  completed: boolean;
  activityData?: Record<string, unknown>;
};

async function getStudentUserId() {
  if (!supabase) throw new Error('Supabase가 설정되지 않았습니다.');

  const { data } = await supabase.auth.getUser();
  if (!data.user || data.user.is_anonymous) throw new Error('학생 로그인이 필요합니다.');
  return data.user.id;
}

export async function loadLessonProgress(lessonNo: number, includeActivities = false): Promise<LessonProgress | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const userId = await getStudentUserId();
  const { data, error } = await supabase
    .from('lesson_progress')
    .select(`lesson_no,current_step,quiz_score,reflection,completed${includeActivities ? ',activity_data' : ''}`)
    .eq('user_id', userId)
    .eq('lesson_no', lessonNo)
    .maybeSingle()
    .overrideTypes<{ lesson_no: number; current_step: number; quiz_score: number | null; reflection: string; completed: boolean; activity_data?: Record<string, unknown> }, { merge: false }>();

  if (error) throw error;
  if (!data) return null;
  return {
    lessonNo: data.lesson_no,
    currentStep: data.current_step,
    quizScore: data.quiz_score,
    reflection: data.reflection ?? '',
    completed: data.completed,
    ...(includeActivities ? { activityData: data.activity_data } : {}),
  };
}

export async function saveLessonProgress(progress: LessonProgress) {
  if (!isSupabaseConfigured || !supabase) throw new Error('Supabase가 설정되지 않았습니다.');
  const userId = await getStudentUserId();
  const { error } = await supabase.from('lesson_progress').upsert(
    {
      user_id: userId,
      lesson_no: progress.lessonNo,
      current_step: progress.currentStep,
      quiz_score: progress.quizScore,
      reflection: progress.reflection,
      completed: progress.completed,
      ...(progress.activityData !== undefined ? { activity_data: progress.activityData } : {}),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,lesson_no' },
  );
  if (error) throw error;
}
