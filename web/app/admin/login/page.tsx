'use client';

import { SyntheticEvent, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Code2, KeyRound, LoaderCircle, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { koreanAuthError } from '@/lib/auth-errors';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);
  const [switchingMode, setSwitchingMode] = useState(false);
  const [error, setError] = useState('');

  async function switchToStudentLogin() {
    setSwitchingMode(true);
    if (supabase) await supabase.auth.signOut();
    window.location.assign('/login');
  }

  useEffect(() => {
    let active = true;

    async function checkExistingSession() {
      if (!supabase) {
        if (active) {
          setError('관리자 로그인 서비스 연결을 확인해 주세요.');
          setChecking(false);
        }
        return;
      }

      const { data } = await supabase.auth.getUser();
      if (!active) return;
      if (!data.user || data.user.is_anonymous) {
        setChecking(false);
        return;
      }

      const { data: staff } = await supabase
        .from('staff_profiles')
        .select('role')
        .eq('user_id', data.user.id)
        .eq('role', 'super_admin')
        .maybeSingle<{ role: string }>();

      if (!active) return;
      if (staff) window.location.replace('/admin');
      else setChecking(false);
    }

    void checkExistingSession();
    return () => { active = false; };
  }, []);

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!supabase) {
      setError('관리자 로그인 서비스 연결을 확인해 주세요.');
      return;
    }

    setBusy(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError) {
        setError(koreanAuthError(authError.message, authError.code));
        return;
      }

      const { data: staff, error: roleError } = await supabase
        .from('staff_profiles')
        .select('role')
        .eq('user_id', data.user.id)
        .eq('role', 'super_admin')
        .maybeSingle<{ role: string }>();

      if (roleError || !staff) {
        await supabase.auth.signOut();
        setError('최고관리자 권한이 없는 계정입니다. 학생은 학생 로그인을 이용해 주세요.');
        return;
      }

      window.location.replace('/admin');
    } catch {
      setError('서버에 연결하지 못했습니다. 인터넷 연결을 확인한 뒤 다시 시도해 주세요.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:grid sm:place-items-center sm:py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[30px] border border-slate-700/70 bg-slate-900 shadow-[0_32px_100px_-45px_rgb(0_0_0/85%)] lg:grid-cols-[.92fr_1.08fr]">
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-teal-800 via-teal-900 to-slate-950 p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-20 -top-20 size-72 rounded-full border border-teal-300/15" aria-hidden="true" />
          <div className="relative">
            <div className="grid size-12 place-items-center rounded-2xl bg-white/10"><ShieldCheck className="size-6" /></div>
            <p className="mt-8 text-sm font-bold text-teal-200">ADMIN CONSOLE</p>
            <h1 className="mt-2 font-heading text-4xl font-black leading-tight">수업 현황을 한눈에<br />확인하고 관리해요.</h1>
            <p className="mt-4 max-w-sm leading-7 text-slate-300">학생 계정과 분리된 최고관리자 전용 입구입니다. 권한이 확인된 계정만 관리 화면에 접근할 수 있습니다.</p>
          </div>
          <div className="relative space-y-3 text-sm font-bold text-slate-200">
            <p className="flex items-center gap-2"><ShieldCheck className="size-4 text-teal-300" />최고관리자 역할 확인</p>
            <p className="flex items-center gap-2"><ShieldCheck className="size-4 text-teal-300" />학생별 학습 현황 조회</p>
            <p className="flex items-center gap-2"><ShieldCheck className="size-4 text-teal-300" />RLS 기반 데이터 보호</p>
          </div>
        </section>

        <section className="bg-white p-6 text-slate-950 sm:p-10">
          <button type="button" onClick={switchToStudentLogin} disabled={switchingMode} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-teal-800 disabled:cursor-wait disabled:opacity-60"><ArrowLeft className="size-4" />{switchingMode ? '학생 로그인으로 이동 중' : '학생 로그인으로 돌아가기'}</button>
          <div className="mt-8 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-slate-950 text-white"><Code2 className="size-5" /></div>
            <div><p className="font-heading text-lg font-black">AI 코딩 교실</p><p className="text-xs text-slate-500">최고관리자</p></div>
          </div>
          <div className="mt-8">
            <p className="text-sm font-bold text-teal-700">관리자 전용</p>
            <h2 className="mt-1 font-heading text-3xl font-black tracking-tight">관리자 계정으로 로그인</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">등록된 최고관리자 이메일과 비밀번호를 입력하세요.</p>
          </div>
          <div className="mt-6 flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            <KeyRound className="mt-0.5 size-5 shrink-0 text-teal-700" />
            <p><strong>학생 계정과 관리자 계정은 권한이 다릅니다.</strong><br />로그인 뒤 최고관리자 역할을 한 번 더 확인합니다.</p>
          </div>

          <form className="mt-7 space-y-4" onSubmit={submit}>
            <div className="space-y-2"><Label htmlFor="admin-email">관리자 이메일</Label><div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="관리자 이메일" className="pl-10" autoComplete="username" required /></div></div>
            <div className="space-y-2"><Label htmlFor="admin-password">비밀번호</Label><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="관리자 비밀번호" className="pl-10" autoComplete="current-password" required /></div></div>
            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-bold leading-6 text-red-700">{error}</p>}
            <Button type="submit" size="lg" className="w-full bg-slate-950 text-white hover:bg-slate-800" disabled={busy || checking}>
              {busy || checking ? <><LoaderCircle className="animate-spin" />{checking ? '권한 확인 중' : '로그인 중'}</> : <><ShieldCheck />관리자 로그인<ArrowRight /></>}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}
