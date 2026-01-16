import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total_amount: number;
  status: string;
  payment_status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  user_id: string | null;
  user_identifier?: string;
  shipping_name: string;
  shipping_street: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  created_at: string;
  updated_at: string;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // If user is logged in, fetch their orders from Supabase
        if (user?.id) {
          console.log('Fetching orders for user:', user.id);
          
          // First, try to fetch with user_id (UUID)
          let { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
            
          // If we get a UUID error, try with user_identifier
          if (error && error.message.includes('uuid')) {
            console.log('UUID error, trying with user_identifier');
            ({ data, error } = await supabase
              .from('orders')
              .select('*')
              .eq('user_identifier', user.id)
              .order('created_at', { ascending: false }));
          }
          
          if (error) {
            console.error('Error fetching orders from Supabase:', error);
            throw error;
          }
          
          if (data) {
            console.log('Orders fetched successfully:', data);
            setOrders(data);
            return;
          }
        }
        
        // Fallback to localStorage for guest users or if Supabase fetch fails
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        setOrders(savedOrders);
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Failed to fetch orders');
        
        // Fallback to localStorage on error
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        setOrders(savedOrders);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F5C842]"></div>
          <p className="mt-4 text-[#2C3E50] font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-2">Error Loading Orders</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#F5C842] hover:bg-[#F5C842]/90 text-[#2C3E50] font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-2">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders. Start shopping now!</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-[#F5C842] hover:bg-[#F5C842]/90 text-[#2C3E50] font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#2C3E50] mb-8">My Orders</h1>
        
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-[#F7F9FC] rounded-xl p-6 border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#2C3E50]">Order #{order.id}</h2>
                  <p className="text-gray-600">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : order.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.payment_status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : order.payment_status === 'pending_cod' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.payment_status === 'pending_cod' ? 'Cash on Delivery' : 
                     order.payment_status === 'paid' ? 'Paid' : 
                     order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                  </span>
                  <span className="text-xl font-bold text-[#2C3E50]">₹{order.total_amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-[#2C3E50] mb-2">Items</h3>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="bg-white rounded-lg p-2">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                        </div>
                        <div>
                          <p className="font-medium text-[#2C3E50]">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="ml-auto">
                          <p className="font-medium text-[#2C3E50]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-[#2C3E50] mb-2">Shipping Address</h3>
                  <div className="bg-white rounded-lg p-4">
                    <p className="font-medium">{order.shipping_name}</p>
                    <p className="text-gray-600">{order.shipping_street}</p>
                    <p className="text-gray-600">{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">Contact: {order.customer_phone}</p>
                      <p className="text-sm text-gray-600">Email: {order.customer_email}</p>
                    </div>
                    
                    {/* COD Note */}
                    {order.payment_status === 'pending_cod' && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-blue-600 font-medium">✓ Cash on Delivery - Pay ₹{order.total_amount.toLocaleString('en-IN')} when delivered</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}