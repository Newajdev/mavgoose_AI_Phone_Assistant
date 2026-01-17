import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { removeAllTokens } from "../utils/cookies";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("auth"); // ✅ FIX
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [selectedStore, setSelectedStore] = useState(() => {
    const savedStore = localStorage.getItem("selectedStore");
    return savedStore ? JSON.parse(savedStore) : null;
  });

  const login = (authData) => {
    setUser(authData);
    localStorage.setItem("auth", JSON.stringify(authData)); // ✅ FIX
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("user"); // ✅ FIX
  };


  const role = user?.role;

  const authInfo = {
    user,
    role,
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
