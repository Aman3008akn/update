-- Add payment_status column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Add admin_note column to orders table (also referenced in the update function)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS admin_note TEXT;