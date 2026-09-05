import { createContext, useContext, useState, useEffect } from "react";
import { loginApi, signupApi } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("access_token") || null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("settlesense_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Sync token changes to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("access_token", token);
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("settlesense_user");
    }
  }, [token]);

  // Listen for 401 unauthorized events from Axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener("settlesense:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("settlesense:unauthorized", handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await loginApi(email, password);
      const accessToken = data.access_token;
      const userProfile = {
        email: email.toLowerCase(),
        name: data.user?.name || email.split("@")[0].replace(".", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        customer_id: data.user?.customer_id || `CUST${Math.floor(100000 + Math.random() * 900000)}`,
        tier: "Institutional Banking",
      };

      setToken(accessToken);
      setUser(userProfile);
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("settlesense_user", JSON.stringify(userProfile));
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setAuthError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({ name, email, password, customer_id }) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await signupApi({ name, email, password, customer_id });
      const accessToken = data.access_token;
      const userProfile = {
        name,
        email: email.toLowerCase(),
        customer_id: customer_id || `CUST${Math.floor(100000 + Math.random() * 900000)}`,
        tier: "Institutional Banking",
      };

      setToken(accessToken);
      setUser(userProfile);
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("settlesense_user", JSON.stringify(userProfile));
      return { success: true, message: data.message };
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Account creation failed. Please try again.";
      setAuthError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("settlesense_user");
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    authError,
    setAuthError,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
