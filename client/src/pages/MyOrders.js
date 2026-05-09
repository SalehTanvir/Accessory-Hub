import React, { useEffect, useState } from "react";
import API from "../services/api";
import { FiClock, FiPackage, FiCheckCircle, FiXCircle, FiChevronDown, FiMapPin, FiBox } from "react-icons/fi";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/my");
        setOrders(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleExpand = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-60px)] items-center justify-center bg-[#0a0b0f] px-4 text-slate-100">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500" />
          <span className="text-sm font-medium text-slate-300">Loading orders...</span>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto min-h-[calc(100vh-60px)] max-w-[1400px] px-3 py-4 text-slate-100 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-bold text-transparent bg-gradient-to-r from-violet-300 to-emerald-300 bg-clip-text">
          My Orders
        </h2>
        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-slate-900/80 px-6 py-16 text-center shadow-2xl backdrop-blur">
          <FiPackage size={64} className="mx-auto mb-6 text-slate-500" />
          <h2 className="mb-2 text-3xl font-extrabold text-slate-100">No orders yet</h2>
          <p className="text-sm leading-7 text-slate-400">You haven't placed any orders. Start shopping to see your history here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[calc(100vh-60px)] max-w-[1400px] px-3 py-4 text-slate-100 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-2xl font-bold text-transparent bg-gradient-to-r from-violet-300 to-emerald-300 bg-clip-text">
        Order History <span className="ml-2 text-base font-normal text-slate-400">({orders.length} orders)</span>
      </h2>

      <div className="space-y-4">
        {orders.map((order) => {
          const isExpanded = expandedOrder === order._id;
          
          let statusClass, StatusIcon;
          switch(order.orderStatus) {
            case "Delivered": statusClass = "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"; StatusIcon = FiCheckCircle; break;
            case "Cancelled": statusClass = "border-red-500/30 bg-red-500/10 text-red-300"; StatusIcon = FiXCircle; break;
            default: statusClass = "border-amber-400/30 bg-amber-400/10 text-amber-300"; StatusIcon = FiClock;
          }

          return (
            <div key={order._id} className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-lg">
              <div
                onClick={() => toggleExpand(order._id)}
                className={`flex cursor-pointer items-center justify-between gap-4 p-5 transition ${isExpanded ? "bg-white/[0.03]" : "bg-transparent hover:bg-white/[0.02]"}`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-800 text-violet-300">
                    <FiPackage size={24} />
                  </div>
                  <div>
                    <h4 className="mb-1 text-base font-semibold text-slate-100 sm:text-lg">Order #{order._id.substring(0, 8)}</h4>
                    <p className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
                      <FiClock size={12} /> {new Date(order.createdAt || order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden text-right md:block">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Total Amount</p>
                    <p className="text-lg font-bold text-slate-100">৳ {order.totalPrice?.toLocaleString()}</p>
                  </div>
                  
                  <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusClass}`}>
                    <StatusIcon size={14} /> {order.orderStatus || "Pending"}
                  </span>
                  
                  <FiChevronDown size={20} className={`text-slate-500 transition-transform ${isExpanded ? "rotate-180" : "rotate-0"}`} />
                </div>
              </div>

              <div className={`${isExpanded ? "max-h-[1200px] border-t border-white/10" : "max-h-0 border-t border-transparent"} overflow-hidden transition-all duration-500`}>
                <div className="space-y-6 bg-slate-950/40 p-5">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Payment Method</p>
                      <p className="font-medium text-slate-100">{order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Total Items</p>
                      <p className="font-medium text-slate-100">{order.orderItems?.length || 0} item(s)</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Shipping Address</p>
                      <p className="flex items-center gap-2 truncate text-sm font-medium text-slate-100" title={`${order.shippingAddress?.address}, ${order.shippingAddress?.city}`}>
                        <FiMapPin size={12} className="text-violet-300" />
                        {order.shippingAddress?.city}
                      </p>
                    </div>
                  </div>

                  <h5 className="flex items-center gap-2 text-base font-semibold text-slate-100">
                    <FiBox className="text-violet-300" /> Items in this order
                  </h5>
                  <div className="space-y-3">
                    {order.orderItems?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 border-l-4 border-l-violet-500 bg-slate-800/70 p-4">
                        <div>
                          <p className="mb-1 font-semibold text-slate-100">{item.product?.name || "Unknown Product"}</p>
                          <p className="text-sm text-slate-400">Qty: {item.quantity} × ৳ {item.price}</p>
                        </div>
                        <div className="font-bold text-violet-300">
                          ৳ {(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end border-t border-dashed border-white/10 pt-5">
                    <div className="text-right">
                      <p className="mb-2 text-sm text-slate-400">Subtotal: ৳ {order.totalPrice?.toLocaleString()}</p>
                      <p className="mb-2 text-sm text-slate-400">Shipping: Free</p>
                      <h4 className="flex items-center gap-3 text-lg font-bold text-slate-100">
                        Total Paid <span className="text-xl text-emerald-400">৳ {order.totalPrice?.toLocaleString()}</span>
                      </h4>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyOrders;