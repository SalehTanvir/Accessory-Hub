import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiBriefcase,
  FiShoppingBag,
  FiArrowRight,
  FiZap,
  FiStar,
  FiShield,
  FiCheck
} from "react-icons/fi";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestedRole = params.get("role");

    if (requestedRole === "vendor") {
      setRole("vendor");
    }
  }, [location.search]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/register", { name, email, password, role });
      navigate("/login", { state: { successMessage: "Registered successfully. Please sign in." } });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPwStrength = (pw) => {
    if (!pw) return { score: 0, label: "", colorClass: "bg-transparent", textClass: "text-transparent" };
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 10) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;

    const map = [
      { label: "Too short", colorClass: "bg-red-500", textClass: "text-red-400" },
      { label: "Weak", colorClass: "bg-orange-500", textClass: "text-orange-400" },
      { label: "Fair", colorClass: "bg-amber-400", textClass: "text-amber-400" },
      { label: "Good", colorClass: "bg-lime-400", textClass: "text-lime-400" },
      { label: "Strong", colorClass: "bg-emerald-400", textClass: "text-emerald-400" },
      { label: "Very Strong", colorClass: "bg-emerald-400", textClass: "text-emerald-400" }
    ];

    return { score: s, ...map[s] };
  };

  const pw = getPwStrength(password);
  const vendorPerks = [
    "Zero listing fees to get started",
    "Reach 10,000+ active shoppers",
    "Real-time sales analytics dashboard"
  ];
  const shopperPerks = [
    "Exclusive deals from top vendors",
    "Free shipping on every order",
    "Safe checkout & buyer protection"
  ];
  const perks = role === "vendor" ? vendorPerks : shopperPerks;

  return (
    <div className="flex min-h-[calc(100vh-60px)] bg-[#0a0b0f] text-slate-100">
      <div className={`relative hidden flex-1 overflow-hidden px-10 py-12 lg:flex lg:flex-col lg:items-center lg:justify-center ${role === "vendor" ? "bg-[linear-gradient(145deg,#051a12_0%,#091f10_50%,#0a1628_100%)]" : "bg-[linear-gradient(145deg,#0f0a2e_0%,#0a1628_50%,#051a12_100%)]"}`}>
        <div className={`pointer-events-none absolute -right-24 -top-24 h-[26rem] w-[26rem] rounded-full blur-3xl ${role === "vendor" ? "bg-emerald-400/20" : "bg-violet-500/25"}`} />
        <div className={`pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full blur-3xl ${role === "vendor" ? "bg-violet-500/20" : "bg-emerald-400/15"}`} />

        <div className="relative z-10 mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-emerald-400">
            <FiZap size={22} color="#fff" />
          </div>
          <span className="bg-gradient-to-r from-violet-300 to-emerald-300 bg-clip-text text-2xl font-extrabold text-transparent">
            AccessoryHub
          </span>
        </div>

        <h2 className="relative z-10 text-center text-3xl font-extrabold text-white">
          {role === "vendor" ? "Start Selling Today" : "Join the Community"}
        </h2>
        <p className="relative z-10 mt-3 max-w-sm text-center text-sm leading-7 text-slate-400">
          {role === "vendor"
            ? "List your products and reach thousands of ready-to-buy customers instantly."
            : "Discover premium accessories from verified vendors all in one place."}
        </p>

        <div className="relative z-10 mt-8 flex w-full max-w-sm flex-col gap-3">
          {perks.map((perk, index) => (
            <div key={index} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${role === "vendor" ? "bg-emerald-400/20 text-emerald-300" : "bg-violet-500/20 text-violet-300"}`}>
                <FiCheck size={14} />
              </div>
              <p className="text-sm leading-6 text-slate-300">{perk}</p>
            </div>
          ))}
        </div>

        <div className="relative z-10 mt-8 flex gap-3">
          <div className="flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/15 px-3 py-2 text-[0.78rem] font-semibold text-violet-300">
            <FiStar size={11} /> 4.9 Rated
          </div>
          <div className="flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-[0.78rem] font-semibold text-emerald-300">
            <FiShield size={11} /> SSL Secured
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleRegister} className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur sm:p-8">
          <div className="mb-7">
            <h2 className="mb-2 text-3xl font-extrabold text-slate-100">Create Account</h2>
            <p className="text-sm leading-7 text-slate-400">Fill in the details below — it takes less than a minute</p>
          </div>

          <div className="mb-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">I want to join as</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`flex flex-col items-center gap-2 rounded-2xl border px-4 py-4 transition ${role === "customer" ? "border-violet-500 bg-violet-500/10 shadow-[0_0_24px_rgba(124,58,237,0.25)]" : "border-white/10 bg-slate-800/70 hover:border-violet-500/40"}`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${role === "customer" ? "bg-violet-500/20 text-violet-300" : "bg-slate-800 text-slate-500"}`}>
                  <FiShoppingBag size={19} />
                </div>
                <span className={`text-sm font-semibold ${role === "customer" ? "text-slate-100" : "text-slate-400"}`}>Customer</span>
                <span className={`text-[0.72rem] ${role === "customer" ? "text-violet-300" : "text-slate-500"}`}>Shop &amp; discover</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("vendor")}
                className={`flex flex-col items-center gap-2 rounded-2xl border px-4 py-4 transition ${role === "vendor" ? "border-emerald-400 bg-emerald-400/10 shadow-[0_0_24px_rgba(6,214,160,0.2)]" : "border-white/10 bg-slate-800/70 hover:border-emerald-400/40"}`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${role === "vendor" ? "bg-emerald-400/20 text-emerald-300" : "bg-slate-800 text-slate-500"}`}>
                  <FiBriefcase size={19} />
                </div>
                <span className={`text-sm font-semibold ${role === "vendor" ? "text-slate-100" : "text-slate-400"}`}>Vendor</span>
                <span className={`text-[0.72rem] ${role === "vendor" ? "text-emerald-300" : "text-slate-500"}`}>Sell &amp; grow</span>
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                <FiUser size={13} /> Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                <FiMail size={13} /> Email Address
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                <FiLock size={13} /> Password
              </label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
              />

              {password && (
                <div>
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <div
                        key={index}
                        className={`h-1 flex-1 rounded-full transition ${index <= pw.score ? pw.colorClass : "bg-white/10"}`}
                      />
                    ))}
                  </div>
                  <p className={`mt-2 text-xs font-semibold ${pw.textClass}`}>{pw.label}</p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 ${role === "vendor" ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30" : "bg-gradient-to-r from-violet-600 to-violet-700 hover:shadow-lg hover:shadow-violet-500/30"}`}
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Creating account...
              </>
            ) : (
              <>Create Account <FiArrowRight size={16} /></>
            )}
          </button>

          <div className="mt-6 border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-violet-300 transition hover:text-violet-200">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
