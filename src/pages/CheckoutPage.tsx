import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCoupons } from '@/contexts/CouponContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { CreditCard, MapPin, Ticket, Sparkles, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { validateCoupon } = useCoupons();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'cod'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCouponApply = () => {
    const result = validateCoupon(couponCode, totalPrice);
    if (result.valid) {
      setDiscount(result.discount);
      setCouponMessage(result.message);
      setIsCouponApplied(true);
      toast({
        title: 'Coupon Applied',
        description: result.message,
      });
    } else {
      setDiscount(0);
      setCouponMessage(result.message);
      setIsCouponApplied(false);
      toast({
        title: 'Invalid Coupon',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Generate order ID
      const orderId = `ORD-${Date.now()}`;
      
      // Calculate totals
      const shipping = totalPrice >= 50 ? 0 : 5.99;
      const total = totalPrice + shipping - discount;
      
      // Prepare order data for Supabase with all required fields
      const supabaseOrderData = {
        id: orderId,
        items: items,
        total_amount: total,
        status: paymentMethod === 'cod' ? 'pending' : 'processing',
        payment_status: paymentMethod === 'cod' ? 'pending_cod' : 'paid',
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        user_id: user?.id && isValidUUID(user.id) ? user.id : null, // null for guest users or invalid UUIDs
        user_identifier: user?.id || null, // Store any user identifier (UUID or text)
        shipping_name: formData.name,
        shipping_street: formData.street,
        shipping_city: formData.city,
        shipping_state: formData.state,
        shipping_zip: formData.zipCode,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Attempting to save order to Supabase:', supabaseOrderData);
      
      // Save order to Supabase (for all users - both guest and logged in)
      const { data, error } = await supabase
        .from('orders')
        .insert([supabaseOrderData]);
        
      if (error) {
        console.error('Error saving order to Supabase:', error);
        toast({
          title: 'Error',
          description: 'Failed to save order to database. Please try again.',
          variant: 'destructive',
        });
        // Continue with localStorage save even if Supabase fails
      } else {
        console.log('Order saved to Supabase successfully:', data);
      }
      
      // Prepare order data for localStorage (with additional fields for display)
      const localStorageOrderData = {
        ...supabaseOrderData,
        date: new Date().toISOString(),
        shippingAddress: {
          name: formData.name,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        total: total
      };
      
      console.log('Saving order to localStorage:', localStorageOrderData);
      
      // Save order to localStorage (fallback for all users)
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(localStorageOrderData);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      console.log('Order saved to localStorage');

      clearCart();
      
      toast({
        title: 'Order placed successfully!',
        description: `Your order #${orderId} has been confirmed. ${paymentMethod === 'cod' ? 'You will pay cash on delivery.' : 'Payment has been processed.'}`,
      });

      navigate(`/orders`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Error placing order',
        description: 'There was an issue processing your order. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const shipping = totalPrice >= 50 ? 0 : 5.99;
  const total = totalPrice + shipping - discount;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#2C3E50] mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Address */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#F5C842]/20 rounded-lg">
                    <MapPin className="w-5 h-5 text-[#F5C842]" />
                  </div>
                  <h2 className="text-xl font-bold text-[#2C3E50]">Shipping Address</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#F5C842]/20 rounded-lg">
                    <CreditCard className="w-5 h-5 text-[#F5C842]" />
                  </div>
                  <h2 className="text-xl font-bold text-[#2C3E50]">Payment Method</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div 
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      paymentMethod === 'card' 
                        ? 'border-[#F5C842] bg-[#F5C842]/10' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        paymentMethod === 'card' 
                          ? 'border-[#F5C842] bg-[#F5C842]' 
                          : 'border-gray-400'
                      }`}>
                        {paymentMethod === 'card' && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#2C3E50]">Credit/Debit Card</h3>
                        <p className="text-sm text-gray-600">Pay with your card securely</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      paymentMethod === 'cod' 
                        ? 'border-[#F5C842] bg-[#F5C842]/10' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        paymentMethod === 'cod' 
                          ? 'border-[#F5C842] bg-[#F5C842]' 
                          : 'border-gray-400'
                      }`}>
                        {paymentMethod === 'cod' && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#2C3E50]">Cash on Delivery</h3>
                        <p className="text-sm text-gray-600">Pay cash when you receive your order</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Payment Details - Only show for card payments */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cardExpiry">Expiry Date</Label>
                        <Input
                          id="cardExpiry"
                          name="cardExpiry"
                          placeholder="MM/YY"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardCvc">CVC</Label>
                        <Input
                          id="cardCvc"
                          name="cardCvc"
                          placeholder="123"
                          value={formData.cardCvc}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* COD Information - Only show for COD payments */}
                {paymentMethod === 'cod' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <Wallet className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
                      <div>
                        <h3 className="font-semibold text-blue-800">Cash on Delivery</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          You will pay ₹{total.toLocaleString('en-IN')} in cash when your order is delivered. 
                          Please ensure you have the exact amount to facilitate smooth delivery.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-lg sticky top-24">
                <h2 className="text-xl font-bold text-[#2C3E50] mb-6">Order Summary</h2>
                
                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="font-medium text-[#2C3E50]">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-[#2C3E50]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
                
                {/* Divider */}
                <div className="border-t border-gray-300 my-4"></div>
                
                {/* Pricing */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 pt-3 flex justify-between text-xl font-bold text-[#2C3E50]">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                
                {/* Premium Coupon Section */}
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Label htmlFor="couponCode" className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-md">
                      <Ticket className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-[#2C3E50]">Apply Coupon</span>
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="couponCode"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="pl-10 pr-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:border-[#F5C842] focus:ring-2 focus:ring-[#F5C842]/20 transition-all"
                      />
                      <Ticket className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <Button
                      type="button"
                      onClick={handleCouponApply}
                      className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Apply
                    </Button>
                  </div>
                  {couponMessage && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`mt-2 p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                        isCouponApplied 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}
                    >
                      {isCouponApplied ? (
                        <Sparkles className="w-4 h-4 text-green-600" />
                      ) : (
                        <Ticket className="w-4 h-4 text-red-600" />
                      )}
                      {couponMessage}
                    </motion.div>
                  )}
                </motion.div>
                
                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#F5C842] to-amber-500 hover:from-[#F5C842]/90 hover:to-amber-500/90 text-[#2C3E50] font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  {paymentMethod === 'cod' ? 'Place Order (COD)' : 'Place Order'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Add this helper function at the top of the component or before the component
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}