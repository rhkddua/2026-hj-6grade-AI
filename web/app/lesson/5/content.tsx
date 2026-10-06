'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CanvaWorkflow, LessonSchedule } from '@/components/lesson-workflow';
import { planOptions, promptIsSafe, questions, testChecks, type LessonFiveActivities } from '@/lib/lesson-five';

type Props = { step: number; activities: LessonFiveActivities; update: (patch: Partial<LessonFiveActivities>) => void; reflection: string; setReflection: (value: string) => void };
function RadioCards({ name, options, value, onChange }: { name: string; options: string[]; value: number | null; onChange: (value: number) => void }) {
  return <div className="space-y-3">{options.map((text, i) => <label key={text} className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 leading-7"><input className="mt-2" type="radio" name={name} checked={value === i} onChange={() => onChange(i)} />{text}</label>)}</div>;
}
function PlanSummary({ a }: { a: LessonFiveActivities }) {
  return <div className="rounded-xl bg-secondary/60 p-4 leading-7"><h3 className="font-bold">내가 고른 계획</h3><p>사용자: {a.userChoice === null ? '2단계에서 골라요' : planOptions.users[a.userChoice]}</p><p>문제: {a.problemChoice === null ? '2단계에서 골라요' : planOptions.problems[a.problemChoice]}</p><p>기능: {a.featureChoice === null ? '2단계에서 골라요' : planOptions.features[a.featureChoice]}</p><p className="mt-2">짝에게 “이 기능이 이 문제를 도와주는 이유는 __”라고 설명해요. 제작 지시와 내 앱에서도 같은 조건을 찾아요.</p></div>;
}
export function LessonFiveContent({ step, activities: a, update, reflection, setReflection }: Props) {
  if (step === 1) return <div className="mt-6 space-y-6">
    <p className="leading-8">오늘은 웹에서 계획과 지시를 쓰고, Canva AI 코드에서 내 첫 앱을 만들어요. 버튼을 직접 눌러 보고 작은 수정 한 가지를 요청한 뒤 웹으로 돌아와 기록해요.</p>
    <LessonSchedule>역할·도입 3 + 계획 4 + 제작 지시 5 + Canva 이동·첫 생성 대기 6 + 자기 앱 시험 4 + 수정·대기·재시험 8 + 웹 복귀·체크 2 + 퀴즈·성찰 5 + 저장·정리·여유 3 = 40분. 교사는 지시 옮기기와 한 번 시험하기를 짧게 보여 줘요. 30분에 Canva 작업을 마무리하거나 남은 일을 적고 웹 확인으로 돌아와요.</LessonSchedule>
    <fieldset><legend className="mb-3 font-bold">Canva AI 코드가 해 주는 일로 가장 알맞은 것은?</legend><RadioCards name="intro" value={a.introChoice} onChange={introChoice => update({ introChoice, introChecked: false })} options={['내 생각 없이 완벽한 앱을 대신 제출해 줘요.', '내가 쓴 제작 지시를 바탕으로 앱 화면과 기능 아이디어를 만들어 줘요.', '친구의 개인정보를 찾아서 앱에 넣어 줘요.']} /></fieldset>
    <Button disabled={a.introChoice === null} onClick={() => update({ introChecked: true })}>확인하기</Button>{a.introChecked && <output className="block rounded-xl bg-secondary p-4 leading-7">{a.introChoice === 1 ? '정답이에요! 목적과 지시는 내가 정하고, 만들어진 결과를 직접 확인해요.' : '다시 생각해 봐요. Canva AI 코드는 지시를 바탕으로 만들기를 도와줘요. 결과가 완벽한지는 직접 확인해야 해요.'}</output>}
  </div>;
  if (step === 2) return <div className="mt-6 space-y-6">
    <p className="leading-7">누가 어떤 문제를 해결할지와 가장 중요한 기능을 하나씩 골라요. 예: 놀이를 고르기 어렵다면 추천 버튼이 도움을 줄 수 있어요.</p>
    <fieldset><legend className="mb-3 font-black">누가 사용할까요?</legend><RadioCards name="user" options={planOptions.users} value={a.userChoice} onChange={userChoice => update({ userChoice, planChecked: false })} /></fieldset>
    <fieldset><legend className="mb-3 font-black">어떤 문제를 도울까요?</legend><RadioCards name="problem" options={planOptions.problems} value={a.problemChoice} onChange={problemChoice => update({ problemChoice, planChecked: false })} /></fieldset>
    <fieldset><legend className="mb-3 font-black">가장 먼저 넣을 핵심 기능은?</legend><RadioCards name="feature" options={planOptions.features} value={a.featureChoice} onChange={featureChoice => update({ featureChoice, planChecked: false })} /></fieldset>
    <Button disabled={a.userChoice === null || a.problemChoice === null || a.featureChoice === null} onClick={() => update({ planChecked: true })}>제작 계획 확인</Button>
    {a.planChecked && <output className="block rounded-xl bg-secondary p-4 leading-7">세 항목을 골랐어요. 선택만으로 문제와 기능의 연결이 확인되는 것은 아니에요. 짝에게 이유를 말하고 어울리지 않으면 다시 골라요.</output>}
  </div>;
  if (step === 3) return <div className="mt-6 space-y-5">
    <PlanSummary a={a} />
    <p className="leading-7">고른 사용자·문제·핵심 기능을 지시에 넣어요. 화면에 무엇을 보여 줄지도 말해요. 틀: “__가 __를 해결하도록, __하면 __를 큰 글씨로 보여 주는 앱을 만들어 줘.”</p>
    <details className="rounded-xl border p-4 leading-7"><summary className="cursor-pointer font-bold">놀이 앱의 지시 예시</summary><p className="mt-2">6학년 친구가 쉬는 시간 놀이를 고를 수 있는 앱을 만들어 줘. 추천 버튼을 누르면 놀이 이름과 준비물을 큰 글씨 카드로 보여 줘. 전화번호를 받지 않게 해 줘.</p></details>
    <label htmlFor="ownPrompt" className="font-black">나의 제작 지시</label><Textarea id="ownPrompt" className="min-h-36 text-base md:text-base" maxLength={1000} value={a.ownPrompt} onChange={e => update({ ownPrompt: e.target.value, promptChecked: false })} />
    <p className="text-sm text-muted-foreground">{a.ownPrompt.trim().length} / 1000자 · 30자 이상 · 실제 이름, 연락처, 주소, 비밀값을 넣지 않아요.</p>
    <Button disabled={a.ownPrompt.trim().length < 30} onClick={() => update({ promptChecked: true })}>지시 길이·개인정보 표현 확인</Button>
    {a.promptChecked && <output className="block rounded-xl bg-secondary p-4 leading-7">{promptIsSafe(a.ownPrompt) ? '길이와 일부 개인정보 형태를 확인했어요. 실제 개인정보가 없는지, 내 계획의 문제와 기능이 들어 있는지 직접 읽어 확인해요.' : '개인정보 형태나 요구로 보이는 내용이 있어요. 실제 값은 지우고, “전화번호를 받지 않게”처럼 안전한 조건을 써요. 자동 확인은 모든 뜻을 이해하지 못하니 교사와 함께 읽어 봐요.'}</output>}
    <CanvaWorkflow><ol className="mt-3 list-decimal space-y-2 pl-5"><li>이 글칸의 제작 지시를 복사해 Canva AI 코드에 붙여 넣어요. 웹 탭은 열어 둬요.</li><li>생성된 내 앱에서 계획한 기능이 보이는지 찾아요. 기다리는 동안 짝에게 예상 결과를 말해요.</li><li>웹 4단계로 돌아와 시험할 항목을 읽고, Canva의 내 앱을 직접 시험해요.</li></ol></CanvaWorkflow>
  </div>;
  if (step === 4) return <div className="mt-6 space-y-6">
    <p className="leading-7">Canva의 내 앱을 직접 써 보세요. 계획한 기능을 한 번 실행하며 “예상은 __, 실제는 __”라고 짝에게 말해요. 체크는 점검했다는 뜻이에요. 실패를 발견해도 점검했다면 체크할 수 있어요.</p>
    <PlanSummary a={a} />
    <details className="rounded-xl border p-4 leading-7"><summary className="cursor-pointer font-bold">참고·일시 오류 때 보는 준비 예시</summary><p className="mt-2">놀이 이름과 준비물이 나오지만 글자가 작고 안내가 짧은 화면을 생각해 봐요. “글자를 크게 하고 준비물을 목록으로 보여 줘”라고 고칠 수 있어요. 이 예시는 내 지시로 생성된 앱이 아니에요. 예시만 읽었다면 내 앱을 시험했다고 체크하지 않아요. 일시 오류 때는 이미 만든 내 앱부터 다시 열어 봐요.</p></details>
    <fieldset><legend className="mb-3 font-black">내 앱 결과를 어떻게 판단할까요?</legend><RadioCards name="result" value={a.resultChoice} onChange={resultChoice => update({ resultChoice, testChecked: false })} options={['화면이 보이니 확인하지 않고 바로 제출해요.', '버튼, 글자, 안전한 입력을 직접 확인하고 고칠 점을 찾아요.']} /></fieldset>
    <fieldset className="space-y-3"><legend className="mb-3 font-black">직접 점검한 항목</legend>{testChecks.map((text, i) => <label key={text} className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 leading-7"><input className="mt-2" type="checkbox" checked={a.testChoices[i]} onChange={e => update({ testChoices: a.testChoices.map((value, index) => index === i ? e.target.checked : value), testChecked: false })} />{text}</label>)}</fieldset>
    <label htmlFor="revisionPrompt" className="font-black">관찰한 점과 작은 수정 지시 한 가지</label><Textarea id="revisionPrompt" className="min-h-28 text-base md:text-base" maxLength={1000} value={a.revisionPrompt} onChange={e => update({ revisionPrompt: e.target.value, testChecked: false })} placeholder="__를 눌렀더니 __였어요. __로 고쳐 주세요." />
    <p className="text-sm text-muted-foreground">{a.revisionPrompt.trim().length} / 1000자 · 15자 이상</p>
    <CanvaWorkflow><ol className="mt-3 list-decimal space-y-2 pl-5"><li>수정 지시를 원본 Canva 프로젝트의 AI 코드 대화에 옮겨요.</li><li>수정 뒤 처음과 같은 버튼·순서로 다시 시험해요. 빠른 짝은 다른 사람도 안내를 읽고 쓸 수 있는지 확인해요.</li><li>웹으로 돌아와 아래 확인을 누르고, 5단계 성찰에 처음·수정 뒤·아직 안 된 점을 적어요. 수정이 아직 반영되지 않았다면 그대로 적어요.</li></ol></CanvaWorkflow>
    <Button disabled={a.resultChoice === null || !a.testChoices.every(Boolean) || a.revisionPrompt.trim().length < 15} onClick={() => update({ testChecked: true })}>점검 기록과 수정 계획 확인</Button>
    {a.testChecked && <output className="block rounded-xl bg-secondary p-4 leading-7">{a.resultChoice === 1 ? '점검 체크와 수정문을 기록했어요. 앱의 성공을 자동으로 확인한 것은 아니에요. 관찰한 실패와 남은 작업도 사실대로 남겨요.' : '화면만 보아서는 기능을 알 수 없어요. 직접 시험하는 행동을 다시 골라요.'}</output>}
  </div>;
  return <div className="mt-6 space-y-6">{questions.map((q, i) => <fieldset key={q.title} className="rounded-2xl border p-4"><legend className="px-1 font-bold">퀴즈 {i + 1}</legend><p className="mb-3 font-bold leading-7">{q.title}</p><RadioCards name={`quiz-${i}`} options={q.options} value={a.answers[i]} onChange={answer => update({ answers: a.answers.map((value, index) => index === i ? answer : value), quizChecked: false })} />{a.quizChecked && <p className="mt-3 rounded-xl bg-secondary p-3 leading-7">{a.answers[i] === q.answer ? '정답이에요! ' : '다시 생각해 봐요. '}{q.tip}</p>}</fieldset>)}
    <Button disabled={a.answers.some(value => value === null)} onClick={() => update({ quizChecked: true })}>퀴즈 확인</Button>{a.quizChecked && <output className="block font-bold">{questions.filter((q, i) => a.answers[i] === q.answer).length} / 3문항 정답</output>}
    <div><label htmlFor="reflection" className="font-black">오늘의 성찰</label><p className="my-2 leading-7">내 계획에서 반영된 조건은 __. 첫 시험은 __, 수정 뒤는 __. 아직 안 된 점/다음에 시험할 점은 __. 실제로 한 부분만 써요. 공유 링크는 수업 뒤 나의 앱 보관함에 등록할 수 있어요.</p><Textarea id="reflection" className="min-h-28 text-base md:text-base" maxLength={1000} value={reflection} onChange={e => setReflection(e.target.value)} /><p className="mt-1 text-sm text-muted-foreground">{reflection.trim().length} / 1000자 · 10자 이상</p></div>
  </div>;
}
