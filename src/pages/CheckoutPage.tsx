import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCoupons } from '@/contexts/CouponContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { CreditCard, MapPin, Ticket, Sparkles, Wallet, User, Mail, Phone, Home, Globe, Hash, User2, Mailbox, Building, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { loadRazorpay, createRazorpayOrder, openRazorpayCheckout, verifyPayment } from '@/lib/razorpay';
import { RAZORPAY_KEY_ID } from '@/lib/config';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { validateCoupon } = useCoupons();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings } = useSiteSettings();

  // Get payment settings from admin dashboard
  const enableCod = settings.cod_enabled !== false;
  const enableRazorpay = settings.razorpay_enabled !== false;
  const codExtraCharge = settings.cod_extra_charge || 0;
  const minFreeShipping = settings.free_shipping_threshold || 999;
  const shippingCost = settings.shipping_charge || 49;
  const codMessage = 'Pay cash when you receive your order';
  const razorpayMessage = 'Secure payment gateway';

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
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'cod', or 'razorpay'

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

  const handleSubmit = async (e: React.FormEvent, bypassRazorpay = false) => {
    e.preventDefault();

    // Handle Razorpay payment
    if (paymentMethod === 'razorpay' && !bypassRazorpay) {
      await handleRazorpayPayment();
      return;
    }

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
          description: 'Failed to save order to database. Please contact support.',
          variant: 'destructive',
        });
        return;
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
        total: total,
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

  const handleRazorpayPayment = async () => {
    console.log("handleRazorpayPayment: start");

    try {
      // Check if user is authenticated
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to proceed with Razorpay payment.',
          variant: 'destructive',
        });
        navigate('/login');
        return;
      }

      // Load Razorpay SDK
      console.log('Loading Razorpay SDK...');
      const isRazorpayLoaded = await loadRazorpay();
      console.log('Razorpay SDK loaded:', isRazorpayLoaded);

      if (!isRazorpayLoaded) {
        console.error('Failed to load Razorpay SDK');
        toast({
          title: 'Error',
          description: 'Failed to load Razorpay. Please refresh the page and try again.',
          variant: 'destructive',
        });
        return;
      }

      // Calculate totals
      console.log('Calculating totals...');
      const shipping = totalPrice >= 50 ? 0 : 5.99;
      const total = totalPrice + shipping - discount;
      const totalInPaise = Math.round(total * 100); // Convert to paise

      console.log('Totals calculated:', { total, totalInPaise, shipping, discount });

      // Validate totals
      if (totalInPaise <= 0) {
        console.error('Invalid amount:', totalInPaise);
        toast({
          title: 'Error',
          description: 'Invalid order amount. Please check your cart and try again.',
          variant: 'destructive',
        });
        return;
      }

      // Create order in backend
      console.log('Creating Razorpay order...');
      const order = await createRazorpayOrder(totalInPaise, 'INR');
      console.log('Razorpay order created:', order);

      // Check if we have a valid order object
      if (!order) {
        console.error('Invalid order received:', order);
        toast({
          title: 'Error',
          description: 'Failed to create payment order. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      // If no order ID, we are likely in fallback/demo mode
      if (!order.id) {
        console.warn('No order ID received. Proceeding in Direct Payment mode (Demo).');
        toast({
          title: 'Demo Mode Active',
          description: 'Backend services unreachable. Proceeding with client-side payment flow.',
          duration: 5000,
        });
      }

      // Build Razorpay options object
      const options: any = {
        key: RAZORPAY_KEY_ID, // Using the configured live key
        amount: order.amount,
        currency: order.currency,
        name: 'MythManga',
        description: 'Anime Merchandise Purchase',
        image: 'https://example.com/your_logo.png',
        handler: async function (response: any) {
          console.log('Payment success response:', response);

          // Verify the payment
          const isVerified = await verifyPayment(
            response.razorpay_order_id || 'demo_order',
            response.razorpay_payment_id,
            response.razorpay_signature || 'demo_signature'
          );

          if (isVerified) {
            // Handle successful payment
            toast({
              title: 'Payment Successful!',
              description: 'Your payment has been processed successfully.',
            });

            // Submit the order form
            const fakeEvent = { preventDefault: () => { } } as React.FormEvent;
            handleSubmit(fakeEvent, true);
          } else {
            toast({
              title: 'Payment Verification Failed',
              description: 'Unable to verify your payment. Please contact support.',
              variant: 'destructive',
            });
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: `${formData.street}, ${formData.city}, ${formData.state} - ${formData.zipCode}`
        },
        theme: {
          color: '#F5C842'
        },
        modal: {
          ondismiss: function () {
            console.log('Payment dialog closed by user');
            toast({
              title: 'Payment Cancelled',
              description: 'You have cancelled the payment. You can continue shopping or try again.',
            });
          }
        }
      };

      // Only add order_id if it exists (it's required for standard flow, but omitted for direct/demo flow)
      if (order.id) {
        options.order_id = order.id;
      }

      // Check if Razorpay SDK is available
      console.log("window.Razorpay:", (window as any).Razorpay);
      if (typeof window === 'undefined' || !(window as any).Razorpay) {
        console.error("Razorpay SDK not available");
        toast({
          title: 'Error',
          description: 'Razorpay SDK not available. Please refresh the page and try again.',
          variant: 'destructive',
        });
        return;
      }

      // Open Razorpay checkout
      console.log('Opening Razorpay checkout with options:', options);
      const rzp = new (window as any).Razorpay(options);

      // Attach payment failure handler
      rzp.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response);
        console.error("Payment failed error details:", response.error);
        toast({
          title: 'Payment Failed',
          description: `Payment failed: ${response.error.description || 'Unknown error'}. Please try again.`,
          variant: 'destructive',
        });
      });

      rzp.open();
      console.log("Razorpay checkout opened successfully");
      console.log("handleRazorpayPayment: end");
    } catch (error: any) {
      console.error("Error in handleRazorpayPayment:", error);
      toast({
        title: 'Error',
        description: `Failed to initiate Razorpay payment: ${error.message}. Please try again.`,
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
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700 shadow-2xl transform transition-all duration-300 hover:shadow-yellow-500/20">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl shadow-lg">
                    <MapPin className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                      Premium Shipping Address
                    </h2>
                    <p className="text-gray-400 text-sm">Enter your luxury delivery details</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300 font-medium">Full Name</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-yellow-500" />
                      </div>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="pl-10 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 py-3 transition-all duration-300"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300 font-medium">Email Address</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-yellow-500" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="pl-10 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 py-3 transition-all duration-300"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-300 font-medium">Phone Number</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-yellow-500" />
                      </div>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="pl-10 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 py-3 transition-all duration-300"
                        placeholder="+91 XXXXXXXXXX"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="street" className="text-gray-300 font-medium">Street Address</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Home className="h-5 w-5 text-yellow-500" />
                      </div>
                      <Input
                        id="street"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        required
                        className="pl-10 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 py-3 transition-all duration-300"
                        placeholder="123 Main Street"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-gray-300 font-medium">City</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-yellow-500" />
                      </div>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="pl-10 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 py-3 transition-all duration-300"
                        placeholder="Your city"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-gray-300 font-medium">State</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe className="h-5 w-5 text-yellow-500" />
                      </div>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="pl-10 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 py-3 transition-all duration-300"
                        placeholder="Your state"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="text-gray-300 font-medium">ZIP Code</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Hash className="h-5 w-5 text-yellow-500" />
                      </div>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        className="pl-10 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 py-3 transition-all duration-300"
                        placeholder="123456"
                      />
                    </div>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'card'
                      ? 'border-[#F5C842] bg-[#F5C842]/10'
                      : 'border-gray-300 hover:border-gray-400'
                      }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${paymentMethod === 'card'
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

                  {enableCod && (
                  <div
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'cod'
                      ? 'border-[#F5C842] bg-[#F5C842]/10'
                      : 'border-gray-300 hover:border-gray-400'
                      }`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${paymentMethod === 'cod'
                        ? 'border-[#F5C842] bg-[#F5C842]'
                        : 'border-gray-400'
                        }`}>
                        {paymentMethod === 'cod' && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#2C3E50]">Cash on Delivery</h3>
                        <p className="text-sm text-gray-600">{codMessage}</p>
                      </div>
                    </div>
                  </div>
                  )}

                  {enableRazorpay && (
                  <div
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'razorpay'
                      ? 'border-[#F5C842] bg-[#F5C842]/10'
                      : 'border-gray-300 hover:border-gray-400'
                      }`}
                    onClick={() => setPaymentMethod('razorpay')}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${paymentMethod === 'razorpay'
                        ? 'border-[#F5C842] bg-[#F5C842]'
                        : 'border-gray-400'
                        }`}>
                        {paymentMethod === 'razorpay' && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#2C3E50]">Razorpay</h3>
                        <p className="text-sm text-gray-600">{razorpayMessage}</p>
                      </div>
                    </div>
                  </div>
                  )}
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

                {/* Razorpay Information - Only show for Razorpay payments */}
                {paymentMethod === 'razorpay' && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center mt-0.5 mr-2">
                        <span className="text-white text-xs font-bold">R</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-purple-800">Razorpay Payment</h3>
                        <p className="text-sm text-purple-700 mt-1">
                          You will be redirected to Razorpay to complete your payment securely.
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
                      className={`mt-2 p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${isCouponApplied
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
                  {paymentMethod === 'cod' ? 'Place Order (COD)' :
                    paymentMethod === 'razorpay' ? 'Proceed to Razorpay' :
                      'Place Order'}
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
