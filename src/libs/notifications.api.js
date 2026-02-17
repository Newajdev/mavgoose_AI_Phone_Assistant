import axios from "./axios";

export const getNotificationsApi = (params = {}) =>
  axios.get("/api/v1/notifications/", { params });

export const markNotificationReadApi = (id) =>
  axios.patch(`/api/v1/notifications/${id}/read/`);

export const deleteNotificationApi = (id) =>
  axios.delete(`/api/v1/notifications/${id}/delete/`);