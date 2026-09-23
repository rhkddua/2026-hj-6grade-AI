'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Bot, Check, CheckCircle2, ChevronDown,
  ChevronUp, Cloud, CloudOff, Code2, Cpu, ExternalLink, Calculator,
  Flag, Gamepad2, History, Lightbulb, ListChecks, LoaderCircle,
  MessageSquareText, RotateCcw, Save, Sparkles, Terminal,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress';
import { loadLessonProgress, saveLessonProgress, type LessonProgress } from '@/lib/lesson-progress';
import { useStudentSession } from '@/lib/student-auth';

const stepLabels = ['가은이의 명령', '코딩의 발전', '게임·수학 코딩 실험실', '명령 순서 활동', '배움 확인'];

const timeline = [
  { period: '1940~50년대', name: '기계어', code: '10110000 01100001', description: '컴퓨터가 바로 이해하는 0과 1로 명령했어요.', icon: Cpu, color: 'bg-stone-100 text-stone-700' },
  { period: '1950년대~', name: '어셈블리어', code: 'MOV AX, 1', description: '숫자 명령에 짧은 영어 이름을 붙여 조금 더 읽기 쉬워졌어요.', icon: Terminal, color: 'bg-blue-100 text-blue-700' },
  { period: '1970년대~', name: '고급 언어', code: 'printf("Hello");', description: 'C처럼 사람이 이해하기 쉬운 문법으로 복잡한 프로그램을 만들었어요.', icon: Code2, color: 'bg-violet-100 text-violet-700' },
  { period: '2000년대~', name: '블록 코딩', code: '앞으로 10만큼 움직이기', description: '명령 블록을 조립하며 문법 실수를 줄일 수 있게 되었어요.', icon: ListChecks, color: 'bg-orange-100 text-orange-700' },
  { period: '오늘날', name: 'AI 코딩', code: '퀴즈 앱을 만들어 줘', description: '일상 언어로 목표를 설명하고 AI와 대화하며 프로그램을 만들어요.', icon: Sparkles, color: 'bg-teal-100 text-teal-700' },
];

const robotChoices = ['연필 좀 가져와.', '알아서 연필을 찾아 줘.', '앞으로 세 칸 이동하고, 오른쪽으로 돌아 빨간 연필을 집어.'];
const correctOrder = ['컵을 준비한다.', '주스 통의 뚜껑을 연다.', '컵에 주스를 따른다.', '주스 통의 뚜껑을 닫는다.'];
const initialOrder = ['컵에 주스를 따른다.', '주스 통의 뚜껑을 닫는다.', '컵을 준비한다.', '주스 통의 뚜껑을 연다.'];

const languageRounds = [
  {
    name: '기계어', icon: Cpu, accent: 'bg-stone-100 text-stone-700',
    prompt: '0과 1로 된 명령 두 개를 골라 오른쪽으로 2칸 이동해요.',
    hint: '0001은 오른쪽 1칸, 0010은 왼쪽 1칸이에요. 오른쪽 명령이 몇 번 필요한지 세어 보세요.',
    options: ['0010 0010', '0001 0001', '0001'], answer: 1,
    success: '0001을 두 번 보내서 오른쪽으로 2칸 이동했어요!',
  },
  {
    name: '어셈블리어', icon: Terminal, accent: 'bg-blue-100 text-blue-700',
    prompt: '짧은 영어 명령으로 오른쪽으로 2칸 이동해요.',
    hint: 'RIGHT는 오른쪽, LEFT는 왼쪽이에요. 마지막 숫자는 움직일 칸 수예요.',
    options: ['MOVE LEFT, 2', 'MOVE RIGHT, 1', 'MOVE RIGHT, 2'], answer: 2,
    success: 'RIGHT와 숫자 2를 사용해 목표에 도착했어요!',
  },
  {
    name: '고급 언어', icon: Code2, accent: 'bg-violet-100 text-violet-700',
    prompt: '사람이 읽기 쉬운 함수 명령으로 오른쪽으로 2칸 이동해요.',
    hint: 'moveRight는 오른쪽 이동이에요. 괄호 안 숫자가 움직일 칸 수예요.',
    options: ['player.moveLeft(2);', 'player.moveRight(2);', 'player.moveRight(1);'], answer: 1,
    success: '함수 이름과 숫자를 읽고 정확한 명령을 골랐어요!',
  },
  {
    name: '블록 코딩', icon: ListChecks, accent: 'bg-orange-100 text-orange-700',
    prompt: '말처럼 적힌 블록을 골라 오른쪽으로 2칸 이동해요.',
    hint: '방향과 칸 수가 목표와 모두 같은 블록을 찾으면 돼요.',
    options: ['왼쪽으로 2칸 움직이기', '오른쪽으로 2칸 움직이기', '오른쪽으로 1칸 움직이기'], answer: 1,
    success: '블록에 적힌 뜻을 바로 읽고 목표에 도착했어요!',
  },
] as const;

const mathRounds = [
  {
    name: '기계어', icon: Cpu, accent: 'bg-stone-100 text-stone-700',
    prompt: '수업용 기계어로 3을 불러오고, 2를 더한 뒤 결과를 보여 주세요.',
    hint: '0001은 숫자 불러오기, 0010은 더하기, 1111은 결과 보여 주기예요. 명령과 숫자를 한 줄씩 띄어 써요.',
    placeholder: '0001 0011\n0010 0010\n1111 0000',
    guide: ['0001 0011  →  숫자 3 불러오기', '0010 0010  →  숫자 2 더하기', '1111 0000  →  결과 보여 주기'],
  },
  {
    name: '어셈블리어', icon: Terminal, accent: 'bg-blue-100 text-blue-700',
    prompt: '짧은 영어 명령으로 같은 계산을 해 보세요.',
    hint: 'LOAD는 숫자 불러오기, ADD는 더하기, PRINT는 결과 보여 주기예요. 세 명령을 차례로 입력해요.',
    placeholder: 'LOAD 3\nADD 2\nPRINT',
    guide: ['LOAD 3', 'ADD 2', 'PRINT'],
  },
  {
    name: '고급 언어 · JavaScript', icon: Code2, accent: 'bg-violet-100 text-violet-700',
    prompt: 'JavaScript 한 줄로 3 + 2의 결과를 화면에 보여 주세요.',
    hint: 'console.log(계산식); 모양을 사용해요. 괄호 안에 3 + 2를 넣어 보세요.',
    placeholder: 'console.log(3 + 2);',
    guide: ['console.log(', '3 + 2', ');'],
  },
] as const;

function isMathInputCorrect(index: number, input: string) {
  if (index === 0) {
    return input.trim().split(/\r?\n/).map((line) => line.trim().replace(/\s+/g, ' ')).join('\n')
      === '0001 0011\n0010 0010\n1111 0000';
  }
  if (index === 1) {
    return input.trim().split(/\r?\n/).map((line) => line.trim().replace(/\s+/g, ' ').toUpperCase()).join('\n')
      === 'LOAD 3\nADD 2\nPRINT';
  }
  return /^console\.log\(\s*3\s*\+\s*2\s*\)\s*;?$/i.test(input.trim());
}

const quizItems = [
  { question: '컴퓨터가 직접 이해하는 0과 1로 이루어진 언어는 무엇일까요?', options: ['기계어', '블록 코딩', 'AI 코딩'], answer: '기계어' },
  { question: '프로그래밍 언어가 계속 발전한 가장 큰 이유는 무엇일까요?', options: ['컴퓨터를 더 무겁게 만들기 위해', '사람이 더 쉽고 정확하게 명령하기 위해', '명령을 숨기기 위해'], answer: '사람이 더 쉽고 정확하게 명령하기 위해' },
];

type LessonOneActivities = {
  robotChoice: string | null;
  order: string[];
  orderChecked: boolean;
  gameChoices: Array<number | null>;
  gameChecked: boolean[];
  gameSolved: boolean[];
  activeGameRound: number;
  mathInputs: string[];
  mathChecked: boolean[];
  mathSolved: boolean[];
  quizAnswers: Array<string | null>;
  quizChecked: boolean;
};

const initialActivities: LessonOneActivities = {
  robotChoice: null,
  order: initialOrder,
  orderChecked: false,
  gameChoices: languageRounds.map(() => null),
  gameChecked: languageRounds.map(() => false),
  gameSolved: languageRounds.map(() => false),
  activeGameRound: 0,
  mathInputs: mathRounds.map(() => ''),
  mathChecked: mathRounds.map(() => false),
  mathSolved: mathRounds.map(() => false),
  quizAnswers: quizItems.map(() => null),
  quizChecked: false,
};

function restoreActivities(value: Record<string, unknown> | undefined): LessonOneActivities {
  if (!value) return initialActivities;
  const robotChoice = typeof value.robotChoice === 'string' && robotChoices.includes(value.robotChoice) ? value.robotChoice : null;
  const order = Array.isArray(value.order)
    && value.order.length === correctOrder.length
    && value.order.every((item) => typeof item === 'string' && correctOrder.includes(item))
    && new Set(value.order).size === correctOrder.length
    ? [...value.order] as string[] : initialOrder;
  const gameChoices = Array.isArray(value.gameChoices) && value.gameChoices.length === languageRounds.length
    ? value.gameChoices.map((choice) => typeof choice === 'number' && Number.isInteger(choice) && choice >= 0 && choice <= 2 ? choice : null)
    : languageRounds.map(() => null);
  const gameChecked = Array.isArray(value.gameChecked) && value.gameChecked.length === languageRounds.length
    ? value.gameChecked.map((checked) => checked === true)
    : languageRounds.map(() => false);
  const gameSolved = Array.isArray(value.gameSolved) && value.gameSolved.length === languageRounds.length
    ? value.gameSolved.map((solved, index) => solved === true && gameChoices[index] === languageRounds[index].answer)
    : languageRounds.map(() => false);
  const activeGameRound = typeof value.activeGameRound === 'number' && Number.isInteger(value.activeGameRound)
    ? Math.max(0, Math.min(languageRounds.length - 1, value.activeGameRound)) : 0;
  const mathInputs = Array.isArray(value.mathInputs) && value.mathInputs.length === mathRounds.length
    ? value.mathInputs.map((input) => typeof input === 'string' ? input.slice(0, 120) : '')
    : mathRounds.map(() => '');
  const mathChecked = Array.isArray(value.mathChecked) && value.mathChecked.length === mathRounds.length
    ? value.mathChecked.map((checked) => checked === true)
    : mathRounds.map(() => false);
  const mathSolved = Array.isArray(value.mathSolved) && value.mathSolved.length === mathRounds.length
    ? value.mathSolved.map((solved, index) => solved === true && isMathInputCorrect(index, mathInputs[index]))
    : mathRounds.map(() => false);
  const quizAnswers = Array.isArray(value.quizAnswers) && value.quizAnswers.length === quizItems.length
    ? value.quizAnswers.map((answer, index) => typeof answer === 'string' && quizItems[index].options.includes(answer) ? answer : null)
    : quizItems.map(() => null);
  return {
    robotChoice,
    order,
    orderChecked: value.orderChecked === true,
    gameChoices,
    gameChecked,
    gameSolved,
    activeGameRound,
    mathInputs,
    mathChecked,
    mathSolved,
    quizAnswers,
    quizChecked: value.quizChecked === true,
  };
}

function isLessonComplete(activities: LessonOneActivities, reflection: string) {
  const quizScore = quizItems.filter((item, index) => activities.quizAnswers[index] === item.answer).length;
  return activities.gameSolved.every(Boolean)
    && activities.mathSolved.every(Boolean)
    && activities.quizChecked
    && quizScore === quizItems.length
    && reflection.trim().length >= 10;
}

export default function LessonOnePage() {
  const { user, loading: authLoading } = useStudentSession();
  const [step, setStep] = useState(1);
  const [activities, setActivities] = useState<LessonOneActivities>(initialActivities);
  const [reflection, setReflection] = useState('');
  const [completed, setCompleted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [status, setStatus] = useState('학습 기록을 불러오는 중…');
  const [saveError, setSaveError] = useState(false);
  const [saving, setSaving] = useState(false);
  const userId = user?.id;
  const queue = useRef(Promise.resolve());
  const revision = useRef(0);
  const savedRevision = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  const progress = completed ? 100 : (step - 1) * 20;
  const orderIsCorrect = activities.order.every((item, index) => item === correctOrder[index]);
  const quizScore = useMemo(() => quizItems.filter((item, index) => activities.quizAnswers[index] === item.answer).length, [activities.quizAnswers]);
  const gameComplete = activities.gameSolved.every(Boolean);
  const mathComplete = activities.mathSolved.every(Boolean);
  const requirements = [gameComplete, mathComplete, activities.quizChecked && quizScore === quizItems.length, reflection.trim().length >= 10];
  const snapshot: LessonProgress = useMemo(() => ({
    lessonNo: 1,
    currentStep: step,
    quizScore: activities.quizChecked ? quizScore : null,
    reflection,
    completed,
    activityData: { ...activities },
  }), [step, quizScore, reflection, completed, activities]);
  const latest = useRef(snapshot);

  useEffect(() => { latest.current = snapshot; }, [snapshot]);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    void loadLessonProgress(1, true).then((data) => {
      if (!active) return;
      if (data) {
        const restored = restoreActivities(data.activityData);
        setStep(Math.max(1, Math.min(5, data.currentStep)));
        setActivities(restored);
        setReflection(data.reflection);
        setCompleted(data.completed && isLessonComplete(restored, data.reflection));
      }
      setLoaded(true);
      setStatus(data ? '저장한 학습 기록을 불러왔어요' : '활동을 시작하면 자동으로 저장해요');
    }).catch(() => {
      if (active) {
        setLoadError(true);
        setStatus('학습 기록을 불러오지 못했어요');
      }
    });
    return () => { active = false; };
  }, [userId, loadAttempt]);

  function dirty() {
    revision.current += 1;
    setCompleted(false);
    setStatus('변경 내용을 저장할 예정이에요');
    setSaveError(false);
  }

  function update(patch: Partial<LessonOneActivities>) {
    dirty();
    setActivities((current) => ({ ...current, ...patch }));
  }

  function persist(data: LessonProgress, version: number) {
    if (timer.current) clearTimeout(timer.current);
    setSaving(true);
    setStatus('저장 중…');
    const operation = queue.current.catch(() => {}).then(() => saveLessonProgress(data));
    queue.current = operation.catch(() => {});
    return operation.then(() => {
      savedRevision.current = version;
      if (version === revision.current) setStatus('저장됨');
      return true;
    }).catch(() => {
      if (version === revision.current) {
        setSaveError(true);
        setStatus('저장하지 못했어요. 연결을 확인하고 다시 저장해 주세요.');
      }
      return false;
    }).finally(() => {
      if (version === revision.current) setSaving(false);
    });
  }

  useEffect(() => {
    if (!loaded || revision.current === savedRevision.current) return;
    timer.current = setTimeout(() => { void persist(latest.current, revision.current); }, 800);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [step, activities, reflection, completed, loaded]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (revision.current !== savedRevision.current) event.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, []);

  function go(next: number) {
    if (next === step) return;
    dirty();
    setStep(next);
    window.setTimeout(() => heading.current?.focus(), 0);
  }

  function moveItem(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= activities.order.length) return;
    const next = [...activities.order];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    update({ order: next, orderChecked: false });
  }

  function runGameCommand() {
    const roundIndex = activities.activeGameRound;
    const choice = activities.gameChoices[roundIndex];
    if (choice === null) return;
    const checked = activities.gameChecked.map((value, index) => index === roundIndex ? true : value);
    const solved = activities.gameSolved.map((value, index) => index === roundIndex ? choice === languageRounds[roundIndex].answer : value);
    update({ gameChecked: checked, gameSolved: solved });
  }

  function runMathCommand(index: number) {
    const checked = activities.mathChecked.map((value, itemIndex) => itemIndex === index ? true : value);
    const solved = activities.mathSolved.map((value, itemIndex) => itemIndex === index ? isMathInputCorrect(index, activities.mathInputs[index]) : value);
    update({ mathChecked: checked, mathSolved: solved });
  }

  async function finishLesson() {
    if (!requirements.every(Boolean)) return;
    const version = ++revision.current;
    const success = await persist({ ...latest.current, completed: true }, version);
    if (success && version === revision.current) setCompleted(true);
  }

  async function home() {
    const version = revision.current;
    if (version !== savedRevision.current && !(await persist(latest.current, version))) return;
    if (version === revision.current) window.location.assign('/');
  }

  if (authLoading || (!loaded && !loadError)) {
    return <div className="grid min-h-screen place-items-center bg-background"><output className="font-bold text-muted-foreground">학습 기록을 불러오는 중…</output></div>;
  }

  if (loadError) {
    return <main className="mx-auto max-w-xl space-y-5 p-8"><h1 className="text-2xl font-black">학습 기록을 불러오지 못했어요</h1><p className="leading-7">기존 기록을 보호하기 위해 활동을 시작하지 않았어요. 인터넷 연결을 확인해 주세요.</p><Button onClick={() => { setLoadError(false); setStatus('학습 기록을 다시 불러오는 중…'); setLoadAttempt((value) => value + 1); }}>다시 불러오기</Button><Link href="/" className="ml-5 underline">수업 홈</Link></main>;
  }

  const activeRound = languageRounds[activities.activeGameRound];
  const activeChoice = activities.gameChoices[activities.activeGameRound];
  const activeChecked = activities.gameChecked[activities.activeGameRound];
  const activeSolved = activities.gameSolved[activities.activeGameRound];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex min-h-18 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Button variant="ghost" onClick={() => void home()} disabled={saving}><ArrowLeft />수업 홈</Button>
          <div className="hidden items-center gap-2 sm:flex"><Code2 className="size-5 text-primary" /><span className="font-black">AI 코딩 교실</span></div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <output className="flex items-center gap-1.5 text-sm font-bold text-primary" aria-live="polite">
              {saving ? <LoaderCircle className="size-4 animate-spin" /> : saveError ? <CloudOff className="size-4" /> : <Cloud className="size-4" />}
              {status}
            </output>
            {saveError && <Button variant="outline" size="sm" onClick={() => void persist(latest.current, revision.current)}>다시 저장</Button>}
            <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground">1차시 · 약 40분</span>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:py-9">
        <aside>
          <div className="rounded-3xl border bg-card p-5 shadow-sm lg:sticky lg:top-24">
            <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">1차시</Badge>
            <h1 className="mt-3 font-heading text-xl font-black leading-7">코딩은 어떻게 발전해 왔을까?</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">컴퓨터에게 명령하는 방법이 어떻게 쉬워졌는지 알아봐요.</p>
            <Progress value={progress} className="mt-5"><ProgressLabel>학습 진행</ProgressLabel><ProgressValue /></Progress>
            <nav aria-label="1차시 학습 단계">
              <ol className="mt-6 space-y-2">
                {stepLabels.map((item, index) => (
                  <li key={item}>
                    <button onClick={() => go(index + 1)} aria-current={step === index + 1 ? 'step' : undefined} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold focus-visible:ring-2 focus-visible:ring-primary ${step === index + 1 ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                      <span className={`grid size-6 shrink-0 place-items-center rounded-full text-xs ${step > index + 1 || completed ? 'bg-emerald-100 text-emerald-700' : 'bg-muted'}`}>{step > index + 1 || completed ? <Check className="size-3.5" /> : index + 1}</span>{item}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </aside>

        <section className="min-w-0 rounded-3xl border bg-card p-5 shadow-sm sm:p-8">
          <p className="text-sm font-bold text-primary">STEP {step} / 5</p>
          {step === 1 && (
            <div>
              <div className="mt-3 grid size-12 place-items-center rounded-2xl bg-orange-100 text-orange-700"><Bot className="size-6" /></div>
              <h2 ref={heading} tabIndex={-1} className="mt-5 font-heading text-2xl font-black tracking-tight outline-none sm:text-3xl">가은이의 로봇은 왜 멈췄을까요?</h2>
              <div className="mt-5 rounded-2xl border bg-orange-50/70 p-5 sm:p-6"><p className="text-base leading-8 text-orange-950">가은이는 책상 위 로봇에게 “저기 있는 연필 좀 가져와!”라고 말했습니다. 하지만 로봇은 움직이지 않았어요. 로봇에게는 <strong>‘저기’가 어디인지, 어떤 연필인지, 어떻게 가져올지</strong>가 정해져 있지 않았기 때문입니다.</p></div>
              <fieldset className="mt-7"><legend className="text-lg font-black">로봇이 가장 잘 이해할 명령을 골라 보세요.</legend><div className="mt-4 grid gap-3">{robotChoices.map((choice) => <label key={choice} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border p-4 text-left text-base font-bold transition-colors ${activities.robotChoice === choice ? 'border-primary bg-secondary ring-2 ring-primary/15' : 'hover:bg-muted/60'}`}><input type="radio" name="robot-choice" value={choice} checked={activities.robotChoice === choice} onChange={() => update({ robotChoice: choice })} className="accent-teal-700" />{choice}</label>)}</div></fieldset>
              {activities.robotChoice && <output className={`mt-4 block rounded-2xl p-4 text-sm font-bold leading-6 ${activities.robotChoice.startsWith('앞으로') ? 'bg-emerald-50 text-emerald-800' : 'bg-orange-50 text-orange-800'}`}>{activities.robotChoice.startsWith('앞으로') ? '좋아요! 컴퓨터는 위치, 순서, 대상을 구체적으로 알려 줄수록 정확하게 움직여요.' : '“어디로, 몇 칸, 무엇을” 해야 하는지 더 구체적으로 알려 주세요.'}</output>}
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="mt-3 grid size-12 place-items-center rounded-2xl bg-blue-100 text-blue-700"><History className="size-6" /></div>
              <h2 ref={heading} tabIndex={-1} className="mt-5 font-heading text-2xl font-black outline-none sm:text-3xl">사람에게 더 쉬운 언어로 발전했어요</h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">코딩의 역사는 컴퓨터에게 명령하는 방법을 더 쉽고 정확하게 바꾸어 온 과정이에요.</p>
              <div className="mt-7 space-y-3">{timeline.map((item) => <article key={item.name} className="grid gap-4 rounded-2xl border p-4 sm:grid-cols-[120px_48px_1fr] sm:items-center"><div><p className="text-xs font-bold text-muted-foreground">{item.period}</p><p className="mt-1 text-lg font-black">{item.name}</p></div><div className={`grid size-12 place-items-center rounded-2xl ${item.color}`}><item.icon className="size-5" /></div><div><code className="inline-block max-w-full overflow-x-auto rounded-lg bg-slate-900 px-2.5 py-1.5 text-sm text-teal-200">{item.code}</code><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p></div></article>)}</div>
              <div className="mt-6 flex gap-3 rounded-2xl bg-teal-50 p-5 text-teal-950"><Lightbulb className="mt-0.5 size-5 shrink-0 text-teal-700" /><p className="text-sm leading-6"><strong>중요:</strong> 새로운 언어가 생겨도 이전 언어가 완전히 사라지는 것은 아니에요. 목적에 따라 여러 언어를 함께 사용합니다.</p></div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="mt-3 grid size-12 place-items-center rounded-2xl bg-violet-100 text-violet-700"><Gamepad2 className="size-6" /></div>
              <h2 ref={heading} tabIndex={-1} className="mt-5 font-heading text-2xl font-black outline-none sm:text-3xl">캐릭터를 움직이고 수학을 계산해요</h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">먼저 네 가지 언어로 캐릭터를 움직인 뒤, 세 가지 언어를 직접 입력해 3 + 2를 계산해 보세요. 모든 활동에 예시와 힌트가 있어요.</p>
              <div className="mt-6 rounded-2xl border bg-violet-50/60 p-5"><p className="font-black text-violet-950">게임 속 실제 이야기</p><p className="mt-2 text-sm leading-7 text-violet-950/85">1999년에 나온 ‘롤러코스터 타이쿤’은 많은 손님과 놀이기구를 빠르게 움직이기 위해 코드의 대부분을 x86 어셈블리어로 만들었어요. 언어마다 장점과 쓰임이 다르다는 사례예요.</p><a href="https://www.chrissawyergames.com/faq.htm" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-violet-800 underline decoration-violet-400 underline-offset-4">개발자 공식 FAQ 열기<ExternalLink className="size-4" /></a></div>
              <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4" role="tablist" aria-label="게임 언어 선택">{languageRounds.map((round, index) => <button key={round.name} type="button" role="tab" aria-selected={activities.activeGameRound === index} onClick={() => update({ activeGameRound: index })} className={`rounded-2xl border px-3 py-3 text-sm font-black focus-visible:ring-2 focus-visible:ring-primary ${activities.activeGameRound === index ? 'border-primary bg-secondary text-secondary-foreground' : 'hover:bg-muted'}`}><span className="flex items-center justify-center gap-1.5">{activities.gameSolved[index] ? <CheckCircle2 className="size-4 text-emerald-700" /> : <round.icon className="size-4" />}{index + 1}. {round.name}</span></button>)}</div>
              <div role="tabpanel" className="mt-4 rounded-3xl border-2 border-primary/20 p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><span className={`grid size-11 place-items-center rounded-2xl ${activeRound.accent}`}><activeRound.icon className="size-5" /></span><div><p className="text-sm font-bold text-muted-foreground">언어 {activities.activeGameRound + 1} / 4</p><h3 className="text-xl font-black">{activeRound.name}</h3></div></div><Badge variant="outline">완료 {activities.gameSolved.filter(Boolean).length} / 4</Badge></div>
                <p className="mt-5 text-base font-bold leading-7">{activeRound.prompt}</p>
                <div className="mt-4 grid grid-cols-3 gap-2" aria-label="캐릭터 이동판">{[0, 1, 2].map((cell) => { const characterCell = activeSolved ? 2 : 0; return <div key={cell} className={`grid min-h-20 place-items-center rounded-2xl border-2 ${cell === 2 ? 'border-emerald-300 bg-emerald-50' : 'border-dashed bg-muted/40'}`}>{cell === characterCell ? <span className="flex flex-col items-center gap-1 text-sm font-black text-primary"><Bot className="size-7" />캐릭터</span> : cell === 2 ? <span className="flex flex-col items-center gap-1 text-sm font-black text-emerald-800"><Flag className="size-7" />목표</span> : <span className="text-sm font-bold text-muted-foreground">한 칸</span>}</div>; })}</div>
                <div className="mt-4 flex gap-3 rounded-2xl bg-amber-50 p-4 text-amber-950"><Lightbulb className="mt-0.5 size-5 shrink-0 text-amber-600" /><p className="text-sm leading-6"><strong>힌트:</strong> {activeRound.hint}</p></div>
                <fieldset className="mt-5"><legend className="font-black">실행할 명령을 하나 고르세요.</legend><div className="mt-3 grid gap-2">{activeRound.options.map((option, optionIndex) => <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 font-bold ${activeChoice === optionIndex ? 'border-primary bg-secondary' : 'hover:bg-muted/50'}`}><input type="radio" name={`game-command-${activities.activeGameRound}`} checked={activeChoice === optionIndex} onChange={() => { const choices = activities.gameChoices.map((choice, index) => index === activities.activeGameRound ? optionIndex : choice); const checked = activities.gameChecked.map((value, index) => index === activities.activeGameRound ? false : value); const solved = activities.gameSolved.map((value, index) => index === activities.activeGameRound ? false : value); update({ gameChoices: choices, gameChecked: checked, gameSolved: solved }); }} className="accent-teal-700" /><code className="min-w-0 break-words text-sm sm:text-base">{option}</code></label>)}</div></fieldset>
                <div className="mt-4 flex flex-wrap gap-2"><Button disabled={activeChoice === null} onClick={runGameCommand}><Gamepad2 />명령 실행</Button>{activeSolved && activities.activeGameRound < languageRounds.length - 1 && <Button variant="outline" onClick={() => update({ activeGameRound: activities.activeGameRound + 1 })}>다음 언어<ArrowRight /></Button>}</div>
                {activeChecked && <output aria-live="polite" className={`mt-4 block rounded-2xl p-4 text-sm font-bold leading-6 ${activeSolved ? 'bg-emerald-50 text-emerald-800' : 'bg-orange-50 text-orange-800'}`}>{activeSolved ? activeRound.success : `아직 출발점이에요. ${activeRound.hint}`}</output>}
              </div>
              {gameComplete && <output className="mt-5 block rounded-2xl bg-teal-50 p-5 text-teal-950"><span className="font-black">네 언어 탐험 완료!</span><span className="mt-1 block text-sm leading-6">같은 움직임도 기계어는 0과 1, 어셈블리어는 짧은 영어, 고급 언어는 함수, 블록 코딩은 뜻이 보이는 블록으로 나타낼 수 있어요.</span></output>}

              <section className="mt-9 border-t pt-8" aria-labelledby="math-lab-title">
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><Calculator className="size-5" /></span>
                  <div><p className="text-sm font-bold text-emerald-700">직접 입력 활동</p><h3 id="math-lab-title" className="text-xl font-black sm:text-2xl">세 가지 언어로 3 + 2 계산하기</h3></div>
                </div>
                <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-950"><strong>수업용 약속:</strong> 실제 컴퓨터마다 기계어 명령은 달라요. 여기서는 원리를 쉽게 비교하기 위해 아래의 간단한 기계어 약속을 사용해요. 입력한 문장은 실행하지 않고, 약속한 모양인지 안전하게 확인합니다.</div>
                <div className="mt-5 space-y-5">
                  {mathRounds.map((round, index) => {
                    const RoundIcon = round.icon;
                    const checked = activities.mathChecked[index];
                    const solved = activities.mathSolved[index];
                    return (
                      <article key={round.name} className="rounded-3xl border p-4 sm:p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><span className={`grid size-10 place-items-center rounded-xl ${round.accent}`}><RoundIcon className="size-5" /></span><div><p className="text-xs font-bold text-muted-foreground">계산 미션 {index + 1} / 3</p><h4 className="text-lg font-black">{round.name}</h4></div></div>{solved && <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100"><CheckCircle2 />5 계산 완료</Badge>}</div>
                        <p className="mt-4 text-base font-bold leading-7">{round.prompt}</p>
                        <div className="mt-3 flex gap-3 rounded-2xl bg-amber-50 p-4 text-amber-950"><Lightbulb className="mt-0.5 size-5 shrink-0 text-amber-600" /><div className="min-w-0"><p className="text-sm leading-6"><strong>힌트:</strong> {round.hint}</p><div className="mt-2 flex flex-wrap gap-2">{round.guide.map((item) => <code key={item} className="rounded-lg bg-white/80 px-2 py-1 text-xs sm:text-sm">{item}</code>)}</div></div></div>
                        <label htmlFor={`math-input-${index}`} className="mt-4 block text-sm font-black">명령을 직접 입력하세요.</label>
                        <textarea id={`math-input-${index}`} value={activities.mathInputs[index]} onChange={(event) => { const inputs = activities.mathInputs.map((input, itemIndex) => itemIndex === index ? event.target.value : input); const nextChecked = activities.mathChecked.map((value, itemIndex) => itemIndex === index ? false : value); const nextSolved = activities.mathSolved.map((value, itemIndex) => itemIndex === index ? false : value); update({ mathInputs: inputs, mathChecked: nextChecked, mathSolved: nextSolved }); }} placeholder={round.placeholder} spellCheck={false} autoCapitalize="off" className="mt-2 min-h-24 w-full resize-y rounded-xl border bg-slate-950 p-3 font-mono text-base leading-7 text-teal-200 outline-none focus:border-primary focus:ring-3 focus:ring-primary/15" maxLength={120} />
                        <Button className="mt-3" disabled={!activities.mathInputs[index].trim()} onClick={() => runMathCommand(index)}><Calculator />계산하기</Button>
                        {checked && <output aria-live="polite" className={`mt-3 block rounded-2xl p-4 text-sm font-bold leading-6 ${solved ? 'bg-emerald-50 text-emerald-800' : 'bg-orange-50 text-orange-800'}`}>{solved ? `정확해요! ${round.name} 명령으로 3 + 2 = 5를 계산했어요.` : `아직 결과가 나오지 않았어요. 힌트의 명령을 순서와 기호까지 살펴보고 다시 입력해 보세요.`}</output>}
                      </article>
                    );
                  })}
                </div>
                {mathComplete && <output className="mt-5 block rounded-2xl bg-violet-50 p-5 text-violet-950"><span className="font-black">세 가지 계산 미션 완료!</span><span className="mt-1 block text-sm leading-6">같은 3 + 2 계산도 기계어, 어셈블리어, JavaScript에서 서로 다른 모양으로 표현할 수 있어요.</span></output>}
              </section>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="mt-3 grid size-12 place-items-center rounded-2xl bg-orange-100 text-orange-700"><ListChecks className="size-6" /></div>
              <h2 ref={heading} tabIndex={-1} className="mt-5 font-heading text-2xl font-black outline-none sm:text-3xl">로봇에게 주스 따르는 순서를 알려 주세요</h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">위·아래 버튼으로 명령을 올바른 순서로 바꿔 보세요. 컴퓨터는 적힌 순서대로만 움직입니다.</p>
              <ol className="mt-6 space-y-3">{activities.order.map((item, index) => <li key={item} className="flex items-center gap-3 rounded-2xl border bg-background p-3 sm:p-4"><span className="grid size-8 shrink-0 place-items-center rounded-xl bg-secondary text-sm font-black text-secondary-foreground">{index + 1}</span><span className="min-w-0 flex-1 text-base font-bold">{item}</span><div className="flex shrink-0 gap-1"><Button variant="outline" size="icon-sm" disabled={index === 0} onClick={() => moveItem(index, -1)} aria-label={`${item} 위로 이동`}><ChevronUp /></Button><Button variant="outline" size="icon-sm" disabled={index === activities.order.length - 1} onClick={() => moveItem(index, 1)} aria-label={`${item} 아래로 이동`}><ChevronDown /></Button></div></li>)}</ol>
              <div className="mt-5 flex flex-wrap gap-2"><Button onClick={() => update({ orderChecked: true })}>순서 확인하기</Button><Button variant="outline" onClick={() => update({ order: initialOrder, orderChecked: false })}><RotateCcw />처음부터</Button></div>
              {activities.orderChecked && <output className={`mt-4 block rounded-2xl p-4 text-sm font-bold leading-6 ${orderIsCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-orange-50 text-orange-800'}`}>{orderIsCorrect ? '정확해요! 필요한 준비부터 마무리까지 순서대로 명령했습니다.' : '아직 순서가 어색해요. 컵을 먼저 준비하고, 뚜껑을 연 뒤 주스를 따라야 해요.'}</output>}
            </div>
          )}

          {step === 5 && (
            <div>
              <div className="mt-3 grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><CheckCircle2 className="size-6" /></div>
              <h2 ref={heading} tabIndex={-1} className="mt-5 font-heading text-2xl font-black outline-none sm:text-3xl">오늘 배운 내용을 확인해요</h2>
              <div className="mt-7 space-y-7">{quizItems.map((item, index) => <fieldset key={item.question}><legend className="text-base font-black leading-7">{index + 1}. {item.question}</legend><div className="mt-3 grid gap-2">{item.options.map((option) => <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm font-bold ${activities.quizAnswers[index] === option ? 'border-primary bg-secondary' : 'hover:bg-muted/50'}`}><input type="radio" name={`quiz-${index}`} value={option} checked={activities.quizAnswers[index] === option} onChange={() => { const answers = activities.quizAnswers.map((answer, answerIndex) => answerIndex === index ? option : answer); update({ quizAnswers: answers, quizChecked: false }); }} className="accent-teal-700" />{option}</label>)}</div></fieldset>)}</div>
              <Button className="mt-6" disabled={activities.quizAnswers.some((answer) => answer === null)} onClick={() => update({ quizChecked: true })}>정답 확인하기</Button>
              {activities.quizChecked && <output className={`mt-4 block rounded-2xl p-4 text-sm font-bold ${quizScore === quizItems.length ? 'bg-emerald-50 text-emerald-800' : 'bg-orange-50 text-orange-800'}`}>{quizScore === quizItems.length ? '2문제를 모두 맞혔어요! 코딩 언어의 변화가 잘 이해되었네요.' : `${quizItems.length}문제 중 ${quizScore}문제를 맞혔어요. 코딩 언어는 사람이 더 쉽고 정확하게 명령하도록 발전했다는 점을 다시 살펴보세요.`}</output>}
              <div className="mt-8 rounded-2xl border bg-muted/40 p-5"><label htmlFor="reflection" className="flex items-center gap-2 font-black"><MessageSquareText className="size-5 text-primary" />오늘의 배움을 한 문장으로 적어 보세요.</label><textarea id="reflection" value={reflection} onChange={(event) => { dirty(); setReflection(event.target.value); }} placeholder="예: 코딩 언어는 컴퓨터에게 더 쉽게 명령하기 위해 발전해 왔다." className="mt-3 min-h-24 w-full resize-y rounded-xl border bg-card p-3 text-base leading-7 outline-none focus:border-primary focus:ring-3 focus:ring-primary/15" maxLength={160} /><p className="mt-2 text-right text-sm text-muted-foreground">{reflection.length} / 160자 · 10자 이상</p></div>
              <div className="mt-6 rounded-2xl bg-secondary/60 p-5"><h3 className="font-black">완료 전 확인</h3><ul className="mt-3 space-y-2 text-sm leading-7"><li>{requirements[0] ? '✓' : '○'} 네 가지 언어로 캐릭터를 목표까지 이동하기</li><li>{requirements[1] ? '✓' : '○'} 세 가지 언어를 직접 입력해 3 + 2 계산하기</li><li>{requirements[2] ? '✓' : '○'} 퀴즈 2문항 모두 정답 확인하기</li><li>{requirements[3] ? '✓' : '○'} 성찰 10자 이상 작성하기</li></ul></div>
              {completed && <output className="mt-6 block rounded-3xl bg-gradient-to-r from-teal-700 to-teal-600 p-6 text-center text-white"><Sparkles className="mx-auto size-7 text-orange-200" /><span className="mt-2 block text-xl font-black">첫걸음 탐험가 배지 획득!</span><span className="mt-1 block text-sm text-teal-50">1차시의 모든 활동을 마쳤습니다.</span></output>}
              <Button className="mt-5" onClick={() => void finishLesson()} disabled={!requirements.every(Boolean) || saving || completed}><Save />{completed ? '완료 기록 저장됨' : '1차시 완료하고 저장'}</Button>
            </div>
          )}

          <footer className="mt-10 flex items-center justify-between gap-3 border-t pt-5"><Button variant="outline" disabled={step === 1} onClick={() => go(step - 1)}><ArrowLeft />이전</Button>{step < 5 ? <Button onClick={() => go(step + 1)}>다음 단계<ArrowRight /></Button> : <Button variant="outline" disabled={saving} onClick={() => void home()}>저장하고 홈으로</Button>}</footer>
        </section>
      </main>
    </div>
  );
}
