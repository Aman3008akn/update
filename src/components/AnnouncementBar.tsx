import { useState, useEffect } from 'react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const { settings } = useSiteSettings();

  // If offer bar is disabled in settings, don't render
  if (settings.show_offer_bar === false) {
    return null;
  }

  // Get announcements from settings
  const announcements = [
    settings.top_announcement_1 || "🌟 Web Designed By Aman Shukla 🌟",
    settings.top_announcement_2 || "🔥 Flat 50% OFF On New Collection 🔥",
    settings.top_announcement_3 || "🚚 Free Shipping On Orders Above ₹999 🚚"
  ].filter(a => a && a.trim() !== ''); // Filter out empty announcements

  // Get colors from settings
  const bgColor = settings.announcement_bg_color || '#2C3E50';
  const textColor = settings.announcement_text_color || '#FFFFFF';

  useEffect(() => {
    if (announcements.length <= 1) return; // Don't rotate if only one announcement
    
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
        setIsFading(false);
      }, 500); // Half a second for fade out
    }, 3000); // 3 seconds per announcement

    return () => clearInterval(interval);
  }, [announcements.length]);

  if (announcements.length === 0) return null;

  return (
    <div 
      className="py-3 px-4 w-full"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center">
          <div className="relative h-6 w-full max-w-2xl overflow-hidden">
            <div 
              className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${
                isFading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}
            >
              <p 
                className="font-bold text-sm md:text-base text-center whitespace-nowrap"
                style={{ color: textColor }}
              >
                {announcements[currentIndex]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
