import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FiUserPlus, FiUser, FiMail, FiLock, FiBriefcase } from "react-icons/fi";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role
      });

      console.log(res.data);
      alert("Registration successful! Please login");
      navigate("/login");

    } catch (error) {
      console.error("Register error:", error);
      const errorMessage = error.response?.data?.message || "Registration failed. Try again";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 70px)" }}>
      <form onSubmit={handleRegister} style={{ maxWidth: 500 }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
          <FiUserPlus size={24} /> Create Account
        </h2>
        <p style={{ textAlign: "center", color: "#6b7280", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
          Join AccessoryHub and start shopping
        </p>

        <div className="form-group">
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiUser size={16} /> Full Name
          </label>
          <input
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiMail size={16} /> Email Address
          </label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiBriefcase size={16} /> Account Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
          </select>
        </div>

        <div className="form-group">
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiLock size={16} /> Create Password
          </label>
          <input
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          {loading ? "Creating account..." : <>
            <FiUserPlus size={16} /> Register
          </>}
        </button>

        <div style={{
          marginTop: "1.5rem",
          padding: "1rem",
          background: "linear-gradient(135deg, rgba(124, 58, 237, 0.05), rgba(236, 72, 153, 0.05))",
          borderRadius: "0.5rem",
          textAlign: "center"
        }}>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#7c3aed", fontWeight: "600", textDecoration: "none" }}>
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;