-- Create a security definer function to check if user is a delivery partner
CREATE OR REPLACE FUNCTION public.get_user_delivery_partner_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM delivery_partners WHERE user_id = _user_id LIMIT 1
$$;

-- Create a security definer function to check if delivery partner has active orders for a user
CREATE OR REPLACE FUNCTION public.delivery_partner_has_active_order_for_user(_partner_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM orders
    WHERE delivery_partner_id = _partner_id
      AND user_id = _user_id
      AND status = ANY (ARRAY['pending', 'confirmed', 'preparing', 'out_for_delivery'])
  )
$$;

-- Drop existing problematic policies on orders
DROP POLICY IF EXISTS "Users and delivery partners can view orders" ON orders;
DROP POLICY IF EXISTS "Users and delivery partners can update orders" ON orders;

-- Create fixed policies on orders using the helper function
CREATE POLICY "Users and delivery partners can view orders" 
ON orders 
FOR SELECT 
USING (
  user_id = auth.uid() 
  OR delivery_partner_id = public.get_user_delivery_partner_id(auth.uid())
  OR is_admin()
);

CREATE POLICY "Users and delivery partners can update orders" 
ON orders 
FOR UPDATE 
USING (
  user_id = auth.uid() 
  OR delivery_partner_id = public.get_user_delivery_partner_id(auth.uid())
  OR is_admin()
);

-- Drop existing problematic policy on delivery_partners
DROP POLICY IF EXISTS "Delivery partners visible to relevant parties" ON delivery_partners;

-- Create fixed policy on delivery_partners using the helper function
CREATE POLICY "Delivery partners visible to relevant parties" 
ON delivery_partners 
FOR SELECT 
USING (
  user_id = auth.uid() 
  OR is_admin() 
  OR public.delivery_partner_has_active_order_for_user(id, auth.uid())
);