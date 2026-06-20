import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import VendorRoute from "./components/VendorRoute";
import AdminRoute from "./components/AdminRoute";

// Lazy load all page components for code splitting
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const VendorDashboard = lazy(() => import("./pages/VendorDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Vendors = lazy(() => import("./pages/Vendors"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFail = lazy(() => import("./pages/PaymentFail"));
const PaymentCancel = lazy(() => import("./pages/PaymentCancel"));

// Loading fallback component
const LoadingSpinner = () => (
  <div className="flex min-h-[calc(100vh-60px)] items-center justify-center bg-slate-950">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500" />
      <p className="text-sm font-medium text-slate-300">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Navbar />

      <Suspense fallback={<LoadingSpinner />}>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendors/:vendorId" element={<Vendors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes — any logged-in user */}
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/my-orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />

          {/* Payment Result Pages — public (redirected from SSLCommerz) */}
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/fail" element={<PaymentFail />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />

          {/* Vendor-only Route */}
          <Route path="/vendor" element={<VendorRoute><VendorDashboard /></VendorRoute>} />

          {/* Admin-only Route */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        </Routes>
      </Suspense>

      <Footer />

    </Router>
  );
}

export default App;