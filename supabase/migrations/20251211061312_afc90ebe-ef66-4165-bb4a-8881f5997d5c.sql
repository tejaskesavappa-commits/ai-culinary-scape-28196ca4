-- Create a helper function to check if the current user is an admin
-- Using SECURITY DEFINER to bypass RLS and prevent recursive issues
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
$$;

-- Drop the overly permissive policy that allows any user to manage products
DROP POLICY IF EXISTS "Admins can manage products" ON products;

-- Create a new policy that properly checks for admin role
CREATE POLICY "Admins can manage products"
ON products FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());