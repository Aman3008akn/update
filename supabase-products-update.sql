-- Update products table to include Size, Material, and Brand fields
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS size TEXT[],
ADD COLUMN IF NOT EXISTS material TEXT[],
ADD COLUMN IF NOT EXISTS brand TEXT;

-- Enable real-time for products table
DO $$ 
BEGIN
  ALTER publication supabase_realtime ADD TABLE products;
EXCEPTION 
  WHEN duplicate_object THEN RAISE NOTICE 'Table products already in publication';
END $$;