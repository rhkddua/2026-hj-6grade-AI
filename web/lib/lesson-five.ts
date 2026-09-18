export const stages = ['Canva AI 코드 알아보기', '앱 제작 계획 세우기', '안전한 제작 지시 쓰기', '결과 테스트하고 고치기', '배움 확인하기'];

export const planOptions = {
  users: ['우리 반 친구', '학교에 오는 어린이', '가족과 함께 쓰는 사람'],
  problems: ['쉬는 시간에 할 놀이를 고르기 어려워요.', '학교 행사 준비물을 빠뜨리기 쉬워요.', '책을 고르고 읽은 내용을 정리하기 어려워요.'],
  features: ['선택하면 한 가지를 추천해 주는 버튼', '준비물을 체크하는 목록', '짧은 내용을 저장하는 기록 칸'],
};

export const testChecks = [
  '버튼을 눌러 준비된 화면이 바뀌는지 확인했어요.',
  '글자가 너무 작거나 어려운 말이 없는지 확인했어요.',
  '개인정보를 입력하라고 하지 않는지 확인했어요.',
];

export const questions = [
  { title: 'Canva AI 코드로 앱을 만들 때 가장 알맞은 시작은?', options: ['무엇을 만들지와 누가 쓸지 먼저 정해요.', '친구의 개인정보를 많이 넣어요.', '결과를 보지 않고 바로 제출해요.'], answer: 0, tip: '사용자와 해결할 문제를 먼저 정하면 필요한 기능을 고르기 쉬워요.' },
  { title: '안전한 제작 지시에 넣으면 좋은 내용은?', options: ['친구의 주소와 전화번호', '목표, 사용할 사람, 필요한 기능과 화면 모양', '비밀번호와 실제 계정 정보'], answer: 1, tip: '앱의 목적과 기능은 구체적으로 말하고 개인정보는 넣지 않아요.' },
  { title: '준비된 결과를 테스트한 뒤 알맞은 행동은?', options: ['불편한 점을 구체적으로 적어 고쳐 달라고 해요.', '확인하지 않고 끝내요.', '더 많은 개인정보를 넣어요.'], answer: 0, tip: '사람이 직접 써 보고, 고칠 점을 구체적으로 알려 주며 개선해요.' },
];

export type LessonFiveActivities = {
  introChoice: number | null;
  introChecked: boolean;
  userChoice: number | null;
  problemChoice: number | null;
  featureChoice: number | null;
  planChecked: boolean;
  ownPrompt: string;
  promptChecked: boolean;
  resultChoice: number | null;
  testChoices: boolean[];
  testChecked: boolean;
  revisionPrompt: string;
  answers: Array<number | null>;
  quizChecked: boolean;
};

export function initialActivities(): LessonFiveActivities {
  return { introChoice: null, introChecked: false, userChoice: null, problemChoice: null, featureChoice: null, planChecked: false, ownPrompt: '', promptChecked: false, resultChoice: null, testChoices: testChecks.map(() => false), testChecked: false, revisionPrompt: '', answers: questions.map(() => null), quizChecked: false };
}

function restoreChoices(value: unknown, count: number, max: number) {
  return Array.from({ length: count }, (_, i) => Array.isArray(value) && Number.isInteger(value[i]) && (value[i] as number) >= 0 && (value[i] as number) <= max ? value[i] as number : null);
}

export function restoreActivities(value: unknown): LessonFiveActivities {
  const base = initialActivities();
  if (!value || typeof value !== 'object') return base;
  const v = value as Record<string, unknown>;
  const choice = (key: string, max: number) => Number.isInteger(v[key]) && (v[key] as number) >= 0 && (v[key] as number) <= max ? v[key] as number : null;
  return {
    ...base,
    introChoice: choice('introChoice', 2), introChecked: v.introChecked === true,
    userChoice: choice('userChoice', planOptions.users.length - 1), problemChoice: choice('problemChoice', planOptions.problems.length - 1), featureChoice: choice('featureChoice', planOptions.features.length - 1), planChecked: v.planChecked === true,
    ownPrompt: typeof v.ownPrompt === 'string' && v.ownPrompt.length <= 1000 ? v.ownPrompt : '', promptChecked: v.promptChecked === true,
    resultChoice: choice('resultChoice', 1), testChoices: testChecks.map((_, i) => Array.isArray(v.testChoices) && v.testChoices[i] === true), testChecked: v.testChecked === true,
    revisionPrompt: typeof v.revisionPrompt === 'string' && v.revisionPrompt.length <= 1000 ? v.revisionPrompt : '', answers: restoreChoices(v.answers, questions.length, 2), quizChecked: v.quizChecked === true,
  };
}

export function promptIsSafe(prompt: string) {
  const text = prompt.trim();
  return text.length >= 30 && !/(비밀번호|전화번호|집 주소|이메일 주소|주민등록)/.test(text) && !/\d{3}[- ]?\d{3,4}[- ]?\d{4}/.test(text);
}

export function lessonFiveRequirements(a: LessonFiveActivities, reflection: string) {
  return [
    a.introChecked && a.introChoice === 1,
    a.planChecked && a.userChoice !== null && a.problemChoice !== null && a.featureChoice !== null,
    a.promptChecked && promptIsSafe(a.ownPrompt),
    a.testChecked && a.resultChoice === 1 && a.testChoices.every(Boolean) && a.revisionPrompt.trim().length >= 15,
    a.quizChecked && questions.every((q, i) => a.answers[i] === q.answer),
    reflection.trim().length >= 10,
  ];
}
