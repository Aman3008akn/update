-- Migrate existing orders to work with the new structure
-- This script updates existing data to match the new column requirements

-- Update existing orders to ensure they have proper text IDs
-- This assumes your existing IDs are numeric and need to be converted
UPDATE orders 
SET id = 'ORD-' || id 
WHERE id !~ '^ORD-';

-- Update existing orders to set default payment status
UPDATE orders 
SET payment_status = 'pending' 
WHERE payment_status IS NULL;

-- Update existing orders to set default updated_at timestamp
UPDATE orders 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- If you have existing user data, you might want to link orders to users
-- This is just an example - you'll need to adjust based on your actual data
-- UPDATE orders 
-- SET user_id = (SELECT id FROM users WHERE email = orders.customer_email LIMIT 1)
-- WHERE user_id IS NULL AND customer_email IS NOT NULL;

-- If you want to create user_identifier from existing data
UPDATE orders 
SET user_identifier = customer_email 
WHERE user_identifier IS NULL AND customer_email IS NOT NULL;

-- Add any other data migration logic here based on your specific needs