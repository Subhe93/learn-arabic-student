import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { STORAGE_KEYS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../utils/constants';

const AuthContext = createContext(null);

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
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage and fetch user info
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      
      if (storedToken) {
        setToken(storedToken);
        try {
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          // Fetch fresh user data from API
          try {
            const response = await authService.getUserInfo();
            const userData = response.user || response.data || response;
            // Preserve isConfirmed from response
            const isConfirmed = response.isConfirmed !== undefined ? response.isConfirmed : (userData.isConfirmed !== undefined ? userData.isConfirmed : true);
            const completeUserData = { ...userData, isConfirmed };
            setUser(completeUserData);
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(completeUserData));
          } catch (err) {
            console.error('Error fetching user info on init:', err);
            // Keep stored user data if API call fails
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        }
      }
      setLoading(false);
    };
    
    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authService.login({ email, password });
      
      // API returns: { accessToken, isConfirmed }
      // authService already returns response.data from axios
      const authToken = response.accessToken || response.token;
      const isConfirmed = response.isConfirmed !== undefined ? response.isConfirmed : true;
      const userData = response.user || { email, isConfirmed };
      
      if (authToken) {
        setToken(authToken);
        setUser({ ...userData, isConfirmed });
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify({ ...userData, isConfirmed }));
        
        // Fetch complete user info after login
        try {
          const userInfoResponse = await authService.getUserInfo();
          const userDataFromInfo = userInfoResponse.user || userInfoResponse.data || userInfoResponse;
          // Preserve isConfirmed from getUserInfo response, fallback to login response
          const isConfirmedFromInfo = userInfoResponse.isConfirmed !== undefined ? userInfoResponse.isConfirmed : isConfirmed;
          const completeUserData = { ...userDataFromInfo, isConfirmed: isConfirmedFromInfo };
          setUser(completeUserData);
          localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(completeUserData));
        } catch (userInfoErr) {
          console.error('Error fetching user info after login:', userInfoErr);
          // Continue with basic user data if fetch fails
        }
        
        return { success: true, data: response, isConfirmed };
      } else {
        throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
      }
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.LOGIN_FAILED;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authService.register(userData);
      
      // API may return accessToken on register, or require email confirmation
      // authService already returns response.data from axios
      const authToken = response.accessToken || response.token;
      const isConfirmed = response.isConfirmed !== undefined ? response.isConfirmed : false;
      const userDataResponse = response.user || { email: userData.email, isConfirmed };
      
      if (authToken) {
        setToken(authToken);
        setUser({ ...userDataResponse, isConfirmed });
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify({ ...userDataResponse, isConfirmed }));
      }
      
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.REGISTER_FAILED;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (token) {
        await authService.logout();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  };

  // Get user info
  const fetchUserInfo = async () => {
    try {
      setError(null);
      const response = await authService.getUserInfo();
      const userData = response.user || response.data || response;
      // Preserve isConfirmed from response
      const isConfirmed = response.isConfirmed !== undefined ? response.isConfirmed : (userData.isConfirmed !== undefined ? userData.isConfirmed : true);
      const completeUserData = { ...userData, isConfirmed };
      setUser(completeUserData);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(completeUserData));
      return { success: true, data: completeUserData };
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.LOAD_DATA_FAILED;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setError(null);
      const response = await authService.forgotPassword(email);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      setError(null);
      const response = await authService.resetPassword(token, password);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Resend email confirmation
  const resendConfirmation = async (email) => {
    try {
      setError(null);
      const response = await authService.resendConfirmation(email);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.UNKNOWN_ERROR;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    fetchUserInfo,
    forgotPassword,
    resetPassword,
    resendConfirmation,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

