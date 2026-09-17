-- Supabase SQL Editor에서 한 번 실행하세요.
-- 학생 이메일/비밀번호 인증을 사용합니다.

create table if not exists public.student_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  student_name text not null check (char_length(student_name) between 2 and 30),
  grade smallint not null default 6 check (grade = 6),
  class_no smallint not null check (class_no between 1 and 20),
  student_no smallint not null check (student_no between 1 and 50),
  created_at timestamptz not null default now(),
  unique (grade, class_no, student_no)
);

alter table public.student_profiles enable row level security;

drop policy if exists "Students can read own profile" on public.student_profiles;
create policy "Students can read own profile"
on public.student_profiles for select
to authenticated
using ((select auth.uid()) = user_id);

create or replace function public.handle_new_student()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.student_profiles (user_id, student_name, grade, class_no, student_no)
  values (
    new.id,
    new.raw_user_meta_data ->> 'student_name',
    coalesce((new.raw_user_meta_data ->> 'grade')::smallint, 6),
    (new.raw_user_meta_data ->> 'class_no')::smallint,
    (new.raw_user_meta_data ->> 'student_no')::smallint
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_student();

create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_no smallint not null check (lesson_no between 1 and 10),
  current_step smallint not null default 1 check (current_step between 1 and 10),
  quiz_score smallint check (quiz_score is null or quiz_score >= 0),
  reflection text not null default '' check (char_length(reflection) <= 1000),
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_no)
);

alter table public.lesson_progress enable row level security;

drop policy if exists "Students can read own progress" on public.lesson_progress;
create policy "Students can read own progress"
on public.lesson_progress for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Students can create own progress" on public.lesson_progress;
create policy "Students can create own progress"
on public.lesson_progress for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Students can update own progress" on public.lesson_progress;
create policy "Students can update own progress"
on public.lesson_progress for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create index if not exists lesson_progress_lesson_no_idx
on public.lesson_progress (lesson_no);
