"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  RefreshCw,
  Trophy,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useStudentSession } from "@/lib/student-auth";
import { useStudentBadge } from "@/lib/use-student-badge";

export default function BadgesPage() {
  const { user, loading: authLoading } = useStudentSession();
  const collection = useStudentBadge(user?.id);
  if (authLoading)
    return (
      <div className="grid min-h-screen place-items-center">
        <output>로그인을 확인하는 중…</output>
      </div>
    );
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-5xl px-4 py-4">
          {/* oxlint-disable-next-line next/no-html-link-for-pages */}
          <a href="/" className={buttonVariants({ variant: "ghost" })}>
            <ArrowLeft />
            수업 홈
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-7 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black">이번 주 배지</h1>
            <p className="mt-3 leading-7 text-muted-foreground">
              1~10차시를 완료하고 차시별 배지를 모아 보세요. 이미 완료한 차시의
              배지도 바로 표시돼요.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={collection.retry}
            disabled={collection.loading || collection.refreshing}
          >
            <RefreshCw
              className={
                collection.loading || collection.refreshing
                  ? "animate-spin"
                  : ""
              }
            />
            새로고침
          </Button>
        </div>
        {collection.loading ? (
          <output className="block rounded-3xl border bg-card p-6">
            배지 기록을 불러오는 중…
          </output>
        ) : collection.error ? (
          <div role="alert" className="rounded-3xl border bg-card p-6">
            <p>배지 기록을 불러오지 못했어요. 다시 시도해 주세요.</p>
            <Button
              className="mt-4"
              onClick={collection.retry}
              disabled={collection.refreshing}
            >
              다시 불러오기
            </Button>
          </div>
        ) : (
          <>
            <section
              className="flex flex-wrap items-center gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-6"
              aria-label="배지 획득 현황"
            >
              <Trophy
                className="size-10 shrink-0 text-amber-700"
                aria-hidden="true"
              />
              <div>
                <output
                  className="text-2xl font-black text-amber-900"
                  aria-live="polite"
                >
                  배지 {collection.earnedCount} / 10개 획득
                </output>
                <p className="mt-2 leading-7 text-amber-900">
                  {collection.allEarned
                    ? "모든 차시를 완료했어요. 열 번의 모험을 마친 여러분에게 박수를 보내요!"
                    : "차시의 마지막 단계에서 완료하고 저장하면 해당 배지를 받을 수 있어요."}
                </p>
              </div>
            </section>
            <p className="leading-7 text-muted-foreground">
              저장된 나의 완료 기록으로 확인해요. 주가 바뀌어도 배지는 사라지지
              않아요. 완료 후 활동이나 답안을 수정하면 다시 완료 저장이
              필요해요.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {collection.badges.map((badge) => (
                <article
                  key={badge.lessonNo}
                  className={`flex flex-col rounded-3xl border p-5 sm:p-6 ${badge.earned ? "border-amber-300 bg-amber-50" : "bg-card"}`}
                  aria-labelledby={`badge-title-${badge.lessonNo}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`grid size-14 shrink-0 place-items-center rounded-2xl ${badge.earned ? "bg-amber-200 text-amber-800" : "bg-muted text-muted-foreground"}`}
                    >
                      <Trophy className="size-7" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-muted-foreground">
                        {badge.lessonNo}차시
                      </p>
                      <h2
                        id={`badge-title-${badge.lessonNo}`}
                        className="mt-1 text-xl font-black"
                      >
                        {badge.name}
                      </h2>
                      <p
                        className={`mt-2 flex items-center gap-2 font-bold ${badge.earned ? "text-emerald-800" : "text-muted-foreground"}`}
                      >
                        {badge.earned ? (
                          <CheckCircle2
                            className="size-5 shrink-0"
                            aria-hidden="true"
                          />
                        ) : (
                          <Circle
                            className="size-5 shrink-0"
                            aria-hidden="true"
                          />
                        )}
                        {badge.earned
                          ? "획득 완료"
                          : badge.started
                            ? "완료 저장을 기다려요"
                            : "아직 도전 전"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 grow leading-7">
                    {badge.earned
                      ? badge.description
                      : "활동·퀴즈·성찰을 마치고 마지막 단계에서 완료 저장에 도전해요."}
                  </p>
                  {/* oxlint-disable-next-line next/no-html-link-for-pages */}
                  <a
                    href={`/lesson/${badge.lessonNo}`}
                    className={`${buttonVariants({ variant: "outline" })} mt-5 w-full`}
                  >
                    {badge.lessonNo}차시{" "}
                    {badge.earned
                      ? "다시 보기"
                      : badge.started
                        ? "이어서 배우기"
                        : "시작하기"}
                    <ArrowRight />
                  </a>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
