import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './hooks/useAuth';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/shared/ProtectedRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import ForFarmers from './pages/solutions/ForFarmers';
import ForConsumers from './pages/solutions/ForConsumers';
import SupplyChain from './pages/solutions/SupplyChain';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { FarmerDashboard, ManageProducts, FarmerOrders, FarmerGuidelines } from './pages/farmer';
import {
  Marketplace,
  ProductDetail,
  BuyerDashboard,
  BuyerOrders,
  Cart,
  TermsAndConditions,
} from './pages/buyer';
import { Profile } from './pages/Profile';
import {
  AdminDashboard,
  AdminVerifications,
  AdminUsers,
  AdminOrders,
  AdminBroadcast,
  AdminGlobalProducts,
} from './pages/admin';

function App() {
  const { initialize, isAuthenticated, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Check if current route is a dashboard route
  const isDashboardRoute =
    location.pathname.startsWith('/farmer/') ||
    location.pathname.startsWith('/buyer/') ||
    location.pathname.startsWith('/admin/') ||
    location.pathname === '/profile';

  // Show loading screen while initializing
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1">
        {isAuthenticated && isDashboardRoute && (
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        )}

        <main className={`flex-1 ${isAuthenticated && isDashboardRoute ? 'lg:ml-64' : ''}`}>
          <div className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/solutions/farmers" element={<ForFarmers />} />
              <Route path="/solutions/consumers" element={<ForConsumers />} />
              <Route path="/solutions/supply-chain" element={<SupplyChain />} />
              <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
              <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/" /> : <Register />}
              />

              {/* Profile Route - All authenticated users */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['farmer', 'buyer', 'admin']}>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Farmer Routes */}
              <Route
                path="/farmer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['farmer']}>
                    <FarmerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/products"
                element={
                  <ProtectedRoute allowedRoles={['farmer']}>
                    <ManageProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/orders"
                element={
                  <ProtectedRoute allowedRoles={['farmer']}>
                    <FarmerOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/guidelines"
                element={
                  <ProtectedRoute allowedRoles={['farmer']}>
                    <FarmerGuidelines />
                  </ProtectedRoute>
                }
              />

              {/* Buyer Routes */}
              <Route
                path="/buyer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['buyer']}>
                    <BuyerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/marketplace"
                element={
                  <ProtectedRoute allowedRoles={['buyer']}>
                    <Marketplace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/product/:id"
                element={
                  <ProtectedRoute allowedRoles={['buyer']}>
                    <ProductDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/cart"
                element={
                  <ProtectedRoute allowedRoles={['buyer']}>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/orders"
                element={
                  <ProtectedRoute allowedRoles={['buyer']}>
                    <BuyerOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/terms"
                element={
                  <ProtectedRoute allowedRoles={['buyer']}>
                    <TermsAndConditions />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/panel"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/verifications"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminVerifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/broadcast"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminBroadcast />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminGlobalProducts />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>

      {!isDashboardRoute && <Footer />}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
