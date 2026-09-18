export const stages = ['한 기능 앱 이해하기', '입력·동작·결과 정하기', '한 기능 제작 지시 쓰기', '준비된 앱 테스트하기', '배움 확인하기'];

export const flowOptions = {
  inputs: ['버튼 하나를 누르기', '친구의 실제 이름을 입력하기', '비밀번호를 입력하기'],
  actions: ['고른 놀이에 맞는 준비물을 보여 주기', '친구의 개인정보를 모으기', '알 수 없는 사람에게 메시지 보내기'],
  outputs: ['큰 글씨 카드와 짧은 안내로 보여 주기', '광고를 여러 개 보여 주기', '개인정보를 공개하기'],
};

export const testChecks = [
  '추천 버튼을 눌렀을 때 놀이와 준비물이 함께 바뀌는지 확인했어요.',
  '처음 보는 사람도 버튼의 뜻과 결과를 이해할 수 있는지 확인했어요.',
  '이름, 연락처, 주소, 비밀번호를 묻지 않는지 확인했어요.',
];

export const questions = [
  { title: '한 기능 앱을 처음 만들 때 가장 좋은 방법은?', options: ['가장 중요한 한 가지 동작을 먼저 만들어요.', '기능을 열 개 넣고 시작해요.', '친구 개인정보부터 입력하게 해요.'], answer: 0, tip: '한 가지 기능부터 만들면 무엇이 잘 되는지 쉽게 테스트할 수 있어요.' },
  { title: '입력·동작·결과의 순서로 알맞은 것은?', options: ['결과를 본 뒤 버튼을 눌러요.', '버튼을 누르면 앱이 정한 일을 하고 결과를 보여 줘요.', '개인정보를 입력하면 광고를 보여 줘요.'], answer: 1, tip: '사용자가 한 행동이 입력이고, 앱의 처리 뒤에 결과가 보여요.' },
  { title: '앱을 테스트한 뒤 알맞은 수정 지시는?', options: ['더 많은 개인정보를 물어봐 줘.', '글자를 크게 하고 준비물을 목록으로 보여 줘.', '확인하지 말고 바로 끝내 줘.'], answer: 1, tip: '고칠 부분과 원하는 모습을 구체적으로 알려 주면 다음 결과를 확인하기 좋아요.' },
];

export type LessonSixActivities = {
  conceptChoice: number | null;
  conceptChecked: boolean;
  inputChoice: number | null;
  actionChoice: number | null;
  outputChoice: number | null;
  flowChecked: boolean;
  ownPrompt: string;
  promptChecked: boolean;
  resultChoice: number | null;
  testChoices: boolean[];
  testChecked: boolean;
  revisionPrompt: string;
  answers: Array<number | null>;
  quizChecked: boolean;
};

export function initialActivities(): LessonSixActivities {
  return { conceptChoice: null, conceptChecked: false, inputChoice: null, actionChoice: null, outputChoice: null, flowChecked: false, ownPrompt: '', promptChecked: false, resultChoice: null, testChoices: testChecks.map(() => false), testChecked: false, revisionPrompt: '', answers: questions.map(() => null), quizChecked: false };
}

function restoreChoices(value: unknown, count: number, max: number) {
  return Array.from({ length: count }, (_, i) => Array.isArray(value) && Number.isInteger(value[i]) && (value[i] as number) >= 0 && (value[i] as number) <= max ? value[i] as number : null);
}

export function restoreActivities(value: unknown): LessonSixActivities {
  const base = initialActivities();
  if (!value || typeof value !== 'object') return base;
  const v = value as Record<string, unknown>;
  const choice = (key: string, max: number) => Number.isInteger(v[key]) && (v[key] as number) >= 0 && (v[key] as number) <= max ? v[key] as number : null;
  return {
    ...base,
    conceptChoice: choice('conceptChoice', 2), conceptChecked: v.conceptChecked === true,
    inputChoice: choice('inputChoice', flowOptions.inputs.length - 1), actionChoice: choice('actionChoice', flowOptions.actions.length - 1), outputChoice: choice('outputChoice', flowOptions.outputs.length - 1), flowChecked: v.flowChecked === true,
    ownPrompt: typeof v.ownPrompt === 'string' && v.ownPrompt.length <= 1000 ? v.ownPrompt : '', promptChecked: v.promptChecked === true,
    resultChoice: choice('resultChoice', 1), testChoices: testChecks.map((_, i) => Array.isArray(v.testChoices) && v.testChoices[i] === true), testChecked: v.testChecked === true,
    revisionPrompt: typeof v.revisionPrompt === 'string' && v.revisionPrompt.length <= 1000 ? v.revisionPrompt : '', answers: restoreChoices(v.answers, questions.length, 2), quizChecked: v.quizChecked === true,
  };
}

export function promptIsSafe(prompt: string) {
  const text = prompt.trim();
  return text.length >= 35 && !/(비밀번호|전화번호|집 주소|이메일 주소|주민등록|실제 이름)/.test(text) && !/\d{3}[- ]?\d{3,4}[- ]?\d{4}/.test(text);
}

export function lessonSixRequirements(a: LessonSixActivities, reflection: string) {
  return [
    a.conceptChecked && a.conceptChoice === 0,
    a.flowChecked && a.inputChoice === 0 && a.actionChoice === 0 && a.outputChoice === 0,
    a.promptChecked && promptIsSafe(a.ownPrompt),
    a.testChecked && a.resultChoice === 1 && a.testChoices.every(Boolean) && a.revisionPrompt.trim().length >= 15,
    a.quizChecked && questions.every((q, i) => a.answers[i] === q.answer),
    reflection.trim().length >= 10,
  ];
}
