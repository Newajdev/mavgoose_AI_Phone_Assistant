import axios from "./axios";

export const getCallTrendsApi = (storeId, params = {}) => {
  return axios.get(`/api/v1/call/call-trends/`, {
    params: { store: storeId, ...params },
  });
};

export const getStoreSummaryApi = (storeId, params = {}) => {
  if (!storeId) return Promise.resolve({ data: [] });
  return axios.get(`/api/v1/call/store-summary/`, {
    params: { store_id: storeId, ...params },
  });
};

