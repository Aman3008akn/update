-- Add role column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Update the admin user's role
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@mythmanga.com';

-- Create a trigger to automatically set role for new users
-- This ensures that only specific users get admin role