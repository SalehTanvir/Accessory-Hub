import React, { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FiLogIn, FiMail, FiLock } from "react-icons/fi";
import "./Login.css";

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
    <section className="login-shell">
      <div className="login-aurora login-aurora-left" aria-hidden="true" />
      <div className="login-aurora login-aurora-right" aria-hidden="true" />

      <div className="login-panel">
        <aside className="login-brand">
          <p className="login-badge">AccessoryHub</p>
          <h1>Welcome Back</h1>
          <p>
            Sign in to continue tracking orders, managing your cart, and
            discovering the latest accessories.
          </p>
          <div className="login-brand-highlight">
            <span />
            <span />
            <span />
          </div>
        </aside>

        <form className="login-form" onSubmit={handleLogin}>
          <h2>Sign In</h2>
          <p className="login-form-subtitle">Use your email and password to access your account.</p>

          <div className="login-input-group">
            <label htmlFor="email" className="login-label">
              <FiMail size={16} /> Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-input-group">
            <label htmlFor="password" className="login-label">
              <FiLock size={16} /> Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? (
              "Logging in..."
            ) : (
              <>
                <FiLogIn size={16} /> Login
              </>
            )}
          </button>

          <p className="login-register-text">
            Don't have an account? <Link to="/register">Create one now</Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Login;