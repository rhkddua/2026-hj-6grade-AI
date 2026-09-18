'use client';

import {
  ArrowRight, BookOpen, CheckCircle2, Code2, HelpCircle, Home, LogOut,
  Lightbulb, LockKeyhole, MessageSquareText, Rocket, Sparkles, Trophy,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress';
import { signOutStudent, useStudentSession } from '@/lib/student-auth';

const lessons = [
  { no: 1, title: '코딩은 어떻게 발전했을까?', status: 'current' },
  { no: 2, title: '전통 코딩과 AI 코딩', status: 'open' },
  { no: 3, title: 'AI는 무엇을 잘하고 못할까?', status: 'open' },
    { no: 4, title: 'AI에게 잘 지시하는 방법', status: 'open' },
  { no: 5, title: 'Canva AI 코드 시작하기', status: 'locked' },
  { no: 6, title: '한 기능 앱 만들기', status: 'locked' },
  { no: 7, title: '앱 기능 설계하기', status: 'locked' },
  { no: 8, title: '두 기능 앱 만들기', status: 'locked' },
  { no: 9, title: '나에게 필요한 앱 만들기', status: 'locked' },
  { no: 10, title: '공유하고 개선하기', status: 'locked' },
];

export default function HomePage() {
  const { profile, loading } = useStudentSession();

  if (loading) return <div className="grid min-h-screen place-items-center bg-background"><p className="font-bold text-muted-foreground">나의 수업을 불러오는 중...</p></div>;

  const studentName = profile?.student_name ?? '학생';
  const initial = studentName.slice(0, 1);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-background/92 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Code2 className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-heading text-lg font-extrabold tracking-[-0.03em]">AI 코딩 교실</p>
              <p className="text-xs font-medium text-muted-foreground">생각을 앱으로 만드는 10번의 모험</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="icon-lg" aria-label="도움말 보기" className="rounded-xl">
              <HelpCircle className="size-5" />
            </Button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold">6학년 {profile?.class_no ?? '-'}반 · {profile?.student_no ?? '-'}번</p>
              <p className="text-xs text-muted-foreground">{studentName}</p>
            </div>
            <div className="grid size-10 place-items-center rounded-full bg-secondary font-extrabold text-secondary-foreground">{initial}</div>
            <Button variant="ghost" size="icon-lg" aria-label="로그아웃" onClick={() => void signOutStudent()} className="rounded-xl"><LogOut className="size-5" /></Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden min-h-[calc(100vh-72px)] border-r border-border/70 px-4 py-6 lg:block">
          <nav aria-label="학생 메뉴" className="space-y-1.5">
            <a className="nav-item nav-item-active" href="#top"><Home className="size-4.5" />나의 수업 홈</a>
            <a className="nav-item" href="#lessons"><BookOpen className="size-4.5" />전체 차시</a>
            <a className="nav-item" href="#works"><Rocket className="size-4.5" />나의 앱</a>
            <a className="nav-item" href="#feedback"><MessageSquareText className="size-4.5" />받은 피드백</a>
          </nav>
          <div className="mt-8 rounded-2xl border border-amber-200/80 bg-amber-50 p-4 text-amber-950">
            <div className="mb-2 flex items-center gap-2 font-bold"><Lightbulb className="size-4 text-amber-600" />오늘의 약속</div>
            <p className="text-sm leading-6 text-amber-900/80">AI의 답은 꼭 직접 확인하고, 개인정보는 입력하지 않아요.</p>
          </div>
        </aside>

        <main id="top" className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <section className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <Badge className="mb-3 h-7 bg-teal-100 px-3 text-teal-800 hover:bg-teal-100"><Sparkles data-icon="inline-start" />오늘도 한 단계 성장!</Badge>
              <h1 className="font-heading text-3xl font-black tracking-[-0.04em] sm:text-4xl">안녕하세요, {studentName} 학생!</h1>
              <p className="mt-2 text-base leading-7 text-muted-foreground">오늘은 컴퓨터에게 명령하는 방법이 어떻게 발전해 왔는지 알아봐요.</p>
            </div>
            <div className="w-full rounded-2xl border bg-card p-4 shadow-sm sm:w-64">
              <Progress value={10}><ProgressLabel>전체 수업 진도</ProgressLabel><ProgressValue>10%</ProgressValue></Progress>
              <p className="mt-3 text-xs text-muted-foreground">10차시 중 1차시를 배우고 있어요.</p>
            </div>
          </section>

          <section className="current-lesson-card relative overflow-hidden rounded-[28px] p-6 sm:p-8">
            <div className="relative z-10 max-w-2xl">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <Badge className="h-7 bg-white/18 px-3 text-white hover:bg-white/18">지금 배울 차시</Badge>
                <span className="text-sm font-semibold text-teal-50">1 / 10</span>
              </div>
              <p className="text-sm font-bold text-teal-100">1차시</p>
              <h2 className="mt-1 font-heading text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">코딩은 어떻게 발전해 왔을까?</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-teal-50/90 sm:text-base">가은이의 로봇 이야기에서 시작해 기계어, 어셈블리어, 블록 코딩과 AI 코딩의 변화를 알아봅니다.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/lesson/1" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-teal-900 transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white/50">수업 시작하기<ArrowRight className="size-4.5" /></a>
                <div className="flex items-center gap-2 px-2 text-sm font-semibold text-teal-50"><span className="inline-block size-2 rounded-full bg-orange-300" />약 40분</div>
              </div>
            </div>
            <div className="lesson-orbit" aria-hidden="true"><div className="grid size-18 place-items-center rounded-3xl bg-white/16 text-white shadow-xl backdrop-blur"><Sparkles className="size-9" /></div></div>
          </section>

          <section id="lessons" className="mt-9">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div><h2 className="font-heading text-xl font-black tracking-[-0.02em] sm:text-2xl">10번의 AI 코딩 모험</h2><p className="mt-1 text-sm text-muted-foreground">차근차근 배우고, 마지막에는 나만의 앱을 완성해요.</p></div>
              <span className="hidden text-sm font-bold text-primary sm:block">진행 중 1</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {lessons.map((lesson) => (
                  <a href={lesson.no <= 4 ? `/lesson/${lesson.no}` : undefined} key={lesson.no} className={`lesson-card lesson-${lesson.status}`} aria-disabled={lesson.no > 4}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="lesson-number">{lesson.no}</div>
                    {lesson.status === 'done' && <CheckCircle2 className="size-5 text-emerald-600" />}
                    {lesson.status === 'current' && <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">진행 중</Badge>}
                    {lesson.status === 'locked' && <LockKeyhole className="size-4.5 text-stone-400" />}
                  </div>
                  <h3 className="mt-4 min-h-12 font-bold leading-6">{lesson.title}</h3>
                  <p className="mt-2 text-xs font-semibold text-muted-foreground">
                    {lesson.status === 'done' && '학습 완료'}{lesson.status === 'current' && '지금 학습할 수 있어요'}{lesson.status === 'open' && '곧 이어서 학습해요'}{lesson.status === 'locked' && '아직 열리지 않았어요'}
                  </p>
                </a>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-2" id="works">
            <article className="rounded-3xl border bg-card p-5 shadow-sm sm:p-6"><div className="flex items-start gap-4"><div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-violet-100 text-violet-700"><Rocket className="size-5" /></div><div><h2 className="font-heading text-lg font-black">나의 앱 보관함</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">아직 제출한 앱이 없어요. 5차시부터 하나씩 채워 볼까요?</p></div></div></article>
            <article className="rounded-3xl border bg-card p-5 shadow-sm sm:p-6" id="feedback"><div className="flex items-start gap-4"><div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-orange-100 text-orange-700"><Trophy className="size-5" /></div><div><h2 className="font-heading text-lg font-black">이번 주 배지</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">1차시의 퀴즈와 한 문장 정리를 마치면 ‘첫걸음 탐험가’ 배지를 받을 수 있어요.</p></div></div></article>
          </section>
        </main>
      </div>
      <nav aria-label="모바일 학생 메뉴" className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-4 rounded-2xl border bg-card/95 p-1.5 shadow-xl backdrop-blur lg:hidden">
        <a className="mobile-nav-item text-primary" href="#top"><Home className="size-5" /><span>홈</span></a>
        <a className="mobile-nav-item" href="#lessons"><BookOpen className="size-5" /><span>차시</span></a>
        <a className="mobile-nav-item" href="#works"><Rocket className="size-5" /><span>나의 앱</span></a>
        <button className="mobile-nav-item" onClick={() => void signOutStudent()}><LogOut className="size-5" /><span>로그아웃</span></button>
      </nav>
    </div>
  );
}
