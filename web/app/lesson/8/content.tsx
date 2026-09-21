'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  connectionOptions,
  promptIsSafe,
  questions,
  testCases,
  type LessonEightActivities,
} from '@/lib/lesson-eight';

type Props = {
  step: number;
  activities: LessonEightActivities;
  update: (patch: Partial<LessonEightActivities>) => void;
  reflection: string;
  setReflection: (value: string) => void;
};

function Radios({ name, options, value, onChange }: { name: string; options: string[]; value: number | null; onChange: (value: number) => void }) {
  return <div className="space-y-3">{options.map((text, index) => (
    <label key={text} className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 leading-7">
      <input className="mt-2" type="radio" name={name} checked={value === index} onChange={() => onChange(index)} />
      {text}
    </label>
  ))}</div>;
}

export function LessonEightContent({ step, activities: a, update, reflection, setReflection }: Props) {
  if (step === 1) return <div className="mt-6 space-y-6">
    <p className="leading-8">두 기능 앱은 기능 두 개를 따로 놓은 앱이 아니에요. 첫 기능에서 만든 결과를 두 번째 기능이 받아 사용하면 하나의 자연스러운 흐름이 돼요.</p>
    <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
      <div className="rounded-2xl bg-teal-50 p-5 text-teal-950"><p className="text-sm font-bold text-teal-700">기능 1</p><p className="mt-1 font-black">쉬는 시간 선택</p></div>
      <span className="text-center text-2xl font-black text-primary" aria-hidden="true">→</span>
      <div className="rounded-2xl bg-orange-50 p-5 text-orange-950"><p className="text-sm font-bold text-orange-700">기능 2</p><p className="mt-1 font-black">시간에 맞는 활동 추천</p></div>
    </div>
    <fieldset><legend className="mb-3 font-bold">두 기능이 잘 연결된 설명은 무엇일까요?</legend><Radios name="concept" value={a.conceptChoice} onChange={conceptChoice => update({ conceptChoice, conceptChecked: false })} options={['첫 기능의 결과를 두 번째 기능이 사용해요.', '서로 상관없는 버튼을 두 개 만들어요.', '두 기능 모두 개인정보를 모아요.']} /></fieldset>
    <Button disabled={a.conceptChoice === null} onClick={() => update({ conceptChecked: true })}>확인하기</Button>
    {a.conceptChecked && <output className="block rounded-xl bg-secondary p-4 leading-7">{a.conceptChoice === 0 ? '정답이에요! 기능 사이에 값이 전달되면 하나의 흐름이 돼요.' : '다시 생각해 봐요. 앞 기능의 결과가 뒤 기능에 쓰여야 해요.'}</output>}
  </div>;

  if (step === 2) return <div className="mt-6 space-y-6">
    <p className="leading-7">‘쉬는 시간 도우미’의 두 기능을 연결해 보세요. 안전한 입력을 받고, 그 값을 다음 기능에 전달해야 해요.</p>
    <fieldset><legend className="mb-3 font-black">1. 첫 번째 기능</legend><Radios name="first" options={connectionOptions.firstFeatures} value={a.firstFeature} onChange={firstFeature => update({ firstFeature, connectionChecked: false })} /></fieldset>
    <fieldset><legend className="mb-3 font-black">2. 다음 기능에 전달할 값</legend><Radios name="shared" options={connectionOptions.sharedValues} value={a.sharedValue} onChange={sharedValue => update({ sharedValue, connectionChecked: false })} /></fieldset>
    <fieldset><legend className="mb-3 font-black">3. 두 번째 기능</legend><Radios name="second" options={connectionOptions.secondFeatures} value={a.secondFeature} onChange={secondFeature => update({ secondFeature, connectionChecked: false })} /></fieldset>
    <Button disabled={a.firstFeature === null || a.sharedValue === null || a.secondFeature === null} onClick={() => update({ connectionChecked: true })}>기능 연결 확인</Button>
    {a.connectionChecked && <output className="block rounded-xl bg-secondary p-4 leading-7">{a.firstFeature === 0 && a.sharedValue === 0 && a.secondFeature === 0 ? '좋아요! 선택한 시간이 추천 기능으로 안전하게 이어져요.' : '개인정보 없이 첫 기능의 결과가 다음 기능에 쓰이는 흐름을 다시 골라 보세요.'}</output>}
  </div>;

  if (step === 3) return <div className="mt-6 space-y-5">
    <p className="leading-7">두 기능과 연결 방법, 화면 결과를 한 번에 설명해 보세요. 이름이나 연락처 같은 개인정보는 필요하지 않아요.</p>
    <div className="rounded-2xl bg-secondary/60 p-4 leading-7"><p className="font-bold">안전한 예시</p><p className="mt-2">“5분·10분·15분 중 쉬는 시간을 고르게 하고, 선택한 시간에 맞는 활동과 준비물을 결과 카드로 추천하는 앱을 만들어 줘.”</p></div>
    <label htmlFor="buildPrompt" className="font-black">나의 두 기능 앱 제작 지시</label>
    <Textarea id="buildPrompt" className="min-h-40 text-base md:text-base" maxLength={1200} value={a.buildPrompt} onChange={event => update({ buildPrompt: event.target.value, promptChecked: false })} placeholder="첫 기능, 전달할 값, 두 번째 기능, 화면 결과를 써 보세요." />
    <p className="text-sm text-muted-foreground">{a.buildPrompt.trim().length} / 1200자 · 45자 이상 · 개인정보를 쓰지 않아요.</p>
    <Button disabled={a.buildPrompt.trim().length < 45} onClick={() => update({ promptChecked: true })}>제작 지시 확인</Button>
    {a.promptChecked && <output className="block rounded-xl bg-secondary p-4 leading-7">{promptIsSafe(a.buildPrompt) ? '좋아요! 두 기능의 연결과 결과를 안전하게 설명했어요.' : '개인정보처럼 보이는 내용을 일반적인 조건으로 바꿔 보세요.'}</output>}
  </div>;

  if (step === 4) return <div className="mt-6 space-y-6">
    <p className="leading-7">실제 외부 AI를 부르지 않고 준비된 결과를 시험해 봅시다. 서로 다른 입력과 입력이 없는 경우까지 확인해야 해요.</p>
    <div className="rounded-2xl border-2 border-dashed p-5"><p className="font-black">준비된 결과: 쉬는 시간 도우미</p><div className="mt-4 grid gap-3 sm:grid-cols-3">{['5분', '10분', '15분'].map(time => <button type="button" key={time} className="rounded-xl border bg-background p-3 font-bold">{time}</button>)}</div><div className="mt-4 rounded-xl bg-muted p-4 leading-7"><p className="font-bold">추천 활동</p><p>목과 어깨 스트레칭 · 준비물 없음</p></div></div>
    <fieldset><legend className="mb-3 font-black">테스트한 상황을 모두 확인하세요.</legend><div className="space-y-3">{testCases.map((test, index) => <label key={test.label} className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 leading-7"><input className="mt-2" type="checkbox" checked={a.testChoices[index]} onChange={event => update({ testChoices: a.testChoices.map((value, choiceIndex) => choiceIndex === index ? event.target.checked : value), testChecked: false })} />{test.label}</label>)}</div></fieldset>
    <label htmlFor="revisionPrompt" className="font-black">발견한 문제를 고치는 수정 지시</label>
    <Textarea id="revisionPrompt" className="min-h-28 text-base md:text-base" maxLength={1000} value={a.revisionPrompt} onChange={event => update({ revisionPrompt: event.target.value, testChecked: false })} placeholder="예: 시간을 고르지 않았을 때 먼저 시간을 선택하라는 안내를 보여 줘." />
    <p className="text-sm text-muted-foreground">{a.revisionPrompt.trim().length} / 1000자 · 15자 이상</p>
    <Button disabled={!a.testChoices.every(Boolean) || a.revisionPrompt.trim().length < 15} onClick={() => update({ testChecked: true })}>테스트와 수정 계획 확인</Button>
    {a.testChecked && <output className="block rounded-xl bg-secondary p-4 leading-7">좋아요! 두 기능이 여러 상황에서 이어지는지 확인하고 수정할 점도 구체적으로 적었어요.</output>}
  </div>;

  return <div className="mt-6 space-y-6">
    {questions.map((question, index) => <fieldset key={question.title} className="rounded-2xl border p-4"><legend className="px-1 font-bold">퀴즈 {index + 1}</legend><p className="mb-3 font-bold leading-7">{question.title}</p><Radios name={`quiz-${index}`} options={question.options} value={a.answers[index]} onChange={answer => update({ answers: a.answers.map((value, answerIndex) => answerIndex === index ? answer : value), quizChecked: false })} />{a.quizChecked && <p className="mt-3 rounded-xl bg-secondary p-3 leading-7">{a.answers[index] === question.answer ? '정답이에요! ' : '다시 생각해 봐요. '}{question.tip}</p>}</fieldset>)}
    <Button disabled={a.answers.some(value => value === null)} onClick={() => update({ quizChecked: true })}>퀴즈 확인</Button>
    {a.quizChecked && <output className="block font-bold">{questions.filter((question, index) => a.answers[index] === question.answer).length} / 3문항 정답</output>}
    <div><label htmlFor="reflection" className="font-black">오늘의 성찰</label><p className="my-2 leading-7">두 기능이 자연스럽게 이어지게 하려면 무엇을 꼭 확인해야 할까요?</p><Textarea id="reflection" className="min-h-28 text-base md:text-base" maxLength={1000} value={reflection} onChange={event => setReflection(event.target.value)} /><p className="mt-1 text-sm text-muted-foreground">{reflection.trim().length} / 1000자 · 10자 이상</p></div>
  </div>;
}
