import api from "./axios";

// Clean query params helper
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

// GET: Call logs list
export const getCallLogsApi = (params = {}) => {
  return api.get("/api/v1/call/details/", {
    params: cleanParams(params),
  });
};

// GET: Single call details (future scalable)
export const getCallLogDetailsApi = (id) => {
  return api.get(`/api/v1/call/details/${id}/`);
};
