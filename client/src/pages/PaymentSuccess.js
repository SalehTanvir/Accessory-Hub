import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiShoppingBag, FiPackage, FiArrowRight, FiDownload, FiMapPin, FiPrinter, FiMail } from "react-icons/fi";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import API from "../services/api";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const invoiceRef = useRef(null);
  const tranId = searchParams.get("tran_id") || "";
  const orderId = searchParams.get("order_id") || "";
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) { 
        setLoading(false); 
        return; 
      }
      try {
        const res = await API.get(`/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    setDownloading(true);
    
    // Temporarily hide elements that shouldn't be in the PDF if any
    // For now, we just capture the invoiceRef
    
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 3, // Higher scale for better quality
        backgroundColor: "#0f172a", // Match the theme background
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          // You can modify the cloned document before rendering
          // e.g., make certain text black if it was a gradient
          const elements = clonedDoc.getElementsByClassName('pdf-text-fix');
          for (let el of elements) {
            el.style.background = 'none';
            el.style.color = '#ffffff';
            el.style.webkitBackgroundClip = 'initial';
            el.style.webkitTextFillColor = 'initial';
          }
        }
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`AccessoryHub_Invoice_${tranId || orderId || "order"}.pdf`);
    } catch (err) {
      console.error("PDF download error:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", 
      month: "long", 
      day: "numeric", 
      hour: "2-digit", 
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-60px)] items-center justify-center bg-[#0f172a] text-slate-100">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
            <div className="h-full w-full animate-spin rounded-full border-4 border-emerald-500/10 border-t-emerald-500" />
          </div>
          <span className="text-lg font-medium text-slate-300">Processing your order details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] pb-20 pt-10 text-slate-100 selection:bg-emerald-500/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Success Header */}
        <div className="mb-12 text-center">
          <div className="group relative mx-auto mb-8 h-28 w-28">
            <div className="absolute inset-0 animate-pulse rounded-full bg-emerald-400/20 blur-xl" />
            <div className="absolute inset-0 scale-110 animate-ping rounded-full bg-emerald-500/10" style={{ animationDuration: '3s' }} />
            <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-600/10 shadow-[0_0_40px_rgba(52,211,153,0.2)] backdrop-blur-xl transition-transform group-hover:scale-105">
              <FiCheckCircle size={56} className="text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
            </div>
          </div>
          
          <h1 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl">
            <span className="block text-slate-400 text-sm uppercase tracking-[0.4em] mb-2 font-bold">Transaction Confirmed</span>
            <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Payment Successful!
            </span>
          </h1>
          <p className="mx-auto max-w-md text-lg leading-relaxed text-slate-400">
            Thank you for your purchase. Your order has been placed and is now being processed by our team.
          </p>
        </div>

        {/* Action Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-semibold text-slate-300">Order ID: #{orderId.substring(0, 8)}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
              title="Print Invoice"
            >
              <FiPrinter size={18} />
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:shadow-emerald-500/30 disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FiDownload size={18} className="transition-transform group-hover:translate-y-0.5" />
                  <span>Download Invoice</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Invoice Card */}
        <div 
          ref={invoiceRef}
          className="relative overflow-hidden rounded-[40px] border border-white/10 bg-slate-900 shadow-2xl transition-all hover:shadow-emerald-500/5 print:m-0 print:border-0 print:bg-white print:text-black print:shadow-none"
        >
          {/* Decorative Corner */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px] print:hidden" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-violet-500/10 blur-[100px] print:hidden" />

          <div className="relative p-8 sm:p-12">
            {/* Header Section */}
            <div className="mb-12 flex flex-col items-center justify-between gap-8 border-b border-white/5 pb-12 sm:flex-row print:border-slate-200">
              <div className="text-center sm:text-left">
                <h2 className="pdf-text-fix text-3xl font-black tracking-tighter text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text print:text-emerald-600">
                  AccessoryHub
                </h2>
                <p className="mt-2 text-sm font-medium tracking-wide text-slate-500 print:text-slate-500">Premium Tech Marketplace</p>
                <div className="mt-4 flex items-center gap-4 text-xs text-slate-400 print:text-slate-400">
                  <span className="flex items-center gap-1.5"><FiMail size={12} /> help@accessoryhub.com</span>
                  <span className="h-1 w-1 rounded-full bg-slate-700" />
                  <span>www.accessoryhub.com</span>
                </div>
              </div>
              
              <div className="text-center sm:text-right">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-6 py-2 print:border-emerald-200 print:bg-emerald-50">
                  <FiCheckCircle size={14} className="text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">Official Receipt</span>
                </div>
                <p className="mt-4 font-mono text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">INV-{orderId.substring(0, 8).toUpperCase()}</p>
                <p className="mt-1 text-sm font-medium text-slate-400 print:text-slate-500">{formatDate(order?.paidAt || order?.createdAt)}</p>
              </div>
            </div>

            {/* Information Grid */}
            <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="rounded-[32px] border border-white/5 bg-white/[0.02] p-8 print:border-slate-100 print:bg-slate-50">
                <h3 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Customer Details</h3>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-slate-100 print:text-black">{order?.user?.name || "Customer"}</p>
                  <p className="text-sm font-medium text-slate-400 print:text-slate-600">{order?.user?.email || "N/A"}</p>
                  <div className="mt-6 flex items-start gap-3">
                    <FiMapPin className="mt-1 flex-shrink-0 text-emerald-400" />
                    <div>
                      <p className="text-sm leading-relaxed text-slate-300 print:text-slate-700">
                        {order?.shippingAddress?.address}<br />
                        {order?.shippingAddress?.city}, {order?.shippingAddress?.postalCode}<br />
                        {order?.shippingAddress?.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-white/5 bg-white/[0.02] p-8 print:border-slate-100 print:bg-slate-50">
                <h3 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Payment Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-400">Transaction ID</span>
                    <span className="font-mono text-sm font-bold text-slate-200 print:text-black">{tranId || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-400">Method</span>
                    <span className="text-sm font-bold text-emerald-400">Online (SSLCommerz)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-400">Currency</span>
                    <span className="text-sm font-bold text-slate-200 print:text-black">BDT (৳)</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-4 print:border-slate-200">
                    <span className="text-sm font-black uppercase tracking-widest text-slate-400">Status</span>
                    <span className="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-400 print:bg-emerald-100">Paid</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="mb-12 overflow-hidden rounded-[32px] border border-white/5 print:border-slate-200">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 print:bg-slate-100">
                    <th className="px-6 py-5">Product Details</th>
                    <th className="px-6 py-5 text-center">Qty</th>
                    <th className="px-6 py-5 text-right">Unit Price</th>
                    <th className="px-6 py-5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-slate-200">
                  {order?.orderItems?.map((item, i) => (
                    <tr key={i} className="group transition hover:bg-white/[0.01]">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          {item.product?.image && (
                            <img src={item.product.image} alt="" className="h-12 w-12 rounded-xl object-cover print:hidden" />
                          )}
                          <div>
                            <p className="font-bold text-slate-100 print:text-black">{item.product?.name || "Product"}</p>
                            <p className="text-xs font-medium text-slate-500">ID: {item.product?._id?.substring(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center font-bold text-slate-300 print:text-black">{item.quantity}</td>
                      <td className="px-6 py-6 text-right font-medium text-slate-400 print:text-black">৳ {item.price?.toLocaleString()}</td>
                      <td className="px-6 py-6 text-right font-black text-slate-100 print:text-black">৳ {(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="ml-auto max-w-sm space-y-3">
              <div className="flex justify-between text-sm font-medium text-slate-400">
                <span>Subtotal</span>
                <span className="text-slate-200 print:text-black">৳ {order?.totalPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-slate-400">
                <span>Shipping Fee</span>
                <span className="font-bold text-emerald-400">Free</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-slate-400">
                <span>Tax (0%)</span>
                <span className="text-slate-200 print:text-black">৳ 0.00</span>
              </div>
              <div className="mt-6 flex justify-between rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white shadow-xl shadow-emerald-500/20">
                <span className="text-lg font-black uppercase tracking-wider">Total Paid</span>
                <span className="text-3xl font-black">৳ {order?.totalPrice?.toLocaleString()}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16 border-t border-white/5 pt-8 text-center print:border-slate-200">
              <p className="text-sm font-bold text-slate-400 print:text-slate-600">Thank you for your business!</p>
              <p className="mt-2 text-xs font-medium text-slate-600">
                This is a system-generated invoice for your records. No signature required.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => navigate("/my-orders")}
            className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-10 py-4 text-sm font-black uppercase tracking-widest text-slate-200 transition hover:bg-white/10 hover:text-white sm:w-auto"
          >
            <FiPackage size={18} className="transition-transform group-hover:scale-110" />
            Track Order
          </button>
          <button
            onClick={() => navigate("/")}
            className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-100 px-10 py-4 text-sm font-black uppercase tracking-widest text-slate-900 transition hover:bg-white sm:w-auto"
          >
            <FiShoppingBag size={18} className="transition-transform group-hover:rotate-12" />
            Shop More
            <FiArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          * { -webkit-print-color-adjust: exact !important; }
        }
      `}</style>
    </div>
  );
}

export default PaymentSuccess;

