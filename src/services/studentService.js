import apiClient, { toFormData } from './api';

// Student APIs
export const studentService = {
  // Get levels with student status
  getLevels: async () => {
    try {
      const response = await apiClient.get('/student/levels');
      return response.data;
    } catch (error) {
      console.error('Error fetching levels:', error);
      throw error;
    }
  },

  // Get lessons for a specific level
  getLessons: async (levelId) => {
    try {
      const response = await apiClient.get(`/student/lessons?levelId=${levelId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lessons:', error);
      throw error;
    }
  },

  // Get upcoming sessions
  getUpcomingSessions: async () => {
    try {
      const response = await apiClient.get('/student/sessions/upcoming');
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
      throw error;
    }
  },

  // Get student certificates
  getCertificates: async () => {
    try {
      const response = await apiClient.get('/student/certificates');
      return response.data;
    } catch (error) {
      console.error('Error fetching certificates:', error);
      throw error;
    }
  },

  // Get affiliate referrals
  getAffiliateReferrals: async () => {
    try {
      const response = await apiClient.get('/student/affiliate/referrals');
      return response.data;
    } catch (error) {
      console.error('Error fetching affiliate referrals:', error);
      throw error;
    }
  },

  // Get available subscription plans
  getSubscriptionPlans: async (type = null) => {
    try {
      const url = type ? `/subscription/plans?type=${type}` : '/subscription/plans';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw error;
    }
  },

  // Subscribe to a plan
  subscribeToPlan: async (planId, paymentMethodId) => {
    try {
      const response = await apiClient.post('/subscription/subscribe', {
        planId,
        paymentMethodId,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      throw error;
    }
  },

  // Get current subscription
  getCurrentSubscription: async () => {
    try {
      const response = await apiClient.get('/subscription/current');
      return response.data;
    } catch (error) {
      console.error('Error fetching current subscription:', error);
      throw error;
    }
  },

  // Get assignment questions (old method - for backward compatibility)
  getAssignmentQuestions: async (assignmentId) => {
    try {
      const response = await apiClient.get(`/student/assignments/${assignmentId}/questions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assignment questions:', error);
      throw error;
    }
  },

  // Get assignment questions by type (lesson or level)
  getAssignmentQuestionsByType: async (type, id) => {
    try {
      // type: 'lesson' or 'level'
      const response = await apiClient.get(`/student/assignments/${type}/${id}/questions`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${type} assignment questions:`, error);
      throw error;
    }
  },

  // Get assignment status by type (lesson or level)
  getAssignmentStatus: async (type, id) => {
    try {
      // type: 'lesson' or 'level'
      // Example: /student/assignments/lesson/4/status
      const response = await apiClient.get(`/student/assignments/${type}/${id}/status`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${type} assignment status (ID: ${id}):`, error);
      throw error;
    }
  },

  // Submit assignment answers
  submitAssignment: async (assignmentData) => {
    try {
      const response = await apiClient.post('/student/assignments/submit', assignmentData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting assignment:', error);
      throw error;
    }
  },

  // Upload image
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post('/student/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Upload audio
  uploadAudio: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post('/student/upload/audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading audio:', error);
      throw error;
    }
  },
};

