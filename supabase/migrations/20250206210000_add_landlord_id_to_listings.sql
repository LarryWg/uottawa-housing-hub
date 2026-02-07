-- Add landlord_id to listings (references profiles)
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS landlord_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Landlords can insert their own listings
CREATE POLICY "Landlords can insert own listings"
  ON public.listings FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND landlord_id = auth.uid()
  );

-- Landlords can update their own listings
CREATE POLICY "Landlords can update own listings"
  ON public.listings FOR UPDATE
  USING (landlord_id = auth.uid())
  WITH CHECK (landlord_id = auth.uid());

-- Landlords can delete their own listings
CREATE POLICY "Landlords can delete own listings"
  ON public.listings FOR DELETE
  USING (landlord_id = auth.uid());
