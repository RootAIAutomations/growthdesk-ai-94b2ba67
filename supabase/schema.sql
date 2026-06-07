-- GrowthDesk AI database schema
-- MVP tables for Lovable + Supabase + n8n.

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

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  business_type text,
  tags text[] default '{}',
  notes text,
  status text default 'Lead' check (status in ('Lead', 'Active', 'Follow-Up', 'Won', 'Lost')),
  last_contacted date,
  last_contact_date date,
  follow_up_date date,
  created_at timestamp without time zone default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.message_log (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  message text,
  message_type text default 'Note' check (message_type in ('Note', 'Call', 'Email', 'WhatsApp', 'Meeting', 'Other')),
  direction text default 'Internal' check (direction in ('Inbound', 'Outbound', 'Internal')),
  summary text,
  details text,
  interaction_date timestamptz default now(),
  created_at timestamp without time zone default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.follow_up_schedule (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  title text default 'Follow up',
  notes text,
  due_date date not null,
  priority text default 'Medium' check (priority in ('Low', 'Medium', 'High')),
  status text default 'Pending' check (status in ('Pending', 'Completed', 'Skipped')),
  completed_at timestamptz,
  created_at timestamp without time zone default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.outreach_drafts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  prompt_context jsonb not null default '{}'::jsonb,
  channel text default 'WhatsApp' check (channel in ('WhatsApp', 'Email', 'LinkedIn', 'Other')),
  draft_text text not null,
  edited_text text,
  status text default 'Draft' check (status in ('Draft', 'Reviewed', 'Copied', 'Sent Manually', 'Archived')),
  generated_by text default 'n8n_openai',
  generated_at timestamptz default now(),
  copied_at timestamptz,
  created_at timestamp without time zone default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_calendar (
  id uuid primary key default gen_random_uuid(),
  week_start_date date,
  content_date date not null,
  day_number integer check (day_number between 1 and 7),
  topic text,
  instagram_caption text,
  linkedin_post text,
  blog_opener text,
  tags text[] default '{}',
  status text default 'Generated' check (status in ('Generated', 'Saved', 'Published', 'Archived')),
  generated_by text default 'n8n_openai',
  generated_at timestamptz default now(),
  created_at timestamp without time zone default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_library (
  id uuid primary key default gen_random_uuid(),
  content_calendar_id uuid references public.content_calendar(id) on delete set null,
  title text not null,
  platform text not null check (platform in ('Instagram', 'LinkedIn', 'Blog', 'Other')),
  content text not null,
  tags text[] default '{}',
  source text default 'Generated' check (source in ('Generated', 'Manual', 'Reused')),
  created_at timestamp without time zone default now(),
  updated_at timestamptz not null default now()
);

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

create or replace trigger set_clients_updated_at
before update on public.clients
for each row execute function public.set_updated_at();

create or replace trigger set_message_log_updated_at
before update on public.message_log
for each row execute function public.set_updated_at();

create or replace trigger set_follow_up_schedule_updated_at
before update on public.follow_up_schedule
for each row execute function public.set_updated_at();

create or replace trigger set_outreach_drafts_updated_at
before update on public.outreach_drafts
for each row execute function public.set_updated_at();

create or replace trigger set_content_calendar_updated_at
before update on public.content_calendar
for each row execute function public.set_updated_at();

create or replace trigger set_content_library_updated_at
before update on public.content_library
for each row execute function public.set_updated_at();

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
