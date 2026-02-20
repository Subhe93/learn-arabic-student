import React, { useState } from 'react';
import { buildFullUrl } from '../../utils/questionAnswerHelpers';

const ReadingQuestion = ({ 
  questionText, 
  content, 
  value, 
  onAnswerChange, 
  isConfirmed = false,
  showFeedback = false,
  isReviewing = false, 
  isCorrect = null 
}) => {
    const [hasRead, setHasRead] = useState(value === 'read' || false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Update local state when value prop changes
    React.useEffect(() => {
        if (value === 'read') {
            setHasRead(true);
        }
    }, [value]);

    const handleMarkAsRead = () => {
        if (hasRead || isReviewing || isConfirmed) return;

        setIsAnimating(true);
        setTimeout(() => {
            setHasRead(true);
            if (onAnswerChange) {
                onAnswerChange('read');
            }
            setIsAnimating(false);
        }, 600);
    };

    const readingText = content?.text || content?.readingText || '';
    const imageUrl = content?.imageUrl || content?.image;

    return (
        <div className="w-full mb-12" dir="rtl">
            {/* Header Row: Question Text & Score */}
            <div className="flex items-center justify-between w-full mb-6">
                <h3 className="text-lg font-bold text-gray-800 text-right flex-1">{questionText}</h3>
                
                <span
                    className="w-[30%] sm:w-auto text-center sm:text-right inline-block"
                    style={{
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#848484',
                        marginLeft: '10px'
                    }}
                >
                    5 درجات
                </span>
            </div>

            {/* Reading Content Container */}
            <div 
                className={`w-full bg-white rounded-[18px] border-2 p-8 transition-all duration-300 ${
                    hasRead 
                        ? 'border-green-400 shadow-lg' 
                        : 'border-[#CECECE] hover:border-[#4F67BD]'
                }`}
                style={{
                    boxShadow: hasRead 
                        ? '0px 4px 20px 0px rgba(34, 197, 94, 0.15)' 
                        : '0px 2px 8px 0px rgba(0, 0, 0, 0.1)',
                }}
            >
                {/* Image Display (if exists) */}
                {imageUrl && (
                    <div className="mb-6 flex justify-center">
                        <div className="relative rounded-xl overflow-hidden shadow-md max-w-md w-full">
                            <img 
                                src={buildFullUrl(imageUrl)} 
                                alt="صورة السؤال" 
                                className="w-full h-auto object-cover"
                                style={{ maxHeight: '400px' }}
                            />
                        </div>
                    </div>
                )}

                {/* Reading Text */}
                <div 
                    className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 transition-all duration-300 ${
                        hasRead ? 'ring-2 ring-green-400' : ''
                    }`}
                    style={{
                        lineHeight: '2',
                        fontSize: '18px',
                    }}
                >
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#4F67BD] flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h4 className="font-bold text-gray-800 text-xl mt-1">النص للقراءة</h4>
                    </div>
                    
                    <p 
                        className="text-gray-800 text-right leading-relaxed whitespace-pre-wrap"
                        style={{
                            fontFamily: 'Cairo, sans-serif',
                            fontSize: '17px',
                            lineHeight: '2.2',
                        }}
                    >
                        {readingText}
                    </p>
                </div>

                {/* Status Display or Action Button */}
                {!isConfirmed && (
                    <div className="flex items-center justify-center mt-6">
                        {!hasRead ? (
                            /* Read Confirmation Button */
                            <button
                                onClick={handleMarkAsRead}
                                disabled={isAnimating}
                                className={`group relative overflow-hidden bg-gradient-to-r from-[#4F67BD] to-[#3e54a3] text-white rounded-[60px] px-12 py-4 font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl ${
                                    isAnimating ? 'scale-95' : ''
                                }`}
                                style={{
                                    boxShadow: '0px 4px 4px 0px #00000040 inset',
                                    minWidth: '250px',
                                }}
                            >
                                {isAnimating ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>جاري التسجيل...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-3">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>أكدت القراءة</span>
                                    </div>
                                )}
                                
                                {/* Ripple Effect */}
                                <span className="absolute inset-0 rounded-[60px] bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
                            </button>
                        ) : null}
                    </div>
                )}
            </div>

            {/* Helper Text */}
            {!hasRead && !isConfirmed && (
                <div className="mt-4 flex items-start gap-2 text-gray-500 text-sm bg-blue-50 p-4 rounded-lg">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#4F67BD]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium text-gray-700 mb-1">تعليمات:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>اقرأ النص بتمعن وتركيز</li>
                            <li>عند الانتهاء من القراءة، اضغط على زر "أكدت القراءة"</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReadingQuestion;

