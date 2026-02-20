import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireConfirmation = true }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F67BD] mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check email confirmation for routes that require it
  // Email confirmation page doesn't require confirmation
  if (requireConfirmation && user && user.isConfirmed === false && location.pathname !== '/email-confirmation') {
    return <Navigate to="/email-confirmation" replace />;
  }

  return children;
};

export default ProtectedRoute;

