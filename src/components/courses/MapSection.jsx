import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Helper function to get user display name
const getUserDisplayName = (user) => {
  if (!user) return 'أحمد محمود'; // Fallback
  if (user.firstName || user.lastName) {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  }
  return user.name || 'أحمد محمود';
};
import NavigationSidebar from '../NavigationSidebar';
// Import fallback animal image
import animal1 from '../../assets/images/animal1.png';

const MapSection = ({ levels = [] }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const displayName = getUserDisplayName(user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNodeClick = (levelId) => {
    navigate(`/learn/${levelId}`);
  };

  // Generate nodes dynamically based on levels
  const nodes = React.useMemo(() => {
    if (!levels || levels.length === 0) {
      return [];
    }

    // Define positions for up to 9 levels (zigzag pattern)
    const positions = [
      { x: 95, y: isMobile ? 45 : 45 },
      { x: 81, y: isMobile ? 58 : 65 },
      { x: 70, y: isMobile ? 40 : 40 },
      { x: 59, y: isMobile ? 58 : 65 },
      { x: 48, y: isMobile ? 40 : 40 },
      { x: 37, y: isMobile ? 58 : 65 },
      { x: 26, y: isMobile ? 40 : 40 },
      { x: 15, y: isMobile ? 58 : 65 },
      { x: 4,  y: isMobile ? 40 : 40 },
    ];

    return levels.slice(0, positions.length).map((level, index) => ({
      x: positions[index].x,
      y: positions[index].y,
      img: level.animal || animal1, // Use API image
      levelId: level.id,
      isUnlocked: level.isUnlocked,
      completePercent: level.completePercent,
    }));
  }, [levels, isMobile]);

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
                <span className="font-bold text-gray-800 text-sm md:text-base">{displayName}</span>
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
      <div className="absolute inset-0 flex items-center justify-start pointer-events-none px-5 md:pr-16 lg:pr-24">
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

              // Style based on level status
              if (node.isUnlocked) {
                 if (node.completePercent === 100) {
                    // Completed level: Green
                    bgClass = 'bg-[#5C8740] border-2 border-white ring-4 ring-[#5C8740]/30';
                    shadowStyle = { boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.5)' };
                    imgClass = '';
                 } else {
                    // In progress level: Orange
                    bgClass = 'bg-[#F6A523] border-2 border-white ring-4 ring-[#F6A523]/30';
                    shadowStyle = { boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.5)' };
                    imgClass = '';
                 }
              } else {
                 // Locked level: Gray
                 bgClass = 'bg-[#D9D9D9] border-2 border-[#7A7A7A]';
                 imgClass = 'grayscale opacity-70';
              }

              return (
              <div 
                key={node.levelId || index}
                className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onClick={() => handleNodeClick(node.levelId || index)}
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
                          alt={`المستوى ${index + 1}`} 
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
