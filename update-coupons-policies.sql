-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON coupons;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON coupons;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON coupons;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON coupons;

-- Create new policies that are more permissive for your application
CREATE POLICY "Allow read access for all users" ON coupons
FOR SELECT USING (true);

CREATE POLICY "Allow insert for all users" ON coupons
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for all users" ON coupons
FOR UPDATE USING (true);

CREATE POLICY "Allow delete for all users" ON coupons
FOR DELETE USING (true);