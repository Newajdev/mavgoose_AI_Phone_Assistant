import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";
import { useContext, useEffect, useState } from "react";


export default function DashboardLayout() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  

  useEffect(() => {
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="relative h-screen">
      {/* ================= Desktop Layout ================= */}
      <div className="hidden md:grid md:grid-cols-[300px_1fr] md:grid-rows-[90px_1fr] h-full">
        {/* Sidebar */}
        <aside className="row-span-2 bg-[#111B3C] border-r-2 border-[#2B7FFF33]">
          <Navbar />
        </aside>

        {/* Header */}
        <header className="flex items-center px-6 py-8 bg-[#111B3C]">
          <Topbar />
        </header>

        {/* Main Content */}
        <main className="bg-[#162456] p-6 overflow-y-auto hide-scrollbar min-h-0">
          <Outlet />
        </main>
      </div>

      {/* ================= Mobile Layout ================= */}
      <div className="md:hidden flex flex-col h-full">
        {/* Mobile Header */}
        <header className="flex items-center justify-between px-4 py-4 bg-[#111B3C] border-b border-[#2B7FFF33]">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-[#2B7FFF15] rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <Topbar isMobile />
        </header>

        {/* Mobile Main */}
        <main className="flex-1 bg-[#162456] p-4 overflow-y-auto hide-scrollbar min-h-0">
          <Outlet />
        </main>
      </div>

      {/* ================= Mobile Menu Overlay ================= */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Slide Menu */}
          <aside className="fixed top-0 left-0 h-full w-[280px] bg-[#111B3C] border-r-2 border-[#2B7FFF33] z-50 md:hidden">
            <Navbar onClose={() => setIsMobileMenuOpen(false)} />
          </aside>
        </>
      )}
    </div>
  );
}
