-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  hero_title TEXT,
  hero_subtitle TEXT,
  top_announcement_1 TEXT,
  top_announcement_2 TEXT,
  top_announcement_3 TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  show_offer_bar BOOLEAN
);

-- Insert default settings
INSERT INTO site_settings (id, hero_title, hero_subtitle, top_announcement_1, top_announcement_2, top_announcement_3, primary_color, secondary_color, show_offer_bar)
VALUES (1, 'Welcome to MythManga Store', 'Your Ultimate Destination for Anime Merchandise', 'Web Designed By Aman Shukla', 'Flat 50% OFF On New Collection', 'Free Shipping On Orders Above ₹999', '#2C3E50', '#F5C842', true)
ON CONFLICT (id) DO NOTHING;

-- Enable real-time for site_settings table
DO $$ 
BEGIN
  ALTER publication supabase_realtime ADD TABLE site_settings;
EXCEPTION 
  WHEN duplicate_object THEN RAISE NOTICE 'Table site_settings already in publication';
END $$;