import React from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiShoppingCart, FiShoppingBag, FiArrowRight } from "react-icons/fi";

function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-[calc(100vh-60px)] max-w-[1400px] items-center justify-center px-3 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg text-center">

        {/* Cancel Icon */}
        <div className="relative mx-auto mb-8 h-28 w-28">
          <div className="absolute inset-0 animate-pulse rounded-full bg-amber-400/15" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/15 backdrop-blur" />
          <div className="absolute inset-0 flex items-center justify-center">
            <FiAlertCircle size={52} className="text-amber-400 drop-shadow-[0_0_16px_rgba(251,191,36,0.5)]" />
          </div>
        </div>

        <h1 className="mb-3 text-3xl font-extrabold text-transparent bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text sm:text-4xl">
          Payment Cancelled
        </h1>
        <p className="mx-auto mb-8 max-w-sm text-sm leading-7 text-slate-400">
          You cancelled the payment. No charges were made. Your cart items are still saved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate("/cart")}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-violet-700 px-8 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/30"
          >
            <FiShoppingCart size={18} /> Return to Cart
          </button>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-800 px-8 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white"
          >
            <FiShoppingBag size={18} /> Continue Shopping <FiArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentCancel;
