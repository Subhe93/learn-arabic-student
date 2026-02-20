import apiClient, { toFormData } from "./api";

// Auth APIs
export const authService = {
  // Register new user
  register: async (userData) => {
    const { firstName, lastName, email, password } = userData;
    const formData = toFormData({
      firstName,
      lastName,
      email,
      password,
    });

    const response = await apiClient.post("/auth/register", formData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const { email, password } = credentials;
    const formData = toFormData({
      email,
      password,
    });

    const response = await apiClient.post("/auth/login", formData);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },

  // Get user info
  getUserInfo: async () => {
    const response = await apiClient.post("/auth/info");
    return response.data;
  },

  // Forgot password - Send reset email
  forgotPassword: async (email) => {
    const formData = toFormData({ email });
    const response = await apiClient.post("/auth/forgot-password", formData);
    return response.data;
  },

  // Reset password with token
  resetPassword: async (token, password) => {
    const formData = toFormData({ password });
    const response = await apiClient.post(
      `/auth/reset-password/${token}`,
      formData
    );
    return response.data;
  },

  // Resend email confirmation
  resendConfirmation: async (email) => {
    const formData = toFormData({ email });
    const response = await apiClient.post(
      "/auth/resend-confirmation",
      formData
    );
    return response.data;
  },

  // Confirm email with token
  confirmEmail: async (token) => {
    const response = await apiClient.get(`/auth/confirm?token=${token}`);
    return response.data;
  },
};
