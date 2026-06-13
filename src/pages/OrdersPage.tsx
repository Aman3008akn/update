import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getCustomerOrdersByEmail } from '@/lib/shopify';
import { mapAdminOrderToOrder } from '@/lib/productMapper';
import type { MappedOrder } from '@/lib/productMapper';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

export default function OrdersPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<MappedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        if (user?.email) {
          // Fetch orders from Shopify Admin API by customer email
          const adminOrders = await getCustomerOrdersByEmail(user.email);
          if (adminOrders.length > 0) {
            const mappedOrders = adminOrders.map(mapAdminOrderToOrder);
            setOrders(mappedOrders);
            return;
          }
        }

        // No orders found
        setOrders([]);
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Failed to fetch orders');
        setOrders([]);
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
          <div className="text-red-500 text-5xl mb-4">!</div>
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
                    order.status === 'delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.payment_status === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : order.payment_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {order.payment_status === 'paid' ? 'Paid' :
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
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                          ) : (
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                          )}
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
