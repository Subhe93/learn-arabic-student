import React from 'react';
import levelFileImg from '../../assets/images/level-file.png';

const LevelCard = ({ levelNumber, animalImage, completedLessons, totalLessons, title, color, onClick }) => {
  const progress = (completedLessons / totalLessons) * 100;
  const isLocked = completedLessons === 0 && levelNumber !== 1; // Assuming level 1 is always open, or logic based on previous level. 
  // For now keeping strict `completedLessons === 0` logic from before but adding prop usage.
  // Actually the user prompt before said "locked if completedLessons is 0", I'll stick to that or just pass onClick.
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      onClick={handleClick}
      // Reduced max-w to fit 3 in a row within half screen width
      className={`relative w-full max-w-[250px] mx-auto transition-transform hover:scale-105 duration-300 ${isLocked ? 'filter grayscale cursor-not-allowed' : 'cursor-pointer'}`}
    >
      
      {/* The File Folder Container */}
      <div className="relative">
          
          {/* Title on the Tab */}
          {/* Adjusted position and font size for smaller card */}
          <div className="absolute top-4 right-6 z-20">
              <h3 className="text-base font-bold text-gray-900">{title}</h3>
          </div>

          {/* Animal Image */}
          {/* Adjusted size and position */}
          <div className="absolute top-14 left-8 z-10">
             <img 
               src={animalImage} 
               alt="Animal" 
               className="w-[100px] h-[90px] object-contain"
             />
          </div>

          {/* Background Folder Image */}
          <div className="relative z-0">
             <img src={levelFileImg} alt="Level File Background" className="w-full h-auto drop-shadow-md" />
          </div>

          {/* The Bottom Box (Progress Area) */}
          <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-[#FFD26E] rounded-b-3xl flex flex-col justify-center px-4 z-20">
              <div className="text-right text-[#8B5E3C] font-bold mb-1 text-sm">عدد الدروس</div>
              
              {/* Progress Bar & Numbers */}
              <div className="flex items-center justify-between dir-ltr gap-2">
                  {/* Left Number (Total) */}
                  <span className="font-bold text-[#8B5E3C] text-xs">{totalLessons}</span>
                  
                  {/* Progress Bar */}
                  <div className="flex-1 h-1.5 bg-[#E5E7EB]/50 rounded-full overflow-hidden relative">
                      <div 
                        className="h-full bg-[#4B7F52] rounded-full relative z-10"
                        style={{ width: `${progress}%` }}
                      ></div>
                  </div>
                  
                  {/* Right Number (Completed) */}
                  <span className="font-bold text-[#8B5E3C] text-xs">{completedLessons}</span>
              </div>
          </div>
      </div>
    </div>
  );
};

export default LevelCard;
