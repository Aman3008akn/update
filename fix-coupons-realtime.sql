-- First, ensure the coupons table has all the necessary columns
ALTER TABLE coupons 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';

-- Enable real-time for coupons table
DO $$ 
BEGIN
  ALTER publication supabase_realtime ADD TABLE coupons;
EXCEPTION 
  WHEN duplicate_object THEN RAISE NOTICE 'Table coupons already in publication';
END $$;

-- Enable RLS on coupons table
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Create policies for coupons table
CREATE POLICY "Enable read access for all users" ON "coupons"
FOR SELECT USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON "coupons"
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON "coupons"
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete access for authenticated users" ON "coupons"
FOR DELETE USING (auth.role() = 'authenticated');