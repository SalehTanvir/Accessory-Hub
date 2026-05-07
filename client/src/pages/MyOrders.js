import React, { useEffect, useState } from "react";
import API from "../services/api";
import { FiShoppingCart, FiClock } from "react-icons/fi";

function MyOrders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="page-container loading" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}><FiClock size={20} /> Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="page-container">
        <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FiShoppingCart size={28} /> My Orders
        </h2>
        <div className="empty-state">
          <h2>No orders yet</h2>
          <p>Start shopping and place your first order</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <FiShoppingCart size={28} /> My Orders ({orders.length})
      </h2>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div>
                <h4>Order #{order._id.substring(0, 8)}</h4>
                <p style={{ margin: "0.25rem 0 0 0", color: "#6b7280", fontSize: "0.85rem" }}>
                  Placed on {new Date(order.createdAt || order.date).toLocaleDateString()}
                </p>
              </div>
              <span className={`order-status ${
                order.orderStatus === "Delivered" 
                  ? "delivered" 
                  : order.orderStatus === "Cancelled" 
                  ? "cancelled" 
                  : "pending"
              }`}>
                {order.orderStatus || "Pending"}
              </span>
            </div>

            <div className="order-details">
              <div className="order-detail-item">
                <label>Total Amount</label>
                <p>৳ {order.totalPrice?.toLocaleString()}</p>
              </div>

              <div className="order-detail-item">
                <label>Payment Method</label>
                <p>{order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}</p>
              </div>

              <div className="order-detail-item">
                <label>Items</label>
                <p>{order.orderItems?.length || 0} item(s)</p>
              </div>

              <div className="order-detail-item">
                <label>Shipping</label>
                <p>Standard Delivery</p>
              </div>
            </div>

            <div className="order-items">
              <h5>Order Items</h5>
              {order.orderItems?.map((item, index) => (
                <div key={index} style={{
                  padding: "0.75rem",
                  background: "linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(236, 72, 153, 0.05))",
                  borderRadius: "0.375rem",
                  marginBottom: "0.5rem",
                  borderLeft: "3px solid #7c3aed"
                }}>
                  <p style={{ margin: "0 0 0.25rem 0", fontWeight: 600 }}>
                    {item.product?.name || "Product"}
                  </p>
                  <p style={{ margin: "0.25rem 0", fontSize: "0.9rem", color: "#6b7280" }}>
                    Price: <strong>৳ {item.price}</strong> × Qty: <strong>{item.quantity}</strong> = <strong style={{ color: "#7c3aed" }}>৳ {(item.price * item.quantity).toLocaleString()}</strong>
                  </p>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: "1rem",
              padding: "1rem",
              background: "#f9fafb",
              borderRadius: "0.5rem",
              borderLeft: "3px solid #10b981",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}>Shipping Address</p>
                <p style={{ margin: "0.25rem 0 0 0", fontWeight: 600 }}>
                  {order.shippingAddress?.address}, {order.shippingAddress?.city} {order.shippingAddress?.postalCode}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrders;