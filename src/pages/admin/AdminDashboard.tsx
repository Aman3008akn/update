import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Megaphone,
  Settings,
  Bell,
  Search,
  User,
  Crown,
  Star,
  Zap,
  Ticket
} from 'lucide-react';
import Modal from '@/components/Modal';
import ProductForm from '@/components/ProductForm';
import ProductDetailsModal from '@/components/ProductDetailsModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import OrderStatusForm from '@/components/OrderStatusForm';
import OrderDetailsModal from '@/components/OrderDetailsModal';
import AddAdminForm from '@/components/AddAdminForm';
import ConfirmationModal from '@/components/ConfirmationModal';
import Notification from '@/components/Notification';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { products as localProducts } from '@/data/products';
import SiteSettingsForm from '@/components/admin/SiteSettingsForm';

// Admin Overview Component
function AdminOverview() {
  const [totalSales, setTotalSales] = useState<number | null>(null);
  const [ordersToday, setOrdersToday] = useState<number | null>(null);
  const [activeUsers, setActiveUsers] = useState<number | null>(null);
  const [lowStockItems, setLowStockItems] = useState<number | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch sales data
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*');

        if (ordersError) throw ordersError;

        // Calculate metrics
        const total = ordersData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
        setTotalSales(total);

        // Get today's orders
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = ordersData?.filter(order =>
          order.created_at && order.created_at.startsWith(today)
        ).length || 0;
        setOrdersToday(todayOrders);

        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*');

        if (usersError) throw usersError;
        setActiveUsers(usersData?.length || 0);

        // Calculate low stock items
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*');

        if (productsError) {
          // Fallback to local data
          const lowStock = localProducts.filter(p => (p.stock || 0) < 10).length;
          setLowStockItems(lowStock);
        } else {
          const lowStock = productsData?.filter(p => (p.stock || 0) < 10).length || 0;
          setLowStockItems(lowStock);
        }

        // Set recent orders
        setRecentOrders(ordersData?.slice(0, 5) || []);

      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="bg-gray-800 border border-yellow-600 rounded-xl p-8 max-w-md text-center">
          <div className="text-red-400 text-2xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-300 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-2xl p-1 shadow-2xl border border-gray-700">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500">
                Premium Dashboard
              </h1>
              <p className="text-gray-400 mt-2">Welcome to your luxury admin panel</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-500/10 p-3 rounded-full">
                <Crown className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Sales</p>
              <p className="text-2xl font-bold text-white mt-2">
                ₹{totalSales?.toLocaleString('en-IN') || '0'}
              </p>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-3 rounded-xl">
              <Zap className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 flex items-center">
              <Star className="h-3 w-3 text-yellow-500 mr-1" />
              Premium Performance
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Orders Today</p>
              <p className="text-2xl font-bold text-white mt-2">{ordersToday || 0}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 flex items-center">
              <Star className="h-3 w-3 text-yellow-500 mr-1" />
              Real-time Tracking
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Active Users</p>
              <p className="text-2xl font-bold text-white mt-2">{activeUsers || 0}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 flex items-center">
              <Star className="h-3 w-3 text-yellow-500 mr-1" />
              Growing Community
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Low Stock Items</p>
              <p className="text-2xl font-bold text-white mt-2">{lowStockItems || 0}</p>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-xl">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 flex items-center">
              <Star className="h-3 w-3 text-yellow-500 mr-1" />
              Inventory Alerts
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center">
            <ShoppingCart className="h-5 w-5 text-yellow-500 mr-2" />
            Recent Orders
          </h2>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {order.customer_name || 'Anonymous'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    ₹{(order.total_amount || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'completed'
                      ? 'bg-green-900/50 text-green-400'
                      : order.status === 'pending'
                        ? 'bg-yellow-900/50 text-yellow-400'
                        : 'bg-red-900/50 text-red-400'
                      }`}>
                      {order.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Products Management Component
function ProductsManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Notification state
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products...');

      // First try to fetch from Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      console.log('Supabase response:', { data, error });

      if (error) {
        // If Supabase error (e.g. table missing), use local data
        console.log('Supabase products fetch failed, using local data:', error);
        console.log('Local products count:', localProducts.length);
        setProducts(localProducts);
      } else if (!data || data.length === 0) {
        // If Supabase table exists but is empty, fallback to local demo data
        // This ensures the dashboard shows items matching the website in demo/initial state
        console.log('Supabase products table empty, using local demo data');
        console.log('Local products count:', localProducts.length);
        setProducts(localProducts);
      } else {
        // If we get data from Supabase, map snake_case to camelCase for frontend compatibility
        const mappedProducts = data.map(p => ({
          ...p,
          inStock: p.in_stock, // Map database column in_stock to frontend prop inStock
          // Ensure other props are passed through
        }));
        console.log('Using Supabase products:', mappedProducts.length);
        setProducts(mappedProducts);
      }
    } catch (err: any) {
      // Fallback to local data if there's any exception
      console.log('Error fetching from Supabase, using local data:', err);
      console.log('Local products count:', localProducts.length);
      setProducts(localProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productData: any) => {
    try {
      // Remove fields that don't exist in the database schema
      const { brand, size, material, ...cleanFields } = productData;

      // Generate a valid UUID for the new product
      // Supabase 'id' column requires UUID type, so 'prod-${Date.now()}' causes errors
      let productId = cleanFields.id;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!productId || !uuidRegex.test(productId)) {
        productId = crypto.randomUUID();
      }

      // Map form fields to database column names
      const newProduct = {
        id: productId,
        name: cleanFields.name,
        price: cleanFields.price,
        // "originalPrice": cleanFields.originalPrice, // Removed to prevent schema errors if column missing
        image: cleanFields.image,
        category: cleanFields.category,
        subcategory: cleanFields.subcategory,
        description: cleanFields.description,
        in_stock: cleanFields.inStock,
        stock: cleanFields.stock,
        rating: 4.5,
        reviews: 0,
        badges: cleanFields.badges || [],
        featured: cleanFields.featured || false
      };

      // Save to Supabase
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select();

      if (error) throw error;

      // Update local state with the new product from Supabase
      if (data && data.length > 0) {
        const createdProduct = {
          ...data[0],
          inStock: data[0].in_stock, // Ensure frontend prop exists
          originalPrice: data[0].originalPrice || data[0].original_price
        };
        setProducts(prev => [...prev, createdProduct]);
      }

      setIsAddModalOpen(false);

      // Show success message
      setNotification({ message: 'Product added successfully!', type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      console.error('Error adding product:', err);
      setNotification({ message: 'Failed to add product: ' + err.message, type: 'error' });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleUpdateProduct = async (productData: any) => {
    try {
      // Remove fields that don't exist in the database schema
      const { brand, size, material, id, ...cleanFields } = productData;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      // Only attempt database update if the ID is a valid UUID (Real Product)
      // Demo products have simple text IDs and cannot be updated in the UUID-typed DB
      if (uuidRegex.test(productData.id)) {
        const updateData = {
          name: cleanFields.name,
          price: cleanFields.price,
          // "originalPrice": cleanFields.originalPrice,
          image: cleanFields.image,
          category: cleanFields.category,
          subcategory: cleanFields.subcategory,
          description: cleanFields.description,
          in_stock: cleanFields.inStock,
          stock: cleanFields.stock,
          badges: cleanFields.badges,
          featured: cleanFields.featured
        };

        const { error } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', productData.id);

        if (error) throw error;
      } else {
        console.log("Skipping DB update for Demo Product (ID not UUID)");
      }

      // Update local state
      setProducts(prev =>
        prev.map(p => p.id === productData.id ? productData : p)
      );
      setIsEditModalOpen(false);
      setSelectedProduct(null);

      // Show success message
      setNotification({ message: 'Product updated successfully!', type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      console.error('Error updating product:', err);
      setNotification({ message: 'Failed to update product: ' + err.message, type: 'error' });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      // Only attempt database delete if ID is valid UUID
      if (uuidRegex.test(productId)) {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);

        if (error) throw error;
      }

      // Update local state
      setProducts(products.filter(product => product.id !== productId));
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);

      // Show success message
      setNotification({ message: 'Product deleted successfully!', type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      console.error('Error deleting product:', err);
      setNotification({ message: 'Failed to delete product: ' + err.message, type: 'error' });
      setTimeout(() => setNotification(null), 5000);
    }
  };
  const openAddModal = () => {
    setSelectedProduct(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const openViewModal = (product: any) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (product: any) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    fetchProducts();

    // Set up real-time subscription for products
    const subscription = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          console.log('New product added!', payload);
          fetchProducts();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          console.log('Product updated!', payload);
          fetchProducts();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          console.log('Product deleted!', payload);
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  console.log('ProductsManagement render:', { loading, error, productsCount: products.length });

  if (loading) return <div className="text-[#2C3E50]">Loading products...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Modals */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product"
      >
        <ProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Update Product"
      >
        <ProductForm
          product={selectedProduct}
          onSubmit={handleUpdateProduct}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Product Details"
      >
        {selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            onClose={() => setIsViewModalOpen(false)}
          />
        )}
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Product"
      >
        {selectedProduct && (
          <DeleteConfirmationModal
            itemName={selectedProduct.name}
            onConfirm={() => handleDeleteProduct(selectedProduct.id)}
            onCancel={() => setIsDeleteModalOpen(false)}
          />
        )}
      </Modal>

      {/* Main Content */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-2xl p-1 shadow-2xl border border-gray-700">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-2">
                Products Management
              </h2>
              <p className="text-gray-400">Manage your premium anime merchandise collection</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500 w-full md:w-64"
                />
              </div>
              <Button
                className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap shadow-lg hover:shadow-yellow-500/30"
                onClick={openAddModal}
              >
                <span className="flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  <span>+ Add Premium Item</span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-800/50 transition-all duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16 rounded-xl overflow-hidden border-2 border-gray-700 shadow-lg">
                        <img className="h-16 w-16 object-cover" src={product.image} alt={product.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-white">{product.name}</div>
                        <div className="text-xs text-gray-400">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{product.category}</div>
                    <div className="text-xs text-gray-400">{product.subcategory}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-yellow-400">
                    ₹{product.price?.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{product.stock || 0} units</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.inStock !== undefined ? (
                      product.inStock ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/50 text-green-400 border border-green-800/50">
                          <span className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                            In Stock
                          </span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900/50 text-red-400 border border-red-800/50">
                          <span className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
                            Out of Stock
                          </span>
                        </span>
                      )
                    ) : (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/50 text-green-400 border border-green-800/50">
                        <span className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                          In Stock
                        </span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 border border-blue-800/30 rounded-lg transition-all duration-200"
                      onClick={() => openViewModal(product)}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/30 border border-yellow-800/30 rounded-lg transition-all duration-200"
                      onClick={() => openEditModal(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/30 border border-red-800/30 rounded-lg transition-all duration-200"
                      onClick={() => openDeleteModal(product)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Orders Management Component
function OrdersManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Notification state
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleUpdateOrder = (order: any) => {
    setSelectedOrder(order);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateOrderStatus = async (orderData: any) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: orderData.status,
          payment_status: orderData.paymentStatus,
          admin_note: orderData.adminNote
        })
        .eq('id', orderData.id);

      if (error) throw error;

      // Update local state
      setOrders(orders.map(order =>
        order.id === orderData.id ? { ...order, ...orderData } : order
      ));

      setIsUpdateModalOpen(false);
      setSelectedOrder(null);

      // Show success message
      setNotification({ message: 'Order status updated successfully!', type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      console.error('Error updating order:', err);
      setNotification({ message: 'Failed to update order: ' + err.message, type: 'error' });
      setTimeout(() => setNotification(null), 5000);
    }
  };
  useEffect(() => {
    console.log('Initializing orders management...');
    fetchOrders();

    // Set up real-time subscription for orders
    const subscription = supabase
      .channel('orders-management')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('New order received!', payload);
          fetchOrders();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('Order updated!', payload);
          fetchOrders();
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
      });

    return () => {
      console.log('Cleaning up subscription...');
      supabase.removeChannel(subscription);
    };
  }, []);

  if (loading) return <div className="text-[#2C3E50]">Loading orders...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Modals */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedOrder(null);
        }}
        title="Order Details"
      >
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedOrder(null);
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedOrder(null);
        }}
        title="Update Order Status"
      >
        {selectedOrder && (
          <OrderStatusForm
            order={selectedOrder}
            onSubmit={handleUpdateOrderStatus}
            onCancel={() => {
              setIsUpdateModalOpen(false);
              setSelectedOrder(null);
            }}
          />
        )}
      </Modal>

      {/* Main Content */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-2xl p-1 shadow-2xl border border-gray-700">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-2">
                Orders Management
              </h2>
              <p className="text-gray-400">Manage your premium anime merchandise orders</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500 w-full md:w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Shipping Address</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {order.customer_name || 'Anonymous'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    ₹{(order.total_amount || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'completed'
                      ? 'bg-green-900/50 text-green-400'
                      : order.status === 'pending'
                        ? 'bg-yellow-900/50 text-yellow-400'
                        : 'bg-red-900/50 text-red-400'
                      }`}>
                      {order.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.payment_status === 'paid'
                      ? 'bg-green-900/50 text-green-400'
                      : order.payment_status === 'pending_cod'
                        ? 'bg-blue-900/50 text-blue-400'
                        : 'bg-yellow-900/50 text-yellow-400'
                      }`}>
                      {order.payment_status === 'pending_cod' ? 'COD' :
                        order.payment_status === 'paid' ? 'Paid' :
                          order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1) || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    <div>
                      {order.shipping_street || 'N/A'}
                    </div>
                    <div>
                      {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 border border-blue-800/30 rounded-lg transition-all duration-200"
                      onClick={() => handleViewOrder(order)}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/30 border border-yellow-800/30 rounded-lg transition-all duration-200"
                      onClick={() => handleUpdateOrder(order)}
                    >
                      Update
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Add this new CouponsManagement component before the AdminDashboard component
function CouponsManagement() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);

  // Notification state
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
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

  const handleAddCoupon = async (couponData: any) => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .insert([{
          code: couponData.code,
          discount_type: couponData.discountType,
          discount_value: couponData.discountValue,
          min_order_value: couponData.minOrderValue || 0,
          max_discount: couponData.maxDiscount || null,
          usage_limit: couponData.usageLimit || null,
          valid_from: couponData.validFrom || null,
          valid_until: couponData.validUntil || null,
          is_active: couponData.isActive !== undefined ? couponData.isActive : true,
          description: couponData.description || '',
          used_count: 0
        }])
        .select();

      if (error) throw error;

      // Update local state
      setCoupons(prev => [data[0], ...prev]);
      setIsAddModalOpen(false);

      // Show success message
      setNotification({ message: 'Coupon created successfully!', type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      console.error('Error adding coupon:', err);
      setNotification({ message: 'Failed to create coupon: ' + err.message, type: 'error' });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleUpdateCoupon = async (couponData: any) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({
          code: couponData.code,
          discount_type: couponData.discountType,
          discount_value: couponData.discountValue,
          min_order_value: couponData.minOrderValue || 0,
          max_discount: couponData.maxDiscount || null,
          usage_limit: couponData.usageLimit || null,
          valid_from: couponData.validFrom || null,
          valid_until: couponData.validUntil || null,
          is_active: couponData.isActive,
          description: couponData.description || ''
        })
        .eq('id', couponData.id);

      if (error) throw error;

      // Update local state
      setCoupons(coupons.map(coupon =>
        coupon.id === couponData.id ? { ...coupon, ...couponData } : coupon
      ));

      setIsEditModalOpen(false);
      setSelectedCoupon(null);

      // Show success message
      setNotification({ message: 'Coupon updated successfully!', type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      console.error('Error updating coupon:', err);
      setNotification({ message: 'Failed to update coupon: ' + err.message, type: 'error' });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleDeleteCoupon = async (couponId: number) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', couponId);

      if (error) throw error;

      // Update local state
      setCoupons(prev => prev.filter(coupon => coupon.id !== couponId));

      // Show success message
      setNotification({ message: 'Coupon deleted successfully!', type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      console.error('Error deleting coupon:', err);
      setNotification({ message: 'Failed to delete coupon: ' + err.message, type: 'error' });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const openAddModal = () => {
    setSelectedCoupon(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (coupon: any) => {
    setSelectedCoupon(coupon);
    setIsEditModalOpen(true);
  };

  const openDeleteCouponModal = (coupon: any) => {
    setNotification({
      message: `Are you sure you want to delete coupon "${coupon.code}"? This action cannot be undone.`,
      type: 'warning'
    });
    setTimeout(() => {
      handleDeleteCoupon(coupon.id);
    }, 3000);
  };

  useEffect(() => {
    fetchCoupons();

    // Set up real-time subscription for coupons
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
            setCoupons(prev => [payload.new, ...prev]);
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
                ? { ...payload.new, created_at: coupon.created_at }
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

  if (loading) return <div className="text-[#2C3E50]">Loading coupons...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Add Coupon Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Coupon"
      >
        <CouponForm
          onSubmit={handleAddCoupon}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Coupon Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Coupon"
      >
        <CouponForm
          coupon={selectedCoupon}
          onSubmit={handleUpdateCoupon}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* Main Content */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-2xl p-1 shadow-2xl border border-gray-700">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-2">
                Coupon Management
              </h2>
              <p className="text-gray-400">Create and manage discount coupons and vouchers</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search coupons..."
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500 w-full md:w-64"
                />
              </div>
              <Button
                className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap shadow-lg hover:shadow-yellow-500/30"
                onClick={openAddModal}
              >
                <span className="flex items-center">
                  <Ticket className="w-4 h-4 mr-2" />
                  <span>Create Coupon</span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Code</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Min Order</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Validity</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-800/50 transition-all duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-white">{coupon.code}</div>
                    <div className="text-xs text-gray-400">{coupon.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-yellow-400">
                      {coupon.discount_type === 'percentage'
                        ? `${coupon.discount_value}%`
                        : `₹${coupon.discount_value.toLocaleString('en-IN')}`}
                    </div>
                    {coupon.max_discount && (
                      <div className="text-xs text-gray-400">Max: ₹{coupon.max_discount.toLocaleString('en-IN')}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    ₹{coupon.min_order_value?.toLocaleString('en-IN') || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {coupon.valid_from
                        ? new Date(coupon.valid_from).toLocaleDateString()
                        : 'No start date'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {coupon.valid_until
                        ? new Date(coupon.valid_until).toLocaleDateString()
                        : 'No expiry'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">
                      {coupon.used_count || 0} used
                    </div>
                    {coupon.usage_limit && (
                      <div className="text-xs text-gray-400">of {coupon.usage_limit}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {coupon.is_active ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/50 text-green-400 border border-green-800/50">
                        <span className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                          Active
                        </span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900/50 text-red-400 border border-red-800/50">
                        <span className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
                          Inactive
                        </span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/30 border border-yellow-800/30 rounded-lg transition-all duration-200"
                      onClick={() => openEditModal(coupon)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/30 border border-red-800/30 rounded-lg transition-all duration-200"
                      onClick={() => openDeleteCouponModal(coupon)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Add CouponForm component
function CouponForm({ coupon, onSubmit, onCancel }: { coupon?: any; onSubmit: (data: any) => void; onCancel: () => void; }) {
  const [formData, setFormData] = useState({
    code: coupon?.code || generateCouponCode(),
    discountType: coupon?.discount_type || 'percentage',
    discountValue: coupon?.discount_value || 10,
    minOrderValue: coupon?.min_order_value || 0,
    maxDiscount: coupon?.max_discount || '',
    usageLimit: coupon?.usage_limit || '',
    validFrom: coupon?.valid_from ? coupon.valid_from.split('T')[0] : '',
    validUntil: coupon?.valid_until ? coupon.valid_until.split('T')[0] : '',
    isActive: coupon?.is_active !== undefined ? coupon.is_active : true,
    description: coupon?.description || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function generateCouponCode(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: val
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.code.trim()) newErrors.code = 'Coupon code is required';
    if (formData.discountValue <= 0) newErrors.discountValue = 'Discount value must be greater than 0';
    if (formData.minOrderValue < 0) newErrors.minOrderValue = 'Minimum order value cannot be negative';
    if (formData.maxDiscount && Number(formData.maxDiscount) <= 0) newErrors.maxDiscount = 'Maximum discount must be greater than 0';
    if (formData.usageLimit && Number(formData.usageLimit) <= 0) newErrors.usageLimit = 'Usage limit must be greater than 0';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      id: coupon?.id,
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null
    });
  };

  const regenerateCode = () => {
    setFormData(prev => ({
      ...prev,
      code: generateCouponCode()
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Coupon Code</label>
        <div className="flex gap-2">
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className={`flex-1 px-4 py-3 bg-gray-800 border ${errors.code ? 'border-red-500' : 'border-gray-700'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500`}
            placeholder="Enter coupon code"
          />
          <Button
            type="button"
            variant="ghost"
            className="bg-gray-700 hover:bg-gray-600 text-white"
            onClick={regenerateCode}
          >
            Generate
          </Button>
        </div>
        {errors.code && <p className="mt-1 text-sm text-red-400">{errors.code}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Discount Type</label>
          <select
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
          >
            <option value="percentage" className="bg-gray-800">Percentage</option>
            <option value="fixed" className="bg-gray-800">Fixed Amount</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Discount Value ({formData.discountType === 'percentage' ? '%' : '₹'})
          </label>
          <input
            type="number"
            name="discountValue"
            value={formData.discountValue}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`w-full px-4 py-3 bg-gray-800 border ${errors.discountValue ? 'border-red-500' : 'border-gray-700'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500`}
            placeholder="Enter discount value"
          />
          {errors.discountValue && <p className="mt-1 text-sm text-red-400">{errors.discountValue}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500"
          placeholder="Enter coupon description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Order Value (₹)</label>
          <input
            type="number"
            name="minOrderValue"
            value={formData.minOrderValue}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`w-full px-4 py-3 bg-gray-800 border ${errors.minOrderValue ? 'border-red-500' : 'border-gray-700'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500`}
            placeholder="0"
          />
          {errors.minOrderValue && <p className="mt-1 text-sm text-red-400">{errors.minOrderValue}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Maximum Discount (₹) {formData.discountType === 'percentage' ? '(optional)' : ''}
          </label>
          <input
            type="number"
            name="maxDiscount"
            value={formData.maxDiscount}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`w-full px-4 py-3 bg-gray-800 border ${errors.maxDiscount ? 'border-red-500' : 'border-gray-700'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500`}
            placeholder="No limit"
          />
          {errors.maxDiscount && <p className="mt-1 text-sm text-red-400">{errors.maxDiscount}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Usage Limit</label>
          <input
            type="number"
            name="usageLimit"
            value={formData.usageLimit}
            onChange={handleChange}
            min="1"
            className={`w-full px-4 py-3 bg-gray-800 border ${errors.usageLimit ? 'border-red-500' : 'border-gray-700'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500`}
            placeholder="Unlimited"
          />
          {errors.usageLimit && <p className="mt-1 text-sm text-red-400">{errors.usageLimit}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500 bg-gray-800 border-gray-700"
            />
            <label className="ml-2 text-gray-300">Active</label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Valid From</label>
          <input
            type="date"
            name="validFrom"
            value={formData.validFrom}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Valid Until</label>
          <input
            type="date"
            name="validUntil"
            value={formData.validUntil}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          className="text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800 rounded-lg"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          {coupon ? 'Update Coupon' : 'Create Coupon'}
        </Button>
      </div>
    </form>
  );
}

// Customers Management Component
function CustomersManagement() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // Notification state
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (err: any) {
      console.error('Error fetching customers:', err);
      setError(err.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleViewCustomer = (customerId: number) => {
    setNotification({ message: `View customer details for customer #${customerId} would open here`, type: 'info' });
    setTimeout(() => setNotification(null), 3000);
    // In a full implementation, this would open a modal or navigate to a customer details page
  };
  const handleBanCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setIsBanModalOpen(true);
  };

  const confirmBanCustomer = async () => {
    if (!selectedCustomer) return;

    try {
      // In a real implementation, you would update a 'banned' field in the database
      // For now, we'll just show an alert
      setNotification({ message: `Customer ${selectedCustomer.email} has been banned!`, type: 'success' });
      setTimeout(() => setNotification(null), 3000);

      // Update local state to show banned status
      setCustomers(customers.map(customer =>
        customer.id === selectedCustomer.id ? { ...customer, banned: true } : customer
      ));

      setIsBanModalOpen(false);
      setSelectedCustomer(null);
    } catch (err: any) {
      console.error('Error banning customer:', err);
      setNotification({ message: 'Failed to ban customer: ' + err.message, type: 'error' });
      setTimeout(() => setNotification(null), 5000);
    }
  };
  useEffect(() => {
    fetchCustomers();

    // Set up real-time subscription for customers
    const subscription = supabase
      .channel('customers-management')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'users',
        },
        (payload) => {
          console.log('New customer registered!', payload);
          fetchCustomers();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
        },
        (payload) => {
          console.log('Customer updated!', payload);
          fetchCustomers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  if (loading) return <div className="text-[#2C3E50]">Loading customers...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Ban Confirmation Modal */}
      <Modal
        isOpen={isBanModalOpen}
        onClose={() => {
          setIsBanModalOpen(false);
          setSelectedCustomer(null);
        }}
        title="Confirm Ban Customer"
      >
        {selectedCustomer && (
          <ConfirmationModal
            title="Ban Customer"
            message={`Are you sure you want to ban ${selectedCustomer.email}? This action will prevent this user from accessing their account.`}
            confirmText="Ban Customer"
            cancelText="Cancel"
            onConfirm={confirmBanCustomer}
            onCancel={() => {
              setIsBanModalOpen(false);
              setSelectedCustomer(null);
            }}
          />
        )}
      </Modal>

      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-2xl p-1 shadow-2xl border border-gray-700">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-2">
                Customers Management
              </h2>
              <p className="text-gray-400">Manage your premium customer base</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500 w-full md:w-64"
                />
              </div>
              <Button className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap shadow-lg hover:shadow-yellow-500/30"
                onClick={() => {
                  // In a real implementation, this would export the customers data
                  setNotification({ message: 'Exporting VIP customers list... This would generate a detailed report of all customers in CSV/Excel format.', type: 'info' });
                  setTimeout(() => setNotification(null), 3000);
                }}
              >
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Export VIP List</span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-800/50 transition-all duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg border-2 border-yellow-400/30">
                          <span className="text-black font-bold text-lg">
                            {customer.email?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-white">
                          {customer.full_name || 'Unnamed Customer'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-yellow-400">
                    {customer.order_count || 0} orders
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.banned ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900/50 text-red-400 border border-red-800/50">
                        <span className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
                          Banned
                        </span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/50 text-green-400 border border-green-800/50">
                        <span className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                          Active
                        </span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 border border-blue-800/30 rounded-lg transition-all duration-200"
                      onClick={() => handleViewCustomer(customer.id)}
                    >
                      View
                    </Button>
                    {!customer.banned && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/30 border border-red-800/30 rounded-lg transition-all duration-200"
                        onClick={() => handleBanCustomer(customer)}
                      >
                        Ban
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Analytics Component
function AnalyticsDashboard() {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Notification state
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Fetch sales data grouped by date
      const { data, error } = await supabase
        .from('orders')
        .select('created_at, total_amount')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setSalesData(data || []);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    // Set up real-time subscription for analytics
    const subscription = supabase
      .channel('analytics-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('New order for analytics!', payload);
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  if (loading) return <div className="text-[#2C3E50]">Loading analytics...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-8">
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-2xl p-1 shadow-2xl border border-gray-700">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-2">
                Analytics Dashboard
              </h2>
              <p className="text-gray-400">Premium insights into your business performance</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white">
                <option className="bg-gray-800">Last 7 Days</option>
                <option className="bg-gray-800">Last 30 Days</option>
                <option className="bg-gray-800">Last 90 Days</option>
              </select>
              <Button className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
                <span className="flex items-center">
                  <span>Export Luxury Report</span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 shadow-2xl border border-indigo-500/30 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Sales Overview</h3>
            <div className="bg-indigo-500/20 rounded-lg w-10 h-10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-indigo-300" />
            </div>
          </div>
          <div className="h-64 flex items-center justify-center rounded-xl bg-black/20 border border-indigo-500/20">
            <div className="text-center">
              <div className="inline-block bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full p-3 mb-3">
                <BarChart3 className="w-8 h-8 text-black" />
              </div>
              <p className="text-indigo-200 font-medium">Interactive sales chart</p>
              <p className="text-indigo-400 text-sm mt-1">Premium visualization would appear here</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl p-6 shadow-2xl border border-cyan-500/30 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Top Products</h3>
            <div className="bg-cyan-500/20 rounded-lg w-10 h-10 flex items-center justify-center">
              <Package className="w-5 h-5 text-cyan-300" />
            </div>
          </div>
          <div className="h-64 flex items-center justify-center rounded-xl bg-black/20 border border-cyan-500/20">
            <div className="text-center">
              <div className="inline-block bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full p-3 mb-3">
                <Package className="w-8 h-8 text-black" />
              </div>
              <p className="text-cyan-200 font-medium">Top selling products</p>
              <p className="text-cyan-400 text-sm mt-1">Premium analytics would appear here</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Recent Sales Data</h3>
            <p className="text-gray-400 text-sm">Latest transaction records</p>
          </div>
          <Button variant="ghost" className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/30 border border-yellow-800/30 rounded-lg">
            View All Transactions
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {salesData.slice(-10).map((sale, index) => (
                <tr key={index} className="hover:bg-gray-800/50 transition-all duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(sale.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    #{sale.id || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-yellow-400">
                    ₹{sale.total_amount?.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Marketing Tools Component
function MarketingTools() {
  // Notification state
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const handleCreateCampaign = () => {
    setNotification({ message: 'Email campaign creation form would open here', type: 'info' });
    setTimeout(() => setNotification(null), 3000);
    // In a full implementation, this would open a modal or navigate to a campaign creation page
  };

  const handleCreateDiscount = () => {
    setNotification({ message: 'Discount code creation form would open here', type: 'info' });
    setTimeout(() => setNotification(null), 3000);
    // In a full implementation, this would open a modal or navigate to a discount creation page
  };

  const handleSchedulePost = () => {
    setNotification({ message: 'Social media post scheduling form would open here', type: 'info' });
    setTimeout(() => setNotification(null), 3000);
    // In a full implementation, this would open a modal or navigate to a post scheduling page
  };

  return (
    <div className="space-y-8">
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-2xl p-1 shadow-2xl border border-gray-700">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-2">
                Marketing Tools
              </h2>
              <p className="text-gray-400">Premium marketing automation suite</p>
            </div>
            <Button className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
              <span className="flex items-center">
                <span>View Luxury Reports</span>
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 shadow-2xl border border-purple-500/30 text-white hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-1">
          <div className="bg-purple-500/20 rounded-xl w-14 h-14 flex items-center justify-center mb-4">
            <Megaphone className="w-7 h-7 text-purple-300" />
          </div>
          <h3 className="text-xl font-bold mb-2">Email Campaigns</h3>
          <p className="text-purple-200 mb-4">Create and manage premium email marketing campaigns</p>
          <Button
            className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold hover:from-yellow-400 hover:to-amber-400 transition-all duration-300 transform hover:scale-105"
            onClick={handleCreateCampaign}
          >
            Create Campaign
          </Button>
        </div>

        <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl p-6 shadow-2xl border border-amber-500/30 text-white hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1">
          <div className="bg-amber-500/20 rounded-xl w-14 h-14 flex items-center justify-center mb-4">
            <BarChart3 className="w-7 h-7 text-amber-300" />
          </div>
          <h3 className="text-xl font-bold mb-2">Discount Codes</h3>
          <p className="text-amber-200 mb-4">Generate and track exclusive discount codes</p>
          <Button
            className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold hover:from-yellow-400 hover:to-amber-400 transition-all duration-300 transform hover:scale-105"
            onClick={handleCreateDiscount}
          >
            Create Discount
          </Button>
        </div>

        <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl p-6 shadow-2xl border border-cyan-500/30 text-white hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-1">
          <div className="bg-cyan-500/20 rounded-xl w-14 h-14 flex items-center justify-center mb-4">
            <Users className="w-7 h-7 text-cyan-300" />
          </div>
          <h3 className="text-xl font-bold mb-2">Social Media</h3>
          <p className="text-cyan-200 mb-4">Manage premium social media posts and promotions</p>
          <Button
            className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold hover:from-yellow-400 hover:to-amber-400 transition-all duration-300 transform hover:scale-105"
            onClick={handleSchedulePost}
          >
            Schedule Post
          </Button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Marketing Performance</h3>
            <p className="text-gray-400 text-sm">Real-time campaign metrics</p>
          </div>
          <Button variant="ghost" className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/30 border border-yellow-800/30 rounded-lg">
            Detailed Analytics
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-purple-500/30 transition-all duration-300">
            <p className="text-gray-400 mb-1">Email Open Rate</p>
            <p className="text-3xl font-bold text-white">42.8%</p>
            <p className="text-sm text-green-400 mt-1 flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
              ↑ 5.2% from last month
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-amber-500/30 transition-all duration-300">
            <p className="text-gray-400 mb-1">Click Through Rate</p>
            <p className="text-3xl font-bold text-white">18.3%</p>
            <p className="text-sm text-green-400 mt-1 flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
              ↑ 2.1% from last month
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-cyan-500/30 transition-all duration-300">
            <p className="text-gray-400 mb-1">Conversion Rate</p>
            <p className="text-3xl font-bold text-white">3.7%</p>
            <p className="text-sm text-red-400 mt-1 flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
              ↓ 0.4% from last month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings Component
function SettingsPage() {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const handleSaveSettings = () => {
    setNotification({ message: 'Settings saved successfully!', type: 'success' });
    setTimeout(() => setNotification(null), 3000);
    // In a full implementation, this would save the settings to the database
  };

  const handleAddAdmin = (email: string) => {
    // In a full implementation, this would send an invitation email and add to admin database
    setNotification({ message: `Invitation sent to ${email} to become an admin! In a real implementation, this would send an invitation email and add the user to the admin database.`, type: 'success' });
    setTimeout(() => setNotification(null), 3000);
    setIsAdminModalOpen(false);
  };
  return (
    <div className="space-y-8">
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Add Admin Modal */}
      <Modal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        title="Add New Admin"
      >
        <AddAdminForm
          onSubmit={handleAddAdmin}
          onCancel={() => setIsAdminModalOpen(false)}
        />
      </Modal>

      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-2xl p-1 shadow-2xl border border-gray-700">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-2">
                Settings
              </h2>
              <p className="text-gray-400">Configure your premium admin experience</p>
            </div>
            <Button
              className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap shadow-lg hover:shadow-yellow-500/30"
              onClick={() => {
                setNotification({ message: 'Settings saved successfully! In a real implementation, this would save all settings to the database.', type: 'success' });
                setTimeout(() => setNotification(null), 3000);
              }}
            >
              <span className="flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                <span>Save Premium Settings</span>
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <span className="bg-yellow-500/20 p-2 rounded-lg mr-3">
              <ShoppingCart className="w-5 h-5 text-yellow-400" />
            </span>
            Store Settings
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Store Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500"
                defaultValue="Anime Merch Store"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
              <select className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white">
                <option className="bg-gray-800">INR (₹)</option>
                <option className="bg-gray-800">USD ($)</option>
                <option className="bg-gray-800">EUR (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tax Rate (%)</label>
              <input
                type="number"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500"
                defaultValue="18"
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <span className="bg-green-500/20 p-2 rounded-lg mr-3">
              <ShoppingCart className="w-5 h-5 text-green-400" />
            </span>
            Payment Settings
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Payment Methods</label>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input type="checkbox" id="credit-card" className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500 bg-gray-800 border-gray-700" defaultChecked />
                  <label htmlFor="credit-card" className="ml-3 text-gray-300">Credit/Debit Cards</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="upi" className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500 bg-gray-800 border-gray-700" defaultChecked />
                  <label htmlFor="upi" className="ml-3 text-gray-300">UPI</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="paypal" className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500 bg-gray-800 border-gray-700" />
                  <label htmlFor="paypal" className="ml-3 text-gray-300">PayPal</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center">
            <span className="bg-blue-500/20 p-2 rounded-lg mr-3">
              <User className="w-5 h-5 text-blue-400" />
            </span>
            Admin Accounts
          </h3>
          <Button
            className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/30"
            onClick={() => setIsAdminModalOpen(true)}
          >
            <span className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>Add New Admin</span>
            </span>
          </Button>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-400/30">
                <User className="w-6 h-6 text-black" />
              </div>
              <div className="ml-4">
                <p className="font-bold text-white">Admin User</p>
                <p className="text-sm text-gray-400">admin@example.com</p>
              </div>
            </div>
            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/50 text-green-400 border border-green-800/50">
              <span className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                Active
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/customers', label: 'Customers', icon: Users },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/marketing', label: 'Marketing', icon: Megaphone },
    { path: '/admin/coupons', label: 'Coupons', icon: Ticket },
    { path: '/admin/site-settings', label: 'Site Settings', icon: Settings },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-b from-gray-900 via-black to-gray-900 min-h-screen p-6 shadow-2xl border-r border-gray-800">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center shadow-xl border-2 border-yellow-400/30">
                <Crown className="text-black font-bold text-xl w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">Merch</span>
                <span className="text-xl font-bold text-white">Admin</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm flex items-center">
              <Star className="w-3 h-3 text-yellow-500 mr-1" />
              Premium Dashboard
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start mb-1 transition-all duration-300 ${isActive
                      ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-black font-bold shadow-lg'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800'
                      }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-800 shadow-lg">
              <p className="text-gray-300 text-sm flex items-center">
                <span className="bg-blue-500/20 p-1 rounded mr-2">
                  <Bell className="w-3 h-3 text-blue-400" />
                </span>
                Need help?
              </p>
              <p className="text-gray-500 text-xs mt-1">Contact support team</p>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3 text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800 rounded-lg transition-all duration-300"
                onClick={() => {
                  const message = "Hello, I need help with the MythManga Admin Dashboard.";
                  const whatsappUrl = `https://wa.me/918826817677?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
              >
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Get Support
                </span>
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/products" element={<ProductsManagement />} />
            <Route path="/orders" element={<OrdersManagement />} />
            <Route path="/customers" element={<CustomersManagement />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/marketing" element={<MarketingTools />} />
            <Route path="/coupons" element={<CouponsManagement />} />
            <Route path="/site-settings" element={<SiteSettingsForm />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}