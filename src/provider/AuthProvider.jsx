import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { removeAllTokens } from "../utils/cookies";
import { getProfileApi } from "../libs/auth.api";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("auth");
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedStore, setSelectedStore] = useState(() => {
    const savedStore = localStorage.getItem("selectedStore");
    return savedStore ? JSON.parse(savedStore) : null;
  });

  const login = (authData) => {
    setUser(authData);
    localStorage.setItem("auth", JSON.stringify(authData));
  };

  const logout = () => {
    setUser(null);
    setSelectedStore(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("selectedStore");
    removeAllTokens();
  };

  const fetchProfile = async () => {
    try {
      const res = await getProfileApi();
      setUser((prev) => {
        const updated = { ...prev, ...res.data };
        localStorage.setItem("auth", JSON.stringify(updated));
        return updated;
      });
    } catch {
      console.log("Profile sync failed");
    }
  };

  const role = user?.role || user?.user?.role;

  const selectStore = (store) => {
    setSelectedStore(store);
    localStorage.setItem("selectedStore", JSON.stringify(store));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        login,
        logout,
        fetchProfile,
        selectedStore,
        selectStore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
