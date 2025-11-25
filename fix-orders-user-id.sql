-- Fix the orders table to handle both UUID user IDs and text-based IDs
-- First, let's add the shipping columns if they don't exist
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipping_name TEXT,
ADD COLUMN IF NOT EXISTS shipping_street TEXT,
ADD COLUMN IF NOT EXISTS shipping_city TEXT,
ADD COLUMN IF NOT EXISTS shipping_state TEXT,
ADD COLUMN IF NOT EXISTS shipping_zip TEXT;

-- Since we can't easily change the user_id column type, we'll create a new column for non-UUID IDs
-- and update our application logic to use the appropriate column
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS user_identifier TEXT;

-- Update existing records to populate user_identifier where user_id is NULL but there might be a text ID
UPDATE orders 
SET user_identifier = user_id::TEXT 
WHERE user_id IS NOT NULL;

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_identifier ON orders(user_identifier);