import React, { useEffect, useState } from "react";
import AppointmentStatsCard from "../components/AppointmentStatsCard";
import BookingLink from "../components/BookingLink";
import AppointmentCard from "../components/AppointmentCard";
import DropDown from "../components/DropDown";
import toast from "react-hot-toast";

import { getAppointmentsApi } from "../libs/appointments.api";
import { adaptAppointment } from "../utils/appointmentsAdapter";

export default function Appointment() {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await getAppointmentsApi();

      const adapted = res.data.map(adaptAppointment);
      setAppointments(adapted);
    } catch (err) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  const filterOptions = [
    { label: "All Appointments", value: "all" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Pending", value: "pending" },
    { label: "Canceled", value: "canceled" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AppointmentStatsCard
          title="Total Booked"
          value={appointments.length}
          subtext="All time"
          icon="mdi:calendar-multiselect"
          color="text-[#2B7FFF]"
        />

        <AppointmentStatsCard
          title="Pending"
          value={appointments.filter((a) => a.status === "pending").length}
          subtext="Awaiting action"
          icon="mdi:alert-circle-outline"
          color="text-[#FF8904]"
        />

        <AppointmentStatsCard
          title="Completed"
          value={appointments.filter((a) => a.status === "confirmed").length}
          subtext="Confirmed"
          icon="mdi:check-decagram-outline"
          color="text-[#05DF72]"
        />
      </div>

      <BookingLink url="https://techstore.com/book?id=store123" />

      <DropDown
        options={filterOptions}
        value={filter}
        onChange={setFilter}
        className="w-64"
      />

      {loading ? (
        <p className="text-center text-[#90A1B9]">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredAppointments.length ? (
            filteredAppointments.map((app) => (
              <AppointmentCard key={app.id} appointment={app} />
            ))
          ) : (
            <div className="col-span-full text-center text-[#90A1B9]">
              No appointments found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
