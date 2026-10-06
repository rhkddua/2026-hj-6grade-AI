'use client';

import { CanvaWorkflow, LessonSchedule } from '@/components/lesson-workflow';

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
    <LessonSchedule>도입·이전 계획 2 + 문제·사용자·두 기능 5 + 이름·제작 지시 4 + Canva 이동 2 + 생성·대기 5 + 자기 앱 시험 4 + 짝 의견·가상 사례 판단 3 + 한 곳 수정·대기·재시험 6 + 퀴즈 3 + 성찰 2 + 저장·정리·여유 4 = 40분. 18분에 첫 생성 상태를 보고 31분에 외부 작업을 마무리해요. 교사는 계획 세 문장을 지시로 합치는 모습을 시범 보여요. 작은 두 기능과 한 곳 수정에 집중해요.</LessonSchedule>
    <fieldset><legend className="mb-3 font-black">어떤 생활 속 불편을 해결해 보고 싶나요?</legend><Radios name="need" options={needOptions} value={a.needChoice} onChange={needChoice => update({ needChoice, needChecked: false })} /></fieldset>
    <Button disabled={a.needChoice === null} onClick={() => update({ needChecked: true })}>문제 확인</Button>
    {a.needChecked && <output className="block rounded-xl bg-secondary p-4 leading-7">좋아요! 고른 불편을 누가, 언제 겪는지 생각하면 앱의 목표가 더 분명해져요.</output>}
  </div>;

  if (step === 2) return <div className="mt-6 space-y-6">
    <p className="leading-7">앱을 사용할 사람과 해결할 문제를 정하고, 같은 목표를 돕는 작은 기능 두 개를 계획해요. 선택한 주제와 맞는 이전 계획은 다시 써도 돼요. 준비물: 과목 선택→그 준비물 체크 / 쉬는 시간: 시간 선택→맞는 활동 추천 / 책 기록: 제목 대신 책 별칭 선택→한 줄 느낌 보기처럼 연결해요. 지원이 필요하면 한 예시에 내 조건 하나를 더해요.</p>
    <fieldset><legend className="mb-3 font-black">이 앱은 누구를 도울까요?</legend><Radios name="user" options={userOptions} value={a.targetUser} onChange={targetUser => update({ targetUser, planChecked: false })} /></fieldset>
    <div><label htmlFor="problem" className="font-black">해결할 문제</label><Textarea id="problem" className="mt-2 min-h-24 text-base md:text-base" maxLength={500} value={a.problem} onChange={event => update({ problem: event.target.value, planChecked: false })} placeholder="예: 준비물을 빠뜨리지 않도록 필요한 것을 쉽게 확인하고 싶어요." /><p className="mt-1 text-sm text-muted-foreground">{a.problem.trim().length} / 500자 · 15자 이상</p></div>
    <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="featureOne" className="font-black">첫 번째 기능</label><Textarea id="featureOne" className="mt-2 min-h-24 text-base md:text-base" maxLength={500} value={a.featureOne} onChange={event => update({ featureOne: event.target.value, planChecked: false })} placeholder="예: 과목을 고르면 준비물 목록을 보여 줘요." /><p className="mt-1 text-sm text-muted-foreground">10자 이상</p></div><div><label htmlFor="featureTwo" className="font-black">두 번째 기능</label><Textarea id="featureTwo" className="mt-2 min-h-24 text-base md:text-base" maxLength={500} value={a.featureTwo} onChange={event => update({ featureTwo: event.target.value, planChecked: false })} placeholder="예: 준비한 항목을 눌러 확인할 수 있어요." /><p className="mt-1 text-sm text-muted-foreground">10자 이상</p></div></div>
    <Button disabled={a.targetUser === null || a.problem.trim().length < 15 || a.featureOne.trim().length < 10 || a.featureTwo.trim().length < 10} onClick={() => update({ planChecked: true })}>앱 계획 확인</Button>
    {a.planChecked && <output className="block rounded-xl bg-secondary p-4 leading-7">{planIsReady(a) ? '대상 선택·글 길이·일부 개인정보 형태를 확인했어요. 두 기능이 같은 문제를 돕는지, 첫 결과가 다음 기능에 쓰이는지는 직접 읽고 짝에게 설명해요.' : '대상과 글 길이, 개인정보 형태나 요구를 다시 확인해요. 실제 값은 지우고 안전한 조건으로 바꿔요.'}</output>}
  </div>;

  if (step === 3) return <div className="mt-6 space-y-5">
    <p className="leading-7">앞의 문제·두 기능 문장을 복사해 이어 붙이고 연결·화면 결과만 덧붙여요. 새로 길게 필사할 필요가 없어요. 선택한 주제와 맞는 Canva 원본은 고쳐 쓰고, 다른 주제라면 기존 작품을 보존한 채 작은 새 앱을 만들어요. 꾸미기·세 번째 기능·주제 다시 바꾸기는 오늘 필수가 아니에요.</p>
    <div className="rounded-xl border p-4 leading-7"><p className="font-bold">내 계획을 합치는 틀</p><p>같은 불편을 겪는 학생을 위해 “{a.problem || '해결할 문제'}”를 돕는 앱을 만들어 줘. 첫 기능: {a.featureOne || '__'}. 두 번째 기능: {a.featureTwo || '__'}. 첫 기능의 __를 두 번째 기능에서 사용하고 화면에 __를 보여 줘. 개인정보를 요구하지 않는다.</p><p className="mt-2 text-sm">앞에서 쓴 문장을 보고 수동으로 옮겨요. 기존 제작 지시는 그대로 두고 필요한 부분만 고쳐요.</p></div>
    <div><label htmlFor="appName" className="font-black">앱 이름</label><Input id="appName" className="mt-2 text-base md:text-base" maxLength={80} value={a.appName} onChange={event => update({ appName: event.target.value, promptChecked: false })} placeholder="예: 준비물 척척" /></div>
    <div className="rounded-2xl bg-secondary/60 p-4 leading-7"><p className="font-bold">제작 지시에 넣을 내용</p><p className="mt-2">누가 사용하는지 · 어떤 문제를 해결하는지 · 첫 기능의 결과가 다음 기능에 어떻게 쓰이는지 · 화면에 무엇을 보여 줄지</p></div>
    <label htmlFor="buildPrompt" className="font-black">나의 앱 제작 지시</label><Textarea id="buildPrompt" className="min-h-44 text-base md:text-base" maxLength={1500} value={a.buildPrompt} onChange={event => update({ buildPrompt: event.target.value, promptChecked: false })} placeholder="개인정보 없이 앱의 목표와 두 기능을 구체적으로 설명해 보세요." /><p className="text-sm text-muted-foreground">{a.buildPrompt.trim().length} / 1500자 · 60자 이상</p>
    <Button disabled={a.appName.trim().length < 2 || a.buildPrompt.trim().length < 60} onClick={() => update({ promptChecked: true })}>제작 지시 확인</Button>
    {a.promptChecked && <output className="block rounded-xl bg-secondary p-4 leading-7">{promptIsReady(a) ? '이름·지시 길이와 일부 개인정보 형태를 확인했어요. 계획과 지시가 맞는지 직접 비교하고 실제 동작은 Canva에서 시험해요.' : '이름·길이·개인정보 형태나 요구를 다시 확인해요. “비밀번호를 요구하지 않는다” 같은 안전 조건을 쓸 수 있어요. 자동 확인이 모든 뜻을 이해하는 것은 아니에요.'}</output>}
    <CanvaWorkflow><ol className="mt-3 list-decimal space-y-2 pl-5"><li>지시를 Canva AI 코드에 옮겨 작은 앱을 생성하거나 주제와 맞는 원본을 고쳐요.</li><li>기다리는 동안 두 기능을 어떤 순서로 시험할지 예상해요.</li><li>웹 4단계 항목을 읽고 자기 앱을 시험한 뒤 돌아와요.</li></ol></CanvaWorkflow>
  </div>;

  if (step === 4) return <div className="mt-6 space-y-6">
    <p className="leading-7">내 Canva 앱의 두 기능을 순서대로 사용하고 실제 결과를 계획과 비교해요. 짝은 설명을 듣기 전에 써 보고 막힌 한 곳을 말해요. 실제 짝 의견과 내 예상은 구별해요. 아래 체크는 실제 조건이 충족됐을 때만 해요. 실패·미시험은 미체크로 저장하고 이어서 해요.</p>
    <details className="rounded-xl border p-4 leading-7"><summary className="cursor-pointer font-bold">참고·일시 오류 때 보는 화면 예시</summary><p className="mt-2">조건 선택 → 그 조건에 맞는 도움을 보여 주는 준비 예시예요. 자기 앱 결과가 아니에요. 오류 때는 같은 문제를 돕는 기존 자기 앱부터 시험하고 예시만 읽어서 성공 체크를 하지 않아요.</p></details>
    <fieldset><legend className="mb-3 font-black">사용자 테스트 확인표</legend><div className="space-y-3">{testChecklist.map((text, index) => <label key={text} className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 leading-7"><input className="mt-2" type="checkbox" checked={a.testChoices[index]} onChange={event => update({ testChoices: a.testChoices.map((value, choiceIndex) => choiceIndex === index ? event.target.checked : value), testChecked: false })} />{text}</label>)}</div></fieldset>
    <p className="leading-7">다음 질문은 판단 연습을 위한 가상 친구 사례예요. 내 짝에게 실제로 받은 말로 기록하지 않아요.</p>
    <fieldset><legend className="mb-3 font-black">친구가 “두 번째 기능으로 넘어가는 방법을 모르겠어”라고 했어요. 어떻게 할까요?</legend><Radios name="feedback" value={a.feedbackChoice} onChange={feedbackChoice => update({ feedbackChoice, testChecked: false })} options={['친구가 잘못 사용한 것이니 그대로 둬요.', '다음 행동을 알려 주는 버튼과 안내를 더 분명하게 고쳐요.']} /></fieldset>
    <label htmlFor="revisionPrompt" className="font-black">피드백을 반영한 수정 지시</label><Textarea id="revisionPrompt" className="min-h-28 text-base md:text-base" maxLength={1000} value={a.revisionPrompt} onChange={event => update({ revisionPrompt: event.target.value, testChecked: false })} placeholder="실제 짝 의견/내 관찰: __화면에서 __가 어려웠어요. __로 바꿔 줘. 문제가 없으면 안내 한 곳을 개선해요." /><p className="text-sm text-muted-foreground">{a.revisionPrompt.trim().length} / 1000자 · 15자 이상</p>
    <CanvaWorkflow><ol className="mt-3 list-decimal space-y-2 pl-5"><li>관찰한 한 곳의 수정 지시를 원본 Canva에 보내요.</li><li>같은 순서로 두 기능을 다시 쓰고 목적·결과·안전을 확인해요. 빠른 학생은 선택을 바꿔 전달 값이 유지되는지도 시험해요.</li><li>웹에 돌아와 실제 충족한 체크와 수정문을 확인해요. 성찰에 수정 전후·못 한 일을 남기고 원본과 공유 URL을 보관해요.</li></ol></CanvaWorkflow>
    <Button disabled={!a.testChoices.every(Boolean) || a.feedbackChoice === null || a.revisionPrompt.trim().length < 15} onClick={() => update({ testChecked: true })}>테스트와 수정 계획 확인</Button>
    {a.testChecked && <output className="block rounded-xl bg-secondary p-4 leading-7">{a.feedbackChoice === 1 ? '가상 사례 판단과 내 체크·수정문을 확인했어요. 웹이 앱 성공이나 실제 친구 의견을 자동 검증한 것은 아니에요.' : '사용자가 막힌 곳은 앱의 안내를 고칠 중요한 단서예요.'}</output>}
  </div>;

  return <div className="mt-6 space-y-6">{questions.map((question, index) => <fieldset key={question.title} className="rounded-2xl border p-4"><legend className="px-1 font-bold">퀴즈 {index + 1}</legend><p className="mb-3 font-bold leading-7">{question.title}</p><Radios name={`quiz-${index}`} options={question.options} value={a.answers[index]} onChange={answer => update({ answers: a.answers.map((value, answerIndex) => answerIndex === index ? answer : value), quizChecked: false })} />{a.quizChecked && <p className="mt-3 rounded-xl bg-secondary p-3 leading-7">{a.answers[index] === question.answer ? '정답이에요! ' : '다시 생각해 봐요. '}{question.tip}</p>}</fieldset>)}<Button disabled={a.answers.some(value => value === null)} onClick={() => update({ quizChecked: true })}>퀴즈 확인</Button>{a.quizChecked && <output className="block font-bold">{questions.filter((question, index) => a.answers[index] === question.answer).length} / 3문항 정답</output>}<div><label htmlFor="reflection" className="font-black">오늘의 성찰</label><p className="my-2 leading-7">사용자 __ / 문제 __ / 첫 결과 __ → 두 번째 기능 __. 실제 짝 의견 또는 내 관찰 __, 수정 전 __ / 수정 뒤 __ / 남은 일 __. 한 근거로 설명해요.</p><Textarea id="reflection" className="min-h-28 text-base md:text-base" maxLength={1000} value={reflection} onChange={event => setReflection(event.target.value)} /><p className="mt-1 text-sm text-muted-foreground">{reflection.trim().length} / 1000자 · 10자 이상</p></div></div>;
}

