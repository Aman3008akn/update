-- Ensure all tables are set up for real-time functionality

-- Enable real-time for all tables
DO $$ 
BEGIN
  ALTER publication supabase_realtime ADD TABLE orders;
EXCEPTION 
  WHEN duplicate_object THEN RAISE NOTICE 'Table orders already in publication';
END $$;

DO $$ 
BEGIN
  ALTER publication supabase_realtime ADD TABLE products;
EXCEPTION 
  WHEN duplicate_object THEN RAISE NOTICE 'Table products already in publication';
END $$;

DO $$ 
BEGIN
  ALTER publication supabase_realtime ADD TABLE coupons;
EXCEPTION 
  WHEN duplicate_object THEN RAISE NOTICE 'Table coupons already in publication';
END $$;

DO $$ 
BEGIN
  ALTER publication supabase_realtime ADD TABLE users;
EXCEPTION 
  WHEN duplicate_object THEN RAISE NOTICE 'Table users already in publication';
END $$;

-- Enable RLS on all tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for orders table
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow read access for own orders" ON orders;
EXCEPTION 
  WHEN undefined_object THEN RAISE NOTICE 'Policy "Allow read access for own orders" does not exist';
END $$;

DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow insert for all users" ON orders;
EXCEPTION 
  WHEN undefined_object THEN RAISE NOTICE 'Policy "Allow insert for all users" does not exist';
END $$;

DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow update for own orders" ON orders;
EXCEPTION 
  WHEN undefined_object THEN RAISE NOTICE 'Policy "Allow update for own orders" does not exist';
END $$;

DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow delete for own orders" ON orders;
EXCEPTION 
  WHEN undefined_object THEN RAISE NOTICE 'Policy "Allow delete for own orders" does not exist';
END $$;

CREATE POLICY "Allow read access for own orders" ON orders
FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Allow insert for all users" ON orders
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for own orders" ON orders
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow delete for own orders" ON orders
FOR DELETE USING (auth.uid() = user_id);

-- Create policies for products table
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow read access for all users" ON products;
EXCEPTION 
  WHEN undefined_object THEN RAISE NOTICE 'Policy "Allow read access for all users" does not exist';
END $$;

DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow insert for all users" ON products;
EXCEPTION 
  WHEN undefined_object THEN RAISE NOTICE 'Policy "Allow insert for all users" does not exist';
END $$;

DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow update for all users" ON products;
EXCEPTION 
  WHEN undefined_object THEN RAISE NOTICE 'Policy "Allow update for all users" does not exist';
END $$;

DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow delete for all users" ON products;
EXCEPTION 
  WHEN undefined_object THEN RAISE NOTICE 'Policy "Allow delete for all users" does not exist';
END $$;

CREATE POLICY "Allow read access for all users" ON products
FOR SELECT USING (true);

CREATE POLICY "Allow insert for all users" ON products
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for all users" ON products
FOR UPDATE USING (true);

CREATE POLICY "Allow delete for all users" ON products
FOR DELETE USING (true);

-- Create policies for coupons table
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow read access for all users" ON coupons;
EXCEPTION 
  WHEN undefined_object THEN RAISE NOTICE 'Policy "Allow read access for all users" does not exist';
END $$;

DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow insert for all users" ON coupons;
EXCEPTION 
  WHEN undefined_object THEN RAISE NOTICE 'Policy "Allow insert for all users" does not exist';
END $$;

DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow update for all users" ON coupons;
EXCEPTION 
  WHEN undefined_object THEN RAISE NOTICE 'Policy "Allow update for all users" does not exist';
END $$;

DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow delete for all users" ON coupons;
EXCEPTION 
  WHEN undefined_object THEN RAISE NOTICE 'Policy "Allow delete for all users" does not exist';
END $$;

CREATE POLICY "Allow read access for all users" ON coupons
FOR SELECT USING (true);

CREATE POLICY "Allow insert for all users" ON coupons
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for all users" ON coupons
FOR UPDATE USING (true);

CREATE POLICY "Allow delete for all users" ON coupons
FOR DELETE USING (true);

-- Create policies for users table
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow read access for all users" ON users;
EXCEPTION 
  WHEN undefined_object THEN RAISE NOTICE 'Policy "Allow read access for all users" does not exist';
END $$;

DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow insert for all users" ON users;
EXCEPTION 
  WHEN undefined_object THEN RAISE NOTICE 'Policy "Allow insert for all users" does not exist';
END $$;

DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow update for all users" ON users;
EXCEPTION 
  WHEN undefined_object THEN RAISE NOTICE 'Policy "Allow update for all users" does not exist';
END $$;

DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow delete for all users" ON users;
EXCEPTION 
  WHEN undefined_object THEN RAISE NOTICE 'Policy "Allow delete for all users" does not exist';
END $$;

CREATE POLICY "Allow read access for all users" ON users
FOR SELECT USING (true);

CREATE POLICY "Allow insert for all users" ON users
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for all users" ON users
FOR UPDATE USING (true);

CREATE POLICY "Allow delete for all users" ON users
FOR DELETE USING (true);