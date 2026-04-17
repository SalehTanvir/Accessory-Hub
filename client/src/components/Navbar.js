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
    <nav style={{
      padding: "15px 30px",
      backgroundColor: "#111",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>

      {/* LEFT SIDE */}
      <div>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/cart" style={linkStyle}>Cart</Link>

        {user && (
          <>
            <Link to="/my-orders" style={linkStyle}>Orders</Link>
            <Link to="/vendor" style={linkStyle}>Vendor</Link>
          </>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div>
        {user ? (
          <>
            <span style={{ marginRight: "15px" }}>👤 User</span>

            <button onClick={handleLogout} style={logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
          </>
        )}
      </div>

    </nav>
  );
}

// styles
const linkStyle = {
  color: "#fff",
  marginRight: "15px",
  textDecoration: "none",
  fontWeight: "500"
};

const logoutBtn = {
  padding: "6px 12px",
  backgroundColor: "red",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default Navbar;