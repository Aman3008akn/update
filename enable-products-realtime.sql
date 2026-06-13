-- Enable real-time for products table
DO $$ 
BEGIN
  ALTER publication supabase_realtime ADD TABLE products;
EXCEPTION 
  WHEN duplicate_object THEN RAISE NOTICE 'Table products already in publication';
END $$;

-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for products table
CREATE POLICY "Allow read access for all users" ON products
FOR SELECT USING (true);

CREATE POLICY "Allow insert for all users" ON products
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for all users" ON products
FOR UPDATE USING (true);

CREATE POLICY "Allow delete for all users" ON products
FOR DELETE USING (true);