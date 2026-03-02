import React, { useEffect, useState, useContext, useRef } from "react";
import NotificationFilters from "../components/NotificationFilters";
import DetailedNotificationCard from "../components/DetailedNotificationCard";
import {
  getNotificationsApi,
  markNotificationReadApi,
  deleteNotificationApi,
} from "../libs/notifications.api";
import { mapNotification } from "../utils/notificationMapper";
import { AuthContext } from "../provider/AuthContext";
import toast from "react-hot-toast";
import CallLogs from "./CallLogs";

export default function Notifications() {
  const { role, getActiveStoreId } = useContext(AuthContext);
  const storeId = getActiveStoreId();

  const [activeFilter, setActiveFilter] = useState("all");
  const [allNotifications, setAllNotifications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const firstLoadRef = useRef(true);

  /* ================= FETCH ================= */
  const fetchNotifications = async (showToast = false) => {
    try {
      setLoading(true);

      const params = {};

      // Filter by store only for non-admins
      if (role !== "SUPER_ADMIN") {
        if (storeId) params.store = storeId;
      }

      // Filter by unread or category
      if (activeFilter === "unread") params.status = "unread";
      else if (activeFilter !== "all") params.category = activeFilter.toUpperCase();

      const { data } = await getNotificationsApi(params);
      const list = Array.isArray(data) ? data : data?.results || [];

      const mapped = list.map(mapNotification);
      setAllNotifications(mapped);

      // Apply active filter
      applyFilter(mapped, activeFilter);


    } catch (error) {
      console.error("Notification fetch failed", error?.response?.data || error);
      toast.error("Failed to load notifications", { id: "notifications-error" });
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (allList, filter) => {
    if (filter === "all") {
      setNotifications(allList);
    } else if (filter === "unread") {
      setNotifications(allList.filter((n) => n.unread));
    } else {
      setNotifications(
        allList.filter((n) => n.type && n.type.toLowerCase() === filter)
      );
    }
  };

  /* ================= FILTER CHANGE ================= */
  useEffect(() => {
    applyFilter(allNotifications, activeFilter);
  }, [activeFilter, allNotifications]);

  /* ================= STORE CHANGE ================= */
  useEffect(() => {
    if (role !== "SUPER_ADMIN" && !storeId) return;

    fetchNotifications(!firstLoadRef.current);
    firstLoadRef.current = false;
  }, [storeId]);

  /* ================= ACTIONS ================= */
  const handleMarkRead = async (id) => {
    try {
      await markNotificationReadApi(id);
      setAllNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
      );
    } catch (error) {
      console.error("Mark read failed", error);
    }
  };
  const handleDismiss = async (id) => {
    try {
      await deleteNotificationApi(id); // delete from DB
      setAllNotifications((prev) => prev.filter((n) => n.id !== id)); // remove from UI
    } catch (error) {
      console.error("Failed to delete notification", error);
      toast.error("Failed to delete notification");
    }
  };


  /* ================= UI ================= */
  return (
    <div>
      <NotificationFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        notifications={allNotifications} // always pass full list for counts
      />

      <div className="mt-8 space-y-1">
        {loading ? (
          <div className="text-center text-[#90A1B9] py-10">
            Loading notifications...
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <DetailedNotificationCard
              key={notification.id}
              notification={notification}
              onMarkRead={handleMarkRead}
              onDismiss={handleDismiss}
            />
          ))
        ) : (
          <div className="bg-[#1D293D80] border-2 border-[#2B7FFF33] rounded-2xl p-12 text-center text-[#90A1B9]">
            No notifications found.
          </div>
        )}
      </div>
    </div>
  );
}
