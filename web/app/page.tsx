import {
  ArrowRight, BookOpen, CheckCircle2, Code2, HelpCircle, Home,
  Lightbulb, LockKeyhole, MessageSquareText, Rocket, Sparkles, Trophy,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress';

const lessons = [
  { no: 1, title: '코딩은 어떻게 발전했을까?', status: 'done' },
  { no: 2, title: '전통 코딩과 AI 코딩', status: 'current' },
  { no: 3, title: 'AI는 무엇을 잘하고 못할까?', status: 'open' },
  { no: 4, title: 'AI에게 잘 지시하는 방법', status: 'locked' },
  { no: 5, title: 'Canva AI 코드 시작하기', status: 'locked' },
  { no: 6, title: '한 기능 앱 만들기', status: 'locked' },
  { no: 7, title: '앱 기능 설계하기', status: 'locked' },
  { no: 8, title: '두 기능 앱 만들기', status: 'locked' },
  { no: 9, title: '나에게 필요한 앱 만들기', status: 'locked' },
  { no: 10, title: '공유하고 개선하기', status: 'locked' },
];

export default function HomePage() {
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
            <a href="/teacher" className="hidden rounded-xl border bg-card px-3 py-2 text-xs font-bold text-muted-foreground transition-colors hover:bg-muted sm:block">
              교사 화면
            </a>
            <Button variant="ghost" size="icon-lg" aria-label="도움말 보기" className="rounded-xl">
              <HelpCircle className="size-5" />
            </Button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold">6학년 1반 · 7번</p>
              <p className="text-xs text-muted-foreground">꿈나무 학생</p>
            </div>
            <div className="grid size-10 place-items-center rounded-full bg-secondary font-extrabold text-secondary-foreground">꿈</div>
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
              <h1 className="font-heading text-3xl font-black tracking-[-0.04em] sm:text-4xl">안녕하세요, 꿈나무 학생!</h1>
              <p className="mt-2 text-base leading-7 text-muted-foreground">오늘은 전통적인 코딩과 AI 코딩이 어떻게 다른지 알아봐요.</p>
            </div>
            <div className="w-full rounded-2xl border bg-card p-4 shadow-sm sm:w-64">
              <Progress value={20}><ProgressLabel>전체 수업 진도</ProgressLabel><ProgressValue>20%</ProgressValue></Progress>
              <p className="mt-3 text-xs text-muted-foreground">10차시 중 2차시를 배우고 있어요.</p>
            </div>
          </section>

          <section className="current-lesson-card relative overflow-hidden rounded-[28px] p-6 sm:p-8">
            <div className="relative z-10 max-w-2xl">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <Badge className="h-7 bg-white/18 px-3 text-white hover:bg-white/18">지금 배울 차시</Badge>
                <span className="text-sm font-semibold text-teal-50">2 / 10</span>
              </div>
              <p className="text-sm font-bold text-teal-100">2차시</p>
              <h2 className="mt-1 font-heading text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl">전통적인 코딩과 AI 코딩</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-teal-50/90 sm:text-base">같은 문제를 사람이 직접 명령할 때와 AI에게 설명할 때 무엇이 달라지는지 비교해 봅니다.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/lesson/2" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-teal-900 transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white/50">수업 시작하기<ArrowRight className="size-4.5" /></a>
                <div className="flex items-center gap-2 px-2 text-sm font-semibold text-teal-50"><span className="inline-block size-2 rounded-full bg-orange-300" />약 35분</div>
              </div>
            </div>
            <div className="lesson-orbit" aria-hidden="true"><div className="grid size-18 place-items-center rounded-3xl bg-white/16 text-white shadow-xl backdrop-blur"><Sparkles className="size-9" /></div></div>
          </section>

          <section id="lessons" className="mt-9">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div><h2 className="font-heading text-xl font-black tracking-[-0.02em] sm:text-2xl">10번의 AI 코딩 모험</h2><p className="mt-1 text-sm text-muted-foreground">차근차근 배우고, 마지막에는 나만의 앱을 완성해요.</p></div>
              <span className="hidden text-sm font-bold text-primary sm:block">완료 1 · 진행 중 1</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {lessons.map((lesson) => (
                <article key={lesson.no} className={`lesson-card lesson-${lesson.status}`}>
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
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-2" id="works">
            <article className="rounded-3xl border bg-card p-5 shadow-sm sm:p-6"><div className="flex items-start gap-4"><div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-violet-100 text-violet-700"><Rocket className="size-5" /></div><div><h2 className="font-heading text-lg font-black">나의 앱 보관함</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">아직 제출한 앱이 없어요. 5차시부터 하나씩 채워 볼까요?</p></div></div></article>
            <article className="rounded-3xl border bg-card p-5 shadow-sm sm:p-6" id="feedback"><div className="flex items-start gap-4"><div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-orange-100 text-orange-700"><Trophy className="size-5" /></div><div><h2 className="font-heading text-lg font-black">이번 주 배지</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">1차시를 끝까지 마쳐 ‘첫걸음 탐험가’ 배지를 받았어요!</p></div></div></article>
          </section>
        </main>
      </div>
      <nav aria-label="모바일 학생 메뉴" className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-4 rounded-2xl border bg-card/95 p-1.5 shadow-xl backdrop-blur lg:hidden">
        <a className="mobile-nav-item text-primary" href="#top"><Home className="size-5" /><span>홈</span></a>
        <a className="mobile-nav-item" href="#lessons"><BookOpen className="size-5" /><span>차시</span></a>
        <a className="mobile-nav-item" href="#works"><Rocket className="size-5" /><span>나의 앱</span></a>
        <a className="mobile-nav-item" href="/teacher"><MessageSquareText className="size-5" /><span>교사</span></a>
      </nav>
    </div>
  );
}
