import type { LessonProgress } from './lesson-progress';

// The lesson's saved completion flag is authoritative; visiting a page alone
// must never award a badge. No separate badge record or weekly reset is needed.
export function getStudentBadge(progress: LessonProgress | null) {
  const earned = progress?.lessonNo === 1 && progress.completed === true;
  return {
    earned,
    requirements: [
      { label: '1차시 퀴즈 2문제 모두 맞히기', done: earned || (progress?.lessonNo === 1 && progress.quizScore === 2) },
      { label: '한 문장 정리 10자 이상 쓰기', done: earned || (progress?.lessonNo === 1 && progress.reflection.trim().length >= 10) },
      { label: '게임과 수학 실험을 마치고 1차시 완료 저장하기', done: earned },
    ],
  };
}
