import React from 'react';
import MapSection from '../components/courses/MapSection';
import LevelCard from '../components/courses/LevelCard';
import SessionCard from '../components/courses/SessionCard';

// Import animal images for the levels
import animal1 from '../assets/images/animal1.png';
import animal2 from '../assets/images/animal2.png';
import animal3 from '../assets/images/animal3.png';
import animal4 from '../assets/images/animal4.png';
import animal5 from '../assets/images/animal5.png';
import animal6 from '../assets/images/animal6.png';

function CoursesPage() {
  const levels = [
    { id: 1, title: 'المستوى الأول', animal: animal1, completed: 2, total: 5, color: '#FBBF24' },
    { id: 2, title: 'المستوى الثاني', animal: animal2, completed: 1, total: 6, color: '#F59E0B' },
    { id: 3, title: 'المستوى الثالث', animal: animal3, completed: 0, total: 6, color: '#E5E7EB' },
    { id: 4, title: 'المستوى الرابع', animal: animal4, completed: 0, total: 4, color: '#E5E7EB' },
    { id: 5, title: 'المستوى الخامس', animal: animal5, completed: 0, total: 6, color: '#E5E7EB' },
    { id: 6, title: 'المستوى السادس', animal: animal6, completed: 0, total: 6, color: '#E5E7EB' },
  ];

  const sessions = [
    { 
      id: 1, 
      title: 'جلسة شرح الاعراب', 
      description: 'هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد...', 
      time: '6:00م إلى 7:00م',
      dateLabel: 'غداً',
      isTomorrow: true
    },
    { 
      id: 2, 
      title: 'جلسة شرح الاعراب', 
      description: 'هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد...', 
      time: '6:00م إلى 7:00م',
      dateLabel: 'غداً',
      isTomorrow: true
    },
    { 
      id: 3, 
      title: 'جلسة شرح الاعراب', 
      description: 'هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد...', 
      time: '6:00م إلى 7:00م',
      dateLabel: 'غداً',
      isTomorrow: true
    },
  ];

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Top Map Section */}
      <MapSection />

      <div className="container mx-auto px-4 py-12">
        {/* Layout: Equal split (1/2 each) on large screens */}
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
          
          {/* Right Column: Levels Grid (50%) */}
          <div className="lg:w-1/2">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">المستويات</h2>
            </div>
            
            {/* 3 Levels per row as requested (using xl:grid-cols-3) */}
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
                />
              ))}
            </div>
          </div>

          {/* Left Column: Upcoming Sessions (50%) */}
          <div className="lg:w-1/2">
            <div className="mb-8">
               <h2 className="text-xl font-bold text-gray-800 mb-6">الجلسات القادمة</h2>
               <div className="flex flex-col gap-4">
                 {sessions.map((session) => (
                   <SessionCard
                     key={session.id}
                     title={session.title}
                     description={session.description}
                     time={session.time}
                     dateLabel={session.dateLabel}
                     isTomorrow={session.isTomorrow}
                   />
                 ))}
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CoursesPage;
