'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';
import { createLogger, logDomainAction } from '../lib/logger';

const AuthContext = createContext();
const logger = createLogger('frontend');

const decodeTokenPayload = (jwtToken) => {
  try {
    const base64Url = jwtToken.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '=',
    );

    return JSON.parse(atob(paddedBase64));
  } catch (error) {
    return null;
  }
};

const getTokenExpiryMs = (jwtToken) => {
  const payload = decodeTokenPayload(jwtToken);
  return payload?.exp ? payload.exp * 1000 : null;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (storedToken && storedUser) {
      const expiresAt = getTokenExpiryMs(storedToken);

      if (expiresAt && expiresAt <= Date.now()) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        delete axios.defaults.headers.common['Authorization'];
      } else {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Set default authorization header for axios
        axios.defaults.headers.common['Authorization'] =
          `Bearer ${storedToken}`;
      }
    }
    setLoading(false);
  }, []);

  const setAuthSession = ({ user: userData, token: authToken }) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('authUser', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_ENDPOINTS.AUTH.LOGIN}`, {
        email,
        password,
      });

      const { user: userData, token: authToken } = response.data.data;
      setAuthSession({ user: userData, token: authToken });

      logDomainAction(logger, 'user_login', {
        result: 'success',
        userId: userData?._id,
        role: userData?.role,
      });

      return { success: true, user: userData };
    } catch (error) {
      logger.warn('user_login_failed', {
        action: 'user_login',
        result: 'failure',
        errorName: error.name,
        errorMessage: error.response?.data?.message || error.message,
      });

      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const logout = () => {
    if (user?._id) {
      logDomainAction(logger, 'user_logout', {
        result: 'success',
        userId: user._id,
        role: user.role,
      });
    }

    // Clear state
    setUser(null);
    setToken(null);

    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');

    // Remove default authorization header
    delete axios.defaults.headers.common['Authorization'];
  };

  // Auto logout when token reaches expiry time
  useEffect(() => {
    if (!token) return;

    const expiresAt = getTokenExpiryMs(token);
    if (!expiresAt) return;

    const timeoutMs = expiresAt - Date.now();
    if (timeoutMs <= 0) {
      logout();
      return;
    }

    const timeoutId = setTimeout(() => {
      logout();
    }, timeoutMs);

    return () => clearTimeout(timeoutId);
  }, [token]);

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(API_ENDPOINTS.AUTH.PROFILE, profileData);
      const updatedUser = response.data.data;

      // Update state and localStorage
      setUser(updatedUser);
      localStorage.setItem('authUser', JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Profile update failed',
      };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await axios.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      });
      return { success: true };
    } catch (error) {
      console.error('Password change error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Password change failed',
      };
    }
  };

  const updateQuickstartStatus = async (action) => {
    try {
      const response = await axios.put(API_ENDPOINTS.AUTH.QUICKSTART, {
        action,
      });
      const updatedUser = response.data.data;

      setUser(updatedUser);
      localStorage.setItem('authUser', JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Quickstart update error:', error);
      return {
        success: false,
        error:
          error.response?.data?.message || 'Failed to update quickstart status',
      };
    }
  };

  const activateInvite = async (activationToken, password) => {
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.ACTIVATE, {
        token: activationToken,
        password,
      });

      const { user: userData, token: authToken } = response.data.data;
      setAuthSession({ user: userData, token: authToken });

      logDomainAction(logger, 'account_activated', {
        result: 'success',
        userId: userData?._id,
        role: userData?.role,
      });

      return { success: true, user: userData };
    } catch (error) {
      logger.warn('account_activation_failed', {
        action: 'account_activated',
        result: 'failure',
        errorName: error.name,
        errorMessage: error.response?.data?.message || error.message,
      });

      return {
        success: false,
        error: error.response?.data?.message || 'Activation failed',
      };
    }
  };

  // Role checking utilities
  const hasRole = (requiredRole) => {
    if (!user) return false;

    const roleHierarchy = {
      volunteer: 1,
      staff: 2,
      admin: 3,
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  const isAdmin = () => hasRole('admin');
  const isStaff = () => hasRole('staff');
  const isVolunteer = () => hasRole('volunteer');

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateProfile,
    updateQuickstartStatus,
    changePassword,
    activateInvite,
    hasRole,
    isAdmin,
    isStaff,
    isVolunteer,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
