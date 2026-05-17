import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiShoppingCart, FiHome, FiLock, FiTruck, FiMinus, FiPlus, FiBox, FiCheckCircle, FiArrowRight } from "react-icons/fi";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCart(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, newQuantity) => {
    try {
      await API.put("/cart/update", { productId, quantity: newQuantity });
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (productId) => {
    try {
      await API.delete("/cart/remove", { data: { productId } });
      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const clearCart = async () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      try {
        await API.delete("/cart/clear");
        fetchCart();
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-60px)] items-center justify-center bg-[#0a0b0f] px-4 text-slate-100">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500" />
          <span className="text-sm font-medium text-slate-300">Loading cart...</span>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-60px)] max-w-[1400px] items-center justify-center px-3 py-6 text-slate-100 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900/80 px-6 py-16 text-center shadow-2xl backdrop-blur">
          <FiShoppingCart size={64} className="mx-auto mb-6 text-slate-500" />
          <h2 className="mb-2 text-3xl font-extrabold text-slate-100">Your cart is empty</h2>
          <p className="mx-auto max-w-md text-sm leading-7 text-slate-400">Looks like you haven't added anything to your cart yet.</p>
          <button
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-violet-700 px-8 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/30"
            onClick={() => navigate("/")}
          >
            <FiHome size={18} /> Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Group items by vendor
  const itemsByVendor = {};
  cart.items.forEach((item) => {
    const vendor = item.product.vendor || "AccessoryHub";
    if (!itemsByVendor[vendor]) itemsByVendor[vendor] = [];
    itemsByVendor[vendor].push(item);
  });

  return (
    <div className="mx-auto min-h-[calc(100vh-60px)] max-w-[1400px] px-3 py-4 text-slate-100 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-2xl font-bold text-transparent bg-gradient-to-r from-violet-300 to-emerald-300 bg-clip-text">
        Your Cart <span className="ml-2 text-base font-normal text-slate-400">({cart.items.length} items)</span>
      </h2>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          {Object.entries(itemsByVendor).map(([vendor, items]) => (
            <div key={vendor} className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-lg">
              <div className="flex items-center gap-2 border-b border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-transparent px-5 py-4">
                <FiBox className="text-violet-300" />
                <span className="font-semibold text-slate-100">Sold by: {vendor}</span>
              </div>

              <div className="divide-y divide-white/10">
                {items.map((item, index) => (
                  <div key={item._id} className="flex flex-col gap-5 bg-slate-900 p-5 md:flex-row md:items-center">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-800">
                      {item.product?.image ? (
                        <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                      ) : (
                        <FiShoppingCart size={24} className="text-slate-500" />
                      )}
                    </div>
                    
                    <div className="flex min-w-0 flex-1 flex-col gap-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <h3 className="pr-4 text-base font-semibold text-slate-100">{item.product.name}</h3>
                        <div className="text-left sm:text-right">
                          <div className="text-lg font-bold text-emerald-400">৳ {(item.price * item.quantity).toLocaleString()}</div>
                          <div className="mt-1 text-xs text-slate-500">৳ {item.price} each</div>
                        </div>
                      </div>

                      <div className="flex items-end justify-between gap-4">
                        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-800 px-3 py-2">
                          <button 
                            type="button" 
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            className="rounded-md p-1 text-slate-400 transition hover:bg-white/5 hover:text-white"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="min-w-5 text-center text-sm font-semibold text-slate-100">{item.quantity}</span>
                          <button 
                            type="button" 
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            className="rounded-md p-1 text-slate-100 transition hover:bg-white/5"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product._id)}
                          className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
                          title="Remove item"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY SIDEBAR */}
        <aside className="h-fit rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-lg lg:sticky lg:top-20">
          <h3 className="mb-5 text-xl font-bold text-violet-300">Order Summary</h3>

          <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <FiCheckCircle /> Free shipping unlocked!
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-full bg-emerald-400" />
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-white/10 py-3 text-sm text-slate-400">
            <span>Subtotal</span>
            <span className="text-slate-100">৳ {cart.totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/10 py-3 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <FiTruck size={14} /> Shipping
            </span>
            <span className="font-semibold text-emerald-400">Free</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/10 py-3 text-sm text-slate-400">
            <span>Tax</span>
            <span>৳ 0</span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-dashed border-white/10 pt-4">
            <span className="text-lg font-semibold text-slate-100">Total</span>
            <span className="text-2xl font-extrabold text-violet-300">৳ {cart.totalPrice.toLocaleString()}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-violet-700 px-5 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/30"
          >
            Proceed to Checkout <FiArrowRight />
          </button>

          <div className="mt-4 flex gap-3">
            <button onClick={() => navigate("/")} className="flex-1 rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white">
              Continue Shopping
            </button>
            <button onClick={clearCart} className="inline-flex w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-800 text-slate-400 transition hover:bg-red-500/10 hover:text-red-300" title="Clear Cart">
              <FiTrash2 />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <FiLock size={12} /> Secure Checkout - SSL Protected
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Cart;