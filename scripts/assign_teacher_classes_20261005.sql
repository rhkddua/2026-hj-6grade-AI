-- Run after 20261005_teacher_class_access.sql. Reuse existing Auth IDs only.
begin;
do $$
begin
  if (select count(*) from auth.users where lower(email) in (
    'hj601@admin.com','hj602@admin.com','hj603@admin.com','hj604@admin.com',
    'hj605@admin.com','hj606@admin.com','hj607@admin.com')) <> 7 then
    raise exception 'Expected all seven existing teacher accounts';
  end if;
  if exists(select 1 from auth.users u where lower(u.email) in (
    'hj601@admin.com','hj602@admin.com','hj603@admin.com','hj604@admin.com',
    'hj605@admin.com','hj606@admin.com','hj607@admin.com') and (
      u.email_confirmed_at is null or exists(select 1 from public.student_profiles p where p.user_id=u.id)
      or exists(select 1 from public.staff_profiles s where s.user_id=u.id and s.role='super_admin')
    )) then
    raise exception 'Teacher preflight failed; do not replace a student or super administrator';
  end if;
end;
$$;

with assignments(email, class_no) as (values
  ('hj601@admin.com',1),('hj602@admin.com',2),('hj603@admin.com',3),
  ('hj604@admin.com',4),('hj605@admin.com',5),('hj606@admin.com',6),('hj607@admin.com',7)
)
insert into public.staff_profiles(user_id, display_name, role)
select u.id, '6학년 ' || a.class_no || '반 담임', 'teacher'
from assignments a join auth.users u on lower(u.email)=a.email
on conflict(user_id) do update set role='teacher', updated_at=now()
where public.staff_profiles.role='teacher';

with assignments(email, class_no) as (values
  ('hj601@admin.com',1),('hj602@admin.com',2),('hj603@admin.com',3),
  ('hj604@admin.com',4),('hj605@admin.com',5),('hj606@admin.com',6),('hj607@admin.com',7)
)
insert into public.teacher_class_assignments(user_id, grade, class_no)
select u.id, 6, a.class_no from assignments a join auth.users u on lower(u.email)=a.email
on conflict(user_id) do update set grade=excluded.grade, class_no=excluded.class_no;
commit;

select u.email, s.role, a.grade, a.class_no
from auth.users u join public.staff_profiles s on s.user_id=u.id
join public.teacher_class_assignments a on a.user_id=u.id
where lower(u.email) in ('hj601@admin.com','hj602@admin.com','hj603@admin.com',
  'hj604@admin.com','hj605@admin.com','hj606@admin.com','hj607@admin.com') order by u.email;
