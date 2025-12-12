-- Fix 1: Create a function to return public restaurant data without sensitive columns
CREATE OR REPLACE FUNCTION public.get_public_restaurants()
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  cuisine_type text,
  address text,
  image_url text,
  rating numeric,
  avg_delivery_time text,
  opening_time text,
  closing_time text,
  is_approved boolean,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id, name, description, cuisine_type, address, image_url, 
    rating, avg_delivery_time, opening_time, closing_time,
    is_approved, created_at, updated_at
  FROM public.restaurants
  WHERE is_approved = true;
$$;

-- Fix 2: Drop the overly permissive public SELECT policy on restaurants
DROP POLICY IF EXISTS "Restaurants are publicly viewable" ON public.restaurants;

-- Create new policy: Only restaurant owners can see their own full data (including email/phone)
CREATE POLICY "Restaurant owners can view own restaurant"
ON public.restaurants
FOR SELECT
USING (email = (auth.jwt() ->> 'email'::text));

-- Fix 3: Add explicit DELETE policy for delivery_partners (admin only)
CREATE POLICY "Only admins can delete delivery partners"
ON public.delivery_partners
FOR DELETE
USING (is_admin());