import React from "react";

export default function NotificationFilters({
  activeFilter,
  onFilterChange,
  notifications,
}) {
  const filters = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "calls", label: "Calls" },
    { id: "system", label: "System" },
  ];

  const getCount = (id) => {
    if (!notifications) return 0;

    if (id === "all") return notifications.length;
    if (id === "unread") return notifications.filter((n) => n.unread).length;

    // category filters use `type` instead of `category`
    return notifications.filter(
      (n) => n.type && n.type.toLowerCase() === id
    ).length;
  };



  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-6 py-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${activeFilter === filter.id
            ? "bg-[#2B7FFF10] border-[#2B7FFF] text-white"
            : "bg-[#1D293D80] border-[#2B7FFF33] text-[#90A1B9]"
            }`}
        >
          <span className="text-sm">{filter.label}</span>
          <span className="text-xs opacity-70">{getCount(filter.id)}</span>
        </button>
      ))}
    </div>
  );
}
