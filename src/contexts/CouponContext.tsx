import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// ============================================================
// Coupon Context
// ============================================================
// Coupons are stored in Supabase for admin CRUD management.
// Actual discount validation happens at Shopify checkout via
// the cartDiscountCodesUpdate mutation (in CheckoutPage.tsx).
// This context provides coupon data for display/reference only.
// ============================================================

interface Coupon {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value: number;
  max_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  description: string;
  created_at?: string;
}

interface CouponContextType {
  coupons: Coupon[];
  loading: boolean;
  error: string | null;
  validateCoupon: (code: string, orderTotal: number) => { valid: boolean; discount: number; message: string };
  fetchCoupons: () => Promise<void>;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export function CouponProvider({ children }: { children: React.ReactNode }) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (err: any) {
      console.error('Error fetching coupons:', err);
      setError(err.message || 'Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const validateCoupon = (code: string, orderTotal: number) => {
    const coupon = coupons.find(c => c.code.toLowerCase() === code.toLowerCase());
    
    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid coupon code' };
    }
    
    if (!coupon.is_active) {
      return { valid: false, discount: 0, message: 'This coupon is no longer active' };
    }
    
    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
      return { valid: false, discount: 0, message: 'This coupon is not yet valid' };
    }
    
    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
      return { valid: false, discount: 0, message: 'This coupon has expired' };
    }
    
    if (orderTotal < coupon.min_order_value) {
      return { 
        valid: false, 
        discount: 0, 
        message: `Minimum order value is ₹${coupon.min_order_value.toLocaleString('en-IN')}` 
      };
    }
    
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return { valid: false, discount: 0, message: 'This coupon has reached its usage limit' };
    }
    
    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (orderTotal * coupon.discount_value) / 100;
      if (coupon.max_discount) {
        discount = Math.min(discount, coupon.max_discount);
      }
    } else {
      discount = Math.min(coupon.discount_value, orderTotal);
    }
    
    return { 
      valid: true, 
      discount, 
      message: `Coupon applied! You save ₹${discount.toLocaleString('en-IN')}` 
    };
  };

  useEffect(() => {
    fetchCoupons();
    // Note: Real-time subscription removed. Coupon validation at checkout
    // is now handled by Shopify's cartDiscountCodesUpdate mutation.
  }, []);

  return (
    <CouponContext.Provider value={{ coupons, loading, error, validateCoupon, fetchCoupons }}>
      {children}
    </CouponContext.Provider>
  );
}

export function useCoupons() {
  const context = useContext(CouponContext);
  if (context === undefined) {
    throw new Error('useCoupons must be used within a CouponProvider');
  }
  return context;
}
