import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bgPattern from '../assets/images/bg.png';
import animal1 from '../assets/images/animal1.png';
import animal2 from '../assets/images/animal2.png';

function LoginPage() {
  const [isForgotPassword, setIsForgotPassword] = useState(false);

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
            
            {!isForgotPassword ? (
              // Login Form
              <>
                <h1 className="text-3xl font-extrabold text-gray-800 mb-8">تسجيل الدخول</h1>

                <form className="w-full flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                  
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-gray-700" htmlFor="email">البريد الإلكتروني</label>
                    <input 
                      id="email"
                      type="email" 
                      placeholder="example@domain.com"
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#4F67BD] focus:outline-none transition-colors bg-gray-50"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <label className="font-bold text-gray-700" htmlFor="password">كلمة المرور</label>
                        <button 
                            type="button"
                            onClick={() => setIsForgotPassword(true)}
                            className="text-sm text-[#4F67BD] font-bold hover:underline"
                        >
                            نسيت كلمة المرور؟
                        </button>
                    </div>
                    <input 
                      id="password"
                      type="password" 
                      placeholder="********"
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#4F67BD] focus:outline-none transition-colors bg-gray-50"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="mt-4 w-full bg-[#4F67BD] text-white font-bold py-3 px-6 rounded-full shadow-md hover:bg-[#3e539a] transition-transform active:scale-95"
                  >
                    دخول
                  </button>

                </form>

                <div className="mt-6 text-center text-gray-600">
                  <span>ليس لديك حساب؟ </span>
                  <Link to="/signup" className="text-[#4F67BD] font-bold hover:underline">
                    سجل الآن
                  </Link>
                </div>
              </>
            ) : (
              // Forgot Password Form
              <>
                <h1 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">استعادة كلمة المرور</h1>
                <p className="text-gray-600 text-center mb-8 text-sm">
                    أدخل بريدك الإلكتروني وسنرسل لك رابطاً لاستعادة كلمة المرور.
                </p>

                <form className="w-full flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                  
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-gray-700" htmlFor="reset-email">البريد الإلكتروني</label>
                    <input 
                      id="reset-email"
                      type="email" 
                      placeholder="example@domain.com"
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#4F67BD] focus:outline-none transition-colors bg-gray-50"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="mt-2 w-full bg-[#4F67BD] text-white font-bold py-3 px-6 rounded-full shadow-md hover:bg-[#3e539a] transition-transform active:scale-95"
                  >
                    إرسال الرابط
                  </button>

                  <button 
                    type="button"
                    onClick={() => setIsForgotPassword(false)}
                    className="mt-2 w-full bg-transparent text-gray-600 font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition-colors border-2 border-transparent hover:border-gray-200"
                  >
                    العودة لتسجيل الدخول
                  </button>

                </form>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
