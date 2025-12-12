-- Update the get_public_restaurants function to exclude sensitive owner information
CREATE OR REPLACE FUNCTION public.get_public_restaurants()
 RETURNS TABLE(id uuid, name text, description text, cuisine_type text, address text, image_url text, rating numeric, avg_delivery_time text, opening_time text, closing_time text, is_approved boolean, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT 
    id, name, description, cuisine_type, address, image_url, 
    rating, avg_delivery_time, opening_time, closing_time,
    is_approved, created_at, updated_at
  FROM public.restaurants
  WHERE is_approved = true;
$function$;