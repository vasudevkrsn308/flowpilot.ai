import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('flowpilot_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.auth.me();
        setUser(res.user);
      } catch (err) {
        console.warn('Session expired or invalid token');
        localStorage.removeItem('flowpilot_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const handleLoginSuccess = (newToken, newUser) => {
    localStorage.setItem('flowpilot_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const login = async (email, password) => {
    const res = await api.auth.login({ email, password });
    handleLoginSuccess(res.token, res.user);
    return res.user;
  };

  const register = async (userData) => {
    const res = await api.auth.register(userData);
    handleLoginSuccess(res.token, res.user);
    return res.user;
  };

  const demoLogin = async (role = 'Employee') => {
    const res = await api.auth.demoLogin(role);
    handleLoginSuccess(res.token, res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('flowpilot_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        demoLogin,
        switchRole: demoLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
