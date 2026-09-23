'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  LoaderCircle,
  MessageSquareQuote,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  lessonTitles,
  loadReflectionBoard,
  type ReflectionBoardEntry,
} from '@/lib/reflection-board';
import { useStudentSession } from '@/lib/student-auth';

function initialLessonFilter() {
  if (typeof window === 'undefined') return 1;
  const lesson = Number(
    new URLSearchParams(window.location.search).get('lesson'),
  );
  return Number.isInteger(lesson) && lesson >= 1 && lesson <= 10 ? lesson : 1;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

function ReflectionCards({ entries }: { entries: ReflectionBoardEntry[] }) {
  if (entries.length === 0)
    return (
      <div className="rounded-3xl border border-dashed bg-card p-8 text-center">
        <MessageSquareQuote className="mx-auto size-9 text-muted-foreground" />
        <p className="mt-3 font-black">아직 올라온 문장이 없어요.</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          이 차시의 첫 문장을 나누어 보세요.
        </p>
      </div>
    );
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {entries.map((entry, index) => (
        <article
          key={`${entry.lesson_no}-${entry.updated_at}-${index}`}
          className="flex min-h-44 flex-col rounded-3xl border bg-card p-5 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <Badge variant="outline">{entry.lesson_no}차시</Badge>
            <time
              dateTime={entry.updated_at}
              className="text-xs font-bold text-muted-foreground"
            >
              {formatDate(entry.updated_at)}
            </time>
          </div>
          <blockquote className="mt-5 flex-1 text-base font-bold leading-8 text-foreground">
            “{entry.reflection}”
          </blockquote>
          <p className="mt-4 text-xs font-bold text-teal-700">
            익명 친구의 한 문장
          </p>
        </article>
      ))}
    </div>
  );
}

export default function ReflectionBoardPage() {
  const { user, loading: authLoading } = useStudentSession();
  const [selectedLesson, setSelectedLesson] = useState<number | null>(
    initialLessonFilter,
  );
  const [entries, setEntries] = useState<ReflectionBoardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!user) return;
    let active = true;
    void loadReflectionBoard(selectedLesson)
      .then((nextEntries) => {
        if (!active) return;
        setEntries(nextEntries);
        setError(false);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [retryKey, selectedLesson, user]);

  const selectLesson = useCallback((lessonNo: number | null) => {
    setLoading(true);
    setError(false);
    setSelectedLesson(lessonNo);
  }, []);

  const retry = useCallback(() => {
    setLoading(true);
    setError(false);
    setRetryKey((value) => value + 1);
  }, []);

  const groups = useMemo(
    () =>
      lessonTitles
        .map((title, index) => ({
          lessonNo: index + 1,
          title,
          entries: entries.filter((entry) => entry.lesson_no === index + 1),
        }))
        .filter((group) => group.entries.length > 0),
    [entries],
  );

  if (authLoading)
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <output className="font-bold text-muted-foreground">
          게시판을 불러오는 중…
        </output>
      </div>
    );

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Button render={<Link href="/" />} variant="ghost">
            <ArrowLeft />
            수업 홈
          </Button>
          <div className="hidden items-center gap-2 text-sm font-bold text-teal-800 sm:flex">
            <ShieldCheck className="size-4" />
            이름과 학번을 표시하지 않아요
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10">
        <section className="rounded-[32px] bg-gradient-to-br from-teal-800 via-teal-700 to-cyan-700 p-6 text-white shadow-lg sm:p-8">
          <div className="flex max-w-3xl items-start gap-4">
            <span className="grid size-13 shrink-0 place-items-center rounded-2xl bg-white/15">
              <MessageSquareQuote className="size-7" />
            </span>
            <div>
              <p className="text-sm font-bold text-teal-100">
                우리의 생각을 모아요
              </p>
              <h1 className="mt-1 font-heading text-3xl font-black tracking-[-0.03em] sm:text-4xl">
                한 문장 배움 게시판
              </h1>
              <p className="mt-3 leading-7 text-teal-50">
                친구들이 차시를 마치며 쓴 문장을 읽어 보세요. 문장은 익명으로
                보이고, 차시별로 골라 볼 수 있어요.
              </p>
            </div>
          </div>
        </section>

        <section
          className="mt-6 rounded-3xl border bg-card p-4 shadow-sm sm:p-5"
          aria-labelledby="lesson-filter-title"
        >
          <div className="mb-3 flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            <h2 id="lesson-filter-title" className="font-black">
              차시 선택
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-11">
            <button
              type="button"
              onClick={() => selectLesson(null)}
              aria-pressed={selectedLesson === null}
              className={`rounded-xl border px-2 py-2.5 text-sm font-black focus-visible:ring-2 focus-visible:ring-primary ${selectedLesson === null ? 'border-primary bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
            >
              전체
            </button>
            {lessonTitles.map((_, index) => {
              const lessonNo = index + 1;
              return (
                <button
                  key={lessonNo}
                  type="button"
                  onClick={() => selectLesson(lessonNo)}
                  aria-pressed={selectedLesson === lessonNo}
                  className={`rounded-xl border px-2 py-2.5 text-sm font-black focus-visible:ring-2 focus-visible:ring-primary ${selectedLesson === lessonNo ? 'border-primary bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
                >
                  {lessonNo}차시
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-7" aria-live="polite">
          {loading ? (
            <div className="grid min-h-52 place-items-center">
              <p className="flex items-center gap-2 font-bold text-muted-foreground">
                <LoaderCircle className="size-5 animate-spin" />
                문장을 불러오는 중…
              </p>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
              <p className="font-black text-red-800">
                게시판을 불러오지 못했어요.
              </p>
              <Button className="mt-4" variant="outline" onClick={retry}>
                <RefreshCw />
                다시 불러오기
              </Button>
            </div>
          ) : selectedLesson === null ? (
            <div className="space-y-8">
              {groups.length === 0 ? (
                <ReflectionCards entries={[]} />
              ) : (
                groups.map((group) => (
                  <section key={group.lessonNo}>
                    <div className="mb-3">
                      <p className="text-sm font-bold text-primary">
                        {group.lessonNo}차시
                      </p>
                      <h2 className="text-xl font-black">{group.title}</h2>
                    </div>
                    <ReflectionCards entries={group.entries} />
                  </section>
                ))
              )}
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm font-bold text-primary">
                  {selectedLesson}차시 · {entries.length}개의 문장
                </p>
                <h2 className="text-2xl font-black">
                  {lessonTitles[selectedLesson - 1]}
                </h2>
              </div>
              <ReflectionCards entries={entries} />
            </>
          )}
        </section>
      </main>
    </div>
  );
}
