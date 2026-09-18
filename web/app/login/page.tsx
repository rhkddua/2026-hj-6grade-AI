'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Code2, LoaderCircle, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { koreanAuthError } from '@/lib/auth-errors';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export default function StudentLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data.user && !data.user.is_anonymous) window.location.replace('/');
    });
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!supabase || !isSupabaseConfigured) {
      setError('로그인 서비스 연결을 확인하고 있습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    setBusy(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (authError) setError(koreanAuthError(authError.message, authError.code));
      else window.location.replace('/');
    } catch {
      setError('서버에 연결하지 못했어요. 인터넷 연결을 확인한 뒤 다시 시도해 주세요.');
    } finally {
      setBusy(false);
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
          <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground"><Code2 className="size-5" /></div><div><p className="font-heading text-lg font-black">AI 코딩 교실</p><p className="text-xs text-muted-foreground">학생 계정</p></div></div>
          <div className="mt-8"><p className="text-sm font-bold text-primary">학생용</p><h1 className="mt-1 font-heading text-2xl font-black sm:text-3xl">수업 계정으로 로그인해요</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">선생님에게 받은 이메일과 비밀번호를 입력하세요.</p></div>
          <div className="mt-6 rounded-2xl bg-secondary/70 p-4 text-sm font-bold leading-6 text-secondary-foreground">학생 계정은 선생님이 미리 만들어 줍니다. 이 화면에서는 새 계정을 만들지 않아요.</div>

          <form className="mt-7 space-y-4" onSubmit={submit}>
            <div className="space-y-2"><Label htmlFor="email">이메일</Label><div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="선생님에게 받은 이메일" className="pl-10" autoComplete="username" required /></div></div>
            <div className="space-y-2"><Label htmlFor="password">비밀번호</Label><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="선생님에게 받은 비밀번호" className="pl-10" autoComplete="current-password" required /></div></div>
            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-bold leading-6 text-red-700">{error}</p>}
            <Button type="submit" size="lg" className="w-full" disabled={busy}>{busy ? <><LoaderCircle className="animate-spin" />로그인 중</> : <><UserRound />로그인하기<ArrowRight /></>}</Button>
          </form>
          <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">계정 또는 비밀번호에 문제가 있으면 담임 선생님께 도움을 요청하세요.</p>
        </section>
      </div>
    </main>
  );
}
