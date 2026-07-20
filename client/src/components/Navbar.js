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
    { to: "/vendors", label: "Shop", icon: FiShoppingCart, show: true, active: isActive("/") || isActive("/vendors") },
    { to: "/cart", label: "Cart", icon: FiShoppingCart, show: true, active: isActive("/cart") },
    { to: "/my-orders", label: "Orders", icon: FiPackage, show: Boolean(user), active: isActive("/my-orders") },
    { to: "/vendor", label: "Vendor", icon: FiTrendingUp, show: user?.role === "vendor", active: isActive("/vendor"), variant: "sky" },
    { to: "/admin", label: "Admin", icon: FiActivity, show: user?.role === "admin", active: isActive("/admin"), variant: "amber" },
  ].filter((link) => link.show);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/6 bg-[rgba(15,23,42,0.88)] px-4 py-3 backdrop-blur-sm">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            onClick={closeMenu}
            className="inline-flex items-center gap-2 text-xl font-extrabold text-transparent bg-gradient-to-r from-sky-300 via-amber-300 to-amber-400 bg-clip-text sm:text-2xl"
          >
            <FiZap size={22} className="text-amber-400" />
            AccessoryHub
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {navLinks.map(({ to, label, icon: Icon, active, variant }) => (
              <Link
                key={label}
                to={to}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? variant === "sky"
                      ? "border border-sky-300 bg-sky-300/10 text-sky-300"
                      : variant === "amber"
                        ? "border border-amber-300 bg-amber-300/10 text-amber-300"
                        : "text-amber-300 bg-amber-500/10"
                    : variant === "sky"
                      ? "border border-sky-600/20 text-sky-300 hover:bg-sky-300/6"
                      : variant === "amber"
                        ? "border border-amber-600/20 text-amber-300 hover:bg-amber-300/6"
                        : "text-slate-300 hover:bg-white/5 hover:text-amber-300"
                }`}
              >
                <Icon size={16} /> {label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <>
                <div className={`flex items-center gap-3 rounded-full px-3 py-2 text-sm font-semibold ${user.role === 'vendor' ? 'border border-sky-300/20 bg-sky-400/10 text-sky-300' : 'border border-amber-300/20 bg-amber-500/10 text-amber-300'}`}>
                  <FiUser size={16} />
                  <span className="truncate">{user.name?.split(' ')[0] || 'User'}</span>
                  <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-bold uppercase ${user.role === 'vendor' ? 'bg-sky-300/10 text-sky-300' : 'bg-amber-300/10 text-amber-300'}`}>{user.role}</span>
                </div>

                <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-lg bg-red-600/10 px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-600/20">
                  <FiLogOut size={15} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/register?role=vendor" className="flex items-center gap-2 rounded-lg border border-sky-400/20 bg-sky-400/10 px-3 py-2 text-sm font-semibold text-sky-300 transition hover:bg-sky-400/15 hover:border-sky-400/40">
                  <FiTrendingUp size={15} /> Become a Seller
                </Link>
                <Link to="/login" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-amber-300">
                  <FiLogIn size={15} /> Login
                </Link>
                <Link to="/register" className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-amber-500/20">
                  <FiUserPlus size={15} /> Register
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-amber-500/40 hover:bg-amber-500/10 lg:hidden"
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
                      ? variant === "sky"
                        ? "border border-sky-300 bg-sky-300/10 text-sky-300"
                        : variant === "amber"
                          ? "border border-amber-300 bg-amber-300/10 text-amber-300"
                          : "bg-amber-500/10 text-amber-300"
                      : variant === "sky"
                        ? "border border-sky-600/20 text-sky-300 hover:bg-sky-300/6"
                        : variant === "amber"
                          ? "border border-amber-600/20 text-amber-300 hover:bg-amber-300/6"
                          : "text-slate-200 hover:bg-white/5 hover:text-amber-300"
                  }`}
                >
                  <Icon size={16} /> {label}
                </Link>
              ))}
            </div>

            <div className="mt-4 border-t border-white/10 pt-4">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${user.role === 'vendor' ? 'border border-sky-300/20 bg-sky-400/10 text-sky-300' : 'border border-amber-300/20 bg-amber-500/10 text-amber-300'}`}>
                    <span className="inline-flex items-center gap-2"><FiUser size={16} /> {user.name?.split(' ')[0] || 'User'}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold uppercase ${user.role === 'vendor' ? 'bg-sky-300/10 text-sky-300' : 'bg-amber-300/10 text-amber-300'}`}>{user.role}</span>
                  </div>

                  <button onClick={handleLogout} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600/10 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-600/20">
                    <FiLogOut size={15} /> Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/register?role=vendor" onClick={closeMenu} className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-sm font-semibold text-sky-300 transition hover:bg-sky-400/15 hover:border-sky-400/40">
                    <FiTrendingUp size={15} /> Sell
                  </Link>
                  <Link to="/login" onClick={closeMenu} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-amber-300">
                    <FiLogIn size={15} /> Login
                  </Link>
                  <Link to="/register" onClick={closeMenu} className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-amber-500/20">
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