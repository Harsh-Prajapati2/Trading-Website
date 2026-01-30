import { createContext, useContext, useState } from "react";
import { loginApi, registerApi } from "../api/auth.api";
import { initWallet } from "../api/wallet.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const data = await loginApi({ email, password });
      if (data.token) {
        localStorage.setItem("token", data.token);
        setUser({ email });
        return data;
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, mobileNo, password) => {
    setLoading(true);
    setError("");
    try {
      const data = await registerApi({ name, email, mobileNo, password });
      if (data.message) {
        return data;
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("Signup failed");
      }
    } catch (err) {
      const errorMsg = err.error || err.message || "Signup failed";
      setError(errorMsg);
      throw { error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
