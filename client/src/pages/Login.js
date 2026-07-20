import React, { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  FiLogIn, FiMail, FiLock, FiZap,
  FiShoppingCart, FiStar, FiShield,
} from "react-icons/fi";

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  const { login }  = useContext(AuthContext);
  const navigate   = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const highlights = [
    "Track all your orders in real-time",
    "Exclusive deals from top vendors",
    "Safe checkout & buyer protection",
  ];

  return (
    <div className="flex min-h-[calc(100vh-60px)] bg-slate-950 text-slate-100">

      {/* ── LEFT BRAND PANEL ── */}
      <div className="relative hidden flex-1 overflow-hidden px-10 py-12 lg:flex lg:flex-col lg:items-center lg:justify-center bg-[linear-gradient(145deg,#0f172a_0%,#172554_50%,#111827_100%)]">

        {/* Ambient glow blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-[26rem] w-[26rem] rounded-full bg-sky-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-amber-400/15 blur-3xl" />

        {/* Logo */}
        <div className="relative z-10 mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-amber-400">
            <FiZap size={22} color="#fff" />
          </div>
          <span className="bg-gradient-to-r from-sky-300 to-amber-300 bg-clip-text text-2xl font-extrabold text-transparent">
            AccessoryHub
          </span>
        </div>

        <h2 className="relative z-10 text-center text-3xl font-extrabold text-white">
          Welcome Back
        </h2>
        <p className="relative z-10 mt-3 max-w-sm text-center text-sm leading-7 text-slate-400">
          Sign in to continue tracking orders, managing your cart, and
          discovering the latest accessories.
        </p>

        {/* Perk cards */}
        <div className="relative z-10 mt-8 flex w-full max-w-sm flex-col gap-3">
          {highlights.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-500/20 text-sky-300">
                <FiShoppingCart size={14} />
              </div>
              <p className="text-sm leading-6 text-slate-300">{item}</p>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="relative z-10 mt-8 flex gap-3">
          <div className="flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/15 px-3 py-2 text-[0.78rem] font-semibold text-sky-300">
            <FiStar size={11} /> 4.9 Rated
          </div>
          <div className="flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-[0.78rem] font-semibold text-amber-300">
            <FiShield size={11} /> SSL Secured
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur sm:p-8"
        >
          {/* Header */}
          <div className="mb-7">
            <h2 className="mb-2 text-3xl font-extrabold text-slate-100">Sign In</h2>
            <p className="text-sm leading-7 text-slate-400">
              Enter your credentials to access your account.
            </p>
          </div>

          {/* Fields */}
          <div className="space-y-5">

            {/* Email */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                <FiMail size={13} /> Email Address
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  <FiLock size={13} /> Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-amber-400 transition hover:text-amber-300"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            id="login-submit-btn"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/30 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Signing in...
              </>
            ) : (
              <>
                <FiLogIn size={16} /> Sign In
              </>
            )}
          </button>

          {/* Footer link */}
          <div className="mt-6 border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-amber-300 transition hover:text-amber-200"
              >
                Create one now
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;