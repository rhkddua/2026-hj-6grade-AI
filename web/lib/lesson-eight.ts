export const stages = [
  '두 기능 알아보기',
  '기능 연결 설계하기',
  '제작 지시 쓰기',
  '여러 상황으로 테스트하기',
  '배움 확인하기',
];

export const connectionOptions = {
  firstFeatures: ['쉬는 시간을 선택하게 하기', '친구의 전화번호를 입력하게 하기', '아무 입력도 받지 않기'],
  sharedValues: ['선택한 쉬는 시간', '학생의 실제 이름과 주소', '비밀번호'],
  secondFeatures: ['시간에 맞는 활동과 준비물을 추천하기', '개인정보를 화면에 공개하기', '입력과 상관없이 같은 광고 보여 주기'],
};

export const testCases = [
  { label: '5분을 선택했을 때 짧은 스트레칭이 나타나요.' },
  { label: '15분을 선택했을 때 준비물이 필요한 긴 활동이 나타나요.' },
  { label: '아무것도 선택하지 않고 추천을 누르면 선택 안내가 나타나요.' },
];

export const questions = [
  {
    title: '두 기능을 연결할 때 가장 먼저 확인할 것은?',
    options: ['첫 기능의 결과가 다음 기능에 어떻게 쓰이는지', '기능의 개수만 많은지', '개인정보를 받을 수 있는지'],
    answer: 0,
    tip: '앞 기능의 결과가 뒤 기능의 입력이 되면 두 기능이 자연스럽게 이어져요.',
  },
  {
    title: '두 기능 앱을 테스트하는 좋은 방법은?',
    options: ['여러 입력과 아무것도 입력하지 않은 경우를 시험해요.', '한 번 보이면 바로 제출해요.', '친구의 비밀번호를 입력해요.'],
    answer: 0,
    tip: '정상적인 입력뿐 아니라 입력이 없을 때도 안전하게 안내하는지 확인해요.',
  },
  {
    title: '테스트에서 문제를 찾았을 때 알맞은 수정 지시는?',
    options: ['문제가 생긴 상황과 원하는 결과를 구체적으로 말해요.', '그냥 더 멋지게 해 달라고 해요.', '확인하지 않고 기능을 더 추가해요.'],
    answer: 0,
    tip: '어떤 상황에서 무엇이 잘못됐고 어떻게 바뀌어야 하는지 알려 줘요.',
  },
];

export type LessonEightActivities = {
  conceptChoice: number | null;
  conceptChecked: boolean;
  firstFeature: number | null;
  sharedValue: number | null;
  secondFeature: number | null;
  connectionChecked: boolean;
  buildPrompt: string;
  promptChecked: boolean;
  testChoices: boolean[];
  testChecked: boolean;
  revisionPrompt: string;
  answers: Array<number | null>;
  quizChecked: boolean;
};

export function initialActivities(): LessonEightActivities {
  return {
    conceptChoice: null,
    conceptChecked: false,
    firstFeature: null,
    sharedValue: null,
    secondFeature: null,
    connectionChecked: false,
    buildPrompt: '',
    promptChecked: false,
    testChoices: testCases.map(() => false),
    testChecked: false,
    revisionPrompt: '',
    answers: questions.map(() => null),
    quizChecked: false,
  };
}

function restoreChoices(value: unknown, count: number, max: number) {
  return Array.from({ length: count }, (_, index) =>
    Array.isArray(value) && Number.isInteger(value[index]) && (value[index] as number) >= 0 && (value[index] as number) <= max
      ? value[index] as number
      : null,
  );
}

export function restoreActivities(value: unknown): LessonEightActivities {
  const base = initialActivities();
  if (!value || typeof value !== 'object') return base;
  const saved = value as Record<string, unknown>;
  const choice = (key: string, max: number) =>
    Number.isInteger(saved[key]) && (saved[key] as number) >= 0 && (saved[key] as number) <= max
      ? saved[key] as number
      : null;

  return {
    ...base,
    conceptChoice: choice('conceptChoice', 2),
    conceptChecked: saved.conceptChecked === true,
    firstFeature: choice('firstFeature', 2),
    sharedValue: choice('sharedValue', 2),
    secondFeature: choice('secondFeature', 2),
    connectionChecked: saved.connectionChecked === true,
    buildPrompt: typeof saved.buildPrompt === 'string' && saved.buildPrompt.length <= 1200 ? saved.buildPrompt : '',
    promptChecked: saved.promptChecked === true,
    testChoices: testCases.map((_, index) => Array.isArray(saved.testChoices) && saved.testChoices[index] === true),
    testChecked: saved.testChecked === true,
    revisionPrompt: typeof saved.revisionPrompt === 'string' && saved.revisionPrompt.length <= 1000 ? saved.revisionPrompt : '',
    answers: restoreChoices(saved.answers, questions.length, 2),
    quizChecked: saved.quizChecked === true,
  };
}

export function promptIsSafe(prompt: string) {
  const text = prompt.trim();
  return text.length >= 45
    && !/(비밀번호|전화번호|집 주소|이메일 주소|주민등록|실제 이름)/.test(text)
    && !/\d{3}[- ]?\d{3,4}[- ]?\d{4}/.test(text);
}

export function lessonEightRequirements(activities: LessonEightActivities, reflection: string) {
  return [
    activities.conceptChecked && activities.conceptChoice === 0,
    activities.connectionChecked
      && activities.firstFeature === 0
      && activities.sharedValue === 0
      && activities.secondFeature === 0,
    activities.promptChecked && promptIsSafe(activities.buildPrompt),
    activities.testChecked
      && activities.testChoices.every(Boolean)
      && activities.revisionPrompt.trim().length >= 15,
    activities.quizChecked && questions.every((question, index) => activities.answers[index] === question.answer),
    reflection.trim().length >= 10,
  ];
}
