import { supabase } from '@/lib/supabase';

export type AdminStudent = {
  userId: string;
  name: string;
  grade: number;
  classNo: number;
  studentNo: number;
  completedLessons: number;
  startedLessons: number;
  averageQuizScore: number | null;
  latestLesson: number | null;
  latestUpdatedAt: string | null;
};

export type AdminProgress = {
  userId: string;
  lessonNo: number;
  currentStep: number;
  quizScore: number | null;
  reflection: string;
  completed: boolean;
  updatedAt: string;
};

export type AdminDashboardData = {
  students: AdminStudent[];
  progress: AdminProgress[];
};

type StudentRow = {
  user_id: string;
  student_name: string;
  grade: number;
  class_no: number;
  student_no: number;
};

type ProgressRow = {
  user_id: string;
  lesson_no: number;
  current_step: number;
  quiz_score: number | null;
  reflection: string;
  completed: boolean;
  updated_at: string;
};

export async function loadAdminDashboard(): Promise<AdminDashboardData> {
  if (!supabase) throw new Error('Supabase가 설정되지 않았습니다.');

  const [studentResult, progressResult] = await Promise.all([
    supabase
      .from('student_profiles')
      .select('user_id,student_name,grade,class_no,student_no')
      .order('class_no')
      .order('student_no')
      .overrideTypes<StudentRow[], { merge: false }>(),
    supabase
      .from('lesson_progress')
      .select('user_id,lesson_no,current_step,quiz_score,reflection,completed,updated_at')
      .order('updated_at', { ascending: false })
      .overrideTypes<ProgressRow[], { merge: false }>(),
  ]);

  if (studentResult.error) throw studentResult.error;
  if (progressResult.error) throw progressResult.error;

  const studentRows = studentResult.data ?? [];
  const studentUserIds = new Set(studentRows.map((row) => row.user_id));
  const progress = (progressResult.data ?? []).filter((row) => studentUserIds.has(row.user_id)).map((row) => ({
    userId: row.user_id,
    lessonNo: row.lesson_no,
    currentStep: row.current_step,
    quizScore: row.quiz_score,
    reflection: row.reflection ?? '',
    completed: row.completed,
    updatedAt: row.updated_at,
  }));

  const byUser = new Map<string, AdminProgress[]>();
  for (const item of progress) {
    const items = byUser.get(item.userId) ?? [];
    items.push(item);
    byUser.set(item.userId, items);
  }

  const students = studentRows.map((row) => {
    const items = byUser.get(row.user_id) ?? [];
    const quizScores = items.flatMap((item) => item.quizScore === null ? [] : [item.quizScore]);
    const latest = items.reduce<AdminProgress | null>((current, item) => {
      if (!current || new Date(item.updatedAt).getTime() > new Date(current.updatedAt).getTime()) return item;
      return current;
    }, null);

    return {
      userId: row.user_id,
      name: row.student_name,
      grade: row.grade,
      classNo: row.class_no,
      studentNo: row.student_no,
      completedLessons: items.filter((item) => item.completed).length,
      startedLessons: items.length,
      averageQuizScore: quizScores.length > 0
        ? Math.round((quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length) * 10) / 10
        : null,
      latestLesson: latest?.lessonNo ?? null,
      latestUpdatedAt: latest?.updatedAt ?? null,
    };
  });

  return { students, progress };
}
