import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{
      padding: "15px",
      backgroundColor: "#222",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between"
    }}>
      
      <div>
        <Link to="/" style={{ color: "#fff", marginRight: "15px" }}>Home</Link>
        <Link to="/cart" style={{ color: "#fff", marginRight: "15px" }}>Cart</Link>
        <Link to="/my-orders" style={{ color: "#fff" }}>Orders</Link>
      </div>

      <div>
        {user ? (
          <>
            <span style={{ marginRight: "10px" }}>Logged In</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "#fff", marginRight: "10px" }}>Login</Link>
            <Link to="/register" style={{ color: "#fff" }}>Register</Link>
          </>
        )}
      </div>

    </div>
  );
}

export default Navbar;