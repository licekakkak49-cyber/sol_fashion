-- ==============================================================================
-- SOL Fashion: Orders & Order Items Schema Migration for Supabase
-- Run this script in the Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_email TEXT NOT NULL,
    customer_first_name TEXT,
    customer_last_name TEXT,
    customer_phone TEXT,
    gender TEXT DEFAULT 'Mr',
    shipping_address TEXT,
    shipping_country TEXT DEFAULT 'Thailand',
    delivery_method TEXT DEFAULT 'Express (Free)',
    payment_method TEXT NOT NULL,
    payment_status TEXT DEFAULT 'paid', -- 'pending', 'paid', 'failed', 'refunded'
    order_status TEXT DEFAULT 'processing', -- 'processing', 'shipped', 'delivered', 'cancelled'
    subtotal_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    shipping_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    stripe_payment_id TEXT,
    stripe_card_brand TEXT,
    stripe_card_last4 TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT,
    product_name TEXT NOT NULL,
    variant_name TEXT,
    size TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Indexes for High Performance Querying
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 5. Set RLS Policies (Permit Storefront Anon Purchases & Read Access)
DROP POLICY IF EXISTS "Public can create orders" ON public.orders;
CREATE POLICY "Public can create orders" 
ON public.orders FOR INSERT 
TO public, anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read orders" ON public.orders;
CREATE POLICY "Public can read orders" 
ON public.orders FOR SELECT 
TO public, anon, authenticated 
USING (true);

DROP POLICY IF EXISTS "Public can create order items" ON public.order_items;
CREATE POLICY "Public can create order items" 
ON public.order_items FOR INSERT 
TO public, anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read order items" ON public.order_items;
CREATE POLICY "Public can read order items" 
ON public.order_items FOR SELECT 
TO public, anon, authenticated 
USING (true);

-- 6. Helper Function to Deduct Product Stock Automatically upon Order
CREATE OR REPLACE FUNCTION public.deduct_product_stock(p_product_id TEXT, p_quantity INT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.products
    SET stock = GREATEST(0, COALESCE(stock, 0) - p_quantity)
    WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
