import axios from "./axios";

export const getAIBehaviorApi = (storeId) =>
  axios.get(`/api/v1/stores/${storeId}/ai-behavior/`);

export const createAIBehaviorApi = (storeId, payload) =>
  axios.post(`/api/v1/stores/${storeId}/ai-behavior/create/`, payload);

export const updateAIBehaviorApi = (storeId, payload) =>
  axios.put(`/api/v1/stores/${storeId}/ai-behavior/`, payload);
