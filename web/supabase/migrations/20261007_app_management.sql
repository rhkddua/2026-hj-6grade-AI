-- Students can submit links; only scoped staff can change or delete them.
begin;
alter table public.student_apps add column if not exists management_version integer not null default 0 check (management_version >= 0);
revoke all on public.student_apps from anon, authenticated;
grant select on public.student_apps to authenticated;
grant insert(user_id, title, lesson_no, url) on public.student_apps to authenticated;
drop policy if exists "Students read own apps" on public.student_apps;
create policy "Students read own apps" on public.student_apps for select to authenticated
  using ((select public.is_student_account()) and (select auth.uid()) = user_id and deleted_at is null);
drop policy if exists "Students create own apps" on public.student_apps;
create policy "Students create own apps" on public.student_apps for insert to authenticated
  with check ((select public.is_student_account()) and (select auth.uid()) = user_id);
drop policy if exists "Students update own apps" on public.student_apps;

-- Validate new URLs while allowing staff to hide/restore older submitted URLs.
alter table public.student_apps drop constraint if exists student_apps_safe_url;
create or replace function public.check_student_app_url() returns trigger
language plpgsql set search_path = '' as $$
begin
  if tg_op = 'INSERT' or new.url is distinct from old.url then
    if new.url !~ '^https?://[^[:space:]@/?#]+([/?#][^[:space:]]*)?$' then
      raise exception '올바른 http 또는 https 공유 링크를 입력해 주세요.' using errcode = '23514';
    end if;
  end if;
  return new;
end;
$$;
drop trigger if exists student_app_url_check on public.student_apps;
create trigger student_app_url_check before insert or update on public.student_apps
  for each row execute function public.check_student_app_url();
create index if not exists student_apps_updated_id_idx on public.student_apps(updated_at desc, id);
create table if not exists public.student_app_management_audit (
  id bigint generated always as identity primary key,
  app_id uuid not null,
  target_user_id uuid not null,
  lesson_no smallint not null,
  actor_id uuid,
  actor_name text not null,
  action text not null check (action in ('edit', 'hide', 'restore', 'delete')),
  reason text not null check (char_length(btrim(reason)) between 3 and 300),
  created_at timestamptz not null default now()
);
alter table public.student_app_management_audit enable row level security;
revoke all on public.student_app_management_audit from anon, authenticated;
create index if not exists student_app_audit_app_idx on public.student_app_management_audit(app_id, created_at desc);

create or replace function public.query_admin_student_apps(
  p_class_no smallint default null, p_lesson_no smallint default null,
  p_status text default 'all', p_search text default '', p_sort text default 'newest', p_offset integer default 0
) returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare keyword text := lower(btrim(coalesce(p_search, ''))); result jsonb;
begin
  if not coalesce((select public.is_class_staff()), false) then
    raise exception '관리자 권한과 담당 학급 배정이 필요합니다.' using errcode = '42501';
  end if;
  if (p_class_no is not null and p_class_no not between 1 and 20)
    or (p_lesson_no is not null and p_lesson_no not between 5 and 10)
    or p_status is null or p_status not in ('all', 'visible', 'hidden')
    or p_sort is null or p_sort not in ('newest', 'oldest', 'student')
    or p_offset is null or p_offset < 0 or char_length(keyword) > 100 then
    raise exception '조회 조건을 확인해 주세요.' using errcode = '22023';
  end if;
  with filtered as materialized (
    select a.*, s.student_name, s.grade, s.class_no, s.student_no, coalesce(u.email::text, '') as account_email
    from public.student_apps a join public.student_profiles s on s.user_id = a.user_id
    left join auth.users u on u.id = a.user_id
    where public.can_manage_student(a.user_id)
      and (p_class_no is null or s.class_no = p_class_no)
      and (p_lesson_no is null or a.lesson_no = p_lesson_no)
      and (keyword = '' or strpos(lower(a.title), keyword) > 0 or strpos(lower(a.url), keyword) > 0
        or strpos(lower(s.student_name), keyword) > 0 or s.student_no::text = keyword
        or strpos(lower(coalesce(u.email::text, '')), keyword) > 0 or strpos(a.user_id::text, keyword) > 0)
  ), page as (
    select * from filtered where p_status = 'all' or (deleted_at is not null) = (p_status = 'hidden')
    order by case when p_sort = 'newest' then updated_at end desc,
      case when p_sort = 'oldest' then updated_at end asc,
      case when p_sort = 'student' then grade end, case when p_sort = 'student' then class_no end,
      case when p_sort = 'student' then student_no end, id limit 50 offset p_offset
  ) select jsonb_build_object(
    'entries', coalesce((select jsonb_agg(to_jsonb(p)) from page p), '[]'::jsonb),
    'total', (select count(*) from filtered where p_status = 'all' or (deleted_at is not null) = (p_status = 'hidden')),
    'visible', (select count(*) from filtered where deleted_at is null),
    'hidden', (select count(*) from filtered where deleted_at is not null),
    'classes', coalesce((select jsonb_agg(c.class_no order by c.class_no) from (
      select distinct s.class_no from public.student_profiles s where public.can_manage_student(s.user_id)
    ) c), '[]'::jsonb)
  ) into result;
  return result;
end;
$$;

create or replace function public.manage_student_apps(
  p_entries jsonb, p_action text, p_reason text, p_values jsonb default null
) returns integer language plpgsql security definer set search_path = '' as $$
declare
  clean_reason text := btrim(p_reason); actor_name text; item record; target public.student_apps%rowtype;
  clean_title text; clean_url text; new_lesson smallint; changed integer := 0;
begin
  if not coalesce((select public.is_class_staff()), false) then
    raise exception '관리자 권한과 담당 학급 배정이 필요합니다.' using errcode = '42501';
  end if;
  if p_action is null or p_action not in ('edit', 'hide', 'restore', 'delete')
    or clean_reason is null or char_length(clean_reason) not between 3 and 300
    or p_entries is null or jsonb_typeof(p_entries) <> 'array' then
    raise exception '처리 대상과 사유를 확인해 주세요.' using errcode = '22023';
  end if;
  if jsonb_array_length(p_entries) not between 1 and 50
    or exists (select 1 from jsonb_array_elements(p_entries) e where jsonb_typeof(e) <> 'object') then
    raise exception '앱은 1~50개까지 선택해 주세요.' using errcode = '22023';
  end if;
  if exists (select 1 from jsonb_to_recordset(p_entries) as e(id uuid, management_version integer, updated_at timestamptz)
    where e.id is null or e.management_version is null or e.management_version < 0 or e.updated_at is null)
    or exists (select 1 from jsonb_to_recordset(p_entries) as e(id uuid) group by e.id having count(*) > 1) then
    raise exception '처리 대상 정보를 확인해 주세요.' using errcode = '22023';
  end if;
  if p_action = 'edit' then
    if jsonb_array_length(p_entries) <> 1 or p_values is null or jsonb_typeof(p_values) <> 'object' then
      raise exception '수정할 앱 한 개와 내용을 확인해 주세요.' using errcode = '22023';
    end if;
    clean_title := btrim(p_values->>'title'); clean_url := btrim(p_values->>'url');
    new_lesson := (p_values->>'lesson_no')::smallint;
    if clean_title is null or char_length(clean_title) not between 1 and 80
      or clean_url is null or char_length(clean_url) > 2000
      or clean_url !~ '^https?://[^[:space:]@/?#]+([/?#][^[:space:]]*)?$'
      or new_lesson is null or new_lesson not between 5 and 10 then
      raise exception '앱 이름, 차시, 공유 링크를 확인해 주세요.' using errcode = '22023';
    end if;
  end if;
  select coalesce(s.display_name, '관리자') into actor_name from public.staff_profiles s where s.user_id = (select auth.uid());
  for item in select * from jsonb_to_recordset(p_entries)
    as e(id uuid, management_version integer, updated_at timestamptz) order by e.id
  loop
    select * into target from public.student_apps a where a.id = item.id and public.can_manage_student(a.user_id) for update;
    if not found then raise exception '앱을 찾을 수 없습니다.' using errcode = 'P0002'; end if;
    if not public.can_manage_student(target.user_id) then
      raise exception '담당 학급의 학생 앱만 관리할 수 있습니다.' using errcode = '42501';
    end if;
    if target.management_version is distinct from item.management_version or target.updated_at is distinct from item.updated_at then
      raise exception '앱이 변경되었습니다. 다시 조회해 주세요.' using errcode = 'P0001';
    end if;
    if p_action = 'delete' then
      delete from public.student_apps a where a.id = item.id;
    elsif p_action = 'edit' then
      update public.student_apps a set title = clean_title, url = clean_url, lesson_no = new_lesson,
        management_version = a.management_version + 1, updated_at = clock_timestamp() where a.id = item.id;
    elsif (target.deleted_at is not null) = (p_action = 'hide') then continue;
    else
      update public.student_apps a set deleted_at = case when p_action = 'hide' then clock_timestamp() else null end,
        management_version = a.management_version + 1, updated_at = clock_timestamp() where a.id = item.id;
    end if;
    insert into public.student_app_management_audit(app_id, target_user_id, lesson_no, actor_id, actor_name, action, reason)
      values (target.id, target.user_id, coalesce(new_lesson, target.lesson_no), (select auth.uid()), actor_name, p_action, clean_reason);
    changed := changed + 1;
  end loop;
  return changed;
end;
$$;

create or replace function public.read_student_app_audit(p_app_id uuid)
returns setof public.student_app_management_audit language plpgsql stable security definer set search_path = '' as $$
begin
  if not coalesce((select public.is_class_staff()), false) then
    raise exception '관리자 권한과 담당 학급 배정이 필요합니다.' using errcode = '42501';
  end if;
  return query select a.* from public.student_app_management_audit a
    where a.app_id = p_app_id and public.can_manage_student(a.target_user_id) order by a.created_at desc, a.id desc limit 100;
end;
$$;
revoke all on function public.query_admin_student_apps(smallint, smallint, text, text, text, integer) from public, anon;
revoke all on function public.manage_student_apps(jsonb, text, text, jsonb) from public, anon;
revoke all on function public.read_student_app_audit(uuid) from public, anon;
grant execute on function public.query_admin_student_apps(smallint, smallint, text, text, text, integer) to authenticated;
grant execute on function public.manage_student_apps(jsonb, text, text, jsonb) to authenticated;
grant execute on function public.read_student_app_audit(uuid) to authenticated;
notify pgrst, 'reload schema';
commit;
