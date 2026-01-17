import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package, Truck, Shield, Sparkles } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { products as localProducts } from '@/data/products';
import { supabase } from '@/lib/supabase';
import CouponDisplay from '@/components/CouponDisplay';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { 
  getTimeOfDay, 
  getTimeBasedGreeting, 
  getTimeBasedTheme,
  filterProductsByTime,
  getTimeBasedFeaturedProducts 
} from '@/utils/timeBasedProducts';
import { motion } from 'framer-motion';
import HeroBannerCarousel from '@/components/HeroBannerCarousel';

export default function Home() {
  const { settings } = useSiteSettings();
  const [products, setProducts] = useState<any[]>(localProducts);
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());
  const [timeTheme, setTimeTheme] = useState(getTimeBasedTheme());
  const [greeting, setGreeting] = useState(getTimeBasedGreeting());

  // Update time-based theme every minute
  useEffect(() => {
    const updateTimeTheme = () => {
      const newTimeOfDay = getTimeOfDay();
      if (newTimeOfDay !== timeOfDay) {
        setTimeOfDay(newTimeOfDay);
        setTimeTheme(getTimeBasedTheme());
        setGreeting(getTimeBasedGreeting());
      }
    };

    const interval = setInterval(updateTimeTheme, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [timeOfDay]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data) {
          const mappedProducts = data.map(p => ({
            ...p,
            inStock: p.in_stock,
            originalPrice: p.originalPrice || p.original_price
          }));
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();

    // Enable Real-time Updates
    const channel = supabase
      .channel('public:products:home')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Get time-based products
  const timeBasedProducts = filterProductsByTime(products);
  const featuredProducts = getTimeBasedFeaturedProducts(products.filter(p => p.featured), 4);
  const newArrivals = getTimeBasedFeaturedProducts(products.filter(p => p.badges?.includes('new')), 4);
  const bestSellers = getTimeBasedFeaturedProducts(products.filter(p => p.badges?.includes('bestseller')), 4);

  return (
    <div className="min-h-screen bg-paper">
      {/* Hero Banner Carousel - 10 Amazing Rotating Banners */}
      <HeroBannerCarousel />

      {/* Featured Products - Time Based */}
      {settings.featured_section_enabled !== false && (
        <section className="py-20 bg-white border-b-2 border-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-16">
              <div>
                <motion.div
                  key={timeOfDay}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-3 mb-2"
                >
                  <span className="text-4xl">{timeTheme.emoji}</span>
                  <div>
                    <span className={`text-sm font-bold ${timeTheme.textColor} uppercase tracking-wide`}>{timeTheme.description}</span>
                    <h2 className="text-4xl font-heading font-extrabold text-foreground uppercase tracking-tight">
                      {settings.featured_section_title || 'Featured Loot'}
                    </h2>
                  </div>
                </motion.div>
                <div className={`h-2 w-24 ${timeTheme.accentColor} mt-2 border-2 border-black`}></div>
                {settings.featured_section_subtitle && (
                  <p className="text-gray-600 mt-2">{settings.featured_section_subtitle}</p>
                )}
              </div>
              <Button variant="outline" className="neo-btn bg-white h-12">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product, index) => (
                  <motion.div 
                    key={`${timeOfDay}-${product.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="transform hover:-translate-y-2 transition-transform duration-200"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-4 text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                  <p className="text-xl text-gray-400 font-heading">Loading amazing products...</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals Banner */}
      {settings.new_arrivals_enabled !== false && (
        <section className="py-24 bg-primary border-b-2 border-black overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex justify-between items-center mb-12">
              <div>
                <span className="bg-black text-white px-3 py-1 font-bold text-sm uppercase mb-2 inline-block transform -rotate-1">Fresh Drop</span>
                <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-white uppercase tracking-tight neo-shadow-sm">
                  {settings.new_arrivals_title || 'New Arrivals'}
                </h2>
                {settings.new_arrivals_subtitle && (
                  <p className="text-white/80 mt-2">{settings.new_arrivals_subtitle}</p>
                )}
              </div>
              <Button className="neo-btn bg-secondary text-black hover:bg-secondary/90 border-white h-12">
                Check em out <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {newArrivals.map((product, index) => (
                <motion.div 
                  key={`${timeOfDay}-new-${product.id}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="neo-card bg-white p-2"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      <section className="py-20 bg-paper border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-heading font-extrabold text-foreground uppercase tracking-tight">Fan Favorites</h2>
              <div className="h-2 w-24 bg-accent mt-2 border-2 border-black"></div>
            </div>
            <Button variant="outline" className="neo-btn bg-white h-12">
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product, index) => (
              <motion.div
                key={`${timeOfDay}-best-${product.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Neo Brutalist Boxes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="neo-card p-8 text-center bg-secondary/20">
              <div className="w-20 h-20 bg-secondary rounded-xl border-2 border-black flex items-center justify-center mx-auto mb-6 neo-shadow-sm transform rotate-3">
                <Truck className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground mb-3">Fast Shipping</h3>
              <p className="text-foreground/80 font-medium">Get your loot delivered at supersonic speeds.</p>
            </div>
            <div className="neo-card p-8 text-center bg-primary/10">
              <div className="w-20 h-20 bg-primary rounded-xl border-2 border-black flex items-center justify-center mx-auto mb-6 neo-shadow-sm transform -rotate-2">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground mb-3">Secure Payment</h3>
              <p className="text-foreground/80 font-medium">100% secure checkout with military-grade encryption.</p>
            </div>
            <div className="neo-card p-8 text-center bg-accent/20">
              <div className="w-20 h-20 bg-accent rounded-xl border-2 border-black flex items-center justify-center mx-auto mb-6 neo-shadow-sm transform rotate-2">
                <Package className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground mb-3">Premium Quality</h3>
              <p className="text-foreground/80 font-medium">Authentic, officially licensed merchandise only.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coupons */}
      {settings.show_coupon_on_homepage !== false && settings.coupons_enabled !== false && (
        <section className="py-12 bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CouponDisplay />
          </div>
        </section>
      )}
    </div>
  );
}