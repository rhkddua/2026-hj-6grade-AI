export const BOARD_PAGE_SIZE = 50;
export type BoardAction = 'hide' | 'restore' | 'delete';
export type BoardSort = 'newest' | 'oldest' | 'student';
export type BoardSnapshot = {
  user_id: string;
  lesson_no: number;
  moderation_version: number;
  updated_at: string;
};

export const boardActionLabels: Record<BoardAction, string> = {
  hide: '숨김',
  restore: '공개 복원',
  delete: '완전 삭제',
};

export function boardEntryKey(
  entry: Pick<BoardSnapshot, 'user_id' | 'lesson_no'>,
) {
  return `${entry.user_id}:${entry.lesson_no}`;
}

export function boardSnapshots(entries: BoardSnapshot[]) {
  if (entries.length === 0 || entries.length > BOARD_PAGE_SIZE)
    throw new Error('게시글은 1~50개까지 선택해 주세요.');
  if (new Set(entries.map(boardEntryKey)).size !== entries.length)
    throw new Error('같은 게시글을 중복 선택할 수 없습니다.');
  return entries.map(
    ({ user_id, lesson_no, moderation_version, updated_at }) => ({
      user_id,
      lesson_no,
      moderation_version,
      updated_at,
    }),
  );
}

export function boardManagementError(error: unknown) {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? error.code
      : '';
  if (code === 'P0001' || code === 'P0002')
    return '선택한 글이 수정되거나 삭제되었습니다. 목록을 새로고침한 뒤 다시 선택해 주세요. 이번 요청은 적용되지 않았습니다.';
  if (code === '42501')
    return '관리 권한이 없거나 담당 학급 밖의 글입니다. 계정과 학급 배정을 확인해 주세요.';
  if (code === 'PGRST202' || code === '42883')
    return '게시판 관리 기능의 데이터베이스 업데이트가 필요합니다. 관리자에게 문의해 주세요.';
  return '처리 결과를 확인하지 못했습니다. 목록과 처리 기록을 새로고침해 확인한 뒤 다시 시도해 주세요.';
}
