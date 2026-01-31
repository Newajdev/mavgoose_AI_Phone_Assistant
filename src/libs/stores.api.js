import api from "./axios";

export const getStoresApi = () => {
  return api.get("api/v1/stores/");
};
