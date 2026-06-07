-- Fix RLS: strict per-user isolation
-- Drop the old permissive policies that allowed user_id IS NULL (shared demo data)
-- Replace with strict: users only see their own rows

drop policy if exists "users_own_clients" on public.clients;
drop policy if exists "users_own_messages" on public.message_log;
drop policy if exists "users_own_followups" on public.follow_up_schedule;
drop policy if exists "users_own_drafts" on public.outreach_drafts;
drop policy if exists "users_own_calendar" on public.content_calendar;
drop policy if exists "users_own_library" on public.content_library;

-- Strict policies: only your own rows
create policy "users_own_clients" on public.clients
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "users_own_messages" on public.message_log
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "users_own_followups" on public.follow_up_schedule
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "users_own_drafts" on public.outreach_drafts
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "users_own_calendar" on public.content_calendar
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "users_own_library" on public.content_library
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());
