import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  CreditCard, MapPin, Ticket, User, Mail, Phone, Home, Hash,
  ChevronRight, Check, ShieldCheck, RotateCcw, Truck, Package,
  Map, Loader2, Lock, ArrowRight, BadgeCheck, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  updateCartBuyerIdentity,
  updateCartDiscountCodes,
  getCart,
  createDraftOrder,
  completeDraftOrder
} from '@/lib/shopify';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const STEPS = [
  { id: 1, label: 'Shipping', icon: MapPin },
  { id: 2, label: 'Payment', icon: CreditCard },
  { id: 3, label: 'Confirm', icon: Check },
];

export default function CheckoutPage() {
  const { items, clearCart, cartId, cartLoading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings } = useSiteSettings();

  const minFreeShipping = settings.free_shipping_threshold || 999;
  const shippingCost = settings.shipping_charge || 49;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [couponCode, setCouponCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'prepaid'>('cod');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const pincodeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Price calculations
  const { subtotal, totalSavings, shipping, finalTotal } = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      const price = item.originalPrice || item.price;
      return sum + price * item.quantity;
    }, 0);
    const actualTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalSavings = subtotal - actualTotal;
    const afterCoupon = Math.max(actualTotal - discount, 0);
    const shipping = afterCoupon >= minFreeShipping ? 0 : shippingCost;
    const finalTotal = afterCoupon + shipping;
    return { subtotal, totalSavings, shipping, finalTotal };
  }, [items, discount, minFreeShipping, shippingCost]);

  const freeShippingProgress = useMemo(() => {
    const actualTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return Math.min((actualTotal / minFreeShipping) * 100, 100);
  }, [items, minFreeShipping]);

  const fetchStateFromPincode = useCallback(async (pincode: string) => {
    if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      setPincodeError('Enter a valid 6-digit PIN code');
      return;
    }

    setPincodeLoading(true);
    setPincodeError('');

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();

      if (data?.[0]?.Status === 'Success' && data[0].PostOffice?.length > 0) {
        const office = data[0].PostOffice[0];
        setFormData(prev => ({
          ...prev,
          state: office.State || prev.state,
          city: office.District || prev.city,
        }));
        toast({
          title: 'Location Found!',
          description: `${office.District}, ${office.State}`,
        });
      } else {
        setPincodeError('PIN code not found. Please enter state & city manually.');
      }
    } catch {
      setPincodeError('Could not fetch location. Please enter state & city manually.');
    } finally {
      setPincodeLoading(false);
    }
  }, [toast]);

  const handlePincodeChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, zipCode: value }));
    setPincodeError('');

    if (pincodeTimerRef.current) clearTimeout(pincodeTimerRef.current);

    if (value.length === 6 && /^\d{6}$/.test(value)) {
      pincodeTimerRef.current = setTimeout(() => fetchStateFromPincode(value), 500);
    }
  }, [fetchStateFromPincode]);

  useEffect(() => {
    return () => {
      if (pincodeTimerRef.current) clearTimeout(pincodeTimerRef.current);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCouponApply = async () => {
    if (!cartId || !couponCode.trim()) return;

    try {
      const updatedCart = await updateCartDiscountCodes(cartId, [couponCode.trim()]);
      const discountInfo = updatedCart.discountCodes?.[0];

      if (discountInfo && discountInfo.applicable) {
        const cartDiscount = parseFloat(updatedCart.cost.totalAmount.amount) -
          parseFloat(updatedCart.cost.subtotalAmount.amount);
        setDiscount(Math.abs(cartDiscount) || 0);
        setCouponMessage(`Coupon "${couponCode}" applied!`);
        setIsCouponApplied(true);
      } else {
        setDiscount(0);
        setCouponMessage(`Coupon "${couponCode}" is not applicable.`);
        setIsCouponApplied(false);
      }
    } catch (error) {
      setDiscount(0);
      setCouponMessage('Failed to apply coupon.');
      setIsCouponApplied(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartId) return;
    setProcessingCheckout(true);

    try {
      let formattedPhone = formData.phone;
      if (formattedPhone && !formattedPhone.startsWith('+')) {
        formattedPhone = '+91' + formattedPhone.replace(/\D/g, '').slice(-10);
      }

      const nameParts = formData.name.trim().split(' ');
      
      await updateCartBuyerIdentity(cartId, { 
        email: formData.email, 
        phone: formattedPhone,
        deliveryAddressPreferences: [{
          deliveryAddress: {
            firstName: nameParts[0] || formData.name,
            lastName: nameParts.slice(1).join(' ') || '',
            address1: formData.street,
            city: formData.city,
            province: formData.state,
            country: 'IN',
            zip: formData.zipCode,
            phone: formattedPhone,
          }
        }]
      });

      const refreshedCart = await getCart(cartId);
      
      if (!refreshedCart) throw new Error('Cart not found after update');

      if (paymentMethod === 'prepaid') {
        if (refreshedCart.checkoutUrl) {
          window.location.href = refreshedCart.checkoutUrl;
        } else {
          throw new Error('Checkout URL not generated');
        }
      } else {
        const draftOrderLines = items.map(item => ({
          variant_id: parseInt(item.variantId.split('/').pop() || '0', 10),
          quantity: item.quantity
        })).filter(line => line.variant_id > 0);

        const draftData = await createDraftOrder({
          line_items: draftOrderLines,
          email: formData.email,
          shipping_address: {
            first_name: nameParts[0] || formData.name,
            last_name: nameParts.slice(1).join(' ') || '',
            address1: formData.street,
            city: formData.city,
            province: formData.state,
            country: 'India',
            zip: formData.zipCode,
            phone: formattedPhone
          },
          note: 'Payment Method: Cash on Delivery'
        });

        if (draftData && draftData.draftOrderId) {
          await completeDraftOrder(draftData.draftOrderId);
          clearCart();
          navigate('/order-success');
        } else {
          throw new Error('Failed to create COD order. Please try again.');
        }
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'An error occurred during checkout');
    } finally {
      setProcessingCheckout(false);
    }
  };

  const validateShipping = () => {
    const { name, email, phone, street, city, state, zipCode } = formData;
    if (!name || !email || !phone || !street || !city || !state || !zipCode || zipCode.length !== 6) {
      return false;
    }
    return true;
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const formFields = [
    { name: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'Enter your full name', half: true },
    { name: 'email', label: 'Email', icon: Mail, type: 'email', placeholder: 'your@email.com', half: true },
    { name: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: '+91 XXXXXXXXXX', half: true },
    { name: 'street', label: 'Street Address', icon: Home, type: 'text', placeholder: 'House No., Street, Area', half: false },
    { name: 'city', label: 'City', icon: MapPin, type: 'text', placeholder: 'Your city', half: true },
    { name: 'state', label: 'State', icon: Map, type: 'text', placeholder: 'Your state', half: true },
    { name: 'zipCode', label: 'PIN Code', icon: Hash, type: 'text', placeholder: '6-digit PIN code', half: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-sm text-gray-500 mt-1">Complete your order securely</p>
        </div>

        <div className="flex items-center justify-center mb-8 sm:mb-10">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  currentStep >= step.id ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                </div>
                <span className={`text-sm font-medium hidden sm:inline ${
                  currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                }`}>{step.label}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`w-10 sm:w-16 h-0.5 mx-2 sm:mx-3 transition-all ${
                  currentStep > step.id ? 'bg-gray-900' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">

              {/* Step 1 */}
              <div className={`bg-white rounded-2xl border-2 transition-all ${currentStep === 1 ? 'border-gray-900 shadow-lg' : 'border-gray-200'}`}>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-900 rounded-lg">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
                      </div>
                    </div>
                    {currentStep > 1 && (
                      <button type="button" onClick={() => setCurrentStep(1)} className="text-xs text-gray-500 hover:text-gray-900 underline">Edit</button>
                    )}
                  </div>

                  {currentStep >= 1 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {formFields.map(field => (
                          <div key={field.name} className={field.half ? '' : 'sm:col-span-2'}>
                            <Label htmlFor={field.name} className="text-xs font-medium text-gray-700 mb-1.5 block">{field.label}</Label>
                            <div className="relative">
                              <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                id={field.name} name={field.name} type={field.type}
                                value={formData[field.name as keyof typeof formData]}
                                onChange={field.name === 'zipCode' ? (e) => handlePincodeChange(e.target.value) : handleChange}
                                required
                                className="pl-10 h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-900"
                                placeholder={field.placeholder}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      {currentStep === 1 && (
                        <Button type="button" onClick={() => validateShipping() && setCurrentStep(2)}
                          className="w-full mt-5 h-12 bg-gray-900 text-white font-semibold rounded-xl transition-all">
                          Continue to Payment <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Step 2 */}
              <div className={`bg-white rounded-2xl border-2 transition-all ${currentStep === 2 ? 'border-gray-900 shadow-lg' : 'border-gray-200'}`}>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`p-2 rounded-lg ${currentStep >= 2 ? 'bg-gray-900' : 'bg-gray-200'}`}>
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
                    </div>
                  </div>

                  {currentStep >= 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <label className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-gray-900 bg-gray-50' : 'border-gray-200'}`}>
                        <div className="flex items-center">
                          <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-5 h-5 text-gray-900 focus:ring-gray-900" />
                          <div className="ml-4">
                            <span className="block text-sm font-semibold text-gray-900">Cash on Delivery (COD)</span>
                            <span className="block text-xs text-gray-500">Pay when your order arrives</span>
                          </div>
                        </div>
                      </label>
                      <label className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'prepaid' ? 'border-gray-900 bg-gray-50' : 'border-gray-200'}`}>
                        <div className="flex items-center">
                          <input type="radio" name="payment" value="prepaid" checked={paymentMethod === 'prepaid'} onChange={() => setPaymentMethod('prepaid')} className="w-5 h-5 text-gray-900 focus:ring-gray-900" />
                          <div className="ml-4">
                            <span className="block text-sm font-semibold text-gray-900">Prepaid (Secure Checkout)</span>
                            <span className="block text-xs text-gray-500">Credit Card, UPI, Wallets</span>
                          </div>
                        </div>
                      </label>

                      {currentStep === 2 && (
                        <Button type="button" onClick={() => setCurrentStep(3)}
                          className="w-full h-12 bg-gray-900 text-white font-semibold rounded-xl transition-all">
                          Review Order <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Step 3 */}
              {currentStep === 3 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border-2 border-gray-900 shadow-lg">
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2 bg-gray-900 rounded-lg">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Place Order</h2>
                      </div>
                    </div>

                    <Button type="submit" disabled={processingCheckout || cartLoading}
                      className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl text-base transition-all shadow-lg">
                      {processingCheckout ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          {paymentMethod === 'cod' ? 'Place COD Order' : 'Proceed to Payment'} - ₹{finalTotal.toLocaleString('en-IN')}
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-24">
                <h2 className="text-base font-bold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover bg-gray-100 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-xs font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <span className="font-bold text-sm text-gray-900">Total</span>
                    <span className="font-bold text-base text-gray-900">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
