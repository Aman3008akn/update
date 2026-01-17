-- Comprehensive Site Settings Table
-- Run this SQL in your Supabase SQL Editor
-- This allows you to control EVERYTHING on the website from admin dashboard

-- Drop existing table if needed (backup data first!)
-- DROP TABLE IF EXISTS site_settings;

-- Create comprehensive site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  
  -- ==================== SITE BASIC INFO ====================
  site_name TEXT DEFAULT 'MythManga',
  site_tagline TEXT DEFAULT 'Premium Anime Merchandise',
  logo_url TEXT DEFAULT '/logo.png',
  favicon_url TEXT DEFAULT '/favicon.ico',
  meta_description TEXT DEFAULT 'Shop premium anime merchandise, figurines, clothing and more.',
  meta_keywords TEXT DEFAULT 'anime, manga, figurines, clothing, merchandise',
  
  -- ==================== HERO SECTION ====================
  hero_title TEXT DEFAULT 'UNLEASH YOUR OTAKU SOUL',
  hero_subtitle TEXT DEFAULT 'The ultimate collection of premium anime merchandise.',
  hero_image TEXT DEFAULT 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80',
  hero_cta_text TEXT DEFAULT 'Shop Now',
  hero_cta_link TEXT DEFAULT '/catalog/figurines',
  hero_enabled BOOLEAN DEFAULT true,
  
  -- Hero Banner Carousel Settings
  hero_banner_enabled BOOLEAN DEFAULT true,
  hero_banner_auto_rotate BOOLEAN DEFAULT true,
  hero_banner_interval INTEGER DEFAULT 5000,
  hero_banners JSONB DEFAULT '[]'::jsonb,
  
  -- ==================== ANNOUNCEMENTS ====================
  top_announcement_1 TEXT DEFAULT '🔥 FLASH SALE: Up to 50% OFF on all items!',
  top_announcement_2 TEXT DEFAULT '🚚 FREE Shipping on orders above ₹999',
  top_announcement_3 TEXT DEFAULT '💰 Use code ANIME10 for extra 10% OFF',
  show_offer_bar BOOLEAN DEFAULT true,
  announcement_bg_color TEXT DEFAULT '#2C3E50',
  announcement_text_color TEXT DEFAULT '#FFFFFF',
  
  -- ==================== COLORS/THEME ====================
  primary_color TEXT DEFAULT '#2C3E50',
  secondary_color TEXT DEFAULT '#F5C842',
  accent_color TEXT DEFAULT '#E74C3C',
  background_color TEXT DEFAULT '#FFFFFF',
  text_color TEXT DEFAULT '#2C3E50',
  navbar_bg_color TEXT DEFAULT '#FFFFFF',
  footer_bg_color TEXT DEFAULT '#2C3E50',
  
  -- ==================== NAVBAR SETTINGS ====================
  navbar_logo_text TEXT DEFAULT 'MythManga',
  navbar_show_search BOOLEAN DEFAULT true,
  navbar_show_wishlist BOOLEAN DEFAULT true,
  navbar_show_cart BOOLEAN DEFAULT true,
  navbar_show_account BOOLEAN DEFAULT true,
  navbar_menu_items JSONB DEFAULT '[
    {"label": "Figurines", "link": "/catalog/figurines", "enabled": true},
    {"label": "Clothing", "link": "/catalog/clothing", "enabled": true},
    {"label": "Accessories", "link": "/catalog/accessories", "enabled": true},
    {"label": "Home & Living", "link": "/catalog/home-living", "enabled": true}
  ]'::jsonb,
  
  -- ==================== FOOTER SETTINGS ====================
  footer_about_text TEXT DEFAULT 'MythManga brings you the finest anime merchandise. Quality products, fast shipping, and amazing customer service.',
  footer_copyright TEXT DEFAULT '© 2025 MythManga. All rights reserved.',
  footer_show_newsletter BOOLEAN DEFAULT true,
  footer_newsletter_title TEXT DEFAULT 'Subscribe to our Newsletter',
  footer_newsletter_subtitle TEXT DEFAULT 'Get the latest updates on new products and sales!',
  
  footer_links JSONB DEFAULT '[
    {"title": "Shop", "links": [
      {"label": "Figurines", "url": "/catalog/figurines"},
      {"label": "Clothing", "url": "/catalog/clothing"},
      {"label": "Accessories", "url": "/catalog/accessories"}
    ]},
    {"title": "Support", "links": [
      {"label": "FAQs", "url": "/faq"},
      {"label": "Shipping", "url": "/shipping"},
      {"label": "Returns", "url": "/returns"}
    ]},
    {"title": "Company", "links": [
      {"label": "About Us", "url": "/about"},
      {"label": "Contact", "url": "/contact"},
      {"label": "Careers", "url": "/careers"}
    ]}
  ]'::jsonb,
  
  -- ==================== CONTACT INFO ====================
  contact_email TEXT DEFAULT 'support@mythmanga.com',
  contact_phone TEXT DEFAULT '+91 9876543210',
  contact_address TEXT DEFAULT '123 Anime Street, Tokyo Tower, Mumbai, India - 400001',
  contact_working_hours TEXT DEFAULT 'Mon-Sat: 10AM - 8PM',
  
  -- ==================== SOCIAL MEDIA ====================
  social_facebook TEXT DEFAULT 'https://facebook.com/mythmanga',
  social_instagram TEXT DEFAULT 'https://instagram.com/mythmanga',
  social_twitter TEXT DEFAULT 'https://twitter.com/mythmanga',
  social_youtube TEXT DEFAULT 'https://youtube.com/mythmanga',
  social_discord TEXT DEFAULT 'https://discord.gg/mythmanga',
  social_show_links BOOLEAN DEFAULT true,
  
  -- ==================== WHATSAPP SUPPORT ====================
  whatsapp_enabled BOOLEAN DEFAULT true,
  whatsapp_number TEXT DEFAULT '919876543210',
  whatsapp_message TEXT DEFAULT 'Hi! I need help with my order.',
  whatsapp_position TEXT DEFAULT 'bottom-right',
  
  -- ==================== LIVE NOTIFICATIONS ====================
  live_notifications_enabled BOOLEAN DEFAULT true,
  live_notifications_interval INTEGER DEFAULT 20000,
  live_notifications_cities JSONB DEFAULT '["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad"]'::jsonb,
  
  -- ==================== PRODUCT DISPLAY ====================
  products_per_page INTEGER DEFAULT 12,
  show_out_of_stock BOOLEAN DEFAULT true,
  show_product_ratings BOOLEAN DEFAULT true,
  show_product_reviews BOOLEAN DEFAULT true,
  enable_wishlist BOOLEAN DEFAULT true,
  enable_compare BOOLEAN DEFAULT false,
  
  -- Featured Products Section
  featured_section_title TEXT DEFAULT 'Featured Products',
  featured_section_subtitle TEXT DEFAULT 'Hand-picked premium items for true fans',
  featured_section_enabled BOOLEAN DEFAULT true,
  
  -- New Arrivals Section
  new_arrivals_title TEXT DEFAULT 'New Arrivals',
  new_arrivals_subtitle TEXT DEFAULT 'Fresh drops you will love',
  new_arrivals_enabled BOOLEAN DEFAULT true,
  
  -- Categories Section
  categories_section_title TEXT DEFAULT 'Shop by Category',
  categories_section_enabled BOOLEAN DEFAULT true,
  
  -- ==================== CHECKOUT/PAYMENT ====================
  cod_enabled BOOLEAN DEFAULT true,
  cod_extra_charge DECIMAL DEFAULT 0,
  razorpay_enabled BOOLEAN DEFAULT true,
  min_order_amount DECIMAL DEFAULT 0,
  free_shipping_threshold DECIMAL DEFAULT 999,
  shipping_charge DECIMAL DEFAULT 49,
  
  -- EMI Settings
  emi_enabled BOOLEAN DEFAULT true,
  emi_min_amount DECIMAL DEFAULT 3000,
  emi_interest_rate DECIMAL DEFAULT 14,
  
  -- ==================== DISCOUNT/COUPONS ====================
  coupons_enabled BOOLEAN DEFAULT true,
  show_coupon_on_homepage BOOLEAN DEFAULT true,
  homepage_coupon_code TEXT DEFAULT 'ANIME10',
  homepage_coupon_discount INTEGER DEFAULT 10,
  
  -- ==================== POPUP/MODAL SETTINGS ====================
  welcome_popup_enabled BOOLEAN DEFAULT false,
  welcome_popup_title TEXT DEFAULT 'Welcome to MythManga!',
  welcome_popup_message TEXT DEFAULT 'Get 10% off your first order!',
  welcome_popup_image TEXT DEFAULT '',
  welcome_popup_delay INTEGER DEFAULT 3000,
  
  exit_popup_enabled BOOLEAN DEFAULT false,
  exit_popup_title TEXT DEFAULT 'Wait! Don''t Leave Yet!',
  exit_popup_message TEXT DEFAULT 'Get an exclusive discount before you go!',
  
  -- ==================== MAINTENANCE MODE ====================
  maintenance_mode BOOLEAN DEFAULT false,
  maintenance_message TEXT DEFAULT 'We are currently undergoing maintenance. Please check back soon!',
  maintenance_end_time TIMESTAMP,
  
  -- ==================== SEO SETTINGS ====================
  google_analytics_id TEXT DEFAULT '',
  facebook_pixel_id TEXT DEFAULT '',
  google_tag_manager_id TEXT DEFAULT '',
  
  -- ==================== CUSTOM CSS/JS ====================
  custom_css TEXT DEFAULT '',
  custom_header_scripts TEXT DEFAULT '',
  custom_footer_scripts TEXT DEFAULT '',
  
  -- ==================== TIMESTAMPS ====================
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert default settings if table is empty
INSERT INTO site_settings (id) 
SELECT 1 
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE id = 1);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_site_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS site_settings_updated ON site_settings;
CREATE TRIGGER site_settings_updated
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_timestamp();

-- Enable Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Anyone can view site settings" ON site_settings;
CREATE POLICY "Anyone can view site settings" ON site_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can update site settings" ON site_settings;
CREATE POLICY "Only admins can update site settings" ON site_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE site_settings;

-- Add comment
COMMENT ON TABLE site_settings IS 'Comprehensive site settings - control every aspect of the website from admin dashboard';
