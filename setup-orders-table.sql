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
CREATE POLICY "Allow read access for own orders" ON orders
FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Allow insert for all users" ON orders
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for own orders" ON orders
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow delete for own orders" ON orders
FOR DELETE USING (auth.uid() = user_id);