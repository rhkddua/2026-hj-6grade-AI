'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle, BarChart3, BookOpenCheck, CheckCircle2, ChevronRight,
  Download, LayoutDashboard, LoaderCircle, LogOut, RefreshCw,
  Search, ShieldCheck, TrendingUp, UserRound, Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { signOutAdmin, useAdminSession } from '@/lib/admin-auth';
import { AdminProgress, AdminStudent, loadAdminDashboard } from '@/lib/admin-dashboard';

const ACTIVE_LESSONS = 10;

type AdminView = 'dashboard' | 'students' | 'lessons';

const ADMIN_VIEWS = [
  { id: 'dashboard' as const, label: '대시보드', icon: LayoutDashboard },
  { id: 'students' as const, label: '학생 현황', icon: Users },
  { id: 'lessons' as const, label: '차시별 진도', icon: BookOpenCheck },
];

const ADMIN_VIEW_COPY: Record<AdminView, { eyebrow: string; title: string; description: string }> = {
  dashboard: {
    eyebrow: '운영 현황',
    title: '관리자 대시보드',
    description: `등록 학생과 1~${ACTIVE_LESSONS}차시 학습 기록을 한눈에 확인합니다.`,
  },
  students: {
    eyebrow: '학생 관리',
    title: '학생 현황',
    description: '학생별 참여·완료 상태와 최근 활동을 검색하고 확인합니다.',
  },
  lessons: {
    eyebrow: '수업 진도',
    title: '차시별 진도',
    description: `1~${ACTIVE_LESSONS}차시의 완료 인원과 전체 완료율을 확인합니다.`,
  },
};

function formatDate(value: string | null) {
  if (!value) return '활동 없음';
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function downloadCsv(students: AdminStudent[]) {
  const header = ['학년', '반', '번호', '이름', '시작 차시', '완료 차시', '평균 퀴즈', '최근 차시', '최근 활동'];
  const rows = students.map((student) => [
    student.grade,
    student.classNo,
    student.studentNo,
    student.name,
    student.startedLessons,
    student.completedLessons,
    student.averageQuizScore ?? '',
    student.latestLesson ?? '',
    student.latestUpdatedAt ?? '',
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
    .join('\r\n');
  const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `ai-coding-students-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function AdminPage() {
  const { profile, loading: authLoading, error: authError } = useAdminSession();
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [progress, setProgress] = useState<AdminProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [lessonFilter, setLessonFilter] = useState('all');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<AdminView>('dashboard');

  useEffect(() => {
    function syncViewFromHash() {
      const hash = window.location.hash.slice(1);
      setActiveView(hash === 'students' || hash === 'lessons' ? hash : 'dashboard');
    }

    syncViewFromHash();
    window.addEventListener('hashchange', syncViewFromHash);
    return () => window.removeEventListener('hashchange', syncViewFromHash);
  }, []);

  async function refresh() {
    setLoading(true);
    setError('');
    try {
      const data = await loadAdminDashboard();
      setStudents(data.students);
      setProgress(data.progress);
    } catch {
      setError('학생 현황을 불러오지 못했습니다. 권한과 네트워크 연결을 확인해 주세요.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authLoading && profile) {
      void Promise.resolve().then(() => refresh());
    }
  }, [authLoading, profile]);

  const classOptions = useMemo(() => [...new Set(students.map((student) => student.classNo))].sort((a, b) => a - b), [students]);
  const filteredStudents = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return students.filter((student) => {
      const matchesSearch = !keyword || student.name.toLowerCase().includes(keyword) || String(student.studentNo).includes(keyword);
      const matchesClass = classFilter === 'all' || student.classNo === Number(classFilter);
      const matchesLesson = lessonFilter === 'all' || progress.some((item) => item.userId === student.userId && item.lessonNo === Number(lessonFilter));
      return matchesSearch && matchesClass && matchesLesson;
    });
  }, [classFilter, lessonFilter, progress, search, students]);

  const selectedStudent = students.find((student) => student.userId === selectedUserId) ?? null;
  const selectedProgress = selectedStudent
    ? progress.filter((item) => item.userId === selectedStudent.userId).sort((a, b) => a.lessonNo - b.lessonNo)
    : [];
  const completedRecords = progress.filter((item) => item.completed).length;
  const participatingStudents = students.filter((student) => student.startedLessons > 0).length;
  const totalPossible = students.length * ACTIVE_LESSONS;
  const completionRate = totalPossible > 0 ? Math.round((completedRecords / totalPossible) * 100) : 0;
  const needsAttention = students.filter((student) => student.startedLessons > 0 && student.completedLessons === 0).length;
  const activeViewCopy = ADMIN_VIEW_COPY[activeView];

  function openView(view: AdminView) {
    setActiveView(view);
    const nextUrl = view === 'dashboard' ? window.location.pathname : `${window.location.pathname}#${view}`;
    window.history.replaceState(null, '', nextUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (authLoading || (!profile && !authError)) {
    return <div className="grid min-h-screen place-items-center bg-slate-950 text-slate-200"><p className="flex items-center gap-2 font-bold"><LoaderCircle className="size-5 animate-spin" />관리자 권한을 확인하는 중...</p></div>;
  }

  if (authError) {
    return <div className="grid min-h-screen place-items-center bg-slate-950 px-4"><div className="max-w-md rounded-3xl border border-red-400/30 bg-slate-900 p-7 text-center text-white"><AlertTriangle className="mx-auto size-8 text-red-300" /><h1 className="mt-4 text-xl font-black">관리자 화면을 열 수 없습니다</h1><p className="mt-2 leading-7 text-slate-300">{authError}</p><Link href="/admin/login" className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-bold text-slate-950">관리자 로그인</Link></div></div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950 text-white">
        <div className="mx-auto flex h-18 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-2xl bg-teal-600"><ShieldCheck className="size-5" /></div><div><p className="font-heading text-lg font-black">AI 코딩 교실</p><p className="text-xs text-slate-400">최고관리자 콘솔</p></div></div>
          <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-bold">{profile?.display_name}</p><p className="text-xs text-teal-300">Super Admin</p></div><Button variant="ghost" size="icon-lg" className="text-slate-300 hover:bg-slate-800 hover:text-white" aria-label="관리자 로그아웃" onClick={() => void signOutAdmin()}><LogOut className="size-5" /></Button></div>
        </div>
      </header>

      <nav aria-label="모바일 관리자 메뉴" className="sticky top-18 z-20 grid grid-cols-3 border-b border-slate-200 bg-white p-2 shadow-sm lg:hidden">
        {ADMIN_VIEWS.map((item) => {
          const isActive = activeView === item.id;
          return <button key={item.id} type="button" aria-current={isActive ? 'page' : undefined} onClick={() => openView(item.id)} className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-black transition-colors ${isActive ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-100'}`}><item.icon className="size-4" />{item.label}</button>;
        })}
      </nav>

      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden min-h-[calc(100vh-72px)] border-r border-slate-200 bg-white px-4 py-6 lg:block">
          <nav aria-label="관리자 메뉴" className="space-y-1.5">
            {ADMIN_VIEWS.map((item) => {
              const isActive = activeView === item.id;
              return <button key={item.id} type="button" aria-current={isActive ? 'page' : undefined} onClick={() => openView(item.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition-colors ${isActive ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-100'}`}><item.icon className="size-4.5" />{item.label}</button>;
            })}
          </nav>
          <div className="mt-8 rounded-2xl border border-teal-200 bg-teal-50 p-4"><p className="flex items-center gap-2 text-sm font-black text-teal-950"><ShieldCheck className="size-4" />보호된 관리자 영역</p><p className="mt-2 text-sm leading-6 text-teal-900/75">학생 데이터는 최고관리자 권한과 데이터베이스 정책을 모두 통과해야 표시됩니다.</p></div>
        </aside>

        <main id={activeView} className="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div><p className="text-sm font-bold text-teal-700">{activeViewCopy.eyebrow}</p><h1 className="mt-1 font-heading text-3xl font-black tracking-[-0.04em] sm:text-4xl">{activeViewCopy.title}</h1><p className="mt-2 text-base text-slate-600">{activeViewCopy.description}</p></div>
            <div className="flex flex-wrap gap-2">{activeView !== 'lessons' && <Button variant="outline" onClick={() => downloadCsv(filteredStudents)} disabled={filteredStudents.length === 0}><Download data-icon="inline-start" />CSV 내려받기</Button>}<Button onClick={() => void refresh()} disabled={loading} className="bg-slate-950 text-white hover:bg-slate-800"><RefreshCw className={loading ? 'animate-spin' : ''} data-icon="inline-start" />새로고침</Button></div>
          </section>

          {activeView === 'dashboard' && <><section className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: '등록 학생', value: `${students.length}명`, note: `${classOptions.length}개 학급`, icon: Users, color: 'bg-teal-100 text-teal-700' },
              { label: '학습 참여', value: `${participatingStudents}명`, note: `${students.length - participatingStudents}명 활동 없음`, icon: UserRound, color: 'bg-blue-100 text-blue-700' },
              { label: '완료 기록', value: `${completedRecords}건`, note: `전체 완료율 ${completionRate}%`, icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700' },
              { label: '확인 필요', value: `${needsAttention}명`, note: '시작했지만 완료 없음', icon: AlertTriangle, color: 'bg-orange-100 text-orange-700' },
            ].map((item) => <article key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm font-bold text-slate-500">{item.label}</p><p className="mt-2 text-3xl font-black">{item.value}</p><p className="mt-1 text-xs text-slate-500">{item.note}</p></div><div className={`grid size-11 place-items-center rounded-2xl ${item.color}`}><item.icon className="size-5" /></div></div></article>)}
          </section>

          <section className="mt-5 grid gap-5 md:grid-cols-2">
            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="grid size-11 place-items-center rounded-2xl bg-teal-100 text-teal-700"><Users className="size-5" /></div><h2 className="mt-4 font-heading text-xl font-black">학생 현황</h2><p className="mt-2 text-sm leading-6 text-slate-600">등록 학생 {students.length}명 중 {participatingStudents}명이 학습에 참여했습니다.</p><Button variant="outline" className="mt-5" onClick={() => openView('students')}>학생 현황 열기<ChevronRight data-icon="inline-end" /></Button></article>
            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="grid size-11 place-items-center rounded-2xl bg-violet-100 text-violet-700"><BookOpenCheck className="size-5" /></div><h2 className="mt-4 font-heading text-xl font-black">차시별 진도</h2><p className="mt-2 text-sm leading-6 text-slate-600">완료 기록 {completedRecords}건, 전체 완료율은 {completionRate}%입니다.</p><Button variant="outline" className="mt-5" onClick={() => openView('lessons')}>차시별 진도 열기<ChevronRight data-icon="inline-end" /></Button></article>
          </section></>}

          {activeView === 'students' && <section className="mt-7 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5 sm:p-6">
              <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end"><div><h2 className="font-heading text-xl font-black">학생별 학습 현황</h2><p className="mt-1 text-sm text-slate-500">최근 저장 기록을 기준으로 표시합니다.</p></div><div className="grid gap-2 sm:grid-cols-[minmax(220px,1fr)_140px_160px]"><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="이름 또는 번호 검색" className="pl-10" aria-label="학생 검색" /></div><select value={classFilter} onChange={(event) => setClassFilter(event.target.value)} className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm font-bold" aria-label="학급 선택"><option value="all">전체 학급</option>{classOptions.map((classNo) => <option key={classNo} value={classNo}>{classNo}반</option>)}</select><select value={lessonFilter} onChange={(event) => setLessonFilter(event.target.value)} className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm font-bold" aria-label="차시 선택"><option value="all">전체 차시</option>{Array.from({ length: ACTIVE_LESSONS }, (_, index) => index + 1).map((lessonNo) => <option key={lessonNo} value={lessonNo}>{lessonNo}차시 기록 있음</option>)}</select></div></div>
            </div>

            {error && <div role="alert" className="m-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
            {loading ? <div className="grid min-h-64 place-items-center"><p className="flex items-center gap-2 font-bold text-slate-500"><LoaderCircle className="size-5 animate-spin" />학생 데이터를 불러오는 중...</p></div> : filteredStudents.length === 0 ? <div className="grid min-h-64 place-items-center p-6 text-center"><div><Users className="mx-auto size-8 text-slate-300" /><p className="mt-3 font-black">조건에 맞는 학생이 없습니다</p><p className="mt-1 text-sm text-slate-500">검색어 또는 필터를 바꿔 보세요.</p></div></div> : <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="px-6 py-3 font-bold">학생</th><th className="px-4 py-3 font-bold">학급</th><th className="px-4 py-3 font-bold">전체 진도</th><th className="px-4 py-3 font-bold">최근 차시</th><th className="px-4 py-3 font-bold">평균 퀴즈</th><th className="px-4 py-3 font-bold">최근 활동</th><th className="px-4 py-3 font-bold">상세</th></tr></thead>
                <tbody>{filteredStudents.map((student) => { const percent = Math.round((student.completedLessons / ACTIVE_LESSONS) * 100); return <tr key={student.userId} className="border-t border-slate-100 hover:bg-slate-50/80"><td className="px-6 py-4"><p className="font-extrabold">{student.name}</p><p className="text-xs text-slate-500">{student.studentNo}번</p></td><td className="px-4 py-4 font-bold">{student.grade}학년 {student.classNo}반</td><td className="px-4 py-4"><div className="flex min-w-36 items-center gap-3"><Progress value={percent} className="w-24" /><span className="text-xs font-black">{student.completedLessons}/{ACTIVE_LESSONS}</span></div></td><td className="px-4 py-4">{student.latestLesson ? <Badge variant="outline">{student.latestLesson}차시</Badge> : <span className="text-slate-400">-</span>}</td><td className="px-4 py-4 font-bold">{student.averageQuizScore ?? '-'}</td><td className="px-4 py-4 text-slate-600">{formatDate(student.latestUpdatedAt)}</td><td className="px-4 py-4"><Button variant="ghost" size="sm" onClick={() => setSelectedUserId(student.userId)}>보기<ChevronRight data-icon="inline-end" /></Button></td></tr>; })}</tbody>
              </table>
            </div>}
          </section>}

          {activeView === 'lessons' && <section className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-2xl bg-violet-100 text-violet-700"><BarChart3 className="size-5" /></div><div><h2 className="font-heading text-lg font-black">차시별 완료 현황</h2><p className="text-sm text-slate-500">완료 저장된 학생 수</p></div></div><div className="mt-6 space-y-4">{Array.from({ length: ACTIVE_LESSONS }, (_, index) => index + 1).map((lessonNo) => { const count = progress.filter((item) => item.lessonNo === lessonNo && item.completed).length; const percent = students.length > 0 ? Math.round((count / students.length) * 100) : 0; return <div key={lessonNo}><div className="mb-2 flex items-center justify-between text-sm font-bold"><span>{lessonNo}차시</span><span>{count}명 · {percent}%</span></div><Progress value={percent} /></div>; })}</div></article>
            <article className="rounded-3xl border border-slate-800 bg-slate-950 p-6 text-white shadow-sm"><TrendingUp className="size-7 text-teal-300" /><h2 className="mt-4 font-heading text-xl font-black">운영 요약</h2><p className="mt-2 text-sm leading-6 text-slate-300">현재 공개된 {ACTIVE_LESSONS}개 차시에서 총 {progress.length}건의 학습 기록이 저장되어 있습니다.</p><div className="mt-6 rounded-2xl bg-white/8 p-4"><p className="text-sm text-slate-400">전체 차시 완료율</p><p className="mt-1 text-4xl font-black text-teal-300">{completionRate}%</p></div></article>
          </section>}
        </main>
      </div>

      {selectedStudent && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/65 p-4" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setSelectedUserId(null); }}><dialog open aria-labelledby="student-detail-title" className="relative m-0 max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 text-slate-950 shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-4"><div><Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">{selectedStudent.grade}학년 {selectedStudent.classNo}반 {selectedStudent.studentNo}번</Badge><h2 id="student-detail-title" className="mt-3 font-heading text-2xl font-black">{selectedStudent.name} 학생</h2><p className="mt-1 text-sm text-slate-500">차시별 저장 상태와 성찰 기록</p></div><Button variant="outline" size="sm" onClick={() => setSelectedUserId(null)}>닫기</Button></div><div className="mt-6 space-y-3">{Array.from({ length: ACTIVE_LESSONS }, (_, index) => index + 1).map((lessonNo) => { const item = selectedProgress.find((entry) => entry.lessonNo === lessonNo); return <article key={lessonNo} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><div className={`grid size-9 place-items-center rounded-xl font-black ${item?.completed ? 'bg-emerald-100 text-emerald-700' : item ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-400'}`}>{lessonNo}</div><div><p className="font-black">{lessonNo}차시</p><p className="text-xs text-slate-500">{item ? `${item.currentStep}단계 · ${formatDate(item.updatedAt)}` : '아직 저장된 활동이 없습니다'}</p></div></div>{item?.completed ? <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">완료</Badge> : item ? <Badge variant="outline">진행 중</Badge> : null}</div>{item?.reflection && <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-700"><strong>성찰:</strong> {item.reflection}</div>}</article>; })}</div></dialog></div>}
    </div>
  );
}
