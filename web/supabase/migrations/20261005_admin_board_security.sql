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
