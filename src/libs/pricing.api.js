import api from "./axios";


export const getCategoriesApi = () =>
  api.get("/api/v1/services/categories/");

export const getBrandsApi = (category) =>
  api.get("/api/v1/services/brands/", {
    params: category ? { category } : {},
  });

export const getDeviceModelsApi = (brand) =>
  api.get("/api/v1/services/device-models/", {
    params: brand ? { brand } : {},
  });

export const getRepairTypesApi = () =>
  api.get("/api/v1/services/repair-types/");


export const getPriceListApi = (filters = {}) =>
  api.get("/api/v1/services/price-list/", {
    params: {
      category: filters.category || undefined,
      brand: filters.brand || undefined,
      device_model: filters.model || undefined,
      repair_type: filters.repairType || undefined,
    },
  });

export const createPriceApi = (data) =>
  api.post("/api/v1/services/price-list/", data);

export const updatePriceApi = (id, data) =>
  api.patch(`/api/v1/services/price-list/${id}/`, data);
