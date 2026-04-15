import React, { useEffect, useState } from "react";
import API from "../services/api";

function MyOrders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH ORDERS
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
    return <h2>Loading orders...</h2>;
  }

  if (orders.length === 0) {
    return <h2>No orders found</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Orders</h2>

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: "1px solid #ddd",
            margin: "15px 0",
            padding: "15px",
            borderRadius: "10px"
          }}
        >
          <h4>Order ID: {order._id}</h4>
          <p>Status: <strong>{order.orderStatus}</strong></p>
          <p>Total: ৳ {order.totalPrice}</p>

          <h5>Items:</h5>

          {order.orderItems.map((item, index) => (
            <div key={index} style={{ marginLeft: "15px" }}>
              <p>
                {item.product.name} — ৳ {item.price} × {item.quantity}
              </p>
            </div>
          ))}

        </div>
      ))}
    </div>
  );
}

export default MyOrders;