import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, adminAPI } from '../api/services';

const AuthContext = createContext(null);

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const stored = localStorage.getItem(USER_KEY);
    if (token && stored) {
      try {
        const { data } = await authAPI.getMe();
        if (data?.success && data?.data?.user) {
          setUser(data.data.user);
          localStorage.setItem(USER_KEY, JSON.stringify(data.data.user));
          return;
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setUser(null);
  }, []);

  useEffect(() => {
    loadUser().finally(() => setLoading(false));
  }, [loadUser]);

  const login = useCallback(async (username, password) => {
    const { data } = await authAPI.login({ username, password });
    if (data?.success && data?.data?.token && data?.data?.user) {
      localStorage.setItem(TOKEN_KEY, data.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.data.user));
      setUser(data.data.user);
      return { user: data.data.user, token: data.data.token };
    }
    throw new Error(data?.message || 'Login failed');
  }, []);

  const adminLogin = useCallback(async (email, password) => {
    const { data } = await adminAPI.login({ email, password });
    if (data?.success && data?.data?.token && data?.data?.user) {
      localStorage.setItem(TOKEN_KEY, data.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.data.user));
      setUser(data.data.user);
      return { user: data.data.user, token: data.data.token };
    }
    throw new Error(data?.message || 'Login failed');
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    adminLogin,
    logout,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
