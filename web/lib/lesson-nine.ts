export const stages = [
  '생활 속 문제 찾기',
  '나의 앱 계획하기',
  '제작 지시 완성하기',
  '사용자처럼 테스트하기',
  '배움 확인하기',
];

export const needOptions = [
  '준비물이나 할 일을 자주 잊어서 정리하고 싶어요.',
  '짧은 쉬는 시간에 할 활동을 쉽게 고르고 싶어요.',
  '읽은 책이나 배운 내용을 간단히 기록하고 싶어요.',
];

export const userOptions = ['나처럼 같은 불편을 겪는 학생', '전화번호를 알려 주는 사람만', '비밀번호를 입력한 친구만'];

export const testChecklist = [
  '처음 보는 사람도 앱의 목적과 사용 방법을 이해할 수 있어요.',
  '두 기능을 차례대로 사용했을 때 원하는 결과가 나타나요.',
  '이름·연락처·주소·비밀번호 없이 사용할 수 있어요.',
];

export const questions = [
  {
    title: '나에게 필요한 앱의 주제를 고르는 좋은 방법은?',
    options: ['생활에서 반복되는 작은 불편을 찾아요.', '개인정보를 많이 모을 주제를 골라요.', '기능을 가장 많이 넣을 주제를 골라요.'],
    answer: 0,
    tip: '자주 겪는 작은 문제를 분명하게 정하면 필요한 기능도 찾기 쉬워요.',
  },
  {
    title: '앱의 두 기능을 정할 때 확인할 것은?',
    options: ['두 기능이 같은 문제를 해결하며 자연스럽게 이어지는지', '두 기능의 색이 같은지', '사용자의 실제 이름을 받는지'],
    answer: 0,
    tip: '각 기능이 앱의 목표에 필요하고 서로 이어져야 해요.',
  },
  {
    title: '준비된 결과를 본 뒤 해야 할 일은?',
    options: ['사용자처럼 직접 시험하고 구체적으로 수정해요.', '화면이 보이면 바로 완성했다고 해요.', '문제가 있어도 기능만 더 추가해요.'],
    answer: 0,
    tip: '처음 세운 목표와 테스트 결과를 비교해 고칠 점을 알려 줘요.',
  },
];

export type LessonNineActivities = {
  needChoice: number | null;
  needChecked: boolean;
  targetUser: number | null;
  problem: string;
  featureOne: string;
  featureTwo: string;
  planChecked: boolean;
  appName: string;
  buildPrompt: string;
  promptChecked: boolean;
  testChoices: boolean[];
  testChecked: boolean;
  feedbackChoice: number | null;
  revisionPrompt: string;
  answers: Array<number | null>;
  quizChecked: boolean;
};

export function initialActivities(): LessonNineActivities {
  return {
    needChoice: null,
    needChecked: false,
    targetUser: null,
    problem: '',
    featureOne: '',
    featureTwo: '',
    planChecked: false,
    appName: '',
    buildPrompt: '',
    promptChecked: false,
    testChoices: testChecklist.map(() => false),
    testChecked: false,
    feedbackChoice: null,
    revisionPrompt: '',
    answers: questions.map(() => null),
    quizChecked: false,
  };
}

function safeText(value: unknown, max: number) {
  return typeof value === 'string' && value.length <= max ? value : '';
}

function restoreChoices(value: unknown, count: number, max: number) {
  return Array.from({ length: count }, (_, index) =>
    Array.isArray(value) && Number.isInteger(value[index]) && (value[index] as number) >= 0 && (value[index] as number) <= max
      ? value[index] as number
      : null,
  );
}

export function restoreActivities(value: unknown): LessonNineActivities {
  const base = initialActivities();
  if (!value || typeof value !== 'object') return base;
  const saved = value as Record<string, unknown>;
  const choice = (key: string, max: number) =>
    Number.isInteger(saved[key]) && (saved[key] as number) >= 0 && (saved[key] as number) <= max
      ? saved[key] as number
      : null;

  return {
    ...base,
    needChoice: choice('needChoice', needOptions.length - 1),
    needChecked: saved.needChecked === true,
    targetUser: choice('targetUser', userOptions.length - 1),
    problem: safeText(saved.problem, 500),
    featureOne: safeText(saved.featureOne, 500),
    featureTwo: safeText(saved.featureTwo, 500),
    planChecked: saved.planChecked === true,
    appName: safeText(saved.appName, 80),
    buildPrompt: safeText(saved.buildPrompt, 1500),
    promptChecked: saved.promptChecked === true,
    testChoices: testChecklist.map((_, index) => Array.isArray(saved.testChoices) && saved.testChoices[index] === true),
    testChecked: saved.testChecked === true,
    feedbackChoice: choice('feedbackChoice', 1),
    revisionPrompt: safeText(saved.revisionPrompt, 1000),
    answers: restoreChoices(saved.answers, questions.length, 2),
    quizChecked: saved.quizChecked === true,
  };
}

export function textIsSafe(text: string) {
  return !/(비밀번호|전화번호|집 주소|이메일 주소|주민등록|실제 이름)/.test(text)
    && !/\d{3}[- ]?\d{3,4}[- ]?\d{4}/.test(text);
}

export function planIsReady(activities: LessonNineActivities) {
  return activities.targetUser === 0
    && activities.problem.trim().length >= 15
    && activities.featureOne.trim().length >= 10
    && activities.featureTwo.trim().length >= 10
    && textIsSafe(`${activities.problem} ${activities.featureOne} ${activities.featureTwo}`);
}

export function promptIsReady(activities: LessonNineActivities) {
  return activities.appName.trim().length >= 2
    && activities.buildPrompt.trim().length >= 60
    && textIsSafe(`${activities.appName} ${activities.buildPrompt}`);
}

export function lessonNineRequirements(activities: LessonNineActivities, reflection: string) {
  return [
    activities.needChecked && activities.needChoice !== null,
    activities.planChecked && planIsReady(activities),
    activities.promptChecked && promptIsReady(activities),
    activities.testChecked
      && activities.testChoices.every(Boolean)
      && activities.feedbackChoice === 1
      && activities.revisionPrompt.trim().length >= 15,
    activities.quizChecked && questions.every((question, index) => activities.answers[index] === question.answer),
    reflection.trim().length >= 10,
  ];
}
