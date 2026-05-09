import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function VendorRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Not logged in at all — redirect to login
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "vendor") {
    // Logged in but not a vendor — redirect to home with a message
    return <Navigate to="/" replace state={{ error: "Vendor access only. Please register as a vendor." }} />;
  }

  return children;
}

export default VendorRoute;
