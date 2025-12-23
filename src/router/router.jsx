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

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/call-logs",
        element: <CallLogs />,
      },
      {
        path: "/call-transfer",
        element: <CallTransfer />,
      },
      {
        path: "/pricing-list",
        element: <PricingList />,
      },
      {
        path: "/appointment",
        element: <Appointment />,
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },
      {
        path: "/setting",
        element: <Setting />,
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
]);

export default router;
