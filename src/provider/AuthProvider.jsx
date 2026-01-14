import { useState } from "react";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (authData) => {
    setUser(authData);
    localStorage.setItem("user", JSON.stringify(authData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const authInfo = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
