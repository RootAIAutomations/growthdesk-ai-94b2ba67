-- Align Lovable-managed Supabase with the GrowthDesk AI app schema.
-- This migration is intentionally additive/rename-based so existing demo data is preserved.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- clients
alter table public.clients add column if not exists last_contacted date;
alter table public.clients add column if not exists last_contact_date date;
alter table public.clients add column if not exists updated_at timestamptz not null default now();

update public.clients
set last_contact_date = coalesce(last_contact_date, last_contacted)
where last_contact_date is null;

-- message_log: old schema used content/channel/sent_at.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'message_log' and column_name = 'content'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'message_log' and column_name = 'message'
  ) then
    alter table public.message_log rename column content to message;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'message_log' and column_name = 'channel'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'message_log' and column_name = 'message_type'
  ) then
    alter table public.message_log rename column channel to message_type;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'message_log' and column_name = 'sent_at'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'message_log' and column_name = 'interaction_date'
  ) then
    alter table public.message_log rename column sent_at to interaction_date;
  end if;
end $$;

alter table public.message_log add column if not exists message text;
alter table public.message_log add column if not exists message_type text default 'Note';
alter table public.message_log add column if not exists summary text;
alter table public.message_log add column if not exists details text;
alter table public.message_log add column if not exists interaction_date timestamptz default now();
alter table public.message_log add column if not exists updated_at timestamptz not null default now();

update public.message_log
set
  summary = coalesce(summary, message),
  direction = case lower(direction)
    when 'inbound' then 'Inbound'
    when 'outbound' then 'Outbound'
    when 'internal' then 'Internal'
    else coalesce(direction, 'Internal')
  end,
  message_type = case lower(coalesce(message_type, 'note'))
    when 'whatsapp' then 'WhatsApp'
    when 'email' then 'Email'
    when 'call' then 'Call'
    when 'meeting' then 'Meeting'
    when 'sms' then 'Other'
    when 'other' then 'Other'
    else 'Note'
  end;

-- follow_up_schedule: old schema used task/completed.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'follow_up_schedule' and column_name = 'task'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'follow_up_schedule' and column_name = 'title'
  ) then
    alter table public.follow_up_schedule rename column task to title;
  end if;
end $$;

alter table public.follow_up_schedule add column if not exists title text default 'Follow up';
alter table public.follow_up_schedule add column if not exists notes text;
alter table public.follow_up_schedule add column if not exists priority text default 'Medium';
alter table public.follow_up_schedule add column if not exists status text default 'Pending';
alter table public.follow_up_schedule add column if not exists completed_at timestamptz;
alter table public.follow_up_schedule add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'follow_up_schedule' and column_name = 'completed'
  ) then
    update public.follow_up_schedule
    set
      status = case
        when completed is true then 'Completed'
        when status is null then 'Pending'
        else status
      end,
      priority = coalesce(priority, 'Medium');
  else
    update public.follow_up_schedule
    set
      status = coalesce(status, 'Pending'),
      priority = coalesce(priority, 'Medium');
  end if;
end $$;

-- outreach_drafts: old schema used content.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'outreach_drafts' and column_name = 'content'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'outreach_drafts' and column_name = 'draft_text'
  ) then
    alter table public.outreach_drafts rename column content to draft_text;
  end if;
end $$;

alter table public.outreach_drafts add column if not exists draft_text text;
alter table public.outreach_drafts add column if not exists prompt_context jsonb not null default '{}'::jsonb;
alter table public.outreach_drafts add column if not exists edited_text text;
alter table public.outreach_drafts add column if not exists generated_by text default 'n8n_openai';
alter table public.outreach_drafts add column if not exists generated_at timestamptz default now();
alter table public.outreach_drafts add column if not exists copied_at timestamptz;
alter table public.outreach_drafts add column if not exists updated_at timestamptz not null default now();

update public.outreach_drafts
set
  channel = case lower(coalesce(channel, 'whatsapp'))
    when 'whatsapp' then 'WhatsApp'
    when 'email' then 'Email'
    when 'linkedin' then 'LinkedIn'
    else 'Other'
  end,
  status = case lower(coalesce(status, 'draft'))
    when 'draft' then 'Draft'
    when 'reviewed' then 'Reviewed'
    when 'copied' then 'Copied'
    when 'archived' then 'Archived'
    else status
  end;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'outreach_drafts' and column_name = 'created_at'
  ) then
    update public.outreach_drafts
    set generated_at = coalesce(generated_at, created_at::timestamptz, now());
  else
    update public.outreach_drafts
    set generated_at = coalesce(generated_at, now());
  end if;
end $$;

-- content_calendar: old schema used scheduled_date/title/platform/notes.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'content_calendar' and column_name = 'scheduled_date'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'content_calendar' and column_name = 'content_date'
  ) then
    alter table public.content_calendar rename column scheduled_date to content_date;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'content_calendar' and column_name = 'title'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'content_calendar' and column_name = 'topic'
  ) then
    alter table public.content_calendar rename column title to topic;
  end if;
end $$;

alter table public.content_calendar add column if not exists week_start_date date;
alter table public.content_calendar add column if not exists content_date date;
alter table public.content_calendar add column if not exists day_number integer;
alter table public.content_calendar add column if not exists topic text;
alter table public.content_calendar add column if not exists instagram_caption text;
alter table public.content_calendar add column if not exists linkedin_post text;
alter table public.content_calendar add column if not exists blog_opener text;
alter table public.content_calendar add column if not exists tags text[] default '{}';
alter table public.content_calendar add column if not exists generated_by text default 'n8n_openai';
alter table public.content_calendar add column if not exists generated_at timestamptz default now();
alter table public.content_calendar add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'content_calendar' and column_name = 'notes'
  ) then
    update public.content_calendar
    set linkedin_post = coalesce(linkedin_post, notes);
  end if;
end $$;

update public.content_calendar
set
  status = case lower(coalesce(status, 'generated'))
    when 'planned' then 'Generated'
    when 'drafted' then 'Generated'
    when 'scheduled' then 'Saved'
    when 'published' then 'Published'
    else status
  end,
  generated_at = coalesce(generated_at, created_at::timestamptz, now());

-- content_library: old schema used content_type/body.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'content_library' and column_name = 'body'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'content_library' and column_name = 'content'
  ) then
    alter table public.content_library rename column body to content;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'content_library' and column_name = 'content_type'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'content_library' and column_name = 'platform'
  ) then
    alter table public.content_library rename column content_type to platform;
  end if;
end $$;

alter table public.content_library add column if not exists content_calendar_id uuid;
alter table public.content_library add column if not exists platform text default 'Other';
alter table public.content_library add column if not exists content text;
alter table public.content_library add column if not exists source text default 'Generated';
alter table public.content_library add column if not exists updated_at timestamptz not null default now();

update public.content_library
set platform = case
  when platform in ('Instagram', 'LinkedIn', 'Blog', 'Other') then platform
  when lower(platform) = 'caption' then 'Instagram'
  else 'Other'
end;

-- indexes
create index if not exists idx_clients_status on public.clients(status);
create index if not exists idx_clients_follow_up_date on public.clients(follow_up_date);
create index if not exists idx_clients_tags on public.clients using gin(tags);
create index if not exists idx_message_log_client_id on public.message_log(client_id);
create index if not exists idx_message_log_interaction_date on public.message_log(interaction_date desc);
create index if not exists idx_follow_up_client_id on public.follow_up_schedule(client_id);
create index if not exists idx_follow_up_due_date on public.follow_up_schedule(due_date);
create index if not exists idx_follow_up_status on public.follow_up_schedule(status);
create index if not exists idx_outreach_client_id on public.outreach_drafts(client_id);
create index if not exists idx_outreach_generated_at on public.outreach_drafts(generated_at desc);
create index if not exists idx_content_calendar_date on public.content_calendar(content_date);
create index if not exists idx_content_calendar_tags on public.content_calendar using gin(tags);
create index if not exists idx_content_library_platform on public.content_library(platform);
create index if not exists idx_content_library_tags on public.content_library using gin(tags);

-- triggers
create or replace trigger set_clients_updated_at before update on public.clients for each row execute function public.set_updated_at();
create or replace trigger set_message_log_updated_at before update on public.message_log for each row execute function public.set_updated_at();
create or replace trigger set_follow_up_schedule_updated_at before update on public.follow_up_schedule for each row execute function public.set_updated_at();
create or replace trigger set_outreach_drafts_updated_at before update on public.outreach_drafts for each row execute function public.set_updated_at();
create or replace trigger set_content_calendar_updated_at before update on public.content_calendar for each row execute function public.set_updated_at();
create or replace trigger set_content_library_updated_at before update on public.content_library for each row execute function public.set_updated_at();

-- keep Lovable preview usable while auth is intentionally not part of this build.
alter table public.clients disable row level security;
alter table public.message_log disable row level security;
alter table public.follow_up_schedule disable row level security;
alter table public.outreach_drafts disable row level security;
alter table public.content_calendar disable row level security;
alter table public.content_library disable row level security;

grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on public.clients to anon, authenticated, service_role;
grant select, insert, update, delete on public.message_log to anon, authenticated, service_role;
grant select, insert, update, delete on public.follow_up_schedule to anon, authenticated, service_role;
grant select, insert, update, delete on public.outreach_drafts to anon, authenticated, service_role;
grant select, insert, update, delete on public.content_calendar to anon, authenticated, service_role;
grant select, insert, update, delete on public.content_library to anon, authenticated, service_role;
