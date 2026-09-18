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

export { koreanAuthError } from './auth-errors';
