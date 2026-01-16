import { useState } from 'react';
import { useCoupons } from '@/contexts/CouponContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Ticket, Sparkles, Calendar, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CouponDisplay() {
  const { coupons, loading } = useCoupons();
  const [visibleCoupons, setVisibleCoupons] = useState(3);

  // Filter active coupons that are currently valid
  const activeCoupons = coupons.filter(coupon => {
    const now = new Date();
    const validFrom = coupon.valid_from ? new Date(coupon.valid_from) : null;
    const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;
    
    return coupon.is_active && 
           (!validFrom || validFrom <= now) && 
           (!validUntil || validUntil >= now);
  });

  if (loading || activeCoupons.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 border-2 border-yellow-200 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-yellow-400 to-amber-500 py-4">
            <CardTitle className="flex items-center justify-center gap-3 text-white">
              <Sparkles className="w-6 h-6 text-white" />
              <span className="text-xl font-bold">Available Coupons</span>
              <Sparkles className="w-6 h-6 text-white" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {activeCoupons.slice(0, visibleCoupons).map((coupon, index) => (
                <motion.div 
                  key={coupon.id} 
                  className="relative bg-white rounded-xl border border-yellow-100 shadow-md overflow-hidden"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <div className="absolute top-0 right-0 w-24 h-24">
                    <div className="absolute top-0 right-0 w-32 h-8 bg-yellow-400 transform origin-top-right rotate-45 translate-x-8 -translate-y-4">
                      <div className="absolute top-2 right-6 text-white font-bold text-xs">
                        {coupon.discount_type === 'percentage' 
                          ? `${coupon.discount_value}% OFF` 
                          : `₹${coupon.discount_value} OFF`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg">
                          <Ticket className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-sm px-3 py-1">
                              {coupon.code}
                            </Badge>
                            <span className="font-bold text-[#2C3E50] text-lg">
                              {coupon.discount_type === 'percentage' 
                                ? `${coupon.discount_value}% OFF` 
                                : `₹${coupon.discount_value.toLocaleString('en-IN')} OFF`}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 max-w-xs">{coupon.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1">
                        {coupon.min_order_value > 0 && (
                          <div className="flex items-center gap-1 text-sm text-gray-700">
                            <IndianRupee className="w-3 h-3" />
                            <span>Min. ₹{coupon.min_order_value.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        {coupon.valid_until && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>Expires: {new Date(coupon.valid_until).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {activeCoupons.length > 3 && (
              <div className="mt-6 text-center">
                <motion.button 
                  onClick={() => setVisibleCoupons(prev => 
                    prev === 3 ? activeCoupons.length : 3
                  )}
                  className="text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center justify-center gap-1 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {visibleCoupons === 3 ? (
                    <>
                      <span>View All {activeCoupons.length} Coupons</span>
                      <motion.span
                        animate={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        ▼
                      </motion.span>
                    </>
                  ) : (
                    <>
                      <span>Show Less</span>
                      <motion.span
                        animate={{ rotate: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        ▲
                      </motion.span>
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}