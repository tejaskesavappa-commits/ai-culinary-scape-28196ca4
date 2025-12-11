-- Drop the overly permissive policy that allows any user to insert order history
DROP POLICY IF EXISTS "Authenticated can insert order history" ON order_status_history;

-- Create a new policy that only allows order participants to insert status history
-- This includes: the order owner, assigned delivery partner, or admins
CREATE POLICY "Order participants can insert history"
ON order_status_history FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders o
    WHERE o.id = order_status_history.order_id
    AND (
      o.user_id = auth.uid()
      OR o.delivery_partner_id = auth.uid()
      OR public.is_admin()
    )
  )
);