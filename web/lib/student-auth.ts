import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

export type StudentProfile = {
  user_id: string;
  student_name: string;
  grade: number;
  class_no: number;
  student_no: number;
};

export function useStudentSession() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      window.location.replace('/login');
      return;
    }

    let active = true;

    async function applyUser(nextUser: User | null) {
      if (!active) return;
      if (!nextUser || nextUser.is_anonymous) {
        if (nextUser?.is_anonymous) await supabase!.auth.signOut();
        window.location.replace('/login');
        return;
      }

      setUser(nextUser);
      const { data } = await supabase!
        .from('student_profiles')
        .select('user_id,student_name,grade,class_no,student_no')
        .eq('user_id', nextUser.id)
        .maybeSingle();
      if (!active) return;
      setProfile(data);
      setLoading(false);
    }

    supabase.auth.getUser().then(({ data }) => void applyUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') window.location.replace('/login');
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading };
}

export async function signOutStudent() {
  if (!supabase) return;
  await supabase.auth.signOut();
  window.location.replace('/login');
}

export function koreanAuthError(message: string) {
  if (message.includes('Invalid login credentials')) return '이메일 또는 비밀번호를 다시 확인해 주세요.';
  if (message.includes('User already registered')) return '이미 가입된 이메일입니다. 로그인해 주세요.';
  if (message.includes('Database error saving new user')) return '이미 등록된 반·번호인지 확인해 주세요.';
  if (message.includes('Password should be')) return '비밀번호는 6자 이상으로 만들어 주세요.';
  if (message.includes('rate limit')) return '잠시 후 다시 시도해 주세요.';
  return '처리하지 못했습니다. 입력 내용을 확인하고 다시 시도해 주세요.';
}
