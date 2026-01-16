import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { removeAllTokens } from "../utils/cookies";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [selectedStore, setSelectedStore] = useState(() => {
    const savedStore = localStorage.getItem("selectedStore");
    return savedStore ? JSON.parse(savedStore) : null;
  });

  const login = (authData) => {
    setUser(authData);
    localStorage.setItem("user", JSON.stringify(authData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    removeAllTokens(); // Remove tokens from cookies
  };

  const selectStore = (store) => {
    setSelectedStore(store);
    localStorage.setItem("selectedStore", JSON.stringify(store));
  };

  const authInfo = {
    user,
    login,
    logout,
    selectedStore,
    selectStore,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
