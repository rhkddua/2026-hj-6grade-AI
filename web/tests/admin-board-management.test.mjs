import assert from 'node:assert/strict';
import test from 'node:test';
import {
  boardEntryKey,
  boardSnapshots,
  boardManagementError,
} from '../lib/admin-board-management.ts';

const entry = {
  user_id: 'fixture-user',
  lesson_no: 1,
  moderation_version: 4,
  updated_at: '2026-10-07T00:00:00Z',
  reflection: '본문',
  account_email: 'private',
};
test('관리 요청은 식별자와 충돌 검사용 스냅샷만 전송한다', () => {
  assert.deepEqual(boardSnapshots([entry]), [
    {
      user_id: entry.user_id,
      lesson_no: 1,
      moderation_version: 4,
      updated_at: entry.updated_at,
    },
  ]);
  assert.notEqual(
    boardEntryKey(entry),
    boardEntryKey({ ...entry, lesson_no: 2 }),
  );
});
test('일괄 요청의 빈 선택, 초과, 중복 대상을 거부한다', () => {
  assert.throws(() => boardSnapshots([]));
  assert.throws(() =>
    boardSnapshots(
      Array.from({ length: 51 }, (_, i) => ({
        ...entry,
        user_id: `fixture-${i}`,
      })),
    ),
  );
  assert.throws(() => boardSnapshots([entry, { ...entry }]));
  assert.equal(
    boardSnapshots([{ ...entry }, { ...entry, lesson_no: 2 }]).length,
    2,
  );
});
test('충돌·권한·DB 준비·불명확한 통신 결과를 구별해 안내한다', () => {
  assert.match(boardManagementError({ code: 'P0001' }), /적용되지 않았습니다/);
  assert.match(boardManagementError({ code: 'P0002' }), /다시 선택/);
  assert.match(boardManagementError({ code: '42501' }), /담당 학급/);
  assert.match(
    boardManagementError({ code: 'PGRST202' }),
    /데이터베이스 업데이트/,
  );
  assert.match(
    boardManagementError(new Error('network')),
    /처리 결과를 확인하지 못했습니다/,
  );
});
