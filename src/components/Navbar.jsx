import { useContext, useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import NavBtn from "./NavBtn";
import { AuthContext } from "../provider/AuthContext";

const stores = [
  { id: 1, name: "Downtown Manhattan", address: "123 Broadway, NY", status: "online" },
  { id: 2, name: "Brooklyn Heights", address: "456 Atlantic Ave, NY", status: "online" },
  { id: 3, name: "Queens Center", address: "789 Queens Blvd, NY", status: "online" },
  { id: 4, name: "Jersey City", address: "321 Newark Ave, NJ", status: "offline" },
  { id: 5, name: "Boston Downtown", address: "555 Boylston St, MA", status: "online" },
];

export default function Navbar({ onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, selectedStore, selectStore } = useContext(AuthContext);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);


  /* 🔽 ADD START */
  const [nabLinks, setNabLinks] = useState([]);
  /* 🔼 ADD END */

  const baseLinks = [
    { title: "Dashboard Overview", icon: "fluent:home-12-regular", activeI: "fluent:home-24-filled", path: "/dashboard" },
    { title: "Call Logs", icon: "proicons:call", activeI: "fluent:call-12-filled", path: "/call-logs" },
    { title: "Call Transfer", icon: "mingcute:transfer-3-line", activeI: "streamline-ultimate:data-transfer-circle-bold", path: "/call-transfer" },
    { title: "Appointments", icon: "hugeicons:appointment-01", activeI: "mingcute:schedule-fill", path: "/appointment" },
  ];

  const adminLinks = [
    { title: "Pricing Management", icon: "ph:currency-dollar-bold", activeI: "heroicons:currency-dollar-16-solid", path: "/pricing-management" },
    { title: "AI behavior Settings", icon: "ant-design:robot-outlined", activeI: "ant-design:robot-filled", path: "/ai-behavior-settings" },
    { title: "API Settings", icon: "solar:phone-calling-outline", activeI: "solar:phone-calling-bold", path: "/api-settings" },
    { title: "User Management", icon: "rivet-icons:user-group", activeI: "rivet-icons:user-group-solid", path: "/user-management" },
  ];

  const StoreLinks = [
    { title: "Pricing list", icon: "ph:currency-dollar-bold", activeI: "heroicons:currency-dollar-16-solid", path: "/pricing-list" },

  // Helper function to get user role
  const getUserRole = () => {
    if (!user) return null;
    const role = user?.role || user?.user?.role || null;
    if (!role) return null;
    
    // Normalize role
    const roleUpper = role.toUpperCase();
    if (roleUpper === "SUPERADMIN" || roleUpper === "SUPER_ADMIN") return "SuperAdmin";
    if (roleUpper === "STOREMANAGER" || roleUpper === "STORE_MANAGER") return "StoreManager";
    if (roleUpper === "STAFF") return "Staff";
    return role;
  };

  const userRole = getUserRole();

  // Base links - available to all roles
  const baseLinks = [
    {
      title: "Dashboard Overview",
      icon: "fluent:home-12-regular",
      activeI: "fluent:home-24-filled",
      path: "/dashboard",
      roles: ["SuperAdmin", "StoreManager", "Staff"],
    },
    {
      title: "Call Logs",
      icon: "proicons:call",
      activeI: "fluent:call-12-filled",
      path: "/call-logs",
      roles: ["SuperAdmin", "StoreManager", "Staff"],
    },
    {
      title: "Call Transfer",
      icon: "mingcute:transfer-3-line",
      activeI: "streamline-ultimate:data-transfer-circle-bold",
      path: "/call-transfer",
      roles: ["SuperAdmin", "StoreManager"],
    },
    {
      title: "Appointments",
      icon: "hugeicons:appointment-01",
      activeI: "mingcute:schedule-fill",
      path: "/appointment",
      roles: ["SuperAdmin", "StoreManager", "Staff"],
    },
  ];

  // SuperAdmin only links
  const superAdminLinks = [
    {
      title: "Pricing Management",
      icon: "ph:currency-dollar-bold",
      activeI: "heroicons:currency-dollar-16-solid",
      path: "/pricing-management",
      roles: ["SuperAdmin"],
    },
    {
      title: "AI behavior Settings",
      icon: "ant-design:robot-outlined",
      activeI: "ant-design:robot-filled",
      path: "/ai-behavior-settings",
      roles: ["SuperAdmin"],
    },
    {
      title: "API Settings",
      icon: "solar:phone-calling-outline",
      activeI: "solar:phone-calling-bold",
      path: "/api-settings",
      roles: ["SuperAdmin"],
    },
    {
      title: "User Management",
      icon: "rivet-icons:user-group",
      activeI: "rivet-icons:user-group-solid",
      path: "/user-management",
      roles: ["SuperAdmin"],
    },
  ];

  // StoreManager links
  const storeManagerLinks = [
    {
      title: "Pricing list",
      icon: "ph:currency-dollar-bold",
      activeI: "heroicons:currency-dollar-16-solid",
      path: "/pricing-list",
      roles: ["StoreManager"],
    },

  ];

  // Settings - available to all
  const bottomLinks = [

    { title: "Settings", icon: "qlementine-icons:settings-16", activeI: "clarity:settings-solid", path: "/setting" },
  ];

  /* 🔽 ADD START — ONLY useEffect */
  useEffect(() => {

  if (user?.role === "SUPER_ADMIN") {
    console.log("NAVBAR MODE: ADMIN");

    setNabLinks([
      ...baseLinks,
      ...adminLinks,
      ...bottomLinks,
    ]);
  } else {
    console.log("NAVBAR MODE: STORE / STAFF");

    setNabLinks([
      ...baseLinks,
      ...StoreLinks,
      ...bottomLinks,
    ]);
  }
}, [user]);
  /* 🔼 ADD END */

    {
      title: "Settings",
      icon: "qlementine-icons:settings-16",
      activeI: "clarity:settings-solid",
      path: "/setting",
      roles: ["SuperAdmin", "StoreManager", "Staff"],
    },
  ];

  // Filter links based on user role
  const getFilteredLinks = () => {
    if (!userRole) return [];
    
    const allLinks = [...baseLinks];
    
    if (userRole === "SuperAdmin") {
      allLinks.push(...superAdminLinks);
    } else if (userRole === "StoreManager") {
      allLinks.push(...storeManagerLinks);
    }
    
    allLinks.push(...bottomLinks);
    
    // Filter links that user has access to
    return allLinks.filter(link => link.roles.includes(userRole));
  };

  const nabLinks = getFilteredLinks();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-full p-5 flex flex-col justify-between h-screen relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-[#2B7FFF15] rounded-lg transition-colors md:hidden"
        >
          <Icon icon="mdi:close" className="text-white" width={24} />
        </button>
      )}

      <div className="flex items-center justify-center mb-4">
        <img src="/logo.png" />
      </div>

      {/* Admin store selector — unchanged */}
      {user?.role === "SUPER_ADMIN" && (

      {/* Store Selector for SuperAdmin only */}
      {userRole === "SuperAdmin" && (

        <div
          onClick={() => setIsStoreModalOpen(true)}
          className="bg-[#1D293D80] border border-[#2B7FFF33] rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-[#2B7FFF10] transition-all"
        >
          <span className="text-white text-sm">
            {selectedStore?.name || "Brooklyn Heights"}
          </span>
          <Icon icon="mdi:chevron-down" className="text-[#90A1B9]" />
        </div>
      )}

      <div className="flex-1 mt-8">
        <ul className="flex flex-col gap-6">
          {nabLinks.map((itm, idx) => (
            <li key={idx}>
              {location.pathname === itm.path ? (
                <NavBtn icon={itm.activeI} title={itm.title} path={itm.path} />
              ) : (
                <NavLink to={itm.path} className="flex items-center gap-4 p-3">
                  <Icon icon={itm.icon} width={32} height={32} />
                  <span className="text-xl">{itm.title}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className="group flex items-center justify-center gap-4 bg-red-900 text-white text-2xl py-3 px-6 rounded-xl"
      >
        <Icon icon="heroicons-outline:logout" width={28} height={28} />
        <span>Logout</span>
      </button>
    </div>
  );
}
