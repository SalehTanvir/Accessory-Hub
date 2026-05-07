import React, { useEffect, useState } from "react";
import API from "../services/api";
import { FiCheckCircle, FiTrash2, FiPlus } from "react-icons/fi";

function VendorDashboard() {

  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ total: 0, outOfStock: 0 });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: ""
  });

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products/vendor");
      setProducts(res.data);
      setStats({
        total: res.data.length,
        outOfStock: res.data.filter(p => p.stock === 0).length
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/products", formData);
      alert("Product added!");

      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: ""
      });

      fetchProducts();

    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Failed to add product";
      alert(errorMessage);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await API.delete(`/products/${id}`);
        alert("Product deleted");
        fetchProducts();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="page-container">
      <h2>Vendor Dashboard</h2>

      {/* STATS CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1.5rem",
        marginBottom: "2rem"
      }}>
        <div style={{
          padding: "1.5rem",
          background: "linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(236, 72, 153, 0.1))",
          borderRadius: "0.75rem",
          borderLeft: "4px solid #7c3aed",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
        }}>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem", fontWeight: 500 }}>Total Products</p>
          <p style={{ margin: "0.5rem 0 0 0", fontSize: "1.8rem", fontWeight: 700, color: "#7c3aed" }}>{stats.total}</p>
        </div>

        <div style={{
          padding: "1.5rem",
          background: "linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(244, 158, 11, 0.1))",
          borderRadius: "0.75rem",
          borderLeft: "4px solid #ec4899",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
        }}>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem", fontWeight: 500 }}>Out of Stock</p>
          <p style={{ margin: "0.5rem 0 0 0", fontSize: "1.8rem", fontWeight: 700, color: "#ec4899" }}>{stats.outOfStock}</p>
        </div>

        <div style={{
          padding: "1.5rem",
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))",
          borderRadius: "0.75rem",
          borderLeft: "4px solid #10b981",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
        }}>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem", fontWeight: 500 }}>In Stock</p>
          <p style={{ margin: "0.5rem 0 0 0", fontSize: "1.8rem", fontWeight: 700, color: "#10b981" }}>{stats.total - stats.outOfStock}</p>
        </div>
      </div>

      {/* ADD PRODUCT FORM */}
      <form className="vendor-form" onSubmit={handleSubmit}>
        <h3 style={{ marginTop: 0, marginBottom: "1.5rem", color: "#7c3aed", display: "flex", alignItems: "center", gap: "0.5rem" }}><FiPlus size={20} /> Add New Product</h3>

        <div className="form-group">
          <label>Product Name</label>
          <input 
            name="name" 
            placeholder="Enter product name" 
            value={formData.name} 
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input 
            name="description" 
            placeholder="Enter product description" 
            value={formData.description} 
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input 
            name="image" 
            placeholder="https://example.com/product-image.jpg" 
            value={formData.image} 
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price (৳)</label>
            <input 
              name="price" 
              placeholder="Enter price" 
              type="number"
              value={formData.price} 
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Stock Quantity</label>
            <input 
              name="stock" 
              placeholder="Enter stock" 
              type="number"
              value={formData.stock} 
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Category</label>
          <input 
            name="category" 
            placeholder="e.g. Electronics, Fashion, Home" 
            value={formData.category} 
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-primary" style={{ width: "100%", padding: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          <FiPlus size={18} /> Add Product
        </button>
      </form>

      {/* PRODUCT LIST */}
      <h3 style={{ marginTop: "3rem", marginBottom: "1.5rem", color: "#1f2937" }}>Your Products ({products.length})</h3>

      {products.length === 0 ? (
        <div className="empty-state">
          <h2>No products yet</h2>
          <p>Start by adding your first product above</p>
        </div>
      ) : (
        <div className="products-list">
          {products.map((p) => (
            <div key={p._id} className="vendor-product-card">
              <div className="vendor-product-image" style={{ overflow: "hidden" }}>
                {p.image ? (
                  <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <FiCheckCircle size={28} style={{ color: "#10b981" }} />
                )}
              </div>

              <div className="vendor-product-info">
                <h4>{p.name}</h4>
                <p style={{ margin: "0.5rem 0 0.25rem 0", color: "#7c3aed", fontWeight: 600 }}>
                  ৳ {p.price}
                </p>
                <p style={{ margin: "0.25rem 0" }}>
                  <span style={{ marginRight: "1rem" }}>Stock: <strong>{p.stock}</strong></span>
                  <span>{p.category}</span>
                </p>
                <p style={{ margin: "0.5rem 0 0 0", color: "#6b7280", fontSize: "0.9rem" }}>
                  {p.description}
                </p>
              </div>

              <div className="vendor-product-actions">
                <button 
                  onClick={() => deleteProduct(p._id)}
                  className="btn-danger"
                >
                  <FiTrash2 size={14} style={{marginRight: "0.25rem"}}/> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default VendorDashboard;