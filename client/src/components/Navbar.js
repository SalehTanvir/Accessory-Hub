import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiShoppingCart, FiPackage, FiTrendingUp, FiLogOut, FiLogIn, FiUserPlus, FiMenu, FiX, FiUser, FiZap } from "react-icons/fi";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (path) => ({
    display: "flex", alignItems: "center", gap: "0.4rem",
    color: isActive(path) ? "#a855f7" : undefined,
    background: isActive(path) ? "rgba(124,58,237,0.1)" : undefined,
  });

  return (
    <nav>
      <div>
        <Link to="/" style={{
          fontSize: "1.5rem", fontWeight: "800", marginRight: "1.5rem",
          background: "linear-gradient(135deg, #a855f7, #06d6a0)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text", display: "flex", alignItems: "center", gap: "0.5rem"
        }}>
          <FiZap size={24} style={{color: "#a855f7", WebkitTextFillColor: "initial"}} /> AccessoryHub
        </Link>

        <Link to="/" style={navLinkStyle("/")} title="Home">
          <FiShoppingCart size={17} /> Shop
        </Link>
        <Link to="/cart" style={navLinkStyle("/cart")} title="Cart">
          <FiShoppingCart size={17} /> Cart
        </Link>

        {user && (
          <>
            <Link to="/my-orders" style={navLinkStyle("/my-orders")} title="Orders">
              <FiPackage size={17} /> Orders
            </Link>
            <Link to="/vendor" style={navLinkStyle("/vendor")} title="Vendor">
              <FiTrendingUp size={17} /> Vendor
            </Link>
          </>
        )}
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <span style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              background: "rgba(6,214,160,0.1)", padding: "0.35rem 0.75rem",
              borderRadius: "20px", border: "1px solid rgba(6,214,160,0.2)"
            }}>
              <FiUser size={14} /> {user.name?.split(" ")[0] || "User"}
            </span>
            <button onClick={handleLogout} className="logout-btn" title="Logout"
              style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <FiLogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              ...navLinkStyle("/login"),
              background: "rgba(124,58,237,0.1)", padding: "0.4rem 0.85rem",
              borderRadius: "8px", border: "1px solid rgba(124,58,237,0.2)"
            }}>
              <FiLogIn size={16} /> Login
            </Link>
            <Link to="/register" style={{
              ...navLinkStyle("/register"),
              background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
              color: "#fff", padding: "0.4rem 0.85rem", borderRadius: "8px"
            }}>
              <FiUserPlus size={16} /> Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;