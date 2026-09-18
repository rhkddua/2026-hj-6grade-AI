export const stages = ['생각 열기', '네 가지 단서', '구체적으로 바꾸기', '다시 요청하기', '배움 확인하기'];

export const clueItems = [
  { text: '무엇을 이루고 싶은지 말해요.', answer: 0, label: '목표' },
  { text: '누가, 어떤 상황에서 사용할지 알려 줘요.', answer: 1, label: '상황' },
  { text: '지켜야 할 범위나 하지 말아야 할 것을 말해요.', answer: 2, label: '조건' },
  { text: '표, 목록, 짧은 글처럼 어떤 모양으로 받을지 말해요.', answer: 3, label: '결과 형식' },
];

export const detailOptions = [
  '6학년 친구가 읽기 쉽게',
  '우리 동네의 안전한 장소만',
  '이유를 한 줄씩 덧붙여서',
];

export const revisionItems = [
  { text: '설명이 너무 어려워요.', answer: 0, options: ['초등학교 6학년이 이해할 말로 다시 설명해 줘.', '더 길게 써 줘.'] },
  { text: '장소가 너무 많아 고르기 힘들어요.', answer: 1, options: ['장소를 10개 더 추가해 줘.', '가장 중요한 3곳만 골라 표로 정리해 줘.'] },
  { text: '무엇을 먼저 해야 할지 모르겠어요.', answer: 0, options: ['순서를 정해 번호 목록으로 바꿔 줘.', '제목을 멋지게 바꿔 줘.'] },
];

export const questions = [
  { title: '좋은 지시에 도움이 되는 네 가지 단서는 무엇인가요?', options: ['목표·상황·조건·결과 형식', '이름·전화번호·주소·비밀번호', '길게 쓰기·빨리 쓰기·복사하기'], answer: 0, tip: '무엇을, 어떤 상황에서, 어떤 조건으로, 어떤 모양으로 받을지 알려 주면 더 이해하기 쉬워요.' },
  { title: 'AI의 첫 결과가 부족할 때 가장 알맞은 행동은?', options: ['그 결과를 그대로 제출해요.', '부족한 점을 구체적으로 말하고 다시 요청해요.', '개인정보를 더 많이 넣어요.'], answer: 1, tip: '결과를 사람이 확인하고 부족한 점을 구체적으로 알려 주며 고쳐 가요.' },
  { title: '지시에 넣어도 안전한 내용은 무엇인가요?', options: ['친구의 전화번호', '우리 집 주소와 비밀번호', '읽을 대상과 원하는 결과 형식'], answer: 2, tip: '개인정보 대신 학습 목적과 원하는 결과 형식처럼 일반적인 조건을 말해요.' },
];

export type LessonFourActivities = {
  opening: number | null;
  clueChoices: Array<number | null>;
  cluesChecked: boolean;
  detailChoices: boolean[];
  detailResultChecked: boolean;
  revisionChoices: Array<number | null>;
  revisionsChecked: boolean;
  answers: Array<number | null>;
  quizChecked: boolean;
  ownPrompt: string;
};

export function initialActivities(): LessonFourActivities {
  return { opening: null, clueChoices: clueItems.map(() => null), cluesChecked: false, detailChoices: detailOptions.map(() => false), detailResultChecked: false, revisionChoices: revisionItems.map(() => null), revisionsChecked: false, answers: questions.map(() => null), quizChecked: false, ownPrompt: '' };
}

function restoreChoices(value: unknown, count: number, max: number) {
  return Array.from({ length: count }, (_, i) => Array.isArray(value) && Number.isInteger(value[i]) && (value[i] as number) >= 0 && (value[i] as number) <= max ? value[i] as number : null);
}

export function restoreActivities(value: unknown): LessonFourActivities {
  const base = initialActivities();
  if (!value || typeof value !== 'object') return base;
  const v = value as Record<string, unknown>;
  const details = Array.from({ length: detailOptions.length }, (_, i) => Array.isArray(v.detailChoices) && v.detailChoices[i] === true);
  return { ...base, opening: Number.isInteger(v.opening) && (v.opening as number) >= 0 && (v.opening as number) <= 1 ? v.opening as number : null, clueChoices: restoreChoices(v.clueChoices, clueItems.length, 3), cluesChecked: v.cluesChecked === true, detailChoices: details, detailResultChecked: v.detailResultChecked === true, revisionChoices: restoreChoices(v.revisionChoices, revisionItems.length, 1), revisionsChecked: v.revisionsChecked === true, answers: restoreChoices(v.answers, questions.length, 2), quizChecked: v.quizChecked === true, ownPrompt: typeof v.ownPrompt === 'string' && v.ownPrompt.length <= 1000 ? v.ownPrompt : '' };
}

export function lessonFourRequirements(a: LessonFourActivities, reflection: string) {
  return [a.cluesChecked && clueItems.every((x, i) => a.clueChoices[i] === x.answer), a.detailResultChecked && a.detailChoices.filter(Boolean).length >= 2, a.revisionsChecked && revisionItems.every((x, i) => a.revisionChoices[i] === x.answer), a.quizChecked && questions.every((x, i) => a.answers[i] === x.answer), a.ownPrompt.trim().length >= 20, reflection.trim().length >= 10];
}
