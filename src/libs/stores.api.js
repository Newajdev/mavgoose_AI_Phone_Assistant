import api from "./api";

export const getStoresApi = () =>
  api.get("/api/v1/stores/");

export const getStoreApi = (id) =>
  api.get(`/api/v1/stores/${id}/`);

export const createStoreApi = (data) =>
  api.post("/api/v1/stores/", data);

export const updateStoreApi = (id, data) =>
  api.patch(`/api/v1/stores/${id}/`, data);

export const deleteStoreApi = (id) =>
  api.delete(`/api/v1/stores/${id}/`);
