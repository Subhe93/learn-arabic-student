import React, { useState, useRef, useEffect } from 'react';
import { checkAnswerCorrectness, getCorrectAnswer } from '../../utils/questionAnswerHelpers';
import successSound from '../../assets/sounds/true.mp3';

/**
 * Wrapper component for questions that handles:
 * - Confirmation button
 * - Showing correct answers
 * - Locking answers after confirmation
 */
const QuestionWrapper = ({ 
    children, 
    questionId, 
    questionType,
    questionContent,
    answer,
    isConfirmed,
    showCorrectAnswer,
    onConfirm,
    requiresTeacherReview = false
}) => {
    const hasAnswer = answer !== null && answer !== undefined && 
        (Array.isArray(answer) ? answer.length > 0 : answer !== '');
    
    const handleConfirm = () => {
        if (!hasAnswer) {
            alert('يرجى الإجابة على السؤال أولاً');
            return;
        }
        if (onConfirm) {
            onConfirm(questionId);
        }
    };

    // Get correct answer if available (for display only)
    const correctAnswer = !requiresTeacherReview && showCorrectAnswer 
        ? getCorrectAnswer(questionType, questionContent) 
        : null;

    // Check if student's answer is correct
    const isCorrect = !requiresTeacherReview && showCorrectAnswer && hasAnswer
        ? checkAnswerCorrectness(questionType, answer, questionContent)
        : null;

    // Success animation and sound state
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
    const audioRef = useRef(null);
    const hasPlayedSuccessRef = useRef(false);

    // Play success animation and sound when answer is correct
    useEffect(() => {
        if (isConfirmed && showCorrectAnswer && isCorrect === true && !hasPlayedSuccessRef.current) {
            hasPlayedSuccessRef.current = true;
            setShowSuccessAnimation(true);

            // Play sound
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch((error) => {
                    console.log("Audio play failed:", error);
                });
            }

            // Hide animation after 3 seconds
            setTimeout(() => {
                setShowSuccessAnimation(false);
            }, 3000);
        }

        // Reset when question changes or is not confirmed
        if (!isConfirmed) {
            hasPlayedSuccessRef.current = false;
            setShowSuccessAnimation(false);
        }
    }, [isConfirmed, showCorrectAnswer, isCorrect]);

    return (
        <div className="relative">
            {/* Audio element for success sound */}
            <audio ref={audioRef} src={successSound} preload="auto" />

            {/* Success Animation */}
            {showSuccessAnimation && (
                <div className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none">
                    {/* Fireworks in corners */}
                    <div className="fireworks-corner fireworks-top-left">
                        <div className="firework firework-1"></div>
                        <div className="firework firework-2"></div>
                        <div className="firework firework-3"></div>
                    </div>
                    <div className="fireworks-corner fireworks-top-right">
                        <div className="firework firework-1"></div>
                        <div className="firework firework-2"></div>
                        <div className="firework firework-3"></div>
                    </div>
                    <div className="fireworks-corner fireworks-bottom-left">
                        <div className="firework firework-1"></div>
                        <div className="firework firework-2"></div>
                        <div className="firework firework-3"></div>
                    </div>
                    <div className="fireworks-corner fireworks-bottom-right">
                        <div className="firework firework-1"></div>
                        <div className="firework firework-2"></div>
                        <div className="firework firework-3"></div>
                    </div>

                    {/* Success Message */}
                    <div className="success-animation-container">
                        <div className="success-stars">
                            <div className="star star-1">⭐</div>
                            <div className="star star-2">⭐</div>
                            <div className="star star-3">⭐</div>
                            <div className="star star-4">⭐</div>
                            <div className="star star-5">⭐</div>
                        </div>
                        <div className="success-message">
                            <div className="success-text">أحسنت!</div>
                            <div className="success-icon">🎉</div>
                        </div>
                    </div>
                </div>
            )}
            {/* Question Content (disabled if confirmed) */}
            <div className={isConfirmed ? 'pointer-events-none opacity-75' : ''}>
                {React.cloneElement(children, {
                    isConfirmed,
                    showFeedback: showCorrectAnswer,
                    isAnswerCorrect: isCorrect
                })}
            </div>

            {/* Confirmation and Feedback Section */}
            {!isConfirmed && (
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleConfirm}
                        disabled={!hasAnswer}
                        className={`flex items-center gap-3 rounded-[60px] px-10 py-3 font-bold text-lg transition-all transform shadow-lg ${
                            hasAnswer
                                ? 'bg-gradient-to-r from-[#4F67BD] to-[#3e54a3] text-white hover:scale-105 hover:shadow-xl cursor-pointer'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        style={{
                            boxShadow: hasAnswer ? '0px 4px 4px 0px #00000040 inset' : 'none',
                            minWidth: '220px',
                        }}
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>تأكيد الإجابة</span>
                    </button>
                </div>
            )}

            {/* Confirmed State with Feedback */}
            {isConfirmed && (
                <div className="mt-6 space-y-4">
                    {/* Confirmation Badge */}
                    <div className="flex flex-col items-center gap-3">
                        <div className={`flex items-center gap-3 px-8 py-4 rounded-full border-2 shadow-md ${
                            requiresTeacherReview
                                ? 'bg-blue-50 border-blue-400'
                                : isCorrect
                                    ? 'bg-green-50 border-green-400'
                                    : 'bg-red-50 border-red-400'
                        }`}>
                            {requiresTeacherReview ? (
                                <>
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="font-bold text-blue-700 text-lg">
                                        تم تسجيل إجابتك - بانتظار مراجعة المعلم
                                    </span>
                                </>
                            ) : isCorrect ? (
                                <>
                                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center animate-pulse">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="font-bold text-green-700 text-lg">
                                        إجابة صحيحة! أحسنت 🎉
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="font-bold text-red-700 text-lg">
                                        إجابة خاطئة - راجع الإجابة الصحيحة
                                    </span>
                                </>
                            )}
                        </div>
                        
                        {/* Lock Icon */}
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            <span>لا يمكن تغيير الإجابة بعد التأكيد</span>
                        </div>
                    </div>

                    {/* Show Correct Answer (if not requiring teacher review and answer is wrong) */}
                    {!requiresTeacherReview && showCorrectAnswer && correctAnswer && !isCorrect && (
                        <div className="mt-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-300">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-green-800 text-lg mb-2">
                                        {questionType === 'mcq_multiple' || questionType === 'draw_circle_multiple' 
                                            ? 'الإجابات الصحيحة:' 
                                            : 'الإجابة الصحيحة:'}
                                    </h4>
                                    <div className="text-green-900 bg-white p-4 rounded-lg shadow-sm">
                                        {renderCorrectAnswer(questionType, correctAnswer)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Helper function to render correct answer based on question type
const renderCorrectAnswer = (questionType, correctAnswer) => {
    if (!correctAnswer) return null;

    switch (questionType) {
        case 'mcq_single':
        case 'fill_sentence':
        case 'select_image_text':
            return <p className="font-bold text-lg">{correctAnswer}</p>;

        case 'mcq_multiple':
        case 'draw_circle_multiple':
            return (
                <ul className="space-y-2">
                    {Array.isArray(correctAnswer) && correctAnswer.map((ans, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </span>
                            <span className="font-bold text-lg">{ans}</span>
                        </li>
                    ))}
                </ul>
            );

        case 'order_words':
            return <p className="font-bold text-lg">{correctAnswer.join(' ')}</p>;

        case 'compose_word':
        case 'break_word':
            return <p className="font-bold text-lg">{Array.isArray(correctAnswer) ? correctAnswer.join('') : correctAnswer}</p>;

        case 'match_image_text':
            return (
                <div className="space-y-3">
                    {Array.isArray(correctAnswer) && correctAnswer.map((pair, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 shadow-sm">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                                {idx + 1}
                            </span>
                            <div className="flex items-center gap-2 flex-1">
                                <span className="font-medium text-gray-700">الصورة</span>
                                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                                <span className="font-bold text-gray-900 text-lg">{pair.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
            );

        default:
            return <p className="font-medium">{JSON.stringify(correctAnswer)}</p>;
    }
};

export default QuestionWrapper;

// Success Animation Styles - Inject into document head
if (typeof document !== 'undefined') {
    const styleId = 'success-animation-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .success-animation-container {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            .success-message {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                animation: successPopIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
            }

            .success-text {
                font-size: 4rem;
                font-weight: bold;
                color: #10b981;
                text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                font-family: "IBM Plex Sans Arabic", sans-serif;
                animation: successBounce 0.8s ease-in-out 0.3s infinite;
            }

            .success-icon {
                font-size: 3rem;
                margin-top: 1rem;
                animation: successRotate 1s ease-in-out infinite;
            }

            .success-stars {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
            }

            .star {
                position: absolute;
                font-size: 2rem;
                animation: starFloat 2s ease-in-out infinite;
            }

            .star-1 {
                top: 10%;
                left: 20%;
                animation-delay: 0s;
            }

            .star-2 {
                top: 20%;
                right: 15%;
                animation-delay: 0.2s;
            }

            .star-3 {
                bottom: 20%;
                left: 15%;
                animation-delay: 0.4s;
            }

            .star-4 {
                bottom: 10%;
                right: 20%;
                animation-delay: 0.6s;
            }

            .star-5 {
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                animation-delay: 0.3s;
            }

            @keyframes successPopIn {
                0% {
                    opacity: 0;
                    transform: scale(0) rotate(-180deg);
                }
                60% {
                    transform: scale(1.1) rotate(10deg);
                }
                100% {
                    opacity: 1;
                    transform: scale(1) rotate(0deg);
                }
            }

            @keyframes successBounce {
                0%, 100% {
                    transform: translateY(0) scale(1);
                }
                50% {
                    transform: translateY(-10px) scale(1.05);
                }
            }

            @keyframes successRotate {
                0%, 100% {
                    transform: rotate(0deg) scale(1);
                }
                25% {
                    transform: rotate(-10deg) scale(1.1);
                }
                75% {
                    transform: rotate(10deg) scale(1.1);
                }
            }

            @keyframes starFloat {
                0%, 100% {
                    opacity: 0;
                    transform: translateY(0) scale(0) rotate(0deg);
                }
                50% {
                    opacity: 1;
                    transform: translateY(-30px) scale(1.2) rotate(180deg);
                }
            }

            /* Fireworks Styles */
            .fireworks-corner {
                position: absolute;
                width: 200px;
                height: 200px;
            }

            .fireworks-top-left {
                top: 0;
                left: 0;
            }

            .fireworks-top-right {
                top: 0;
                right: 0;
            }

            .fireworks-bottom-left {
                bottom: 0;
                left: 0;
            }

            .fireworks-bottom-right {
                bottom: 0;
                right: 0;
            }

            .firework {
                position: absolute;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                box-shadow: 0 0 10px currentColor;
            }

            .fireworks-top-left .firework-1 {
                background: #ff6b6b;
                top: 50%;
                left: 50%;
                animation: fireworkTopLeft1 1s ease-out forwards;
            }

            .fireworks-top-left .firework-2 {
                background: #4ecdc4;
                top: 50%;
                left: 50%;
                animation: fireworkTopLeft2 1s ease-out 0.1s forwards;
            }

            .fireworks-top-left .firework-3 {
                background: #ffe66d;
                top: 50%;
                left: 50%;
                animation: fireworkTopLeft3 1s ease-out 0.2s forwards;
            }

            .fireworks-top-right .firework-1 {
                background: #ff6b6b;
                top: 50%;
                left: 50%;
                animation: fireworkTopRight1 1s ease-out forwards;
            }

            .fireworks-top-right .firework-2 {
                background: #4ecdc4;
                top: 50%;
                left: 50%;
                animation: fireworkTopRight2 1s ease-out 0.1s forwards;
            }

            .fireworks-top-right .firework-3 {
                background: #ffe66d;
                top: 50%;
                left: 50%;
                animation: fireworkTopRight3 1s ease-out 0.2s forwards;
            }

            .fireworks-bottom-left .firework-1 {
                background: #ff6b6b;
                top: 50%;
                left: 50%;
                animation: fireworkBottomLeft1 1s ease-out forwards;
            }

            .fireworks-bottom-left .firework-2 {
                background: #4ecdc4;
                top: 50%;
                left: 50%;
                animation: fireworkBottomLeft2 1s ease-out 0.1s forwards;
            }

            .fireworks-bottom-left .firework-3 {
                background: #ffe66d;
                top: 50%;
                left: 50%;
                animation: fireworkBottomLeft3 1s ease-out 0.2s forwards;
            }

            .fireworks-bottom-right .firework-1 {
                background: #ff6b6b;
                top: 50%;
                left: 50%;
                animation: fireworkBottomRight1 1s ease-out forwards;
            }

            .fireworks-bottom-right .firework-2 {
                background: #4ecdc4;
                top: 50%;
                left: 50%;
                animation: fireworkBottomRight2 1s ease-out 0.1s forwards;
            }

            .fireworks-bottom-right .firework-3 {
                background: #ffe66d;
                top: 50%;
                left: 50%;
                animation: fireworkBottomRight3 1s ease-out 0.2s forwards;
            }

            @keyframes fireworkTopLeft1 {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(-150px, -150px) scale(0);
                }
            }

            @keyframes fireworkTopLeft2 {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(-120px, -180px) scale(0);
                }
            }

            @keyframes fireworkTopLeft3 {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(-180px, -120px) scale(0);
                }
            }

            @keyframes fireworkTopRight1 {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(50px, -150px) scale(0);
                }
            }

            @keyframes fireworkTopRight2 {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(80px, -180px) scale(0);
                }
            }

            @keyframes fireworkTopRight3 {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(20px, -120px) scale(0);
                }
            }

            @keyframes fireworkBottomLeft1 {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(-150px, 50px) scale(0);
                }
            }

            @keyframes fireworkBottomLeft2 {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(-120px, 80px) scale(0);
                }
            }

            @keyframes fireworkBottomLeft3 {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(-180px, 20px) scale(0);
                }
            }

            @keyframes fireworkBottomRight1 {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(50px, 50px) scale(0);
                }
            }

            @keyframes fireworkBottomRight2 {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(80px, 80px) scale(0);
                }
            }

            @keyframes fireworkBottomRight3 {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(20px, 80px) scale(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

