export const adaptAppointment = (app) => {
  const statusMap = {
    pending: "pending",
    confirmed: "confirmed",
    canceled: "canceled",
    PENDING: "pending",
    CONFIRMED: "confirmed",
    CANCELED: "canceled",
  };

  return {
    id: app.id,

    storeName: app.store_name,

    clientName: app.client_name,
    phone: app.client_phone,

    status: statusMap[app.status] || "pending",

    date: app.date,

    startTime: app.start_time,
    endTime: app.end_time,

    serialNo: app.serial_no,
  };
};
