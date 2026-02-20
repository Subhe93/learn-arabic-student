import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentService } from '../services/studentService';
import TopNavBar from '../components/TopNavBar';
import Sidebar from '../components/Sidebar';
import LessonContent from '../components/LessonContent';
import celebrationBg from '../assets/images/image 13.png';
import bgPattern from '../assets/images/bg.png';

// Mapping between English route names and Arabic display names
const TAB_ROUTE_MAP = {
  'content': null, // Will be mapped to lesson title
  'video': 'فيديو تدريبي',
  'book': 'الكتاب',
  'exercises': 'تدريبات',
  'games': 'العاب',
  'certificate': 'certificate'
};

// Reverse mapping: Arabic to English
const TAB_ARABIC_TO_ENGLISH = {
  'فيديو تدريبي': 'video',
  'الكتاب': 'book',
  'تدريبات': 'exercises',
  'العاب': 'games',
  'certificate': 'certificate'
};

// Helper function to convert English route to Arabic tab name
const getArabicTabName = (englishRoute, lessonTitle) => {
  if (englishRoute === 'content') {
    return lessonTitle;
  }
  return TAB_ROUTE_MAP[englishRoute] || englishRoute;
};

// Helper function to convert Arabic tab name to English route
const getEnglishRoute = (arabicTabName) => {
  // Check if it's already English
  if (TAB_ROUTE_MAP[arabicTabName]) {
    return arabicTabName;
  }
  // Check if it's a lesson title (content)
  if (arabicTabName && !TAB_ARABIC_TO_ENGLISH[arabicTabName]) {
    return 'content';
  }
  return TAB_ARABIC_TO_ENGLISH[arabicTabName] || arabicTabName;
};

function LearningContainerPage() {
  const params = useParams();
  const navigate = useNavigate();
  const levelId = params.levelId;
  const lessonId = params.lessonId ? parseInt(params.lessonId) : null;
  const tabRoute = params.tab; // English route name from URL
  
  // Convert English route to Arabic tab name for display
  const [activeTab, setActiveTab] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [levelInfo, setLevelInfo] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update activeTab when URL tab parameter changes
  useEffect(() => {
    if (tabRoute && currentLesson) {
      const arabicTab = getArabicTabName(tabRoute, currentLesson.lessonData?.name || currentLesson.title);
      setActiveTab(arabicTab);
    }
  }, [tabRoute, currentLesson]);

  const isCertificate = activeTab === 'certificate' || tabRoute === 'certificate';
  const isBookTab = activeTab === 'الكتاب' || tabRoute === 'book';

  // Update current lesson when lessonId changes in URL
  useEffect(() => {
    if (lessonId && lessons.length > 0) {
      const foundLesson = lessons.find(l => l.id === lessonId);
      if (foundLesson) {
        setCurrentLesson(foundLesson);
        // If tab is not set, navigate to first tab (content)
        if (!tabRoute && foundLesson.subItems.length > 0) {
          navigate(`/learn/${levelId}/${lessonId}/content`, { replace: true });
        }
      }
    }
  }, [lessonId, lessons, tabRoute, levelId, navigate]);

  // Function to handle tab change and update URL
  const handleTabChange = (newTab, lesson) => {
    setActiveTab(newTab);
    const targetLessonId = lesson ? lesson.id : (lessonId || currentLesson?.id);
    const targetLevelId = levelId;
    
    // Convert Arabic tab name to English route
    const englishRoute = getEnglishRoute(newTab);
    
    if (targetLevelId && targetLessonId) {
      navigate(`/learn/${targetLevelId}/${targetLessonId}/${englishRoute}`);
    } else if (targetLevelId) {
      // If no lesson selected, navigate to level only
      navigate(`/learn/${targetLevelId}`);
    }
    
    if (lesson) {
      setCurrentLesson(lesson);
    }
  };

  useEffect(() => {
    if (!levelId) {
      // Redirect to courses if no levelId
      navigate('/courses');
      return;
    }
    loadLevelData();
  }, [levelId]);

  const loadLevelData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load lessons for the level
      const lessonsResponse = await studentService.getLessons(levelId);
      
      // Process lessons data
      // API returns array directly: [{ id, name, description, videoUrl, imageUrl, pdfUrl, studentLesson, ... }]
      const lessonsData = Array.isArray(lessonsResponse) 
        ? lessonsResponse 
        : Array.isArray(lessonsResponse?.data) 
          ? lessonsResponse.data 
          : lessonsResponse?.data?.lessons || [];
      
      // Transform lessons to match Sidebar format
      const processedLessons = lessonsData.map((lesson, index) => {
        // Calculate completed tabs based on lesson status
        const studentLesson = lesson.studentLesson || {};
        const isCompleted = studentLesson.status === 'completed';
        const isEnrolled = studentLesson.status === 'enrolled';
        
        // Build tabs based on available content
        const tabs = [];
        
        // Tab 1: Lesson content (always present)
        tabs.push({
          id: 1,
          title: lesson.name || `الدرس ${index + 1}`,
          type: "check",
          isCompleted: isCompleted,
          isCurrent: index === 0
        });
        
        // Tab 2: Video (if available)
        if (lesson.videoUrl) {
          tabs.push({
            id: 2,
            title: "فيديو تدريبي",
            type: "video",
            icon: null,
            duration: "12:20:00"
          });
        }
        
        // Tab 3: Book/PDF (if available)
        if (lesson.pdfUrl) {
          tabs.push({
            id: 3,
            title: "الكتاب",
            type: "book",
            icon: null,
            count: 1
          });
        }
        
        // Tab 4: Exercises/Assignments (always show, even if empty)
        tabs.push({
          id: 4,
          title: "تدريبات",
          type: "quiz",
          icon: null,
          count: 3
        });
        
        // Tab 5: Games (if available)
        if (lesson.game) {
          tabs.push({
            id: 5,
            title: "العاب",
            type: "game",
            icon: null,
            count: 1
          });
        }
        
        // Calculate completed tabs (simplified - you can enhance this based on actual progress tracking)
        const completedTabs = isCompleted ? tabs.length : (isEnrolled ? 1 : 0);
        
        return {
          id: lesson.id,
          title: lesson.name || `الدرس ${index + 1}`,
          isOpen: index === 0, // Open first lesson by default
          isCompleted: isCompleted,
          totalTabs: tabs.length,
          completedTabs: completedTabs,
          subItems: tabs,
          lessonData: lesson,
        };
      });
      
      setLessons(processedLessons);
      
      // Set current lesson based on URL or default to first
      let targetLesson = processedLessons[0];
      if (lessonId) {
        const foundLesson = processedLessons.find(l => l.id === lessonId);
        if (foundLesson) {
          targetLesson = foundLesson;
        }
      }
      
      setCurrentLesson(targetLesson);
      
      // Set active tab based on URL or default to first tab (content)
      if (targetLesson.subItems.length > 0) {
        let targetTab;
        if (tabRoute) {
          // Convert English route to Arabic tab name
          targetTab = getArabicTabName(tabRoute, targetLesson.lessonData?.name || targetLesson.title);
        } else {
          // Default to first tab (lesson content)
          targetTab = targetLesson.subItems[0].title;
        }
        setActiveTab(targetTab);
        
        // Update URL if parameters are not set
        if (levelId && (!lessonId || !tabRoute)) {
          navigate(`/learn/${levelId}/${targetLesson.id}/content`, { replace: true });
        }
      }
      
      // Load level info for TopNavBar
      const levelsResponse = await studentService.getLevels();
      const levelsData = Array.isArray(levelsResponse) 
        ? levelsResponse 
        : Array.isArray(levelsResponse?.data) 
          ? levelsResponse.data 
          : levelsResponse?.data?.levels || [];
      
      const currentLevel = levelsData.find(l => l.id === parseInt(levelId));
      if (currentLevel) {
        setLevelInfo(currentLevel);
      }
      
    } catch (err) {
      console.error('Error loading level data:', err);
      setError(err.message || 'فشل تحميل بيانات المستوى');
    } finally {
      setIsLoading(false);
    }
  };

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
          levelName={levelInfo?.name || `المستوى ${levelId}`} 
          completedLessons={lessons.filter(l => l.isCompleted).length} 
          totalLessons={lessons.length} 
        />
      </div>

      {/* Mobile Menu Button - Moved to Top Right */}
      <button 
        className="lg:hidden fixed top-48 right-4 z-[60] bg-[#4F67BD] text-white p-3 rounded-full shadow-xl hover:bg-[#3e539a] transition-colors"
        onClick={() => setIsSidebarOpen(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 z-[60] lg:hidden flex justify-start transition-visibility duration-300 ${isSidebarOpen ? 'visible' : 'invisible delay-300'}`}>
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`} 
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          
          {/* Sidebar Content - Appears from Right (justify-start in RTL) */}
          <div className={`relative w-[85%] max-w-[360px] h-full bg-[#DDF0EB] shadow-2xl overflow-y-auto p-4 transition-transform duration-300 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F67BD] mx-auto mb-4"></div>
                      <p className="text-gray-600">جاري التحميل...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center text-red-600">
                    <p>{error}</p>
                  </div>
                ) : (
                  <Sidebar 
                    activeTab={activeTab} 
                    onTabSelect={(tab, lesson) => { 
                      handleTabChange(tab, lesson); 
                      setIsSidebarOpen(false); 
                    }}
                    lessons={lessons}
                    onLessonChange={(lesson) => { 
                      setCurrentLesson(lesson);
                      if (lesson.subItems.length > 0) {
                        navigate(`/learn/${levelId}/${lesson.id}/content`, { replace: true });
                      } else {
                        navigate(`/learn/${levelId}/${lesson.id}`, { replace: true });
                      }
                    }}
                  />
                )}
              </div>
          </div>
      </div>

      {/* Main Layout Container */}
      <div className="flex flex-1 relative z-20 h-[calc(100vh-140px)] overflow-hidden w-full max-w-[1440px] mx-auto pt-[20px] lg:pt-[50px]">
        
        {/* Sidebar (Right Side in RTL - Desktop) */}
        <div className="w-[30%] min-w-[320px] max-w-[380px] flex-shrink-0 hidden lg:block h-full overflow-y-auto custom-scrollbar pl-4">
           {isLoading ? (
             <div className="flex items-center justify-center h-full">
               <div className="text-center">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F67BD] mx-auto mb-4"></div>
                 <p className="text-gray-600">جاري التحميل...</p>
               </div>
             </div>
           ) : error ? (
             <div className="flex items-center justify-center h-full">
               <div className="text-center text-red-600">
                 <p>{error}</p>
                 <button
                   onClick={loadLevelData}
                   className="mt-4 bg-[#4F67BD] text-white font-bold py-2 px-6 rounded-full hover:bg-[#3e539a] transition-colors"
                 >
                   إعادة المحاولة
                 </button>
               </div>
             </div>
           ) : (
             <Sidebar 
               activeTab={activeTab} 
               onTabSelect={handleTabChange}
               lessons={lessons}
               onLessonChange={(lesson) => {
                 setCurrentLesson(lesson);
                 if (lesson.subItems.length > 0) {
                   navigate(`/learn/${levelId}/${lesson.id}/content`, { replace: true });
                 } else {
                   navigate(`/learn/${levelId}/${lesson.id}`, { replace: true });
                 }
               }}
             />
           )}
        </div>

        {/* Main Content Area (Left Side in RTL) */}
        <div className="flex-1 h-full overflow-y-auto p-4 pt-12 lg:p-6 lg:pl-[44px]">
           
           {/* Outer Container */}
           <div className={`bg-white rounded-[8px] shadow-sm border-2 border-[#dc3d3c] p-2 min-h-[600px] relative h-full ${isBookTab ? 'overflow-x-auto' : ''}`}>
              
              {/* Inner Border Container */}
              <div className={`border-2 border-[#555555] rounded-[8px] h-full w-full flex flex-col items-center justify-center relative ${isBookTab ? 'p-0 overflow-x-auto' : 'lg:p-4 md:p-12 py-4 px-0'}`}>
                 
                <LessonContent 
                  activeTab={tabRoute || activeTab} 
                  currentLesson={currentLesson}
                  levelInfo={levelInfo}
                />
                 
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

export default LearningContainerPage;
