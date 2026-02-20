import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import bgPattern from '../assets/images/bg.png';
import animal3 from '../assets/images/animal3.svg';
import animal4 from '../assets/images/animal4.svg';

function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSignup = async (e) => {
    e?.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('يرجى ملء جميع الحقول');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setIsLoading(true);
    setError('');
    
    const result = await register({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email,
      password: formData.password,
    });
    
    setIsLoading(false);
    
    if (result.success) {
      // If token is returned, navigate to courses, otherwise show success message
      if (result.data?.token || result.data?.data?.token) {
        navigate('/courses');
      } else {
        setError('تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب');
        // Optionally navigate to login after a delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } else {
      setError(result.error || 'فشل إنشاء الحساب');
    }
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
            src={animal3} 
            alt="Decoration" 
            className="absolute -top-20 -left-24 w-40 h-auto z-20 pointer-events-none transform -rotate-12"
        />
        <img 
            src={animal4} 
            alt="Decoration" 
            className="absolute -bottom-12 -right-20 w-36 h-auto z-20 pointer-events-none transform rotate-6"
        />

        {/* Outer Card */}
        <div className="bg-white rounded-[8px] shadow-lg border-2 border-[#dc3d3c] p-2 relative z-10">
          {/* Inner Border */}
          <div className="border-2 border-[#555555] rounded-[8px] p-6 md:p-8 flex flex-col items-center">
            
            <h1 className="text-3xl font-extrabold text-gray-800 mb-8">إنشاء حساب جديد</h1>

            {error && (
              <div className={`w-full mb-4 p-3 border rounded-lg text-sm text-center ${
                error.includes('نجاح') 
                  ? 'bg-green-100 border-green-400 text-green-700' 
                  : 'bg-red-100 border-red-400 text-red-700'
              }`}>
                {error}
              </div>
            )}

            <form className="w-full flex flex-col gap-4" onSubmit={handleSignup}>
              
              {/* First Name and Last Name - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-gray-700" htmlFor="firstName">الاسم الأول</label>
                  <input 
                    id="firstName"
                    name="firstName"
                    type="text" 
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="الاسم الأول"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#4F67BD] focus:outline-none transition-colors bg-gray-50"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-bold text-gray-700" htmlFor="lastName">الاسم الثاني</label>
                  <input 
                    id="lastName"
                    name="lastName"
                    type="text" 
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="الاسم الثاني"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#4F67BD] focus:outline-none transition-colors bg-gray-50"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-gray-700" htmlFor="email">البريد الإلكتروني</label>
                <input 
                  id="email"
                  name="email"
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@domain.com"
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#4F67BD] focus:outline-none transition-colors bg-gray-50"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-gray-700" htmlFor="password">كلمة المرور</label>
                <input 
                  id="password"
                  name="password"
                  type="password" 
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#4F67BD] focus:outline-none transition-colors bg-gray-50"
                  required
                  disabled={isLoading}
                />
              </div>
              
               <div className="flex flex-col gap-2">
                <label className="font-bold text-gray-700" htmlFor="confirm-password">تأكيد كلمة المرور</label>
                <input 
                  id="confirm-password"
                  name="confirmPassword"
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#4F67BD] focus:outline-none transition-colors bg-gray-50"
                  required
                  disabled={isLoading}
                />
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="mt-4 w-full bg-[#4F67BD] text-white font-bold py-3 px-6 rounded-full shadow-md hover:bg-[#3e539a] transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>جاري إنشاء الحساب...</span>
                  </>
                ) : (
                  'تسجيل'
                )}
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
