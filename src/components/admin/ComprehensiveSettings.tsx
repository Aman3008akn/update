import { useState, useEffect } from 'react';
import { useSiteSettings, SiteSettings } from '@/contexts/SiteSettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Palette, 
  Layout, 
  Globe, 
  Bell, 
  ShoppingBag, 
  MessageSquare,
  Image,
  Type,
  Share2,
  Mail,
  Truck,
  Gift,
  Eye,
  Save,
  RefreshCw,
  Menu,
  CreditCard,
  Code,
  Search,
  Megaphone,
  Home,
  X,
  Plus
} from 'lucide-react';

export default function ComprehensiveSettings() {
  const { settings, loading, updateSettings, refetchSettings } = useSiteSettings();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<SiteSettings>>({});
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateSettings(formData);
      toast({
        title: "✅ Settings Saved!",
        description: "Your changes have been applied successfully.",
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    await refetchSettings();
    toast({
      title: "🔄 Refreshed",
      description: "Settings reloaded from database.",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-2xl p-1 shadow-2xl border border-gray-700">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-2">
                🎛️ Complete Website Control
              </h2>
              <p className="text-gray-400">Control every single element of your website from here</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-black mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save All Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
          <TabsList className="flex flex-wrap gap-2 bg-gray-900/50 p-2 rounded-xl mb-6">
            <TabsTrigger value="basic" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
              <Settings className="w-4 h-4 mr-2" /> Basic Info
            </TabsTrigger>
            <TabsTrigger value="hero" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
              <Image className="w-4 h-4 mr-2" /> Hero Section
            </TabsTrigger>
            <TabsTrigger value="announcements" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
              <Megaphone className="w-4 h-4 mr-2" /> Announcements
            </TabsTrigger>
            <TabsTrigger value="colors" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
              <Palette className="w-4 h-4 mr-2" /> Colors
            </TabsTrigger>
            <TabsTrigger value="navbar" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
              <Menu className="w-4 h-4 mr-2" /> Navbar
            </TabsTrigger>
            <TabsTrigger value="footer" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
              <Layout className="w-4 h-4 mr-2" /> Footer
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
              <Mail className="w-4 h-4 mr-2" /> Contact
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
              <Share2 className="w-4 h-4 mr-2" /> Social
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
              <MessageSquare className="w-4 h-4 mr-2" /> WhatsApp
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
              <Bell className="w-4 h-4 mr-2" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
              <ShoppingBag className="w-4 h-4 mr-2" /> Products
            </TabsTrigger>
            <TabsTrigger value="checkout" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
              <CreditCard className="w-4 h-4 mr-2" /> Checkout
            </TabsTrigger>
            <TabsTrigger value="popups" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
              <Eye className="w-4 h-4 mr-2" /> Popups
            </TabsTrigger>
            <TabsTrigger value="seo" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
              <Search className="w-4 h-4 mr-2" /> SEO
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
              <Code className="w-4 h-4 mr-2" /> Advanced
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">🏪 Site Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-300">Site Name</Label>
                <Input
                  value={formData.site_name || ''}
                  onChange={(e) => handleChange('site_name', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  placeholder="MythManga"
                />
              </div>
              <div>
                <Label className="text-gray-300">Site Tagline</Label>
                <Input
                  value={formData.site_tagline || ''}
                  onChange={(e) => handleChange('site_tagline', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  placeholder="Premium Anime Merchandise"
                />
              </div>
              <div>
                <Label className="text-gray-300">Logo URL</Label>
                <Input
                  value={formData.logo_url || ''}
                  onChange={(e) => handleChange('logo_url', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  placeholder="/logo.png"
                />
              </div>
              <div>
                <Label className="text-gray-300">Favicon URL</Label>
                <Input
                  value={formData.favicon_url || ''}
                  onChange={(e) => handleChange('favicon_url', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  placeholder="/favicon.ico"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-gray-300">Meta Description</Label>
                <Textarea
                  value={formData.meta_description || ''}
                  onChange={(e) => handleChange('meta_description', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  placeholder="Description for search engines..."
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-gray-300">Meta Keywords</Label>
                <Input
                  value={formData.meta_keywords || ''}
                  onChange={(e) => handleChange('meta_keywords', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  placeholder="anime, manga, figurines, merchandise"
                />
              </div>
            </div>
          </TabsContent>

          {/* Hero Section Tab */}
          <TabsContent value="hero" className="space-y-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">🖼️ Hero Section Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <Label className="text-gray-300">Enable Hero Section</Label>
                <Switch
                  checked={formData.hero_enabled ?? true}
                  onCheckedChange={(checked) => handleChange('hero_enabled', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <Label className="text-gray-300">Enable Banner Carousel</Label>
                <Switch
                  checked={formData.hero_banner_enabled ?? true}
                  onCheckedChange={(checked) => handleChange('hero_banner_enabled', checked)}
                />
              </div>
              <div>
                <Label className="text-gray-300">Hero Title</Label>
                <Input
                  value={formData.hero_title || ''}
                  onChange={(e) => handleChange('hero_title', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Hero Subtitle</Label>
                <Input
                  value={formData.hero_subtitle || ''}
                  onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Hero Image URL</Label>
                <Input
                  value={formData.hero_image || ''}
                  onChange={(e) => handleChange('hero_image', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">CTA Button Text</Label>
                <Input
                  value={formData.hero_cta_text || ''}
                  onChange={(e) => handleChange('hero_cta_text', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">CTA Button Link</Label>
                <Input
                  value={formData.hero_cta_link || ''}
                  onChange={(e) => handleChange('hero_cta_link', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Banner Rotation Interval (ms)</Label>
                <Input
                  type="number"
                  value={formData.hero_banner_interval || 5000}
                  onChange={(e) => handleChange('hero_banner_interval', parseInt(e.target.value))}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <Label className="text-gray-300">Auto-Rotate Banners</Label>
                <Switch
                  checked={formData.hero_banner_auto_rotate ?? true}
                  onCheckedChange={(checked) => handleChange('hero_banner_auto_rotate', checked)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">📢 Announcement Bar Settings</h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <Label className="text-gray-300">Show Announcement Bar</Label>
                <Switch
                  checked={formData.show_offer_bar ?? true}
                  onCheckedChange={(checked) => handleChange('show_offer_bar', checked)}
                />
              </div>
              <div>
                <Label className="text-gray-300">Announcement 1</Label>
                <Input
                  value={formData.top_announcement_1 || ''}
                  onChange={(e) => handleChange('top_announcement_1', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  placeholder="🔥 FLASH SALE: Up to 50% OFF!"
                />
              </div>
              <div>
                <Label className="text-gray-300">Announcement 2</Label>
                <Input
                  value={formData.top_announcement_2 || ''}
                  onChange={(e) => handleChange('top_announcement_2', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  placeholder="🚚 FREE Shipping on orders above ₹999"
                />
              </div>
              <div>
                <Label className="text-gray-300">Announcement 3</Label>
                <Input
                  value={formData.top_announcement_3 || ''}
                  onChange={(e) => handleChange('top_announcement_3', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  placeholder="💰 Use code ANIME10 for extra 10% OFF"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-300">Background Color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="color"
                      value={formData.announcement_bg_color || '#2C3E50'}
                      onChange={(e) => handleChange('announcement_bg_color', e.target.value)}
                      className="w-16 h-10 p-1 bg-gray-800 border-gray-700"
                    />
                    <Input
                      value={formData.announcement_bg_color || '#2C3E50'}
                      onChange={(e) => handleChange('announcement_bg_color', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Text Color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="color"
                      value={formData.announcement_text_color || '#FFFFFF'}
                      onChange={(e) => handleChange('announcement_text_color', e.target.value)}
                      className="w-16 h-10 p-1 bg-gray-800 border-gray-700"
                    />
                    <Input
                      value={formData.announcement_text_color || '#FFFFFF'}
                      onChange={(e) => handleChange('announcement_text_color', e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">🎨 Color Theme Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { key: 'primary_color', label: 'Primary Color', default: '#2C3E50' },
                { key: 'secondary_color', label: 'Secondary Color', default: '#F5C842' },
                { key: 'accent_color', label: 'Accent Color', default: '#E74C3C' },
                { key: 'background_color', label: 'Background Color', default: '#FFFFFF' },
                { key: 'text_color', label: 'Text Color', default: '#2C3E50' },
                { key: 'navbar_bg_color', label: 'Navbar Background', default: '#FFFFFF' },
                { key: 'footer_bg_color', label: 'Footer Background', default: '#2C3E50' },
              ].map((color) => (
                <div key={color.key} className="p-4 bg-gray-800/50 rounded-lg">
                  <Label className="text-gray-300">{color.label}</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="color"
                      value={(formData as any)[color.key] || color.default}
                      onChange={(e) => handleChange(color.key, e.target.value)}
                      className="w-16 h-10 p-1 bg-gray-800 border-gray-700 cursor-pointer"
                    />
                    <Input
                      value={(formData as any)[color.key] || color.default}
                      onChange={(e) => handleChange(color.key, e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white flex-1"
                    />
                    <div 
                      className="w-10 h-10 rounded-lg border-2 border-gray-600"
                      style={{ backgroundColor: (formData as any)[color.key] || color.default }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Navbar Tab */}
          <TabsContent value="navbar" className="space-y-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">🔝 Navbar Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-300">Logo Text</Label>
                <Input
                  value={formData.navbar_logo_text || ''}
                  onChange={(e) => handleChange('navbar_logo_text', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div></div>
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <Label className="text-gray-300">Show Search Bar</Label>
                <Switch
                  checked={formData.navbar_show_search ?? true}
                  onCheckedChange={(checked) => handleChange('navbar_show_search', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <Label className="text-gray-300">Show Wishlist Icon</Label>
                <Switch
                  checked={formData.navbar_show_wishlist ?? true}
                  onCheckedChange={(checked) => handleChange('navbar_show_wishlist', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <Label className="text-gray-300">Show Cart Icon</Label>
                <Switch
                  checked={formData.navbar_show_cart ?? true}
                  onCheckedChange={(checked) => handleChange('navbar_show_cart', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <Label className="text-gray-300">Show Account Icon</Label>
                <Switch
                  checked={formData.navbar_show_account ?? true}
                  onCheckedChange={(checked) => handleChange('navbar_show_account', checked)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Footer Tab */}
          <TabsContent value="footer" className="space-y-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">📜 Footer Settings</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label className="text-gray-300">About Text</Label>
                <Textarea
                  value={formData.footer_about_text || ''}
                  onChange={(e) => handleChange('footer_about_text', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  rows={3}
                />
              </div>
              <div>
                <Label className="text-gray-300">Copyright Text</Label>
                <Input
                  value={formData.footer_copyright || ''}
                  onChange={(e) => handleChange('footer_copyright', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <Label className="text-gray-300">Show Newsletter Section</Label>
                <Switch
                  checked={formData.footer_show_newsletter ?? true}
                  onCheckedChange={(checked) => handleChange('footer_show_newsletter', checked)}
                />
              </div>
              <div>
                <Label className="text-gray-300">Newsletter Title</Label>
                <Input
                  value={formData.footer_newsletter_title || ''}
                  onChange={(e) => handleChange('footer_newsletter_title', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Newsletter Subtitle</Label>
                <Input
                  value={formData.footer_newsletter_subtitle || ''}
                  onChange={(e) => handleChange('footer_newsletter_subtitle', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">📞 Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-300">Email Address</Label>
                <Input
                  value={formData.contact_email || ''}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Phone Number</Label>
                <Input
                  value={formData.contact_phone || ''}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-gray-300">Address</Label>
                <Textarea
                  value={formData.contact_address || ''}
                  onChange={(e) => handleChange('contact_address', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  rows={2}
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-gray-300">Working Hours</Label>
                <Input
                  value={formData.contact_working_hours || ''}
                  onChange={(e) => handleChange('contact_working_hours', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social" className="space-y-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">🌐 Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg md:col-span-2">
                <Label className="text-gray-300">Show Social Links</Label>
                <Switch
                  checked={formData.social_show_links ?? true}
                  onCheckedChange={(checked) => handleChange('social_show_links', checked)}
                />
              </div>
              <div>
                <Label className="text-gray-300">Facebook URL</Label>
                <Input
                  value={formData.social_facebook || ''}
                  onChange={(e) => handleChange('social_facebook', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Instagram URL</Label>
                <Input
                  value={formData.social_instagram || ''}
                  onChange={(e) => handleChange('social_instagram', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Twitter URL</Label>
                <Input
                  value={formData.social_twitter || ''}
                  onChange={(e) => handleChange('social_twitter', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">YouTube URL</Label>
                <Input
                  value={formData.social_youtube || ''}
                  onChange={(e) => handleChange('social_youtube', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Discord URL</Label>
                <Input
                  value={formData.social_discord || ''}
                  onChange={(e) => handleChange('social_discord', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
          </TabsContent>

          {/* WhatsApp Tab */}
          <TabsContent value="whatsapp" className="space-y-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">💬 WhatsApp Support Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg md:col-span-2">
                <Label className="text-gray-300">Enable WhatsApp Support</Label>
                <Switch
                  checked={formData.whatsapp_enabled ?? true}
                  onCheckedChange={(checked) => handleChange('whatsapp_enabled', checked)}
                />
              </div>
              <div>
                <Label className="text-gray-300">WhatsApp Number (with country code)</Label>
                <Input
                  value={formData.whatsapp_number || ''}
                  onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  placeholder="919876543210"
                />
              </div>
              <div>
                <Label className="text-gray-300">Button Position</Label>
                <select
                  value={formData.whatsapp_position || 'bottom-right'}
                  onChange={(e) => handleChange('whatsapp_position', e.target.value)}
                  className="mt-1 w-full bg-gray-800 border-gray-700 text-white rounded-md p-2"
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <Label className="text-gray-300">Default Message</Label>
                <Textarea
                  value={formData.whatsapp_message || ''}
                  onChange={(e) => handleChange('whatsapp_message', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  rows={2}
                />
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">🔔 Live Notifications Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg md:col-span-2">
                <Label className="text-gray-300">Enable Live Sales Notifications</Label>
                <Switch
                  checked={formData.live_notifications_enabled ?? true}
                  onCheckedChange={(checked) => handleChange('live_notifications_enabled', checked)}
                />
              </div>
              <div>
                <Label className="text-gray-300">Notification Interval (ms)</Label>
                <Input
                  type="number"
                  value={formData.live_notifications_interval || 20000}
                  onChange={(e) => handleChange('live_notifications_interval', parseInt(e.target.value))}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">🛍️ Product Display Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-300">Products Per Page</Label>
                <Input
                  type="number"
                  value={formData.products_per_page || 12}
                  onChange={(e) => handleChange('products_per_page', parseInt(e.target.value))}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div></div>
              {[
                { key: 'show_out_of_stock', label: 'Show Out of Stock Products' },
                { key: 'show_product_ratings', label: 'Show Product Ratings' },
                { key: 'show_product_reviews', label: 'Show Product Reviews' },
                { key: 'enable_wishlist', label: 'Enable Wishlist' },
                { key: 'enable_compare', label: 'Enable Product Compare' },
                { key: 'featured_section_enabled', label: 'Show Featured Section' },
                { key: 'new_arrivals_enabled', label: 'Show New Arrivals Section' },
                { key: 'categories_section_enabled', label: 'Show Categories Section' },
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <Label className="text-gray-300">{setting.label}</Label>
                  <Switch
                    checked={(formData as any)[setting.key] ?? true}
                    onCheckedChange={(checked) => handleChange(setting.key, checked)}
                  />
                </div>
              ))}
              <div>
                <Label className="text-gray-300">Featured Section Title</Label>
                <Input
                  value={formData.featured_section_title || ''}
                  onChange={(e) => handleChange('featured_section_title', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Featured Section Subtitle</Label>
                <Input
                  value={formData.featured_section_subtitle || ''}
                  onChange={(e) => handleChange('featured_section_subtitle', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">New Arrivals Title</Label>
                <Input
                  value={formData.new_arrivals_title || ''}
                  onChange={(e) => handleChange('new_arrivals_title', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Categories Section Title</Label>
                <Input
                  value={formData.categories_section_title || ''}
                  onChange={(e) => handleChange('categories_section_title', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
          </TabsContent>

          {/* Checkout Tab */}
          <TabsContent value="checkout" className="space-y-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">💳 Checkout & Payment Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: 'cod_enabled', label: 'Enable Cash on Delivery' },
                { key: 'razorpay_enabled', label: 'Enable Razorpay Payment' },
                { key: 'emi_enabled', label: 'Enable EMI Options' },
                { key: 'coupons_enabled', label: 'Enable Coupons' },
                { key: 'show_coupon_on_homepage', label: 'Show Coupon on Homepage' },
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <Label className="text-gray-300">{setting.label}</Label>
                  <Switch
                    checked={(formData as any)[setting.key] ?? true}
                    onCheckedChange={(checked) => handleChange(setting.key, checked)}
                  />
                </div>
              ))}
              <div></div>
              <div>
                <Label className="text-gray-300">COD Extra Charge (₹)</Label>
                <Input
                  type="number"
                  value={formData.cod_extra_charge || 0}
                  onChange={(e) => handleChange('cod_extra_charge', parseFloat(e.target.value))}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Minimum Order Amount (₹)</Label>
                <Input
                  type="number"
                  value={formData.min_order_amount || 0}
                  onChange={(e) => handleChange('min_order_amount', parseFloat(e.target.value))}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Free Shipping Threshold (₹)</Label>
                <Input
                  type="number"
                  value={formData.free_shipping_threshold || 999}
                  onChange={(e) => handleChange('free_shipping_threshold', parseFloat(e.target.value))}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Shipping Charge (₹)</Label>
                <Input
                  type="number"
                  value={formData.shipping_charge || 49}
                  onChange={(e) => handleChange('shipping_charge', parseFloat(e.target.value))}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">EMI Minimum Amount (₹)</Label>
                <Input
                  type="number"
                  value={formData.emi_min_amount || 3000}
                  onChange={(e) => handleChange('emi_min_amount', parseFloat(e.target.value))}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">EMI Interest Rate (%)</Label>
                <Input
                  type="number"
                  value={formData.emi_interest_rate || 14}
                  onChange={(e) => handleChange('emi_interest_rate', parseFloat(e.target.value))}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Homepage Coupon Code</Label>
                <Input
                  value={formData.homepage_coupon_code || ''}
                  onChange={(e) => handleChange('homepage_coupon_code', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Homepage Coupon Discount (%)</Label>
                <Input
                  type="number"
                  value={formData.homepage_coupon_discount || 10}
                  onChange={(e) => handleChange('homepage_coupon_discount', parseInt(e.target.value))}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
          </TabsContent>

          {/* Popups Tab */}
          <TabsContent value="popups" className="space-y-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">🪟 Popup Settings</h3>
            <div className="space-y-8">
              <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4">Welcome Popup</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg md:col-span-2">
                    <Label className="text-gray-300">Enable Welcome Popup</Label>
                    <Switch
                      checked={formData.welcome_popup_enabled ?? false}
                      onCheckedChange={(checked) => handleChange('welcome_popup_enabled', checked)}
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Title</Label>
                    <Input
                      value={formData.welcome_popup_title || ''}
                      onChange={(e) => handleChange('welcome_popup_title', e.target.value)}
                      className="mt-1 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Delay (ms)</Label>
                    <Input
                      type="number"
                      value={formData.welcome_popup_delay || 3000}
                      onChange={(e) => handleChange('welcome_popup_delay', parseInt(e.target.value))}
                      className="mt-1 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-gray-300">Message</Label>
                    <Textarea
                      value={formData.welcome_popup_message || ''}
                      onChange={(e) => handleChange('welcome_popup_message', e.target.value)}
                      className="mt-1 bg-gray-800 border-gray-700 text-white"
                      rows={2}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-gray-300">Image URL</Label>
                    <Input
                      value={formData.welcome_popup_image || ''}
                      onChange={(e) => handleChange('welcome_popup_image', e.target.value)}
                      className="mt-1 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4">Exit Intent Popup</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg md:col-span-2">
                    <Label className="text-gray-300">Enable Exit Popup</Label>
                    <Switch
                      checked={formData.exit_popup_enabled ?? false}
                      onCheckedChange={(checked) => handleChange('exit_popup_enabled', checked)}
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Title</Label>
                    <Input
                      value={formData.exit_popup_title || ''}
                      onChange={(e) => handleChange('exit_popup_title', e.target.value)}
                      className="mt-1 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Message</Label>
                    <Input
                      value={formData.exit_popup_message || ''}
                      onChange={(e) => handleChange('exit_popup_message', e.target.value)}
                      className="mt-1 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4">⚠️ Maintenance Mode</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 bg-red-900/30 rounded-lg border border-red-800/50 md:col-span-2">
                    <Label className="text-red-300">Enable Maintenance Mode</Label>
                    <Switch
                      checked={formData.maintenance_mode ?? false}
                      onCheckedChange={(checked) => handleChange('maintenance_mode', checked)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-gray-300">Maintenance Message</Label>
                    <Textarea
                      value={formData.maintenance_message || ''}
                      onChange={(e) => handleChange('maintenance_message', e.target.value)}
                      className="mt-1 bg-gray-800 border-gray-700 text-white"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">🔍 SEO & Analytics Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-300">Google Analytics ID</Label>
                <Input
                  value={formData.google_analytics_id || ''}
                  onChange={(e) => handleChange('google_analytics_id', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
                />
              </div>
              <div>
                <Label className="text-gray-300">Facebook Pixel ID</Label>
                <Input
                  value={formData.facebook_pixel_id || ''}
                  onChange={(e) => handleChange('facebook_pixel_id', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  placeholder="XXXXXXXXXXXXXXX"
                />
              </div>
              <div>
                <Label className="text-gray-300">Google Tag Manager ID</Label>
                <Input
                  value={formData.google_tag_manager_id || ''}
                  onChange={(e) => handleChange('google_tag_manager_id', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  placeholder="GTM-XXXXXXX"
                />
              </div>
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">⚙️ Advanced Settings</h3>
            <div className="space-y-6">
              <div>
                <Label className="text-gray-300">Custom CSS</Label>
                <Textarea
                  value={formData.custom_css || ''}
                  onChange={(e) => handleChange('custom_css', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white font-mono text-sm"
                  rows={6}
                  placeholder="/* Add your custom CSS here */"
                />
              </div>
              <div>
                <Label className="text-gray-300">Custom Header Scripts</Label>
                <Textarea
                  value={formData.custom_header_scripts || ''}
                  onChange={(e) => handleChange('custom_header_scripts', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white font-mono text-sm"
                  rows={4}
                  placeholder="<!-- Scripts to add in <head> -->"
                />
              </div>
              <div>
                <Label className="text-gray-300">Custom Footer Scripts</Label>
                <Textarea
                  value={formData.custom_footer_scripts || ''}
                  onChange={(e) => handleChange('custom_footer_scripts', e.target.value)}
                  className="mt-1 bg-gray-800 border-gray-700 text-white font-mono text-sm"
                  rows={4}
                  placeholder="<!-- Scripts to add before </body> -->"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
