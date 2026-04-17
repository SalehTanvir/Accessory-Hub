import React, { useEffect, useState } from "react";
import API from "../services/api";

function VendorDashboard() {

  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: ""
  });

  // FETCH VENDOR PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products/vendor");
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ADD PRODUCT
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
        stock: ""
      });

      fetchProducts();

    } catch (error) {
      console.error(error);
    }
  };

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Vendor Dashboard</h2>

      {/* ADD PRODUCT FORM */}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <input name="price" placeholder="Price" value={formData.price} onChange={handleChange} />
        <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
        <input name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} />

        <button type="submit">Add Product</button>
      </form>

      <hr />

      {/* PRODUCT LIST */}
      <h3>Your Products</h3>

      {products.map((p) => (
        <div key={p._id} style={{
          border: "1px solid #ccc",
          margin: "10px 0",
          padding: "10px"
        }}>
          <h4>{p.name}</h4>
          <p>৳ {p.price}</p>

          <button onClick={() => deleteProduct(p._id)}>
            Delete
          </button>
        </div>
      ))}

    </div>
  );
}

export default VendorDashboard;