export type CourseLessonRecord = {
  lessonNo: number;
  currentStep: number;
  completed: boolean;
};

export function summarizeCourseProgress(records: CourseLessonRecord[]) {
  const saved = new Map(records.filter(row =>
    Number.isInteger(row.lessonNo) && row.lessonNo >= 1 && row.lessonNo <= 10,
  ).map(row => [row.lessonNo, row]));
  const lessons = Array.from({ length: 10 }, (_, index) => {
    const lessonNo = index + 1;
    const record = saved.get(lessonNo);
    return {
      lessonNo,
      status: record?.completed === true ? 'done' : record ? 'current' : 'open',
      started: Boolean(record),
    };
  });
  const completedCount = lessons.filter(lesson => lesson.status === 'done').length;
  return {
    lessons,
    completedCount,
    progressPercent: completedCount * 10,
    inProgressCount: lessons.filter(lesson => lesson.status === 'current').length,
    nextLessonNo: lessons.find(lesson => lesson.status !== 'done')?.lessonNo ?? null,
  };
}
