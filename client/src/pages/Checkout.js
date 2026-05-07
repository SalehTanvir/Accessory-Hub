import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiCreditCard, FiCheckCircle, FiArrowLeft, FiShoppingCart } from "react-icons/fi";

function Checkout() {

  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country] = useState("Bangladesh");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

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

      navigate("/my-orders");

    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = address && city && postalCode;

  return (
    <div className="page-container">
      <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <FiShoppingCart size={28} /> Checkout
      </h2>

      {/* PROGRESS STEPS */}
      <div className="checkout-steps">
        <div className={`step ${step >= 1 ? 'active' : 'inactive'}`}>
          <div className="step-number">1</div>
          <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.9rem", fontWeight: 500 }}>Shipping</p>
        </div>
        <div className={`step ${step >= 2 ? 'active' : 'inactive'}`}>
          <div className="step-number">2</div>
          <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.9rem", fontWeight: 500 }}>Payment</p>
        </div>
        <div className={`step ${step >= 3 ? 'active' : 'inactive'}`}>
          <div className="step-number">3</div>
          <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.9rem", fontWeight: 500 }}>Review</p>
        </div>
      </div>

      <form className="checkout-form" onSubmit={(e) => {
        e.preventDefault();
        if (step === 1 && isStep1Valid) {
          setStep(2);
        } else if (step === 2) {
          setStep(3);
        } else if (step === 3) {
          handleOrder(e);
        }
      }}>

        {/* STEP 1: SHIPPING */}
        {step === 1 && (
          <>
            <h3 style={{ marginTop: 0, marginBottom: "1.5rem", color: "#7c3aed", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiMapPin size={20} /> Shipping Address
            </h3>

            <div className="form-group">
              <label>Full Address</label>
              <input
                type="text"
                placeholder="Enter your full address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  placeholder="Enter your city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  placeholder="Enter postal code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                value={country}
                disabled
              />
            </div>
          </>
        )}

        {/* STEP 2: PAYMENT */}
        {step === 2 && (
          <>
            <h3 style={{ marginTop: 0, marginBottom: "1.5rem", color: "#7c3aed", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiCreditCard size={20} /> Payment Method
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <label style={{ 
                padding: "1rem", 
                border: paymentMethod === "COD" ? "2px solid #7c3aed" : "2px solid #e5e7eb",
                borderRadius: "0.5rem",
                cursor: "pointer",
                transition: "all 0.3s",
                background: paymentMethod === "COD" ? "rgba(124, 58, 237, 0.05)" : "white"
              }}>
                <input
                  type="radio"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ marginRight: "0.75rem" }}
                />
                <strong>Cash on Delivery</strong>
                <p style={{ margin: "0.5rem 0 0 1.75rem", fontSize: "0.9rem", color: "#6b7280" }}>
                  Pay when you receive your order
                </p>
              </label>

              <label style={{ 
                padding: "1rem", 
                border: paymentMethod === "Online" ? "2px solid #7c3aed" : "2px solid #e5e7eb",
                borderRadius: "0.5rem",
                cursor: "pointer",
                transition: "all 0.3s",
                background: paymentMethod === "Online" ? "rgba(124, 58, 237, 0.05)" : "white"
              }}>
                <input
                  type="radio"
                  value="Online"
                  checked={paymentMethod === "Online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ marginRight: "0.75rem" }}
                />
                <strong>Online Payment</strong>
                <p style={{ margin: "0.5rem 0 0 1.75rem", fontSize: "0.9rem", color: "#6b7280" }}>
                  Credit/Debit card, Mobile wallets, Bank transfer
                </p>
              </label>
            </div>
          </>
        )}

        {/* STEP 3: REVIEW */}
        {step === 3 && (
          <>
            <h3 style={{ marginTop: 0, marginBottom: "1.5rem", color: "#7c3aed", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiCheckCircle size={20} /> Review Order
            </h3>

            <div style={{
              padding: "1.5rem",
              background: "linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(236, 72, 153, 0.05))",
              borderRadius: "0.5rem",
              borderLeft: "4px solid #7c3aed",
              marginBottom: "1.5rem"
            }}>
              <p style={{ margin: "0.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <strong style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiMapPin size={16} /> Shipping to:
                </strong><br/>
                {address}, {city} {postalCode}<br/>
                {country}
              </p>
              <p style={{ margin: "0.75rem 0 0 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <strong>Payment:</strong> {paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
              </p>
            </div>

            <div style={{
              padding: "1rem",
              background: "#fff3cd",
              border: "1px solid #ffc107",
              borderRadius: "0.5rem",
              color: "#856404",
              fontSize: "0.9rem",
              marginBottom: "1rem"
            }}>
              Please verify your information before placing the order
            </div>
          </>
        )}

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          {step > 1 && (
            <button 
              type="button" 
              className="btn-dark" 
              onClick={() => setStep(step - 1)}
              style={{ flex: 1 }}
            >
              <FiArrowLeft size={16} style={{marginRight: "0.25rem"}}/> Back
            </button>
          )}

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? "Processing..." : step === 3 ? "Place Order" : "Next"}
          </button>
        </div>

        <button 
          type="button" 
          className="btn-dark" 
          onClick={() => navigate("/cart")}
          style={{ width: "100%", marginTop: "0.75rem", opacity: 0.7 }}
        >
          <FiShoppingCart size={16} style={{marginRight: "0.25rem"}}/> Back to Cart
        </button>

      </form>
    </div>
  );
}

export default Checkout;