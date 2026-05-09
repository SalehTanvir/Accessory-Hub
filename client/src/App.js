import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import VendorDashboard from "./pages/VendorDashboard";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import VendorRoute from "./components/VendorRoute";

function App() {
  return (
    <Router>

      <Navbar />

      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes — any logged-in user */}
        <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/my-orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />

        {/* Vendor-only Route */}
        <Route path="/vendor" element={<VendorRoute><VendorDashboard /></VendorRoute>} />

      </Routes>

    </Router>
  );
}

export default App;