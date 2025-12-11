-- Fix 1: Update orders table policies to allow admin access
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view orders"
ON orders FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own orders" ON orders;
CREATE POLICY "Users can update orders"
ON orders FOR UPDATE TO authenticated
USING (user_id = auth.uid() OR public.is_admin());

-- Fix 2: Restrict delivery partners visibility to relevant parties only
DROP POLICY IF EXISTS "Delivery partners publicly viewable" ON delivery_partners;
CREATE POLICY "Delivery partners visible to relevant parties"
ON delivery_partners FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_admin()
  OR EXISTS (
    SELECT 1 FROM orders
    WHERE orders.delivery_partner_id = delivery_partners.id
    AND orders.user_id = auth.uid()
  )
);

-- Fix 3: Protect delivery partner metrics from self-manipulation
CREATE OR REPLACE FUNCTION public.protect_delivery_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent non-admin users from updating protected metric fields
  IF NOT public.is_admin() THEN
    NEW.rating := OLD.rating;
    NEW.total_deliveries := OLD.total_deliveries;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS protect_delivery_partner_metrics ON delivery_partners;
CREATE TRIGGER protect_delivery_partner_metrics
BEFORE UPDATE ON delivery_partners
FOR EACH ROW EXECUTE FUNCTION public.protect_delivery_metrics();