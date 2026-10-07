export const STUDENT_BADGES = [
  {
    lessonNo: 1,
    name: '첫걸음 탐험가',
    description: '코딩이 발전해 온 길을 탐험했어요.',
  },
  {
    lessonNo: 2,
    name: 'AI 코딩 비교가',
    description: '전통 코딩과 AI 코딩의 차이를 이해했어요.',
  },
  {
    lessonNo: 3,
    name: 'AI 판별가',
    description: 'AI가 잘하는 일과 확인이 필요한 일을 구별했어요.',
  },
  {
    lessonNo: 4,
    name: '프롬프트 설계자',
    description: 'AI에게 필요한 조건을 분명하게 전달했어요.',
  },
  {
    lessonNo: 5,
    name: 'Canva 첫 제작자',
    description: 'Canva AI 코드로 앱 제작을 시작했어요.',
  },
  {
    lessonNo: 6,
    name: '한 기능 개발자',
    description: '한 가지 기능을 가진 앱을 만들고 시험했어요.',
  },
  {
    lessonNo: 7,
    name: '앱 설계자',
    description: '앱에 필요한 기능과 사용 흐름을 설계했어요.',
  },
  {
    lessonNo: 8,
    name: '두 기능 개발자',
    description: '두 가지 기능을 연결한 앱을 만들었어요.',
  },
  {
    lessonNo: 9,
    name: '문제 해결 메이커',
    description: '나에게 필요한 앱으로 생활 속 문제를 해결했어요.',
  },
  {
    lessonNo: 10,
    name: '공유·개선 리더',
    description: '앱을 공유하고 의견을 반영해 개선했어요.',
  },
] as const;

// Course status comes from the saved completed flag. No weekly reset or
// separate award record is required; page visits and step changes earn nothing.
export function getStudentBadges(
  lessons: readonly { lessonNo: number; status: string }[],
) {
  const states = new Map(
    lessons.map((lesson) => [lesson.lessonNo, lesson.status]),
  );
  const badges = STUDENT_BADGES.map((badge) => ({
    ...badge,
    earned: states.get(badge.lessonNo) === 'done',
    started:
      states.get(badge.lessonNo) === 'current' ||
      states.get(badge.lessonNo) === 'done',
  }));
  const earnedCount = badges.filter((badge) => badge.earned).length;
  return {
    badges,
    earnedCount,
    allEarned: earnedCount === badges.length,
    nextBadge: badges.find((badge) => !badge.earned) ?? null,
  };
}
