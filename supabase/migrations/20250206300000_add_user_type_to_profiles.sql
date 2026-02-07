-- Add user_type to profiles (student | landlord)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'student'
CHECK (user_type IN ('student', 'landlord'));
