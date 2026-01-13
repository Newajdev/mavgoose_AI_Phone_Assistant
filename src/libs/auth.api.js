import api from "./axios";

// 👤 Get my profile
export const getProfileApi = () => {
  return api.get("/auth/me/");
};

// ✏️ Update my profile
export const updateProfileApi = (data) => {
  return api.put("/auth/me/", data);
};


export const loginApi = (data) => {
  return api.post("/auth/login/", data);
};

export const registerApi = (data) => {
  return api.post("/auth/register/", data);
};

export const forgotPasswordApi = (data) => {
  return api.post("/auth/forgot-password/", data);
};

export const verifyOtpApi = (data) => {
  return api.post("/auth/verify-otp/", data);
};

export const resendOtpApi = (data) => {
  return api.post("/auth/resend-otp/", data);
};

export const resetPasswordApi = (data) => {
  return api.post("/auth/reset-password/", data);
};

export const changePasswordApi = (data) => {
  return api.put("/auth/change-password/", data);
};
