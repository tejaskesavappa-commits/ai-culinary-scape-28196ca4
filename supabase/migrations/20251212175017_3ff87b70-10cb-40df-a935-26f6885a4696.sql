-- Fix 1: Require authentication for restaurant registration (prevent spam)
DROP POLICY IF EXISTS "Anyone can register restaurant" ON public.restaurants;
CREATE POLICY "Authenticated users can register restaurant"
ON public.restaurants
FOR INSERT
TO authenticated
WITH CHECK (email = (auth.jwt() ->> 'email'::text));

-- Fix 2: Allow delivery partners to view orders assigned to them
DROP POLICY IF EXISTS "Users can view orders" ON public.orders;
CREATE POLICY "Users and delivery partners can view orders"
ON public.orders
FOR SELECT
USING (
  (user_id = auth.uid()) 
  OR (delivery_partner_id IN (SELECT id FROM delivery_partners WHERE user_id = auth.uid()))
  OR is_admin()
);

-- Fix 3: Allow delivery partners to update orders assigned to them
DROP POLICY IF EXISTS "Users can update orders" ON public.orders;
CREATE POLICY "Users and delivery partners can update orders"
ON public.orders
FOR UPDATE
USING (
  (user_id = auth.uid()) 
  OR (delivery_partner_id IN (SELECT id FROM delivery_partners WHERE user_id = auth.uid()))
  OR is_admin()
);

-- Fix 4: Create a function to get approximate delivery partner location (not exact)
CREATE OR REPLACE FUNCTION public.get_delivery_partner_approximate_location(partner_id uuid)
RETURNS TABLE (
  approximate_latitude numeric,
  approximate_longitude numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    ROUND(current_latitude, 2) as approximate_latitude,
    ROUND(current_longitude, 2) as approximate_longitude
  FROM delivery_partners
  WHERE id = partner_id
    AND is_available = true;
$$;

-- Fix 5: Restrict delivery partner location visibility - only show to users with active orders
DROP POLICY IF EXISTS "Delivery partners visible to relevant parties" ON public.delivery_partners;
CREATE POLICY "Delivery partners visible to relevant parties"
ON public.delivery_partners
FOR SELECT
USING (
  (user_id = auth.uid()) -- Own profile
  OR is_admin() -- Admins
  OR (
    -- Only customers with ACTIVE orders (pending, preparing, out_for_delivery)
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.delivery_partner_id = delivery_partners.id 
        AND orders.user_id = auth.uid()
        AND orders.status IN ('pending', 'confirmed', 'preparing', 'out_for_delivery')
    )
  )
);