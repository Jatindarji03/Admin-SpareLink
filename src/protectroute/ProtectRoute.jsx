import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectRoute = () => {
  const token = localStorage.getItem("token"); // or sessionStorage
  console.log("ProtectRoute Token:", token);
  if (!token) {
    // No token found → redirect to login
    localStorage.clear();
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // in seconds

    if (decoded.exp < currentTime) {
      // Token expired → clear it and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      return <Navigate to="/login" />;
    }

    // Token valid → render the requested route
    return <Outlet />;

  } catch (error) {
    // Invalid token → redirect
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    return <Navigate to="/login" />;
  }
};

export default ProtectRoute;
