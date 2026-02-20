import React, { createContext, useContext, useState, useEffect } from 'react';
import { studentService } from '../services/studentService';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Check subscription when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      checkSubscription();
    } else {
      // Clear subscription data when logged out
      clearSubscription();
    }
  }, [isAuthenticated, user]);

  // Check subscription status
  const checkSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await studentService.getCurrentSubscription();
      const subscriptionData = response.data || response;
      
      // Check if subscription exists and is active or paid
      // API returns status: 'PAID' or 'active'
      const validStatuses = ['active', 'PAID', 'paid'];
      if (subscriptionData && validStatuses.includes(subscriptionData.status)) {
        setSubscription(subscriptionData);
        setIsSubscribed(true);
        setShowSubscriptionModal(false);
      } else {
        setSubscription(null);
        setIsSubscribed(false);
      }
      
      return { success: true, data: subscriptionData };
    } catch (err) {
      console.error('Error checking subscription:', err);
      
      // If error is 404 or subscription not found, user is not subscribed
      if (err.response?.status === 404 || err.message?.includes('not found')) {
        setSubscription(null);
        setIsSubscribed(false);
      } else {
        setError(err.message || 'فشل التحقق من الاشتراك');
      }
      
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Get available subscription plans
  const getPlans = async (type = null) => {
    try {
      const response = await studentService.getSubscriptionPlans(type);
      return { success: true, data: response.data || response };
    } catch (err) {
      console.error('Error fetching plans:', err);
      return { success: false, error: err.message };
    }
  };

  // Subscribe to a plan
  const subscribeToPlan = async (planId, paymentMethodId) => {
    try {
      const response = await studentService.subscribeToPlan(planId, paymentMethodId);
      
      // Refresh subscription status
      await checkSubscription();
      
      return { success: true, data: response.data || response };
    } catch (err) {
      console.error('Error subscribing to plan:', err);
      return { success: false, error: err.message };
    }
  };

  // Force set subscription status (useful after successful payment)
  const setSubscribedStatus = (status) => {
    setIsSubscribed(status);
  };

  // Clear subscription data (on logout)
  const clearSubscription = () => {
    setSubscription(null);
    setIsSubscribed(false);
    setShowSubscriptionModal(false);
    setError(null);
    setLoading(false);
  };

  // Open/close subscription modal
  const openSubscriptionModal = () => setShowSubscriptionModal(true);
  const closeSubscriptionModal = () => setShowSubscriptionModal(false);

  const value = {
    subscription,
    isSubscribed,
    loading,
    error,
    showSubscriptionModal,
    checkSubscription,
    getPlans,
    subscribeToPlan,
    clearSubscription,
    openSubscriptionModal,
    closeSubscriptionModal,
    setSubscribedStatus,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

