import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

// Comprehensive Site Settings Interface
export interface SiteSettings {
  id: number;
  
  // Site Basic Info
  site_name: string;
  site_tagline: string;
  logo_url: string;
  favicon_url: string;
  meta_description: string;
  meta_keywords: string;
  
  // Hero Section
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  hero_cta_text: string;
  hero_cta_link: string;
  hero_enabled: boolean;
  hero_banner_enabled: boolean;
  hero_banner_auto_rotate: boolean;
  hero_banner_interval: number;
  hero_banners: any[];
  
  // Announcements
  top_announcement_1: string;
  top_announcement_2: string;
  top_announcement_3: string;
  show_offer_bar: boolean;
  announcement_bg_color: string;
  announcement_text_color: string;
  
  // Colors/Theme
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  navbar_bg_color: string;
  footer_bg_color: string;
  
  // Navbar Settings
  navbar_logo_text: string;
  navbar_show_search: boolean;
  navbar_show_wishlist: boolean;
  navbar_show_cart: boolean;
  navbar_show_account: boolean;
  navbar_menu_items: { label: string; link: string; enabled: boolean }[];
  
  // Footer Settings
  footer_about_text: string;
  footer_copyright: string;
  footer_show_newsletter: boolean;
  footer_newsletter_title: string;
  footer_newsletter_subtitle: string;
  footer_links: { title: string; links: { label: string; url: string }[] }[];
  
  // Contact Info
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  contact_working_hours: string;
  
  // Social Media
  social_facebook: string;
  social_instagram: string;
  social_twitter: string;
  social_youtube: string;
  social_discord: string;
  social_show_links: boolean;
  
  // WhatsApp Support
  whatsapp_enabled: boolean;
  whatsapp_number: string;
  whatsapp_message: string;
  whatsapp_position: string;
  
  // Live Notifications
  live_notifications_enabled: boolean;
  live_notifications_interval: number;
  live_notifications_cities: string[];
  
  // Product Display
  products_per_page: number;
  show_out_of_stock: boolean;
  show_product_ratings: boolean;
  show_product_reviews: boolean;
  enable_wishlist: boolean;
  enable_compare: boolean;
  
  // Featured Section
  featured_section_title: string;
  featured_section_subtitle: string;
  featured_section_enabled: boolean;
  
  // New Arrivals
  new_arrivals_title: string;
  new_arrivals_subtitle: string;
  new_arrivals_enabled: boolean;
  
  // Categories Section
  categories_section_title: string;
  categories_section_enabled: boolean;
  
  // Checkout/Payment
  cod_enabled: boolean;
  cod_extra_charge: number;
  razorpay_enabled: boolean;
  min_order_amount: number;
  free_shipping_threshold: number;
  shipping_charge: number;
  
  // EMI Settings
  emi_enabled: boolean;
  emi_min_amount: number;
  emi_interest_rate: number;
  
  // Discount/Coupons
  coupons_enabled: boolean;
  show_coupon_on_homepage: boolean;
  homepage_coupon_code: string;
  homepage_coupon_discount: number;
  
  // Popup Settings
  welcome_popup_enabled: boolean;
  welcome_popup_title: string;
  welcome_popup_message: string;
  welcome_popup_image: string;
  welcome_popup_delay: number;
  exit_popup_enabled: boolean;
  exit_popup_title: string;
  exit_popup_message: string;
  
  // Maintenance Mode
  maintenance_mode: boolean;
  maintenance_message: string;
  maintenance_end_time: string;
  
  // SEO Settings
  google_analytics_id: string;
  facebook_pixel_id: string;
  google_tag_manager_id: string;
  
  // Custom CSS/JS
  custom_css: string;
  custom_header_scripts: string;
  custom_footer_scripts: string;
}

// Default Settings
const defaultSettings: SiteSettings = {
  id: 1,
  
  // Site Basic Info
  site_name: 'MythManga',
  site_tagline: 'Premium Anime Merchandise',
  logo_url: '/logo.png',
  favicon_url: '/favicon.ico',
  meta_description: 'Shop premium anime merchandise, figurines, clothing and more.',
  meta_keywords: 'anime, manga, figurines, clothing, merchandise',
  
  // Hero Section
  hero_title: 'UNLEASH YOUR OTAKU SOUL',
  hero_subtitle: 'The ultimate collection of premium anime merchandise.',
  hero_image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80',
  hero_cta_text: 'Shop Now',
  hero_cta_link: '/catalog/figurines',
  hero_enabled: true,
  hero_banner_enabled: true,
  hero_banner_auto_rotate: true,
  hero_banner_interval: 5000,
  hero_banners: [],
  
  // Announcements
  top_announcement_1: '🔥 FLASH SALE: Up to 50% OFF on all items!',
  top_announcement_2: '🚚 FREE Shipping on orders above ₹999',
  top_announcement_3: '💰 Use code ANIME10 for extra 10% OFF',
  show_offer_bar: true,
  announcement_bg_color: '#2C3E50',
  announcement_text_color: '#FFFFFF',
  
  // Colors/Theme
  primary_color: '#2C3E50',
  secondary_color: '#F5C842',
  accent_color: '#E74C3C',
  background_color: '#FFFFFF',
  text_color: '#2C3E50',
  navbar_bg_color: '#FFFFFF',
  footer_bg_color: '#2C3E50',
  
  // Navbar Settings
  navbar_logo_text: 'MythManga',
  navbar_show_search: true,
  navbar_show_wishlist: true,
  navbar_show_cart: true,
  navbar_show_account: true,
  navbar_menu_items: [
    { label: 'Figurines', link: '/catalog/figurines', enabled: true },
    { label: 'Clothing', link: '/catalog/clothing', enabled: true },
    { label: 'Accessories', link: '/catalog/accessories', enabled: true },
    { label: 'Home & Living', link: '/catalog/home-living', enabled: true }
  ],
  
  // Footer Settings
  footer_about_text: 'MythManga brings you the finest anime merchandise. Quality products, fast shipping, and amazing customer service.',
  footer_copyright: '© 2026 MythManga. All rights reserved.',
  footer_show_newsletter: true,
  footer_newsletter_title: 'Subscribe to our Newsletter',
  footer_newsletter_subtitle: 'Get the latest updates on new products and sales!',
  footer_links: [
    { title: 'Shop', links: [
      { label: 'Figurines', url: '/catalog/figurines' },
      { label: 'Clothing', url: '/catalog/clothing' },
      { label: 'Accessories', url: '/catalog/accessories' }
    ]},
    { title: 'Support', links: [
      { label: 'FAQs', url: '/faq' },
      { label: 'Shipping', url: '/shipping' },
      { label: 'Returns', url: '/returns' }
    ]},
    { title: 'Company', links: [
      { label: 'About Us', url: '/about' },
      { label: 'Contact', url: '/contact' },
      { label: 'Careers', url: '/careers' }
    ]}
  ],
  
  // Contact Info
  contact_email: 'support@mythmanga.com',
  contact_phone: '+91 9876543210',
  contact_address: '123 Anime Street, Tokyo Tower, Mumbai, India - 400001',
  contact_working_hours: 'Mon-Sat: 10AM - 8PM',
  
  // Social Media
  social_facebook: 'https://facebook.com/mythmanga',
  social_instagram: 'https://instagram.com/mythmanga',
  social_twitter: 'https://twitter.com/mythmanga',
  social_youtube: 'https://youtube.com/mythmanga',
  social_discord: 'https://discord.gg/mythmanga',
  social_show_links: true,
  
  // WhatsApp Support
  whatsapp_enabled: true,
  whatsapp_number: '919876543210',
  whatsapp_message: 'Hi! I need help with my order.',
  whatsapp_position: 'bottom-right',
  
  // Live Notifications
  live_notifications_enabled: true,
  live_notifications_interval: 20000,
  live_notifications_cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'],
  
  // Product Display
  products_per_page: 12,
  show_out_of_stock: true,
  show_product_ratings: true,
  show_product_reviews: true,
  enable_wishlist: true,
  enable_compare: false,
  
  // Featured Section
  featured_section_title: 'Featured Products',
  featured_section_subtitle: 'Hand-picked premium items for true fans',
  featured_section_enabled: true,
  
  // New Arrivals
  new_arrivals_title: 'New Arrivals',
  new_arrivals_subtitle: 'Fresh drops you will love',
  new_arrivals_enabled: true,
  
  // Categories Section
  categories_section_title: 'Shop by Category',
  categories_section_enabled: true,
  
  // Checkout/Payment
  cod_enabled: true,
  cod_extra_charge: 0,
  razorpay_enabled: true,
  min_order_amount: 0,
  free_shipping_threshold: 999,
  shipping_charge: 49,
  
  // EMI Settings
  emi_enabled: true,
  emi_min_amount: 3000,
  emi_interest_rate: 14,
  
  // Discount/Coupons
  coupons_enabled: true,
  show_coupon_on_homepage: true,
  homepage_coupon_code: 'ANIME10',
  homepage_coupon_discount: 10,
  
  // Popup Settings
  welcome_popup_enabled: false,
  welcome_popup_title: 'Welcome to MythManga!',
  welcome_popup_message: 'Get 10% off your first order!',
  welcome_popup_image: '',
  welcome_popup_delay: 3000,
  exit_popup_enabled: false,
  exit_popup_title: "Wait! Don't Leave Yet!",
  exit_popup_message: 'Get an exclusive discount before you go!',
  
  // Maintenance Mode
  maintenance_mode: false,
  maintenance_message: 'We are currently undergoing maintenance. Please check back soon!',
  maintenance_end_time: '',
  
  // SEO Settings
  google_analytics_id: '',
  facebook_pixel_id: '',
  google_tag_manager_id: '',
  
  // Custom CSS/JS
  custom_css: '',
  custom_header_scripts: '',
  custom_footer_scripts: ''
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  error: string | null;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  refetchSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) {
        console.log('Using default settings - DB table may not exist:', error.message);
        setSettings(defaultSettings);
      } else if (data) {
        // Merge with defaults to ensure all fields exist
        setSettings({ ...defaultSettings, ...data });
      }
    } catch (err) {
      console.error('Error fetching site settings:', err);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .update(newSettings)
        .eq('id', 1)
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error('Error updating site settings:', err);
      throw err;
    }
  };

  const refetchSettings = async () => {
    await fetchSettings();
  };

  useEffect(() => {
    fetchSettings();

    // Set up real-time subscription
    const subscription = supabase
      .channel('site-settings-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'site_settings',
        },
        (payload) => {
          console.log('Settings updated in real-time:', payload);
          setSettings(prev => ({ ...prev, ...payload.new as SiteSettings }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, error, updateSettings, refetchSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
}
