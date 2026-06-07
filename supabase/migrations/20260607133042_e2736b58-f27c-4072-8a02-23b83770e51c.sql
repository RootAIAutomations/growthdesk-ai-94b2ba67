
-- 1. PROFILES TABLE
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. ADD user_id TO ALL DATA TABLES (nullable so the trigger can claim them)
ALTER TABLE public.clients            ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.outreach_drafts    ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.content_calendar   ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.content_library    ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.follow_up_schedule ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.message_log        ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS clients_user_id_idx            ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS outreach_drafts_user_id_idx    ON public.outreach_drafts(user_id);
CREATE INDEX IF NOT EXISTS content_calendar_user_id_idx   ON public.content_calendar(user_id);
CREATE INDEX IF NOT EXISTS content_library_user_id_idx    ON public.content_library(user_id);
CREATE INDEX IF NOT EXISTS follow_up_schedule_user_id_idx ON public.follow_up_schedule(user_id);
CREATE INDEX IF NOT EXISTS message_log_user_id_idx        ON public.message_log(user_id);

-- 3. AUTO-CREATE PROFILE ON SIGNUP + CLAIM ORPHAN DATA FOR FIRST USER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_first_user boolean;
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;

  SELECT (SELECT COUNT(*) FROM public.profiles) = 1 INTO is_first_user;

  IF is_first_user THEN
    UPDATE public.clients            SET user_id = NEW.id WHERE user_id IS NULL;
    UPDATE public.outreach_drafts    SET user_id = NEW.id WHERE user_id IS NULL;
    UPDATE public.content_calendar   SET user_id = NEW.id WHERE user_id IS NULL;
    UPDATE public.content_library    SET user_id = NEW.id WHERE user_id IS NULL;
    UPDATE public.follow_up_schedule SET user_id = NEW.id WHERE user_id IS NULL;
    UPDATE public.message_log        SET user_id = NEW.id WHERE user_id IS NULL;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. REPLACE OPEN POLICIES WITH PER-USER RLS
-- clients
DROP POLICY IF EXISTS open_all ON public.clients;
CREATE POLICY "clients_select_own" ON public.clients
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "clients_insert_own" ON public.clients
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "clients_update_own" ON public.clients
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "clients_delete_own" ON public.clients
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- outreach_drafts
DROP POLICY IF EXISTS open_all ON public.outreach_drafts;
CREATE POLICY "outreach_drafts_select_own" ON public.outreach_drafts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "outreach_drafts_insert_own" ON public.outreach_drafts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "outreach_drafts_update_own" ON public.outreach_drafts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "outreach_drafts_delete_own" ON public.outreach_drafts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- content_calendar
DROP POLICY IF EXISTS open_all ON public.content_calendar;
CREATE POLICY "content_calendar_select_own" ON public.content_calendar
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "content_calendar_insert_own" ON public.content_calendar
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "content_calendar_update_own" ON public.content_calendar
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "content_calendar_delete_own" ON public.content_calendar
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- content_library
DROP POLICY IF EXISTS open_all ON public.content_library;
CREATE POLICY "content_library_select_own" ON public.content_library
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "content_library_insert_own" ON public.content_library
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "content_library_update_own" ON public.content_library
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "content_library_delete_own" ON public.content_library
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- follow_up_schedule
DROP POLICY IF EXISTS open_all ON public.follow_up_schedule;
CREATE POLICY "follow_up_select_own" ON public.follow_up_schedule
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "follow_up_insert_own" ON public.follow_up_schedule
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "follow_up_update_own" ON public.follow_up_schedule
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "follow_up_delete_own" ON public.follow_up_schedule
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- message_log
DROP POLICY IF EXISTS open_all ON public.message_log;
CREATE POLICY "message_log_select_own" ON public.message_log
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "message_log_insert_own" ON public.message_log
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "message_log_update_own" ON public.message_log
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "message_log_delete_own" ON public.message_log
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
