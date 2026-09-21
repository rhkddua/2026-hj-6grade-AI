export const stages = ['안전하게 공유하기', '앱 소개 준비하기', '좋은 피드백 주고받기', '피드백으로 개선하기', '배움 확인하기'];

export const shareOptions = [
  '앱의 목표와 기능, 사용 방법만 소개해요.',
  '로그인 비밀번호도 함께 알려 줘요.',
  '친구의 실제 이름과 연락처를 예시로 보여 줘요.',
];

export const feedbackExamples = [
  { text: '두 번째 기능으로 가는 버튼이 잘 안 보여요. 버튼을 더 크게 하고 “다음”이라고 써 주세요.', good: true },
  { text: '그냥 별로예요.', good: false },
  { text: '첫 화면의 설명은 이해하기 쉬워요. 결과 화면에도 사용 방법을 한 줄 더 넣으면 좋겠어요.', good: true },
];

export const finalChecks = [
  '앱의 두 기능이 계획한 순서로 작동해요.',
  '버튼과 안내 문장을 처음 보는 사람도 이해할 수 있어요.',
  '개인정보를 입력하거나 공개하지 않아도 사용할 수 있어요.',
  '친구의 피드백을 확인하고 한 가지 이상 개선했어요.',
];

export const questions = [
  { title: '앱을 공유할 때 함께 보여 주면 좋은 내용은?', options: ['앱이 해결하는 문제와 사용 방법', '나의 비밀번호', '친구의 전화번호'], answer: 0, tip: '앱의 목적과 기능, 사용 방법은 보여 주되 개인정보는 빼야 해요.' },
  { title: '도움이 되는 피드백의 특징은?', options: ['좋았던 점이나 불편한 곳과 바라는 변화를 구체적으로 말해요.', '짧게 “별로야”라고만 말해요.', '사람을 평가하는 말을 해요.'], answer: 0, tip: '앱의 특정 부분과 개선 방법을 말하면 제작자가 바로 활용할 수 있어요.' },
  { title: '피드백을 받은 뒤 알맞은 행동은?', options: ['앱의 목표와 비교해 필요한 의견을 골라 테스트하고 고쳐요.', '모든 의견을 확인 없이 그대로 넣어요.', '아무 의견도 듣지 않아요.'], answer: 0, tip: '앱의 목표에 도움이 되는 의견인지 판단하고 수정 뒤 다시 시험해요.' },
];

export type LessonTenActivities = {
  shareChoice: number | null;
  shareChecked: boolean;
  appName: string;
  problemSummary: string;
  featureSummary: string;
  demoSteps: string;
  presentationChecked: boolean;
  feedbackChoices: Array<number | null>;
  feedbackChecked: boolean;
  chosenFeedback: string;
  improvementPlan: string;
  finalChoices: boolean[];
  improvementChecked: boolean;
  answers: Array<number | null>;
  quizChecked: boolean;
};

export function initialActivities(): LessonTenActivities {
  return {
    shareChoice: null,
    shareChecked: false,
    appName: '',
    problemSummary: '',
    featureSummary: '',
    demoSteps: '',
    presentationChecked: false,
    feedbackChoices: feedbackExamples.map(() => null),
    feedbackChecked: false,
    chosenFeedback: '',
    improvementPlan: '',
    finalChoices: finalChecks.map(() => false),
    improvementChecked: false,
    answers: questions.map(() => null),
    quizChecked: false,
  };
}

function safeText(value: unknown, max: number) {
  return typeof value === 'string' && value.length <= max ? value : '';
}

function choices(value: unknown, count: number, max: number) {
  return Array.from({ length: count }, (_, index) => Array.isArray(value) && Number.isInteger(value[index]) && (value[index] as number) >= 0 && (value[index] as number) <= max ? value[index] as number : null);
}

export function restoreActivities(value: unknown): LessonTenActivities {
  const base = initialActivities();
  if (!value || typeof value !== 'object') return base;
  const saved = value as Record<string, unknown>;
  const choice = (key: string, max: number) => Number.isInteger(saved[key]) && (saved[key] as number) >= 0 && (saved[key] as number) <= max ? saved[key] as number : null;
  return {
    ...base,
    shareChoice: choice('shareChoice', shareOptions.length - 1),
    shareChecked: saved.shareChecked === true,
    appName: safeText(saved.appName, 80),
    problemSummary: safeText(saved.problemSummary, 600),
    featureSummary: safeText(saved.featureSummary, 800),
    demoSteps: safeText(saved.demoSteps, 800),
    presentationChecked: saved.presentationChecked === true,
    feedbackChoices: choices(saved.feedbackChoices, feedbackExamples.length, 1),
    feedbackChecked: saved.feedbackChecked === true,
    chosenFeedback: safeText(saved.chosenFeedback, 800),
    improvementPlan: safeText(saved.improvementPlan, 1000),
    finalChoices: finalChecks.map((_, index) => Array.isArray(saved.finalChoices) && saved.finalChoices[index] === true),
    improvementChecked: saved.improvementChecked === true,
    answers: choices(saved.answers, questions.length, 2),
    quizChecked: saved.quizChecked === true,
  };
}

export function textIsSafe(text: string) {
  return !/(비밀번호|전화번호|집 주소|이메일 주소|주민등록|실제 이름)/.test(text) && !/\d{3}[- ]?\d{3,4}[- ]?\d{4}/.test(text);
}

export function presentationIsReady(a: LessonTenActivities) {
  return a.appName.trim().length >= 2 && a.problemSummary.trim().length >= 15 && a.featureSummary.trim().length >= 20 && a.demoSteps.trim().length >= 20 && textIsSafe(`${a.appName} ${a.problemSummary} ${a.featureSummary} ${a.demoSteps}`);
}

export function lessonTenRequirements(a: LessonTenActivities, reflection: string) {
  return [
    a.shareChecked && a.shareChoice === 0,
    a.presentationChecked && presentationIsReady(a),
    a.feedbackChecked && feedbackExamples.every((example, index) => a.feedbackChoices[index] === (example.good ? 1 : 0)),
    a.improvementChecked && a.chosenFeedback.trim().length >= 15 && a.improvementPlan.trim().length >= 20 && a.finalChoices.every(Boolean),
    a.quizChecked && questions.every((question, index) => a.answers[index] === question.answer),
    reflection.trim().length >= 10,
  ];
}
