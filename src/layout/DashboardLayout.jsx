import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";
import { useState } from "react";

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative h-screen">
      {/* ================= Desktop Layout ================= */}
      <div className="hidden md:grid md:grid-cols-[300px_1fr] md:grid-rows-[90px_1fr] h-full">
        <aside className="row-span-2 bg-[#111B3C] border-r-2 border-[#2B7FFF33]">
          <Navbar />
        </aside>

        <header className="flex items-center px-6 py-8 bg-[#111B3C]">
          <Topbar />
        </header>

        <main className="bg-[#162456] p-6 overflow-y-auto hide-scrollbar min-h-0">
          <Outlet />
        </main>
      </div>

      {/* ================= Mobile Layout ================= */}
      <div className="md:hidden flex flex-col h-full">
        <header className="flex items-center justify-between px-4 py-4 bg-[#111B3C] border-b border-[#2B7FFF33]">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-[#2B7FFF15] rounded-lg transition-colors"
          >
            ☰
          </button>
          <Topbar isMobile />
        </header>

        <main className="flex-1 bg-[#162456] p-4 overflow-y-auto hide-scrollbar min-h-0">
          <Outlet />
        </main>
      </div>

      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="fixed top-0 left-0 h-full w-70 bg-[#111B3C] z-50 md:hidden">
            <Navbar onClose={() => setIsMobileMenuOpen(false)} />
          </aside>
        </>
      )}
    </div>
  );
}
