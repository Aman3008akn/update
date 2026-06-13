import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { products } from '@/data/products';
import ProductCard from './product/ProductCard';
import { Sparkles } from 'lucide-react';

interface ProductRecommendationsProps {
  currentProductId?: string;
  category?: string;
  title?: string;
}

export default function ProductRecommendations({ 
  currentProductId, 
  category,
  title = "You Might Also Like"
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<typeof products>([]);

  useEffect(() => {
    // AI-Powered recommendation logic based on browsing history and current product
    const getRecommendations = () => {
      let filteredProducts = products.filter(p => p.id !== currentProductId);
      
      // Get browsing history from localStorage
      const browsingHistory = JSON.parse(localStorage.getItem('browsingHistory') || '[]');
      
      // If category is provided, prioritize same category
      if (category) {
        const sameCategory = filteredProducts.filter(p => p.category === category);
        const otherProducts = filteredProducts.filter(p => p.category !== category);
        
        // Mix: 70% same category, 30% based on browsing history
        const sameCategoryPicks = sameCategory.slice(0, 3);
        const historyBasedPicks = otherProducts
          .filter(p => browsingHistory.includes(p.category))
          .slice(0, 1);
        
        filteredProducts = [...sameCategoryPicks, ...historyBasedPicks];
      } else {
        // Show products based on browsing history
        const historyCategories = [...new Set(browsingHistory)];
        filteredProducts = filteredProducts.filter(p => 
          historyCategories.includes(p.category)
        ).slice(0, 4);
        
        // If no history, show top rated products
        if (filteredProducts.length === 0) {
          filteredProducts = products
            .filter(p => p.id !== currentProductId)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 4);
        }
      }
      
      return filteredProducts.slice(0, 4);
    };

    setRecommendations(getRecommendations());
  }, [currentProductId, category]);

  if (recommendations.length === 0) return null;

  return (
    <div className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-6 h-6 text-primary fill-primary" />
            </motion.div>
            <h2 className="text-3xl font-heading font-bold text-foreground">
              {title}
            </h2>
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-6 h-6 text-primary fill-primary" />
            </motion.div>
          </div>
          <p className="text-gray-600">Curated picks based on your interests</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to track browsing history (call this from ProductPage)
export const trackBrowsingHistory = (category: string) => {
  const history = JSON.parse(localStorage.getItem('browsingHistory') || '[]');
  const updatedHistory = [category, ...history.filter((c: string) => c !== category)].slice(0, 10);
  localStorage.setItem('browsingHistory', JSON.stringify(updatedHistory));
};
