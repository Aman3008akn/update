import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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
    
    // Check if coupon is active
    if (!coupon.is_active) {
      return { valid: false, discount: 0, message: 'This coupon is no longer active' };
    }
    
    // Check validity dates
    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
      return { valid: false, discount: 0, message: 'This coupon is not yet valid' };
    }
    
    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
      return { valid: false, discount: 0, message: 'This coupon has expired' };
    }
    
    // Check minimum order value
    if (orderTotal < coupon.min_order_value) {
      return { 
        valid: false, 
        discount: 0, 
        message: `Minimum order value is ₹${coupon.min_order_value.toLocaleString('en-IN')}` 
      };
    }
    
    // Check usage limit
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return { valid: false, discount: 0, message: 'This coupon has reached its usage limit' };
    }
    
    // Calculate discount
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
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('coupons-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'coupons',
        },
        (payload) => {
          console.log('New coupon added!', payload);
          // Instead of refetching all coupons, add the new one to the state
          if (payload.new.is_active) {
            setCoupons(prev => [payload.new as Coupon, ...prev]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'coupons',
        },
        (payload) => {
          console.log('Coupon updated!', payload);
          // Instead of refetching all coupons, update the specific coupon
          setCoupons(prev => 
            prev.map(coupon => 
              coupon.id === payload.new.id 
                ? {...payload.new as Coupon, created_at: coupon.created_at} 
                : coupon
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'coupons',
        },
        (payload) => {
          console.log('Coupon deleted!', payload);
          // Instead of refetching all coupons, remove the specific coupon
          setCoupons(prev => prev.filter(coupon => coupon.id !== payload.old.id));
        }
      )
      .subscribe((status) => {
        console.log('Coupons subscription status:', status);
      });
    
    return () => {
      supabase.removeChannel(subscription);
    };
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