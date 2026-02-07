alter table public.listings
  add column if not exists landlord_id uuid references auth.users(id) on delete set null,
  add column if not exists landlord_name text,
  add column if not exists landlord_email text;
