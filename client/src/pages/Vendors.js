import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import { resolveImageUrl } from "../services/imageUrl";
import {
  FiArrowLeft,
  FiBox,
  FiCalendar,
  FiChevronRight,
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiTag,
  FiTruck,
  FiUsers
} from "react-icons/fi";

function Vendors() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [vendorDetail, setVendorDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        if (vendorId) {
          const res = await API.get(`/vendors/${vendorId}`);
          setVendorDetail(res.data);
        } else {
          const res = await API.get("/vendors");
          setVendors(res.data);
          setVendorDetail(null);
        }
      } catch (fetchError) {
        console.error("Error fetching vendors:", fetchError);
        setError(fetchError.response?.data?.message || "Failed to load vendors");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vendorId]);

  const vendorList = vendorDetail ? [vendorDetail.vendor] : vendors;

  return (
    <div className="mx-auto min-h-[calc(100vh-60px)] max-w-[1400px] px-3 py-6 text-slate-100 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,#0f172a_0%,#172554_48%,#111827_100%)] px-6 py-10 shadow-2xl sm:px-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-500/18 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-sky-200">
              <FiShoppingBag size={14} /> Vendor Marketplace
            </div>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              {vendorId ? vendorDetail?.vendor?.name || "Vendor" : "Browse Vendors"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              {vendorId
                ? vendorDetail?.vendor?.description || "Explore all products from this vendor."
                : "Choose a vendor to see their profile, description, and full product catalog."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              <FiArrowLeft size={16} /> Back
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition hover:-translate-y-0.5"
            >
              Shop Products
            </Link>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-300">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500" />
            <span className="text-sm font-medium">Loading vendors...</span>
          </div>
        </div>
      ) : error ? (
        <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-10 text-center text-red-200">
          <p className="font-semibold">{error}</p>
        </div>
      ) : vendorId ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
          <aside className="h-fit rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300">
                <FiShoppingBag size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{vendorDetail?.vendor?.name}</h2>
                <p className="text-sm text-slate-400">Verified vendor</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <FiPackage className="text-sky-300" size={16} />
                <span>{vendorDetail?.vendor?.productCount || 0} products</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <FiGrid className="text-sky-300" size={16} />
                <span>{vendorDetail?.vendor?.categories?.length || 0} categories</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <FiCalendar className="text-sky-300" size={16} />
                <span>
                  Joined {vendorDetail?.vendor?.joinedAt ? new Date(vendorDetail.vendor.joinedAt).getFullYear() : "recently"}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-sky-500/10 px-4 py-4 text-sm leading-6 text-slate-300">
              {vendorDetail?.vendor?.description}
            </div>

            {vendorDetail?.vendor?.categories?.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {vendorDetail.vendor.categories.map((category) => (
                    <span key={category} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <section>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-white">Products by {vendorDetail?.vendor?.name}</h2>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                {vendorDetail?.products?.length || 0} items
              </span>
            </div>

            {vendorDetail?.products?.length ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {vendorDetail.products.map((product) => (
                  <article key={product._id} className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-lg transition hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.18)]">
                    <div className="flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                      {product.image ? (
                        <img src={resolveImageUrl(product.image)} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                      ) : (
                        <FiBox size={44} className="text-amber-300/50" />
                      )}
                    </div>

                    <div className="p-5">
                      <div className="mb-3 flex items-center justify-between gap-2 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-amber-200">
                          <FiTag size={10} /> {product.category}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2 py-1 text-sky-300">
                          <FiTruck size={10} /> {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </span>
                      </div>

                      <h3 className="mb-2 text-base font-semibold text-white">{product.name}</h3>
                      <p className="mb-4 line-clamp-3 text-sm leading-6 text-slate-400">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-lg font-extrabold text-amber-400">৳ {Number(product.price).toLocaleString()}</span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300">
                          <FiChevronRight size={14} /> Product listed
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 px-6 py-16 text-center text-slate-400">
                <FiUsers size={44} className="mx-auto mb-4 text-slate-500" />
                <h3 className="mb-2 text-2xl font-bold text-white">No products yet</h3>
                <p>This vendor does not have any listed products right now.</p>
              </div>
            )}
          </section>
        </div>
      ) : (
        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-white">All Vendors</h2>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              {vendorList.length} vendors
            </span>
          </div>

          {vendorList.length ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {vendorList.map((vendor) => (
                  <button
                  key={vendor.id}
                  type="button"
                  onClick={() => navigate(`/vendors/${vendor.id}`)}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 text-left shadow-lg transition hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.18)]"
                >
                  <div className="flex h-40 items-center justify-center bg-gradient-to-br from-sky-500/20 via-slate-900 to-slate-950">
                    {vendor.featuredImage ? (
                      <img src={resolveImageUrl(vendor.featuredImage)} alt={vendor.name} className="h-full w-full object-cover opacity-80 transition duration-300 group-hover:scale-105 group-hover:opacity-100" />
                    ) : (
                      <FiShoppingBag size={48} className="text-amber-300/60" />
                    )}
                  </div>

                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <h3 className="text-xl font-bold text-white">{vendor.name}</h3>
                      <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-200">
                        {vendor.productCount} products
                      </span>
                    </div>

                    <p className="mb-4 line-clamp-3 text-sm leading-6 text-slate-400">
                      {vendor.description}
                    </p>

                    <div className="mb-5 flex flex-wrap gap-2">
                      {vendor.categories?.slice(0, 3).map((category) => (
                        <span key={category} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                          {category}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span className="inline-flex items-center gap-2">
                        <FiBox size={14} /> Click to view products
                      </span>
                      <FiChevronRight className="text-amber-300" size={16} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 px-6 py-16 text-center text-slate-400">
              <FiUsers size={44} className="mx-auto mb-4 text-slate-500" />
              <h3 className="mb-2 text-2xl font-bold text-white">No vendors found</h3>
              <p>There are no vendors with products yet.</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default Vendors;