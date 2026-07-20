import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchMyProfile, loginUser, registerUser } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const response = await fetchMyProfile();
      setUser(response.data.result);
    } catch (error) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_token_type");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const login = useCallback(async (username, password) => {
    const response = await loginUser({ username, password });
    const { access_token, token_type } = response.data.result;
    localStorage.setItem("auth_token", access_token);
    localStorage.setItem("auth_token_type", token_type);
    await loadProfile();
  }, [loadProfile]);

  const register = useCallback(async (payload) => {
    await registerUser(payload);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_token_type");
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    refreshProfile: loadProfile,
  }), [user, loading, login, register, logout, loadProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
