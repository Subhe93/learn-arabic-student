import React, { useState, useEffect } from 'react';
import { studentService } from '../services/studentService';
import { useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';

const UpcomingSessionsPage = () => {
  const [sessionsData, setSessionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await studentService.getUpcomingSessions();
      setSessionsData(data);
      setError(null);
    } catch (err) {
      console.error('Error loading sessions:', err);
      setError('فشل تحميل الجلسات القادمة');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const getTimeUntilSession = (dateString) => {
    const now = new Date();
    const sessionDate = new Date(dateString);
    const diff = sessionDate - now;

    if (diff < 0) return 'بدأت الجلسة';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `بعد ${days} يوم`;
    if (hours > 0) return `بعد ${hours} ساعة`;
    return `بعد ${minutes} دقيقة`;
  };

  const handleJoinSession = (url) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#4F67BD] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-bold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{error}</h3>
          <button
            onClick={loadSessions}
            className="mt-4 px-6 py-2 bg-[#4F67BD] text-white rounded-full hover:bg-[#3e54a3] transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const { classes = [], upcomingSessions = [], enrolledClasses = 0, totalUpcomingSessions = 0 } = sessionsData || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir="rtl">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50">
        <TopNavBar 
          levelName="الجلسات القادمة" 
          completedLessons={0} 
          totalLessons={totalUpcomingSessions} 
        />
      </div>

      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#4F67BD] transition-colors mb-4"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>العودة إلى الدورات</span>
          </button>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">الجلسات المباشرة</h1>
          <p className="text-gray-600">شاهد جميع جلساتك المجدولة وانضم إليها مباشرة</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-r-4 border-[#4F67BD]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">الصفوف المسجلة</p>
                <p className="text-4xl font-bold text-[#4F67BD]">{enrolledClasses}</p>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#4F67BD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-r-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">الجلسات القادمة</p>
                <p className="text-4xl font-bold text-green-600">{totalUpcomingSessions}</p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled Classes */}
        {classes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">صفوفك المسجلة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classes.map((classItem) => (
                <div
                  key={classItem.classId}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{classItem.className}</h3>
                  <p className="text-gray-600 text-sm mb-3">{classItem.classDescription}</p>
                  <div className="flex items-center gap-2 text-[#4F67BD]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-semibold">{classItem.teacher.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Sessions */}
        {upcomingSessions.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">الجلسات المجدولة</h2>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session.sessionId}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#4F67BD] to-[#3e54a3] rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-1">{session.sessionName}</h3>
                          <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                            <span className="px-3 py-1 bg-blue-100 text-[#4F67BD] rounded-full font-semibold">
                              {session.class.name}
                            </span>
                          </div>
                          {session.description && (
                            <div
                              className="text-gray-600 text-sm"
                              dangerouslySetInnerHTML={{ __html: session.description }}
                            />
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-[#4F67BD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDate(session.dateTimeStart)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-[#4F67BD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{formatTime(session.dateTimeStart)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-[#4F67BD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span>{session.duration} دقيقة</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-[#4F67BD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{session.teacher.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <div className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full font-bold text-sm whitespace-nowrap">
                        {getTimeUntilSession(session.dateTimeStart)}
                      </div>
                      <button
                        onClick={() => handleJoinSession(session.url)}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-bold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 whitespace-nowrap"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        <span>انضم الآن</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">لا توجد جلسات قادمة</h3>
            <p className="text-gray-600">لم يتم جدولة أي جلسات حالياً. تحقق مرة أخرى لاحقاً!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingSessionsPage;

