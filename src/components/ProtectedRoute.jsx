import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../provider/AuthContext";

// Helper function to get user role
const getUserRole = (user) => {
  if (!user) return null;
  return user?.role || user?.user?.role || null;
};

// Helper function to normalize role
const normalizeRole = (role) => {
  if (!role) return null;
  const roleUpper = role.toUpperCase();
  if (roleUpper === "SUPERADMIN" || roleUpper === "SUPER_ADMIN") return "SuperAdmin";
  if (roleUpper === "STOREMANAGER" || roleUpper === "STORE_MANAGER") return "StoreManager";
  if (roleUpper === "STAFF") return "Staff";
  return role;
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useContext(AuthContext);
  const userRole = normalizeRole(getUserRole(user));

  // If no user, redirect to login
  if (!user || !userRole) {
    return <Navigate to="/login" replace />;
  }

  // If route has role restrictions and user role is not allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to dashboard if unauthorized
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
