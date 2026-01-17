import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Heart, Star, TrendingUp, Gift, Crown, Flame, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTimeOfDay } from '@/utils/timeBasedProducts';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

interface HeroBanner {
  id: number;
  title: string;
  subtitle: string;
  bgGradient: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  icon: any;
  iconColor: string;
  decorativeEmoji: string;
  textColor: string;
  accentColor: string;
  timeOfDay?: 'morning' | 'afternoon' | 'night' | 'all';
}

const heroBanners: HeroBanner[] = [
  // Morning Banners (6 AM - 12 PM)
  {
    id: 1,
    title: 'RISE & SHINE SALE',
    subtitle: 'Start your day with fresh deals! Up to 70% OFF on morning exclusives',
    bgGradient: 'from-amber-100 via-orange-100 to-yellow-100',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80',
    ctaText: 'Shop Morning Deals',
    ctaLink: '/catalog/figurines',
    icon: Sparkles,
    iconColor: 'text-orange-600',
    decorativeEmoji: '🌅',
    textColor: 'text-orange-900',
    accentColor: 'bg-orange-500',
    timeOfDay: 'morning',
  },
  {
    id: 2,
    title: 'BREAKFAST BONANZA',
    subtitle: 'Limited edition anime merch dropping NOW! Grab before they vanish',
    bgGradient: 'from-yellow-100 via-amber-100 to-orange-100',
    image: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=800&q=80',
    ctaText: 'Explore New Drops',
    ctaLink: '/catalog/manga',
    icon: Zap,
    iconColor: 'text-yellow-600',
    decorativeEmoji: '⚡',
    textColor: 'text-yellow-900',
    accentColor: 'bg-yellow-500',
    timeOfDay: 'morning',
  },
  {
    id: 3,
    title: 'EARLY BIRD SPECIAL',
    subtitle: 'Premium figurines at unbeatable prices. First 100 orders get FREE shipping!',
    bgGradient: 'from-pink-100 via-rose-100 to-red-100',
    image: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=800&q=80',
    ctaText: 'Claim Your Deal',
    ctaLink: '/catalog/figurines',
    icon: Crown,
    iconColor: 'text-pink-600',
    decorativeEmoji: '👑',
    textColor: 'text-pink-900',
    accentColor: 'bg-pink-500',
    timeOfDay: 'morning',
  },

  // Afternoon Banners (12 PM - 6 PM)
  {
    id: 4,
    title: 'AFTERNOON FLASH SALE',
    subtitle: 'Hottest deals of the day! Trending anime merchandise at crazy discounts',
    bgGradient: 'from-blue-100 via-cyan-100 to-sky-100',
    image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&q=80',
    ctaText: 'Shop Trending Now',
    ctaLink: '/catalog/posters',
    icon: TrendingUp,
    iconColor: 'text-blue-600',
    decorativeEmoji: '📈',
    textColor: 'text-blue-900',
    accentColor: 'bg-blue-500',
    timeOfDay: 'afternoon',
  },
  {
    id: 5,
    title: 'MIDDAY MADNESS',
    subtitle: 'Your favorite anime characters are here! Limited stock - Act Fast',
    bgGradient: 'from-cyan-100 via-teal-100 to-emerald-100',
    image: 'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=800&q=80',
    ctaText: 'Browse Collection',
    ctaLink: '/catalog/accessories',
    icon: Heart,
    iconColor: 'text-cyan-600',
    decorativeEmoji: '💙',
    textColor: 'text-cyan-900',
    accentColor: 'bg-cyan-500',
    timeOfDay: 'afternoon',
  },
  {
    id: 6,
    title: 'POWER HOUR DEALS',
    subtitle: 'Maximum savings unlocked! Buy 2 Get 1 FREE on all apparel',
    bgGradient: 'from-green-100 via-emerald-100 to-teal-100',
    image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&q=80',
    ctaText: 'Get Your Gear',
    ctaLink: '/catalog/apparel',
    icon: Gift,
    iconColor: 'text-green-600',
    decorativeEmoji: '🎁',
    textColor: 'text-green-900',
    accentColor: 'bg-green-500',
    timeOfDay: 'afternoon',
  },

  // Night Banners (6 PM - 6 AM)
  {
    id: 7,
    title: 'MIDNIGHT EXCLUSIVE',
    subtitle: 'Premium night collection revealed! Ultra-rare collectibles available NOW',
    bgGradient: 'from-purple-100 via-violet-100 to-indigo-100',
    image: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=800&q=80',
    ctaText: 'Unlock Premium',
    ctaLink: '/catalog/mystery-boxes',
    icon: Star,
    iconColor: 'text-purple-600',
    decorativeEmoji: '⭐',
    textColor: 'text-purple-900',
    accentColor: 'bg-purple-600',
    timeOfDay: 'night',
  },
  {
    id: 8,
    title: 'NIGHT OWL SPECIALS',
    subtitle: 'While the world sleeps, you save BIG! Exclusive nighttime offers',
    bgGradient: 'from-indigo-100 via-purple-100 to-pink-100',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80',
    ctaText: 'Shop Night Deals',
    ctaLink: '/catalog/tech-gadgets',
    icon: Flame,
    iconColor: 'text-indigo-600',
    decorativeEmoji: '🔥',
    textColor: 'text-indigo-900',
    accentColor: 'bg-indigo-600',
    timeOfDay: 'night',
  },
  {
    id: 9,
    title: 'MOONLIGHT MYSTERY',
    subtitle: 'Surprise drops happening RIGHT NOW! Mystery boxes with epic rewards',
    bgGradient: 'from-slate-100 via-gray-100 to-zinc-100',
    image: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=800&q=80',
    ctaText: 'Open Mystery Box',
    ctaLink: '/catalog/mystery-boxes',
    icon: ShoppingBag,
    iconColor: 'text-slate-600',
    decorativeEmoji: '🎭',
    textColor: 'text-slate-900',
    accentColor: 'bg-slate-600',
    timeOfDay: 'night',
  },
  {
    id: 10,
    title: 'STARLIGHT SALE',
    subtitle: 'Dream collection unveiled! Limited edition items under the stars',
    bgGradient: 'from-violet-100 via-fuchsia-100 to-purple-100',
    image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&q=80',
    ctaText: 'Explore Dreams',
    ctaLink: '/catalog/figurines',
    icon: Star,
    iconColor: 'text-violet-600',
    decorativeEmoji: '✨',
    textColor: 'text-violet-900',
    accentColor: 'bg-violet-600',
    timeOfDay: 'night',
  },
];

export default function HeroBannerCarousel() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());
  const { settings } = useSiteSettings();

  // If hero banner is disabled in settings, don't render
  if (settings.hero_banner_enabled === false || settings.hero_enabled === false) {
    return null;
  }

  // Get interval from settings (default 5000ms = 5 seconds)
  const rotationInterval = settings.hero_banner_interval || 5000;
  const autoRotate = settings.hero_banner_auto_rotate !== false;

  // Filter banners based on time of day
  const getTimeBasedBanners = () => {
    return heroBanners.filter(
      banner => banner.timeOfDay === timeOfDay || banner.timeOfDay === 'all'
    );
  };

  const [availableBanners, setAvailableBanners] = useState(getTimeBasedBanners());

  useEffect(() => {
    // Update available banners when time changes
    const checkTime = setInterval(() => {
      const newTimeOfDay = getTimeOfDay();
      if (newTimeOfDay !== timeOfDay) {
        setTimeOfDay(newTimeOfDay);
        setAvailableBanners(heroBanners.filter(
          banner => banner.timeOfDay === newTimeOfDay || banner.timeOfDay === 'all'
        ));
        setCurrentBanner(0);
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkTime);
  }, [timeOfDay]);

  useEffect(() => {
    if (!autoRotate) return; // Don't auto-rotate if disabled in settings
    
    // Auto-rotate banners based on settings interval
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % availableBanners.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [availableBanners.length, rotationInterval, autoRotate]);

  const banner = availableBanners[currentBanner];
  const Icon = banner.icon;

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.section
          key={banner.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className={`relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br ${banner.bgGradient} border-b-4 border-black min-h-[600px]`}
        >
          {/* Animated Background Elements */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-20 right-0 w-96 h-96 bg-white/20 rounded-full filter blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute bottom-10 left-10 w-72 h-72 bg-white/20 rounded-full filter blur-3xl"
          />

          {/* Floating Particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-3 h-3 ${banner.accentColor} rounded-full opacity-40`}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 100 - 50, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
            />
          ))}

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="space-y-8"
              >
                {/* Icon Badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className={`inline-flex items-center gap-3 ${banner.accentColor} border-4 border-black px-6 py-3 neo-shadow transform -rotate-2 hover:rotate-0 transition-transform`}
                >
                  <Icon className={`w-6 h-6 text-white ${banner.iconColor}`} />
                  <span className="font-bold text-white uppercase tracking-wider text-sm">
                    {banner.timeOfDay === 'morning' ? '🌅 Morning Special' : 
                     banner.timeOfDay === 'afternoon' ? '☀️ Afternoon Deal' : 
                     '🌙 Night Exclusive'}
                  </span>
                </motion.div>

                {/* Title with Animation */}
                <motion.h1
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`text-5xl md:text-7xl font-heading font-black ${banner.textColor} leading-[0.9] tracking-tighter`}
                >
                  {banner.title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className={`text-xl md:text-2xl ${banner.textColor} font-bold max-w-lg leading-relaxed`}
                >
                  {banner.subtitle}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                  <Link to={banner.ctaLink}>
                    <Button className={`neo-btn ${banner.accentColor} text-white hover:scale-105 transition-transform h-16 px-8 text-lg rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                      {banner.ctaText} <ArrowRight className="ml-2 w-6 h-6" />
                    </Button>
                  </Link>
                  <Button variant="outline" className="neo-btn bg-white/90 backdrop-blur text-black hover:bg-white border-4 border-black h-16 px-8 text-lg rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    View All Deals
                  </Button>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center gap-6 text-sm font-bold opacity-80 pt-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
                      <span className="text-white text-xl">✓</span>
                    </div>
                    <span>100% Authentic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-500 rounded-full border-2 border-black flex items-center justify-center">
                      <span className="text-white text-xl">🚀</span>
                    </div>
                    <span>Fast Shipping</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Image with 3D Effect */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="relative"
              >
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotateZ: [0, 2, 0, -2, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative z-10 bg-white border-4 border-black p-3 neo-shadow-lg rounded-2xl transform hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-auto border-2 border-black rounded-xl"
                  />
                </motion.div>

                {/* Floating Emoji */}
                <motion.div
                  animate={{
                    y: [0, -30, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}
                  className="absolute -top-12 -right-8 z-20 text-6xl"
                >
                  {banner.decorativeEmoji}
                </motion.div>

                {/* Glow Effect */}
                <div className={`absolute -inset-4 ${banner.accentColor} opacity-20 blur-2xl -z-10 rounded-full`} />
              </motion.div>
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
            {availableBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`h-3 rounded-full border-2 border-black transition-all ${
                  index === currentBanner
                    ? `w-12 ${banner.accentColor}`
                    : 'w-3 bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
