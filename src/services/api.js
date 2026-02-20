import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { ERROR_MESSAGES, STORAGE_KEYS } from "../utils/constants";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      // Handle 401 Unauthorized - Token expired or invalid
      if (status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        window.location.href = "/login";
      }

      // Return error with message using constants
      const errorMessage = data?.message || data?.error || ERROR_MESSAGES.UNKNOWN_ERROR;
      return Promise.reject({
        message: errorMessage,
        status,
        data: data,
      });
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject({
        message: ERROR_MESSAGES.NETWORK_ERROR,
        status: 0,
      });
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
        status: 0,
      });
    }
  }
);

// Helper function to convert object to URL-encoded format
export const toFormData = (obj) => {
  const formData = new URLSearchParams();
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== null && obj[key] !== undefined) {
      formData.append(key, obj[key]);
    }
  });
  return formData;
};

export default apiClient;
