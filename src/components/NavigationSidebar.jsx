import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavigationSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  // Removed early return "if (!isOpen) return null;" to allow animation to play out

  const handleLogout = () => {
    // Clear any auth state if needed
    onClose();
    navigate('/login');
  };

  const menuItems = [
    { label: 'الرئيسية', path: '/courses' },
    { label: 'الملف الشخصي', path: '/profile' },
    { label: 'التعلم', path: '/learn' },
  ];

  return (
    <div className={`fixed inset-0 z-[100] flex justify-start transition-visibility duration-300 ${isOpen ? 'visible' : 'invisible delay-300'}`} dir="rtl">
        {/* Backdrop */}
        <div 
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
            onClick={onClose}
        ></div>
        
        {/* Sidebar Content */}
        <div className={`relative w-[85%] max-w-[300px] h-full bg-white shadow-2xl p-6 flex flex-col transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            {/* Close Button */}
            <button 
            className="self-end p-2 bg-gray-100 rounded-full text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors mb-8" 
            onClick={onClose}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            
            <nav className="flex flex-col gap-4">
                {menuItems.map((item, index) => (
                    <Link 
                        key={index} 
                        to={item.path} 
                        className="text-xl font-bold text-gray-700 hover:text-[#4F67BD] hover:bg-gray-50 p-3 rounded-lg transition-all text-right border-b border-gray-100 last:border-0"
                        onClick={onClose}
                    >
                        {item.label}
                    </Link>
                ))}

                <button 
                    onClick={handleLogout}
                    className="text-xl font-bold text-red-500 hover:text-red-600 hover:bg-red-50 p-3 rounded-lg transition-all text-right mt-4 flex items-center justify-end gap-2"
                >
                    <span>تسجيل الخروج</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </nav>
        </div>
    </div>
  );
};

export default NavigationSidebar;

