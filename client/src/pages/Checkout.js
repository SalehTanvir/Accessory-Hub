import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiCreditCard, FiCheckCircle, FiArrowLeft, FiBox } from "react-icons/fi";

function Checkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country] = useState("Bangladesh");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/orders", {
        shippingAddress: { address, city, postalCode, country },
        paymentMethod
      });
      navigate("/my-orders");
    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = address && city && postalCode;

  return (
    <div className="mx-auto min-h-[calc(100vh-60px)] max-w-[1400px] px-3 py-4 text-slate-100 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-center text-2xl font-bold text-transparent bg-gradient-to-r from-violet-300 to-emerald-300 bg-clip-text">
        Secure Checkout
      </h2>

      <div className="mx-auto mb-10 flex max-w-3xl items-center">
        <div className="flex flex-1 flex-col items-center">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${step >= 1 ? "bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-lg shadow-violet-500/30" : "bg-slate-800 text-slate-500"}`}>
            {step > 1 ? <FiCheckCircle /> : "1"}
          </div>
          <p className={`mt-2 text-xs font-semibold uppercase tracking-[0.2em] ${step >= 1 ? "text-slate-100" : "text-slate-500"}`}>Shipping</p>
        </div>
        <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-gradient-to-r from-violet-600 to-emerald-400" : "bg-slate-800"}`} />
        <div className="flex flex-1 flex-col items-center">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${step >= 2 ? "bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-lg shadow-violet-500/30" : "bg-slate-800 text-slate-500"}`}>
            {step > 2 ? <FiCheckCircle /> : "2"}
          </div>
          <p className={`mt-2 text-xs font-semibold uppercase tracking-[0.2em] ${step >= 2 ? "text-slate-100" : "text-slate-500"}`}>Payment</p>
        </div>
        <div className={`h-1 flex-1 rounded-full ${step >= 3 ? "bg-gradient-to-r from-violet-600 to-emerald-400" : "bg-slate-800"}`} />
        <div className="flex flex-1 flex-col items-center">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${step >= 3 ? "bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-lg shadow-violet-500/30" : "bg-slate-800 text-slate-500"}`}>3</div>
          <p className={`mt-2 text-xs font-semibold uppercase tracking-[0.2em] ${step >= 3 ? "text-slate-100" : "text-slate-500"}`}>Review</p>
        </div>
      </div>

      <form
        className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur sm:p-8"
        onSubmit={(e) => {
        e.preventDefault();
        if (step === 1 && isStep1Valid) setStep(2);
        else if (step === 2) setStep(3);
        else if (step === 3) handleOrder(e);
      }}>

        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="rounded-xl bg-violet-500/10 p-2 text-violet-300"><FiMapPin size={20} /></div>
              <h3 className="text-xl font-bold text-slate-100">Shipping Address</h3>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Full Address</label>
              <input type="text" placeholder="House/Apartment, Street" value={address} onChange={(e) => setAddress(e.target.value)} required className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">City</label>
                <input type="text" placeholder="E.g. Dhaka" value={city} onChange={(e) => setCity(e.target.value)} required className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Postal Code</label>
                <input type="text" placeholder="E.g. 1212" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Country</label>
              <input type="text" value={country} disabled className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-slate-400 opacity-80" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="rounded-xl bg-emerald-400/10 p-2 text-emerald-300"><FiCreditCard size={20} /></div>
              <h3 className="text-xl font-bold text-slate-100">Payment Method</h3>
            </div>

            <div className="space-y-4">
              <label className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition ${paymentMethod === "COD" ? "border-violet-500/60 bg-violet-500/10 shadow-[0_0_24px_rgba(124,58,237,0.15)]" : "border-white/10 bg-slate-800/60 hover:border-violet-500/30"}`}>
                <input type="radio" value="COD" checked={paymentMethod === "COD"} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-1 h-4 w-4 accent-violet-500" />
                <div>
                  <div className="flex items-center gap-2 font-semibold text-slate-100">
                    <FiBox className="text-violet-300" /> Cash on Delivery
                  </div>
                  <p className="mt-1 text-sm text-slate-400">Pay with cash when your order is delivered to your doorstep.</p>
                </div>
              </label>

              <label className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition ${paymentMethod === "Online" ? "border-violet-500/60 bg-violet-500/10 shadow-[0_0_24px_rgba(124,58,237,0.15)]" : "border-white/10 bg-slate-800/60 hover:border-violet-500/30"}`}>
                <input type="radio" value="Online" checked={paymentMethod === "Online"} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-1 h-4 w-4 accent-violet-500" />
                <div>
                  <div className="flex items-center gap-2 font-semibold text-slate-100">
                    <FiCreditCard className="text-emerald-300" /> Online Payment
                  </div>
                  <p className="mt-1 text-sm text-slate-400">Pay securely using Credit/Debit card, bKash, or Nagad.</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="rounded-xl bg-amber-400/10 p-2 text-amber-300"><FiCheckCircle size={20} /></div>
              <h3 className="text-xl font-bold text-slate-100">Review Order</h3>
            </div>

            <div className="mb-6 rounded-2xl border border-white/10 bg-slate-800/60 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Shipping To</span>
                <button type="button" onClick={() => setStep(1)} className="text-sm font-semibold text-violet-300 hover:text-violet-200">Edit</button>
              </div>
              <p className="font-medium leading-7 text-slate-100">
                {address}<br/>{city}, {postalCode}<br/>{country}
              </p>

              <div className="my-5 border-t border-white/10" />

              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Payment Method</span>
                <button type="button" onClick={() => setStep(2)} className="text-sm font-semibold text-violet-300 hover:text-violet-200">Edit</button>
              </div>
              <p className="flex items-center gap-2 font-medium text-slate-100">
                {paymentMethod === "COD" ? <><FiBox className="text-violet-300" /> Cash on Delivery</> : <><FiCreditCard className="text-emerald-300" /> Online Payment</>}
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-4 border-t border-white/10 pt-6">
          {step > 1 && (
            <button type="button" onClick={() => setStep(step - 1)} className="inline-flex w-[120px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white">
              <FiArrowLeft size={16} /> Back
            </button>
          )}

          <button type="submit" disabled={loading} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0">
            {loading ? (
              <span className="inline-flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Processing...</span>
            ) : step === 3 ? "Place Order" : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Checkout;