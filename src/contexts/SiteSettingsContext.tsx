import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface SiteSettings {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  top_announcement_1: string;
  top_announcement_2: string;
  top_announcement_3: string;
  primary_color: string;
  secondary_color: string;
  show_offer_bar: boolean;
}

interface SiteSettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
  error: string | null;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (err) {
      console.error('Error fetching site settings:', err);
      setError('Failed to load site settings');
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
        setSettings(data);
      }
    } catch (err) {
      console.error('Error updating site settings:', err);
      throw err;
    }
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
          setSettings(payload.new as SiteSettings);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, error, updateSettings }}>
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