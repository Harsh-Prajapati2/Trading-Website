import { createContext, useContext, useState } from "react";
import { loginApi,registerApi } from "../api/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    const data = await loginApi({ email, password });
    localStorage.setItem("token", data.token);
    setUser({ email });
    setLoading(false);
  };

  const signup = async (name, email, mobileNo, password) => {
    setLoading(true);
    // TODO: Implement actual API call here
    // console.log("Signup details:", { name, email, mobile, password });
    const data = registerApi({ name, email, mobileNo, password });
    console.log(data);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
