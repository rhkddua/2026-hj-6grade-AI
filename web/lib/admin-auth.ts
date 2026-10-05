'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import { loadStaffAccess, type AdminProfile } from '@/lib/staff-access';
export type { AdminProfile } from '@/lib/staff-access';

export function useAdminSession() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function verifyAdmin(nextUser: User | null) {
      if (!active) return;
      if (!supabase || !nextUser || nextUser.is_anonymous) {
        window.location.replace('/admin/login');
        return;
      }

      let data: AdminProfile | null = null;
      try { data = await loadStaffAccess(); } catch { /* Fail closed. */ }

      if (!active) return;
      if (!data) {
        await supabase.auth.signOut();
        setError('관리자 권한을 확인할 수 없습니다. 교사는 담당 학급 배정을 확인해 주세요.');
        setLoading(false);
        window.location.replace('/admin/login?reason=unauthorized');
        return;
      }

      setUser(nextUser);
      setProfile(data);
      setLoading(false);
    }

    if (!supabase) {
      void Promise.resolve().then(() => {
        if (!active) return;
        setError('관리자 로그인 서비스가 준비되지 않았습니다.');
        setLoading(false);
      });
      return;
    }

    void supabase.auth.getUser().then(({ data }) => void verifyAdmin(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') window.location.replace('/admin/login');
      if (event === 'SIGNED_IN' && session?.user) void verifyAdmin(session.user);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading, error };
}

export async function signOutAdmin() {
  if (supabase) await supabase.auth.signOut();
  window.location.replace('/admin/login');
}
