-- Enable real-time for coupons table
ALTER PUBLICATION supabase_realtime ADD TABLE coupons;

-- If the above fails because the table is already in the publication, you can ignore the error
-- This ensures that the coupons table is included in real-time subscriptions