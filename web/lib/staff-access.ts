import { supabase } from '@/lib/supabase';

export type AdminProfile = {
  user_id: string;
  display_name: string;
  role: 'teacher' | 'super_admin';
  grade: number | null;
  class_no: number | null;
};

// The RPC rejects unassigned teachers. The DB remains the source of authority.
export async function loadStaffAccess(): Promise<AdminProfile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc('read_staff_access');
  if (error) throw error;
  return (data?.[0] as AdminProfile | undefined) ?? null;
}
