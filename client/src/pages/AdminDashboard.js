import React, { useEffect, useState } from "react";
import API from "../services/api";
import { resolveImageUrl } from "../services/imageUrl";
import { 
  FiUsers, FiPackage, FiShoppingCart, FiDollarSign, 
  FiTrash2, FiActivity 
} from "react-icons/fi";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await API.get("/admin/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await API.get("/admin/orders");
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "products") fetchProducts();
    if (activeTab === "orders") fetchOrders();
  }, [activeTab]);

  const deleteUser = async (id) => {
    if (window.confirm("Delete this user?")) {
      try {
        await API.delete(`/admin/users/${id}`);
        fetchUsers();
        fetchStats();
      } catch (error) {
        alert(error.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await API.delete(`/admin/products/${id}`);
        fetchProducts();
        fetchStats();
      } catch (error) {
        alert(error.response?.data?.message || "Failed to delete product");
      }
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update order status");
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-[1400px] px-4 py-8 text-slate-100">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text">
          Admin Control Center
        </h2>
        <p className="text-slate-400">Manage your marketplace operations from one place.</p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex flex-wrap gap-2 rounded-2xl bg-slate-900/50 p-1 border border-white/5 backdrop-blur-sm">
        {[
          { id: "overview", label: "Overview", icon: FiActivity },
          { id: "users", label: "Users", icon: FiUsers },
          { id: "products", label: "Products", icon: FiPackage },
          { id: "orders", label: "Orders", icon: FiShoppingCart },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
              activeTab === tab.id 
                ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20" 
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Users" value={stats.totalUsers} icon={FiUsers} color="text-blue-400" bgColor="bg-blue-400/10" borderColor="border-blue-400/20" />
            <StatCard label="Total Products" value={stats.totalProducts} icon={FiPackage} color="text-emerald-400" bgColor="bg-emerald-400/10" borderColor="border-emerald-400/20" />
            <StatCard label="Total Orders" value={stats.totalOrders} icon={FiShoppingCart} color="text-orange-400" bgColor="bg-orange-400/10" borderColor="border-orange-400/20" />
            <StatCard label="Total Revenue" value={`৳${stats.totalRevenue.toLocaleString()}`} icon={FiDollarSign} color="text-violet-400" bgColor="bg-violet-400/10" borderColor="border-violet-400/20" />
          </div>
        )}

        {activeTab === "users" && (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-xl">
            <div className="grid grid-cols-[1fr_2fr_1fr_1fr_100px] gap-6 border-b border-white/10 bg-slate-950/40 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <div>Name</div>
              <div>Email</div>
              <div>Role</div>
              <div>Joined</div>
              <div className="text-right">Action</div>
            </div>
            <div className="divide-y divide-white/10">
              {users.map(user => (
                <div key={user._id} className="grid grid-cols-[1fr_2fr_1fr_1fr_100px] gap-6 px-6 py-4 items-center">
                  <div className="font-semibold text-slate-200">{user.name}</div>
                  <div className="text-slate-400 truncate">{user.email}</div>
                  <div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                      user.role === 'admin' ? 'bg-violet-500/20 text-violet-400 border border-violet-500/20' : 
                      user.role === 'vendor' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 
                      'bg-slate-500/20 text-slate-400 border border-slate-500/20'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="text-slate-400 text-sm">{new Date(user.createdAt).toLocaleDateString()}</div>
                  <div className="text-right">
                    <button 
                      onClick={() => deleteUser(user._id)} 
                      disabled={user.role === 'admin'}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition disabled:opacity-30"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-xl">
            <div className="grid grid-cols-[80px_2fr_1fr_1fr_1fr_100px] gap-6 border-b border-white/10 bg-slate-950/40 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <div>Image</div>
              <div>Product</div>
              <div>Vendor</div>
              <div>Price</div>
              <div>Stock</div>
              <div className="text-right">Action</div>
            </div>
            <div className="divide-y divide-white/10">
              {products.map(product => (
                <div key={product._id} className="grid grid-cols-[80px_2fr_1fr_1fr_1fr_100px] gap-6 px-6 py-4 items-center">
                  <img src={product.image ? resolveImageUrl(product.image) : "https://via.placeholder.com/60"} alt={product.name} className="h-12 w-12 rounded-xl object-cover bg-slate-800" />
                  <div>
                    <div className="font-semibold text-slate-200">{product.name}</div>
                    <div className="text-xs text-slate-500">{product.category}</div>
                  </div>
                  <div className="text-slate-400 text-sm">{product.vendor?.name || 'Unknown'}</div>
                  <div className="font-medium text-slate-200">৳{product.price.toLocaleString()}</div>
                  <div className={`text-sm ${product.stock < 5 ? 'text-red-400' : 'text-slate-400'}`}>
                    {product.stock} left
                  </div>
                  <div className="text-right">
                    <button onClick={() => deleteProduct(product._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-xl">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr_100px] gap-6 border-b border-white/10 bg-slate-950/40 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <div>Order ID / Date</div>
              <div>Customer</div>
              <div>Amount</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>
            <div className="divide-y divide-white/10">
              {orders.map(order => (
                <div key={order._id} className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr_100px] gap-6 px-6 py-5 items-center">
                  <div>
                    <div className="text-sm font-mono text-violet-400">#{order._id.slice(-8).toUpperCase()}</div>
                    <div className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="text-slate-200 font-medium">{order.user?.name || 'Guest'}</div>
                  <div className="font-bold text-slate-200">৳{order.totalPrice.toLocaleString()}</div>
                  <div>
                    <select 
                      value={order.orderStatus} 
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className={`rounded-lg border border-white/10 bg-slate-800 px-3 py-1.5 text-xs font-semibold outline-none transition focus:border-violet-500 ${
                        order.orderStatus === 'Delivered' ? 'text-emerald-400' : 
                        order.orderStatus === 'Processing' ? 'text-blue-400' : 
                        'text-orange-400'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="text-right">
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition" title="View Details">
                      <FiActivity size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, bgColor, borderColor }) {
  return (
    <div className={`rounded-3xl border ${borderColor} ${bgColor} p-6 transition-all hover:scale-[1.02]`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <h4 className={`mt-2 text-3xl font-bold ${color}`}>{value}</h4>
        </div>
        <div className={`rounded-2xl ${bgColor} p-3 ${color}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
