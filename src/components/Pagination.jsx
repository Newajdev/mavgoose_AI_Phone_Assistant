import React from "react";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  perPage = 20,
  onPageChange,
  onPerPageChange,
}) => {
  if (totalPages <= 1) return null;

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPages = () => {
    const pages = [];

    const addPage = (page) => {
      pages.push(
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition
          ${page === currentPage
              ? "bg-[#2B7FFF] text-white"
              : "bg-[#1E293B] text-gray-300 hover:bg-[#334155]"
            }`}
        >
          {page}
        </button>
      );
    };

    const addDots = (key) => {
      pages.push(
        <span key={key} className="px-2 text-gray-400">
          ...
        </span>
      );
    };

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) addPage(i);
    } else {
      addPage(1);

      if (currentPage > 4) addDots("start");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) addPage(i);

      if (currentPage < totalPages - 3) addDots("end");

      addPage(totalPages);
    }

    return pages;
  };

  return (
    <div className="w-full mt-6 flex items-center justify-between">

      {/* Empty div for spacing */}
      <div className="w-32" />

      {/* Center Pagination */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition
          ${currentPage === 1
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-[#1E293B] text-gray-300 hover:bg-[#334155]"
            }`}
        >
          Prev
        </button>

        {renderPages()}

        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition
          ${currentPage === totalPages
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-[#1E293B] text-gray-300 hover:bg-[#334155]"
            }`}
        >
          Next
        </button>
      </div>

      {/* Right Side Per Page Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Rows:</span>
        <select
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          className="bg-[#1E293B] text-gray-300 px-3 py-2 rounded-lg text-sm border border-gray-600 focus:border-[#2B7FFF] outline-none"
        >
          {[20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;
