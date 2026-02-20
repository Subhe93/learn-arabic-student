import React, { useState } from 'react';
import AnswerReview from './questions/AnswerReview';

/**
 * مكون لعرض نتائج الاختبار الكاملة
 * يعرض النتيجة الإجمالية وجميع الأسئلة مع الإجابات
 */
function QuizResult({ assignment, submissionResult, onClose, onRetry, isPending = false }) {

  if (!assignment || !submissionResult) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">لا توجد نتائج متاحة</p>
      </div>
    );
  }

  const { status, totalPoints, successPoints, answers } = submissionResult;
  
  // Calculate total points from questions if totalPoints is null
  const calculatedTotalPoints = totalPoints || answers?.reduce((sum, ans) => {
    return sum + (ans.question?.points || 0);
  }, 0) || 0;
  
  // Calculate percentage
  const percentage = calculatedTotalPoints > 0 ? Math.round((successPoints / calculatedTotalPoints) * 100) : 0;
  
  // Get performance level
  const getPerformanceLevel = (percent) => {
    if (percent >= 90) return { text: 'ممتاز', color: 'green', emoji: '🎉' };
    if (percent >= 75) return { text: 'جيد جداً', color: 'blue', emoji: '👍' };
    if (percent >= 60) return { text: 'جيد', color: 'yellow', emoji: '😊' };
    if (percent >= 50) return { text: 'مقبول', color: 'orange', emoji: '😐' };
    return { text: 'يحتاج تحسين', color: 'red', emoji: '📚' };
  };

  const performance = getPerformanceLevel(percentage);

  // Map answers to questions
  const getAnswerForQuestion = (questionId) => {
    return answers?.find(a => a.questionId === questionId || a.question?.id === questionId);
  };

  // Count correct/wrong answers
  const correctCount = answers?.filter(a => a.isCorrect === true).length || 0;
  const wrongCount = answers?.filter(a => a.isCorrect === false).length || 0;
  const totalQuestions = answers?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        {/* Header with Score */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center">
            {/* Title */}
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
              {isPending ? 'مراجعة الإجابات' : 'نتيجة الاختبار'}
            </h1>
            <p className="text-gray-600 mb-6">{assignment.title}</p>

            {!isPending ? (
              <>
                {/* Performance Icon */}
                <div className="text-6xl mb-4">{performance.emoji}</div>

                {/* Score Circle */}
                <div className="flex justify-center mb-6">
                  <div className={`relative w-40 h-40 rounded-full border-8 border-${performance.color}-200 bg-${performance.color}-50 flex items-center justify-center`}>
                    <div className="text-center">
                      <div className={`text-4xl font-extrabold text-${performance.color}-600`}>
                        {percentage}%
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {successPoints} / {calculatedTotalPoints}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Label */}
                <div className={`inline-block px-6 py-3 rounded-full bg-${performance.color}-100 text-${performance.color}-800 font-bold text-lg`}>
                  {performance.text}
                </div>

                {/* Status Badge */}
                {status === 'pending_review' && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-yellow-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">بعض الأسئلة في انتظار مراجعة المعلم</span>
                  </div>
                )}
              </>
            ) : (
              <div className="py-6">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-yellow-100 text-yellow-800">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-bold">قيد المراجعة من قبل المعلم</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        {!isPending && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 text-center shadow">
              <div className="text-gray-500 text-sm mb-2">إجمالي الأسئلة</div>
              <div className="text-3xl font-bold text-gray-800">
                {totalQuestions}
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow">
              <div className="text-gray-500 text-sm mb-2">الإجابات الصحيحة</div>
              <div className="text-3xl font-bold text-green-600">
                {correctCount}
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center shadow">
              <div className="text-gray-500 text-sm mb-2">الإجابات الخاطئة</div>
              <div className="text-3xl font-bold text-red-600">
                {wrongCount}
              </div>
            </div>
          </div>
        )}

        {/* Questions Review */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            مراجعة الأسئلة
          </h2>

          {answers && answers.length > 0 ? (
            <div className="space-y-6">
              {answers.map((answerData, index) => {
                const question = answerData.question;
                if (!question) return null;

                return (
                  <div key={answerData.id || index} className="bg-white rounded-xl shadow-lg p-6">
                    <AnswerReview
                      question={question}
                      studentAnswer={answerData.answer}
                      isCorrect={answerData.isCorrect}
                      points={answerData.points}
                      teacherNotes={answerData.teacherNotes}
                      reviewedById={answerData.reviewedById}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-600">لا توجد إجابات متاحة</p>
            </div>
          )}
        </div>

        {/* Pending Review Message */}
        {isPending && (
          <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-bold text-yellow-800">الاختبار قيد المراجعة</p>
                <p className="text-sm text-yellow-700">سيتم تحديث النتيجة النهائية بعد مراجعة المعلم</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          {onRetry && !isPending && (
            <button
              onClick={onRetry}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>إعادة المحاولة</span>
            </button>
          )}
          
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-600 text-white font-bold rounded-full hover:bg-gray-700 transition-colors"
          >
            {isPending ? 'العودة' : 'إغلاق'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizResult;

