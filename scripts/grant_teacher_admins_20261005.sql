-- DO NOT EXECUTE: superseded on 2026-10-05 by class-scoped teacher access.
-- See TEACHER_CLASS_ACCESS_HANDOFF.md. This obsolete proposal grants all-class access.
-- Grants the existing super_admin application role; no password is stored here.
begin;
do $$
declare account_count integer;
begin
  select count(*) into account_count from auth.users
    where email in ('hj601@admin.com','hj602@admin.com','hj603@admin.com',
      'hj604@admin.com','hj605@admin.com','hj606@admin.com','hj607@admin.com');
  if account_count <> 7 then
    raise exception '7개 Auth 계정을 먼저 생성해야 합니다. 현재 %개입니다.', account_count;
  end if;
  if exists (select 1 from public.student_profiles s join auth.users u on u.id=s.user_id
    where u.email in ('hj601@admin.com','hj602@admin.com','hj603@admin.com',
      'hj604@admin.com','hj605@admin.com','hj606@admin.com','hj607@admin.com')) then
    raise exception '대상 중 학생 계정이 있습니다. 계정 용도를 먼저 확인하세요.';
  end if;
end $$;
insert into public.staff_profiles(user_id,display_name,role)
select u.id, '6학년 ' || v.class_no || '반 담임교사', 'super_admin'
from (values (1,'hj601@admin.com'),(2,'hj602@admin.com'),(3,'hj603@admin.com'),
  (4,'hj604@admin.com'),(5,'hj605@admin.com'),(6,'hj606@admin.com'),(7,'hj607@admin.com')) v(class_no,email)
join auth.users u on u.email=v.email
on conflict(user_id) do update set display_name=excluded.display_name,role=excluded.role,updated_at=now();
select u.email,s.display_name,s.role from public.staff_profiles s join auth.users u on u.id=s.user_id
where u.email in ('hj601@admin.com','hj602@admin.com','hj603@admin.com',
  'hj604@admin.com','hj605@admin.com','hj606@admin.com','hj607@admin.com') order by u.email;
commit;
