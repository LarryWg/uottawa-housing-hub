-- Add profile_visible for roommate finder (opt-in to appear in pool)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS profile_visible BOOLEAN DEFAULT false;
