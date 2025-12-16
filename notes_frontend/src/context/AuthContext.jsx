import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/auth';

const AuthContext = createContext({
  isAuthenticated: false,
  initializing: true,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {}
});

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth state and actions. */
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provider managing authentication token and session lifecycle. */
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Load token from localStorage on mount.
  useEffect(() => {
    try {
      const stored = localStorage.getItem('notesapp_token');
      if (stored) setToken(stored);
    } catch (e) {
      // ignore storage errors
    } finally {
      setInitializing(false);
    }
  }, []);

  const login = async (email, password) => {
    const { token: tkn } = await apiLogin(email, password);
    if (!tkn) {
      throw new Error('Login succeeded but no token received');
    }
    localStorage.setItem('notesapp_token', tkn);
    setToken(tkn);
    return tkn;
  };

  const register = async (email, password) => {
    const { token: tkn } = await apiRegister(email, password);
    if (tkn) {
      localStorage.setItem('notesapp_token', tkn);
      setToken(tkn);
    }
    return tkn;
  };

  const logout = () => {
    try {
      localStorage.removeItem('notesapp_token');
    } catch (e) {
      // ignore
    }
    setToken(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      token,
      initializing,
      login,
      register,
      logout
    }),
    [token, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
