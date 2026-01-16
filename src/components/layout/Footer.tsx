import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export default function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-[var(--primary-color,#2C3E50)] text-white mt-auto" style={{ backgroundColor: settings.footer_bg_color }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[var(--secondary-color,#F5C842)] rounded-lg flex items-center justify-center" style={{ backgroundColor: settings.secondary_color }}>
                <span className="text-[var(--primary-color,#2C3E50)] font-bold text-xl" style={{ color: settings.primary_color }}>
                  {settings.site_name?.charAt(0) || 'M'}
                </span>
              </div>
              <span className="text-xl font-bold">{settings.site_name || 'MythManga'}</span>
            </div>
            <p className="text-gray-300 text-sm">
              {settings.footer_about_text || 'Your ultimate destination for anime and manga merchandise. Quality products for passionate fans.'}
            </p>
            
            {/* Contact Info */}
            <div className="mt-4 space-y-2 text-sm text-gray-300">
              {settings.contact_email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${settings.contact_email}`} className="hover:text-[var(--secondary-color,#F5C842)] transition-colors">
                    {settings.contact_email}
                  </a>
                </div>
              )}
              {settings.contact_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${settings.contact_phone}`} className="hover:text-[var(--secondary-color,#F5C842)] transition-colors">
                    {settings.contact_phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/catalog/figurines" className="hover:text-[var(--secondary-color,#F5C842)] transition-colors">Figurines</Link></li>
              <li><Link to="/catalog/manga" className="hover:text-[var(--secondary-color,#F5C842)] transition-colors">Manga</Link></li>
              <li><Link to="/catalog/posters" className="hover:text-[var(--secondary-color,#F5C842)] transition-colors">Posters</Link></li>
              <li><Link to="/catalog/apparel" className="hover:text-[var(--secondary-color,#F5C842)] transition-colors">Apparel</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/contact" className="hover:text-[var(--secondary-color,#F5C842)] transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-[var(--secondary-color,#F5C842)] transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-[var(--secondary-color,#F5C842)] transition-colors">Returns</Link></li>
              <li><Link to="/faq" className="hover:text-[var(--secondary-color,#F5C842)] transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            {settings.social_show_links !== false && (
              <div className="flex space-x-4">
                {settings.social_facebook && (
                  <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[var(--secondary-color,#F5C842)] transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {settings.social_twitter && (
                  <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[var(--secondary-color,#F5C842)] transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {settings.social_instagram && (
                  <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[var(--secondary-color,#F5C842)] transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {settings.social_youtube && (
                  <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[var(--secondary-color,#F5C842)] transition-colors">
                    <Youtube className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}
            
            {/* Newsletter */}
            {settings.footer_show_newsletter !== false && (
              <div className="mt-6">
                <h4 className="font-semibold text-sm mb-2">{settings.footer_newsletter_title || 'Subscribe to Newsletter'}</h4>
                <p className="text-xs text-gray-400 mb-2">{settings.footer_newsletter_subtitle || 'Get the latest updates!'}</p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-[var(--secondary-color,#F5C842)]"
                  />
                  <button className="px-4 py-2 text-sm font-bold bg-[var(--secondary-color,#F5C842)] text-[var(--primary-color,#2C3E50)] rounded hover:opacity-90 transition-opacity" style={{ backgroundColor: settings.secondary_color, color: settings.primary_color }}>
                    Subscribe
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>{settings.footer_copyright || `© ${new Date().getFullYear()} ${settings.site_name || 'MythManga'}. All rights reserved.`}</p>
        </div>
      </div>
    </footer>
  );
}
