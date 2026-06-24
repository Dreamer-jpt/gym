import { createContext, useState, useEffect, useCallback } from "react";
import { getMe, registerUser, loginUser, logoutUser } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const data = await getMe();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const register = async (data) => {
    const res = await registerUser(data);
    setUser(res.user);
    return res;
  };

  const login = async (data) => {
    const res = await loginUser(data);
    setUser(res.user);
    return res;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
