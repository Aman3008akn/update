/**
 * Get time-based product filtering
 * Morning (6 AM - 12 PM): Fresh, energetic products
 * Afternoon (12 PM - 6 PM): Popular, trending items
 * Night (6 PM - 6 AM): Premium, exclusive products
 */

export type TimeOfDay = 'morning' | 'afternoon' | 'night';

export const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 18) {
    return 'afternoon';
  } else {
    return 'night';
  }
};

export const getTimeBasedGreeting = (): string => {
  const timeOfDay = getTimeOfDay();
  
  switch (timeOfDay) {
    case 'morning':
      return '🌅 Good Morning! Start Your Day with Amazing Deals';
    case 'afternoon':
      return '☀️ Good Afternoon! Check Out Today\'s Hot Picks';
    case 'night':
      return '🌙 Good Evening! Explore Our Premium Night Collection';
    default:
      return 'Welcome!';
  }
};

export const getTimeBasedTheme = () => {
  const timeOfDay = getTimeOfDay();
  
  switch (timeOfDay) {
    case 'morning':
      return {
        bgColor: 'from-orange-50 to-yellow-50',
        accentColor: 'bg-orange-500',
        textColor: 'text-orange-900',
        description: 'Fresh Morning Picks',
        emoji: '🌅',
      };
    case 'afternoon':
      return {
        bgColor: 'from-blue-50 to-cyan-50',
        accentColor: 'bg-blue-500',
        textColor: 'text-blue-900',
        description: 'Afternoon Specials',
        emoji: '☀️',
      };
    case 'night':
      return {
        bgColor: 'from-purple-50 to-indigo-50',
        accentColor: 'bg-purple-600',
        textColor: 'text-purple-900',
        description: 'Night Exclusives',
        emoji: '🌙',
      };
  }
};

export const filterProductsByTime = <T extends any>(products: T[]): T[] => {
  if (!products || products.length === 0) return [];
  
  const timeOfDay = getTimeOfDay();
  const productsCount = products.length;
  
  // Shuffle products based on time of day seed
  const shuffled = [...products];
  const seed = timeOfDay === 'morning' ? 1 : timeOfDay === 'afternoon' ? 2 : 3;
  
  // Custom shuffle with time-based seed
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor((Math.sin(seed * (i + 1)) + 1) / 2 * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

export const getTimeBasedFeaturedProducts = <T extends any>(products: T[], count: number = 4): T[] => {
  const filtered = filterProductsByTime(products);
  return filtered.slice(0, count);
};
