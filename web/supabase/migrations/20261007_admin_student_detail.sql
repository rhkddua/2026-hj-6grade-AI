-- Display current board state without exposing deleted posts from lesson backups.
begin;
create or replace function public.read_admin_student_detail(p_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
  if not coalesce((select public.is_class_staff()), false)
    or p_user_id is null or not public.can_manage_student(p_user_id)
    or not exists(select 1 from public.student_profiles s where s.user_id = p_user_id) then
    raise exception '담당 학급의 학생만 조회할 수 있습니다.' using errcode = '42501';
  end if;
  with lessons as (
    select l.lesson_no, p.current_step, p.quiz_score, p.completed, p.updated_at,
      case
        when b.user_id is not null then b.reflection
        when d.was_deleted then null
        else nullif(btrim(p.reflection), '')
      end as reflection,
      case
        when b.user_id is not null then case when b.is_hidden then 'hidden' else 'visible' end
        when d.was_deleted then 'deleted'
        when nullif(btrim(p.reflection), '') is not null then 'draft'
        else 'none'
      end as reflection_status
    from generate_series(1, 10) as l(lesson_no)
    left join public.lesson_progress p on p.user_id = p_user_id and p.lesson_no = l.lesson_no
    left join public.lesson_reflection_board b on b.user_id = p_user_id and b.lesson_no = l.lesson_no
    cross join lateral (
      select exists(select 1 from public.reflection_moderation_audit a
        where a.target_user_id = p_user_id and a.lesson_no = l.lesson_no and a.action = 'delete') as was_deleted
    ) d
  ) select jsonb_agg(to_jsonb(l) order by l.lesson_no) into result from lessons l;
  return result;
end;
$$;
revoke all on function public.read_admin_student_detail(uuid) from public, anon;
grant execute on function public.read_admin_student_detail(uuid) to authenticated;
notify pgrst, 'reload schema';
commit;
