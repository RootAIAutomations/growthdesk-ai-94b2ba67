-- Add video_script column to content_calendar for Reels/Shorts/TikTok scripts
alter table public.content_calendar add column if not exists video_script text;
