import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./components/home";
import { CouponProvider } from "./contexts/CouponContext";
import AnnouncementBar from "./components/AnnouncementBar";
import { SiteSettingsProvider } from "./contexts/SiteSettingsContext";
import ThemeProvider from "./components/ThemeProvider";
import { MaintenanceProvider, useMaintenance, MaintenancePage } from "./contexts/MaintenanceContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LiveSalesNotification from "./components/LiveSalesNotification";
import WhatsAppSupport from "./components/WhatsAppSupport";

// Lazy load pages
const CatalogPage = lazy(() => import("./pages/CatalogPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ShippingPage = lazy(() => import("./pages/ShippingPage"));
const ReturnsPage = lazy(() => import("./pages/ReturnsPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));

function AppContent() {
  const { isMaintenanceMode } = useMaintenance();
  const { user } = useAuth();
  
  // Show maintenance page if maintenance mode is on and user is not admin
  if (isMaintenanceMode && (!user || user.role !== 'admin')) {
    return <MaintenancePage />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 pt-0">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#F5C842] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#2C3E50]">Loading...</p>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog/:category" element={<CatalogPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      
      {/* Global Components */}
      <LiveSalesNotification />
      <WhatsAppSupport />
    </div>
  );
}

function App() {
  return (
    <SiteSettingsProvider>
      <CouponProvider>
        <AuthProvider>
          <MaintenanceProvider>
            <ThemeProvider>
              <AppContent />
            </ThemeProvider>
          </MaintenanceProvider>
        </AuthProvider>
      </CouponProvider>
    </SiteSettingsProvider>
  );
}

export default App;