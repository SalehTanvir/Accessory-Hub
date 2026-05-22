import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FiShoppingCart, FiPackage, FiTrendingUp,
  FiLogOut, FiLogIn, FiUserPlus, FiUser, FiZap, FiActivity,
} from "react-icons/fi";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-[rgba(10,11,15,0.85)] backdrop-blur-sm border-b border-white/6 px-4 py-3">
      {/* LOGO + LEFT LINKS */}
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center justify-between gap-4">
          {/* LEFT SIDE */}
          <div className="flex items-center gap-2">
            <Link to="/" className="mr-4 inline-flex items-center gap-2 text-2xl font-extrabold bg-gradient-to-r from-violet-400 to-emerald-300 bg-clip-text text-transparent">
              <FiZap size={22} className="text-violet-400" />
              AccessoryHub
            </Link>

            <Link to="/" className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive('/') ? 'text-violet-300 bg-violet-500/10' : 'text-slate-300 hover:text-violet-300 hover:bg-white/2'}`}>
              <FiShoppingCart size={16} /> Shop
            </Link>

            <Link to="/cart" className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive('/cart') ? 'text-violet-300 bg-violet-500/10' : 'text-slate-300 hover:text-violet-300 hover:bg-white/2'}`}>
              <FiShoppingCart size={16} /> Cart
            </Link>

            {user && (
              <Link to="/my-orders" className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive('/my-orders') ? 'text-violet-300 bg-violet-500/10' : 'text-slate-300 hover:text-violet-300 hover:bg-white/2'}`}>
                <FiPackage size={16} /> Orders
              </Link>
            )}

            {user?.role === 'vendor' && (
              <Link to="/vendor" className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition border ${isActive('/vendor') ? 'border-emerald-300 bg-emerald-300/10 text-emerald-300' : 'border-emerald-600/20 text-emerald-300 hover:bg-emerald-300/6'}`}>
                <FiTrendingUp size={16} /> Vendor
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link to="/admin" className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition border ${isActive('/admin') ? 'border-violet-300 bg-violet-500/10 text-violet-300' : 'border-violet-600/20 text-violet-300 hover:bg-violet-300/6'}`}>
                <FiActivity size={16} /> Admin
              </Link>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {user ? (
            <>
              {/* User badge — shows role */}
              <div className={`flex items-center gap-3 rounded-full px-3 py-2 text-sm font-semibold ${user.role === 'vendor' ? 'bg-emerald-400/10 text-emerald-300 border border-emerald-300/20' : 'bg-violet-500/8 text-violet-300 border border-violet-300/20'}`}>
                <FiUser size={16} />
                <span className="truncate">{user.name?.split(' ')[0] || 'User'}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-bold uppercase ${user.role === 'vendor' ? 'bg-emerald-300/10 text-emerald-300' : 'bg-violet-300/10 text-violet-300'}`}>{user.role}</span>
              </div>

              <button onClick={handleLogout} className="ml-2 inline-flex items-center gap-2 rounded-lg bg-red-600/10 px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-600/20">
                <FiLogOut size={15} /> Logout
              </button>
            </>
            ) : (
            <>
              <Link to="/register?role=vendor" className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-400/15">
                <FiTrendingUp size={15} /> Become a seller
              </Link>

              <Link to="/login" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:text-violet-300 hover:bg-white/2">
                <FiLogIn size={15} /> Login
              </Link>
              <Link to="/register" className="ml-2 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-700 px-4 py-2 text-sm font-semibold text-white">
                <FiUserPlus size={15} /> Register
              </Link>
            </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;