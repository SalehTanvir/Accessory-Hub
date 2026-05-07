import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiShoppingCart, FiHome, FiLock, FiTruck } from "react-icons/fi";

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

  const removeItem = async (productId) => {
    try {
      await API.delete("/cart/remove", {
        data: { productId }
      });

      fetchCart();
      alert("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const clearCart = async () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      try {
        await API.delete("/cart/clear");
        fetchCart();
        alert("Cart cleared");
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    }
  };

  if (loading) {
    return <div className="page-container loading">Loading cart...</div>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="page-container">
        <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FiShoppingCart size={28} /> Your Cart
        </h2>
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p>Start shopping and add items to your cart</p>
          <button className="btn-primary" onClick={() => navigate("/")} style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <FiHome size={18} /> Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Group items by vendor for multi-vendor display
  const itemsByVendor = {};
  cart.items.forEach((item) => {
    const vendor = item.product.vendor || "AccessoryHub";
    if (!itemsByVendor[vendor]) {
      itemsByVendor[vendor] = [];
    }
    itemsByVendor[vendor].push(item);
  });

  return (
    <div className="page-container">
      <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <FiShoppingCart size={28} /> Shopping Cart ({cart.items.length} items)
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", marginTop: "2rem" }}>
        {/* CART ITEMS */}
        <div>
          {Object.entries(itemsByVendor).map(([vendor, items]) => (
            <div key={vendor} style={{ marginBottom: "2rem" }}>
              <div style={{
                padding: "1rem",
                background: "linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(236, 72, 153, 0.05))",
                borderRadius: "0.5rem",
                marginBottom: "1rem",
                borderLeft: "4px solid #7c3aed"
              }}>
                <p style={{ margin: 0, fontWeight: 600, color: "#7c3aed" }}>{vendor}</p>
              </div>

              <div className="cart-items">
                {items.map((item) => (
                  <div key={item._id} className="cart-item">
                    <div className="cart-item-image" style={{ overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {item.product?.image ? (
                        <img src={item.product.image} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <FiShoppingCart size={24} style={{color: "#7c3aed"}} />
                      )}
                    </div>
                    
                    <div className="cart-item-details">
                      <h3>{item.product.name}</h3>
                      <p style={{ margin: "0.5rem 0" }}>Price: <strong style={{ color: "#7c3aed" }}>৳ {item.price}</strong></p>
                      <p style={{ margin: "0.25rem 0" }}>Quantity: <strong>{item.quantity}</strong></p>
                      <p style={{ margin: "0.5rem 0", fontWeight: 600, color: "#059669" }}>
                        Total: ৳ {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="btn-danger"
                      style={{ padding: "0.6rem 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
                    >
                      <FiTrash2 size={16} /> Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CART SUMMARY SIDEBAR */}
        <div>
          <div className="cart-summary">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal ({cart.items.length} items):</span>
              <span>৳ {cart.totalPrice}</span>
            </div>

            <div className="summary-row">
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiTruck size={16} /> Shipping:
              </span>
              <span style={{ color: "#059669", fontWeight: 600 }}>FREE</span>
            </div>

            <div className="summary-row">
              <span>Tax:</span>
              <span>৳ 0</span>
            </div>

            <div className="summary-row">
              <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>Total:</span>
              <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "#7c3aed" }}>৳ {cart.totalPrice}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="btn-primary"
              style={{ width: "100%", marginTop: "1.5rem", padding: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              <FiShoppingCart size={18} /> Checkout
            </button>

            <button
              onClick={() => navigate("/")}
              className="btn-dark"
              style={{ width: "100%", marginTop: "0.75rem", padding: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              <FiHome size={16} /> Continue Shopping
            </button>

            <button
              onClick={clearCart}
              className="btn-dark"
              style={{ 
                width: "100%", 
                marginTop: "0.75rem", 
                padding: "0.75rem",
                opacity: 0.7,
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: "0.5rem" 
              }}
            >
              <FiTrash2 size={16} /> Clear Cart
            </button>

            <div style={{
              marginTop: "1.5rem",
              padding: "1rem",
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))",
              borderRadius: "0.5rem",
              fontSize: "0.85rem",
              color: "#059669",
              textAlign: "center",
              fontWeight: 500,
              borderLeft: "3px solid #10b981"
            }}>
              <FiLock size={16} style={{display: "inline", marginRight: "0.25rem"}} /> Secure Checkout<br/>SSL Protected
            </div>
          </div>
        </div>
      </div>
      </div>
  );
}

export default Cart;