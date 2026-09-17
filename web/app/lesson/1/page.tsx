'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, Bot, Check, CheckCircle2, ChevronDown,
  ChevronUp, CircleHelp, Code2, Cpu, ExternalLink, Gamepad2, History,
  Cloud, CloudOff, Lightbulb, ListChecks, LoaderCircle, MessageSquareText, RotateCcw, Save, Sparkles, Terminal,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress';
import { loadLessonProgress, saveLessonProgress } from '@/lib/lesson-progress';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useStudentSession } from '@/lib/student-auth';

const stepLabels = ['가은이의 명령', '코딩의 발전', '게임 속 이야기', '명령 순서 활동', '배움 확인'];

const timeline = [
  { period: '1940~50년대', name: '기계어', code: '10110000 01100001', description: '컴퓨터가 바로 이해하는 0과 1로 명령했어요.', icon: Cpu, color: 'bg-stone-100 text-stone-700' },
  { period: '1950년대~', name: '어셈블리어', code: 'MOV AX, 1', description: '숫자 명령에 짧은 영어 이름을 붙여 조금 더 읽기 쉬워졌어요.', icon: Terminal, color: 'bg-blue-100 text-blue-700' },
  { period: '1970년대~', name: '고급 언어', code: 'printf("Hello");', description: 'C처럼 사람이 이해하기 쉬운 문법으로 복잡한 프로그램을 만들었어요.', icon: Code2, color: 'bg-violet-100 text-violet-700' },
  { period: '2000년대~', name: '블록 코딩', code: '앞으로 10만큼 움직이기', description: '명령 블록을 조립하며 문법 실수를 줄일 수 있게 되었어요.', icon: ListChecks, color: 'bg-orange-100 text-orange-700' },
  { period: '오늘날', name: 'AI 코딩', code: '퀴즈 앱을 만들어 줘', description: '일상 언어로 목표를 설명하고 AI와 대화하며 프로그램을 만들어요.', icon: Sparkles, color: 'bg-teal-100 text-teal-700' },
];

const correctOrder = ['컵을 준비한다.', '주스 통의 뚜껑을 연다.', '컵에 주스를 따른다.', '주스 통의 뚜껑을 닫는다.'];
const initialOrder = ['컵에 주스를 따른다.', '주스 통의 뚜껑을 닫는다.', '컵을 준비한다.', '주스 통의 뚜껑을 연다.'];

const quizItems = [
  { question: '컴퓨터가 직접 이해하는 0과 1로 이루어진 언어는 무엇일까요?', options: ['기계어', '블록 코딩', 'AI 코딩'], answer: '기계어' },
  { question: '프로그래밍 언어가 계속 발전한 가장 큰 이유는 무엇일까요?', options: ['컴퓨터를 더 무겁게 만들기 위해', '사람이 더 쉽고 정확하게 명령하기 위해', '명령을 숨기기 위해'], answer: '사람이 더 쉽고 정확하게 명령하기 위해' },
];

export default function LessonOnePage() {
  const { loading: authLoading } = useStudentSession();
  const [step, setStep] = useState(1);
  const [robotChoice, setRobotChoice] = useState<string | null>(null);
  const [order, setOrder] = useState(initialOrder);
  const [orderChecked, setOrderChecked] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizChecked, setQuizChecked] = useState(false);
  const [reflection, setReflection] = useState('');
  const [saveState, setSaveState] = useState<'loading' | 'ready' | 'saving' | 'saved' | 'error' | 'offline'>(isSupabaseConfigured ? 'loading' : 'offline');

  const progress = step * 20;
  const orderIsCorrect = order.every((item, index) => item === correctOrder[index]);
  const quizScore = useMemo(() => quizItems.filter((item, index) => quizAnswers[index] === item.answer).length, [quizAnswers]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    loadLessonProgress(1)
      .then((saved) => {
        if (saved) {
          setStep(Math.max(1, Math.min(5, saved.currentStep)));
          setReflection(saved.reflection);
        }
        setSaveState('ready');
      })
      .catch(() => setSaveState('error'));
  }, []);

  async function saveCurrentProgress(completed = false) {
    setSaveState('saving');
    try {
      await saveLessonProgress({ lessonNo: 1, currentStep: step, quizScore: quizChecked ? quizScore : null, reflection, completed });
      setSaveState('saved');
      return true;
    } catch {
      setSaveState('error');
      return false;
    }
  }

  async function finishLesson() {
    const saved = await saveCurrentProgress(true);
    if (saved) window.location.href = '/';
  }

  function moveItem(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= order.length) return;
    const next = [...order];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    setOrder(next);
    setOrderChecked(false);
  }

  if (authLoading) return <div className="grid min-h-screen place-items-center bg-background"><p className="font-bold text-muted-foreground">학생 정보를 확인하는 중...</p></div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2 text-sm font-extrabold"><ArrowLeft className="size-4" />수업 홈</a>
          <div className="hidden items-center gap-2 sm:flex"><Code2 className="size-5 text-primary" /><span className="font-black">AI 코딩 교실</span></div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 text-xs font-bold text-muted-foreground sm:flex">
              {saveState === 'saving' || saveState === 'loading' ? <LoaderCircle className="size-3.5 animate-spin" /> : saveState === 'offline' || saveState === 'error' ? <CloudOff className="size-3.5" /> : <Cloud className="size-3.5" />}
              {saveState === 'saving' ? '저장 중' : saveState === 'saved' ? '저장됨' : saveState === 'offline' ? '연결 준비 중' : saveState === 'error' ? '저장 확인 필요' : '온라인 저장'}
            </span>
            <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground">1차시 · 약 40분</span>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:py-9">
        <aside>
          <div className="sticky top-24 rounded-3xl border bg-card p-5 shadow-sm">
            <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">1차시</Badge>
            <h1 className="mt-3 font-heading text-xl font-black leading-7">코딩은 어떻게 발전해 왔을까?</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">컴퓨터에게 명령하는 방법이 어떻게 쉬워졌는지 알아봐요.</p>
            <Progress value={progress} className="mt-5"><ProgressLabel>학습 진행</ProgressLabel><ProgressValue>{progress}%</ProgressValue></Progress>
            <ol className="mt-6 space-y-2">
              {stepLabels.map((item, index) => (
                <li key={item} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold ${step === index + 1 ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground'}`}>
                  <span className={`grid size-6 shrink-0 place-items-center rounded-full text-xs ${step > index + 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-muted'}`}>{step > index + 1 ? <Check className="size-3.5" /> : index + 1}</span>{item}
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <section className="min-w-0 rounded-3xl border bg-card p-5 shadow-sm sm:p-8">
          {step === 1 && (
            <div>
              <div className="grid size-12 place-items-center rounded-2xl bg-orange-100 text-orange-700"><Bot className="size-6" /></div>
              <p className="mt-6 text-sm font-bold text-primary">생각 열기</p>
              <h2 className="mt-1 font-heading text-2xl font-black tracking-tight sm:text-3xl">가은이의 로봇은 왜 멈췄을까요?</h2>
              <div className="mt-5 rounded-2xl border bg-orange-50/70 p-5 sm:p-6">
                <p className="text-base leading-8 text-orange-950">가은이는 책상 위 로봇에게 “저기 있는 연필 좀 가져와!”라고 말했습니다. 하지만 로봇은 움직이지 않았어요. 로봇에게는 <strong>‘저기’가 어디인지, 어떤 연필인지, 어떻게 가져올지</strong>가 정해져 있지 않았기 때문입니다.</p>
              </div>
              <h3 className="mt-7 text-lg font-black">로봇이 가장 잘 이해할 명령을 골라 보세요.</h3>
              <div className="mt-4 grid gap-3">
                {['연필 좀 가져와.', '알아서 연필을 찾아 줘.', '앞으로 세 칸 이동하고, 오른쪽으로 돌아 빨간 연필을 집어.'].map((choice) => (
                  <button key={choice} onClick={() => setRobotChoice(choice)} className={`flex min-h-14 items-center gap-3 rounded-2xl border p-4 text-left text-base font-bold transition-colors ${robotChoice === choice ? 'border-primary bg-secondary ring-2 ring-primary/15' : 'hover:bg-muted/60'}`}>
                    <span className={`size-4 shrink-0 rounded-full border-2 ${robotChoice === choice ? 'border-primary bg-primary ring-2 ring-white' : 'border-stone-300'}`} />{choice}
                  </button>
                ))}
              </div>
              {robotChoice && <div className={`mt-4 rounded-2xl p-4 text-sm font-bold leading-6 ${robotChoice.startsWith('앞으로') ? 'bg-emerald-50 text-emerald-800' : 'bg-orange-50 text-orange-800'}`}>{robotChoice.startsWith('앞으로') ? '좋아요! 컴퓨터는 위치, 순서, 대상을 구체적으로 알려 줄수록 정확하게 움직여요.' : '“어디로, 몇 칸, 무엇을” 해야 하는지 더 구체적으로 알려 주세요.'}</div>}
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="grid size-12 place-items-center rounded-2xl bg-blue-100 text-blue-700"><History className="size-6" /></div>
              <p className="mt-6 text-sm font-bold text-primary">핵심 개념</p>
              <h2 className="mt-1 font-heading text-2xl font-black sm:text-3xl">사람에게 더 쉬운 언어로 발전했어요</h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">코딩의 역사는 컴퓨터에게 명령하는 방법을 더 쉽고 정확하게 바꾸어 온 과정이에요.</p>
              <div className="mt-7 space-y-3">
                {timeline.map((item) => (
                  <article key={item.name} className="grid gap-4 rounded-2xl border p-4 sm:grid-cols-[120px_48px_1fr] sm:items-center">
                    <div><p className="text-xs font-bold text-muted-foreground">{item.period}</p><p className="mt-1 text-lg font-black">{item.name}</p></div>
                    <div className={`grid size-12 place-items-center rounded-2xl ${item.color}`}><item.icon className="size-5" /></div>
                    <div><code className="inline-block rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm text-teal-200">{item.code}</code><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p></div>
                  </article>
                ))}
              </div>
              <div className="mt-6 flex gap-3 rounded-2xl bg-teal-50 p-5 text-teal-950"><Lightbulb className="mt-0.5 size-5 shrink-0 text-teal-700" /><p className="text-sm leading-6"><strong>중요:</strong> 새로운 언어가 생겨도 이전 언어가 완전히 사라지는 것은 아니에요. 목적에 따라 여러 언어를 함께 사용합니다.</p></div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="grid size-12 place-items-center rounded-2xl bg-violet-100 text-violet-700"><Gamepad2 className="size-6" /></div>
              <p className="mt-6 text-sm font-bold text-primary">흥미로운 실제 사례</p>
              <h2 className="mt-1 font-heading text-2xl font-black sm:text-3xl">복잡한 놀이공원을 낮은 수준의 언어로 만들다</h2>
              <div className="mt-6 overflow-hidden rounded-3xl border bg-gradient-to-br from-violet-950 to-slate-900 p-6 text-white sm:p-8">
                <Badge className="bg-white/15 text-white hover:bg-white/15">1999년 출시</Badge>
                <h3 className="mt-4 text-2xl font-black">롤러코스터 타이쿤</h3>
                <p className="mt-3 max-w-2xl text-base leading-8 text-violet-100">개발자 크리스 소이어는 수많은 손님과 놀이기구가 동시에 움직이는 게임을 당시의 컴퓨터에서도 빠르게 실행하려고 했어요. 공식 설명에 따르면 게임 코드는 <strong className="text-white">99%가 x86 어셈블리어</strong>로 작성되었고, Windows와 DirectX를 연결하는 작은 부분에 C가 사용됐습니다.</p>
                <a href="https://www.chrissawyergames.com/faq.htm" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-violet-200 underline decoration-violet-400 underline-offset-4">크리스 소이어 공식 FAQ 열기<ExternalLink className="size-4" /></a>
                <p className="mt-2 text-xs leading-5 text-violet-200/80">FAQ에서 ‘Chris Sawyer / Game Development’를 선택하면 개발 언어 설명을 확인할 수 있어요.</p>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border p-5"><p className="font-black">왜 놀라운가요?</p><p className="mt-2 text-sm leading-7 text-muted-foreground">어셈블리어는 컴퓨터의 동작을 아주 세밀하게 지시할 수 있지만, 긴 프로그램을 만들고 고치기가 어렵습니다.</p></div>
                <div className="rounded-2xl border p-5"><p className="font-black">오늘날에는?</p><p className="mt-2 text-sm leading-7 text-muted-foreground">사람이 이해하기 쉬운 언어와 AI 도구를 사용해 더 빠르게 만들고, 필요한 부분만 세밀하게 조정할 수 있습니다.</p></div>
              </div>
              <div className="mt-6 rounded-2xl bg-orange-50 p-5"><p className="flex items-center gap-2 font-black text-orange-950"><CircleHelp className="size-5 text-orange-600" />생각해 보기</p><p className="mt-2 text-sm leading-7 text-orange-900/85">“쉽게 코딩할 수 있다”는 것과 “좋은 프로그램을 만들 수 있다”는 같은 뜻일까요? 좋은 프로그램을 위해 사람에게 필요한 능력을 친구와 이야기해 보세요.</p></div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="grid size-12 place-items-center rounded-2xl bg-orange-100 text-orange-700"><ListChecks className="size-6" /></div>
              <p className="mt-6 text-sm font-bold text-primary">직접 해 보기</p>
              <h2 className="mt-1 font-heading text-2xl font-black sm:text-3xl">로봇에게 주스 따르는 순서를 알려 주세요</h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">위·아래 버튼으로 명령을 올바른 순서로 바꿔 보세요. 컴퓨터는 적힌 순서대로만 움직입니다.</p>
              <ol className="mt-6 space-y-3">
                {order.map((item, index) => (
                  <li key={item} className="flex items-center gap-3 rounded-2xl border bg-background p-3 sm:p-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-secondary text-sm font-black text-secondary-foreground">{index + 1}</span>
                    <span className="min-w-0 flex-1 text-base font-bold">{item}</span>
                    <div className="flex shrink-0 gap-1"><Button variant="outline" size="icon-sm" disabled={index === 0} onClick={() => moveItem(index, -1)} aria-label={`${item} 위로 이동`}><ChevronUp /></Button><Button variant="outline" size="icon-sm" disabled={index === order.length - 1} onClick={() => moveItem(index, 1)} aria-label={`${item} 아래로 이동`}><ChevronDown /></Button></div>
                  </li>
                ))}
              </ol>
              <div className="mt-5 flex flex-wrap gap-2"><Button onClick={() => setOrderChecked(true)}>순서 확인하기</Button><Button variant="outline" onClick={() => { setOrder(initialOrder); setOrderChecked(false); }}><RotateCcw data-icon="inline-start" />처음부터</Button></div>
              {orderChecked && <div className={`mt-4 rounded-2xl p-4 text-sm font-bold leading-6 ${orderIsCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-orange-50 text-orange-800'}`}>{orderIsCorrect ? '정확해요! 필요한 준비부터 마무리까지 순서대로 명령했습니다.' : '아직 순서가 어색해요. 컵을 먼저 준비하고, 뚜껑을 연 뒤 주스를 따라야 해요.'}</div>}
            </div>
          )}

          {step === 5 && (
            <div>
              <div className="grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><CheckCircle2 className="size-6" /></div>
              <p className="mt-6 text-sm font-bold text-primary">배움 확인</p>
              <h2 className="mt-1 font-heading text-2xl font-black sm:text-3xl">오늘 배운 내용을 확인해요</h2>
              <div className="mt-7 space-y-7">
                {quizItems.map((item, index) => (
                  <fieldset key={item.question}><legend className="text-base font-black leading-7">{index + 1}. {item.question}</legend><div className="mt-3 grid gap-2">{item.options.map((option) => (
                    <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm font-bold ${quizAnswers[index] === option ? 'border-primary bg-secondary' : 'hover:bg-muted/50'}`}><input type="radio" name={`quiz-${index}`} value={option} checked={quizAnswers[index] === option} onChange={() => { setQuizAnswers((current) => ({ ...current, [index]: option })); setQuizChecked(false); }} className="accent-teal-700" />{option}</label>
                  ))}</div></fieldset>
                ))}
              </div>
              <Button className="mt-6" disabled={Object.keys(quizAnswers).length < quizItems.length} onClick={() => setQuizChecked(true)}>정답 확인하기</Button>
              {quizChecked && <div className={`mt-4 rounded-2xl p-4 text-sm font-bold ${quizScore === quizItems.length ? 'bg-emerald-50 text-emerald-800' : 'bg-orange-50 text-orange-800'}`}>{quizScore === quizItems.length ? '2문제를 모두 맞혔어요! 코딩 언어의 변화가 잘 이해되었네요.' : `${quizItems.length}문제 중 ${quizScore}문제를 맞혔어요. 코딩 언어는 사람이 더 쉽고 정확하게 명령하도록 발전했다는 점을 다시 살펴보세요.`}</div>}
              <div className="mt-8 rounded-2xl border bg-muted/40 p-5"><label htmlFor="reflection" className="flex items-center gap-2 font-black"><MessageSquareText className="size-5 text-primary" />오늘의 배움을 한 문장으로 적어 보세요.</label><textarea id="reflection" value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="예: 코딩 언어는 컴퓨터에게 더 쉽게 명령하기 위해 발전해 왔다." className="mt-3 min-h-24 w-full resize-y rounded-xl border bg-card p-3 text-base leading-7 outline-none focus:border-primary focus:ring-3 focus:ring-primary/15" maxLength={160} /><p className="mt-2 text-right text-xs text-muted-foreground">{reflection.length} / 160자</p></div>
              {quizChecked && quizScore === 2 && reflection.trim().length >= 10 && <div className="mt-6 rounded-3xl bg-gradient-to-r from-teal-700 to-teal-600 p-6 text-center text-white"><Sparkles className="mx-auto size-7 text-orange-200" /><p className="mt-2 text-xl font-black">첫걸음 탐험가 배지 획득!</p><p className="mt-1 text-sm text-teal-50">1차시의 모든 활동을 마쳤습니다.</p></div>}
            </div>
          )}

          <div className="mt-10 flex items-center justify-between border-t pt-5">
            <Button variant="outline" disabled={step === 1} onClick={() => setStep((value) => Math.max(1, value - 1))}><ArrowLeft data-icon="inline-start" />이전</Button>
            {step < 5 ? <Button onClick={() => { const nextStep = Math.min(5, step + 1); setStep(nextStep); if (isSupabaseConfigured) void saveCurrentProgress(false); }}>다음 단계<ArrowRight data-icon="inline-end" /></Button> : <Button onClick={finishLesson} disabled={saveState === 'saving' || !quizChecked || quizScore !== 2 || reflection.trim().length < 10}><Save data-icon="inline-start" />완료하고 저장</Button>}
          </div>
        </section>
      </main>
    </div>
  );
}
