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
    <Link to={`/product/${product.id}`} className="block group font-sans h-full">
      <div className="bg-white rounded-lg transition-all duration-300 overflow-hidden border-2 border-black neo-shadow-sm hover:neo-shadow group-hover:-translate-y-1 h-full flex flex-col">
        {/* Product Image */}
        <div className="relative overflow-hidden border-b-2 border-black">
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
                  className="bg-secondary rounded-full p-4 border-2 border-black neo-shadow"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    duration: 0.5
                  }}
                >
                  <ShoppingCart className="w-8 h-8 text-black" />
                </motion.div>

                <motion.div
                  className="absolute text-white font-bold font-heading text-xl tracking-wider mt-24"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  ADDED!
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.badges && product.badges.length > 0 && (
              <Badge className="bg-secondary text-black border-2 border-black neo-shadow-sm hover:bg-secondary px-2 py-1 text-xs font-bold uppercase tracking-wide">
                {product.badges[0]}
              </Badge>
            )}
            {product.originalPrice && (
              <Badge className="bg-accent text-white border-2 border-black neo-shadow-sm hover:bg-accent px-2 py-1 text-xs font-bold">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white border-2 border-black neo-shadow-sm hover:neo-shadow hover:bg-white rounded-md w-9 h-9 transition-all active:translate-y-0.5 active:shadow-none"
            onClick={handleWishlistToggle}
          >
            <Heart
              className={`w-5 h-5 ${isInWishlist(product.id)
                  ? 'fill-destructive text-destructive'
                  : 'text-black'
                }`}
            />
          </Button>
        </div>

        {/* Product Info */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-xs font-bold border-black rounded-md">
              {product.category}
            </Badge>
            {product.inStock ? (
              <span className="text-xs text-black font-bold flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full border border-black mr-1"></span>
                In Stock
              </span>
            ) : (
              <span className="text-xs text-red-600 font-bold flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full border border-black mr-1"></span>
                Out of Stock
              </span>
            )}
          </div>

          <h3 className="font-heading font-bold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-auto">
            <div className="flex -space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating)
                      ? 'fill-secondary text-black'
                      : 'text-gray-300'
                    }`}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-gray-500 ml-2 border border-black px-1 rounded bg-gray-100">{product.reviews}</span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-2 my-4">
            <span className="text-2xl font-bold font-heading text-black">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 font-bold line-through mb-1">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="w-full neo-btn bg-primary text-white hover:bg-primary/90 py-4 h-auto rounded-md shadow-none"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            <span className="font-bold tracking-wide">ADD TO CART</span>
          </Button>
        </div>
      </div>
    </Link>
  );
}