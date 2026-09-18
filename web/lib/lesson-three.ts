export const stages = ['생각 열기', 'AI가 잘하는 일', 'AI가 어려워하는 일', '사람의 확인과 안전', '배움 확인하기'];

export const strengthItems = [
  { text: '많은 예시를 보고 비슷한 동물 사진끼리 나누기', answer: 0, tip: 'AI는 많은 예시에서 반복되는 특징을 찾아 분류하는 데 도움을 줄 수 있어요.' },
  { text: '긴 글에서 중요한 내용을 짧게 정리하기', answer: 0, tip: 'AI는 긴 자료의 핵심 내용을 요약하는 데 도움을 줄 수 있어요.' },
  { text: '여러 가지 놀이 규칙 아이디어를 빠르게 제안하기', answer: 0, tip: 'AI는 새로운 아이디어를 여러 개 떠올리는 데 도움을 줄 수 있어요.' },
];

export const limitationItems = [
  { text: '내일 학교 급식처럼 최신 정보가 맞는지 확인하기', answer: 1, tip: '최신 정보는 바뀔 수 있으므로 학교 안내나 공식 자료를 직접 확인해야 해요.' },
  { text: '친구가 왜 속상한지 표정과 상황까지 정확히 알아맞히기', answer: 1, tip: '감정과 상황의 맥락은 사람의 대화와 관찰이 더 필요해요.' },
  { text: '“재미있는 것을 만들어 줘”처럼 기준이 모호한 부탁의 뜻 정하기', answer: 1, tip: '무엇이 재미있는지는 사람마다 달라서 목표와 조건을 더 분명히 말해야 해요.' },
  { text: '근거가 없어도 그럴듯하게 말하는 답을 스스로 사실로 바꾸기', answer: 1, tip: 'AI가 자신 있게 말해도 틀릴 수 있어요. 근거와 출처를 확인해야 해요.' },
];

export const safetyItems = [
  { text: 'AI가 알려 준 유명인의 생일을 학교 공식 홈페이지에서 다시 확인하기', answer: 0, tip: '중요한 사실은 믿을 만한 공식 자료와 비교해 확인해요.' },
  { text: '친구의 이름과 전화번호를 넣고 AI에게 편지 써 달라고 하기', answer: 1, tip: '이름, 전화번호, 주소, 비밀번호 같은 개인정보는 AI에 입력하지 않아요.' },
  { text: 'AI 답에 출처가 없으면 관련 기관이나 도서관 자료를 찾아보기', answer: 0, tip: '출처를 찾아 내용을 비교하면 틀린 정보를 걸러낼 수 있어요.' },
];

export const questions = [
  { title: 'AI를 사용할 때 가장 알맞은 태도는 무엇인가요?', options: ['AI의 답을 그대로 믿어요.', '도움을 받고 결과와 출처를 사람이 확인해요.', '개인정보를 많이 넣을수록 더 좋아요.'], answer: 1, tip: 'AI는 도움을 주지만 결과 확인과 판단은 사람이 해야 해요.' },
  { title: 'AI가 어려워할 수 있는 일은 무엇인가요?', options: ['많은 예시를 기준에 따라 분류하기', '긴 글의 내용을 짧게 요약하기', '최신 사실과 사람의 복잡한 마음을 정확히 판단하기'], answer: 2, tip: '최신 정보와 감정·맥락은 직접 확인하고 사람과 대화해야 해요.' },
  { title: 'AI에 입력하지 않아야 하는 것은 무엇인가요?', options: ['내가 만든 이야기의 제목', '친구의 전화번호와 주소', '공부할 주제에 대한 일반적인 질문'], answer: 1, tip: '다른 사람의 개인정보도 소중히 지켜야 해요.' },
];

export type LessonThreeActivities = {
  opening: number | null;
  strengthChoices: Array<number | null>;
  strengthChecked: boolean;
  limitationChoices: Array<number | null>;
  limitationChecked: boolean;
  verificationChoices: Array<number | null>;
  verificationChecked: boolean;
  answers: Array<number | null>;
  quizChecked: boolean;
};

export function initialActivities(): LessonThreeActivities {
  return { opening: null, strengthChoices: strengthItems.map(() => null), strengthChecked: false, limitationChoices: limitationItems.map(() => null), limitationChecked: false, verificationChoices: safetyItems.map(() => null), verificationChecked: false, answers: questions.map(() => null), quizChecked: false };
}

function restoreChoices(value: unknown, count: number, max: number) {
  return Array.from({ length: count }, (_, i) => Array.isArray(value) && Number.isInteger(value[i]) && (value[i] as number) >= 0 && (value[i] as number) <= max ? value[i] as number : null);
}

export function restoreActivities(value: unknown): LessonThreeActivities {
  const base = initialActivities();
  if (!value || typeof value !== 'object') return base;
  const v = value as Record<string, unknown>;
  return { ...base, opening: Number.isInteger(v.opening) && (v.opening as number) >= 0 && (v.opening as number) <= 2 ? v.opening as number : null, strengthChoices: restoreChoices(v.strengthChoices, strengthItems.length, 1), strengthChecked: v.strengthChecked === true, limitationChoices: restoreChoices(v.limitationChoices, limitationItems.length, 1), limitationChecked: v.limitationChecked === true, verificationChoices: restoreChoices(v.verificationChoices, safetyItems.length, 1), verificationChecked: v.verificationChecked === true, answers: restoreChoices(v.answers, questions.length, 2), quizChecked: v.quizChecked === true };
}

export function lessonThreeRequirements(a: LessonThreeActivities, reflection: string) {
  return [a.strengthChecked && strengthItems.every((x, i) => a.strengthChoices[i] === x.answer), a.limitationChecked && limitationItems.every((x, i) => a.limitationChoices[i] === x.answer), a.verificationChecked && safetyItems.every((x, i) => a.verificationChoices[i] === x.answer), a.quizChecked && questions.every((x, i) => a.answers[i] === x.answer), reflection.trim().length >= 10];
}
