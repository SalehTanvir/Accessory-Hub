import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiHome, FiShoppingCart, FiPackage, FiTrendingUp, FiLogOut, FiLogIn, FiUserPlus } from "react-icons/fi";

function Navbar() {

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>
      {/* LOGO & BRAND */}
      <div>
        <Link to="/" style={{ 
          fontSize: "1.75rem", 
          fontWeight: "bold", 
          marginRight: "3rem",
          background: "linear-gradient(135deg, #a78bfa, #ec4899)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <FiShoppingCart size={28} /> AccessoryHub
        </Link>
        
        <Link to="/" title="Home" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FiHome size={18} /> Home
        </Link>
        <Link to="/cart" title="Shopping Cart" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FiShoppingCart size={18} /> Cart
        </Link>

        {user && (
          <>
            <Link to="/my-orders" title="My Orders" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiPackage size={18} /> Orders
            </Link>
            <Link to="/vendor" title="Vendor Dashboard" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiTrendingUp size={18} /> Vendor
            </Link>
          </>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="navbar-right">
        {user ? (
          <>
            <span style={{ fontSize: "1rem", fontWeight: 500 }}>
              Welcome, {user.name?.split(" ")[0] || "User"}
            </span>

            <button onClick={handleLogout} className="logout-btn" title="Logout" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiLogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" title="Login" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiLogIn size={18} /> Login
            </Link>
            <Link to="/register" title="Create Account" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiUserPlus size={18} /> Register
            </Link>
          </>
        )}
      </div>

    </nav>
  );
}

export default Navbar;