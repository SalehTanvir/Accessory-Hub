import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiXCircle, FiRefreshCw, FiShoppingBag, FiArrowRight } from "react-icons/fi";

function PaymentFail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tranId = searchParams.get("tran_id") || "";
  const reason = searchParams.get("reason") || "";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-60px)] max-w-[1400px] items-center justify-center px-3 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg text-center">

        {/* Error Icon */}
        <div className="relative mx-auto mb-8 h-28 w-28">
          <div className="absolute inset-0 animate-pulse rounded-full bg-red-500/15" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-red-400/20 to-red-600/15 backdrop-blur" />
          <div className="absolute inset-0 flex items-center justify-center">
            <FiXCircle size={52} className="text-red-400 drop-shadow-[0_0_16px_rgba(248,113,113,0.5)]" />
          </div>
        </div>

        <h1 className="mb-3 text-3xl font-extrabold text-transparent bg-gradient-to-r from-red-300 to-red-500 bg-clip-text sm:text-4xl">
          Payment Failed
        </h1>
        <p className="mx-auto mb-8 max-w-sm text-sm leading-7 text-slate-400">
          Your payment could not be processed. Don't worry — no money has been charged. Please try again.
        </p>

        {/* Details Card */}
        {(tranId || reason) && (
          <div className="mx-auto mb-8 max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur">
            {tranId && (
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Transaction ID</span>
                <span className="font-mono text-sm font-medium text-slate-200">{tranId.substring(0, 20)}...</span>
              </div>
            )}
            {reason && (
              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Reason</span>
                <span className="text-sm font-medium capitalize text-red-300">{reason.replace(/_/g, " ")}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate("/checkout")}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-violet-700 px-8 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/30"
          >
            <FiRefreshCw size={18} /> Try Again
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

export default PaymentFail;
