'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ReflectionBoardActions } from '@/components/reflection-board-actions';
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress';
import { useStudentSession } from '@/lib/student-auth';
import {
  loadLessonProgress,
  saveLessonProgress,
  type LessonProgress,
} from '@/lib/lesson-progress';
import {
  initialActivities,
  lessonFiveRequirements,
  restoreActivities,
  questions,
  stages,
  type LessonFiveActivities,
} from '@/lib/lesson-five';
import { LessonFiveContent } from './content';

export default function LessonFivePage() {
  const { user, loading: authLoading } = useStudentSession();
  const [step, setStep] = useState(1);
  const [activities, setActivities] = useState(initialActivities);
  const [reflection, setReflection] = useState('');
  const [completed, setCompleted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [status, setStatus] = useState('학습 기록을 불러오는 중…');
  const [saveError, setSaveError] = useState(false);
  const [saving, setSaving] = useState(false);
  const queue = useRef(Promise.resolve());
  const revision = useRef(0);
  const savedRevision = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const requirements = lessonFiveRequirements(activities, reflection);
  const score = questions.filter(
    (q, i) => activities.answers[i] === q.answer,
  ).length;
  const snapshot: LessonProgress = {
    lessonNo: 5,
    currentStep: step,
    quizScore: activities.quizChecked ? score : null,
    reflection,
    completed,
    activityData: { ...activities },
  };
  const latest = useRef(snapshot);
  latest.current = snapshot;
  useEffect(() => {
    if (!user) return;
    let active = true;
    setLoadError(false);
    void loadLessonProgress(5, true)
      .then((data) => {
        if (!active) return;
        if (data) {
          setStep(Math.max(1, Math.min(5, data.currentStep)));
          setActivities(restoreActivities(data.activityData));
          setReflection(data.reflection);
          setCompleted(data.completed);
        }
        setLoaded(true);
        setStatus(
          data
            ? '저장한 학습 기록을 불러왔어요'
            : '활동을 시작하면 자동으로 저장해요',
        );
      })
      .catch(() => {
        if (active) {
          setLoadError(true);
          setStatus('학습 기록을 불러오지 못했어요');
        }
      });
    return () => {
      active = false;
    };
  }, [user?.id, loadAttempt]);
  function dirty() {
    revision.current += 1;
    setCompleted(false);
    setStatus('변경 내용을 저장할 예정이에요');
    setSaveError(false);
  }
  function update(patch: Partial<LessonFiveActivities>) {
    dirty();
    setActivities((value) => ({ ...value, ...patch }));
  }
  function persist(data: LessonProgress, version: number) {
    if (timer.current) clearTimeout(timer.current);
    setSaving(true);
    setStatus('저장 중…');
    const operation = queue.current
      .catch(() => {})
      .then(() => saveLessonProgress(data));
    queue.current = operation.catch(() => {});
    return operation
      .then(() => {
        savedRevision.current = version;
        if (version === revision.current) setStatus('저장됨');
        return true;
      })
      .catch(() => {
        if (version === revision.current) {
          setSaveError(true);
          setStatus('저장하지 못했어요. 연결을 확인하고 다시 저장해 주세요.');
        }
        return false;
      })
      .finally(() => {
        if (version === revision.current) setSaving(false);
      });
  }
  useEffect(() => {
    if (!loaded || revision.current === savedRevision.current) return;
    timer.current = setTimeout(() => {
      void persist(latest.current, revision.current);
    }, 800);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
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
  async function finish() {
    if (!requirements.every(Boolean)) return;
    const version = ++revision.current;
    const success = await persist(
      { ...latest.current, completed: true },
      version,
    );
    if (success && version === revision.current) setCompleted(true);
  }
  async function home() {
    const version = revision.current;
    if (
      version !== savedRevision.current &&
      !(await persist(latest.current, version))
    )
      return;
    if (version === revision.current) window.location.assign('/');
  }
  if (authLoading || (!loaded && !loadError))
    return (
      <div className="grid min-h-screen place-items-center">
        <p role="status">학습 기록을 불러오는 중…</p>
      </div>
    );
  if (loadError)
    return (
      <main className="mx-auto max-w-xl space-y-5 p-8">
        <h1 className="text-2xl font-black">학습 기록을 불러오지 못했어요</h1>
        <p>
          기존 기록을 보호하기 위해 활동을 시작하지 않았어요. 인터넷 연결을
          확인해 주세요.
        </p>
        <Button onClick={() => setLoadAttempt((value) => value + 1)}>
          다시 불러오기
        </Button>
        <a href="/" className="ml-5 underline">
          수업 홈
        </a>
      </main>
    );
  const titles = [
    'Canva AI 코드가 하는 일',
    '만들 앱의 계획 정하기',
    '안전하고 구체적인 제작 지시',
    '준비된 결과 테스트하기',
    '배움 확인하기',
  ];
  const labels = [
    'Canva AI 코드 역할 확인',
    '사용자·문제·핵심 기능 계획 확인',
    '안전한 제작 지시 확인',
    '테스트 결과와 수정 계획 확인',
    '퀴즈 3문항 모두 정답 확인',
    '성찰 10자 이상 작성',
  ];
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex min-h-18 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Button variant="ghost" onClick={() => void home()} disabled={saving}>
            <ArrowLeft />
            수업 홈
          </Button>
          <span
            role="status"
            className="max-w-sm text-sm font-bold text-primary"
          >
            {status}
          </span>
          {saveError && (
            <Button
              variant="outline"
              onClick={() => void persist(latest.current, revision.current)}
            >
              다시 저장
            </Button>
          )}
        </div>
      </header>
      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:py-9">
        <aside>
          <div className="rounded-3xl border bg-card p-5 shadow-sm lg:sticky lg:top-24">
            <Badge>5차시 · 40분</Badge>
            <h1 className="mt-3 text-xl font-black leading-8">
              Canva AI 코드
              <br />
              시작하기
            </h1>
            <Progress
              value={completed ? 100 : (step - 1) * 20}
              className="mt-5"
            >
              <ProgressLabel>학습 진행</ProgressLabel>
              <ProgressValue />
            </Progress>
            <nav aria-label="5차시 학습 단계">
              <ol className="mt-5 space-y-2">
                {stages.map((title, i) => (
                  <li key={title}>
                    <button
                      onClick={() => go(i + 1)}
                      aria-current={step === i + 1 ? 'step' : undefined}
                      className={`w-full rounded-xl px-3 py-3 text-left text-sm font-bold focus-visible:ring-2 focus-visible:ring-primary ${step === i + 1 ? 'bg-secondary text-secondary-foreground' : 'hover:bg-muted'}`}
                    >
                      {i + 1}. {title}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              목표: 안전한 제작 지시를 쓰고, 준비된 앱 결과를 테스트하며 개선할
              수 있어요.
            </p>
          </div>
        </aside>
        <section className="min-w-0 rounded-3xl border bg-card p-5 shadow-sm sm:p-8">
          <p className="text-sm font-bold text-primary">STEP {step} / 5</p>
          <h2
            ref={heading}
            tabIndex={-1}
            className="mt-2 text-2xl font-black leading-tight outline-none sm:text-3xl"
          >
            {titles[step - 1]}
          </h2>
          <LessonFiveContent
            step={step}
            activities={activities}
            update={update}
            reflection={reflection}
            setReflection={(value) => {
              dirty();
              setReflection(value);
            }}
          />
          {step === 5 && (
            <ReflectionBoardActions lessonNo={5} reflection={reflection} />
          )}
          {step === 5 && (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-secondary/60 p-5">
                <h3 className="font-black">완료 전 확인</h3>
                <ul className="mt-3 space-y-2 leading-7">
                  {labels.map((label, i) => (
                    <li key={label}>
                      {requirements[i] ? '✓' : '○'} {label}
                    </li>
                  ))}
                </ul>
              </div>
              {completed && (
                <div
                  role="status"
                  className="rounded-2xl border-2 border-primary p-5"
                >
                  <p className="text-xl font-black">5차시 완료!</p>
                  <p className="mt-2 leading-7">
                    내 생각을 안전한 지시로 바꾸고, 앱을 직접 테스트하며 고치는
                    방법을 배웠어요.
                  </p>
                </div>
              )}
              <Button
                onClick={() => void finish()}
                disabled={!requirements.every(Boolean) || saving || completed}
              >
                <Save />
                {completed ? '완료 기록 저장됨' : '5차시 완료하고 저장'}
              </Button>
            </div>
          )}
          <footer className="mt-10 flex justify-between gap-3 border-t pt-5">
            <Button
              variant="outline"
              disabled={step === 1}
              onClick={() => go(step - 1)}
            >
              <ArrowLeft />
              이전
            </Button>
            {step < 5 ? (
              <Button onClick={() => go(step + 1)}>
                다음 단계
                <ArrowRight />
              </Button>
            ) : (
              <Button
                variant="outline"
                disabled={saving}
                onClick={() => void home()}
              >
                저장하고 홈으로
              </Button>
            )}
          </footer>
        </section>
      </main>
    </div>
  );
}
