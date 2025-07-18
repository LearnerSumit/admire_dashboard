import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isLoggedIn, role, loading } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Assume auth is already validated when Zustand state updates
    if (!loading) {
      setAuthChecked(true);
    }
  }, [loading]);

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If user's role isn't allowed
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and authorized
  return <Outlet />;
};

export default ProtectedRoute;
