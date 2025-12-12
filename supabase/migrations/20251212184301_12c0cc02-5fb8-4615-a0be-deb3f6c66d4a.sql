-- Add public SELECT policy for approved restaurants
CREATE POLICY "Public can view approved restaurants"
ON public.restaurants
FOR SELECT
USING (is_approved = true);

-- Keep existing owner policy for owners to manage their restaurants
-- The existing "Restaurant owners can view own restaurant" policy allows owners to see even unapproved restaurants