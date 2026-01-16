-- Enable Real-time Updates for Products
-- Run this to allow the Frontend to instantly see changes made in the Admin Dashboard

DO $$
BEGIN
  -- Add the products table to the supabase_realtime publication
  ALTER PUBLICATION supabase_realtime ADD TABLE products;
EXCEPTION
  -- If it's already added, ignore the error
  WHEN duplicate_object THEN NULL;
  WHEN OTHERS THEN NULL; -- Safety net
END $$;

-- Verify it worked (Optional)
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'products';
