import {
  AlertCircle, ArrowLeft, BarChart3, CheckCircle2, ChevronRight,
  Clock3, Code2, Download, Eye, MessageSquareText, Settings2, Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const students = [
  { no: 1, name: '학생 1', progress: 20, state: '완료', score: '3/3' },
  { no: 2, name: '학생 2', progress: 20, state: '진행 중', score: '2/3' },
  { no: 3, name: '학생 3', progress: 10, state: '도움 필요', score: '1/3' },
  { no: 4, name: '학생 4', progress: 20, state: '완료', score: '3/3' },
  { no: 5, name: '학생 5', progress: 0, state: '미접속', score: '-' },
];

export default function TeacherPage() {
  return (
    <div className="min-h-screen bg-[#f6f7f5] text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground"><Code2 className="size-5" /></div><div><p className="font-black">AI 코딩 교실</p><p className="text-xs text-muted-foreground">교사용 수업 관리</p></div></div>
          <div className="flex items-center gap-2"><a href="/" className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-muted-foreground hover:bg-muted"><ArrowLeft className="size-4" />학생 화면</a><Button variant="outline" size="icon-lg" aria-label="설정"><Settings2 className="size-4.5" /></Button></div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-sm font-bold text-primary">2026학년도 · 6학년 1반</p><h1 className="mt-1 font-heading text-3xl font-black tracking-[-0.03em]">수업 진행 현황</h1><p className="mt-2 text-sm text-muted-foreground">2차시 · 전통적인 코딩과 AI 코딩</p></div>
          <div className="flex gap-2"><Button variant="outline"><Download data-icon="inline-start" />결과 내려받기</Button><Button>차시 관리<ChevronRight data-icon="inline-end" /></Button></div>
        </div>

        <section className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: '전체 학생', value: '24명', note: '학급 등록', icon: Users, color: 'bg-teal-100 text-teal-700' },
            { label: '접속 중', value: '21명', note: '3명 미접속', icon: Eye, color: 'bg-blue-100 text-blue-700' },
            { label: '제출 완료', value: '12명', note: '완료율 50%', icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700' },
            { label: '도움 필요', value: '3명', note: '확인이 필요해요', icon: AlertCircle, color: 'bg-orange-100 text-orange-700' },
          ].map((item) => <article key={item.label} className="rounded-3xl border bg-card p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm font-bold text-muted-foreground">{item.label}</p><p className="mt-2 text-3xl font-black">{item.value}</p><p className="mt-1 text-xs text-muted-foreground">{item.note}</p></div><div className={`grid size-11 place-items-center rounded-2xl ${item.color}`}><item.icon className="size-5" /></div></div></article>)}
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <article className="overflow-hidden rounded-3xl border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b px-5 py-4 sm:px-6"><div><h2 className="font-heading text-lg font-black">학생별 진행 상황</h2><p className="mt-1 text-xs text-muted-foreground">최근 저장된 내용을 기준으로 표시합니다.</p></div><Badge variant="outline">5명 미리보기</Badge></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[660px] text-left text-sm">
                <thead className="bg-muted/60 text-xs text-muted-foreground"><tr><th className="px-6 py-3 font-bold">학생</th><th className="px-4 py-3 font-bold">전체 진도</th><th className="px-4 py-3 font-bold">현재 상태</th><th className="px-4 py-3 font-bold">퀴즈</th><th className="px-4 py-3 font-bold">확인</th></tr></thead>
                <tbody>{students.map((student) => <tr key={student.no} className="border-t"><td className="px-6 py-4"><p className="font-extrabold">{student.name}</p><p className="text-xs text-muted-foreground">{student.no}번</p></td><td className="px-4 py-4"><div className="flex items-center gap-3"><Progress value={student.progress} className="w-28" /><span className="text-xs font-bold">{student.progress}%</span></div></td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${student.state === '완료' ? 'bg-emerald-100 text-emerald-800' : student.state === '도움 필요' ? 'bg-orange-100 text-orange-800' : 'bg-stone-100 text-stone-600'}`}>{student.state}</span></td><td className="px-4 py-4 font-bold">{student.score}</td><td className="px-4 py-4"><Button variant="ghost" size="sm">상세 보기</Button></td></tr>)}</tbody>
              </table>
            </div>
          </article>

          <div className="space-y-5">
            <article className="rounded-3xl border bg-card p-5 shadow-sm"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-2xl bg-violet-100 text-violet-700"><BarChart3 className="size-5" /></div><div><h2 className="font-heading font-black">오늘의 수업 요약</h2><p className="text-xs text-muted-foreground">2차시 실시간 현황</p></div></div><div className="mt-5 space-y-4"><div><div className="flex justify-between text-sm font-bold"><span>평균 진행률</span><span>58%</span></div><Progress value={58} className="mt-2" /></div><div className="flex items-center justify-between rounded-2xl bg-muted/60 p-4"><span className="flex items-center gap-2 text-sm font-bold"><Clock3 className="size-4 text-primary" />평균 활동 시간</span><span className="font-black">18분</span></div></div></article>
            <article className="rounded-3xl border border-orange-200 bg-orange-50 p-5"><div className="flex items-center gap-2 font-black text-orange-950"><MessageSquareText className="size-5 text-orange-600" />도움 요청 3건</div><p className="mt-2 text-sm leading-6 text-orange-900/80">학생 3, 학생 11, 학생 18이 활동 중 도움을 요청했습니다.</p><Button className="mt-4 w-full bg-orange-600 text-white hover:bg-orange-700">요청 확인하기</Button></article>
          </div>
        </section>
      </main>
    </div>
  );
}
