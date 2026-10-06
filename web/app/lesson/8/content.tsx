'use client';

import { CanvaWorkflow, LessonSchedule } from '@/components/lesson-workflow';

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
    <p className="leading-8">이번 과제에서는 첫 기능의 결과를 다음 기능에 연결해요. 쉬는 시간을 고르면 그 시간이 추천에 쓰여요. 전달 값은 ‘다음 기능이 사용할 정보’예요. 7차시의 안내 개선에서 한 걸음 더 나아가 두 기능 사이의 연결을 시험해요.</p>
    <LessonSchedule>도입 3 + 연결 설계 3 + 제작 지시 4 + Canva 이동 2 + 생성·대기 5 + 세 상황 시험 5 + 짝에게 흐름 설명 1 + 수정 지시 옮기기 1 + 수정·대기·재시험 6 + 퀴즈 4 + 성찰 2 + 저장·정리·여유 4 = 40분. 교사는 시간 선택이 추천으로 이어지는 모습을 짧게 시범 보여요. 17분까지 첫 생성을 시도하고 30분에 외부 작업을 마무리하거나 남은 일을 저장해요.</LessonSchedule>
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
    <p className="leading-7">이전 놀이 추천 원본 Canva 프로젝트/AI 코드 대화에 시간 선택 기능을 추가해 두 기능으로 연결하거나 작은 새 앱을 만들어요. 원본이 없으면 기존 작품을 보존하고 새 생성의 추가 시간을 고려해요. 아래 세 결과는 이번 연습의 조건이에요. 다른 앱에서 타당한 추천도 이번 조건과는 구별해요.</p>
    <div className="rounded-2xl bg-secondary/60 p-4 leading-7"><p className="font-bold">제작 지시에 넣을 세 가지 조건</p><p className="mt-2">“5분·10분·15분 중 시간을 선택하고 추천 버튼을 누르는 앱을 만들어 줘. 선택한 시간을 추천 기능에 전달해 줘. 5분이면 준비물 없는 짧은 스트레칭, 15분이면 준비물이 필요한 긴 활동을 카드로 보여 줘. 시간을 선택하지 않았으면 먼저 시간을 고르라는 안내를 보여 줘. 개인정보를 요구하지 않는다.”</p><p className="mt-2">틀: 첫 기능 __ → 전달할 값 __ → 두 번째 기능 __. 5분 __ / 15분 __ / 미선택 __. 활동 이름·문구는 예시와 같지 않아도 시간·활동·준비물 조건이 맞으면 돼요.</p></div>
    <label htmlFor="buildPrompt" className="font-black">나의 두 기능 앱 제작 지시</label>
    <Textarea id="buildPrompt" className="min-h-40 text-base md:text-base" maxLength={1200} value={a.buildPrompt} onChange={event => update({ buildPrompt: event.target.value, promptChecked: false })} placeholder="첫 기능, 전달할 값, 두 번째 기능, 화면 결과를 써 보세요." />
    <p className="text-sm text-muted-foreground">{a.buildPrompt.trim().length} / 1200자 · 45자 이상 · 개인정보를 쓰지 않아요.</p>
    <Button disabled={a.buildPrompt.trim().length < 45} onClick={() => update({ promptChecked: true })}>제작 지시 확인</Button>
    {a.promptChecked && <output className="block rounded-xl bg-secondary p-4 leading-7">{promptIsSafe(a.buildPrompt) ? '길이와 일부 개인정보 형태를 확인했어요. 두 기능의 연결·세 결과 조건·개인정보가 없는지는 직접 읽어 확인해요.' : '개인정보 형태나 요구로 보이는 내용을 고쳐요. 실제 값은 지우고 “비밀번호를 요구하지 않는다”처럼 안전한 조건을 써요. 자동 확인이 모든 뜻을 이해하는 것은 아니에요.'}</output>}
    <CanvaWorkflow><ol className="mt-3 list-decimal space-y-2 pl-5"><li>제작 지시를 Canva AI 코드 대화에 옮겨 생성하거나 원본을 확장해요.</li><li>기다리는 동안 짝에게 선택한 시간이 어떤 추천에 쓰일지 설명해요.</li><li>웹 4단계의 세 상황을 읽고 내 앱을 직접 시험해요.</li></ol></CanvaWorkflow>
  </div>;

  if (step === 4) return <div className="mt-6 space-y-6">
    <p className="leading-7">내 Canva 앱에서 5분·15분·미선택을 시험해요. 미선택은 앱을 처음 열거나 시간 선택을 초기화한 상태에서 추천을 눌러요. 이전 선택이 남아 있으면 미선택 시험이 아니에요. 아래 체크는 실제 해당 결과가 나왔을 때만 표시해요. 실패·미시험은 미체크로 저장하고 이어서 해요.</p>
    <details className="rounded-xl border p-4 leading-7"><summary className="cursor-pointer font-bold">참고·일시 오류 때 보는 예상 결과</summary><ul className="mt-3 list-disc pl-5"><li>5분 → 목·어깨 스트레칭 / 준비물 없음</li><li>15분 → 종이로 만드는 활동 / 종이·연필</li><li>미선택 → 먼저 시간을 선택해 주세요.</li></ul><p className="mt-2">내 앱 결과가 아닌 준비 예시예요. 예시 읽기나 교사 시연으로 성공 체크를 하지 않아요. 오류 때는 세 조건을 시험할 수 있는 기존 자기 앱부터 사용해요.</p></details>
    <fieldset><legend className="mb-3 font-black">내 앱에서 실제로 나온 결과만 확인하세요.</legend><div className="space-y-3">{testCases.map((test, index) => <label key={test.label} className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 leading-7"><input className="mt-2" type="checkbox" checked={a.testChoices[index]} onChange={event => update({ testChoices: a.testChoices.map((value, choiceIndex) => choiceIndex === index ? event.target.checked : value), testChecked: false })} />{test.label}</label>)}</div></fieldset>
    <label htmlFor="revisionPrompt" className="font-black">발견한 문제를 고치는 수정 지시</label>
    <Textarea id="revisionPrompt" className="min-h-28 text-base md:text-base" maxLength={1000} value={a.revisionPrompt} onChange={event => update({ revisionPrompt: event.target.value, testChecked: false })} placeholder="입력 __ / 예상 __ / 실제 __였어요. __로 고쳐 주세요. 이미 맞으면 안내 한 곳을 더 알아보기 쉽게 바꿔요." />
    <p className="text-sm text-muted-foreground">{a.revisionPrompt.trim().length} / 1000자 · 15자 이상</p>
    <CanvaWorkflow><ol className="mt-3 list-decimal space-y-2 pl-5"><li>관찰한 한 곳의 수정 지시를 원본 Canva에 옮겨요. 문제가 없으면 안내 한 곳의 작은 개선을 요청해요.</li><li>같은 세 상황을 다시 시험해요. 빠른 학생은 10분이나 빠른 선택 변경도 시험해요.</li><li>웹으로 돌아와 실제 성공한 체크만 확인하고 성찰에 수정 전후 또는 남은 일을 적어요.</li></ol></CanvaWorkflow>
    <Button disabled={!a.testChoices.every(Boolean) || a.revisionPrompt.trim().length < 15} onClick={() => update({ testChecked: true })}>테스트와 수정 계획 확인</Button>
    {a.testChecked && <output className="block rounded-xl bg-secondary p-4 leading-7">세 결과에 대한 내 체크와 수정문을 확인했어요. 웹이 앱 성공을 자동으로 검증한 것은 아니에요. 실제 결과와 기록이 맞는지 다시 읽어요.</output>}
  </div>;

  return <div className="mt-6 space-y-6">
    {questions.map((question, index) => <fieldset key={question.title} className="rounded-2xl border p-4"><legend className="px-1 font-bold">퀴즈 {index + 1}</legend><p className="mb-3 font-bold leading-7">{question.title}</p><Radios name={`quiz-${index}`} options={question.options} value={a.answers[index]} onChange={answer => update({ answers: a.answers.map((value, answerIndex) => answerIndex === index ? answer : value), quizChecked: false })} />{a.quizChecked && <p className="mt-3 rounded-xl bg-secondary p-3 leading-7">{a.answers[index] === question.answer ? '정답이에요! ' : '다시 생각해 봐요. '}{question.tip}</p>}</fieldset>)}
    <Button disabled={a.answers.some(value => value === null)} onClick={() => update({ quizChecked: true })}>퀴즈 확인</Button>
    {a.quizChecked && <output className="block font-bold">{questions.filter((question, index) => a.answers[index] === question.answer).length} / 3문항 정답</output>}
    <div><label htmlFor="reflection" className="font-black">오늘의 성찰</label><p className="my-2 leading-7">입력 __ → 전달 값 __ → 실제 추천 __. 수정 전 __ / 수정 뒤 __ / 아직 못 한 일 __. 세 상황 중 한 근거로 연결을 설명해요.</p><Textarea id="reflection" className="min-h-28 text-base md:text-base" maxLength={1000} value={reflection} onChange={event => setReflection(event.target.value)} /><p className="mt-1 text-sm text-muted-foreground">{reflection.trim().length} / 1000자 · 10자 이상</p></div>
  </div>;
}
