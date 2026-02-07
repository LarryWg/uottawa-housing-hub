-- Admin users table (email-based; no auth account required to add)
-- Bootstrap: Run this in SQL Editor to add your first admin (replace with your email):
--   INSERT INTO public.admin_users (email) VALUES ('your-email@example.com');

CREATE TABLE IF NOT EXISTS public.admin_users (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- SECURITY DEFINER: checks if current user's email is in admin_users
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users a
    WHERE a.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can view the admin list
CREATE POLICY "Admins can view admin_users"
  ON public.admin_users FOR SELECT
  USING (public.is_admin());

-- Only admins can add new admins
CREATE POLICY "Admins can insert admin_users"
  ON public.admin_users FOR INSERT
  WITH CHECK (public.is_admin());

-- Only admins can remove admins (including themselves)
CREATE POLICY "Admins can delete from admin_users"
  ON public.admin_users FOR DELETE
  USING (public.is_admin());
