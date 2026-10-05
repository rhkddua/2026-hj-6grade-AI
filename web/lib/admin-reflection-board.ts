import { supabase } from '@/lib/supabase';

export type AdminBoardEntry = {
  user_id: string;
  account_email: string;
  student_name: string;
  grade: number | null;
  class_no: number | null;
  student_no: number | null;
  lesson_no: number;
  reflection: string;
  updated_at: string;
  is_hidden: boolean;
  moderation_version: number;
};
export type BoardAudit = {
  id: string;
  actor_name: string;
  action: 'hide' | 'restore';
  reason: string;
  lesson_no: number;
  created_at: string;
};

export async function loadAdminBoard(lesson: string, status: string, search: string, page: number) {
  if (!supabase) throw new Error('연결할 수 없습니다.');
  const { data, error } = await supabase.rpc('read_admin_reflection_board', {
    p_lesson_no: lesson === 'all' ? null : Number(lesson),
    p_status: status,
    p_search: search.trim(),
    p_offset: page * 50,
  });
  if (error) throw error;
  return (data ?? []) as AdminBoardEntry[];
}

export async function moderateBoard(entry: AdminBoardEntry, reason: string) {
  if (!supabase) throw new Error('연결할 수 없습니다.');
  const { error } = await supabase.rpc('moderate_lesson_reflection', {
    p_user_id: entry.user_id,
    p_lesson_no: entry.lesson_no,
    p_hidden: !entry.is_hidden,
    p_reason: reason.trim(),
    p_expected_version: entry.moderation_version,
    p_expected_updated_at: entry.updated_at,
  });
  if (error) throw error;
}

export async function loadBoardAudit(entry: AdminBoardEntry) {
  if (!supabase) throw new Error('연결할 수 없습니다.');
  const { data, error } = await supabase.rpc('read_admin_reflection_audit', {
    p_user_id: entry.user_id, p_lesson_no: entry.lesson_no,
  });
  if (error) throw error;
  return (data ?? []) as BoardAudit[];
}
