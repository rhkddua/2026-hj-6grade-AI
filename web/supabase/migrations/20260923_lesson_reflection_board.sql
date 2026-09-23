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
  if (select auth.uid()) is null then
    raise exception '학생 로그인이 필요합니다.' using errcode = '42501';
  end if;
  if p_lesson_no is null or p_lesson_no < 1 or p_lesson_no > 10 then
    raise exception '올바른 차시가 아닙니다.' using errcode = '22023';
  end if;
  if char_length(clean_reflection) < 10 or char_length(clean_reflection) > 1000 then
    raise exception '문장은 10자 이상 1000자 이하로 작성해 주세요.' using errcode = '22023';
  end if;
  if clean_reflection ~* '(비밀번호|전화번호|집\s*주소|이메일\s*주소|주민등록|[0-9]{2,3}[- ]?[0-9]{3,4}[- ]?[0-9]{4}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})' then
    raise exception '개인정보처럼 보이는 내용은 게시할 수 없습니다.' using errcode = '22023';
  end if;

  insert into public.lesson_reflection_board (user_id, lesson_no, reflection)
  values ((select auth.uid()), p_lesson_no, clean_reflection)
  on conflict (user_id, lesson_no) do update
  set reflection = excluded.reflection,
      updated_at = now();
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
  if (select auth.uid()) is null then
    raise exception '학생 로그인이 필요합니다.' using errcode = '42501';
  end if;
  if p_lesson_no is not null and (p_lesson_no < 1 or p_lesson_no > 10) then
    raise exception '올바른 차시가 아닙니다.' using errcode = '22023';
  end if;

  return query
  select board.lesson_no, board.reflection, board.updated_at
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
