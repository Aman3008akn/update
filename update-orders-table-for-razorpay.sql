-- Update existing orders table to add Razorpay integration fields
-- This script safely adds the necessary columns to an existing orders table

-- Add new columns for enhanced order tracking
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_phone TEXT;

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS user_identifier TEXT;

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipping_name TEXT;

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipping_street TEXT;

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipping_city TEXT;

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipping_state TEXT;

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipping_zip TEXT;

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT UNIQUE;

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT UNIQUE;

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS razorpay_signature TEXT;

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update the id column to TEXT type if it's currently SERIAL/INTEGER
-- This is a more complex operation and should be done carefully
-- First, check if the column is already TEXT
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'id' AND data_type != 'text'
  ) THEN
    -- If id is not TEXT, we need to convert it
    ALTER TABLE orders ALTER COLUMN id TYPE TEXT USING id::TEXT;
  END IF;
END $$;

-- Change total_amount to DECIMAL(10, 2) if it's not already
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'total_amount' AND data_type != 'numeric'
  ) THEN
    ALTER TABLE orders ALTER COLUMN total_amount TYPE DECIMAL(10, 2);
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Enable Row Level Security (RLS) if not already enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and create new ones
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;

-- Create policies for RLS
-- Allow users to view their own orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id OR user_identifier = auth.uid()::TEXT);

-- Allow users to insert their own orders
CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_identifier = auth.uid()::TEXT);

-- Allow users to update their own orders
CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id OR user_identifier = auth.uid()::TEXT);

-- Grant necessary permissions
GRANT ALL ON TABLE orders TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE orders TO anon;