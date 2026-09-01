'use client';

import { useState } from 'react';
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, Code2, Lightbulb,
  ListChecks, MessageCircleQuestion, Save, Sparkles,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress';

const comparisons = [
  { label: '명령 방법', traditional: '정해진 문법으로 코드를 직접 작성해요.', ai: '원하는 결과를 자연어로 설명해요.' },
  { label: '사람의 역할', traditional: '명령을 세밀하게 설계하고 구현해요.', ai: '목표를 정하고 결과를 확인·수정해요.' },
  { label: '오류가 생기면', traditional: '코드를 찾아 직접 고쳐요.', ai: '문제를 설명하고 수정 결과를 다시 확인해요.' },
];

export default function LessonTwoPage() {
  const [step, setStep] = useState(1);
  const [choice, setChoice] = useState<string | null>(null);
  const progress = step * 25;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2 text-sm font-extrabold"><ArrowLeft className="size-4" />수업 홈</a>
          <div className="hidden items-center gap-2 sm:flex"><Code2 className="size-5 text-primary" /><span className="font-black">AI 코딩 교실</span></div>
          <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground">자동 저장됨</span>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:py-9">
        <aside>
          <div className="sticky top-24 rounded-3xl border bg-card p-5 shadow-sm">
            <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">2차시</Badge>
            <h1 className="mt-3 font-heading text-xl font-black leading-7">전통적인 코딩과 AI 코딩</h1>
            <Progress value={progress} className="mt-5"><ProgressLabel>학습 진행</ProgressLabel><ProgressValue>{progress}%</ProgressValue></Progress>
            <ol className="mt-6 space-y-2">
              {['생각 열기', '차이 알아보기', '직접 비교하기', '배움 확인하기'].map((item, index) => (
                <li key={item} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold ${step === index + 1 ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground'}`}>
                  <span className={`grid size-6 place-items-center rounded-full text-xs ${step > index + 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-muted'}`}>{step > index + 1 ? <Check className="size-3.5" /> : index + 1}</span>{item}
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <section className="min-w-0 rounded-3xl border bg-card p-5 shadow-sm sm:p-8">
          {step === 1 && (
            <div>
              <div className="grid size-12 place-items-center rounded-2xl bg-orange-100 text-orange-700"><MessageCircleQuestion className="size-6" /></div>
              <p className="mt-6 text-sm font-bold text-primary">생각 열기</p>
              <h2 className="mt-1 font-heading text-2xl font-black tracking-tight sm:text-3xl">컴퓨터에게 그림을 그리게 하려면?</h2>
              <p className="mt-4 leading-7 text-muted-foreground">예전에는 위치와 색을 코드로 하나씩 적어야 했어요. 지금은 AI에게 “파란 하늘 아래 웃는 로봇을 그려 줘”라고 설명할 수도 있지요.</p>
              <div className="mt-7 rounded-2xl border border-orange-200 bg-orange-50 p-5"><div className="flex gap-3"><Lightbulb className="mt-0.5 size-5 shrink-0 text-orange-600" /><div><p className="font-extrabold text-orange-950">오늘의 질문</p><p className="mt-1 text-sm leading-6 text-orange-900/80">AI가 코드를 만들어 준다면 사람은 더 이상 할 일이 없을까요?</p></div></div></div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-sm font-bold text-primary">차이 알아보기</p>
              <h2 className="mt-1 font-heading text-2xl font-black sm:text-3xl">두 가지 코딩 방법을 비교해요</h2>
              <div className="mt-6 overflow-hidden rounded-2xl border">
                <div className="grid grid-cols-[100px_1fr_1fr] bg-muted/70 text-sm font-black sm:grid-cols-[140px_1fr_1fr]"><div className="p-3 sm:p-4">비교</div><div className="border-l p-3 sm:p-4">전통 코딩</div><div className="border-l p-3 sm:p-4">AI 코딩</div></div>
                {comparisons.map((row) => <div key={row.label} className="grid grid-cols-[100px_1fr_1fr] border-t text-sm leading-6 sm:grid-cols-[140px_1fr_1fr]"><div className="p-3 font-bold sm:p-4">{row.label}</div><div className="border-l p-3 text-muted-foreground sm:p-4">{row.traditional}</div><div className="border-l bg-teal-50/50 p-3 text-muted-foreground sm:p-4">{row.ai}</div></div>)}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="text-sm font-bold text-primary">직접 비교하기</p>
              <h2 className="mt-1 font-heading text-2xl font-black sm:text-3xl">AI 코딩에서 사람의 중요한 역할은?</h2>
              <p className="mt-3 text-muted-foreground">가장 알맞다고 생각하는 답을 골라 보세요.</p>
              <div className="mt-6 grid gap-3">
                {['AI가 만든 결과를 그대로 사용한다.', '원하는 목표를 설명하고 결과를 확인·수정한다.', '코딩과 관련된 모든 일을 AI에게 맡긴다.'].map((answer) => (
                  <button key={answer} onClick={() => setChoice(answer)} className={`flex min-h-14 items-center gap-3 rounded-2xl border p-4 text-left text-sm font-bold transition-colors ${choice === answer ? 'border-primary bg-secondary ring-2 ring-primary/15' : 'hover:bg-muted/60'}`}><span className={`size-4 rounded-full border-2 ${choice === answer ? 'border-primary bg-primary ring-2 ring-white' : 'border-stone-300'}`} />{answer}</button>
                ))}
              </div>
              {choice && <div className={`mt-4 rounded-2xl p-4 text-sm font-bold ${choice.includes('확인·수정') ? 'bg-emerald-50 text-emerald-800' : 'bg-orange-50 text-orange-800'}`}>{choice.includes('확인·수정') ? '맞아요! AI 코딩에서도 목표 설정과 확인은 사람의 몫이에요.' : '다시 생각해 볼까요? AI가 만든 결과도 틀릴 수 있어요.'}</div>}
            </div>
          )}

          {step === 4 && (
            <div className="text-center">
              <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-emerald-100 text-emerald-700"><CheckCircle2 className="size-8" /></div>
              <Badge className="mt-5 bg-emerald-100 text-emerald-800 hover:bg-emerald-100"><Sparkles data-icon="inline-start" />배움 확인</Badge>
              <h2 className="mt-3 font-heading text-2xl font-black sm:text-3xl">2차시를 모두 살펴봤어요!</h2>
              <p className="mx-auto mt-3 max-w-lg leading-7 text-muted-foreground">AI 코딩은 사람과 AI가 함께 만드는 과정이에요. 사람은 목표를 정하고, 결과를 확인하며, 더 좋은 방향으로 수정합니다.</p>
              <div className="mx-auto mt-7 max-w-md rounded-2xl border bg-muted/50 p-5 text-left"><p className="flex items-center gap-2 font-extrabold"><ListChecks className="size-5 text-primary" />오늘의 핵심</p><ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground"><li>• AI에게 원하는 결과를 구체적으로 설명해요.</li><li>• AI가 만든 결과를 직접 실행하고 확인해요.</li><li>• 문제가 있으면 다시 지시해 고쳐요.</li></ul></div>
            </div>
          )}

          <div className="mt-10 flex items-center justify-between border-t pt-5">
            <Button variant="outline" disabled={step === 1} onClick={() => setStep((value) => Math.max(1, value - 1))}><ArrowLeft data-icon="inline-start" />이전</Button>
            {step < 4 ? <Button onClick={() => setStep((value) => Math.min(4, value + 1))}>다음 단계<ArrowRight data-icon="inline-end" /></Button> : <a href="/" className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground"><Save className="size-4" />완료하고 홈으로</a>}
          </div>
        </section>
      </main>
    </div>
  );
}
