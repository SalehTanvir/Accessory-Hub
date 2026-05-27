import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import { resolveImageUrl } from "../services/imageUrl";
import {
  FiFilter,
  FiShoppingCart,
  FiHeart,
  FiAlertCircle,
  FiTruck,
  FiStar,
  FiCheckCircle,
  FiSmartphone,
  FiShoppingBag,
  FiHome,
  FiActivity,
  FiBook,
  FiGift,
  FiPackage,
  FiSearch,
  FiX,
  FiShield
} from "react-icons/fi";

const categories = [
  { id: 1, name: "Electronics", Icon: FiSmartphone },
  { id: 2, name: "Fashion", Icon: FiShoppingBag },
  { id: 3, name: "Home", Icon: FiHome },
  { id: 4, name: "Sports", Icon: FiActivity },
  { id: 5, name: "Books", Icon: FiBook },
  { id: 6, name: "Beauty", Icon: FiGift }
];

const normalizeCategory = (category) => {
  const value = (category || "").toString().trim().toLowerCase();

  if (value === "home & decor" || value === "home decor") {
    return "home";
  }

  if (value === "health & beauty" || value === "health beauty") {
    return "beauty";
  }

  return value;
};

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState(10000);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [accessError, setAccessError] = useState(location.state?.error || null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    try {
      await API.post("/cart/add", {
        productId,
        quantity: 1
      });

      // Directly navigate to cart after adding
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Please login first");
    }
  };

  const getVendorInfo = (index) => {
    const vendors = ["TechStore", "StyleHub", "HomeDecor", "SportsPro", "BookWorld", "BeautyPlus"];
    return {
      name: vendors[index % vendors.length],
      rating: (4.2 + (index % 5) * 0.1).toFixed(1),
      reviews: 100 + index * 50
    };
  };

  const filteredProducts = products.filter((product) => {
    const priceMatch = Number(product.price) <= priceRange;
    const searchText = searchQuery.toLowerCase();
    const productName = product.name?.toLowerCase() || "";
    const productDescription = product.description?.toLowerCase() || "";
    const searchMatch = productName.includes(searchText) || productDescription.includes(searchText);
    const categoryMatch = selectedCategory === "all" || normalizeCategory(product.category) === selectedCategory;
    return priceMatch && searchMatch && categoryMatch;
  }).sort((leftProduct, rightProduct) => {
    if (sortBy === "price-low-high") {
      return Number(leftProduct.price) - Number(rightProduct.price);
    }

    if (sortBy === "price-high-low") {
      return Number(rightProduct.price) - Number(leftProduct.price);
    }

    if (sortBy === "newest") {
      return new Date(rightProduct.createdAt || 0) - new Date(leftProduct.createdAt || 0);
    }

    return 0;
  });

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-60px)] items-center justify-center bg-[#0a0b0f] px-4 text-slate-100">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500" />
          <span className="text-sm font-medium text-slate-300">Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[calc(100vh-60px)] max-w-[1400px] px-3 py-4 text-slate-100 sm:px-6 lg:px-8">
      {accessError && (
        <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-4 shadow-lg backdrop-blur">
          <div className="flex items-start gap-3">
            <FiShield size={20} className="mt-0.5 shrink-0 text-red-400" />
            <div>
              <p className="mb-1 text-sm font-bold text-red-400">Access Restricted</p>
              <p className="text-sm text-slate-300">{accessError}</p>
            </div>
          </div>
          <button
            onClick={() => setAccessError(null)}
            className="shrink-0 rounded-full p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Dismiss"
          >
            <FiX size={18} />
          </button>
        </div>
      )}

      <section className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,#1a0533_0%,#0f172a_40%,#0a1628_100%)] px-6 py-16 text-center shadow-2xl sm:px-10">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="relative z-10 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">
          🔥 Top Selling Accessories
        </div>
        <h1 className="relative z-10 mt-6 bg-gradient-to-r from-white via-violet-100 to-violet-300 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl lg:text-5xl">
          Welcome to AccessoryHub
        </h1>
        <p className="relative z-10 mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          Discover the best accessories from trusted vendors worldwide. Premium quality, guaranteed satisfaction, and fast delivery.
        </p>
        <button
          type="button"
          onClick={() => navigate("/vendors")}
          className="relative z-10 mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-violet-700 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:-translate-y-0.5 hover:shadow-violet-500/50"
        >
          Shop Now
        </button>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-xl font-bold text-transparent bg-gradient-to-r from-violet-300 to-emerald-300 bg-clip-text">
            Shop by Category
          </h2>
          {selectedCategory !== "all" && (
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 transition hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white"
            >
              Clear category
            </button>
          )}
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`group min-w-[130px] shrink-0 rounded-2xl border p-5 text-center backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] ${
              selectedCategory === "all"
                ? "border-violet-400/70 bg-violet-500/20 text-white shadow-[0_0_30px_rgba(124,58,237,0.25)]"
                : "border-white/10 bg-white/5 hover:border-violet-500/50 hover:bg-violet-500/10"
            }`}
          >
            <div className="mb-3 flex items-center justify-center text-violet-300 transition group-hover:text-violet-200">
              <FiPackage size={28} />
            </div>
            <h3 className="text-sm font-medium text-slate-400 transition group-hover:text-slate-100">
              All Products
            </h3>
          </button>
          {categories.map(({ id, name, Icon }) => {
            const isActive = selectedCategory === normalizeCategory(name);

            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedCategory(normalizeCategory(name))}
                aria-pressed={isActive}
                className={`group min-w-[130px] shrink-0 rounded-2xl border p-5 text-center backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] ${
                  isActive
                    ? "border-violet-400/70 bg-violet-500/20 text-white shadow-[0_0_30px_rgba(124,58,237,0.25)]"
                    : "border-white/10 bg-white/5 hover:border-violet-500/50 hover:bg-violet-500/10"
                }`}
              >
                <div className="mb-3 flex items-center justify-center text-violet-300 transition group-hover:text-violet-200">
                  <Icon size={28} />
                </div>
                <h3 className="text-sm font-medium text-slate-400 transition group-hover:text-slate-100">{name}</h3>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-10 flex flex-col gap-8 lg:flex-row">
        <aside className="h-fit w-full rounded-2xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur lg:sticky lg:top-20 lg:w-64">
          <div className="border-b border-white/10 pb-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-violet-300">
              <FiSearch size={16} /> Search
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
              />
              <FiSearch className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          <div className="border-b border-white/10 py-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-violet-300">
              <FiFilter size={16} /> Price Range
            </h3>
            <input
              type="range"
              min="0"
              max="10000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-violet-500"
            />
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500">৳ 0</span>
              <span className="font-semibold text-violet-300">Max: ৳ {Number(priceRange).toLocaleString()}</span>
            </div>
          </div>

          <div className="border-b border-white/10 py-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-violet-300">
              <FiStar size={16} /> Rating
            </h3>
            {[5, 4, 3, 2, 1].map((rating) => (
              <label key={rating} htmlFor={`rating-${rating}`} className="mb-2 flex cursor-pointer items-center gap-3 text-sm text-slate-400 last:mb-0">
                <input type="checkbox" id={`rating-${rating}`} className="h-4 w-4 cursor-pointer accent-violet-500" />
                <span className="text-amber-400">
                  {Array(5).fill(0).map((_, i) => (
                    <span key={i} className={i < rating ? "opacity-100" : "opacity-30"}>
                      ★
                    </span>
                  ))}
                </span>
                <span>&amp; up</span>
              </label>
            ))}
          </div>

          <div className="pt-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-violet-300">
              <FiTruck size={16} /> Delivery
            </h3>
            <label htmlFor="free-shipping" className="mb-2 flex cursor-pointer items-center gap-3 text-sm text-slate-400">
              <input type="checkbox" id="free-shipping" defaultChecked className="h-4 w-4 cursor-pointer accent-violet-500" />
              <span>Free Shipping</span>
            </label>
            <label htmlFor="express-delivery" className="flex cursor-pointer items-center gap-3 text-sm text-slate-400">
              <input type="checkbox" id="express-delivery" className="h-4 w-4 cursor-pointer accent-violet-500" />
              <span>Express Delivery</span>
            </label>
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="!m-0 text-2xl font-bold text-transparent bg-gradient-to-r from-violet-300 to-emerald-300 bg-clip-text">
              Products <span className="ml-2 text-sm font-normal text-slate-400">({filteredProducts.length} items)</span>
            </h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 sm:w-auto"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-16 text-center text-slate-400 shadow-lg">
              <FiSearch size={48} className="mx-auto mb-4 text-slate-500" />
              <h2 className="mb-2 text-2xl font-bold text-slate-100">No products found</h2>
              <p className="mb-6 text-sm text-slate-400">Try adjusting your search or filters</p>
              <button
                className="inline-flex items-center justify-center rounded-full bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-700 hover:text-white"
                onClick={() => {
                  setPriceRange(10000);
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredProducts.map((product, index) => {
                const vendor = getVendorInfo(index);
                const discount = Math.floor(Math.random() * 40) + 5;
                const originalPrice = Math.floor(product.price / (1 - discount / 100));

                return (
                  <div key={product._id} className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 transition hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]">
                    <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                      {product.image ? (
                        <img src={resolveImageUrl(product.image)} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        <FiPackage size={48} className="text-violet-300/50" />
                      )}

                      {discount > 0 && (
                        <div className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-xs font-bold text-slate-950">
                          -{discount}%
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-2 flex items-center justify-between gap-2 text-xs text-slate-500">
                        <span>{vendor.name}</span>
                        <span className="inline-flex items-center rounded-full bg-violet-500/15 px-2 py-1 font-semibold text-violet-200">
                          <FiCheckCircle size={10} className="mr-1" /> Verified
                        </span>
                      </div>

                      <h3 className="mb-2 min-h-[2.8rem] text-base font-semibold leading-7 text-slate-100" title={product.name}>
                        {product.name}
                      </h3>

                      <div className="mb-4 flex items-center gap-2 text-sm">
                        <span className="inline-flex items-center text-amber-400">
                          <FiStar size={12} className="mr-1 fill-current" /> {vendor.rating}
                        </span>
                        <span className="text-xs text-slate-500">({vendor.reviews} reviews)</span>
                      </div>

                      <div className="mb-3 flex items-center gap-3">
                        <span className="text-xl font-extrabold text-emerald-400">৳ {Number(product.price).toLocaleString()}</span>
                        {discount > 0 && <span className="text-sm text-slate-500 line-through">৳ {originalPrice.toLocaleString()}</span>}
                      </div>

                      <div className="mb-3 inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
                        <FiTruck size={12} className="mr-1" /> Free Shipping
                      </div>

                      <div className={`mb-5 text-sm ${product.stock <= 5 ? "text-red-400" : "text-slate-400"}`}>
                        {product.stock > 0 ? (
                          <span className="inline-flex items-center gap-2">
                            {product.stock <= 5 ? <FiAlertCircle size={12} /> : <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                            {product.stock} in stock
                          </span>
                        ) : (
                          <span>Out of stock</span>
                        )}
                      </div>

                      <div className="mt-auto flex gap-3">
                        <button
                          onClick={() => addToCart(product._id)}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                          disabled={product.stock === 0}
                        >
                          <FiShoppingCart size={16} /> Add
                        </button>
                        <button
                          className="inline-flex w-11 items-center justify-center rounded-xl border border-pink-500/20 bg-slate-800 text-pink-400 transition hover:-translate-y-0.5 hover:bg-pink-500/10 hover:text-pink-300"
                          title="Add to Wishlist"
                        >
                          <FiHeart size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
