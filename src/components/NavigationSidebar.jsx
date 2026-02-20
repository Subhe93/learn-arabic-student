import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavigationSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  // Removed early return "if (!isOpen) return null;" to allow animation to play out

  const handleLogout = async () => {
    // Clear auth state
    await logout();
    onClose();
    navigate('/login');
  };

  const menuItems = [
    { 
      label: 'الرئيسية', 
      path: '/courses',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      label: 'الجلسات المباشرة', 
      path: '/sessions',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      label: 'الملف الشخصي', 
      path: '/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      label: 'التعلم', 
      path: '/learn',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
  ];

  return (
    <div className={`fixed inset-0 z-[100] transition-visibility duration-300 ${isOpen ? 'visible' : 'invisible delay-300'}`} dir="rtl">
        {/* Backdrop */}
        <div 
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
            onClick={onClose}
        ></div>
        
        {/* Sidebar Content - Opens from Right (RTL) */}
        <div className={`fixed top-0 right-0 w-[85%] max-w-[320px] h-full bg-white shadow-2xl p-6 flex flex-col transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            {/* Close Button */}
            <button 
            className="self-start p-2 bg-gray-100 rounded-full text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors mb-8" 
            onClick={onClose}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            
            <nav className="flex flex-col gap-2">
                {menuItems.map((item, index) => (
                    <Link 
                        key={index} 
                        to={item.path} 
                        className="text-lg font-bold text-gray-700 hover:text-[#4F67BD] hover:bg-blue-50 p-4 rounded-xl transition-all text-right border-b border-gray-100 last:border-0 flex items-center justify-start gap-3"
                        onClick={onClose}
                    >
                        <div className="text-gray-500">{item.icon}</div>
                        <span>{item.label}</span>
                    </Link>
                ))}

                <button 
                    onClick={handleLogout}
                    className="text-lg font-bold text-red-500 hover:text-red-600 hover:bg-red-50 p-4 rounded-xl transition-all text-right mt-4 flex items-center justify-start gap-3"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>تسجيل الخروج</span>
                </button>
            </nav>
        </div>
    </div>
  );
};

export default NavigationSidebar;

