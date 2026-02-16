import { useEffect, useState, useContext, useRef } from "react";
import toast from "react-hot-toast";

import DashboardStatus from "../components/DashboardStatus";
import DropDown from "../components/DropDown";
import Graph from "../components/Graph";
import NotificationCard from "../components/NotificatonCard";
import TopRepairRequests from "../components/TopRepairRequests";

import {
  getCallTrendsApi,
  getStoreSummaryApi,
} from "../libs/callDashboard.api";

import { AuthContext } from "../provider/AuthContext";

export default function Dashboard() {
  const { role, getActiveStoreId, selectedStore } =
    useContext(AuthContext);

  const storeId = getActiveStoreId();

  const [selectedTime, setSelectedTime] = useState("today");
  const [loading, setLoading] = useState(false);

  const [trendData, setTrendData] = useState([]);
  const [totalCalls, setTotalCalls] = useState(0);
  const [storeSummary, setStoreSummary] = useState(null);

  const prevStoreRef = useRef(null);

  const options = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "this-week" },
    { label: "This Month", value: "this-month" },
    { label: "This Year", value: "this-year" },
  ];


  /* ================= STORE CHANGE DETECT ================= */
  useEffect(() => {
    if (!storeId) return;

    // 🔥 only fire when store actually changes
    if (prevStoreRef.current && prevStoreRef.current !== storeId) {
      toast.loading("Switching store...", { id: "store-change" });
    }

    prevStoreRef.current = storeId;
  }, [storeId]);

  /* ================= FETCH DASHBOARD ================= */
  useEffect(() => {
    if (!storeId) return;
    if (role === "SUPER_ADMIN" && !storeId) return;

    fetchDashboardData(storeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId, selectedTime]);

  const fetchDashboardData = async (activeStoreId) => {
    if (!activeStoreId) return;

    try {
      setLoading(true);

      const [trendRes, summaryRes] = await Promise.all([
        getCallTrendsApi(activeStoreId, { range: selectedTime }),
        getStoreSummaryApi(activeStoreId, { range: selectedTime }),
      ]);


      // trendRes now returns array of {label, count}
      setTrendData(trendRes?.data?.trend || []);
      setTotalCalls(trendRes?.data?.total_calls || 0);

      // store summary
      setStoreSummary(summaryRes?.data?.[0] || null);

      toast.success(
        `Dashboard loaded for ${selectedStore?.name || "store"}`,
        { id: "store-change" }
      );
    } catch (error) {
      console.error("Dashboard API Error:", error);
      toast.error("Failed to load dashboard data", { id: "store-change" });
    } finally {
      setLoading(false);
    }
  };


  /* ================= EMPTY STATE ================= */
  if (role === "SUPER_ADMIN" && !storeId) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-[#90A1B9]">
        <p>Please select a store from the sidebar to view dashboard data.</p>
      </div>
    );
  }

  return (
    <div>
      {/* ================= STATUS CARDS ================= */}
      <div className="grid grid-cols-3 gap-6 pb-4">
        <DashboardStatus
          title={`Total Calls ${options.find(o => o.value === selectedTime)?.label}`}
          value={storeSummary?.total_calls ?? 0}
          icone="line-md:phone"
          styls="from-[#00B8DB] to-[#2B7FFF]"
        />

        <DashboardStatus
          title="AI-Handled Calls"
          value={storeSummary?.ai_handled ?? 0}
          icone="bx:bot"
          styls="from-[#AD46FF] to-[#F6339A]"
        />

        <DashboardStatus
          title="Warm Transfer"
          value={storeSummary?.warm_transfer ?? 0}
          icone="fluent:arrow-wrap-20-filled"
          styls="from-[#FB2C36] to-[#FF6900]"
        />

        <DashboardStatus
          title="Appointments Booked"
          value={storeSummary?.appointments_booked ?? 0}
          icone="uil:schedule"
          styls="from-[#00BC7D] to-[#00C950]"
        />

        <DashboardStatus
          title="Missed/Failed Calls"
          value={storeSummary?.missed_calls ?? 0}
          icone="oui:cross-in-circle-empty"
          styls="from-[#FF2056] to-[#FB2C36]"
        />

        <DashboardStatus
          title="Avg Call Duration"
          value={storeSummary?.avg_call_duration ?? "0:00"}
          icone="teenyicons:stopwatch-outline"
          styls="from-[#2B7FFF] to-[#615FFF]"
        />
      </div>

      {/* ================= CALL TREND GRAPH ================= */}
      <div className="bg-[#0F172B80] border border-[#2B7FFF33] p-6 rounded-2xl">

        <div className="flex items-center justify-between pb-6">
          <div>
            <h3 className="text-xl">Call Trends - {options.find(o => o.value === selectedTime)?.label}</h3>
            <p className="text-sm text-[#90A1B9] pt-3">
              Total: {totalCalls} calls
            </p>
          </div>

          <DropDown
            options={options}
            value={selectedTime}
            onChange={setSelectedTime}
          />
        </div>

        <Graph data={trendData} loading={loading} />
      </div>

      {/* ================= BOTTOM SECTION ================= */}
      {/* <div className="flex items-stretch justify-center gap-x-8 mt-8">
        <div className="bg-[#0F172B80] border-2 border-[#2B7FFF33] p-8 rounded-2xl w-1/2">
          <h2 className="text-xl mb-4">Recent Activity</h2>

          <NotificationCard
            title="No recent activity"
            time="—"
            style="bg-[#64748B]"
          />
        </div>

        <div className="w-1/2">
          <TopRepairRequests />
        </div>
      </div> */}
    </div>
  );
}
