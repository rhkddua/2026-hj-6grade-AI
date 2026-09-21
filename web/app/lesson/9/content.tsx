'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  needOptions,
  planIsReady,
  promptIsReady,
  questions,
  testChecklist,
  userOptions,
  type LessonNineActivities,
} from '@/lib/lesson-nine';

type Props = { step: number; activities: LessonNineActivities; update: (patch: Partial<LessonNineActivities>) => void; reflection: string; setReflection: (value: string) => void };

function Radios({ name, options, value, onChange }: { name: string; options: string[]; value: number | null; onChange: (value: number) => void }) {
  return <div className="space-y-3">{options.map((text, index) => <label key={text} className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 leading-7"><input className="mt-2" type="radio" name={name} checked={value === index} onChange={() => onChange(index)} />{text}</label>)}</div>;
}

export function LessonNineContent({ step, activities: a, update, reflection, setReflection }: Props) {
  if (step === 1) return <div className="mt-6 space-y-6">
    <p className="leading-8">좋은 앱은 거대한 문제보다 내가 자주 겪는 작은 불편에서 시작할 수 있어요. 개인정보를 모으지 않아도 해결할 수 있는 문제를 골라 봅시다.</p>
    <fieldset><legend className="mb-3 font-black">어떤 생활 속 불편을 해결해 보고 싶나요?</legend><Radios name="need" options={needOptions} value={a.needChoice} onChange={needChoice => update({ needChoice, needChecked: false })} /></fieldset>
    <Button disabled={a.needChoice === null} onClick={() => update({ needChecked: true })}>문제 확인</Button>
    {a.needChecked && <output className="block rounded-xl bg-secondary p-4 leading-7">좋아요! 고른 불편을 누가, 언제 겪는지 생각하면 앱의 목표가 더 분명해져요.</output>}
  </div>;

  if (step === 2) return <div className="mt-6 space-y-6">
    <p className="leading-7">앱을 사용할 사람과 해결할 문제를 정하고, 같은 목표를 돕는 기능 두 개를 계획해 보세요.</p>
    <fieldset><legend className="mb-3 font-black">이 앱은 누구를 도울까요?</legend><Radios name="user" options={userOptions} value={a.targetUser} onChange={targetUser => update({ targetUser, planChecked: false })} /></fieldset>
    <div><label htmlFor="problem" className="font-black">해결할 문제</label><Textarea id="problem" className="mt-2 min-h-24 text-base md:text-base" maxLength={500} value={a.problem} onChange={event => update({ problem: event.target.value, planChecked: false })} placeholder="예: 준비물을 빠뜨리지 않도록 필요한 것을 쉽게 확인하고 싶어요." /><p className="mt-1 text-sm text-muted-foreground">{a.problem.trim().length} / 500자 · 15자 이상</p></div>
    <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="featureOne" className="font-black">첫 번째 기능</label><Textarea id="featureOne" className="mt-2 min-h-24 text-base md:text-base" maxLength={500} value={a.featureOne} onChange={event => update({ featureOne: event.target.value, planChecked: false })} placeholder="예: 과목을 고르면 준비물 목록을 보여 줘요." /><p className="mt-1 text-sm text-muted-foreground">10자 이상</p></div><div><label htmlFor="featureTwo" className="font-black">두 번째 기능</label><Textarea id="featureTwo" className="mt-2 min-h-24 text-base md:text-base" maxLength={500} value={a.featureTwo} onChange={event => update({ featureTwo: event.target.value, planChecked: false })} placeholder="예: 준비한 항목을 눌러 확인할 수 있어요." /><p className="mt-1 text-sm text-muted-foreground">10자 이상</p></div></div>
    <Button disabled={a.targetUser === null || a.problem.trim().length < 15 || a.featureOne.trim().length < 10 || a.featureTwo.trim().length < 10} onClick={() => update({ planChecked: true })}>앱 계획 확인</Button>
    {a.planChecked && <output className="block rounded-xl bg-secondary p-4 leading-7">{planIsReady(a) ? '좋아요! 사용자와 문제, 두 기능이 안전하고 구체적으로 연결됐어요.' : '개인정보 없이 같은 문제를 해결하는 두 기능인지 다시 확인해 보세요.'}</output>}
  </div>;

  if (step === 3) return <div className="mt-6 space-y-5">
    <p className="leading-7">앞에서 정한 계획을 제작 지시로 합쳐 보세요. 대상 사용자, 문제, 두 기능의 연결, 화면 결과를 포함하면 좋아요.</p>
    <div><label htmlFor="appName" className="font-black">앱 이름</label><Input id="appName" className="mt-2 text-base md:text-base" maxLength={80} value={a.appName} onChange={event => update({ appName: event.target.value, promptChecked: false })} placeholder="예: 준비물 척척" /></div>
    <div className="rounded-2xl bg-secondary/60 p-4 leading-7"><p className="font-bold">제작 지시에 넣을 내용</p><p className="mt-2">누가 사용하는지 · 어떤 문제를 해결하는지 · 첫 기능의 결과가 다음 기능에 어떻게 쓰이는지 · 화면에 무엇을 보여 줄지</p></div>
    <label htmlFor="buildPrompt" className="font-black">나의 앱 제작 지시</label><Textarea id="buildPrompt" className="min-h-44 text-base md:text-base" maxLength={1500} value={a.buildPrompt} onChange={event => update({ buildPrompt: event.target.value, promptChecked: false })} placeholder="개인정보 없이 앱의 목표와 두 기능을 구체적으로 설명해 보세요." /><p className="text-sm text-muted-foreground">{a.buildPrompt.trim().length} / 1500자 · 60자 이상</p>
    <Button disabled={a.appName.trim().length < 2 || a.buildPrompt.trim().length < 60} onClick={() => update({ promptChecked: true })}>제작 지시 확인</Button>
    {a.promptChecked && <output className="block rounded-xl bg-secondary p-4 leading-7">{promptIsReady(a) ? '좋아요! 나에게 필요한 앱을 만들 수 있도록 안전하고 구체적으로 설명했어요.' : '개인정보를 빼고 앱의 목표와 두 기능을 다시 설명해 보세요.'}</output>}
  </div>;

  if (step === 4) return <div className="mt-6 space-y-6">
    <p className="leading-7">아래 준비된 화면을 내가 계획한 앱이라고 생각하고 사용자처럼 살펴보세요. 실제 외부 AI 호출 없이도 사용 흐름과 안전성을 점검할 수 있어요.</p>
    <div className="rounded-2xl border-2 border-dashed p-5"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-bold text-primary">준비된 결과</p><p className="text-xl font-black">{a.appName.trim() || '나의 생활 도우미'}</p></div><span className="rounded-full bg-secondary px-3 py-1 text-sm font-bold">기능 2개</span></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-muted p-4"><p className="font-bold">기능 1</p><p className="mt-2 leading-6">필요한 조건을 선택해요.</p></div><div className="rounded-xl bg-muted p-4"><p className="font-bold">기능 2</p><p className="mt-2 leading-6">선택 결과에 맞는 도움을 보여 줘요.</p></div></div></div>
    <fieldset><legend className="mb-3 font-black">사용자 테스트 확인표</legend><div className="space-y-3">{testChecklist.map((text, index) => <label key={text} className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 leading-7"><input className="mt-2" type="checkbox" checked={a.testChoices[index]} onChange={event => update({ testChoices: a.testChoices.map((value, choiceIndex) => choiceIndex === index ? event.target.checked : value), testChecked: false })} />{text}</label>)}</div></fieldset>
    <fieldset><legend className="mb-3 font-black">친구가 “두 번째 기능으로 넘어가는 방법을 모르겠어”라고 했어요. 어떻게 할까요?</legend><Radios name="feedback" value={a.feedbackChoice} onChange={feedbackChoice => update({ feedbackChoice, testChecked: false })} options={['친구가 잘못 사용한 것이니 그대로 둬요.', '다음 행동을 알려 주는 버튼과 안내를 더 분명하게 고쳐요.']} /></fieldset>
    <label htmlFor="revisionPrompt" className="font-black">피드백을 반영한 수정 지시</label><Textarea id="revisionPrompt" className="min-h-28 text-base md:text-base" maxLength={1000} value={a.revisionPrompt} onChange={event => update({ revisionPrompt: event.target.value, testChecked: false })} placeholder="어떤 화면에서 무엇을 어떻게 바꿀지 써 보세요." /><p className="text-sm text-muted-foreground">{a.revisionPrompt.trim().length} / 1000자 · 15자 이상</p>
    <Button disabled={!a.testChoices.every(Boolean) || a.feedbackChoice === null || a.revisionPrompt.trim().length < 15} onClick={() => update({ testChecked: true })}>테스트와 수정 계획 확인</Button>
    {a.testChecked && <output className="block rounded-xl bg-secondary p-4 leading-7">{a.feedbackChoice === 1 ? '좋아요! 사용자의 어려움을 앱을 더 쉽게 만드는 근거로 사용했어요.' : '사용자가 막힌 곳은 앱의 안내를 고칠 중요한 단서예요.'}</output>}
  </div>;

  return <div className="mt-6 space-y-6">{questions.map((question, index) => <fieldset key={question.title} className="rounded-2xl border p-4"><legend className="px-1 font-bold">퀴즈 {index + 1}</legend><p className="mb-3 font-bold leading-7">{question.title}</p><Radios name={`quiz-${index}`} options={question.options} value={a.answers[index]} onChange={answer => update({ answers: a.answers.map((value, answerIndex) => answerIndex === index ? answer : value), quizChecked: false })} />{a.quizChecked && <p className="mt-3 rounded-xl bg-secondary p-3 leading-7">{a.answers[index] === question.answer ? '정답이에요! ' : '다시 생각해 봐요. '}{question.tip}</p>}</fieldset>)}<Button disabled={a.answers.some(value => value === null)} onClick={() => update({ quizChecked: true })}>퀴즈 확인</Button>{a.quizChecked && <output className="block font-bold">{questions.filter((question, index) => a.answers[index] === question.answer).length} / 3문항 정답</output>}<div><label htmlFor="reflection" className="font-black">오늘의 성찰</label><p className="my-2 leading-7">내 앱이 누구에게 어떤 도움을 줄 수 있는지 한 문장으로 정리해 보세요.</p><Textarea id="reflection" className="min-h-28 text-base md:text-base" maxLength={1000} value={reflection} onChange={event => setReflection(event.target.value)} /><p className="mt-1 text-sm text-muted-foreground">{reflection.trim().length} / 1000자 · 10자 이상</p></div></div>;
}
