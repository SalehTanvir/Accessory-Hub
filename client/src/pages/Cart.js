import React, { useEffect, useState } from "react";
import API from "../services/api";

function Cart() {

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // FETCH CART
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

  // REMOVE ITEM
  const removeItem = async (productId) => {
    try {
      await API.delete("/cart/remove", {
        data: { productId }
      });

      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // CLEAR CART
  const clearCart = async () => {
    try {
      await API.delete("/cart/clear");
      fetchCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  if (loading) {
    return <h2>Loading cart...</h2>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return <h2>Your cart is empty</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Cart</h2>

      {cart.items.map((item) => (
        <div
          key={item._id}
          style={{
            border: "1px solid #ddd",
            margin: "10px 0",
            padding: "10px",
            borderRadius: "8px"
          }}
        >
          <h3>{item.product.name}</h3>
          <p>Price: ৳ {item.price}</p>
          <p>Quantity: {item.quantity}</p>

          <button
            onClick={() => removeItem(item.product._id)}
            style={{
              backgroundColor: "red",
              color: "white",
              padding: "5px 10px",
              border: "none",
              borderRadius: "5px"
            }}
          >
            Remove
          </button>
        </div>
      ))}

      <h3>Total: ৳ {cart.totalPrice}</h3>

      <button
        onClick={clearCart}
        style={{
          marginTop: "10px",
          backgroundColor: "black",
          color: "white",
          padding: "10px",
          border: "none",
          borderRadius: "5px"
        }}
      >
        Clear Cart
      </button>

      <button
  onClick={() => window.location.href = "/checkout"}
  style={{
    marginTop: "10px",
    backgroundColor: "green",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px"
  }}
>
  Proceed to Checkout
</button>
    </div>
  );
}

export default Cart;