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
      {/* Hero Section with Time-Based Theme */}
      <section className={`relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br ${timeTheme.bgColor} border-b-2 border-black transition-colors duration-1000`}>
        {/* Time-Based Greeting Banner */}
        <motion.div 
          key={timeOfDay}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className={`${timeTheme.accentColor} text-white px-6 py-2 rounded-full border-2 border-black neo-shadow font-bold text-sm flex items-center gap-2`}>
            <span className="text-lg">{timeTheme.emoji}</span>
            <span>{greeting}</span>
          </div>
        </motion.div>

        {/* Abstract Background Elements */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-secondary rounded-full filter blur-3xl opacity-20 animate-pulse-glow"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-primary rounded-full filter blur-3xl opacity-20 animate-pulse-glow"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block bg-secondary border-2 border-black px-4 py-1 neo-shadow-sm transform -rotate-2">
                <span className="font-bold text-black uppercase tracking-wider text-sm">Official Merch Store</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-heading font-bold text-foreground leading-[0.9] tracking-tighter">
                {settings?.hero_title || 'UNLEASH YOUR OTAKU SOUL'}
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80 font-medium max-w-lg leading-relaxed">
                {settings?.hero_subtitle || 'The ultimate collection of premium anime merchandise. Figurines, apparel, and more.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <Button className="neo-btn bg-primary text-white hover:bg-primary/90 h-14 px-8 text-lg rounded-none">
                  Shop Now <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
                <Button variant="outline" className="neo-btn bg-white text-foreground hover:bg-gray-50 h-14 px-8 text-lg rounded-none">
                  View Collection
                </Button>
              </div>

              <div className="flex items-center gap-4 text-sm font-bold text-foreground/60 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-black"></div>
                  ))}
                </div>
                <p>Trusted by 10k+ otakus</p>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white border-4 border-black p-2 neo-shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-500 rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80"
                  alt="Anime Merchandise"
                  className="w-full h-auto border-2 border-black rounded-lg grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>

              {/* Floating stickers */}
              <div className="absolute -top-12 -right-8 z-20 animate-float bg-secondary border-2 border-black p-4 rounded-full neo-shadow">
                <Sparkles className="w-8 h-8 text-black" />
              </div>
              <div className="absolute -bottom-8 -left-8 z-20 animate-float animation-delay-2000 bg-primary border-2 border-black p-4 rounded-full neo-shadow">
                <Package className="w-8 h-8 text-white" />
              </div>

              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-2 border-black rounded-full opacity-10 border-dashed animate-spin-slow pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products - Time Based */}
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
                  <h2 className="text-4xl font-heading font-extrabold text-foreground uppercase tracking-tight">Featured Loot</h2>
                </div>
              </motion.div>
              <div className={`h-2 w-24 ${timeTheme.accentColor} mt-2 border-2 border-black`}></div>
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

      {/* New Arrivals Banner */}
      <section className="py-24 bg-primary border-b-2 border-black overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center mb-12">
            <div>
              <span className="bg-black text-white px-3 py-1 font-bold text-sm uppercase mb-2 inline-block transform -rotate-1">Fresh Drop</span>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-white uppercase tracking-tight neo-shadow-sm">New Arrivals</h2>
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
      <section className="py-12 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CouponDisplay />
        </div>
      </section>
    </div>
  );
}