import { supabase } from '@/lib/supabase';
import { validateApp } from '@/lib/student-apps';

export type AppAction = 'edit' | 'hide' | 'restore' | 'delete';
export const appActionLabels: Record<AppAction, string> = {
  edit: '수정',
  hide: '숨김',
  restore: '복원',
  delete: '완전 삭제',
};
export type AdminStudentApp = {
  id: string;
  user_id: string;
  title: string;
  lesson_no: number;
  url: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  management_version: number;
  student_name: string;
  grade: number;
  class_no: number;
  student_no: number;
  account_email: string;
};
export type AdminAppsResult = {
  entries: AdminStudentApp[];
  total: number;
  visible: number;
  hidden: number;
  classes: number[];
};
export type AppAudit = {
  id: number;
  app_id: string;
  actor_name: string;
  action: AppAction;
  reason: string;
  created_at: string;
};

export function appManagementError(error: unknown) {
  const code = (error as { code?: string })?.code;
  if (code === '42501')
    return '담당 학급의 앱을 관리할 권한이 없습니다. 관리자 로그인과 학급 배정을 확인해 주세요.';
  if (code === 'P0001' || code === 'P0002')
    return '다른 관리자가 앱을 변경하거나 삭제했습니다. 닫은 뒤 새로고침해 주세요.';
  if (code === '22023' || code === '22P02')
    return '입력 내용과 처리 사유를 확인해 주세요.';
  return error instanceof Error
    ? error.message
    : '앱 보관함을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.';
}
export async function queryAdminApps(filters: {
  classNo: string;
  lesson: string;
  status: string;
  search: string;
  sort: string;
  page: number;
}): Promise<AdminAppsResult> {
  if (!supabase) throw new Error('저장 서비스에 연결하지 못했습니다.');
  const { data, error } = await supabase.rpc('query_admin_student_apps', {
    p_class_no: filters.classNo === 'all' ? null : Number(filters.classNo),
    p_lesson_no: filters.lesson === 'all' ? null : Number(filters.lesson),
    p_status: filters.status,
    p_search: filters.search.trim(),
    p_sort: filters.sort,
    p_offset: filters.page * 50,
  });
  if (error) throw error;
  return data as AdminAppsResult;
}
export async function manageApps(
  entries: AdminStudentApp[],
  action: AppAction,
  reason: string,
  values?: { title: string; lesson: number; url: string },
): Promise<number> {
  if (!supabase) throw new Error('저장 서비스에 연결하지 못했습니다.');
  const validated = values
    ? validateApp(values.title, values.lesson, values.url)
    : null;
  const { data, error } = await supabase.rpc('manage_student_apps', {
    p_entries: entries.map(({ id, management_version, updated_at }) => ({
      id,
      management_version,
      updated_at,
    })),
    p_action: action,
    p_reason: reason.trim(),
    p_values: validated,
  });
  if (error) throw error;
  return data as number;
}
export async function loadAppAudit(id: string): Promise<AppAudit[]> {
  if (!supabase) throw new Error('저장 서비스에 연결하지 못했습니다.');
  const { data, error } = await supabase.rpc('read_student_app_audit', {
    p_app_id: id,
  });
  if (error) throw error;
  return (data ?? []) as AppAudit[];
}
