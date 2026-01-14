import api from "./axios";


export const getAppointmentsApi = () => {
  return api.get("/api/v1/appointments/");
};


export const bookAppointmentApi = (data) => {
  return api.post("/api/v1/appointments/book/", data);
};


export const getStoreSchedulesApi = () => {
  return api.get("/api/v1/appointments/store-schedules/");
};

export const getAvailableSlotsApi = (storeId, date) => {
  return api.get(
    `/api/v1/appointments/stores/${storeId}/available-slots/`,
    { params: { date } }
  );
};

