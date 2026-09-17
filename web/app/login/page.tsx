'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, BookOpenCheck, CheckCircle2, Code2, LoaderCircle, LockKeyhole, Mail, UserRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { koreanAuthError } from '@/lib/student-auth';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type Mode = 'login' | 'signup';

export default function StudentLoginPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [studentName, setStudentName] = useState('');
  const [classNo, setClassNo] = useState('1');
  const [studentNo, setStudentNo] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data.user && !data.user.is_anonymous) window.location.replace('/');
    });
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setNotice('');
    if (!supabase || !isSupabaseConfigured) {
      setError('로그인 서비스 연결을 확인하고 있습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }
    if (mode === 'signup' && password !== passwordConfirm) {
      setError('비밀번호가 서로 다릅니다.');
      return;
    }

    setBusy(true);
    if (mode === 'login') {
      const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      setBusy(false);
      if (authError) setError(koreanAuthError(authError.message));
      else window.location.replace('/');
      return;
    }

    const parsedClassNo = Number(classNo);
    const parsedStudentNo = Number(studentNo);
    if (!studentName.trim() || parsedClassNo < 1 || parsedStudentNo < 1) {
      setBusy(false);
      setError('이름, 반, 번호를 모두 입력해 주세요.');
      return;
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { student_name: studentName.trim(), grade: 6, class_no: parsedClassNo, student_no: parsedStudentNo },
      },
    });
    setBusy(false);
    if (authError) {
      setError(koreanAuthError(authError.message));
    } else if (data.session) {
      window.location.replace('/');
    } else {
      setNotice('가입 신청이 완료되었습니다. 이메일에서 확인 링크를 누른 뒤 로그인해 주세요.');
      setMode('login');
      setPassword('');
      setPasswordConfirm('');
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_15%_15%,oklch(.93_.06_188),transparent_30%),linear-gradient(135deg,oklch(.985_.01_85),oklch(.96_.025_185))] px-4 py-8 sm:grid sm:place-items-center sm:py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[30px] border bg-card shadow-[0_30px_80px_-45px_rgb(15_75_72/65%)] lg:grid-cols-[.9fr_1.1fr]">
        <section className="hidden bg-gradient-to-br from-teal-900 to-teal-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div><div className="grid size-12 place-items-center rounded-2xl bg-white/15"><Code2 className="size-6" /></div><h1 className="mt-8 font-heading text-4xl font-black leading-tight">배우고, 만들고,<br />나의 기록을 쌓아요.</h1><p className="mt-4 max-w-sm leading-7 text-teal-50/85">로그인하면 어느 컴퓨터에서든 나의 수업 진도와 활동 결과를 이어서 볼 수 있어요.</p></div>
          <div className="space-y-3 text-sm font-bold text-teal-50"><p className="flex items-center gap-2"><CheckCircle2 className="size-4 text-orange-300" />내 학습 진도 저장</p><p className="flex items-center gap-2"><CheckCircle2 className="size-4 text-orange-300" />퀴즈와 생각 기록 보관</p><p className="flex items-center gap-2"><LockKeyhole className="size-4 text-orange-300" />내 기록은 나만 확인</p></div>
        </section>

        <section className="p-6 sm:p-10">
          <div className="flex items-center gap-3 lg:hidden"><div className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground"><Code2 className="size-5" /></div><div><p className="font-heading text-lg font-black">AI 코딩 교실</p><p className="text-xs text-muted-foreground">학생 계정</p></div></div>
          <div className="mt-8 flex rounded-2xl bg-muted p-1 lg:mt-0" role="tablist" aria-label="계정 메뉴">
            <button type="button" role="tab" aria-selected={mode === 'login'} onClick={() => { setMode('login'); setError(''); }} className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-extrabold ${mode === 'login' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`}>로그인</button>
            <button type="button" role="tab" aria-selected={mode === 'signup'} onClick={() => { setMode('signup'); setError(''); }} className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-extrabold ${mode === 'signup' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`}>처음 가입하기</button>
          </div>

          <div className="mt-7"><p className="text-sm font-bold text-primary">학생용</p><h2 className="mt-1 font-heading text-2xl font-black sm:text-3xl">{mode === 'login' ? '다시 만나서 반가워요!' : '나의 학생 계정을 만들어요'}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{mode === 'login' ? '가입할 때 사용한 이메일과 비밀번호를 입력하세요.' : '교실에서 사용할 정보만 정확하게 입력하세요.'}</p></div>

          <form className="mt-7 space-y-4" onSubmit={submit}>
            {mode === 'signup' && <div className="grid gap-4 sm:grid-cols-[1fr_90px_90px]">
              <div className="space-y-2"><Label htmlFor="student-name">이름</Label><Input id="student-name" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="홍길동" minLength={2} maxLength={30} required /></div>
              <div className="space-y-2"><Label htmlFor="class-no">반</Label><Input id="class-no" type="number" value={classNo} onChange={(e) => setClassNo(e.target.value)} min={1} max={20} required /></div>
              <div className="space-y-2"><Label htmlFor="student-no">번호</Label><Input id="student-no" type="number" value={studentNo} onChange={(e) => setStudentNo(e.target.value)} min={1} max={50} required /></div>
            </div>}
            <div className="space-y-2"><Label htmlFor="email">이메일</Label><div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@example.com" className="pl-10" autoComplete="email" required /></div></div>
            <div className="space-y-2"><Label htmlFor="password">비밀번호</Label><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6자 이상" className="pl-10" minLength={6} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required /></div></div>
            {mode === 'signup' && <div className="space-y-2"><Label htmlFor="password-confirm">비밀번호 확인</Label><Input id="password-confirm" type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} placeholder="같은 비밀번호를 한 번 더 입력" minLength={6} autoComplete="new-password" required /></div>}
            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-bold leading-6 text-red-700">{error}</p>}
            {notice && <p className="rounded-xl bg-emerald-50 p-3 text-sm font-bold leading-6 text-emerald-800">{notice}</p>}
            <Button type="submit" size="lg" className="w-full" disabled={busy}>{busy ? <><LoaderCircle className="animate-spin" />처리 중</> : <>{mode === 'login' ? <UserRound /> : <BookOpenCheck />}{mode === 'login' ? '로그인하기' : '학생 계정 만들기'}<ArrowRight /></>}</Button>
          </form>
          <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">비밀번호는 다른 사람에게 알려 주지 마세요. 계정 문제는 담임 선생님께 도움을 요청하세요.</p>
        </section>
      </div>
    </main>
  );
}
