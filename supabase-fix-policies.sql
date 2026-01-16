-- Fix Security Permissions and Visibility
-- This ensures the Website (Public) can SEE products, and Admin (Auth) can EDIT them.

-- 1. Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. Create Policy: Public Read Access (Website Visitor)
-- Drop existing to avoid conflicts
DROP POLICY IF EXISTS "Public Read Access" ON products;
CREATE POLICY "Public Read Access" ON products 
FOR SELECT 
USING (true);

-- 3. Create Policy: Admin Full Access (Logged In User)
DROP POLICY IF EXISTS "Admin Full Access" ON products;
CREATE POLICY "Admin Full Access" ON products 
FOR ALL 
USING (auth.role() = 'authenticated');

-- 4. Ensure Realtime Publication is enabled (for instant updates)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE products;
EXCEPTION
  WHEN OTHERS THEN NULL; -- Ignore if already added
END $$;
