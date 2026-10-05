'use client';

import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Trophy } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { useStudentSession } from '@/lib/student-auth';
import { useStudentBadge } from '@/lib/use-student-badge';

export default function BadgesPage() {
  const { user, loading: authLoading } = useStudentSession();
  const badge = useStudentBadge(user?.id);
  if (authLoading) return <div className="grid min-h-screen place-items-center"><output>로그인을 확인하는 중…</output></div>;
  return <div className="min-h-screen bg-background">
    <header className="border-b"><div className="mx-auto max-w-3xl px-4 py-4">
      {/* oxlint-disable-next-line next/no-html-link-for-pages */}
      <a href="/" className={buttonVariants({ variant: 'ghost' })}><ArrowLeft />수업 홈</a>
    </div></header>
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-7 sm:px-6">
      <div><h1 className="text-3xl font-black">이번 주 배지</h1><p className="mt-3 leading-7 text-muted-foreground">이번 목표는 1차시를 끝내고 ‘첫걸음 탐험가’가 되는 거예요.</p></div>
      {badge.loading ? <output>배지 기록을 불러오는 중…</output> : badge.error ? <div role="alert" className="rounded-3xl border bg-card p-6"><p>배지 기록을 불러오지 못했어요. 다시 시도해 주세요.</p><Button className="mt-4" onClick={badge.retry}>다시 불러오기</Button></div> : <>
        <section className={`rounded-3xl border p-6 sm:p-8 ${badge.earned ? 'border-amber-300 bg-amber-50' : 'bg-card'}`} aria-labelledby="badge-title">
          <div className="flex items-center gap-4"><div className={`grid size-16 shrink-0 place-items-center rounded-2xl ${badge.earned ? 'bg-amber-200 text-amber-800' : 'bg-muted text-muted-foreground'}`}><Trophy className="size-8" aria-hidden="true" /></div><div><output className="font-bold text-primary">{badge.earned ? '배지 획득 완료!' : '아직 도전 중'}</output><h2 id="badge-title" className="mt-1 text-2xl font-black">첫걸음 탐험가</h2></div></div>
          <p className="mt-5 leading-7">{badge.earned ? '1차시를 끝냈어요. 컴퓨터에게 명령하는 방법의 변화를 탐험한 여러분에게 박수를 보내요!' : '아래 조건을 채운 뒤 1차시의 마지막 단계에서 완료하고 저장하면 배지가 표시돼요.'}</p>
          <ul className="mt-5 space-y-4">{badge.requirements.map(item => <li key={item.label} className="flex items-start gap-3">{item.done ? <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-700" aria-hidden="true" /> : <Circle className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />}<span><span className="font-bold">{item.done ? '완료' : '남은 조건'}</span> · {item.label}</span></li>)}</ul>
          <p className="mt-5 text-sm leading-6 text-muted-foreground">저장된 나의 학습 기록으로 확인해요. 주가 바뀌어도 기록은 사라지지 않아요. 완료 후 답을 수정하면 다시 완료 저장이 필요해요.</p>
        </section>
        {/* oxlint-disable-next-line next/no-html-link-for-pages */}
        <a href="/lesson/1" className={buttonVariants({ size: 'lg' })}>{badge.earned ? '1차시 다시 보기' : '1차시 이어서 배우기'}<ArrowRight /></a>
      </>}
    </main>
  </div>;
}
