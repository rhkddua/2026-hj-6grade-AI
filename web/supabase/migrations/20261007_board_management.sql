-- Board-only management. No lesson progress or student accounts are deleted.
begin;

alter table public.reflection_moderation_audit
  drop constraint if exists reflection_moderation_audit_action_check;
alter table public.reflection_moderation_audit
  add constraint reflection_moderation_audit_action_check check (action in ('hide', 'restore', 'delete'));

create or replace function public.query_admin_reflection_board(
  p_class_no smallint default null, p_lesson_no smallint default null,
  p_status text default 'all', p_search text default '',
  p_sort text default 'newest', p_offset integer default 0
)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  keyword text := lower(btrim(coalesce(p_search, '')));
  result jsonb;
begin
  if not coalesce((select public.is_class_staff()), false) then
    raise exception '관리자 권한과 담당 학급 배정이 필요합니다.' using errcode = '42501';
  end if;
  if (p_class_no is not null and (p_class_no < 1 or p_class_no > 20))
    or (p_lesson_no is not null and (p_lesson_no < 1 or p_lesson_no > 10))
    or p_status is null or p_status not in ('all', 'visible', 'hidden')
    or p_sort is null or p_sort not in ('newest', 'oldest', 'student')
    or p_offset is null or p_offset < 0 or p_offset > 10000
    or char_length(keyword) > 100 then
    raise exception '조회 조건을 확인해 주세요.' using errcode = '22023';
  end if;
  with filtered as materialized (
    select b.user_id, coalesce(u.email::text, '') as account_email,
      coalesce(s.student_name, '') as student_name, s.grade, s.class_no, s.student_no,
      b.lesson_no, b.reflection, b.updated_at, b.is_hidden, b.moderation_version
    from public.lesson_reflection_board b
    left join public.student_profiles s on s.user_id = b.user_id
    left join auth.users u on u.id = b.user_id
    where public.can_manage_student(b.user_id)
      and (p_class_no is null or s.class_no = p_class_no)
      and (p_lesson_no is null or b.lesson_no = p_lesson_no)
      and (keyword = '' or strpos(lower(coalesce(s.student_name, '')), keyword) > 0
        or strpos(lower(coalesce(u.email::text, '')), keyword) > 0
        or strpos(b.user_id::text, keyword) > 0
        or s.student_no::text = keyword or strpos(lower(b.reflection), keyword) > 0)
  ), page as (
    select * from filtered
    where p_status = 'all' or is_hidden = (p_status = 'hidden')
    order by
      case when p_sort = 'newest' then updated_at end desc,
      case when p_sort = 'oldest' then updated_at end asc,
      case when p_sort = 'student' then grade end,
      case when p_sort = 'student' then class_no end,
      case when p_sort = 'student' then student_no end,
      user_id, lesson_no
    limit 50 offset p_offset
  )
  select jsonb_build_object(
    'entries', coalesce((select jsonb_agg(to_jsonb(p)) from page p), '[]'::jsonb),
    'total', (select count(*) from filtered where p_status = 'all' or is_hidden = (p_status = 'hidden')),
    'visible', (select count(*) from filtered where not is_hidden),
    'hidden', (select count(*) from filtered where is_hidden),
    'classes', coalesce((select jsonb_agg(c.class_no order by c.class_no) from (
      select distinct s.class_no from public.student_profiles s where public.can_manage_student(s.user_id)
    ) c), '[]'::jsonb)
  ) into result;
  return result;
end;
$$;

create or replace function public.manage_reflection_board(p_entries jsonb, p_action text, p_reason text)
returns integer language plpgsql security definer set search_path = '' as $$
declare
  clean_reason text := btrim(p_reason);
  actor_name text;
  item record;
  target public.lesson_reflection_board%rowtype;
  changed integer := 0;
begin
  if not coalesce((select public.is_class_staff()), false) then
    raise exception '관리자 권한과 담당 학급 배정이 필요합니다.' using errcode = '42501';
  end if;
  if p_action is null or p_action not in ('hide', 'restore', 'delete')
    or clean_reason is null or char_length(clean_reason) < 3 or char_length(clean_reason) > 300
    or p_entries is null or jsonb_typeof(p_entries) <> 'array' then
    raise exception '처리 대상과 사유를 확인해 주세요.' using errcode = '22023';
  end if;
  if jsonb_array_length(p_entries) < 1 or jsonb_array_length(p_entries) > 50
    or exists (select 1 from jsonb_array_elements(p_entries) e where jsonb_typeof(e) <> 'object') then
    raise exception '게시글은 1~50개까지 선택해 주세요.' using errcode = '22023';
  end if;
  if exists (
    select 1 from jsonb_to_recordset(p_entries) as e(user_id uuid, lesson_no smallint, moderation_version integer, updated_at timestamptz)
    where e.user_id is null or e.lesson_no is null or e.lesson_no not between 1 and 10
      or e.moderation_version is null or e.moderation_version < 0 or e.updated_at is null
  ) or exists (
    select 1 from jsonb_to_recordset(p_entries) as e(user_id uuid, lesson_no smallint)
    group by e.user_id, e.lesson_no having count(*) > 1
  ) then
    raise exception '처리 대상 정보를 확인해 주세요.' using errcode = '22023';
  end if;
  select coalesce(s.display_name, '관리자') into actor_name
    from public.staff_profiles s where s.user_id = (select auth.uid());
  -- Lock in a stable order; any failure rolls back every change and audit row.
  for item in select * from jsonb_to_recordset(p_entries)
    as e(user_id uuid, lesson_no smallint, moderation_version integer, updated_at timestamptz)
    order by e.user_id, e.lesson_no
  loop
    if not public.can_manage_student(item.user_id) then
      raise exception '담당 학급의 학생만 관리할 수 있습니다.' using errcode = '42501';
    end if;
    select * into target from public.lesson_reflection_board b
      where b.user_id = item.user_id and b.lesson_no = item.lesson_no for update;
    if not found then
      raise exception '게시글을 찾을 수 없습니다.' using errcode = 'P0002';
    end if;
    if target.moderation_version is distinct from item.moderation_version
      or target.updated_at is distinct from item.updated_at then
      raise exception '게시글이 변경되었습니다. 다시 조회해 주세요.' using errcode = 'P0001';
    end if;
    if p_action = 'delete' then
      delete from public.lesson_reflection_board b where b.user_id = item.user_id and b.lesson_no = item.lesson_no;
    elsif target.is_hidden = (p_action = 'hide') then
      continue;
    else
      update public.lesson_reflection_board b
        set is_hidden = (p_action = 'hide'), moderation_version = b.moderation_version + 1
        where b.user_id = item.user_id and b.lesson_no = item.lesson_no;
    end if;
    insert into public.reflection_moderation_audit(actor_id, actor_name, target_user_id, lesson_no, action, reason)
      values ((select auth.uid()), actor_name, item.user_id, item.lesson_no, p_action, clean_reason);
    changed := changed + 1;
  end loop;
  return changed;
end;
$$;

revoke all on function public.query_admin_reflection_board(smallint, smallint, text, text, text, integer) from public, anon;
revoke all on function public.manage_reflection_board(jsonb, text, text) from public, anon;
grant execute on function public.query_admin_reflection_board(smallint, smallint, text, text, text, integer) to authenticated;
grant execute on function public.manage_reflection_board(jsonb, text, text) to authenticated;
notify pgrst, 'reload schema';
commit;
