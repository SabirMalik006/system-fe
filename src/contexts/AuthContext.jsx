import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import { authAPI } from '../services/api';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const refreshing = useRef(false);

  const refreshSession = useCallback(async () => {
    if (refreshing.current) return;
    refreshing.current = true;
    try {
      const res = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      if (res.data.success && res.data.accessToken) {
        localStorage.setItem('accessToken', res.data.accessToken);
      }
    } catch (err) {
      // Session terminated / idle timeout — end the session with a message
      const code = err.response?.data?.code;
      const hadSession = localStorage.getItem('accessToken') || localStorage.getItem('user');
      if (hadSession && ['SESSION_TIMEOUT', 'SESSION_TERMINATED', 'SESSION_INVALID'].includes(code)) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        toast.error(err.response?.data?.message || 'Session ended. Please log in again.');
        window.location.href = '/login';
      }
      // else ignore – will be handled on next request
    } finally {
      refreshing.current = false;
    }
  }, []);

  useEffect(() => {
    // Proactive refresh every 10 minutes (before 15 min expiry)
    const interval = setInterval(refreshSession, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshSession]);

  useEffect(() => {
    // Refresh token when tab becomes visible again
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshSession();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [refreshSession]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.getMe();
      setUser(response.data.user);
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, rememberMe = false) => {
    setError(null);
    try {
      const response = await authAPI.login(email, password, rememberMe);
      const { user, accessToken } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const response = await authAPI.register(userData);
      return { success: true, user: response.data.user };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (typeof roles === 'string') return user.role === roles;
    return roles.includes(user.role);
  };

  const hasPermission = (module, action) => {
    if (!user) return false;
    if (user.role === 'super_admin' || user.role === 'admin' || user.role === 'dwece' || user.role === 'cmes' || user.role === 'ages_ges') return true;
    
    const permissions = user.permissions || [];
    const modulePerm = permissions.find(p => p.module === module || p.module === 'all');
    if (!modulePerm) return false;
    return modulePerm.actions.includes(action) || modulePerm.actions.includes('manage');
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    hasRole,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};