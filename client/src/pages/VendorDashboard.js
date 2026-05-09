import React, { useEffect, useState } from "react";
import API from "../services/api";
import { FiCheckCircle, FiTrash2, FiPlus, FiPackage, FiAlertTriangle, FiBox, FiDollarSign } from "react-icons/fi";

function VendorDashboard() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ total: 0, outOfStock: 0, totalValue: 0 });
  const [formData, setFormData] = useState({ name: "", description: "", price: "", category: "Electronics", image: "", stock: "" });
  const [isAdding, setIsAdding] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products/vendor");
      setProducts(res.data);
      setStats({
        total: res.data.length,
        outOfStock: res.data.filter(p => p.stock === 0).length,
        totalValue: res.data.reduce((acc, p) => acc + (p.price * p.stock), 0)
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/products", formData);
      setFormData({ name: "", description: "", price: "", category: "Electronics", image: "", stock: "" });
      setIsAdding(false);
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add product");
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Delete this product permanently?")) {
      try {
        await API.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="mx-auto min-h-[calc(100vh-60px)] max-w-[1400px] px-3 py-4 text-slate-100 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-violet-300 to-emerald-300 bg-clip-text">
          Vendor Dashboard
        </h2>
        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/30" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? "Cancel" : <><FiPlus /> Add Product</>}
        </button>
      </div>

      <div className="mb-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-violet-500/20 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Total Products</p>
              <p className="mt-2 text-4xl font-extrabold text-violet-300">{stats.total}</p>
            </div>
            <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-300"><FiBox size={24} /></div>
          </div>
        </div>

        <div className="rounded-2xl border border-pink-500/20 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Out of Stock</p>
              <p className="mt-2 text-4xl font-extrabold text-pink-400">{stats.outOfStock}</p>
            </div>
            <div className="rounded-2xl bg-pink-500/10 p-3 text-pink-400"><FiAlertTriangle size={24} /></div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-400/20 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Inventory Value</p>
              <p className="mt-2 text-4xl font-extrabold text-emerald-400">৳ {stats.totalValue.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-300"><FiDollarSign size={24} /></div>
          </div>
        </div>
      </div>

      <div className={`overflow-hidden transition-all duration-500 ${isAdding ? "max-h-[1400px] opacity-100" : "max-h-0 opacity-0"}`}>
        <form onSubmit={handleSubmit} className="mb-10 rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur">
          <h3 className="mb-6 flex items-center gap-3 text-xl font-bold text-violet-300">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            Product Details
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Product Name</label>
              <input name="name" placeholder="E.g. Wireless Earbuds" value={formData.name} onChange={handleChange} required className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-slate-100 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30">
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home">Home & Decor</option>
                <option value="Sports">Sports & Fitness</option>
                <option value="Beauty">Health & Beauty</option>
                <option value="Books">Books</option>
              </select>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Description</label>
            <textarea name="description" placeholder="Briefly describe your product..." value={formData.description} onChange={handleChange} rows="3" required className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30" />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Price (৳)</label>
              <input name="price" placeholder="0.00" type="number" min="0" value={formData.price} onChange={handleChange} required className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Stock Quantity</label>
              <input name="stock" placeholder="0" type="number" min="0" value={formData.stock} onChange={handleChange} required className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30" />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Image URL</label>
            <input name="image" placeholder="https://example.com/image.jpg" value={formData.image} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30" />
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-5">
            <button type="button" onClick={() => setIsAdding(false)} className="rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white">Cancel</button>
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/30"><FiCheckCircle /> Publish Product</button>
          </div>
        </form>
      </div>

      <h3 className="mb-5 mt-2 flex items-center gap-2 text-xl font-bold text-slate-100">
        <FiPackage className="text-slate-500" /> Inventory Catalog
      </h3>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 px-6 py-16 text-center shadow-lg">
          <FiBox size={48} className="mx-auto mb-4 text-slate-500" />
          <h2 className="mb-2 text-3xl font-extrabold text-slate-100">Your catalog is empty</h2>
          <p className="text-sm leading-7 text-slate-400">Add your first product to start selling on AccessoryHub</p>
          <button className="mt-5 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/30" onClick={() => setIsAdding(true)}>Add Product</button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-lg">
          <div className="hidden grid-cols-[80px_2fr_1fr_1fr_100px] gap-6 border-b border-white/10 bg-slate-950/40 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 md:grid">
            <div>Image</div>
            <div>Product Details</div>
            <div>Price</div>
            <div>Stock Status</div>
            <div className="text-right">Actions</div>
          </div>

          <div className="divide-y divide-white/10">
            {products.map((p, index) => (
              <div key={p._id} className="grid gap-4 px-6 py-5 md:grid-cols-[80px_2fr_1fr_1fr_100px] md:items-center">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-slate-800">
                  {p.image ? <img src={p.image} alt={p.name} className="h-full w-full object-cover" /> : <FiBox size={24} className="text-slate-500" />}
                </div>

                <div>
                  <h4 className="mb-2 text-base font-semibold text-slate-100">{p.name}</h4>
                  <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">{p.category}</span>
                </div>

                <div>
                  <div className="font-semibold text-slate-100">৳ {p.price.toLocaleString()}</div>
                </div>

                <div>
                  {p.stock > 0 ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> In Stock ({p.stock})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-sm text-red-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-400" /> Out of Stock
                    </span>
                  )}
                </div>

                <div className="md:text-right">
                  <button onClick={() => deleteProduct(p._id)} className="inline-flex items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20 hover:text-red-300" title="Delete Product">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorDashboard;