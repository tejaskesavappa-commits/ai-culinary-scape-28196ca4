-- Relax RLS on restaurant_order_items to allow inserts for any existing restaurant order
-- while still preventing arbitrary access

ALTER POLICY "Customers can create order items" ON public.restaurant_order_items
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.restaurant_orders o
    WHERE o.id = restaurant_order_items.order_id
  )
);
