import { Link } from 'react-router-dom';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingCart, Heart, Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationItem, setAnimationItem] = useState<{name: string} | null>(null);

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      category: item.category,
    });
    
    // Show premium animation
    setAnimationItem(item);
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 2000);
    
    toast({
      title: 'Added to cart',
      description: `${item.name} has been added to your cart.`,
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Save your favorite items for later!</p>
          <Button asChild className="bg-[#F5C842] hover:bg-[#F5C842]/90 text-[#2C3E50]">
            <Link to="/">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#2C3E50] mb-8">My Wishlist</h1>
        
        {/* Premium Animation Overlay */}
        <AnimatePresence>
          {showAnimation && animationItem && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 flex flex-col items-center text-center max-w-md mx-4"
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <motion.div
                  className="bg-[#F5C842] rounded-full p-4 mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                >
                  <ShoppingCart className="w-12 h-12 text-[#2C3E50]" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-[#2C3E50] mb-2">Added to Cart!</h3>
                <p className="text-gray-600 mb-4">
                  {animationItem.name} has been added to your shopping cart
                </p>
                
                <div className="flex gap-3 w-full">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAnimation(false)}
                  >
                    Continue Shopping
                  </Button>
                  <Button className="flex-1 bg-[#F5C842] hover:bg-[#F5C842]/90 text-[#2C3E50]">
                    View Cart
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-[#F7F9FC] rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <Link to={`/product/${item.id}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <Link to={`/product/${item.id}`} className="font-semibold text-[#2C3E50] hover:text-[#F5C842] mb-1 block line-clamp-2">
                  {item.name}
                </Link>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(item.rating)
                          ? 'fill-[#F5C842] text-[#F5C842]'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold text-[#2C3E50]">₹{item.price.toLocaleString('en-IN')}</span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">₹{item.originalPrice.toLocaleString('en-IN')}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-[#F5C842] hover:bg-[#F5C842]/90 text-[#2C3E50]"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}