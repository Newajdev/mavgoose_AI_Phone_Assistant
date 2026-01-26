import Cookies from "js-cookie";

export const COOKIE_NAMES = {
  ACCESS: "access_token",
  REFRESH: "refresh_token",
};

const baseOptions = {
  path: "/",
  sameSite: "lax",
  secure: import.meta.env.PROD,
};

export const setToken = (token, type = "access") => {
  Cookies.set(
    type === "access" ? COOKIE_NAMES.ACCESS : COOKIE_NAMES.REFRESH,
    token,
    { ...baseOptions, expires: type === "access" ? 1 : 7 }
  );
};

export const getToken = (type = "access") =>
  Cookies.get(type === "access" ? COOKIE_NAMES.ACCESS : COOKIE_NAMES.REFRESH);

export const removeAllTokens = () => {
  Cookies.remove(COOKIE_NAMES.ACCESS, { path: "/" });
  Cookies.remove(COOKIE_NAMES.REFRESH, { path: "/" });
};
