export const stages = ['생각 열기', '네 가지 단서', '구체적으로 바꾸기', '다시 요청하기', '배움 확인하기'];

export const clueItems = [
  { text: '무엇을 이루고 싶은지 말해요.', answer: 0, label: '목표', tip: '목표는 이루려는 일이에요. “쉬는 시간 놀이를 추천해 줘”가 목표예요.' },
  { text: '누가, 어떤 상황에서 사용할지 알려 줘요.', answer: 1, label: '상황', tip: '상황은 누가 언제 쓰는지예요. “6학년이 쉬는 시간에 할 놀이”처럼 알려 줘요.' },
  { text: '지켜야 할 범위나 하지 말아야 할 것을 말해요.', answer: 2, label: '조건', tip: '조건은 지켜야 할 약속이에요. “10분 안에, 준비물 없이”처럼 범위를 정해요.' },
  { text: '표, 목록, 짧은 글처럼 어떤 모양으로 받을지 말해요.', answer: 3, label: '결과 형식', tip: '결과 형식은 답의 모양이에요. “놀이 이름과 방법을 표로 보여 줘”처럼 말해요.' },
];

export const detailOptions = [
  '6학년 친구가 읽기 쉽게',
  '교실에서 안전하게 할 수 있는 놀이만',
  '이유를 한 줄씩 덧붙여서',
];

export const revisionItems = [
  { text: '놀이 설명이 너무 어려워요.', answer: 0, options: ['초등학교 6학년이 이해할 말로 다시 설명해 줘.', '더 길게 써 줘.'], tip: '글을 늘리기보다 읽는 대상을 알려 주고 쉬운 말로 고쳐 달라고 해요.' },
  { text: '놀이가 너무 많아 고르기 힘들어요.', answer: 1, options: ['놀이를 10개 더 추가해 줘.', '알맞은 놀이 3가지만 골라 표로 정리해 줘.'], tip: '더 추가하면 고르기 어려워져요. 개수를 줄이는 조건과 표라는 형식을 함께 말해요.' },
  { text: '놀이에서 무엇을 먼저 해야 할지 모르겠어요.', answer: 0, options: ['순서를 정해 번호 목록으로 바꿔 줘.', '제목을 멋지게 바꿔 줘.'], tip: '제목만 바꾸면 순서는 알 수 없어요. 먼저 할 일을 번호로 보여 달라고 해요.' },
];

export const playBaseRequest = '우리 반이 쉬는 시간 10분 동안 준비물 없이 할 놀이를 3가지, 이름과 방법을 표로 추천해 줘.';

// Prepared teaching examples: no AI request and no new persisted activity fields.
export function lessonFourExamples(choices: boolean[]) {
  const easy = choices[0] === true;
  const classroom = choices[1] === true;
  const reasons = choices[2] === true;
  const request = [playBaseRequest, ...detailOptions.filter((_, i) => choices[i])].join(' ');
  const rows = [
    { name: '끝말잇기', method: easy ? '앞 단어의 끝 글자로 시작하는 단어를 말해요.' : '말미 음절을 활용한 어휘 연쇄를 구성해요.', place: '교실에서 앉아서', reason: '말로만 해서 준비물이 필요 없어요.' },
    { name: classroom ? '말로 하는 스무고개' : '산책하며 스무고개', method: easy ? '한 사람이 생각한 것을 질문으로 맞혀요.' : '질의응답으로 대상의 범주를 추론해요.', place: classroom ? '교실에서 앉아서' : '학교 정원에서', reason: '서로 질문하며 함께 생각할 수 있어요.' },
    { name: '이야기 이어 말하기', method: easy ? '한 문장씩 덧붙여 이야기를 만들어요.' : '서사를 순차적으로 확장해요.', place: '교실에서 앉아서', reason: '한 문장씩 말해서 모두 참여할 수 있어요.' },
  ].map(row => ({ ...row, reason: reasons ? row.reason : null }));
  const comparisons = [
    { selected: easy, condition: detailOptions[0], before: '어휘 연쇄·범주 추론처럼 어려운 말이 있어요.', after: '놀이 방법을 쉬운 말로 풀었어요.' },
    { selected: classroom, condition: detailOptions[1], before: '정원에서 이동하는 놀이가 있어요. 교실에서 할 수 있는지 확인해야 해요.', after: '세 놀이 모두 교실에서 앉아서 하는 방법을 제시해요. 실제 놀이 전 안전한지 확인해요.' },
    { selected: reasons, condition: detailOptions[2], before: '놀이를 고를 이유가 없어요.', after: '각 놀이에 이유 한 줄을 덧붙였어요.' },
  ].filter(row => row.selected);
  return { request, rows, reasons, comparisons };
}

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
