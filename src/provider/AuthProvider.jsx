import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { removeAllTokens } from "../utils/cookies";
import { getProfileApi } from "../libs/auth.api";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("auth");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (authData) => {
    setUser(authData);
    localStorage.setItem("auth", JSON.stringify(authData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth");
    removeAllTokens();
  };

  // 🔥 NEW: fetch profile & sync everywhere
  const fetchProfile = async () => {
    try {
      const res = await getProfileApi();
      setUser((prev) => {
        const updated = {
          ...prev,
          ...res.data,
        };
        localStorage.setItem("auth", JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.log("Profile sync failed");
    }
  };

  const role = user?.role || user?.user?.role;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        login,
        logout,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
