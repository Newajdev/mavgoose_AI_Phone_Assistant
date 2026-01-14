import api from "./axios";


export const getCallLogsApi = (params = {}) => {
  return api.get("/api/v1/call/details/", { params });
};

export const getCallLogDetailsApi = (id) => {
  return api.get(`/api/v1/call/details/${id}/`);
};
