import React, { useState } from 'react';
import TopNavBar from '../components/TopNavBar';
import Sidebar from '../components/Sidebar';
import LessonContent from '../components/LessonContent';
import celebrationBg from '../assets/images/image 13.png';
import bgPattern from '../assets/images/bg.png';

function LearningContainerPage() {
  const [activeTab, setActiveTab] = useState('حرف الجيم');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isCertificate = activeTab === 'certificate';
  const isBookTab = activeTab === 'الكتاب';

  return (
    <div 
      className="min-h-screen flex flex-col font-sans transition-all duration-300 ease-in-out relative"
      dir="rtl"
      style={{
        backgroundColor: '#DDF0EB', // New background color
      }}
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
      
      {/* Celebration Image (Only for Certificate) - Horizontal Repeat */}
      {isCertificate && (
        <div 
            className="absolute top-0 left-0 w-full h-2/3 z-10 pointer-events-none"
            style={{
                backgroundImage: `url('${celebrationBg}')`,
                backgroundRepeat: 'repeat-x', // Repeat horizontally
                backgroundSize: 'contain', 
                backgroundPosition: 'top center'
            }}
        >
        </div>
      )}

      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <TopNavBar 
          levelName="المستوى الأول" 
          completedLessons={1} 
          totalLessons={5} 
        />
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden fixed bottom-6 left-6 z-50 bg-[#4F67BD] text-white p-4 rounded-full shadow-xl hover:bg-[#3e539a] transition-colors"
        onClick={() => setIsSidebarOpen(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden flex justify-end">
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
              
              {/* Sidebar Content */}
              <div className="relative w-[85%] max-w-[360px] h-full bg-[#DDF0EB] shadow-2xl overflow-y-auto p-4 animate-slide-in-right">
                  {/* Close Button */}
                  <button 
                    className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-sm text-gray-600 hover:text-red-500 transition-colors z-20" 
                    onClick={() => setIsSidebarOpen(false)}
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                  </button>
                  
                  <div className="mt-8">
                    <Sidebar activeTab={activeTab} onTabSelect={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} />
                  </div>
              </div>
          </div>
      )}

      {/* Main Layout Container */}
      <div className="flex flex-1 relative z-20 h-[calc(100vh-140px)] overflow-hidden w-full max-w-[1440px] mx-auto pt-[20px] lg:pt-[50px]">
        
        {/* Sidebar (Right Side in RTL - Desktop) */}
        <div className="w-[30%] min-w-[320px] max-w-[380px] flex-shrink-0 hidden lg:block h-full overflow-y-auto custom-scrollbar pl-4">
           <Sidebar activeTab={activeTab} onTabSelect={setActiveTab} />
        </div>

        {/* Main Content Area (Left Side in RTL) */}
        <div className="flex-1 h-full overflow-y-auto p-4 lg:p-6 lg:pl-[44px]">
           
           {/* Outer Container */}
           <div className="bg-white rounded-[8px] shadow-sm border-2 border-[#dc3d3c] p-2 min-h-[600px] relative h-full">
              
              {/* Inner Border Container */}
              <div className={`border-2 border-[#555555] rounded-[8px] h-full w-full flex flex-col items-center justify-center relative ${isBookTab ? 'p-0' : 'p-4 md:p-12'}`}>
                 
                 <LessonContent activeTab={activeTab} />
                 
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

export default LearningContainerPage;
