import api from "./axios";

// ================================
// Transfer Conditions
// ================================
export const getTransferConditionsApi = () => {
  return api.get("/api/v1/call-transfer/conditions/");
};

// ================================
// Transfer Contacts
// ================================
export const getTransferContactsApi = (params = {}) => {
  return api.get("/api/v1/call-transfer/contacts/", {
    params,
  });
};

// ================================
// Call Transfer Rules
// ================================
export const getCallTransferRulesApi = (params = {}) => {
  return api.get("/api/v1/call-transfer/", {
    params,
  });
};

export const createCallTransferRuleApi = (data) => {
  return api.post("/api/v1/call-transfer/", data);
};

export const deleteCallTransferRuleApi = (id) => {
  return api.delete(`/api/v1/call-transfer/${id}/`);
};
