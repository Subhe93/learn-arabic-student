import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import bgPattern from '../assets/images/bg.png';
import animal1 from '../assets/images/animal1.svg';
import animal2 from '../assets/images/animal2.svg';

function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('رمز التحقق غير صالح');
        return;
      }

      try {
        setStatus('loading');
        const response = await authService.confirmEmail(token);
        
        setStatus('success');
        setUserData(response);
        setMessage('تم تأكيد البريد الإلكتروني بنجاح!');

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        console.error('Error confirming email:', error);
        setStatus('error');
        setMessage(
          error.response?.data?.message || 
          'فشل تأكيد البريد الإلكتروني. قد يكون الرابط منتهي الصلاحية.'
        );
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center font-sans relative overflow-hidden"
      dir="rtl"
      style={{ backgroundColor: '#DDF0EB' }}
    >
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url('${bgPattern}')`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          opacity: 0.4,
          mixBlendMode: 'color-dodge',
          backgroundPosition: '-163px -342px'
        }}
      />

      {/* Decorative Animals */}
      <img 
        src={animal1} 
        alt="Decoration" 
        className="absolute -top-24 -right-20 w-40 h-auto z-20 pointer-events-none transform rotate-12"
      />
      <img 
        src={animal2} 
        alt="Decoration" 
        className="absolute -bottom-16 -left-20 w-36 h-auto z-20 pointer-events-none transform -rotate-12"
      />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Loading State */}
        {status === 'loading' && (
          <div className="bg-white rounded-[8px] shadow-lg border-2 border-[#dc3d3c] p-2 relative z-10">
            <div className="border-2 border-[#555555] rounded-[8px] p-6 md:p-8 flex flex-col items-center">
              <div className="flex justify-center mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#4F67BD]"></div>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
                جاري التحقق من البريد الإلكتروني...
              </h2>
              <p className="text-gray-600 text-center">
                يرجى الانتظار بينما نقوم بتأكيد حسابك
              </p>
            </div>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="bg-white rounded-[8px] shadow-lg border-2 border-[#dc3d3c] p-2 relative z-10">
            <div className="border-2 border-[#555555] rounded-[8px] p-6 md:p-8 flex flex-col items-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-3xl font-extrabold text-green-600 mb-4">
                تم التأكيد بنجاح! 🎉
              </h2>
              
              <p className="text-gray-700 mb-4 text-lg text-center">
                {message}
              </p>
              
              {userData && (
                <div className="w-full bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800 font-bold text-center mb-2">
                    مرحباً {userData.firstName} {userData.lastName}!
                  </p>
                  <p className="text-green-700 text-sm text-center">
                    {userData.email}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm">سيتم تحويلك إلى صفحة تسجيل الدخول خلال 3 ثوان...</span>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="w-full bg-[#4F67BD] text-white font-bold py-3 px-6 rounded-full hover:bg-[#3e539a] transition-colors shadow-md"
              >
                تسجيل الدخول الآن
              </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="bg-white rounded-[8px] shadow-lg border-2 border-[#dc3d3c] p-2 relative z-10">
            <div className="border-2 border-[#555555] rounded-[8px] p-6 md:p-8 flex flex-col items-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-3xl font-extrabold text-red-600 mb-4">
                فشل التأكيد
              </h2>
              
              <div className="w-full mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
                {message}
              </div>

              <div className="w-full space-y-3">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-[#4F67BD] text-white font-bold py-3 px-6 rounded-full hover:bg-[#3e539a] transition-colors shadow-md"
                >
                  الذهاب إلى تسجيل الدخول
                </button>
                
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-full hover:bg-gray-300 transition-colors"
                >
                  إنشاء حساب جديد
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConfirmEmailPage;

