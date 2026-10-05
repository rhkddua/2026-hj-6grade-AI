-- 학생 본인의 앱만 저장·조회·수정할 수 있습니다. 삭제는 복원 가능한 휴지통 이동입니다.
create table if not exists public.student_apps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.student_profiles(user_id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 80),
  lesson_no smallint not null check (lesson_no between 5 and 10),
  url text not null check (char_length(url) <= 2000 and url ~ '^https?://[^[:space:]]+$'),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.student_apps enable row level security;
revoke all on public.student_apps from anon, authenticated;
grant select, insert, update on public.student_apps to authenticated;
drop policy if exists "Students read own apps" on public.student_apps;
create policy "Students read own apps" on public.student_apps for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Students create own apps" on public.student_apps;
create policy "Students create own apps" on public.student_apps for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Students update own apps" on public.student_apps;
create policy "Students update own apps" on public.student_apps for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create index if not exists student_apps_user_id_idx on public.student_apps(user_id);
