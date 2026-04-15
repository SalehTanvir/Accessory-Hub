import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Checkout() {

  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Bangladesh");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const handleOrder = async (e) => {
    e.preventDefault();

    try {
      await API.post("/orders", {
        shippingAddress: {
          address,
          city,
          postalCode,
          country
        },
        paymentMethod
      });

      alert("Order placed successfully!");

      navigate("/"); // go to home

    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to place order");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Checkout</h2>

      <form onSubmit={handleOrder}>

        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="text"
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="text"
          value={country}
          disabled
        />

        <br /><br />

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="COD">Cash on Delivery</option>
          <option value="Online">Online Payment</option>
        </select>

        <br /><br />

        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            borderRadius: "5px"
          }}
        >
          Place Order
        </button>

      </form>
    </div>
  );
}

export default Checkout;