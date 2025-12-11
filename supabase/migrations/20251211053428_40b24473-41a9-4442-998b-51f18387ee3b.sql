-- Change default value of is_approved to true for auto-approval
ALTER TABLE public.restaurants ALTER COLUMN is_approved SET DEFAULT true;