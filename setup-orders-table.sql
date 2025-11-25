-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  items JSONB,
  total_amount DECIMAL(10, 2),
  status TEXT DEFAULT 'Pending',
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable real-time for orders table
DO $$ 
BEGIN
  ALTER publication supabase_realtime ADD TABLE orders;
EXCEPTION 
  WHEN duplicate_object THEN RAISE NOTICE 'Table orders already in publication';
END $$;

-- Enable RLS on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders table
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow read access for all users" ON orders;
EXCEPTION 
  WHEN undefined_object THEN RAISE NOTICE 'Policy "Allow read access for all users" does not exist';
END $$;

DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow insert for all users" ON orders;
EXCEPTION 
  WHEN undefined_object THEN RAISE NOTICE 'Policy "Allow insert for all users" does not exist';
END $$;

DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow update for all users" ON orders;
EXCEPTION 
  WHEN undefined_object THEN RAISE NOTICE 'Policy "Allow update for all users" does not exist';
END $$;

DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow delete for all users" ON orders;
EXCEPTION 
  WHEN undefined_object THEN RAISE NOTICE 'Policy "Allow delete for all users" does not exist';
END $$;

CREATE POLICY "Allow read access for all users" ON orders
FOR SELECT USING (true);

CREATE POLICY "Allow insert for all users" ON orders
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for all users" ON orders
FOR UPDATE USING (true);

CREATE POLICY "Allow delete for all users" ON orders
FOR DELETE USING (true);