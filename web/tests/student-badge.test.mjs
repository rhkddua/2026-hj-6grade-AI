import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getStudentBadge } from '../lib/student-badge.ts';

const saved = { lessonNo: 1, currentStep: 5, quizScore: 2, reflection: '배움 기록을 열 글자 이상 작성했어요.', completed: false };
test('새 학생은 배지가 없고 모든 조건이 남아 있다', () => {
  const badge = getStudentBadge(null);
  assert.equal(badge.earned, false);
  assert.deepEqual(badge.requirements.map(item => item.done), [false, false, false]);
});
test('퀴즈와 성찰만으로 배지를 발급하지 않는다', () => {
  const badge = getStudentBadge(saved);
  assert.equal(badge.earned, false);
  assert.deepEqual(badge.requirements.map(item => item.done), [true, true, false]);
});
test('1차시 완료 저장 후 획득 상태를 복원한다', () => {
  const badge = getStudentBadge(JSON.parse(JSON.stringify({ ...saved, completed: true })));
  assert.equal(badge.earned, true);
  assert.ok(badge.requirements.every(item => item.done));
});
test('답안 수정으로 완료가 해제되면 다시 도전 상태가 된다', () => {
  assert.equal(getStudentBadge({ ...saved, completed: false, quizScore: 1 }).earned, false);
  assert.equal(getStudentBadge({ ...saved, quizScore: 1 }).requirements[0].done, false);
});
test('공백과 10자 미만 성찰은 남은 조건으로 표시한다', () => {
  assert.equal(getStudentBadge({ ...saved, reflection: '   짧은 문장  ' }).requirements[1].done, false);
});
test('다른 차시의 완료로 첫걸음 배지를 받지 않는다', () => {
  const badge = getStudentBadge({ ...saved, lessonNo: 2, completed: true });
  assert.equal(badge.earned, false);
  assert.ok(badge.requirements.every(item => !item.done));
});
