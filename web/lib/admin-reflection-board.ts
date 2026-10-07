import { supabase } from '@/lib/supabase';
import {
  BOARD_PAGE_SIZE,
  boardSnapshots,
  type BoardAction,
  type BoardSort,
} from '@/lib/admin-board-management';

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
  action: BoardAction;
  reason: string;
  lesson_no: number;
  created_at: string;
};

export type AdminBoardResult = {
  entries: AdminBoardEntry[];
  total: number;
  visible: number;
  hidden: number;
  classes: number[];
};

export async function queryAdminBoard(filters: {
  lesson: string;
  status: string;
  search: string;
  classNo: string;
  sort: BoardSort;
  page: number;
}) {
  if (!supabase) throw new Error('연결할 수 없습니다.');
  const { data, error } = await supabase.rpc('query_admin_reflection_board', {
    p_lesson_no: filters.lesson === 'all' ? null : Number(filters.lesson),
    p_status: filters.status,
    p_search: filters.search.trim(),
    p_class_no: filters.classNo === 'all' ? null : Number(filters.classNo),
    p_sort: filters.sort,
    p_offset: filters.page * BOARD_PAGE_SIZE,
  });
  if (error) throw error;
  return data as AdminBoardResult;
}

export async function manageBoard(
  entries: AdminBoardEntry[],
  action: BoardAction,
  reason: string,
) {
  if (!supabase) throw new Error('연결할 수 없습니다.');
  const { data, error } = await supabase.rpc('manage_reflection_board', {
    p_entries: boardSnapshots(entries),
    p_action: action,
    p_reason: reason.trim(),
  });
  if (error) throw error;
  return Number(data);
}

export async function loadAdminBoard(
  lesson: string,
  status: string,
  search: string,
  page: number,
) {
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
    p_user_id: entry.user_id,
    p_lesson_no: entry.lesson_no,
  });
  if (error) throw error;
  return (data ?? []) as BoardAudit[];
}
