import React from 'react';

const SessionCard = ({ title, description, time, dateLabel, isTomorrow, isClass, onClick }) => {
  return (
    <div className="bg-[#F9FAFB] rounded-[2rem] p-6 mb-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      
      {/* Right Side: Content (Title, Desc, Time) */}
      <div className="flex-1 text-right w-full">
        
        {/* Header: Date Badge & Time */}
        {/* Align with title (Right) -> justify-start in RTL */}
        {/* No right padding/margin on the container to ensure it aligns with title text */}
        <div className="flex justify-start items-center gap-3 mb-3">
             {/* Date Label 'غداً' (First/Rightmost) */}
             <div className={`${isClass ? 'text-[#4F67BD] border-[#4F67BD] bg-blue-50' : 'text-[#EF4444] border-[#EF4444] bg-white'} border px-4 py-1 rounded-full font-bold text-sm`}>
                {dateLabel}
             </div>

             {/* Time (Second/Left of Date) - Only show if time exists */}
             {time && (
               <div className="text-[#EF4444] bg-[#FEE2E2] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 border border-[#FECACA]">
                  <span dir="ltr">{time}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
               </div>
             )}
        </div>

        <h3 className="text-2xl font-black text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed pl-0 md:pl-4">
          {description}
        </p>
      </div>

      {/* Left Side: Action Button */}
      <div className="w-full md:w-auto flex-shrink-0">
         <button 
           onClick={onClick}
           className={`${isClass ? 'bg-[#4F67BD] hover:bg-[#3e539a]' : 'bg-[#8BAA36] hover:bg-[#7a962e]'} text-white font-bold py-3 px-8 rounded-full flex items-center justify-center gap-3 transition-colors w-full md:w-auto shadow-sm text-lg group`}
         >
            {/* Text on Right */}
            <span>{isClass ? 'عرض الصف' : 'انضم الان'}</span>
            
            {/* Arrow Icon on Left (Pointing Left) */}
            {/* Using a clear left arrow path */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
         </button>
      </div>

    </div>
  );
};

export default SessionCard;
