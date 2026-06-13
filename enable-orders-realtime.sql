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
CREATE POLICY "Allow read access for all users" ON orders
FOR SELECT USING (true);

CREATE POLICY "Allow insert for all users" ON orders
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for all users" ON orders
FOR UPDATE USING (true);

CREATE POLICY "Allow delete for all users" ON orders
FOR DELETE USING (true);