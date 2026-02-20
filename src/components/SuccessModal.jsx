import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SuccessModal({ show, onClose, planName, amount }) {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (show) {
      setShowConfetti(true);
      // Auto redirect after 5 seconds
      const timer = setTimeout(() => {
        handleContinue();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleContinue = () => {
    onClose();
    navigate('/courses');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            >
              <span
                className="text-2xl"
                style={{
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              >
                {['🎉', '✨', '⭐', '🎊', '💫', '🌟'][Math.floor(Math.random() * 6)]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Success Modal */}
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-bounce-in"
        dir="rtl"
      >
        {/* Success Icon with Animation */}
        <div className="bg-gradient-to-br from-green-400 to-green-600 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-10 animate-pulse"></div>
          
          <div className="relative z-10">
            <div className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 animate-scale-in shadow-xl">
              <svg
                className="w-16 h-16 text-green-500 animate-check"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            
            <h2 className="text-3xl font-extrabold text-white mb-2 animate-fade-in">
              تم الاشتراك بنجاح! 🎉
            </h2>
            <p className="text-green-50 text-lg">
              مبروك! أصبحت الآن عضواً في عائلتنا
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-8">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">الخطة المختارة</p>
                  <p className="font-bold text-gray-800 text-lg">{planName}</p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">المبلغ المدفوع</p>
                <p className="font-bold text-green-600 text-2xl">${amount}</p>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              الآن يمكنك الاستفادة من:
            </h3>
            <ul className="space-y-2">
              {[
                'الوصول الكامل لجميع الدروس والمحتويات',
                'التمارين التفاعلية والألعاب التعليمية',
                'متابعة التقدم والحصول على شهادات',
                'دعم فني مباشر ومتابعة من المعلمين'
              ].map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 animate-slide-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Button */}
          <button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 text-lg"
          >
            <span>ابدأ التعلم الآن</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <p className="text-center text-gray-500 text-sm mt-4">
            سيتم التوجيه تلقائياً خلال 5 ثوانٍ...
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes check {
          0% {
            stroke-dasharray: 0, 100;
          }
          100% {
            stroke-dasharray: 100, 0;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out 0.2s backwards;
        }
        .animate-check {
          animation: check 0.5s ease-out 0.5s backwards;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out 0.3s backwards;
        }
        .animate-slide-in {
          animation: slide-in 0.4s ease-out backwards;
        }
      `}</style>
    </div>
  );
}

export default SuccessModal;

