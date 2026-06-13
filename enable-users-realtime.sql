-- Enable real-time for users table
DO $$ 
BEGIN
  ALTER publication supabase_realtime ADD TABLE users;
EXCEPTION 
  WHEN duplicate_object THEN RAISE NOTICE 'Table users already in publication';
END $$;

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Allow read access for all users" ON users
FOR SELECT USING (true);

CREATE POLICY "Allow insert for all users" ON users
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for all users" ON users
FOR UPDATE USING (true);

CREATE POLICY "Allow delete for all users" ON users
FOR DELETE USING (true);