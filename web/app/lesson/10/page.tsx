'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
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
  lessonTenRequirements,
  questions,
  restoreActivities,
  stages,
  type LessonTenActivities,
} from '@/lib/lesson-ten';
import { LessonTenContent } from './content';

export default function LessonTenPage() {
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
  const userId = user?.id;
  const queue = useRef(Promise.resolve());
  const revision = useRef(0);
  const savedRevision = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const requirements = lessonTenRequirements(activities, reflection);
  const score = questions.filter(
    (question, index) => activities.answers[index] === question.answer,
  ).length;
  const snapshot: LessonProgress = useMemo(
    () => ({
      lessonNo: 10,
      currentStep: step,
      quizScore: activities.quizChecked ? score : null,
      reflection,
      completed,
      activityData: { ...activities },
    }),
    [step, score, reflection, completed, activities],
  );
  const latest = useRef(snapshot);

  useEffect(() => {
    latest.current = snapshot;
  }, [snapshot]);
  useEffect(() => {
    if (!userId) return;
    let active = true;
    void loadLessonProgress(10, true)
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
  }, [userId, loadAttempt]);

  function dirty() {
    revision.current += 1;
    setCompleted(false);
    setStatus('변경 내용을 저장할 예정이에요');
    setSaveError(false);
  }
  function update(patch: Partial<LessonTenActivities>) {
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
        <output>학습 기록을 불러오는 중…</output>
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
        <Button
          onClick={() => {
            setLoadError(false);
            setStatus('학습 기록을 다시 불러오는 중…');
            setLoadAttempt((value) => value + 1);
          }}
        >
          다시 불러오기
        </Button>
        <Link href="/" className="ml-5 underline">
          수업 홈
        </Link>
      </main>
    );

  const titles = [
    '무엇을 안전하게 공유할까?',
    '내 앱을 이해하기 쉽게 소개하기',
    '도움이 되는 피드백 찾기',
    '피드백을 개선 계획으로 바꾸기',
    '10차시 배움 확인하기',
  ];
  const labels = [
    '안전한 공유 방법 확인',
    '개인정보 없는 발표 카드 확인',
    '구체적이고 도움이 되는 피드백 구별',
    '개선 계획과 최종 점검 완료',
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
          <output className="max-w-sm text-sm font-bold text-primary">
            {status}
          </output>
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
            <Badge>10차시 · 40분</Badge>
            <h1 className="mt-3 text-xl font-black leading-8">
              공유하고
              <br />
              개선하기
            </h1>
            <Progress
              value={completed ? 100 : (step - 1) * 20}
              className="mt-5"
            >
              <ProgressLabel>학습 진행</ProgressLabel>
              <ProgressValue />
            </Progress>
            <nav aria-label="10차시 학습 단계">
              <ol className="mt-5 space-y-2">
                {stages.map((title, index) => (
                  <li key={title}>
                    <button
                      onClick={() => go(index + 1)}
                      aria-current={step === index + 1 ? 'step' : undefined}
                      className={`w-full rounded-xl px-3 py-3 text-left text-sm font-bold focus-visible:ring-2 focus-visible:ring-primary ${step === index + 1 ? 'bg-secondary text-secondary-foreground' : 'hover:bg-muted'}`}
                    >
                      {index + 1}. {title}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              목표: 앱을 안전하게 소개하고 구체적인 피드백을 골라 테스트와
              개선에 활용할 수 있어요.
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
          <LessonTenContent
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
            <ReflectionBoardActions lessonNo={10} reflection={reflection} />
          )}
          {step === 5 && (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-secondary/60 p-5">
                <h3 className="font-black">완료 전 확인</h3>
                <ul className="mt-3 space-y-2 leading-7">
                  {labels.map((label, index) => (
                    <li key={label}>
                      {requirements[index] ? '✓' : '○'} {label}
                    </li>
                  ))}
                </ul>
              </div>
              {completed && (
                <output className="block rounded-2xl border-2 border-primary p-5">
                  <span className="block text-xl font-black">
                    10차시 완료! 모든 모험을 마쳤어요.
                  </span>
                  <span className="mt-2 block leading-7">
                    문제를 찾고 앱을 만들며, 테스트와 피드백으로 개선하는 AI
                    코딩 과정을 완주했어요.
                  </span>
                </output>
              )}
              <Button
                onClick={() => void finish()}
                disabled={!requirements.every(Boolean) || saving || completed}
              >
                <Save />
                {completed ? '완료 기록 저장됨' : '10차시 완료하고 저장'}
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
