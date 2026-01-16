-- Enhanced Site Settings Table
-- Run this SQL in your Supabase SQL Editor

-- Drop existing table if needed (be careful with data!)
-- DROP TABLE IF EXISTS site_settings;

-- Create comprehensive site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Site Basic Info
  site_name TEXT DEFAULT 'MythManga',
  site_tagline TEXT DEFAULT 'Premium Anime Merchandise',
  logo_url TEXT DEFAULT '',
  favicon_url TEXT DEFAULT '',
  
  -- Hero Section
  hero_title TEXT DEFAULT 'UNLEASH YOUR OTAKU SOUL',
  hero_subtitle TEXT DEFAULT 'The ultimate collection of premium anime merchandise.',
  hero_image TEXT DEFAULT 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80',
  hero_cta_text TEXT DEFAULT 'Shop Now',
  hero_cta_link TEXT DEFAULT '/catalog/figurines',
  
  -- Hero Banners (JSON array for 10 banners)
  hero_banners JSONB DEFAULT '[]'::jsonb,
  hero_banner_enabled BOOLEAN DEFAULT true,
  hero_banner_interval INTEGER DEFAULT 5000,
  
  -- Announcement Bar
  top_announcement_1 TEXT DEFAULT '🎉 Free Shipping on Orders Above ₹999!',
  top_announcement_2 TEXT DEFAULT '⚡ New Arrivals Every Week!',
  top_announcement_3 TEXT DEFAULT '🔥 Exclusive Deals for Members!',
  show_announcement_bar BOOLEAN DEFAULT true,
  announcement_bg_color TEXT DEFAULT '#000000',
  announcement_text_color TEXT DEFAULT '#ffffff',
  
  -- Featured Section
  featured_section_title TEXT DEFAULT 'Featured Loot',
  featured_section_subtitle TEXT DEFAULT 'Handpicked premium items just for you',
  show_featured_section BOOLEAN DEFAULT true,
  
  -- New Arrivals Section
  new_arrivals_title TEXT DEFAULT 'New Arrivals',
  new_arrivals_subtitle TEXT DEFAULT 'Fresh drops you cannot miss',
  show_new_arrivals BOOLEAN DEFAULT true,
  
  -- Best Sellers Section
  best_sellers_title TEXT DEFAULT 'Fan Favorites',
  best_sellers_subtitle TEXT DEFAULT 'Most loved by our community',
  show_best_sellers BOOLEAN DEFAULT true,
  
  -- Colors
  primary_color TEXT DEFAULT '#2C3E50',
  secondary_color TEXT DEFAULT '#F5C842',
  accent_color TEXT DEFAULT '#E74C3C',
  background_color TEXT DEFAULT '#F7F9FC',
  
  -- Footer Settings
  footer_about TEXT DEFAULT 'MythManga is your ultimate destination for authentic anime merchandise.',
  footer_copyright TEXT DEFAULT '© 2026 MythManga. All rights reserved.',
  show_footer_newsletter BOOLEAN DEFAULT true,
  newsletter_title TEXT DEFAULT 'Subscribe to our Newsletter',
  newsletter_subtitle TEXT DEFAULT 'Get exclusive deals and updates',
  
  -- Social Links
  facebook_url TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  twitter_url TEXT DEFAULT '',
  youtube_url TEXT DEFAULT '',
  discord_url TEXT DEFAULT '',
  tiktok_url TEXT DEFAULT '',
  
  -- Contact Info
  contact_email TEXT DEFAULT 'support@mythmanga.com',
  contact_phone TEXT DEFAULT '+91 9876543210',
  contact_address TEXT DEFAULT 'Mumbai, Maharashtra, India',
  whatsapp_number TEXT DEFAULT '919876543210',
  show_whatsapp_button BOOLEAN DEFAULT true,
  
  -- Live Sales Notification
  show_live_sales BOOLEAN DEFAULT true,
  live_sales_cities JSONB DEFAULT '["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"]'::jsonb,
  
  -- Features Toggle
  show_reviews BOOLEAN DEFAULT true,
  show_recommendations BOOLEAN DEFAULT true,
  show_smart_search BOOLEAN DEFAULT true,
  show_emi_options BOOLEAN DEFAULT true,
  
  -- SEO Settings
  meta_title TEXT DEFAULT 'MythManga - Premium Anime Merchandise Store',
  meta_description TEXT DEFAULT 'Shop authentic anime figurines, manga, posters, and accessories.',
  meta_keywords TEXT DEFAULT 'anime, manga, figurines, merchandise, otaku',
  
  -- Shipping Settings
  free_shipping_threshold DECIMAL DEFAULT 999,
  shipping_message TEXT DEFAULT 'Free shipping on orders above ₹999',
  
  -- Popup/Offer Settings
  show_welcome_popup BOOLEAN DEFAULT false,
  welcome_popup_title TEXT DEFAULT 'Welcome to MythManga!',
  welcome_popup_message TEXT DEFAULT 'Get 10% OFF on your first order!',
  welcome_popup_code TEXT DEFAULT 'WELCOME10',
  
  -- Maintenance Mode
  maintenance_mode BOOLEAN DEFAULT false,
  maintenance_message TEXT DEFAULT 'We are currently updating our store. Please check back soon!',
  
  -- Time-based Settings
  morning_greeting TEXT DEFAULT 'Good Morning! Start Your Day with Amazing Deals',
  afternoon_greeting TEXT DEFAULT 'Good Afternoon! Check Out Today''s Hot Picks',
  night_greeting TEXT DEFAULT 'Good Evening! Explore Our Premium Night Collection',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read settings
CREATE POLICY "Anyone can read site settings"
  ON site_settings
  FOR SELECT
  USING (true);

-- Policy: Only admins can update
CREATE POLICY "Admins can update site settings"
  ON site_settings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy: Only admins can insert
CREATE POLICY "Admins can insert site settings"
  ON site_settings
  FOR INSERT
  WITH CHECK (true);

-- Insert default settings if empty
INSERT INTO site_settings (id)
SELECT uuid_generate_v4()
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE site_settings;
