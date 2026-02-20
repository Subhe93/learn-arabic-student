import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import bgPattern from '../assets/images/bg.png';
import animal1 from '../assets/images/animal1.svg';
import animal2 from '../assets/images/animal2.svg';

function EmailConfirmationPage() {
  const { user, resendConfirmation, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const userEmail = user?.email || '';

  const handleResendConfirmation = async (e) => {
    e?.preventDefault();
    
    if (!userEmail) {
      setError('لا يوجد بريد إلكتروني');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    const result = await resendConfirmation(userEmail);
    
    setIsLoading(false);
    
    if (result.success) {
      setSuccessMessage('تم إرسال رابط التأكيد إلى بريدك الإلكتروني');
    } else {
      setError(result.error || 'فشل إرسال رابط التأكيد');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center font-sans relative overflow-hidden"
      dir="rtl"
      style={{ backgroundColor: '#DDF0EB' }}
    >
      {/* Background Pattern Mask/Overlay */}
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

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md px-4">
        
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

        {/* Outer Card */}
        <div className="bg-white rounded-[8px] shadow-lg border-2 border-[#dc3d3c] p-2 relative z-10">
          {/* Inner Border */}
          <div className="border-2 border-[#555555] rounded-[8px] p-6 md:p-8 flex flex-col items-center">
            
            <div className="w-20 h-20 mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-800 mb-4 text-center">تأكيد البريد الإلكتروني</h1>
            
            <p className="text-gray-600 text-center mb-6 text-sm leading-relaxed">
              يرجى تأكيد بريدك الإلكتروني للمتابعة. تم إرسال رابط التأكيد إلى:
            </p>
            
            <div className="w-full mb-6 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
              <p className="text-center font-bold text-gray-800 text-lg">{userEmail}</p>
            </div>

            <p className="text-gray-600 text-center mb-6 text-sm leading-relaxed">
              يرجى فتح بريدك الإلكتروني والنقر على رابط التأكيد المرسل إليك.
            </p>

            {error && (
              <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="w-full mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm text-center">
                {successMessage}
              </div>
            )}

            <div className="w-full flex flex-col gap-3">
              <button 
                onClick={handleResendConfirmation}
                disabled={isLoading}
                className="w-full bg-[#4F67BD] text-white font-bold py-3 px-6 rounded-full shadow-md hover:bg-[#3e539a] transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>جاري الإرسال...</span>
                  </>
                ) : (
                  'إعادة إرسال رابط التأكيد'
                )}
              </button>

              <button 
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full bg-transparent text-gray-600 font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition-colors border-2 border-transparent hover:border-gray-200 disabled:opacity-50"
              >
                تسجيل الخروج
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailConfirmationPage;

