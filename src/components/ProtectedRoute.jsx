import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../provider/AuthContext";

const normalizeRole = (role) => {
  if (!role) return null;
  const r = role.toUpperCase();
  if (r === "SUPER_ADMIN" || r === "SUPERADMIN") return "SuperAdmin";
  if (r === "STORE_MANAGER" || r === "STOREMANAGER") return "StoreManager";
  if (r === "STAFF") return "Staff";
  return role;
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, role } = useContext(AuthContext);
  const userRole = normalizeRole(role);

  if (!user || !userRole) return <Navigate to="/login" replace />;

  if (allowedRoles.length && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
