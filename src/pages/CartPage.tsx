import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import CouponDisplay from '@/components/CouponDisplay';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some awesome anime merchandise to get started!</p>
          <Button asChild className="bg-[#F5C842] hover:bg-[#F5C842]/90 text-[#2C3E50]">
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#2C3E50] mb-8">Shopping Cart</h1>
        
        <CouponDisplay />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-[#F7F9FC] rounded-xl p-6 flex gap-6">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <Link to={`/product/${item.id}`} className="font-semibold text-[#2C3E50] hover:text-[#F5C842] mb-1 block">
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-600 mb-3">{item.category}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-[#2C3E50]">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                  {item.originalPrice && (
                    <p className="text-sm text-gray-500 line-through">
                      ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#F7F9FC] rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#2C3E50] mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{totalPrice >= 50 ? 'FREE' : '₹5.99'}</span>
                </div>
                <div className="border-t border-gray-300 pt-3 flex justify-between text-xl font-bold text-[#2C3E50]">
                  <span>Total</span>
                  <span>₹{(totalPrice + (totalPrice >= 50 ? 0 : 5.99)).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600">On orders over ₹50</p>

              {totalPrice < 50 && (
                <p className="text-sm text-gray-600 mb-4 p-3 bg-yellow-50 rounded-lg">
                  Add ₹{(50 - totalPrice).toLocaleString('en-IN')} more for free shipping!
                </p>
              )}

              <Button
                onClick={handleCheckout}
                className="w-full bg-[#F5C842] hover:bg-[#F5C842]/90 text-[#2C3E50] font-semibold h-12 mb-3"
              >
                Proceed to Checkout
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full"
              >
                <Link to="/">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}