CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: delivery_partners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.delivery_partners (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    vehicle_type text,
    vehicle_number text,
    is_available boolean DEFAULT true,
    current_latitude numeric,
    current_longitude numeric,
    rating numeric DEFAULT 5.0,
    total_deliveries integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: menu_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.menu_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    restaurant_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    price numeric NOT NULL,
    category text DEFAULT 'Main Course'::text NOT NULL,
    image_url text,
    is_veg boolean DEFAULT true,
    is_available boolean DEFAULT true,
    is_alcoholic boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    product_id uuid NOT NULL,
    quantity integer NOT NULL,
    price numeric NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: order_status_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_status_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    status text NOT NULL,
    updated_by uuid,
    notes text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    total_amount numeric NOT NULL,
    delivery_address text NOT NULL,
    phone text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    payment_method text DEFAULT 'cod'::text NOT NULL,
    payment_status text DEFAULT 'pending'::text,
    payment_id text,
    notes text,
    delivery_partner_id uuid,
    estimated_delivery_time timestamp with time zone,
    actual_delivery_time timestamp with time zone,
    delivery_latitude numeric,
    delivery_longitude numeric,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    category text NOT NULL,
    price numeric NOT NULL,
    image_url text,
    images text[],
    stock_quantity integer DEFAULT 0,
    is_available boolean DEFAULT true,
    is_alcoholic boolean DEFAULT false,
    rating numeric DEFAULT 4.0,
    discount numeric DEFAULT 0,
    vendor text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text NOT NULL,
    full_name text,
    phone text,
    address text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: restaurant_order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.restaurant_order_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    menu_item_id uuid NOT NULL,
    menu_item_name text NOT NULL,
    quantity integer NOT NULL,
    price numeric NOT NULL,
    is_veg boolean,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: restaurant_orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.restaurant_orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    restaurant_id uuid NOT NULL,
    customer_name text NOT NULL,
    customer_phone text NOT NULL,
    delivery_address text NOT NULL,
    total_amount numeric NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    payment_method text DEFAULT 'cod'::text NOT NULL,
    payment_status text DEFAULT 'pending'::text NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: restaurants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.restaurants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    owner_name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    address text NOT NULL,
    cuisine_type text NOT NULL,
    description text NOT NULL,
    opening_time text NOT NULL,
    closing_time text NOT NULL,
    avg_delivery_time text NOT NULL,
    image_url text,
    rating numeric DEFAULT 4.0,
    is_approved boolean DEFAULT false,
    approval_token text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role text DEFAULT 'user'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: delivery_partners delivery_partners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delivery_partners
    ADD CONSTRAINT delivery_partners_pkey PRIMARY KEY (id);


--
-- Name: menu_items menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: order_status_history order_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT order_status_history_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: restaurant_order_items restaurant_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurant_order_items
    ADD CONSTRAINT restaurant_order_items_pkey PRIMARY KEY (id);


--
-- Name: restaurant_orders restaurant_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurant_orders
    ADD CONSTRAINT restaurant_orders_pkey PRIMARY KEY (id);


--
-- Name: restaurants restaurants_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_email_key UNIQUE (email);


--
-- Name: restaurants restaurants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: delivery_partners update_delivery_partners_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_delivery_partners_updated_at BEFORE UPDATE ON public.delivery_partners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: menu_items update_menu_items_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: orders update_orders_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: products update_products_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: restaurant_orders update_restaurant_orders_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_restaurant_orders_updated_at BEFORE UPDATE ON public.restaurant_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: restaurants update_restaurants_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON public.restaurants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: delivery_partners delivery_partners_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.delivery_partners
    ADD CONSTRAINT delivery_partners_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: menu_items menu_items_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: order_status_history order_status_history_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT order_status_history_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: orders orders_delivery_partner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_delivery_partner_id_fkey FOREIGN KEY (delivery_partner_id) REFERENCES public.delivery_partners(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: restaurant_order_items restaurant_order_items_menu_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurant_order_items
    ADD CONSTRAINT restaurant_order_items_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id);


--
-- Name: restaurant_order_items restaurant_order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurant_order_items
    ADD CONSTRAINT restaurant_order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.restaurant_orders(id) ON DELETE CASCADE;


--
-- Name: restaurant_orders restaurant_orders_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurant_orders
    ADD CONSTRAINT restaurant_orders_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id);


--
-- Name: restaurant_orders restaurant_orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurant_orders
    ADD CONSTRAINT restaurant_orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: products Admins can manage products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage products" ON public.products TO authenticated USING (true) WITH CHECK (true);


--
-- Name: restaurants Anyone can register restaurant; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can register restaurant" ON public.restaurants FOR INSERT WITH CHECK (true);


--
-- Name: order_status_history Authenticated can insert order history; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated can insert order history" ON public.order_status_history FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: restaurant_order_items Customers can create order items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Customers can create order items" ON public.restaurant_order_items FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.restaurant_orders o
  WHERE ((o.id = restaurant_order_items.order_id) AND (o.user_id = auth.uid())))));


--
-- Name: restaurant_orders Customers can create orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Customers can create orders" ON public.restaurant_orders FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));


--
-- Name: restaurant_orders Customers can view own orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Customers can view own orders" ON public.restaurant_orders FOR SELECT TO authenticated USING (((user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.restaurants r
  WHERE ((r.id = restaurant_orders.restaurant_id) AND (r.email = (auth.jwt() ->> 'email'::text)))))));


--
-- Name: delivery_partners Delivery partners publicly viewable; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Delivery partners publicly viewable" ON public.delivery_partners FOR SELECT USING (true);


--
-- Name: menu_items Menu items are publicly viewable; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Menu items are publicly viewable" ON public.menu_items FOR SELECT USING (true);


--
-- Name: restaurant_order_items Order items are viewable with orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Order items are viewable with orders" ON public.restaurant_order_items FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.restaurant_orders o
  WHERE ((o.id = restaurant_order_items.order_id) AND ((o.user_id = auth.uid()) OR (EXISTS ( SELECT 1
           FROM public.restaurants r
          WHERE ((r.id = o.restaurant_id) AND (r.email = (auth.jwt() ->> 'email'::text))))))))));


--
-- Name: products Products publicly viewable; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Products publicly viewable" ON public.products FOR SELECT USING (true);


--
-- Name: menu_items Restaurant owners can delete menu items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Restaurant owners can delete menu items" ON public.menu_items FOR DELETE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.restaurants r
  WHERE ((r.id = menu_items.restaurant_id) AND (r.email = (auth.jwt() ->> 'email'::text))))));


--
-- Name: menu_items Restaurant owners can insert menu items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Restaurant owners can insert menu items" ON public.menu_items FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.restaurants r
  WHERE ((r.id = menu_items.restaurant_id) AND (r.email = (auth.jwt() ->> 'email'::text))))));


--
-- Name: menu_items Restaurant owners can update menu items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Restaurant owners can update menu items" ON public.menu_items FOR UPDATE TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.restaurants r
  WHERE ((r.id = menu_items.restaurant_id) AND (r.email = (auth.jwt() ->> 'email'::text))))));


--
-- Name: restaurant_orders Restaurant owners can update order status; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Restaurant owners can update order status" ON public.restaurant_orders FOR UPDATE TO authenticated USING (((user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.restaurants r
  WHERE ((r.id = restaurant_orders.restaurant_id) AND (r.email = (auth.jwt() ->> 'email'::text)))))));


--
-- Name: restaurants Restaurant owners can update own restaurant; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Restaurant owners can update own restaurant" ON public.restaurants FOR UPDATE TO authenticated USING ((email = (auth.jwt() ->> 'email'::text)));


--
-- Name: restaurants Restaurants are publicly viewable; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Restaurants are publicly viewable" ON public.restaurants FOR SELECT USING (true);


--
-- Name: orders Users can create orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create orders" ON public.orders FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));


--
-- Name: order_items Users can insert order items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert order items" ON public.order_items FOR INSERT TO authenticated WITH CHECK ((EXISTS ( SELECT 1
   FROM public.orders o
  WHERE ((o.id = order_items.order_id) AND (o.user_id = auth.uid())))));


--
-- Name: delivery_partners Users can insert own delivery partner; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own delivery partner" ON public.delivery_partners FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));


--
-- Name: profiles Users can insert own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK ((auth.uid() = id));


--
-- Name: user_roles Users can insert own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()));


--
-- Name: delivery_partners Users can update own delivery partner; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own delivery partner" ON public.delivery_partners FOR UPDATE TO authenticated USING ((user_id = auth.uid()));


--
-- Name: orders Users can update own orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own orders" ON public.orders FOR UPDATE TO authenticated USING ((user_id = auth.uid()));


--
-- Name: profiles Users can update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING ((auth.uid() = id));


--
-- Name: order_status_history Users can view own order history; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own order history" ON public.order_status_history FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.orders o
  WHERE ((o.id = order_status_history.order_id) AND (o.user_id = auth.uid())))));


--
-- Name: order_items Users can view own order items; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.orders o
  WHERE ((o.id = order_items.order_id) AND (o.user_id = auth.uid())))));


--
-- Name: orders Users can view own orders; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: profiles Users can view own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING ((auth.uid() = id));


--
-- Name: user_roles Users can view own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING ((user_id = auth.uid()));


--
-- Name: delivery_partners; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.delivery_partners ENABLE ROW LEVEL SECURITY;

--
-- Name: menu_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

--
-- Name: order_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

--
-- Name: order_status_history; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

--
-- Name: orders; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

--
-- Name: products; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: restaurant_order_items; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.restaurant_order_items ENABLE ROW LEVEL SECURITY;

--
-- Name: restaurant_orders; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.restaurant_orders ENABLE ROW LEVEL SECURITY;

--
-- Name: restaurants; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


