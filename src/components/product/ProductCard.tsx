import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/data/products';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showAnimation, setShowAnimation] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
    });
    
    // Show premium animation
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 2000);
    
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please login to add items to your wishlist.',
        variant: 'destructive',
      });
      return;
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: 'Removed from wishlist',
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        rating: product.rating,
      });
      toast({
        title: 'Added to wishlist',
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#F5C842]/30">
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Premium Animation Overlay */}
          <AnimatePresence>
            {showAnimation && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black/50 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-[#F5C842] rounded-full p-4"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20,
                    duration: 0.5
                  }}
                >
                  <ShoppingCart className="w-8 h-8 text-[#2C3E50]" />
                </motion.div>
                
                <motion.div
                  className="absolute text-white font-bold text-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Added to Cart!
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.badges && product.badges.length > 0 && (
              <Badge className="bg-[#F5C842] text-[#2C3E50] hover:bg-[#F5C842] px-2 py-1 text-xs font-semibold">
                {product.badges[0]}
              </Badge>
            )}
            {product.originalPrice && (
              <Badge className="bg-red-500 text-white hover:bg-red-500 px-2 py-1 text-xs font-semibold">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </Badge>
            )}
          </div>
          
          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full w-9 h-9"
            onClick={handleWishlistToggle}
          >
            <Heart 
              className={`w-5 h-5 ${
                isInWishlist(product.id) 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-600'
              }`} 
            />
          </Button>
        </div>
        
        {/* Product Info */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs font-medium">
              {product.category}
            </Badge>
            {product.inStock ? (
              <span className="text-xs text-green-600 font-medium">In Stock</span>
            ) : (
              <span className="text-xs text-red-600 font-medium">Out of Stock</span>
            )}
          </div>
          
          <h3 className="font-bold text-[#2C3E50] mb-2 line-clamp-2 group-hover:text-[#F5C842] transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-[#F5C842] text-[#F5C842]'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-1">({product.reviews})</span>
          </div>
          
          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-[#2C3E50]">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
          
          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-[#F5C842] to-amber-500 hover:from-[#F5C842]/90 hover:to-amber-500/90 text-[#2C3E50] font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
}