import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FiShoppingCart, FiPackage, FiTrendingUp,
  FiLogOut, FiLogIn, FiUserPlus, FiUser, FiZap, FiActivity, FiMenu, FiX,
} from "react-icons/fi";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    closeMenu();
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/", label: "Shop", icon: FiShoppingCart, show: true, active: isActive("/") },
    { to: "/cart", label: "Cart", icon: FiShoppingCart, show: true, active: isActive("/cart") },
    { to: "/my-orders", label: "Orders", icon: FiPackage, show: Boolean(user), active: isActive("/my-orders") },
    { to: "/vendor", label: "Vendor", icon: FiTrendingUp, show: user?.role === "vendor", active: isActive("/vendor"), variant: "emerald" },
    { to: "/admin", label: "Admin", icon: FiActivity, show: user?.role === "admin", active: isActive("/admin"), variant: "violet" },
  ].filter((link) => link.show);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/6 bg-[rgba(10,11,15,0.85)] px-4 py-3 backdrop-blur-sm">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            onClick={closeMenu}
            className="inline-flex items-center gap-2 text-xl font-extrabold text-transparent bg-gradient-to-r from-violet-400 to-emerald-300 bg-clip-text sm:text-2xl"
          >
            <FiZap size={22} className="text-violet-400" />
            AccessoryHub
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {navLinks.map(({ to, label, icon: Icon, active, variant }) => (
              <Link
                key={label}
                to={to}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? variant === "emerald"
                      ? "border border-emerald-300 bg-emerald-300/10 text-emerald-300"
                      : variant === "violet"
                        ? "border border-violet-300 bg-violet-500/10 text-violet-300"
                        : "text-violet-300 bg-violet-500/10"
                    : variant === "emerald"
                      ? "border border-emerald-600/20 text-emerald-300 hover:bg-emerald-300/6"
                      : variant === "violet"
                        ? "border border-violet-600/20 text-violet-300 hover:bg-violet-300/6"
                        : "text-slate-300 hover:bg-white/5 hover:text-violet-300"
                }`}
              >
                <Icon size={16} /> {label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <>
                <div className={`flex items-center gap-3 rounded-full px-3 py-2 text-sm font-semibold ${user.role === 'vendor' ? 'border border-emerald-300/20 bg-emerald-400/10 text-emerald-300' : 'border border-violet-300/20 bg-violet-500/8 text-violet-300'}`}>
                  <FiUser size={16} />
                  <span className="truncate">{user.name?.split(' ')[0] || 'User'}</span>
                  <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-bold uppercase ${user.role === 'vendor' ? 'bg-emerald-300/10 text-emerald-300' : 'bg-violet-300/10 text-violet-300'}`}>{user.role}</span>
                </div>

                <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-lg bg-red-600/10 px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-600/20">
                  <FiLogOut size={15} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-violet-300">
                  <FiLogIn size={15} /> Login
                </Link>
                <Link to="/register" className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-700 px-4 py-2 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-violet-500/20">
                  <FiUserPlus size={15} /> Register
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-violet-500/40 hover:bg-violet-500/10 lg:hidden"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        <div className={`overflow-hidden transition-all duration-300 lg:hidden ${mobileMenuOpen ? "mt-4 max-h-[32rem] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-2xl backdrop-blur">
            <div className="flex flex-col gap-2">
              {navLinks.map(({ to, label, icon: Icon, active, variant }) => (
                <Link
                  key={label}
                  to={to}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? variant === "emerald"
                        ? "border border-emerald-300 bg-emerald-300/10 text-emerald-300"
                        : variant === "violet"
                          ? "border border-violet-300 bg-violet-500/10 text-violet-300"
                          : "bg-violet-500/10 text-violet-300"
                      : variant === "emerald"
                        ? "border border-emerald-600/20 text-emerald-300 hover:bg-emerald-300/6"
                        : variant === "violet"
                          ? "border border-violet-600/20 text-violet-300 hover:bg-violet-300/6"
                          : "text-slate-200 hover:bg-white/5 hover:text-violet-300"
                  }`}
                >
                  <Icon size={16} /> {label}
                </Link>
              ))}
            </div>

            <div className="mt-4 border-t border-white/10 pt-4">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${user.role === 'vendor' ? 'border border-emerald-300/20 bg-emerald-400/10 text-emerald-300' : 'border border-violet-300/20 bg-violet-500/8 text-violet-300'}`}>
                    <span className="inline-flex items-center gap-2"><FiUser size={16} /> {user.name?.split(' ')[0] || 'User'}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold uppercase ${user.role === 'vendor' ? 'bg-emerald-300/10 text-emerald-300' : 'bg-violet-300/10 text-violet-300'}`}>{user.role}</span>
                  </div>

                  <button onClick={handleLogout} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600/10 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-600/20">
                    <FiLogOut size={15} /> Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/login" onClick={closeMenu} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-violet-300">
                    <FiLogIn size={15} /> Login
                  </Link>
                  <Link to="/register" onClick={closeMenu} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 px-4 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-violet-500/20">
                    <FiUserPlus size={15} /> Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}


export default Navbar;