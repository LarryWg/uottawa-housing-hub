ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS user_type TEXT CHECK (user_type IN ('student', 'landlord')),
ADD COLUMN IF NOT EXISTS profile_visible BOOLEAN DEFAULT false;

UPDATE public.profiles
SET profile_visible = false
WHERE profile_visible IS NULL;

UPDATE public.profiles
SET user_type = 'student'
WHERE user_type IS NULL;