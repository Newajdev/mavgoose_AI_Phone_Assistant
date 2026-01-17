import Cookies from 'js-cookie';

// Cookie names
export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
};

// Set JWT token in cookie
export const setToken = (token, tokenType = 'access') => {
  const cookieName = tokenType === 'access' ? COOKIE_NAMES.ACCESS_TOKEN : COOKIE_NAMES.REFRESH_TOKEN;
  
  // Set cookie with 7 days expiration
  Cookies.set(cookieName, token, {
    expires: 7, // 7 days
    secure: true, // Only send over HTTPS in production
    sameSite: 'strict', // CSRF protection
    path: '/',
  });
};

// Get JWT token from cookie
export const getToken = (tokenType = 'access') => {
  const cookieName = tokenType === 'access' ? COOKIE_NAMES.ACCESS_TOKEN : COOKIE_NAMES.REFRESH_TOKEN;
  return Cookies.get(cookieName);
};

// Remove JWT token from cookie
export const removeToken = (tokenType = 'access') => {
  const cookieName = tokenType === 'access' ? COOKIE_NAMES.ACCESS_TOKEN : COOKIE_NAMES.REFRESH_TOKEN;
  Cookies.remove(cookieName, { path: '/' });
};

// Remove all tokens
export const removeAllTokens = () => {
  removeToken('access');
  removeToken('refresh');
};
