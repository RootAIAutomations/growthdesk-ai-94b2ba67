-- ============================================================
-- GrowthDesk AI — Auth: Add per-user data isolation
-- Apply this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Add user_id to all data tables (auto-fills with logged-in user's id on insert)
alter table public.clients          add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade;
alter table public.message_log      add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade;
alter table public.follow_up_schedule add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade;
alter table public.outreach_drafts  add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade;
alter table public.content_calendar add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade;
alter table public.content_library  add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete cascade;

-- Enable Row Level Security on all tables
alter table public.clients            enable row level security;
alter table public.message_log        enable row level security;
alter table public.follow_up_schedule enable row level security;
alter table public.outreach_drafts    enable row level security;
alter table public.content_calendar   enable row level security;
alter table public.content_library    enable row level security;

-- RLS Policies:
--   - Users see their own rows (user_id = their id)
--   - OR shared demo rows (user_id IS NULL — existing seed data)
--   - INSERT always sets user_id to the current user
create policy "users_own_clients" on public.clients
  for all using   (user_id = auth.uid() or user_id is null)
  with check      (user_id = auth.uid());

create policy "users_own_messages" on public.message_log
  for all using   (user_id = auth.uid() or user_id is null)
  with check      (user_id = auth.uid());

create policy "users_own_followups" on public.follow_up_schedule
  for all using   (user_id = auth.uid() or user_id is null)
  with check      (user_id = auth.uid());

create policy "users_own_drafts" on public.outreach_drafts
  for all using   (user_id = auth.uid() or user_id is null)
  with check      (user_id = auth.uid());

create policy "users_own_calendar" on public.content_calendar
  for all using   (user_id = auth.uid() or user_id is null)
  with check      (user_id = auth.uid());

create policy "users_own_library" on public.content_library
  for all using   (user_id = auth.uid() or user_id is null)
  with check      (user_id = auth.uid());
