import React from 'react';

// Import Icons
import gamepadIcon from '../assets/icons/gamepad.svg';
import playIcon from '../assets/icons/Play.svg';
import bookIcon from '../assets/icons/book-open.svg';
import penIcon from '../assets/icons/pen-line.svg';
import certificateIcon from '../assets/icons/certificate.svg';

// Mock Data based on the image
const lessons = [
  {
    id: 1,
    title: "الدرس الاول",
    isOpen: true, // Made open
    isCompleted: false, // Changed to false to show the segmented circle like Lesson 2
    totalTabs: 5,
    completedTabs: 1,
    subItems: [
      { id: 1, title: "حرف الجيم", type: "check", isCompleted: true, isCurrent: true },
      { id: 2, title: "فيديو تدريبي", type: "video", icon: playIcon, duration: "12:20:00" },
      { id: 3, title: "الكتاب", type: "book", icon: bookIcon, count: 1 },
      { id: 4, title: "تدريبات", type: "quiz", icon: penIcon, count: 3 },
      { id: 5, title: "العاب", type: "game", icon: gamepadIcon, count: 3 }
    ]
  },
  {
    id: 2,
    title: "الدرس الثاني",
    isCompleted: false,
    isOpen: false, // Closed
    totalTabs: 5,
    completedTabs: 0
  },
  {
    id: 3,
    title: "الدرس الثالث",
    isCompleted: false,
    isOpen: false,
    totalTabs: 4,
    completedTabs: 0
  }
];

const CircularProgress = ({ total, completed, isCompleted }) => {
  if (isCompleted) {
    return (
      <div className="w-10 h-10 rounded-full border-2 border-[#A7F3D0] flex items-center justify-center bg-[#ECFDF5]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#10B981]" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  const radius = 18; 
  const circumference = 2 * Math.PI * radius;
  const gap = 4; 
  const segmentLength = (circumference / total) - gap;
  
  return (
    <div className="w-12 h-12 relative">
       <svg width="44" height="44" viewBox="0 0 44 44" className="transform -rotate-90">
          {Array.from({ length: total }).map((_, i) => {
             const isSegmentCompleted = i < completed;
             const color = isSegmentCompleted ? "#6EE7B7" : "#D1D5DB";
             const strokeDasharray = `${segmentLength} ${circumference - segmentLength}`;
             const rotateAngle = (i * 360) / total;
             
             return (
               <circle
                 key={i}
                 cx="22"
                 cy="22"
                 r={radius}
                 fill="none"
                 stroke={color}
                 strokeWidth="3" 
                 strokeDasharray={strokeDasharray}
                 strokeLinecap="round"
                 transform={`rotate(${rotateAngle} 22 22)`}
               />
             );
          })}
       </svg>
       <div className="absolute inset-0 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${completed > 0 ? 'text-[#6EE7B7]' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
       </div>
    </div>
  );
};

const SubItem = ({ item, onClick, isCurrent }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative flex items-center justify-between mb-3 cursor-pointer w-full z-10
        ${isCurrent ? 'bg-[#34D399] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}
      `}
      style={{
        borderRadius: '60px',
        border: isCurrent ? '2px solid #34D399' : '2px solid #CECECE', // Updated border logic
        paddingTop: '12px',
        paddingRight: '11px',
        paddingBottom: '12px',
        paddingLeft: '11px',
        gap: '8px',
        boxShadow: '0px 0px 11px 0px #00000029, -10px 5px 0px 0px #00000024 inset'
      }}
    >
      
      {/* Right Side: Icon & Title */}
      <div className="flex items-center gap-[8px] flex-grow">
         
         {/* The Icon/Circle - On the RIGHT */}
         {item.type === 'check' && (
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 ${isCurrent ? 'border-white' : 'border-gray-400'}`}>
               {item.isCompleted && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
            </div>
         )}
         
         {/* Image Icons for other types */}
         {item.icon && (
            <div className={`w-6 h-6 flex items-center justify-center flex-shrink-0`}>
               <img src={item.icon} alt={item.title} className={`w-full h-full object-contain ${isCurrent ? 'brightness-0 invert' : ''}`} />
            </div>
         )}

         <span className="font-bold text-sm">{item.title}</span>
      </div>

      {/* Left Side: Info */}
      <div className="text-xs font-medium flex-shrink-0 pl-2">
         {item.type === 'video' && item.duration}
         {item.count && <span>{item.count}</span>}
      </div>
    </div>
  );
}

function Sidebar({ activeTab, onTabSelect }) {
  return (
    <div className="bg-transparent w-full h-full p-4 pl-0 flex flex-col gap-[20px] font-sans" dir="rtl">
      
      {lessons.map((lesson, index) => (
        <div key={lesson.id} className="relative flex flex-col items-center w-full">
           
           {/* Lesson Header */}
           <div className={`
             relative z-20 bg-white rounded-[2rem] p-3 px-4 flex items-center justify-between shadow-sm mb-0 cursor-pointer w-full
             ${lesson.isOpen ? 'mb-[20px]' : ''}
           `}>
              <div className="flex items-center justify-between w-full">
                 <span className="font-extrabold text-gray-800 text-xl">{lesson.title}</span>
                 <div className="bg-white">
                    <CircularProgress 
                      total={lesson.totalTabs} 
                      completed={lesson.completedTabs} 
                      isCompleted={lesson.isCompleted} 
                    />
                 </div>
              </div>
           </div>

           {/* Sub Items Container */}
           {lesson.isOpen && lesson.subItems && (
             <div className="relative w-full flex justify-center pb-2">
                
                {/* Double Vertical Solid Lines */}
                {/* Inset was 50px, increasing inset makes lines closer to center, decreasing makes them wider. 
                    User said "make distance between tab edge and line SMALLER by 20px".
                    If previous was 50px (distance from edge), smaller distance means 30px.
                */}
                <div 
                  className="absolute top-[26px] bottom-[26px] border-x-2 border-solid border-[#9bbb59] z-0 pointer-events-none"
                  style={{ 
                    left: '30px', // Changed from 50px to 30px (smaller distance from edge)
                    right: '30px', // Changed from 50px to 30px
                    width: 'auto'
                  }}
                ></div>

                {/* Sub Items List */}
                <div className="relative z-10 flex flex-col gap-2 w-full max-w-[338px]">
                   {lesson.subItems.map(subItem => (
                     <SubItem 
                        key={subItem.id} 
                        item={subItem} 
                        onClick={() => onTabSelect && onTabSelect(subItem.title)}
                        isCurrent={activeTab === subItem.title}
                     />
                   ))}
                </div>
             </div>
           )}

        </div>
      ))}

      {/* Completion Certificate Button */}
      <div className="mt-4">
         <button 
            className="w-full text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-lg"
            style={{
              backgroundColor: '#4F67BD',
              borderRadius: '48px',
              padding: '18px'
            }}
         >
            <img src={certificateIcon} alt="Certificate" className="w-6 h-6 brightness-0 invert" />
            شهادة اتمام
         </button>
      </div>

    </div>
  );
}

export default Sidebar;
