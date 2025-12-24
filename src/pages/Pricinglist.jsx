import React, { useState, useContext } from "react";
import { Icon } from "@iconify/react";
import { AuthContext } from "../provider/AuthContext";
import AddPriceModal from "../components/AddPriceModal";

export default function PricingList() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  const [filters, setFilters] = useState({
    category: "All Categories",
    brand: "Brand",
    model: "Model",
    repairType: "Repair Type",
  });

  const [currentPage, setCurrentPage] = useState(2);
  const totalPages = 11;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddPriceModalOpen, setIsAddPriceModalOpen] = useState(false);
  const [selectedPriceItem, setSelectedPriceItem] = useState(null);

  const [pricingData, setPricingData] = useState([
    {
      id: 1,
      category: "Mobile",
      brand: "Apple",
      model: "iphone 13",
      repairType: "Screen",
      price: 199,
      status: "Active",
      lastUpdated: "2025-12-10",
    },
    {
      id: 2,
      category: "Mobile",
      brand: "Apple",
      model: "iphone 13",
      repairType: "Screen",
      price: 199,
      status: "Active",
      lastUpdated: "2025-12-10",
    },
    {
      id: 3,
      category: "Mobile",
      brand: "Apple",
      model: "iphone 13",
      repairType: "Screen",
      price: 199,
      status: "Active",
      lastUpdated: "2025-12-10",
    },
    {
      id: 4,
      category: "Mobile",
      brand: "Apple",
      model: "iphone 13",
      repairType: "Screen",
      price: 199,
      status: "Active",
      lastUpdated: "2025-12-10",
    },
    {
      id: 5,
      category: "Mobile",
      brand: "Apple",
      model: "iphone 13",
      repairType: "Screen",
      price: 199,
      status: "Active",
      lastUpdated: "2025-12-10",
    },
    {
      id: 6,
      category: "Mobile",
      brand: "Apple",
      model: "iphone 13",
      repairType: "Screen",
      price: 199,
      status: "Disabled",
      lastUpdated: "2025-12-10",
    },
  ]);

  const toggleStatus = (id) => {
    setPricingData(
      pricingData.map((item) =>
        item.id === id
          ? {
            ...item,
            status: item.status === "Active" ? "Disabled" : "Active",
          }
          : item
      )
    );
  };

  const handleEdit = (id) => {
    const item = pricingData.find((p) => p.id === id);
    setSelectedPriceItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    // Save logic here
    setIsEditModalOpen(false);
    setSelectedPriceItem(null);
  };

  const renderPageNumbers = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    // Show current page and neighbors
    if (currentPage > 3) {
      pages.push("...");
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }

    // Show ellipsis before last page if needed
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="p-6">
      {/* Header with Filters and Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="bg-[#1D293D] border border-[#2B7FFF33] text-white px-4 py-2 rounded-lg focus:border-[#2B7FFF] focus:outline-none"
          >
            <option>All Categories</option>
            <option>Mobile</option>
            <option>Tablet</option>
            <option>Laptop</option>
          </select>

          <select
            value={filters.brand}
            onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
            className="bg-[#1D293D] border border-[#2B7FFF33] text-white px-4 py-2 rounded-lg focus:border-[#2B7FFF] focus:outline-none"
          >
            <option>Brand</option>
            <option>Apple</option>
            <option>Samsung</option>
            <option>Google</option>
          </select>

          <select
            value={filters.model}
            onChange={(e) => setFilters({ ...filters, model: e.target.value })}
            className="bg-[#1D293D] border border-[#2B7FFF33] text-white px-4 py-2 rounded-lg focus:border-[#2B7FFF] focus:outline-none"
          >
            <option>Model</option>
            <option>iPhone 13</option>
            <option>iPhone 14</option>
            <option>iPhone 15</option>
          </select>

          <select
            value={filters.repairType}
            onChange={(e) => setFilters({ ...filters, repairType: e.target.value })}
            className="bg-[#1D293D] border border-[#2B7FFF33] text-white px-4 py-2 rounded-lg focus:border-[#2B7FFF] focus:outline-none"
          >
            <option>Repair Type</option>
            <option>Screen</option>
            <option>Battery</option>
            <option>Camera</option>
          </select>
        </div>

        {/* Add New Price Button - Only for Admin */}
        {isAdmin && (
          <button
            onClick={() => setIsAddPriceModalOpen(true)}
            className="bg-[#1D293D] border border-[#2B7FFF33] text-white px-6 py-2 rounded-xl hover:bg-[#2B7FFF15] transition-all flex items-center gap-2"
          >
            <Icon icon="mdi:plus" width={20} />
            Add New Price
          </button>
        )}
      </div>

      {/* Pricing Table */}
      <div className="bg-[#1D293D80] border-2 border-[#2B7FFF33] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2B7FFF33]">
                <th className="text-left text-[#90A1B9] font-medium px-6 py-4 text-sm">
                  Category
                </th>
                <th className="text-left text-[#90A1B9] font-medium px-6 py-4 text-sm">
                  Brand
                </th>
                <th className="text-left text-[#90A1B9] font-medium px-6 py-4 text-sm">
                  Model
                </th>
                <th className="text-left text-[#90A1B9] font-medium px-6 py-4 text-sm">
                  Repair Type
                </th>
                <th className="text-left text-[#90A1B9] font-medium px-6 py-4 text-sm">
                  Price
                </th>
                <th className="text-left text-[#90A1B9] font-medium px-6 py-4 text-sm">
                  Status
                </th>
                <th className="text-left text-[#90A1B9] font-medium px-6 py-4 text-sm">
                  Last Updated
                </th>
                <th className="text-left text-[#90A1B9] font-medium px-6 py-4 text-sm">

                </th>
              </tr>
            </thead>
            <tbody>
              {pricingData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[#2B7FFF15] hover:bg-[#2B7FFF10] transition-all"
                >
                  <td className="px-6 py-4">
                    <span className="bg-[#2B7FFF] text-white text-xs px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white">{item.brand}</td>
                  <td className="px-6 py-4 text-white">{item.model}</td>
                  <td className="px-6 py-4 text-white">{item.repairType}</td>
                  <td className="px-6 py-4 text-white">${item.price}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(item.id)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs transition-all ${item.status === "Active"
                        ? "bg-[#05DF7215] text-[#05DF72]"
                        : "bg-[#90A1B915] text-[#90A1B9]"
                        }`}
                    >
                      <div
                        className={`size-2 rounded-full ${item.status === "Active" ? "bg-[#05DF72]" : "bg-[#90A1B9]"
                          }`}
                      ></div>
                      {item.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-white">{item.lastUpdated}</td>
                  <td className="px-6 py-4">
                    {isAdmin && (
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="p-2 hover:bg-[#2B7FFF15] rounded-lg transition-colors"
                      >
                        <Icon icon="mdi:pencil" className="text-[#2B7FFF]" width={20} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 text-[#90A1B9] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <Icon icon="mdi:chevron-left" width={20} />
          Previous
        </button>

        {renderPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && setCurrentPage(page)}
            disabled={page === "..."}
            className={`size-10 rounded-lg transition-all ${page === currentPage
              ? "bg-[#2B7FFF] text-white"
              : page === "..."
                ? "text-[#90A1B9] cursor-default"
                : "text-white hover:bg-[#2B7FFF15]"
              }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-[#90A1B9] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          Next
          <Icon icon="mdi:chevron-right" width={20} />
        </button>
      </div>

      {/* Edit Price Modal */}
      {isEditModalOpen && selectedPriceItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1D293D] border-2 border-[#2B7FFF33] rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-6">
              <Icon icon="mdi:pencil" className="text-[#2B7FFF]" width={32} />
              <h3 className="text-xl font-bold text-white">Edit Price</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[#90A1B9] text-sm font-medium mb-2 block">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white">$</span>
                  <input
                    type="number"
                    defaultValue={selectedPriceItem.price}
                    className="w-full bg-[#0F172B60] border-2 border-[#2B7FFF15] rounded-xl pl-8 pr-4 py-3 text-white focus:border-[#2B7FFF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#90A1B9] text-sm font-medium mb-2 block">
                  Status
                </label>
                <select
                  defaultValue={selectedPriceItem.status}
                  className="w-full bg-[#0F172B60] border-2 border-[#2B7FFF15] rounded-xl px-4 py-3 text-white focus:border-[#2B7FFF] focus:outline-none"
                >
                  <option>Active</option>
                  <option>Disabled</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 bg-[#0F172B60] border border-[#2B7FFF15] text-white px-4 py-3 rounded-xl hover:bg-[#2B7FFF15] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-[#2B7FFF] text-white px-4 py-3 rounded-xl hover:bg-[#2B7FFF]/80 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Price Modal */}
      {isAddPriceModalOpen && (
        <AddPriceModal
          onClose={() => setIsAddPriceModalOpen(false)}
          onSave={(newData) => {
            const newPrice = {
              id: pricingData.length + 1,
              ...newData,
              lastUpdated: new Date().toISOString().split('T')[0]
            };
            setPricingData([newPrice, ...pricingData]);
            setIsAddPriceModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
