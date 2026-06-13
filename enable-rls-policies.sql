-- Enable RLS on coupons table
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Enable RLS on site_settings table
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create basic policies for coupons (adjust as needed for your specific requirements)
CREATE POLICY "Enable read access for all users" ON "coupons"
FOR SELECT USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON "coupons"
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON "coupons"
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete access for authenticated users" ON "coupons"
FOR DELETE USING (auth.role() = 'authenticated');

-- Create basic policies for site_settings (adjust as needed for your specific requirements)
CREATE POLICY "Enable read access for all users" ON "site_settings"
FOR SELECT USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON "site_settings"
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON "site_settings"
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete access for authenticated users" ON "site_settings"
FOR DELETE USING (auth.role() = 'authenticated');