import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface Order {
  id: string;
  date: string;
  items: any[];
  total: number;
  status: string;
  shippingAddress: any;
  created_at?: string;
  customer_name?: string;
  customer_email?: string;
  total_amount?: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      // If user is logged in, try to fetch from Supabase first
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
            
          if (!error && data) {
            // Transform Supabase data to match our Order interface
            const transformedOrders = data.map(order => ({
              id: order.id,
              date: order.created_at,
              items: order.items || [],
              total: order.total_amount || 0,
              status: order.status || 'Pending',
              shippingAddress: {
                name: order.customer_name || '',
                street: '', // Not stored in current schema
                city: '', // Not stored in current schema
              },
              created_at: order.created_at,
              customer_name: order.customer_name,
              customer_email: order.customer_email,
              total_amount: order.total_amount,
            }));
            setOrders(transformedOrders);
            return;
          }
        } catch (error) {
          console.error('Error fetching orders from Supabase:', error);
        }
      }
      
      // Fallback to localStorage
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      setOrders(savedOrders);
    };

    fetchOrders();
  }, [user]);

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-2">No orders yet</h2>
          <p className="text-gray-600">Your order history will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#2C3E50] mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-[#F7F9FC] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-[#2C3E50]">Order #{order.id}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <Badge className="bg-[#F5C842] text-[#2C3E50]">{order.status}</Badge>
              </div>

              <div className="space-y-3 mb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-[#2C3E50]">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-[#2C3E50]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-300 pt-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <p>Shipping to: {order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.street}, {order.shippingAddress.city}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-[#2C3E50]">
                    ₹{order.total.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
