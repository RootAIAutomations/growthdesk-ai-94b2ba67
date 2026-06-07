
ALTER TABLE public.content_library ADD COLUMN IF NOT EXISTS platform text;
ALTER TABLE public.content_library ADD COLUMN IF NOT EXISTS content text;
