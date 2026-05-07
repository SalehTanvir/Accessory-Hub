import React, { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FiLogIn, FiMail, FiLock } from "react-icons/fi";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      login(res.data.token);

      alert("Login successful!");

      navigate("/");

    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 70px)" }}>
      <form onSubmit={handleLogin} style={{ maxWidth: 500 }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
          <FiLogIn size={24} /> Welcome Back
        </h2>
        <p style={{ textAlign: "center", color: "#6b7280", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
          Login to your AccessoryHub account
        </p>

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
            <FiLock size={16} /> Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          {loading ? "Logging in..." : <>
            <FiLogIn size={16} /> Login
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
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#7c3aed", fontWeight: "600", textDecoration: "none" }}>
              Create one now
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;