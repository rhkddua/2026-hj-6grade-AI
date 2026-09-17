-- Preserve existing progress and RLS; store lesson-specific answers in the same owned row.
alter table public.lesson_progress
  add column if not exists activity_data jsonb not null default '{}'::jsonb;
