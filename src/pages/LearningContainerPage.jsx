import React, { useState } from 'react';
import TopNavBar from '../components/TopNavBar';
import Sidebar from '../components/Sidebar';
import levelOneImg from '../assets/images/levelone1.png';

function LearningContainerPage() {
  const [activeTab, setActiveTab] = useState('letter-jeem');

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
           <Sidebar />
        </div>

        {/* Main Content Area (Left Side in RTL) */}
        {/* Increased padding-left by approx 20px (p-6 is 24px, added pl-[44px] approx) */}
        <div className="flex-1 h-full overflow-y-auto p-6 pl-[44px]">
           
           {/* Outer Container - Border Radius 8px */}
           <div className="bg-white rounded-[8px] shadow-sm border-2 border-[#dc3d3c] p-2 min-h-[600px] relative">
              
              {/* Inner Border Container - Border Radius 8px */}
              <div className="border-2 border-[#555555] rounded-[8px] h-full w-full p-6 md:p-12 flex flex-col items-center">
                 
                 {/* Illustration Image */}
                 <div className="w-full max-w-3xl mb-10 text-center">
                    <img 
                      src={levelOneImg} 
                      alt="Letter Jeem Lesson" 
                      className="w-full h-auto object-contain mx-auto"
                    />
                 </div>

                 {/* Story Text - Updated Typography */}
                 {/* font-weight: 700 (font-bold), font-size: 39px, line-height: 79px */}
                 <div className="w-full text-right font-bold text-gray-800 space-y-4 font-scheherazade px-4" style={{ fontSize: '39px', lineHeight: '79px' }}>
                    <p>
                      كان هُناك <span className="text-[#BE185D]">رَجُلٌ</span> يُدعى <span className="text-[#BE185D]">جَابِر</span> ،
                    </p>
                    <p>
                      كان <span className="text-[#BE185D]">جَابِرٌ</span> يَرعى <span className="text-[#BE185D]">الجِمَالَ</span> في الوادِي ، وذاتَ
                    </p>
                    <p>
                      يَومٍ نَامَ <span className="text-[#BE185D]">جَابِرٌ</span> تَحتَ <span className="text-[#BE185D]">شَجَرَةٍ</span> ،
                    </p>
                    <p>
                      فَهَربَت <span className="text-[#BE185D]">جِمَالُ</span> <span className="text-[#BE185D]">جَابِرٍ</span> إلى <span className="text-[#BE185D]">جَبَلٍ</span> مُجاوِرٍ لِلوادِي
                    </p>
                 </div>
                 
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

export default LearningContainerPage;
