import api from "./axios";

export const loginApi = (data) => api.post("/auth/login/", data);
export const registerApi = (data) => api.post("/auth/register/", data);

export const getProfileApi = () => api.get("/auth/me/");
export const updateProfileApi = (data) => api.patch("/auth/me/", data);

export const forgotPasswordApi = (data) =>
  api.post("/auth/forgot-password/", data);

export const verifyOtpApi = (data) =>
  api.post("/auth/verify-otp/", data);

export const resendOtpApi = (data) =>
  api.post("/auth/resend-otp/", data);

export const resetPasswordApi = (data) =>
  api.post("/auth/reset-password/", data);

export const changePasswordApi = (data) =>
  api.post("/auth/change-password/", data);
