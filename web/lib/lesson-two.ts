export const methods = ['텍스트 코딩', '블록 코딩', 'AI 코딩'] as const;
export const stages = ['생각 열기', '세 가지 방법 체험', '특징 분류하기', '나의 비교표', '배움 확인하기'];
export const cards = [
  { text: 'print("안녕!")처럼 문법에 맞춰 명령을 입력해요.', answer: 0, tip: '텍스트 코딩은 프로그래밍 언어의 문법으로 명령을 적어요.' },
  { text: '「3번 반복하기」 안에 「안녕! 말하기」 블록을 끼워요.', answer: 1, tip: '블록 코딩은 명령 블록을 연결해 순서와 반복을 표현해요.' },
  { text: '“안녕!을 세 번 보여 주는 프로그램을 만들어 줘”라고 요청해요.', answer: 2, tip: 'AI 코딩은 자연어로 요청해 코드 작성을 도움받아요.' },
  { text: '반복 횟수를 바꾸려면 코드의 숫자를 직접 고쳐요.', answer: 0, tip: '이 사례에서는 사람이 코드에 적힌 숫자를 직접 수정해요.' },
  { text: '명령 블록을 옮겨 프로그램의 실행 순서를 바꿔요.', answer: 1, tip: '블록의 연결 순서도 프로그램의 동작을 결정해요.' },
  { text: '실행 결과를 보고 AI에게 “두 번이 아니라 세 번으로 고쳐 줘”라고 요청해요.', answer: 2, tip: 'AI에게 수정을 요청한 뒤에도 결과를 다시 확인해야 해요.' },
];
export const questions = [
  { title: '세 가지 방법에 모두 필요한 것은?', options: ['목표를 정하고 실행 결과를 확인하기', '영어 코드를 직접 입력하기', 'AI에게 모든 판단을 맡기기'], answer: 0, tip: '어떤 방법이든 사람이 목표를 정하고 결과가 맞는지 확인해야 해요.' },
  { title: '블록 코딩에 대한 설명으로 알맞은 것은?', options: ['블록 모양만 꾸미는 활동이에요.', '명령 블록을 연결해 순서와 반복을 표현해요.', '컴퓨터가 알아서 목표를 정해요.'], answer: 1, tip: '블록 코딩도 컴퓨터가 할 일을 순서와 규칙으로 만드는 코딩이에요.' },
  { title: 'AI가 만든 프로그램이 원하는 대로 작동하지 않으면?', options: ['AI가 만들었으니 맞다고 생각해요.', '확인하지 않고 친구에게 나눠 줘요.', '기대한 결과와 실제 결과를 설명해 수정을 요청하고 다시 실행해요.'], answer: 2, tip: '기대한 결과와 실제 결과의 차이를 알려 주면 수정 방향이 명확해져요.' },
];
export type LessonTwoActivities = {
  opening: number | null;
  runs: boolean[];
  textCount: number;
  blockCount: number;
  aiSpecific: boolean;
  classifications: (number | null)[];
  classificationChecked: boolean;
  comparison: string[];
  answers: (number | null)[];
  quizChecked: boolean;
};
export function initialActivities(): LessonTwoActivities {
  return { opening: null, runs: [false, false, false], textCount: 2, blockCount: 2, aiSpecific: false, classifications: cards.map(() => null), classificationChecked: false, comparison: ['', '', ''], answers: questions.map(() => null), quizChecked: false };
}
export function restoreActivities(value: unknown): LessonTwoActivities {
  const base = initialActivities();
  if (!value || typeof value !== 'object') return base;
  const v = value as Record<string, unknown>;
  const selections = (x: unknown, n: number) => Array.from({ length: n }, (_, i) => Array.isArray(x) && Number.isInteger(x[i]) && x[i] >= 0 && x[i] <= 2 ? x[i] as number : null);
  return { ...base, opening: selections([v.opening], 1)[0], runs: base.runs.map((_, i) => Array.isArray(v.runs) && v.runs[i] === true), textCount: [1, 2, 3].includes(v.textCount as number) ? v.textCount as number : 2, blockCount: [1, 2, 3].includes(v.blockCount as number) ? v.blockCount as number : 2, aiSpecific: v.aiSpecific === true, classifications: selections(v.classifications, cards.length), classificationChecked: v.classificationChecked === true, comparison: base.comparison.map((_, i) => Array.isArray(v.comparison) && typeof v.comparison[i] === 'string' ? v.comparison[i].slice(0, 300) : ''), answers: selections(v.answers, questions.length), quizChecked: v.quizChecked === true };
}
export function lessonTwoRequirements(a: LessonTwoActivities, reflection: string) {
  return [a.runs.every(Boolean), a.classificationChecked && cards.every((c, i) => a.classifications[i] === c.answer), a.comparison.every(s => s.trim().length >= 10), a.quizChecked && questions.every((q, i) => a.answers[i] === q.answer), reflection.trim().length >= 10];
}
