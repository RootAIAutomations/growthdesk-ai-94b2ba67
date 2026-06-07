
-- content_calendar
ALTER TABLE public.content_calendar RENAME COLUMN scheduled_date TO content_date;
ALTER TABLE public.content_calendar RENAME COLUMN title TO topic;
ALTER TABLE public.content_calendar ADD COLUMN IF NOT EXISTS instagram_caption text;
ALTER TABLE public.content_calendar ADD COLUMN IF NOT EXISTS linkedin_post text;
ALTER TABLE public.content_calendar ADD COLUMN IF NOT EXISTS blog_opener text;
ALTER TABLE public.content_calendar ADD COLUMN IF NOT EXISTS day_number integer;
ALTER TABLE public.content_calendar ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'::text[];

-- message_log
ALTER TABLE public.message_log RENAME COLUMN content TO message;
ALTER TABLE public.message_log RENAME COLUMN channel TO message_type;
ALTER TABLE public.message_log RENAME COLUMN sent_at TO interaction_date;
ALTER TABLE public.message_log ADD COLUMN IF NOT EXISTS summary text;
ALTER TABLE public.message_log ADD COLUMN IF NOT EXISTS details text;

-- follow_up_schedule
ALTER TABLE public.follow_up_schedule RENAME COLUMN task TO title;
ALTER TABLE public.follow_up_schedule ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.follow_up_schedule ADD COLUMN IF NOT EXISTS priority text DEFAULT 'normal';
ALTER TABLE public.follow_up_schedule ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';

-- outreach_drafts
ALTER TABLE public.outreach_drafts RENAME COLUMN content TO draft_text;
ALTER TABLE public.outreach_drafts RENAME COLUMN created_at TO generated_at;
ALTER TABLE public.outreach_drafts ADD COLUMN IF NOT EXISTS prompt_context jsonb;
ALTER TABLE public.outreach_drafts ADD COLUMN IF NOT EXISTS edited_text text;
