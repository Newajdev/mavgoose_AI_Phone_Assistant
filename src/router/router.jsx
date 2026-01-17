import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import Registration from "../pages/authentication/Registration";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/authentication/Login";
import CallLogs from "../pages/CallLogs";
import CallTransfer from "../pages/CallTransfer";
import PricingList from "../pages/Pricinglist";
import Appointment from "../pages/Appointment";
import Notifications from "../pages/Notifications";
import Setting from "../pages/Setting";
import SendEmail from "../pages/authentication/SendEmail";
import Verifyotp from "../pages/authentication/Verifyotp";
import Changepassword from "../pages/authentication/Changepassword";
import AISettings from "../pages/AISettings";
import APISettings from "../pages/APISettings";
import UserManagement from "../pages/UserManagement";
import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["SuperAdmin", "StoreManager", "Staff"]}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/call-logs",
        element: (
          <ProtectedRoute allowedRoles={["SuperAdmin", "StoreManager", "Staff"]}>
            <CallLogs />
          </ProtectedRoute>
        ),
      },
      {
        path: "/call-transfer",
        element: (
          <ProtectedRoute allowedRoles={["SuperAdmin", "StoreManager"]}>
            <CallTransfer />
          </ProtectedRoute>
        ),
      },
      {
        path: "/pricing-list",
        element: (
          <ProtectedRoute allowedRoles={["StoreManager"]}>
            <PricingList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/pricing-management",
        element: (
          <ProtectedRoute allowedRoles={["SuperAdmin"]}>
            <PricingList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/appointment",
        element: (
          <ProtectedRoute allowedRoles={["SuperAdmin", "StoreManager", "Staff"]}>
            <Appointment />
          </ProtectedRoute>
        ),
      },
      {
        path: "/notifications",
        element: (
          <ProtectedRoute allowedRoles={["SuperAdmin", "StoreManager", "Staff"]}>
            <Notifications />
          </ProtectedRoute>
        ),
      },
      {
        path: "/setting",
        element: (
          <ProtectedRoute allowedRoles={["SuperAdmin", "StoreManager", "Staff"]}>
            <Setting />
          </ProtectedRoute>
        ),
      },
      {
        path: "/ai-behavior-settings",
        element: (
          <ProtectedRoute allowedRoles={["SuperAdmin"]}>
            <AISettings />
          </ProtectedRoute>
        ),
      },
      {
        path: "/api-settings",
        element: (
          <ProtectedRoute allowedRoles={["SuperAdmin"]}>
            <APISettings />
          </ProtectedRoute>
        ),
      },
      {
        path: "/user-management",
        element: (
          <ProtectedRoute allowedRoles={["SuperAdmin"]}>
            <UserManagement />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/send-email",
    element: <SendEmail />,
  },
  {
    path: "/verify-otp",
    element: <Verifyotp />,
  },
  {
    path: "/change-password",
    element: <Changepassword />,
  },
]);

export default router;
