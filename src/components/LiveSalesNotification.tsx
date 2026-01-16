import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MapPin } from 'lucide-react';

interface SaleNotification {
  id: string;
  productName: string;
  location: string;
  timeAgo: string;
}

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
];

const sampleProducts = [
  'Naruto Action Figure',
  'One Piece Manga Vol 1',
  'Attack on Titan Poster',
  'Dragon Ball Z Hoodie',
  'Demon Slayer T-Shirt',
  'My Hero Academia Figure',
  'Tokyo Ghoul Wall Art',
  'Death Note Notebook',
  'Goku Super Saiyan Figure',
  'Anime Mystery Box'
];

export default function LiveSalesNotification() {
  const [notifications, setNotifications] = useState<SaleNotification[]>([]);
  const [currentNotification, setCurrentNotification] = useState<SaleNotification | null>(null);

  useEffect(() => {
    const generateNotification = (): SaleNotification => {
      const randomProduct = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomMinutes = Math.floor(Math.random() * 30) + 1;

      return {
        id: Date.now().toString(),
        productName: randomProduct,
        location: randomCity,
        timeAgo: `${randomMinutes} minute${randomMinutes > 1 ? 's' : ''} ago`,
      };
    };

    // Show notification every 15-30 seconds
    const showNotification = () => {
      const newNotification = generateNotification();
      setCurrentNotification(newNotification);

      // Hide after 5 seconds
      setTimeout(() => {
        setCurrentNotification(null);
      }, 5000);
    };

    // Initial notification after 5 seconds
    const initialTimer = setTimeout(showNotification, 5000);

    // Regular notifications
    const interval = setInterval(showNotification, Math.random() * 15000 + 15000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {currentNotification && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="fixed bottom-6 left-6 z-50 max-w-sm"
        >
          <div className="bg-white border-2 border-black rounded-lg neo-shadow-lg p-4 flex items-start gap-3">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="bg-secondary rounded-full p-2 border-2 border-black neo-shadow-sm flex-shrink-0"
            >
              <ShoppingBag className="w-5 h-5 text-black" />
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="font-bold text-sm text-foreground line-clamp-1">
                  {currentNotification.productName}
                </p>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {currentNotification.timeAgo}
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
                <span>Someone from <span className="font-bold text-primary">{currentNotification.location}</span> just bought this!</span>
              </div>
              
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 5, ease: 'linear' }}
                className="h-1 bg-primary rounded-full mt-2 origin-left"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
