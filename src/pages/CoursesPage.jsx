import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../services/studentService';
import MapSection from '../components/courses/MapSection';
import LevelCard from '../components/courses/LevelCard';
import SessionCard from '../components/courses/SessionCard';

// Import animal images for the levels (fallback only)
import animal1 from '../assets/images/animal1.svg';

// Helper function to build full URL for images
const buildFullUrl = (imagePath) => {
  if (!imagePath) return animal1; // Fallback
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Add /uploads after domain
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `https://learnarabic.iwings-digital.com/uploads/${cleanPath}`;
};

function CoursesPage() {
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [sessionsData, setSessionsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Load levels and sessions in parallel
      const [levelsResponse, sessionsResponse] = await Promise.all([
        studentService.getLevels(),
        studentService.getUpcomingSessions(),
      ]);

      // Process levels data
      // API returns array directly: [{ id, name, studentLevel: { completePercent, status }, ... }]
      const levelsData = Array.isArray(levelsResponse) 
        ? levelsResponse 
        : Array.isArray(levelsResponse?.data) 
          ? levelsResponse.data 
          : levelsResponse?.data?.levels || [];
      
      // Process levels first with basic info
      const processedLevels = levelsData.map((level) => {
        const studentLevel = level.studentLevel;
        const isEnrolled = studentLevel && (studentLevel.status === 'enrolled' || studentLevel.status === 'in_progress');
        const completePercent = studentLevel?.completePercent || 0;
        
        return {
          id: level.id,
          title: level.name || `المستوى ${level.id}`,
          animal: buildFullUrl(level.image), // Use API image with /uploads
          completed: 0, // Will be updated after fetching lessons
          total: 0, // Will be updated after fetching lessons
          color: isEnrolled ? '#FBBF24' : '#E5E7EB',
          isUnlocked: isEnrolled || level.id === 1, // First level is always unlocked
          image: level.image,
          description: level.description,
          studentLevel: studentLevel,
          completePercent: completePercent,
        };
      });
      
      setLevels(processedLevels);
      
      // Fetch lessons count for each level in background (non-blocking)
      // This will update the levels with accurate lesson counts
      Promise.all(
        processedLevels.map(async (level) => {
          try {
            const lessonsResponse = await studentService.getLessons(level.id);
            const lessons = Array.isArray(lessonsResponse) 
              ? lessonsResponse 
              : Array.isArray(lessonsResponse?.data) 
                ? lessonsResponse.data 
                : lessonsResponse?.data?.lessons || [];
            
            const totalLessons = lessons.length;
            const completedLessons = totalLessons > 0 
              ? Math.round((level.completePercent / 100) * totalLessons) 
              : 0;
            
            // Update the level in state
            setLevels(prevLevels => 
              prevLevels.map(l => 
                l.id === level.id 
                  ? { ...l, total: totalLessons, completed: completedLessons }
                  : l
              )
            );
          } catch (err) {
            console.error(`Error fetching lessons for level ${level.id}:`, err);
          }
        })
      );

      // Process sessions data
      // API returns: { enrolledClasses, totalUpcomingSessions, classes: [], upcomingSessions: [] }
      const sessionsDataResponse = sessionsResponse.data || sessionsResponse;
      setSessionsData(sessionsDataResponse);
      
      if (sessionsDataResponse) {
        const upcomingSessions = sessionsDataResponse.upcomingSessions || [];
        const enrolledClasses = sessionsDataResponse.classes || [];
        
        const allItems = [];
        
        // Process enrolled classes first
        if (enrolledClasses.length > 0) {
          const processedClasses = enrolledClasses.map((classItem) => {
            const enrolledDate = new Date(classItem.enrolledAt);
            const dateLabel = enrolledDate.toLocaleDateString('ar-SA', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
            
            return {
              id: `class-${classItem.classId}`,
              title: classItem.className,
              description: classItem.classDescription || 'صف دراسي',
              time: null,
              dateLabel: `مسجل منذ`,
              isTomorrow: false,
              isClass: true,
              teacher: classItem.teacher?.name || '',
            };
          });
          allItems.push(...processedClasses);
        }
        
        // Process upcoming sessions
        if (upcomingSessions.length > 0) {
          const processedSessions = upcomingSessions.map((session) => {
            // Format time from dateTimeStart
            const sessionDateTime = new Date(session.dateTimeStart);
            const timeStr = sessionDateTime.toLocaleTimeString('ar-SA', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            });
            
            // Format date label
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            let dateLabel = 'غداً';
            let isTomorrow = false;
            
            if (sessionDateTime.toDateString() === tomorrow.toDateString()) {
              dateLabel = 'غداً';
              isTomorrow = true;
            } else if (sessionDateTime.toDateString() === today.toDateString()) {
              dateLabel = 'اليوم';
              isTomorrow = false;
            } else {
              dateLabel = sessionDateTime.toLocaleDateString('ar-SA', {
                month: 'long',
                day: 'numeric'
              });
              isTomorrow = false;
            }
            
            // Remove HTML tags from description
            const cleanDescription = session.description 
              ? session.description.replace(/<[^>]*>/g, '').substring(0, 100) + '...'
              : 'جلسة تعليمية مباشرة';
            
            return {
              id: session.sessionId,
              title: session.sessionName,
              description: cleanDescription,
              time: timeStr,
              dateLabel,
              isTomorrow,
              isClass: false,
              url: session.url,
              className: session.class?.name || '',
              teacher: session.teacher?.name || '',
            };
          });
          allItems.push(...processedSessions);
        }
        
        setSessions(allItems);
      } else {
        setSessions([]);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message || 'فشل تحميل البيانات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLevelClick = (levelId) => {
    // Navigate to learn page with levelId
    navigate(`/learn/${levelId}`);
  };

  const handleSessionClick = (session) => {
    if (session.isClass) {
      // For enrolled classes, navigate to sessions page
      navigate('/sessions');
    } else {
      // For upcoming sessions, open the session URL
      if (session.url) {
        window.open(session.url, '_blank');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Top Map Section */}
      <MapSection levels={levels} />

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F67BD] mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل البيانات...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-red-600 mb-4">{error}</div>
              <button
                onClick={loadData}
                className="bg-[#4F67BD] text-white font-bold py-2 px-6 rounded-full hover:bg-[#3e539a] transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
            
            {/* Right Column: Levels Grid (53%) */}
            <div className="lg:w-[53%]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">المستويات</h2>
              </div>
              
              {levels.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-8 gap-x-4">
                  {levels.map((level) => (
                    <LevelCard
                      key={level.id}
                      levelNumber={level.id}
                      title={level.title}
                      animalImage={level.animal}
                      completedLessons={level.completed}
                      totalLessons={level.total}
                      color={level.color}
                      onClick={() => handleLevelClick(level.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  لا توجد مستويات متاحة حالياً
                </div>
              )}
            </div>

            {/* Left Column: Upcoming Sessions (47%) */}
            <div className="lg:w-[47%]">
              <div className="mb-8">
                 <h2 className="text-xl font-bold text-gray-800 mb-6">
                   الجلسات القادمة والصفوف المسجلة
                 </h2>
                 {sessions.length > 0 ? (
                   <div className="flex flex-col gap-4">
                     {sessions.map((session) => (
                       <SessionCard
                         key={session.id}
                         title={session.title}
                         description={session.description}
                         time={session.time}
                         dateLabel={session.dateLabel}
                         isTomorrow={session.isTomorrow}
                         isClass={session.isClass}
                         onClick={() => handleSessionClick(session)}
                       />
                     ))}
                     {/* View All Sessions Button */}
                     {sessions.length > 0 && (
                       <button
                         onClick={() => navigate('/sessions')}
                         className="mt-4 w-full py-3 bg-white border-2 border-[#4F67BD] text-[#4F67BD] font-bold rounded-full hover:bg-[#4F67BD] hover:text-white transition-all"
                       >
                         عرض جميع الجلسات
                       </button>
                     )}
                   </div>
                 ) : (
                   <div className="text-center py-12 text-gray-500">
                     <p className="mb-4">لا توجد جلسات قادمة أو صفوف مسجل فيها</p>
                     <button
                       onClick={() => navigate('/sessions')}
                       className="px-6 py-2 bg-[#4F67BD] text-white font-bold rounded-full hover:bg-[#3e539a] transition-colors"
                     >
                       عرض جميع الجلسات
                     </button>
                   </div>
                 )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default CoursesPage;
