import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useAuth } from '../contexts/AuthContext';
import { studentService } from '../services/studentService';
import TopNavBar from '../components/TopNavBar';
import StripePayment from '../components/StripePayment';
import SuccessModal from '../components/SuccessModal';
import bgPattern from '../assets/images/bg.png';

function SubscriptionPlansPage() {
  const navigate = useNavigate();
  const { getPlans, checkSubscription, isSubscribed, setSubscribedStatus } = useSubscription();
  const { token } = useAuth();
  
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlanType, setSelectedPlanType] = useState('yearly'); // 'monthly' or 'yearly'
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    loadPlans();
  }, [selectedPlanType]);

  const loadPlans = async () => {
    setLoading(true);
    setError('');
    
    const result = await getPlans(selectedPlanType);
    
    if (result.success) {
      setPlans(result.data || []);
    } else {
      setError(result.error || 'فشل تحميل الخطط');
    }
    
    setLoading(false);
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
    setPaymentError('');
  };

  const handlePaymentMethodCreated = async (paymentMethodId) => {
    if (!selectedPlan) return;

    setProcessing(true);
    setPaymentError('');

    try {
      // Call backend to create subscription and get clientSecret
      const response = await studentService.subscribeToPlan(selectedPlan.id, paymentMethodId);
      
      if (!response.clientSecret) {
        throw new Error('لم يتم استلام clientSecret من الخادم');
      }

      // Confirm payment with Stripe
      const stripe = window.Stripe(window.STRIPE_PUBLIC_KEY || 'pk_test_51Sckb9HuHxSe9yWl3pHpQrHMRfWFBZupSK5dRicZON7rSh7hzgRttLObfrelYXnmnqB1EDL3P4a7eIpOMK9fDRMX00omkapLXJ');
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(response.clientSecret);

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Payment succeeded
        setShowPaymentModal(false);
        
        // Immediately update subscription status to hide the modal
        setSubscribedStatus(true);
        
        // Refresh subscription status from backend (async in background)
        checkSubscription().catch(err => {
          console.error('Error refreshing subscription:', err);
        });
        
        // Show success modal
        setSuccessData({
          planName: selectedPlan.name,
          amount: selectedPlan.price
        });
        setShowSuccessModal(true);
      } else {
        throw new Error('حالة الدفع: ' + paymentIntent.status);
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setPaymentError(err.message || 'فشل إتمام عملية الاشتراك');
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelPayment = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
    setPaymentError('');
  };

  const getPlanIcon = (planName) => {
    const name = planName?.toLowerCase() || '';
    
    if (name.includes('premium') || name.includes('ممتاز')) {
      return (
        <svg className="w-12 h-12 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    if (name.includes('basic') || name.includes('أساسي')) {
      return (
        <svg className="w-12 h-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
    
    return (
      <svg className="w-12 h-12 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
      </svg>
    );
  };

  return (
    <div 
      className="min-h-screen flex flex-col"
      dir="rtl"
      style={{ backgroundColor: '#DDF0EB' }}
    >
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url('${bgPattern}')`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          opacity: 0.4,
          mixBlendMode: 'color-dodge',
          backgroundPosition: '-163px -342px'
        }}
      />

      {/* Top Navigation */}
      <TopNavBar />

      {/* Main Content */}
      <div className="flex-1 relative z-10 container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">اختر الخطة المناسبة لك</h1>
          <p className="text-gray-600 text-lg">ابدأ رحلتك في تعلم اللغة العربية اليوم</p>
        </div>

        {/* Plan Type Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-md inline-flex">
            <button
              onClick={() => setSelectedPlanType('monthly')}
              className={`px-8 py-3 rounded-full font-bold transition-all ${
                selectedPlanType === 'monthly'
                  ? 'bg-[#4F67BD] text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              شهري
            </button>
            <button
              onClick={() => setSelectedPlanType('yearly')}
              className={`px-8 py-3 rounded-full font-bold transition-all ${
                selectedPlanType === 'yearly'
                  ? 'bg-[#4F67BD] text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              سنوي
              <span className="mr-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                وفر 20%
              </span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F67BD] mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل الخطط...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Plans Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all border-2 ${
                  plan.teacherFollowUp 
                    ? 'border-yellow-400 hover:border-yellow-500 relative' 
                    : 'border-transparent hover:border-[#4F67BD]'
                }`}
              >
                {/* Premium Badge for plans with teacher follow-up */}
                {plan.teacherFollowUp && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>مميزة</span>
                    </div>
                  </div>
                )}
                
                {/* Plan Header */}
                <div className={`p-6 text-white text-center ${
                  plan.teacherFollowUp 
                    ? 'bg-gradient-to-br from-yellow-500 to-orange-500' 
                    : 'bg-gradient-to-br from-[#4F67BD] to-[#3e539a]'
                }`}>
                  <div className="flex justify-center mb-4">
                    {getPlanIcon(plan.name)}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-extrabold">{plan.price || '0'}</span>
                    <span className="text-lg">دولار</span>
                  </div>
                  <p className="text-sm opacity-90 mt-2">
                    {plan.type === 'monthly' ? 'شهرياً' : 'سنوياً'}
                  </p>
                </div>

                {/* Plan Features */}
                <div className="p-6">
                  {/* Plan Description */}
                  {plan.description && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 text-sm text-center">{plan.description}</p>
                    </div>
                  )}

                  <ul className="space-y-3 mb-6">
                    {/* Teacher Follow-up Feature */}
                    {plan.teacherFollowUp ? (
                      <li className="flex items-start gap-3 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                        <span className="text-yellow-900 text-sm font-bold">
                          ✨ متابعة شخصية من معلم مختص
                        </span>
                      </li>
                    ) : (
                      <li className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-500 text-sm">
                          بدون متابعة معلم
                        </span>
                      </li>
                    )}

                    {plan.features?.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    )) || (
                      <>
                        <li className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 text-sm">الوصول إلى جميع الدروس</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 text-sm">تمارين تفاعلية</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 text-sm">شهادات إتمام</span>
                        </li>
                      </>
                    )}
                  </ul>

                  {/* Subscribe Button */}
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isSubscribed}
                    className={`w-full font-bold py-3 px-6 rounded-full shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                      plan.teacherFollowUp
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                        : 'bg-[#4F67BD] hover:bg-[#3e539a] text-white'
                    }`}
                  >
                    {isSubscribed ? 'مشترك بالفعل' : 'اشترك الآن'}
                    {plan.teacherFollowUp && !isSubscribed && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && plans.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">لا توجد خطط متاحة حالياً</p>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate(-1)}
            className="text-[#4F67BD] hover:text-[#3e539a] font-bold underline"
          >
            العودة
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto"
          onClick={handleCancelPayment}
        >
          <div 
            className="my-8 w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {paymentError && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                {paymentError}
              </div>
            )}
            <StripePayment
              amount={selectedPlan.price}
              planName={selectedPlan.name}
              onPaymentMethodCreated={handlePaymentMethodCreated}
              onCancel={handleCancelPayment}
            />
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        planName={successData?.planName || ''}
        amount={successData?.amount || 0}
      />
    </div>
  );
}

export default SubscriptionPlansPage;

