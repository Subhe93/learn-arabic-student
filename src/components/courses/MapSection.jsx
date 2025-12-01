import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavigationSidebar from '../NavigationSidebar';
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

// Also keep gray animals if they are needed, or revert to pngs if user wants to fix the svg issue
// The user said: "Now there is a problem with the file type... I downloaded them from Figma and selected svg"
// And "problem with format".
// If the SVGs are broken, maybe better to use the PNGs for now as placeholders or re-import them correctly?
// But the user's manual edit SHOWS they changed imports to .svg. 
// I will assume the user wants to USE the .svg files they added, but they are not working.
// If they are "Chrome HTML Document", they are just .svg files associated with Chrome.
// React should handle them fine if they are valid SVGs.
// Maybe the issue is the imports were named `animal3` but used as `grayanimal3` in the user's manual edit?
// I will fix the imports to match usage OR usage to match imports.
// The user's manual edit showed:
// + import animal3 from ...grayanimal3.svg
// + { ... img: grayanimal3 }
// This means `grayanimal3` is UNDEFINED because it was imported as `animal3`.
// I will fix this by importing them AS `grayanimalX`.

import grayanimal3 from '../../assets/images/grayanimal3.svg';
import grayanimal4 from '../../assets/images/grayanimal4.svg';
import grayanimal5 from '../../assets/images/grayanimal5.svg';
import grayanimal6 from '../../assets/images/grayanimal6.svg';
import grayanimal7 from '../../assets/images/grayanimal7.svg';
import grayanimal8 from '../../assets/images/grayanimal8.svg';
import grayanimal9 from '../../assets/images/grayanimal9.svg';

const animals = [animal1, animal2, animal3, animal4, animal5, animal6, animal7, animal8, animal9];

const MapSection = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNodeClick = (index) => {
    if (index === 0 || index === 1) {
      navigate('/learn');
    }
  };

  // Coordinates based on the zigzag image provided (Reversed for RTL)
  const nodes = [
    { x: 95, y: 45, img: animal1 }, // Slightly lower than 40
    { x: 81, y: 65, img: animal2 }, // Higher than 65
    { x: 70, y: 40, img: grayanimal3 }, // Slightly lower than 30
    { x: 59, y: 65, img: grayanimal4 }, // Higher than 65
    { x: 48, y: 40, img: grayanimal5 }, // Slightly lower than 30
    { x: 37, y: 65, img: grayanimal8 }, // Higher than 65
    { x: 26, y: 40, img: grayanimal7 }, // Slightly lower than 30
    { x: 15, y: 65, img: grayanimal6 }, // Higher than 65
    { x: 4,  y: 40, img: grayanimal9 }, // Slightly lower than 30
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
         
         {/* Right Side: Single Capsule for User Profile & Points (Swapped to be first for RTL Right) */}
         <Link to="/profile" className="bg-white rounded-full p-1.5 pl-4 pr-1.5 flex items-center shadow-md gap-4 hover:bg-gray-50 transition-colors cursor-pointer decoration-transparent">
             <div className="bg-[#C07749] text-white px-5 py-1.5 rounded-full font-bold text-sm flex items-center justify-center min-w-[90px]">
                <span>500 نقطة</span>
             </div>

             <div className="flex items-center gap-3">
                <span className="font-bold text-gray-800 text-sm md:text-base">أحمد محمود</span>
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100">
                   <img src="https://i.pravatar.cc/150?img=12" alt="Avatar" className="w-full h-full object-cover" />
                </div>
             </div>
         </Link>

        {/* Left Side: Menu Button */}
         <button 
            onClick={() => setIsSidebarOpen(true)}
            className="bg-white w-12 h-12 rounded-full shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
         >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
           </svg>
         </button>

      </div>
      
      <NavigationSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />


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
                    className="" // Removed opacity and shadow to match white dashed line request
                  />
               </svg>
            </div>

            {/* Animal Nodes */}
            {nodes.map((node, index) => {
              let bgClass = 'bg-[#D9D9D9] border-2 border-[#7A7A7A]'; // Default inactive
              let shadowStyle = {};
              let imgClass = 'grayscale opacity-70';

              // Animal 1: Green
              if (index === 0) {
                 bgClass = 'bg-[#5C8740] border-2 border-white ring-4 ring-[#5C8740]/30';
                 shadowStyle = { boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.5)' };
                 imgClass = '';
              } 
              // Animal 2: Orange
              else if (index === 1) {
                 bgClass = 'bg-[#F6A523] border-2 border-white ring-4 ring-[#F6A523]/30';
                 shadowStyle = { boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.5)' };
                 imgClass = '';
              }

              return (
              <div 
                key={index}
                className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onClick={() => handleNodeClick(index)}
              >
                <div className="group relative">
                  <div 
                    className={`
                      w-14 h-14 md:w-20 md:h-20 rounded-full 
                      flex items-center justify-center shadow-lg 
                      hover:scale-110 transition-transform cursor-pointer
                      ${bgClass}
                    `}
                    style={shadowStyle}
                  >
                    <div className="w-10 h-10 p-1 md:w-14 md:h-14 rounded-full overflow-hidden flex items-center justify-center">
                        <img 
                          src={node.img} 
                          alt={`Level ${index + 1}`} 
                          className={`w-full h-full object-contain ${imgClass}`} 
                        />
                    </div>
                  </div>
                </div>
              </div>
            )})}

         </div>
      </div>

    </div>
  );
};

export default MapSection;
