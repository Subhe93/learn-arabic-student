import React from 'react';
// Import animal images for the map
import animal1 from '../../assets/images/animal1.png';
import animal2 from '../../assets/images/animal2.png';
import animal3 from '../../assets/images/animal3.png';
import animal4 from '../../assets/images/animal4.png';
import animal5 from '../../assets/images/animal5.png';
import animal6 from '../../assets/images/animal6.png';
import animal7 from '../../assets/images/animal7.png';
import animal8 from '../../assets/images/animal8.png';
import animal9 from '../../assets/images/animal9.png';

const animals = [animal1, animal2, animal3, animal4, animal5, animal6, animal7, animal8, animal9];

const MapSection = () => {
  // Coordinates based on the zigzag image provided
  const nodes = [
    { x: 5,  y: 30, img: animal1 }, 
    { x: 15, y: 60, img: animal2 }, 
    { x: 25, y: 30, img: animal3 }, 
    { x: 35, y: 60, img: animal4 }, 
    { x: 45, y: 30, img: animal5 }, 
    { x: 55, y: 60, img: animal6 }, 
    { x: 65, y: 30, img: animal7 }, 
    { x: 75, y: 60, img: animal8 }, 
    { x: 88, y: 30, img: animal9 }, 
  ];

  const pathData = nodes.map((n, i) => `${i === 0 ? 'M' : 'L'} ${n.x} ${n.y}`).join(' ');

  return (
    // Hero size: 2/3 screen height
    <div className="relative w-full h-[66vh] min-h-[600px] overflow-hidden rounded-b-[3rem]">
      
      {/* Background Image - Full Width/Height */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/images/bg-map.png')" }} 
      ></div>
      
      {/* Top Header Overlay - Always Visible */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 md:p-8 flex justify-between items-start">
         
         {/* Right Side: Single Capsule for User Profile & Points */}
         <div className="bg-white rounded-full p-1.5 pl-4 pr-1.5 flex items-center shadow-md gap-4">
             {/* Points Badge (Right side of capsule) */}
             <div className="bg-[#C07749] text-white px-5 py-1.5 rounded-full font-bold text-sm flex items-center justify-center min-w-[90px]">
                <span>500 نقطة</span>
             </div>

             {/* User Info (Left side of capsule) */}
             <div className="flex items-center gap-3">
                <span className="font-bold text-gray-800 text-sm md:text-base">أحمد محمود</span>
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100">
                   <img src="https://i.pravatar.cc/150?img=12" alt="Avatar" className="w-full h-full object-cover" />
                </div>
             </div>
         </div>

        {/* Left Side: Menu Button */}
         <button className="bg-white w-12 h-12 rounded-full shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
           </svg>
         </button>

      </div>


      {/* Map Container - Aligned to Right side */}
      <div className="absolute inset-0 flex items-center justify-start pointer-events-none pr-4 md:pr-16 lg:pr-24">
         <div className="relative w-full max-w-5xl h-full">
            
            {/* Map Path SVG Layer */}
            <div className="absolute inset-0 z-10">
               <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path 
                    d={pathData} 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="0.8" 
                    strokeDasharray="3 2"
                    className="opacity-90 drop-shadow-md"
                  />
               </svg>
            </div>

            {/* Animal Nodes */}
            {nodes.map((node, index) => (
              <div 
                key={index}
                className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <div className="group relative">
                  <div 
                    className={`
                      w-14 h-14 md:w-20 md:h-20 rounded-full 
                      flex items-center justify-center shadow-lg 
                      hover:scale-110 transition-transform cursor-pointer
                      ${index === 8 ? 'bg-[#8BAA36]/80 border-4 border-[#8BAA36] ring-4 ring-white/50' : 'bg-gray-200/80 backdrop-blur-sm border-4 border-gray-300'}
                    `}
                  >
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden">
                        <img 
                          src={node.img} 
                          alt={`Level ${index + 1}`} 
                          className={`w-full h-full object-contain ${index === 8 ? '' : 'grayscale opacity-70'}`} 
                        />
                    </div>
                  </div>
                </div>
              </div>
            ))}

         </div>
      </div>

    </div>
  );
};

export default MapSection;
