import React, { useState } from 'react';
import TopNavBar from '../components/TopNavBar';
import Sidebar from '../components/Sidebar';
import LessonContent from '../components/LessonContent';

function LearningContainerPage() {
  const [activeTab, setActiveTab] = useState('حرف الجيم');

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans" dir="rtl">
      
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <TopNavBar 
          levelName="المستوى الأول" 
          completedLessons={1} 
          totalLessons={5} 
        />
      </div>

      {/* Main Layout Container */}
      {/* Added top padding (50px) and adjusted left padding (+20px approx) */}
      <div className="flex flex-1 relative h-[calc(100vh-140px)] overflow-hidden w-full max-w-[1440px] mx-auto pt-[50px]">
        
        {/* Sidebar (Right Side in RTL) */}
        <div className="w-[30%] min-w-[320px] max-w-[380px] flex-shrink-0 hidden lg:block h-full overflow-y-auto custom-scrollbar pl-4">
           <Sidebar activeTab={activeTab} onTabSelect={setActiveTab} />
        </div>

        {/* Main Content Area (Left Side in RTL) */}
        {/* Increased padding-left by approx 20px (p-6 is 24px, added pl-[44px] approx) */}
        <div className="flex-1 h-full overflow-y-auto p-6 pl-[44px]">
           
           {/* Outer Container - Border Radius 8px */}
           <div className="bg-white rounded-[8px] shadow-sm border-2 border-[#dc3d3c] p-2 min-h-[600px] relative h-full">
              
              {/* Inner Border Container - Border Radius 8px */}
              <div className="border-2 border-[#555555] rounded-[8px] h-full w-full p-6 md:p-12 flex flex-col items-center justify-center relative">
                 
                 <LessonContent activeTab={activeTab} />
                 
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

export default LearningContainerPage;
