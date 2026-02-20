import React, { useEffect } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import SubscriptionModal from './SubscriptionModal';

function SubscriptionGuard({ children }) {
  const { isSubscribed, loading, openSubscriptionModal } = useSubscription();

  useEffect(() => {
    // Show modal if not subscribed after loading
    if (!loading && !isSubscribed) {
      openSubscriptionModal();
    }
  }, [loading, isSubscribed, openSubscriptionModal]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F67BD] mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من الاشتراك...</p>
        </div>
      </div>
    );
  }

  // If not subscribed, blur the content and show modal
  if (!isSubscribed) {
    return (
      <div className="relative">
        {/* Blurred Content */}
        <div className="filter blur-md pointer-events-none select-none">
          {children}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-white bg-opacity-30 backdrop-blur-sm pointer-events-none z-10" />

        {/* Modal */}
        <SubscriptionModal />
      </div>
    );
  }

  // User is subscribed, show normal content
  return <>{children}</>;
}

export default SubscriptionGuard;

