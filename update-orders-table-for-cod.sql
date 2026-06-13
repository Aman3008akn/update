-- Ensure all necessary columns for COD functionality exist in orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS admin_note TEXT;

-- Update any existing orders that might have been created before these columns existed
UPDATE orders 
SET payment_status = 'pending' 
WHERE payment_status IS NULL;

UPDATE orders 
SET admin_note = '' 
WHERE admin_note IS NULL;