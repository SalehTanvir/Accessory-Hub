import React, { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight, FiZap, FiShoppingBag, FiShield, FiStar } from "react-icons/fi";

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
    } catch (err) {
      console.error(err);
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-60px)] bg-[#0a0b0f] text-slate-100">

      <div className="relative hidden flex-1 overflow-hidden bg-[linear-gradient(145deg,#0f0a2e_0%,#0a1628_50%,#051a12_100%)] px-10 py-12 lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl" />

        <div className="relative z-10 mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-emerald-400">
            <FiZap size={22} color="#fff" />
          </div>
          <span className="bg-gradient-to-r from-violet-300 to-emerald-300 bg-clip-text text-2xl font-extrabold text-transparent">
            AccessoryHub
          </span>
        </div>

        <h2 className="relative z-10 text-center text-3xl font-extrabold text-white">
          Welcome back!
        </h2>
        <p className="relative z-10 mt-3 max-w-sm text-center text-sm leading-7 text-slate-400">
          Sign in to discover thousands of premium accessories from trusted vendors.
        </p>

        <div className="relative z-10 mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon:<FiShoppingBag size={18}/>, value:"10k+", label:"Products" },
            { icon:<FiStar size={18}/>,        value:"500+", label:"Vendors" },
            { icon:<FiShield size={18}/>,      value:"100%", label:"Secure" },
          ].map((s,i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center backdrop-blur">
              <div className="mb-2 text-violet-300">{s.icon}</div>
              <div className="text-lg font-extrabold text-white">{s.value}</div>
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleLogin} className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur sm:p-8">
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-extrabold text-slate-100">
              Sign In
            </h2>
            <p className="text-sm leading-7 text-slate-400">
              Enter your credentials to access your account
            </p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              <FiMail size={13} /> Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
            />
          </div>

          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                <FiLock size={13} /> Password
              </label>
              <button type="button" className="text-xs font-semibold text-violet-300 transition hover:text-violet-200">
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-violet-700 px-5 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Signing in...
              </>
            ) : (
              <>Sign In <FiArrowRight size={16} /></>
            )}
          </button>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">New here?</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <Link to="/register" className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-violet-500 hover:text-violet-200">
            Create a free account
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;