-- Housing listings table for the map feature
-- Run this in Supabase SQL Editor or via `supabase db push` if using Supabase CLI

CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  price INTEGER NOT NULL,
  bedrooms INTEGER NOT NULL DEFAULT 1,
  bathrooms INTEGER NOT NULL DEFAULT 1,
  distance_to_campus TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Allow public read access for now (adjust for auth later)
CREATE POLICY "Allow public read access on listings"
  ON public.listings FOR SELECT
  USING (true);

-- Optional: Add index for map bounding box queries
CREATE INDEX IF NOT EXISTS listings_lat_lng_idx ON public.listings (lat, lng);
