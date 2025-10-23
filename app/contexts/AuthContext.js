'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';

const AuthContext = createContext();

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
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Set default authorization header for axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_ENDPOINTS.AUTH.LOGIN}`, {
        email,
        password,
      });

      const { user: userData, token: authToken } = response.data.data;

      // Store in state
      setUser(userData);
      setToken(authToken);

      // Store in localStorage
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('authUser', JSON.stringify(userData));

      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const logout = () => {
    // Clear state
    setUser(null);
    setToken(null);

    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');

    // Remove default authorization header
    delete axios.defaults.headers.common['Authorization'];
  };

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
    changePassword,
    hasRole,
    isAdmin,
    isStaff,
    isVolunteer,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
