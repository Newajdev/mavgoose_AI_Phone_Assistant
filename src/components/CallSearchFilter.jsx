import React, { useState } from "react";
import { Icon } from "@iconify/react";
import DropDown from "./DropDown";

export default function CallSearchFilter({
  onSearch,
  onTypeChange,
  onIssueChange,
  onDateChange,
}) {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedIssue, setSelectedIssue] = useState("all");
  const [selectedDate, setSelectedDate] = useState("today");

  /* ===== BACKEND ENUM SAFE ===== */

  const typeOptions = [
    { label: "All Type", value: "all" },
    { label: "AI Resolved", value: "AI_RESOLVED" },
    { label: "Warm Transfer", value: "WARM_TRANSFER" },
    { label: "Dropped", value: "DROPPED" },
    { label: "Appointment", value: "APPOINTMENT" },
  ];

  // ⚠️ issue MUST be integer ID (Swagger)
  const issueOptions = [
    { label: "All Issues", value: "all" },
    { label: "Screen", value: 1 },
    { label: "Battery", value: 2 },
    { label: "Software", value: 3 },
  ];

  const dateOptions = [
    { label: "Today", value: "today" },
    { label: "Past Week", value: "this_week" },
    { label: "Monthly", value: "this_month" },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      {/* SEARCH */}
      <div className="relative flex-1">
        <Icon
          icon="mdi:magnify"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#90A1B9]"
          width={20}
        />
        <input
          type="text"
          placeholder="Search by phone number..."
          className="w-full bg-[#0F172B80] border-2 border-[#2B7FFF33] rounded-xl py-3 pl-12 pr-4 text-white placeholder-[#90A1B9] outline-none focus:border-[#2B7FFF]"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      {/* FILTERS */}
      <div className="flex gap-4">
        <DropDown
          options={typeOptions}
          value={selectedType}
          onChange={(v) => {
            setSelectedType(v);
            onTypeChange?.(v === "all" ? undefined : v);
          }}
        />

        <DropDown
          options={issueOptions}
          value={selectedIssue}
          onChange={(v) => {
            setSelectedIssue(v);
            onIssueChange?.(v === "all" ? undefined : Number(v));
          }}
        />

        <DropDown
          options={dateOptions}
          value={selectedDate}
          onChange={(v) => {
            setSelectedDate(v);
            onDateChange?.(v);
          }}
        />
      </div>
    </div>
  );
}
