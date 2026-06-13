import { useState, useEffect } from 'react';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

export default function SiteSettingsForm() {
  const { settings, loading, updateSettings } = useSiteSettings();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    hero_title: '',
    hero_subtitle: '',
    top_announcement_1: '',
    top_announcement_2: '',
    top_announcement_3: '',
    primary_color: '',
    secondary_color: '',
    show_offer_bar: true
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        hero_title: settings.hero_title || '',
        hero_subtitle: settings.hero_subtitle || '',
        top_announcement_1: settings.top_announcement_1 || '',
        top_announcement_2: settings.top_announcement_2 || '',
        top_announcement_3: settings.top_announcement_3 || '',
        primary_color: settings.primary_color || '#2C3E50',
        secondary_color: settings.secondary_color || '#F5C842',
        show_offer_bar: settings.show_offer_bar ?? true
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleColorChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateSettings(formData);
      toast({
        title: "Success",
        description: "Site settings updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update site settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="text-[#2C3E50]">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-2xl p-1 shadow-2xl border border-gray-700">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-2">
            Site Settings
          </h2>
          <p className="text-gray-400">Manage your website configuration and appearance</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="hero_title" className="text-gray-300">Hero Title</Label>
              <Input
                id="hero_title"
                name="hero_title"
                value={formData.hero_title}
                onChange={handleChange}
                className="mt-1 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="hero_subtitle" className="text-gray-300">Hero Subtitle</Label>
              <Input
                id="hero_subtitle"
                name="hero_subtitle"
                value={formData.hero_subtitle}
                onChange={handleChange}
                className="mt-1 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="top_announcement_1" className="text-gray-300">Announcement 1</Label>
              <Input
                id="top_announcement_1"
                name="top_announcement_1"
                value={formData.top_announcement_1}
                onChange={handleChange}
                className="mt-1 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="top_announcement_2" className="text-gray-300">Announcement 2</Label>
              <Input
                id="top_announcement_2"
                name="top_announcement_2"
                value={formData.top_announcement_2}
                onChange={handleChange}
                className="mt-1 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="top_announcement_3" className="text-gray-300">Announcement 3</Label>
              <Input
                id="top_announcement_3"
                name="top_announcement_3"
                value={formData.top_announcement_3}
                onChange={handleChange}
                className="mt-1 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="primary_color" className="text-gray-300">Primary Color</Label>
              <div className="flex items-center mt-1">
                <Input
                  id="primary_color"
                  name="primary_color"
                  value={formData.primary_color}
                  onChange={(e) => handleColorChange('primary_color', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white mr-2"
                />
                <div 
                  className="w-10 h-10 rounded-lg border border-gray-600" 
                  style={{ backgroundColor: formData.primary_color }}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="secondary_color" className="text-gray-300">Secondary Color</Label>
              <div className="flex items-center mt-1">
                <Input
                  id="secondary_color"
                  name="secondary_color"
                  value={formData.secondary_color}
                  onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white mr-2"
                />
                <div 
                  className="w-10 h-10 rounded-lg border border-gray-600" 
                  style={{ backgroundColor: formData.secondary_color }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show_offer_bar"
                  name="show_offer_bar"
                  checked={formData.show_offer_bar}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_offer_bar: checked }))}
                />
                <Label htmlFor="show_offer_bar" className="text-gray-300">Show Offer Bar</Label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap shadow-lg hover:shadow-yellow-500/30"
            >
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}