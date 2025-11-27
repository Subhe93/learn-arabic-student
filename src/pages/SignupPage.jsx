import React from 'react';
import { Link } from 'react-router-dom';
import bgPattern from '../assets/images/bg.png';

function SignupPage() {
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
        {/* Outer Card */}
        <div className="bg-white rounded-[8px] shadow-lg border-2 border-[#dc3d3c] p-2">
          {/* Inner Border */}
          <div className="border-2 border-[#555555] rounded-[8px] p-6 md:p-8 flex flex-col items-center">
            
            <h1 className="text-3xl font-extrabold text-gray-800 mb-8">إنشاء حساب جديد</h1>

            <form className="w-full flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              
              <div className="flex flex-col gap-2">
                <label className="font-bold text-gray-700" htmlFor="name">الاسم الكامل</label>
                <input 
                  id="name"
                  type="text" 
                  placeholder="الاسم الكامل"
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#4F67BD] focus:outline-none transition-colors bg-gray-50"
                />
              </div>

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
                <label className="font-bold text-gray-700" htmlFor="password">كلمة المرور</label>
                <input 
                  id="password"
                  type="password" 
                  placeholder="********"
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#4F67BD] focus:outline-none transition-colors bg-gray-50"
                />
              </div>
              
               <div className="flex flex-col gap-2">
                <label className="font-bold text-gray-700" htmlFor="confirm-password">تأكيد كلمة المرور</label>
                <input 
                  id="confirm-password"
                  type="password" 
                  placeholder="********"
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#4F67BD] focus:outline-none transition-colors bg-gray-50"
                />
              </div>

              <button 
                type="submit"
                className="mt-4 w-full bg-[#4F67BD] text-white font-bold py-3 px-6 rounded-full shadow-md hover:bg-[#3e539a] transition-transform active:scale-95"
              >
                تسجيل
              </button>

            </form>

            <div className="mt-6 text-center text-gray-600">
              <span>لديك حساب بالفعل؟ </span>
              <Link to="/login" className="text-[#4F67BD] font-bold hover:underline">
                سجل الدخول
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
