import test from 'node:test';
import assert from 'node:assert/strict';
import { getStudentBadges } from '../lib/student-badge.ts';
import { summarizeCourseProgress } from '../lib/student-course-progress.ts';

const record = (lessonNo, completed, currentStep = 5) => ({ lessonNo, completed, currentStep });
const collection = records => getStudentBadges(summarizeCourseProgress(records).lessons);

test('기록이 없으면 열 개 배지를 모두 도전 전으로 표시한다', () => {
  const result = collection([]);
  assert.equal(result.badges.length, 10);
  assert.equal(result.earnedCount, 0);
  assert.equal(result.allEarned, false);
  assert.equal(result.nextBadge.lessonNo, 1);
  assert.ok(result.badges.every(badge => !badge.earned && !badge.started));
});
for (let lessonNo = 1; lessonNo <= 10; lessonNo++) {
  test(`${lessonNo}차시 완료로 해당 배지만 획득한다`, () => {
    const result = collection([record(lessonNo, true, 1)]);
    assert.equal(result.earnedCount, 1);
    assert.deepEqual(result.badges.filter(badge => badge.earned).map(badge => badge.lessonNo), [lessonNo]);
  });
}
test('1차시가 없어도 완료한 2~10차시 배지를 모두 획득한다', () => {
  const result = collection(Array.from({ length: 9 }, (_, index) => record(index + 2, true)));
  assert.equal(result.earnedCount, 9);
  assert.equal(result.badges[0].earned, false);
  assert.ok(result.badges.slice(1).every(badge => badge.earned));
});
test('순서 밖 완료를 보존하고 다음 도전할 차시를 안내한다', () => {
  const result = collection([record(10, true), record(3, true), record(1, false)]);
  assert.deepEqual(result.badges.filter(badge => badge.earned).map(badge => badge.lessonNo), [3, 10]);
  assert.equal(result.nextBadge.lessonNo, 1);
  assert.equal(result.badges[0].started, true);
});
test('열 차시가 모두 완료되면 열 개 획득과 전체 완료 상태를 표시한다', () => {
  const result = collection(Array.from({ length: 10 }, (_, index) => record(index + 1, true)));
  assert.equal(result.earnedCount, 10);
  assert.equal(result.allEarned, true);
  assert.equal(result.nextBadge, null);
  assert.equal(result.badges[0].name, '첫걸음 탐험가');
});
test('마지막 단계에 도달해도 완료 저장이 없으면 배지를 발급하지 않는다', () => {
  const result = collection([record(2, false, 5), record(8, false, 5)]);
  assert.equal(result.earnedCount, 0);
  assert.equal(result.badges[1].started, true);
  assert.equal(result.badges[7].earned, false);
});
test('단계만 이동한 완료 기록은 유지하고 완료 해제된 차시는 미획득으로 돌아간다', () => {
  const saved = Array.from({ length: 10 }, (_, index) => record(index + 1, index !== 5, 1));
  const result = collection(saved);
  assert.equal(result.earnedCount, 9);
  assert.equal(result.badges[5].earned, false);
  assert.ok(result.badges.filter(badge => badge.lessonNo !== 6).every(badge => badge.earned));
});
test('범위 밖 기록을 무시하고 중복 기록으로 획득 수를 늘리지 않는다', () => {
  const result = collection([record(0, true), record(11, true), record(2, true), record(2, true)]);
  assert.equal(result.earnedCount, 1);
  assert.equal(result.badges.length, 10);
});
test('저장 기록을 다시 읽어도 같은 배지와 진도 완료 수를 표시한다', () => {
  const records = [record(1, true), record(4, true), record(9, false)];
  const restored = JSON.parse(JSON.stringify(records));
  assert.deepEqual(collection(restored), collection(records));
  assert.equal(collection(restored).earnedCount, summarizeCourseProgress(restored).completedCount);
});
