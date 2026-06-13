import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useEffect } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSiteSettings();

  useEffect(() => {
    if (settings?.primary_color) {
      document.documentElement.style.setProperty('--primary-color', settings.primary_color);
    }
    
    if (settings?.secondary_color) {
      document.documentElement.style.setProperty('--secondary-color', settings.secondary_color);
    }
  }, [settings]);

  return <>{children}</>;
}