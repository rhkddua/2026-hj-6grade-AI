import assert from 'node:assert/strict';
import test from 'node:test';
import { summarizeCourseProgress } from '../lib/student-course-progress.ts';

const record = (lessonNo, completed, currentStep = 5) => ({ lessonNo, completed, currentStep });

test('기록 없는 학생은 0%와 첫 학습 차시를 표시한다', () => {
  const result = summarizeCourseProgress([]);
  assert.equal(result.progressPercent, 0);
  assert.equal(result.nextLessonNo, 1);
  assert.equal(result.inProgressCount, 0);
  assert.ok(result.lessons.every(lesson => lesson.status === 'open'));
});

test('완료 여부는 단계 번호와 독립적이며 다음 미완료 차시로 이동한다', () => {
  const result = summarizeCourseProgress([record(1, true, 1), record(2, true, 4)]);
  assert.equal(result.progressPercent, 20);
  assert.equal(result.completedCount, 2);
  assert.equal(result.nextLessonNo, 3);
  assert.equal(result.lessons[0].status, 'done');
  assert.equal(result.lessons[1].status, 'done');
});

test('5단계에 도달해도 미완료 기록은 완료로 오인하지 않는다', () => {
  const result = summarizeCourseProgress([record(1, false)]);
  assert.equal(result.progressPercent, 0);
  assert.equal(result.nextLessonNo, 1);
  assert.equal(result.inProgressCount, 1);
});

test('순서 밖 완료는 보존하고 가장 앞의 미완료 차시를 안내한다', () => {
  const result = summarizeCourseProgress([record(3, true), record(1, true)]);
  assert.equal(result.nextLessonNo, 2);
  assert.equal(result.progressPercent, 20);
  assert.equal(result.lessons[2].status, 'done');
});

test('모두 완료하면 100%와 완료 상태를 표시한다', () => {
  const result = summarizeCourseProgress(Array.from({ length: 10 }, (_, i) => record(i + 1, true)));
  assert.equal(result.progressPercent, 100);
  assert.equal(result.nextLessonNo, null);
  assert.equal(result.inProgressCount, 0);
});

test('완료 후 수정으로 완료가 해제되면 그 차시와 90%를 다시 표시한다', () => {
  const result = summarizeCourseProgress(Array.from({ length: 10 }, (_, i) => record(i + 1, i !== 2)));
  assert.equal(result.progressPercent, 90);
  assert.equal(result.nextLessonNo, 3);
  assert.equal(result.lessons[2].status, 'current');
});

test('과정 범위 밖 기록은 진도에 포함하지 않는다', () => {
  const result = summarizeCourseProgress([record(0, true), record(11, true), record(1.5, true)]);
  assert.equal(result.progressPercent, 0);
  assert.equal(result.nextLessonNo, 1);
});
