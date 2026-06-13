import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, RotateCcw, Truck, Sparkles, Tag, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import CouponDisplay from '@/components/CouponDisplay';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/product/ProductCard';

import type { Product } from '@/data/products';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState<Product[]>([]);

  // Calculate totals
  const { subtotal, totalSavings, shipping, finalTotal } = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      const price = item.originalPrice || item.price;
      return sum + price * item.quantity;
    }, 0);
    const actualTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalSavings = subtotal - actualTotal;
    const shipping = actualTotal >= 999 ? 0 : 49;
    const finalTotal = actualTotal + shipping;
    return { subtotal, totalSavings, shipping, finalTotal };
  }, [items]);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Fetch recommended products
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const cartIds = items.map(i => `'${i.id}'`).join(',');
        const cartCategories = [...new Set(items.map(i => i.category))];

        // Fetch products from same categories, excluding cart items
        let query = supabase
          .from('products')
          .select('*')
          .eq('in_stock', true)
          .limit(4);

        if (cartCategories.length > 0) {
          query = query.in('category', cartCategories);
        }

        const { data, error } = await query;
        if (!error && data) {
          const filtered = data
            .filter(p => !items.some(i => i.id === p.id))
            .map(p => ({
              ...p,
              inStock: p.in_stock,
              originalPrice: p.originalPrice || p.original_price,
            }))
            .slice(0, 4);
          setRecommended(filtered as unknown as Product[]);
        }
      } catch (error) {
        console.error('Error fetching recommended products:', error);
      }
    };

    if (items.length > 0) {
      fetchRecommended();
    }
  }, [items]);

  // ── Empty State ──
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          {/* SVG Illustration */}
          <div className="relative mx-auto w-48 h-48 mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-amber-50 rounded-full animate-pulse" />
            <div className="absolute inset-4 bg-white rounded-full shadow-inner flex items-center justify-center">
              <ShoppingBag className="w-20 h-20 text-gray-300" strokeWidth={1.2} />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-lg">?</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#2C3E50] mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 text-lg">
            Looks like you haven't added anything to your cart yet. Explore our collection!
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-[#F5C842] to-amber-500 hover:from-[#F5C842]/90 hover:to-amber-500/90 text-[#2C3E50] font-bold px-8 h-12 text-base rounded-xl shadow-lg hover:shadow-xl transition-all">
            <Link to="/" className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Start Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // ── Cart Page ──
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with item count */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2C3E50]">
            Shopping Cart
            <span className="ml-3 text-lg font-medium text-gray-500">
              ({totalItems} {totalItems === 1 ? 'Item' : 'Items'})
            </span>
          </h1>
        </div>

        <CouponDisplay />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Cart Items ── */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(item => {
              const itemSavings = item.originalPrice
                ? (item.originalPrice - item.price) * item.quantity
                : 0;
              const itemSavingsPercent = item.originalPrice
                ? Math.round((1 - item.price / item.originalPrice) * 100)
                : 0;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4 flex gap-4"
                >
                  {/* Compact Image */}
                  <Link to={`/product/${item.id}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-[84px] h-[84px] object-cover rounded-lg border border-gray-100"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.id}`}
                      className="font-semibold text-[#2C3E50] hover:text-[#F5C842] text-sm leading-tight block truncate"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-gray-500">{item.category}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                        In Stock
                      </span>
                    </div>

                    {/* Pill Quantity Controls + Remove */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex items-center bg-gray-100 rounded-full border border-gray-200">
                          <button
                            className="w-8 h-8 flex items-center justify-center rounded-l-full hover:bg-gray-200 transition-colors text-gray-600"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-[#2C3E50]">
                            {item.quantity}
                          </span>
                          <button
                            className="w-8 h-8 flex items-center justify-center rounded-r-full hover:bg-gray-200 transition-colors text-gray-600"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors px-2 py-1 rounded hover:bg-red-50"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Price + Savings */}
                  <div className="text-right flex-shrink-0 flex flex-col justify-between">
                    <p className="text-base font-bold text-[#2C3E50]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                    {item.originalPrice && (
                      <div className="mt-1">
                        <p className="text-xs text-gray-400 line-through">
                          ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                        </p>
                        {itemSavings > 0 && (
                          <span className="inline-flex items-center gap-0.5 mt-1 text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">
                            <Tag className="w-2.5 h-2.5" />
                            Save ₹{itemSavings.toLocaleString('en-IN')} ({itemSavingsPercent}%)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Order Summary (Sticky) ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-[#2C3E50] mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      Discount
                    </span>
                    <span>-₹{totalSavings.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-[#2C3E50]">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Free shipping progress */}
              {totalPrice < 999 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                    <span>Add ₹{(999 - totalPrice).toLocaleString('en-IN')} more for free shipping</span>
                    <span>{Math.min(Math.round((totalPrice / 999) * 100), 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((totalPrice / 999) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
              {totalPrice >= 999 && (
                <div className="mb-4 flex items-center gap-2 text-xs text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <Truck className="w-4 h-4" />
                  <span className="font-medium">You've unlocked FREE shipping!</span>
                </div>
              )}

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-[#F5C842] to-amber-500 hover:from-[#F5C842]/90 hover:to-amber-500/90 text-[#2C3E50] font-bold h-12 rounded-xl text-base shadow-lg hover:shadow-xl transition-all group"
              >
                Secure Checkout
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button asChild variant="ghost" className="w-full mt-2 text-gray-500 hover:text-[#2C3E50]">
                <Link to="/">Continue Shopping</Link>
              </Button>

              {/* Trust Section */}
              <div className="mt-5 pt-5 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-4.5 h-4.5 text-green-600" />
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium leading-tight">Secure<br />Payments</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center">
                      <RotateCcw className="w-4.5 h-4.5 text-blue-600" />
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium leading-tight">Easy<br />Returns</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-9 h-9 bg-amber-50 rounded-full flex items-center justify-center">
                      <Truck className="w-4.5 h-4.5 text-amber-600" />
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium leading-tight">Fast<br />Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Recommended Products ── */}
        {recommended.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-[#F5C842]" />
              <h2 className="text-xl font-bold text-[#2C3E50]">You May Also Like</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommended.map(product => (
                <ProductCard key={product.id} product={product as unknown as Product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
