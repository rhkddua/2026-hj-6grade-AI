-- Application-level staff roles. This does not grant Supabase dashboard access.
create table if not exists public.staff_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 50),
  role text not null check (role in ('teacher', 'super_admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.staff_profiles enable row level security;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.staff_profiles
    where user_id = (select auth.uid())
      and role = 'super_admin'
  );
$$;

revoke all on function public.is_super_admin() from public;
grant execute on function public.is_super_admin() to authenticated;

drop policy if exists "Staff can read own profile" on public.staff_profiles;
create policy "Staff can read own profile"
on public.staff_profiles for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Super admins can read staff profiles" on public.staff_profiles;
create policy "Super admins can read staff profiles"
on public.staff_profiles for select
to authenticated
using ((select public.is_super_admin()));

drop policy if exists "Super admins can manage student profiles" on public.student_profiles;
create policy "Super admins can manage student profiles"
on public.student_profiles for all
to authenticated
using ((select public.is_super_admin()))
with check ((select public.is_super_admin()));

drop policy if exists "Super admins can manage lesson progress" on public.lesson_progress;
create policy "Super admins can manage lesson progress"
on public.lesson_progress for all
to authenticated
using ((select public.is_super_admin()))
with check ((select public.is_super_admin()));
