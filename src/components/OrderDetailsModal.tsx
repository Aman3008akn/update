interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  payment_status?: string;
  created_at: string;
  items: OrderItem[];
  shipping_address?: string;
  admin_note?: string;
}

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">Order Information</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Order ID</span>
              <span className="font-medium text-white">#{order.id}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Order Date</span>
              <span className="font-medium text-white">
                {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Status</span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                order.status === 'completed' 
                  ? 'bg-green-900/50 text-green-400 border border-green-800/50' 
                  : order.status === 'pending' 
                    ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-800/50' 
                    : 'bg-red-900/50 text-red-400 border border-red-800/50'
              }`}>
                {order.status || 'Pending'}
              </span>
            </div>
            
            {order.payment_status && (
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Status</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  order.payment_status === 'paid' 
                    ? 'bg-green-900/50 text-green-400 border border-green-800/50' 
                    : order.payment_status === 'pending_cod' 
                      ? 'bg-blue-900/50 text-blue-400 border border-blue-800/50' 
                      : order.payment_status === 'pending' 
                        ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-800/50' 
                        : 'bg-red-900/50 text-red-400 border border-red-800/50'
                }`}>
                  {order.payment_status === 'pending_cod' ? 'Cash on Delivery' : order.payment_status}
                </span>
              </div>
            )}
            
            {order.admin_note && (
              <div>
                <span className="text-gray-400 block">Admin Note</span>
                <span className="font-medium text-white">{order.admin_note}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">Customer Information</h3>
          
          <div className="space-y-3">
            <div>
              <span className="text-gray-400 block">Name</span>
              <span className="font-medium text-white">{order.customer_name || 'N/A'}</span>
            </div>
            
            <div>
              <span className="text-gray-400 block">Email</span>
              <span className="font-medium text-white">{order.customer_email || 'N/A'}</span>
            </div>
            
            {order.shipping_address && (
              <div>
                <span className="text-gray-400 block">Shipping Address</span>
                <span className="font-medium text-white">{order.shipping_address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Order Items</h3>
        
        <div className="space-y-4">
          {order.items?.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-700">
              <div>
                <p className="font-medium text-white">{item.name}</p>
                <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-white">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                <p className="text-sm text-gray-400">₹{item.price.toLocaleString('en-IN')} each</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
          <span className="text-lg font-bold text-white">Total</span>
          <span className="text-xl font-bold text-yellow-400">₹{order.total_amount?.toLocaleString('en-IN')}</span>
        </div>
        
        {/* COD Note */}
        {order.payment_status === 'pending_cod' && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-blue-400 font-medium">✓ Cash on Delivery - Customer will pay ₹{order.total_amount?.toLocaleString('en-IN')} when delivered</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-end pt-4">
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/30"
        >
          Close
        </button>
      </div>
    </div>
  );
}