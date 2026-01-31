// src/libs/aiBehavior.api.js
import api from "./axios"; // your axios instance

// GET AI behavior
export const getAIBehaviorApi = (storeId) => {
  return api.get(`/api/v1/stores/${storeId}/ai-behavior/`);
};

// CREATE AI behavior
export const createAIBehaviorApi = (storeId, payload) => {
  return api.post(
    `/api/v1/stores/${storeId}/ai-behavior/create/`,
    payload
  );
};

// UPDATE AI behavior
export const updateAIBehaviorApi = (storeId, payload) => {
  return api.patch(
    `/api/v1/stores/${storeId}/ai-behavior/`,
    payload
  );
};
