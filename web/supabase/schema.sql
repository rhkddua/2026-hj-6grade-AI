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
  -- Supabase 관리자 화면에서 만든 계정에는 학생 메타데이터가 없을 수 있다.
  -- 이 경우 Auth 계정 생성은 허용하고, 학생 프로필은 별도로 등록한다.
  if nullif(new.raw_user_meta_data ->> 'student_name', '') is null
    or nullif(new.raw_user_meta_data ->> 'class_no', '') is null
    or nullif(new.raw_user_meta_data ->> 'student_no', '') is null then
    return new;
  end if;

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
  activity_data jsonb not null default '{}'::jsonb,
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

create table if not exists public.lesson_reflection_board (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_no smallint not null check (lesson_no between 1 and 10),
  reflection text not null check (char_length(reflection) between 10 and 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_no)
);

alter table public.lesson_reflection_board enable row level security;
revoke all on table public.lesson_reflection_board from anon, authenticated;

create or replace function public.publish_lesson_reflection(p_lesson_no smallint, p_reflection text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  clean_reflection text := btrim(p_reflection);
begin
  if (select auth.uid()) is null then raise exception '학생 로그인이 필요합니다.' using errcode = '42501'; end if;
  if p_lesson_no is null or p_lesson_no < 1 or p_lesson_no > 10 then raise exception '올바른 차시가 아닙니다.' using errcode = '22023'; end if;
  if char_length(clean_reflection) < 10 or char_length(clean_reflection) > 1000 then raise exception '문장은 10자 이상 1000자 이하로 작성해 주세요.' using errcode = '22023'; end if;
  if clean_reflection ~* '(비밀번호|전화번호|집\s*주소|이메일\s*주소|주민등록|[0-9]{2,3}[- ]?[0-9]{3,4}[- ]?[0-9]{4}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})' then raise exception '개인정보처럼 보이는 내용은 게시할 수 없습니다.' using errcode = '22023'; end if;
  insert into public.lesson_reflection_board (user_id, lesson_no, reflection)
  values ((select auth.uid()), p_lesson_no, clean_reflection)
  on conflict (user_id, lesson_no) do update set reflection = excluded.reflection, updated_at = now();
end;
$$;

create or replace function public.read_lesson_reflection_board(p_lesson_no smallint default null)
returns table (lesson_no smallint, reflection text, updated_at timestamptz)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then raise exception '학생 로그인이 필요합니다.' using errcode = '42501'; end if;
  if p_lesson_no is not null and (p_lesson_no < 1 or p_lesson_no > 10) then raise exception '올바른 차시가 아닙니다.' using errcode = '22023'; end if;
  return query select board.lesson_no, board.reflection, board.updated_at
  from public.lesson_reflection_board as board
  where p_lesson_no is null or board.lesson_no = p_lesson_no
  order by board.lesson_no, board.updated_at desc;
end;
$$;

revoke all on function public.publish_lesson_reflection(smallint, text) from public;
revoke all on function public.read_lesson_reflection_board(smallint) from public;
grant execute on function public.publish_lesson_reflection(smallint, text) to authenticated;
grant execute on function public.read_lesson_reflection_board(smallint) to authenticated;

create index if not exists lesson_reflection_board_lesson_updated_idx
on public.lesson_reflection_board (lesson_no, updated_at desc);

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
    select 1 from public.staff_profiles
    where user_id = (select auth.uid()) and role = 'super_admin'
  );
$$;

revoke all on function public.is_super_admin() from public;
grant execute on function public.is_super_admin() to authenticated;

drop policy if exists "Staff can read own profile" on public.staff_profiles;
create policy "Staff can read own profile" on public.staff_profiles for select
to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Super admins can read staff profiles" on public.staff_profiles;
create policy "Super admins can read staff profiles" on public.staff_profiles for select
to authenticated using ((select public.is_super_admin()));

drop policy if exists "Super admins can manage student profiles" on public.student_profiles;
create policy "Super admins can manage student profiles" on public.student_profiles for all
to authenticated using ((select public.is_super_admin()))
with check ((select public.is_super_admin()));

drop policy if exists "Super admins can manage lesson progress" on public.lesson_progress;
create policy "Super admins can manage lesson progress" on public.lesson_progress for all
to authenticated using ((select public.is_super_admin()))
with check ((select public.is_super_admin()));

-- Administrator board security and moderation (2026-10-05)
begin;

alter table public.lesson_reflection_board
  add column if not exists is_hidden boolean not null default false,
  add column if not exists moderation_version integer not null default 0;

create table if not exists public.reflection_moderation_audit (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null,
  actor_name text not null,
  target_user_id uuid not null,
  lesson_no smallint not null check (lesson_no between 1 and 10),
  action text not null check (action in ('hide', 'restore')),
  reason text not null check (char_length(reason) between 3 and 300),
  created_at timestamptz not null default now()
);
alter table public.reflection_moderation_audit enable row level security;
revoke all on public.reflection_moderation_audit from anon, authenticated;
create index if not exists reflection_audit_target_idx
  on public.reflection_moderation_audit(target_user_id, lesson_no, created_at desc);

create or replace function public.publish_lesson_reflection(p_lesson_no smallint, p_reflection text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  clean_reflection text := btrim(p_reflection);
begin
  if (select auth.uid()) is null
    or coalesce((select auth.jwt() ->> 'is_anonymous'), 'false') = 'true'
    or not exists (select 1 from public.student_profiles where user_id = (select auth.uid())) then
    raise exception '학생 로그인이 필요합니다.' using errcode = '42501';
  end if;
  if p_lesson_no is null or p_lesson_no < 1 or p_lesson_no > 10 then
    raise exception '올바른 차시가 아닙니다.' using errcode = '22023';
  end if;
  if clean_reflection is null or char_length(clean_reflection) < 10 or char_length(clean_reflection) > 1000 then
    raise exception '문장은 10자 이상 1000자 이하로 작성해 주세요.' using errcode = '22023';
  end if;
  if clean_reflection ~* '(비밀번호|전화번호|집\s*주소|이메일\s*주소|주민등록|[0-9]{2,3}[- ]?[0-9]{3,4}[- ]?[0-9]{4}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})' then
    raise exception '개인정보처럼 보이는 내용은 게시할 수 없습니다.' using errcode = '22023';
  end if;
  insert into public.lesson_reflection_board (user_id, lesson_no, reflection)
  values ((select auth.uid()), p_lesson_no, clean_reflection)
  on conflict (user_id, lesson_no) do update
    set reflection = excluded.reflection, updated_at = now();
  -- Reposting never clears a moderator's hidden state.
end;
$$;

create or replace function public.read_lesson_reflection_board(p_lesson_no smallint default null)
returns table (lesson_no smallint, reflection text, updated_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  if (select auth.uid()) is null
    or coalesce((select auth.jwt() ->> 'is_anonymous'), 'false') = 'true'
    or not exists (select 1 from public.student_profiles where user_id = (select auth.uid())) then
    raise exception '학생 로그인이 필요합니다.' using errcode = '42501';
  end if;
  if p_lesson_no is not null and (p_lesson_no < 1 or p_lesson_no > 10) then
    raise exception '올바른 차시가 아닙니다.' using errcode = '22023';
  end if;
  return query select b.lesson_no, b.reflection, b.updated_at
    from public.lesson_reflection_board b
    where not b.is_hidden and (p_lesson_no is null or b.lesson_no = p_lesson_no)
    order by b.lesson_no, b.updated_at desc;
end;
$$;

create or replace function public.read_admin_reflection_board(
  p_lesson_no smallint default null, p_status text default 'all',
  p_search text default '', p_offset integer default 0
)
returns table (
  user_id uuid, account_email text, student_name text, grade smallint,
  class_no smallint, student_no smallint, lesson_no smallint,
  reflection text, updated_at timestamptz, is_hidden boolean, moderation_version integer
)
language plpgsql stable security definer set search_path = '' as $$
declare
  keyword text := lower(btrim(coalesce(p_search, '')));
begin
  if not coalesce((select public.is_super_admin()), false)
    or coalesce((select auth.jwt() ->> 'is_anonymous'), 'false') = 'true' then
    raise exception '최고관리자 권한이 필요합니다.' using errcode = '42501';
  end if;
  if (p_lesson_no is not null and (p_lesson_no < 1 or p_lesson_no > 10))
    or p_status is null or p_status not in ('all', 'visible', 'hidden')
    or p_offset is null or p_offset < 0 or p_offset > 10000
    or char_length(keyword) > 100 then
    raise exception '조회 조건을 확인해 주세요.' using errcode = '22023';
  end if;
  return query
    select b.user_id, coalesce(u.email::text, ''), coalesce(s.student_name, ''),
      s.grade, s.class_no, s.student_no, b.lesson_no, b.reflection, b.updated_at,
      b.is_hidden, b.moderation_version
    from public.lesson_reflection_board b
    left join public.student_profiles s on s.user_id = b.user_id
    left join auth.users u on u.id = b.user_id
    where (p_lesson_no is null or b.lesson_no = p_lesson_no)
      and (p_status = 'all' or b.is_hidden = (p_status = 'hidden'))
      and (keyword = '' or strpos(lower(coalesce(s.student_name, '')), keyword) > 0
        or strpos(lower(coalesce(u.email::text, '')), keyword) > 0
        or strpos(b.user_id::text, keyword) > 0
        or s.student_no::text = keyword)
    order by b.updated_at desc, b.user_id, b.lesson_no
    limit 51 offset p_offset;
end;
$$;

create or replace function public.moderate_lesson_reflection(
  p_user_id uuid, p_lesson_no smallint, p_hidden boolean, p_reason text,
  p_expected_version integer, p_expected_updated_at timestamptz
)
returns void language plpgsql security definer set search_path = '' as $$
declare
  clean_reason text := btrim(p_reason);
  actor_name text;
  target public.lesson_reflection_board%rowtype;
begin
  if not coalesce((select public.is_super_admin()), false)
    or coalesce((select auth.jwt() ->> 'is_anonymous'), 'false') = 'true' then
    raise exception '최고관리자 권한이 필요합니다.' using errcode = '42501';
  end if;
  if p_hidden is null or clean_reason is null or char_length(clean_reason) < 3 or char_length(clean_reason) > 300 then
    raise exception '처리 사유를 확인해 주세요.' using errcode = '22023';
  end if;
  select * into target from public.lesson_reflection_board
    where user_id = p_user_id and lesson_no = p_lesson_no for update;
  if not found then
    raise exception '게시글을 찾을 수 없습니다.' using errcode = 'P0002';
  end if;
  if target.moderation_version is distinct from p_expected_version
    or target.updated_at is distinct from p_expected_updated_at then
    raise exception '게시글이 변경되었습니다. 다시 조회해 주세요.' using errcode = 'P0001';
  end if;
  if target.is_hidden = p_hidden then return; end if;
  select display_name into actor_name from public.staff_profiles where user_id = (select auth.uid());
  update public.lesson_reflection_board set is_hidden = p_hidden, moderation_version = moderation_version + 1
    where user_id = p_user_id and lesson_no = p_lesson_no;
  insert into public.reflection_moderation_audit(actor_id, actor_name, target_user_id, lesson_no, action, reason)
    values ((select auth.uid()), actor_name, p_user_id, p_lesson_no, case when p_hidden then 'hide' else 'restore' end, clean_reason);
end;
$$;

create or replace function public.read_admin_reflection_audit(p_user_id uuid, p_lesson_no smallint)
returns table(id uuid, actor_name text, action text, reason text, lesson_no smallint, created_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not coalesce((select public.is_super_admin()), false)
    or coalesce((select auth.jwt() ->> 'is_anonymous'), 'false') = 'true' then
    raise exception '최고관리자 권한이 필요합니다.' using errcode = '42501';
  end if;
  return query select a.id, a.actor_name, a.action, a.reason, a.lesson_no, a.created_at
    from public.reflection_moderation_audit a
    where a.target_user_id = p_user_id and a.lesson_no = p_lesson_no
    order by a.created_at desc, a.id limit 50;
end;
$$;

revoke all on public.lesson_reflection_board from anon, authenticated;
revoke all on function public.publish_lesson_reflection(smallint, text) from public, anon;
revoke all on function public.read_lesson_reflection_board(smallint) from public, anon;
revoke all on function public.read_admin_reflection_board(smallint, text, text, integer) from public, anon;
revoke all on function public.moderate_lesson_reflection(uuid, smallint, boolean, text, integer, timestamptz) from public, anon;
revoke all on function public.read_admin_reflection_audit(uuid, smallint) from public, anon;
grant execute on function public.publish_lesson_reflection(smallint, text) to authenticated;
grant execute on function public.read_lesson_reflection_board(smallint) to authenticated;
grant execute on function public.read_admin_reflection_board(smallint, text, text, integer) to authenticated;
grant execute on function public.moderate_lesson_reflection(uuid, smallint, boolean, text, integer, timestamptz) to authenticated;
grant execute on function public.read_admin_reflection_audit(uuid, smallint) to authenticated;

commit;

-- Class-scoped teacher access (2026-10-05)
-- Class-scoped staff access. No Auth accounts or passwords are changed.
begin;
create table if not exists public.teacher_class_assignments (
  user_id uuid primary key references public.staff_profiles(user_id) on delete cascade,
  grade smallint not null check (grade = 6),
  class_no smallint not null check (class_no between 1 and 20),
  created_at timestamptz not null default now()
);
alter table public.teacher_class_assignments enable row level security;
revoke all on public.teacher_class_assignments from public, anon, authenticated;
grant select on public.teacher_class_assignments to authenticated;
revoke insert, update, delete on public.staff_profiles from anon, authenticated;

create or replace function public.is_super_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce(auth.jwt()->>'is_anonymous', 'false') <> 'true'
    and exists (select 1 from public.staff_profiles where user_id = (select auth.uid()) and role = 'super_admin');
$$;

create or replace function public.is_class_staff()
returns boolean language sql stable security definer set search_path = '' as $$
  select (select auth.uid()) is not null
    and coalesce(auth.jwt()->>'is_anonymous', 'false') <> 'true'
    and (public.is_super_admin() or exists (
      select 1 from public.staff_profiles s join public.teacher_class_assignments a using (user_id)
      where s.user_id = (select auth.uid()) and s.role = 'teacher'
    ));
$$;

create or replace function public.can_manage_student(p_user_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select (select auth.uid()) is not null
    and coalesce(auth.jwt()->>'is_anonymous', 'false') <> 'true'
    and (public.is_super_admin() or exists (
      select 1 from public.staff_profiles s
      join public.teacher_class_assignments a on a.user_id = s.user_id
      join public.student_profiles p on p.grade = a.grade and p.class_no = a.class_no
      where s.user_id = (select auth.uid()) and s.role = 'teacher' and p.user_id = p_user_id
    ));
$$;

create or replace function public.is_student_account()
returns boolean language sql stable security definer set search_path = '' as $$
  select (select auth.uid()) is not null
    and coalesce(auth.jwt()->>'is_anonymous', 'false') <> 'true'
    and exists(select 1 from public.student_profiles where user_id = (select auth.uid()))
    and not exists(select 1 from public.staff_profiles where user_id = (select auth.uid()));
$$;

create or replace function public.read_staff_access()
returns table(user_id uuid, display_name text, role text, grade smallint, class_no smallint)
language sql stable security definer set search_path = '' as $$
  select s.user_id, s.display_name, s.role, a.grade, a.class_no
  from public.staff_profiles s left join public.teacher_class_assignments a using (user_id)
  where s.user_id = (select auth.uid()) and public.is_class_staff();
$$;

revoke all on function public.is_super_admin() from public, anon;
revoke all on function public.is_class_staff() from public, anon;
revoke all on function public.can_manage_student(uuid) from public, anon;
revoke all on function public.is_student_account() from public, anon;
revoke all on function public.read_staff_access() from public, anon;
grant execute on function public.is_super_admin(), public.is_class_staff(), public.can_manage_student(uuid), public.is_student_account(), public.read_staff_access() to authenticated;

drop policy if exists "Staff can read own assignment" on public.teacher_class_assignments;
create policy "Staff can read own assignment" on public.teacher_class_assignments for select to authenticated
using ((select auth.uid()) = user_id or (select public.is_super_admin()));

drop policy if exists "Teachers can read assigned students" on public.student_profiles;
create policy "Teachers can read assigned students" on public.student_profiles for select to authenticated
using (public.can_manage_student(user_id));
drop policy if exists "Teachers can read assigned progress" on public.lesson_progress;
create policy "Teachers can read assigned progress" on public.lesson_progress for select to authenticated
using (public.can_manage_student(user_id));

-- Keep student self-service, but staff cannot use self-service policies to write progress.
drop policy if exists "Students can read own profile" on public.student_profiles;
create policy "Students can read own profile" on public.student_profiles for select to authenticated
using ((select auth.uid()) = user_id and (select public.is_student_account()));
drop policy if exists "Students can read own progress" on public.lesson_progress;
create policy "Students can read own progress" on public.lesson_progress for select to authenticated
using ((select auth.uid()) = user_id and (select public.is_student_account()));
drop policy if exists "Students can create own progress" on public.lesson_progress;
create policy "Students can create own progress" on public.lesson_progress for insert to authenticated
with check ((select auth.uid()) = user_id and (select public.is_student_account()));
drop policy if exists "Students can update own progress" on public.lesson_progress;
create policy "Students can update own progress" on public.lesson_progress for update to authenticated
using ((select auth.uid()) = user_id and (select public.is_student_account()))
with check ((select auth.uid()) = user_id and (select public.is_student_account()));

create or replace function public.publish_lesson_reflection(p_lesson_no smallint, p_reflection text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  clean_reflection text := btrim(p_reflection);
begin
  if not public.is_student_account() then
    raise exception '학생 로그인이 필요합니다.' using errcode = '42501';
  end if;
  if p_lesson_no is null or p_lesson_no < 1 or p_lesson_no > 10 then
    raise exception '올바른 차시가 아닙니다.' using errcode = '22023';
  end if;
  if clean_reflection is null or char_length(clean_reflection) < 10 or char_length(clean_reflection) > 1000 then
    raise exception '문장은 10자 이상 1000자 이하로 작성해 주세요.' using errcode = '22023';
  end if;
  if clean_reflection ~* '(비밀번호|전화번호|집\s*주소|이메일\s*주소|주민등록|[0-9]{2,3}[- ]?[0-9]{3,4}[- ]?[0-9]{4}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})' then
    raise exception '개인정보처럼 보이는 내용은 게시할 수 없습니다.' using errcode = '22023';
  end if;
  insert into public.lesson_reflection_board (user_id, lesson_no, reflection)
  values ((select auth.uid()), p_lesson_no, clean_reflection)
  on conflict (user_id, lesson_no) do update
    set reflection = excluded.reflection, updated_at = now();
  -- Reposting never clears a moderator's hidden state.
end;
$$;

create or replace function public.read_lesson_reflection_board(p_lesson_no smallint default null)
returns table (lesson_no smallint, reflection text, updated_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_student_account() then
    raise exception '학생 로그인이 필요합니다.' using errcode = '42501';
  end if;
  if p_lesson_no is not null and (p_lesson_no < 1 or p_lesson_no > 10) then
    raise exception '올바른 차시가 아닙니다.' using errcode = '22023';
  end if;
  return query select b.lesson_no, b.reflection, b.updated_at
    from public.lesson_reflection_board b
    where not b.is_hidden and (p_lesson_no is null or b.lesson_no = p_lesson_no)
    order by b.lesson_no, b.updated_at desc;
end;
$$;

create or replace function public.read_admin_reflection_board(
  p_lesson_no smallint default null, p_status text default 'all',
  p_search text default '', p_offset integer default 0
)
returns table (
  user_id uuid, account_email text, student_name text, grade smallint,
  class_no smallint, student_no smallint, lesson_no smallint,
  reflection text, updated_at timestamptz, is_hidden boolean, moderation_version integer
)
language plpgsql stable security definer set search_path = '' as $$
declare
  keyword text := lower(btrim(coalesce(p_search, '')));
begin
  if not coalesce((select public.is_class_staff()), false)
    or coalesce((select auth.jwt() ->> 'is_anonymous'), 'false') = 'true' then
    raise exception '관리자 권한과 담당 학급 배정이 필요합니다.' using errcode = '42501';
  end if;
  if (p_lesson_no is not null and (p_lesson_no < 1 or p_lesson_no > 10))
    or p_status is null or p_status not in ('all', 'visible', 'hidden')
    or p_offset is null or p_offset < 0 or p_offset > 10000
    or char_length(keyword) > 100 then
    raise exception '조회 조건을 확인해 주세요.' using errcode = '22023';
  end if;
  return query
    select b.user_id, coalesce(u.email::text, ''), coalesce(s.student_name, ''),
      s.grade, s.class_no, s.student_no, b.lesson_no, b.reflection, b.updated_at,
      b.is_hidden, b.moderation_version
    from public.lesson_reflection_board b
    left join public.student_profiles s on s.user_id = b.user_id
    left join auth.users u on u.id = b.user_id
    where public.can_manage_student(b.user_id)
      and (p_lesson_no is null or b.lesson_no = p_lesson_no)
      and (p_status = 'all' or b.is_hidden = (p_status = 'hidden'))
      and (keyword = '' or strpos(lower(coalesce(s.student_name, '')), keyword) > 0
        or strpos(lower(coalesce(u.email::text, '')), keyword) > 0
        or strpos(b.user_id::text, keyword) > 0
        or s.student_no::text = keyword)
    order by b.updated_at desc, b.user_id, b.lesson_no
    limit 51 offset p_offset;
end;
$$;

create or replace function public.moderate_lesson_reflection(
  p_user_id uuid, p_lesson_no smallint, p_hidden boolean, p_reason text,
  p_expected_version integer, p_expected_updated_at timestamptz
)
returns void language plpgsql security definer set search_path = '' as $$
declare
  clean_reason text := btrim(p_reason);
  actor_name text;
  target public.lesson_reflection_board%rowtype;
begin
  if not coalesce((select public.is_class_staff()), false)
    or coalesce((select auth.jwt() ->> 'is_anonymous'), 'false') = 'true' then
    raise exception '관리자 권한과 담당 학급 배정이 필요합니다.' using errcode = '42501';
  end if;
  if not public.can_manage_student(p_user_id) then
    raise exception '담당 학급의 학생만 관리할 수 있습니다.' using errcode = '42501';
  end if;
  if p_hidden is null or clean_reason is null or char_length(clean_reason) < 3 or char_length(clean_reason) > 300 then
    raise exception '처리 사유를 확인해 주세요.' using errcode = '22023';
  end if;
  select * into target from public.lesson_reflection_board
    where user_id = p_user_id and lesson_no = p_lesson_no for update;
  if not found then
    raise exception '게시글을 찾을 수 없습니다.' using errcode = 'P0002';
  end if;
  if target.moderation_version is distinct from p_expected_version
    or target.updated_at is distinct from p_expected_updated_at then
    raise exception '게시글이 변경되었습니다. 다시 조회해 주세요.' using errcode = 'P0001';
  end if;
  if target.is_hidden = p_hidden then return; end if;
  select display_name into actor_name from public.staff_profiles where user_id = (select auth.uid());
  update public.lesson_reflection_board set is_hidden = p_hidden, moderation_version = moderation_version + 1
    where user_id = p_user_id and lesson_no = p_lesson_no;
  insert into public.reflection_moderation_audit(actor_id, actor_name, target_user_id, lesson_no, action, reason)
    values ((select auth.uid()), actor_name, p_user_id, p_lesson_no, case when p_hidden then 'hide' else 'restore' end, clean_reason);
end;
$$;

create or replace function public.read_admin_reflection_audit(p_user_id uuid, p_lesson_no smallint)
returns table(id uuid, actor_name text, action text, reason text, lesson_no smallint, created_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not coalesce((select public.is_class_staff()), false)
    or coalesce((select auth.jwt() ->> 'is_anonymous'), 'false') = 'true' then
    raise exception '관리자 권한과 담당 학급 배정이 필요합니다.' using errcode = '42501';
  end if;
  if not public.can_manage_student(p_user_id) then
    raise exception '담당 학급의 처리 기록만 조회할 수 있습니다.' using errcode = '42501';
  end if;
  return query select a.id, a.actor_name, a.action, a.reason, a.lesson_no, a.created_at
    from public.reflection_moderation_audit a
    where a.target_user_id = p_user_id and a.lesson_no = p_lesson_no
    order by a.created_at desc, a.id limit 50;
end;
$$;

revoke all on public.lesson_reflection_board from anon, authenticated;
revoke all on function public.publish_lesson_reflection(smallint, text) from public, anon;
revoke all on function public.read_lesson_reflection_board(smallint) from public, anon;
revoke all on function public.read_admin_reflection_board(smallint, text, text, integer) from public, anon;
revoke all on function public.moderate_lesson_reflection(uuid, smallint, boolean, text, integer, timestamptz) from public, anon;
revoke all on function public.read_admin_reflection_audit(uuid, smallint) from public, anon;
grant execute on function public.publish_lesson_reflection(smallint, text) to authenticated;
grant execute on function public.read_lesson_reflection_board(smallint) to authenticated;
grant execute on function public.read_admin_reflection_board(smallint, text, text, integer) to authenticated;
grant execute on function public.moderate_lesson_reflection(uuid, smallint, boolean, text, integer, timestamptz) to authenticated;
grant execute on function public.read_admin_reflection_audit(uuid, smallint) to authenticated;

notify pgrst, 'reload schema';
commit;
