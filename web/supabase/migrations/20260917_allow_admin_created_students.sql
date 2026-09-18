-- Allow teachers to create Auth accounts in the Supabase dashboard first.
-- Student profiles for those accounts can be inserted separately.
create or replace function public.handle_new_student()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
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
