import React from 'react';
import { Link } from 'react-router-dom';

function TopNavBar({ 
  levelName = "المستوى الأول", 
  completedLessons = 1, 
  totalLessons = 5 
}) {
  
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="bg-white w-full flex flex-col font-sans" dir="rtl">
      
      {/* Top Section: User Capsule & Back Button */}
      <div className="flex justify-between items-center px-6 py-4">
        
        {/* Right: User Capsule */}
        {/* Capsule Background: Grayish/White */}
        <div className="bg-[#F3F4F6] rounded-full p-1.5 pl-6 pr-1.5 flex items-center gap-4 shadow-sm">
           
           {/* Points Badge (Right) */}
           <div className="bg-[#C07749] text-white px-5 py-2 rounded-full font-bold text-sm min-w-[90px] text-center shadow-sm">
              500 نقطة
           </div>

           {/* User Info (Left) */}
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                 <img src="https://i.pravatar.cc/150?img=12" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-gray-800 text-sm">أحمد محمود</span>
           </div>
        </div>

        {/* Left: Back Button */}
        <button className="flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-colors group">
           <span className="text-sm font-bold">العودة للرئيسية</span>
           <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white shadow-sm group-hover:bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /> 
                {/* Right arrow in RTL context points "Back" (Left visually? No, "Back" in RTL usually means going Left (Previous). 
                    Wait, "Return to Home" usually implies going back. 
                    The icon in image is a left arrow (<-). 
                    In RTL, back is usually Right arrow (->) if we think about history, but visually Left arrow is often used for "Back" button regardless. 
                    Let's check the image... The image shows an arrow pointing Left (<-).
                    So I need a Left Arrow.
                */}
              </svg>
              {/* Correction: Use Left Arrow explicitly */}
              {/* M10 19l-7-7m0 0l7-7m-7 7h18 */}
           </div>
        </button>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gray-100"></div>

      {/* Bottom Section: Level Title & Progress */}
      <div className="flex justify-between items-end px-6 py-6">
         
         {/* Right: Level Title */}
         <div>
            <h1 className="text-2xl font-black text-gray-800">{levelName}</h1>
         </div>

         {/* Left: Progress Bar */}
         <div className="w-1/3 max-w-xs">
            {/* Bar */}
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
               <div 
                 className="h-full bg-[#5B96B6] rounded-full" 
                 style={{ width: `${progressPercentage}%` }}
               ></div>
            </div>
            
            {/* Stats Text */}
            <div className="flex justify-between text-xs text-gray-500 font-medium">
               <span>{progressPercentage}%</span>
               <span>{completedLessons} - {totalLessons} دروس</span>
            </div>
         </div>

      </div>

    </div>
  );
}

// Re-write the icon part to be correct based on image analysis
// Image shows: (<-) Circle Icon ... Text "العودة للرئيسية"
// My code: Text ... Icon (<-) 
// In RTL flex: Text (Right), Icon (Left).
// So structure <Text /> <Icon /> is correct for visual [Text] [Icon].
// Let's fix the SVG path to be Left Arrow.

function BackIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
    );
}

// Updating the main component with the fix
function TopNavBarFinal({ 
  levelName = "المستوى الأول", 
  completedLessons = 0, // Image shows 0% so maybe 0 completed
  totalLessons = 5 
}) {
  
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="bg-white w-full flex flex-col font-sans shadow-sm" dir="rtl">
      
      {/* Top Section */}
      <div className="flex justify-between items-center px-6 py-4 gap-2">
        
        {/* Right: User Capsule */}
        <Link to="/profile" className="bg-[#F3F4F6] rounded-full p-1 pl-2 sm:pl-6 pr-1 flex items-center gap-2 sm:gap-3 hover:bg-gray-200 transition-colors cursor-pointer decoration-transparent max-w-[60%] sm:max-w-none overflow-hidden">
             {/* Points (Rightmost) */}
             <div className="bg-[#C07749] text-white px-3 sm:px-6 py-2 rounded-full font-bold text-xs sm:text-sm shadow-sm whitespace-nowrap">
                500 نقطة
             </div>
             
             {/* User Info */}
             <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white flex-shrink-0">
                   <img src="https://i.pravatar.cc/150?img=12" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-gray-800 text-xs sm:text-sm truncate hidden sm:inline">أحمد محمود</span>
             </div>
        </Link>

        {/* Left: Back Button */}
        <Link to="/courses" className="flex items-center gap-2 sm:gap-3 text-gray-600 hover:text-gray-800 transition-colors group">
           <span className="text-xs sm:text-sm font-bold pt-1 whitespace-nowrap">العودة للرئيسية</span>
           <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white group-hover:bg-gray-50 shadow-sm flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
           </div>
        </Link>

      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gray-100"></div>

      {/* Bottom Section */}
      <div className="flex justify-between items-center px-6 py-6">
         
         {/* Right: Level Title */}
         <h1 className="text-2xl font-black text-gray-800">{levelName}</h1>

         {/* Left: Progress Bar */}
         <div className="w-64"> {/* Fixed width constraint */}
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
               <div 
                 className="h-full bg-[#5B96B6] rounded-full transition-all duration-500" 
                 style={{ width: `${progressPercentage}%` }}
               ></div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-500 font-bold px-1">
               <span>{progressPercentage}%</span>
               <span className="dir-rtl">{completedLessons} - {totalLessons} دروس</span>
            </div>
         </div>

      </div>
    </div>
  );
}

export default TopNavBarFinal;
