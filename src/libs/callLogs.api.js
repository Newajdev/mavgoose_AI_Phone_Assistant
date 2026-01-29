import api from "./axios";

const cleanParams = (params = {}) => {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) =>
        value !== "" &&
        value !== null &&
        value !== undefined
    )
  );
};

export const getCallLogsApi = (params = {}) => {
  return api.get("/api/v1/call/details/", {
    params: cleanParams(params),
  });
};

export const getCallLogDetailsApi = (id) => {
  return api.get(`/api/v1/call/details/${id}/`);
};
