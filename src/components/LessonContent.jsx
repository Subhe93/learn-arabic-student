import React, { useState, useEffect } from 'react';
import { studentService } from '../services/studentService';
import { formatAnswerForSubmission, buildFullUrl as buildFullUrlHelper } from '../utils/questionAnswerHelpers';
import QuizResult from './QuizResult';
import bookImg from '../assets/images/1.png';

import MultipleChoiceQuestion from './questions/MultipleChoiceQuestion';
import DrawCircleQuestion from './questions/DrawCircleQuestion';
import DragMatchQuestion from './questions/DragMatchQuestion';
import SentenceBuilderQuestion from './questions/SentenceBuilderQuestion';
import ListenRepeatQuestion from './questions/ListenRepeatQuestion';
import CopyWordsQuestion from './questions/CopyWordsQuestion';
import LetterBuilderQuestion from './questions/LetterBuilderQuestion';
import FillBlankQuestion from './questions/FillBlankQuestion';
import ImageDescriptionQuestion from './questions/ImageDescriptionQuestion';
import WritingQuestion from './questions/WritingQuestion';
import ReadingWritingQuestion from './questions/ReadingWritingQuestion';
import ReadingQuestion from './questions/ReadingQuestion';
import ImageUploadQuestion from './questions/ImageUploadQuestion';
import BreakWordQuestion from './questions/BreakWordQuestion';
import QuestionWrapper from './questions/QuestionWrapper';
import CertificateDisplay from './content/CertificateDisplay';
import VideoPlayer from './content/VideoPlayer';
import PDFViewer from './PDFViewer';

// Images for Matching
import img3 from '../assets/images/image 3.png';
import img4 from '../assets/images/image 4.png';
import img5 from '../assets/images/image 5.png';
import img6 from '../assets/images/image 6.png';
import img7 from '../assets/images/image 7.png';
import img8 from '../assets/images/image 8.png';
import img10 from '../assets/images/image 10.png';
import game4Img from '../assets/images/game4.png';

import penIcon from '../assets/icons/pen-line.svg';
import playIcon from '../assets/icons/Play.svg';

const LessonContent = ({ activeTab, currentLesson, levelInfo }) => {
    const lessonData = currentLesson?.lessonData;
    
    // Debug: Log lesson and level info
    useEffect(() => {
        if (activeTab === 'exercises') {
            console.log('LessonContent - activeTab:', activeTab);
            console.log('LessonContent - currentLesson:', currentLesson);
            console.log('LessonContent - lessonData:', lessonData);
            console.log('LessonContent - lessonData.id:', lessonData?.id);
            console.log('LessonContent - levelInfo:', levelInfo);
            console.log('LessonContent - levelInfo.id:', levelInfo?.id);
        }
    }, [activeTab, currentLesson, lessonData, levelInfo]);
    
    // Helper function to build full URL
    const buildFullUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        // Remove leading slash if exists to avoid double slashes
        const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
        // Ensure /uploads is included after domain
        if (cleanUrl.startsWith('uploads/')) {
            return `https://learnarabic.iwings-digital.com/${cleanUrl}`;
        }
        return `https://learnarabic.iwings-digital.com/uploads/${cleanUrl}`;
    };
    
    const [q1Answer, setQ1Answer] = useState(null);
    const [q2Answer, setQ2Answer] = useState(null);

    // Pagination State for Exercises & Games
    const [currentExercise, setCurrentExercise] = useState(1);
    const [currentGame, setCurrentGame] = useState(1);
    
    // Assignments state
    const [assignment, setAssignment] = useState(null); // Full assignment with blocks
    const [isLoadingAssignments, setIsLoadingAssignments] = useState(false);
    const [assignmentError, setAssignmentError] = useState(null);
    const [assignmentId, setAssignmentId] = useState(null);
    const [answers, setAnswers] = useState({}); // Store answers by questionId
    const [confirmedAnswers, setConfirmedAnswers] = useState({}); // Track confirmed answers by questionId
    const [showCorrectAnswers, setShowCorrectAnswers] = useState({}); // Track which questions show correct answers
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState({}); // Track current question index per block
    const [showResults, setShowResults] = useState(false); // Show quiz results after submission
    const [submissionResult, setSubmissionResult] = useState(null); // Store submission result
    const [assignmentStatus, setAssignmentStatus] = useState(null); // Assignment status from API
    const [isCheckingStatus, setIsCheckingStatus] = useState(false); // Loading state for status check
    
    // Check assignment status
    const checkAssignmentStatus = async () => {
        if (activeTab !== 'exercises' || (!lessonData?.id && !levelInfo?.id)) {
            setAssignmentStatus(null);
            return;
        }

        try {
            setIsCheckingStatus(true);
            let statusData = null;

            // Try lesson first, then level
            if (lessonData?.id) {
                try {
                    const response = await studentService.getAssignmentStatus('lesson', lessonData.id);
                    statusData = response?.data || response;
                } catch (err) {
                    console.log('No lesson assignment status, trying level...');
                }
            }

            if (!statusData && levelInfo?.id) {
                const response = await studentService.getAssignmentStatus('level', levelInfo.id);
                statusData = response?.data || response;
            }

            setAssignmentStatus(statusData);
        } catch (error) {
            console.error('Error checking assignment status:', error);
            setAssignmentStatus(null);
        } finally {
            setIsCheckingStatus(false);
        }
    };

    // Load assignments when lesson data is available and activeTab is 'exercises'
    // Note: Assignments can be linked to either Level or Lesson
    // We'll try both: first with lessonId, then with levelId
    useEffect(() => {
        const loadAssignments = async () => {
            if (activeTab !== 'exercises' || (!lessonData?.id && !levelInfo?.id)) {
                setAssignment(null);
                setAnswers({});
                setConfirmedAnswers({});
                setShowCorrectAnswers({});
                return;
            }
            
            try {
                setIsLoadingAssignments(true);
                setAssignmentError(null);
                setSubmitSuccess(false);
                setSubmitError(null);
                
                // Get assignment for this level
                // API: GET /student/assignments/{assignmentId}/questions
                // Assignments are linked to Level, so we use levelId as assignmentId
                const levelId = levelInfo?.id;
                
                if (!levelId) {
                    setAssignment(null);
                    setAssignmentError('لا يوجد معرف للمستوى');
                    setIsLoadingAssignments(false);
                    return;
                }
                
                try {
                    // Try to get assignment by lesson first, then by level
                    let assignmentResponse;
                    let assignmentData;
                    
                    // First, try lesson-specific assignment
                    if (lessonData?.id) {
                        try {
                            assignmentResponse = await studentService.getAssignmentQuestionsByType('lesson', lessonData.id);
                            assignmentData = assignmentResponse?.data || assignmentResponse;
                        } catch (lessonErr) {
                            console.log('No lesson-specific assignment, trying level assignment...');
                        }
                    }
                    
                    // If no lesson assignment, try level assignment
                    if (!assignmentData && levelId) {
                        assignmentResponse = await studentService.getAssignmentQuestionsByType('level', levelId);
                        assignmentData = assignmentResponse?.data || assignmentResponse;
                    }
                    
                    // Verify assignment exists and belongs to this level
                    // Note: Some assignments might have targetType: "Lesson" but are still linked to the level
                    if (assignmentData && assignmentData.id) {
                        // Accept assignment if it exists (regardless of targetType for now)
                        // In production, you might want to verify targetType === 'Level' && targetId === levelId
                        setAssignment(assignmentData);
                        setAssignmentId(assignmentData.id);
                        
                        // Initialize answers object for all questions
                        const initialAnswers = {};
                        const initialQuestionIndices = {};
                        if (assignmentData.blocks && Array.isArray(assignmentData.blocks)) {
                            assignmentData.blocks.forEach(block => {
                                // Initialize question index for each block
                                initialQuestionIndices[block.id] = 0;
                                if (block.questions && Array.isArray(block.questions)) {
                                    block.questions.forEach(q => {
                                        initialAnswers[q.id] = null;
                                    });
                                }
                            });
                        }
                        setAnswers(initialAnswers);
                        setCurrentQuestionIndex(initialQuestionIndices);
                    } else {
                        // Assignment not found
                        setAssignment(null);
                        setAssignmentError('لا توجد تدريبات متاحة لهذا المستوى');
                    }
                } catch (assignmentErr) {
                    // Assignment might not exist for this level
                    console.log('No assignment found for level:', levelId, assignmentErr);
                    setAssignment(null);
                    setAssignmentError('لا توجد تدريبات متاحة لهذا المستوى');
                }
            } catch (err) {
                console.error('Error loading assignments:', err);
                setAssignmentError(err.message || 'فشل تحميل التدريبات');
            } finally {
                setIsLoadingAssignments(false);
            }
        };
        
        loadAssignments();
        checkAssignmentStatus();
    }, [activeTab, levelInfo?.id, lessonData?.id]);
    
    // Handle answer change
    const handleAnswerChange = (questionId, answer) => {
        // Don't allow changes if answer is already confirmed
        if (confirmedAnswers[questionId]) {
            return;
        }
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };
    
    // Handle answer confirmation
    const handleConfirmAnswer = (questionId) => {
        const answer = answers[questionId];
        if (!answer || (Array.isArray(answer) && answer.length === 0)) {
            alert('يرجى الإجابة على السؤال أولاً');
            return;
        }
        
        // Find question to check if it needs teacher review
        let question = null;
        if (assignment && assignment.blocks) {
            for (const block of assignment.blocks) {
                if (block.questions) {
                    question = block.questions.find(q => q.id === parseInt(questionId));
                    if (question) break;
                }
            }
        }
        
        // Mark answer as confirmed
        setConfirmedAnswers(prev => ({
            ...prev,
            [questionId]: true
        }));
        
        // If question doesn't require teacher review, show correct answer
        const requiresReview = question && (
            question.type === 'free_text' ||
            question.type === 'free_text_upload' ||
            question.type === 'write_words' ||
            question.type === 'listen_repeat'
        );
        
        if (!requiresReview) {
            setShowCorrectAnswers(prev => ({
                ...prev,
                [questionId]: true
            }));
        }
    };
    
    // Submit assignment
    const handleSubmitAssignment = async () => {
        if (!assignmentId) {
            setSubmitError('لا يوجد تمرين للإرسال');
            return;
        }
        
        // Build answers array in API format
        const answersArray = Object.keys(answers).map(questionId => {
            const answer = answers[questionId];
            // Find question in assignment blocks
            let question = null;
            if (assignment && assignment.blocks) {
                for (const block of assignment.blocks) {
                    if (block.questions) {
                        question = block.questions.find(q => q.id === parseInt(questionId));
                        if (question) break;
                    }
                }
            }
            
            if (!question || !answer) {
                return null;
            }
            
            // Use the helper function to format answers
            const formattedAnswer = formatAnswerForSubmission(question.type, answer);
            
            /* OLD FORMAT CODE - Now using formatAnswerForSubmission helper
            // Format answer based on question type (from API structure)
            let formattedAnswer = null;
            const questionType = question.type;
            
            */ // End of old format code
            
            return {
                questionId: parseInt(questionId),
                answer: formattedAnswer
            };
        }).filter(item => item !== null);
        
        try {
            setIsSubmitting(true);
            setSubmitError(null);
            
            const submitData = {
                assignmentId: parseInt(assignmentId),
                answers: answersArray
            };
            
            const response = await studentService.submitAssignment(submitData);
            
            setSubmitSuccess(true);
            setSubmitError(null);
            
            // Reload assignment status to show results
            await checkAssignmentStatus();
        } catch (err) {
            console.error('Error submitting assignment:', err);
            setSubmitError(err.message || 'فشل إرسال الإجابات');
            setSubmitSuccess(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    // State for Drag and Drop (Exercise 1)
    // Updated with text based on user image and new mapping
    const [rightItems, setRightItems] = useState([
        { id: 'r1', type: 'image', content: img6, text: 'عن الماء' },
        { id: 'r2', type: 'image', content: img7, text: 'الغذاء' },
        { id: 'r3', type: 'image', content: img8, text: 'يبحث الغراب' },
    ]);

    const [leftItems, setLeftItems] = useState([
        { id: 'l1', type: 'image', content: img5, text: 'مفيد للجسم' },
        { id: 'l2', type: 'image', content: img4, text: 'يقلد الببغاء' },
        { id: 'l3', type: 'image', content: img3, text: 'صوت الانسان' },
    ]);

    // Data for Sentence Builder (Exercise 2)
    const sentenceWords = [
        { id: 'word1', text: 'الجبن' },
        { id: 'word2', text: 'يحب' },
        { id: 'word3', text: 'الفأر' },
    ];

    // Handle Certificate View
    if (activeTab === 'certificate') {
        return <CertificateDisplay levelId={levelInfo?.id} levelName={levelInfo?.name} />;
    }

    // Handle lesson content (first tab - usually the lesson title)
    const lessonTitle = lessonData?.name || lessonData?.title || activeTab;
    
    // Check if activeTab matches the lesson title or is the first tab (content)
    // Note: We check against 'content' route name, not Arabic names
    if (activeTab === lessonTitle || activeTab === 'content') {
        return (
            <>
                {/* Lesson Content from HTML Editor */}
                {lessonData?.description ? (
                    <div 
                        className="lesson-content"
                        dangerouslySetInnerHTML={{ __html: lessonData.description }}
                    />
                ) : (
                    <div>
                        <p>محتوى الدرس: {lessonTitle}</p>
                </div>
                )}
            </>
        );
    }

    if (activeTab === 'video') {
        return (
            <VideoPlayer videoUrl={buildFullUrl(lessonData?.videoUrl)} />
        );
    }

    if (activeTab === 'book') {
        const fullPdfUrl = buildFullUrl(lessonData?.pdfUrl);
        const fullAudioUrl = buildFullUrl(lessonData?.audioUrl);

        return (
            <div className="w-full h-full" style={{ minHeight: '80vh' }}>
                {fullAudioUrl && (
                    <div className="mb-4 p-5">
                        <h2 className='text-center text-lg font-semibold mb-2'>يمكنك الاستماع إلى الصوت المرفق : </h2>
                        <audio controls className="w-full">
                            <source src={fullAudioUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )}
                {fullPdfUrl ? (
                    <PDFViewer 
                        pdfUrl={fullPdfUrl}
                        className="rounded-lg"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <img
                            src={bookImg}
                            alt="الكتاب"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                        />
                    </div>
                )}
            </div>
        );
    }

    if (activeTab === 'exercises') {
        // Show loading or error state for assignments
        if (isLoadingAssignments) {
            return (
                <div className="w-full px-4 pb-10 flex flex-col items-center justify-center" dir="rtl">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F67BD] mb-4"></div>
                    <p className="text-gray-600">جاري تحميل التدريبات...</p>
                </div>
            );
        }
        
        if (assignmentError) {
            return (
                <div className="w-full px-4 pb-10 flex flex-col items-center justify-center" dir="rtl">
                    <p className="text-red-600 mb-4">{assignmentError}</p>
                    <button
                        onClick={async () => {
                            const levelId = levelInfo?.id;
                            
                            if (!levelId) {
                                setAssignmentError('لا يوجد معرف للمستوى');
                                return;
                            }
                            
                            setAssignmentError(null);
                            setIsLoadingAssignments(true);
                            
                            try {
                                const response = await studentService.getAssignmentQuestions(levelId);
                                const assignmentData = response?.data || response;
                                
                                if (assignmentData && assignmentData.id) {
                                    setAssignment(assignmentData);
                                    setAssignmentId(assignmentData.id);
                                    const initialAnswers = {};
                                    const initialQuestionIndices = {};
                                    if (assignmentData.blocks && Array.isArray(assignmentData.blocks)) {
                                        assignmentData.blocks.forEach(block => {
                                            // Initialize question index for each block
                                            initialQuestionIndices[block.id] = 0;
                                            if (block.questions && Array.isArray(block.questions)) {
                                                block.questions.forEach(q => {
                                                    initialAnswers[q.id] = null;
                                                });
                                            }
                                        });
                                    }
                                    setAnswers(initialAnswers);
                                    setCurrentQuestionIndex(initialQuestionIndices);
                                } else {
                                    setAssignment(null);
                                    setAssignmentError('لا توجد تدريبات متاحة لهذا المستوى');
                                }
                            } catch (err) {
                                setAssignmentError(err.message || 'فشل تحميل التدريبات');
                                setAssignment(null);
                            } finally {
                                setIsLoadingAssignments(false);
                            }
                        }}
                        className="mt-4 bg-[#4F67BD] text-white font-bold py-2 px-6 rounded-full hover:bg-[#3e539a] transition-colors"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            );
        }

        // Check assignment status and show appropriate UI
        if (assignmentStatus) {
            const isPending = assignmentStatus.status === 'pending_review';
            const isCompleted = assignmentStatus.status === 'completed';
            const hasAnswers = assignmentStatus.answers && assignmentStatus.answers.length > 0;
            
            // If showing results from "Browse Answers" button
            if (showResults && hasAnswers) {
                return (
                    <div className="w-full px-4 pb-10" dir="rtl">
                        <div className="mb-6">
                            <button
                                onClick={() => setShowResults(false)}
                                className="flex items-center gap-2 text-gray-600 hover:text-[#4F67BD] transition-colors mb-4"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span>العودة</span>
                            </button>
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    مراجعة الإجابات
                                </h3>
                                <p className="text-gray-600">
                                    {isPending ? 'هذه الإجابات قيد المراجعة من قبل المعلم' : 'مراجعة إجاباتك للاختبار'}
                                </p>
                            </div>
                        </div>
                        <QuizResult
                            assignment={assignment}
                            submissionResult={assignmentStatus}
                            onClose={() => setShowResults(false)}
                            onRetry={isCompleted ? () => {
                                setAssignmentStatus(null);
                                setAnswers({});
                                setConfirmedAnswers({});
                                setShowCorrectAnswers({});
                                setShowResults(false);
                            } : null}
                            isPending={isPending}
                        />
                    </div>
                );
            }
            
            // If assignment is pending review, show review message
            if (isPending && !showResults) {
                return (
                    <div className="w-full px-4 pb-10 flex flex-col items-center justify-center" dir="rtl">
                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 max-w-2xl">
                            <div className="flex items-center justify-center mb-4">
                                <svg className="w-16 h-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
                                الاختبار قيد المراجعة
                            </h3>
                            <p className="text-center text-gray-600 mb-6">
                                المعلم يقوم حالياً بمراجعة إجاباتك. سيتم إخطارك عند اكتمال التصحيح.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => setShowResults(true)}
                                    className="bg-blue-500 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition-colors"
                                >
                                    تصفح الإجابات
                                </button>
                                <button
                                    onClick={() => checkAssignmentStatus()}
                                    className="bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-full hover:bg-gray-300 transition-colors"
                                    disabled={isCheckingStatus}
                                >
                                    {isCheckingStatus ? 'جاري التحديث...' : 'تحديث الحالة'}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            }

            // If assignment is completed and reviewed, show results with retry option
            if (isCompleted && !showResults) {
                return (
                    <div className="w-full px-4 pb-10" dir="rtl">
                        <QuizResult
                            assignment={assignment}
                            submissionResult={assignmentStatus}
                            onRetry={() => {
                                setAssignmentStatus(null);
                                setAnswers({});
                                setConfirmedAnswers({});
                                setShowCorrectAnswers({});
                                setShowResults(false);
                            }}
                            onClose={() => {
                                // Stay on page
                            }}
                            isPending={false}
                        />
                    </div>
                );
            }
        }
        
        // Render assignments from API if available
        if (assignment && assignment.blocks && assignment.blocks.length > 0) {
            const renderQuestion = (question, index) => {
                const questionType = question.type || 'mcq_single';
                const questionId = question.id;
                const currentAnswer = answers[questionId];
                const content = question.content || {};
                const isConfirmed = confirmedAnswers[questionId] || false;
                const showCorrectAnswer = showCorrectAnswers[questionId] || false;
                
                // Determine if question requires teacher review
                const requiresReview = 
                    questionType === 'free_text' ||
                    questionType === 'free_text_upload' ||
                    questionType === 'write_words' ||
                    questionType === 'listen_repeat';
                
                switch (questionType) {
                    case 'mcq_single':
                        const singleOptions = content.options || [];
                        return (
                            <div key={questionId} className="w-full mb-8">
                                <QuestionWrapper
                                    questionId={questionId}
                                    questionType={questionType}
                                    questionContent={content}
                                    answer={currentAnswer}
                                    isConfirmed={isConfirmed}
                                    showCorrectAnswer={showCorrectAnswer}
                                    onConfirm={handleConfirmAnswer}
                                    requiresTeacherReview={requiresReview}
                                >
                                    <MultipleChoiceQuestion
                                        questionText={content.text || `السؤال ${index + 1}`}
                                        options={singleOptions.map((opt, idx) => ({
                                            id: opt.text || idx,
                                            label: opt.text || opt,
                                            isCorrect: opt.is_correct || false
                                        }))}
                                        selectedOptionId={currentAnswer}
                                        onOptionSelect={(optionId) => handleAnswerChange(questionId, optionId)}
                                    />
                                </QuestionWrapper>
                            </div>
                        );
                    
                    case 'draw_circle_single':
                        const drawCircleSingleOptions = content.options || [];
                        return (
                            <div key={questionId} className="w-full mb-8">
                                <QuestionWrapper
                                    questionId={questionId}
                                    questionType={questionType}
                                    questionContent={content}
                                    answer={currentAnswer}
                                    isConfirmed={isConfirmed}
                                    showCorrectAnswer={showCorrectAnswer}
                                    onConfirm={handleConfirmAnswer}
                                    requiresTeacherReview={requiresReview}
                                >
                                    <DrawCircleQuestion
                                        questionText={content.text || `السؤال ${index + 1}`}
                                        options={drawCircleSingleOptions.map((opt, idx) => ({
                                            id: opt.text || idx,
                                            label: opt.text || opt,
                                            isCorrect: opt.is_correct || false
                                        }))}
                                        selectedOptionId={currentAnswer}
                                        onOptionSelect={(optionId) => handleAnswerChange(questionId, optionId)}
                                        isConfirmed={isConfirmed}
                                        showFeedback={showCorrectAnswer}
                                        allowMultiple={false}
                                    />
                                </QuestionWrapper>
                            </div>
                        );
                    
                    case 'mcq_multiple':
                        const multipleOptions = content.options || [];
                        return (
                            <div key={questionId} className="w-full mb-8">
                                <QuestionWrapper
                                    questionId={questionId}
                                    questionType={questionType}
                                    questionContent={content}
                                    answer={currentAnswer}
                                    isConfirmed={isConfirmed}
                                    showCorrectAnswer={showCorrectAnswer}
                                    onConfirm={handleConfirmAnswer}
                                    requiresTeacherReview={requiresReview}
                                >
                                    <MultipleChoiceQuestion
                                        questionText={content.text || `السؤال ${index + 1}`}
                                        options={multipleOptions.map((opt, idx) => ({
                                            id: opt.text || idx,
                                            label: opt.text || opt,
                                            isCorrect: opt.is_correct || false
                                        }))}
                                        selectedOptionId={currentAnswer || []}
                                        onOptionSelect={(selections) => handleAnswerChange(questionId, selections)}
                                        allowMultiple={true}
                                    />
                                </QuestionWrapper>
                            </div>
                        );
                    
                    case 'draw_circle_multiple':
                        const drawCircleMultipleOptions = content.options || [];
                        return (
                            <div key={questionId} className="w-full mb-8">
                                <QuestionWrapper
                                    questionId={questionId}
                                    questionType={questionType}
                                    questionContent={content}
                                    answer={currentAnswer}
                                    isConfirmed={isConfirmed}
                                    showCorrectAnswer={showCorrectAnswer}
                                    onConfirm={handleConfirmAnswer}
                                    requiresTeacherReview={requiresReview}
                                >
                                    <DrawCircleQuestion
                                        questionText={content.text || `السؤال ${index + 1}`}
                                        options={drawCircleMultipleOptions.map((opt, idx) => ({
                                            id: opt.text || idx,
                                            label: opt.text || opt,
                                            isCorrect: opt.is_correct || false
                                        }))}
                                        selectedOptionId={currentAnswer || []}
                                        onOptionSelect={(selections) => handleAnswerChange(questionId, selections)}
                                        isConfirmed={isConfirmed}
                                        showFeedback={showCorrectAnswer}
                                        allowMultiple={true}
                                    />
                                </QuestionWrapper>
                            </div>
                        );
                    
                    case 'match_image_text':
                        const pairs = content.pairs || [];
                        // rightItems = النصوص (ثابتة على اليمين)
                        const rightItemsForMatch = pairs.map((pair) => {
                            const text = pair.text || '';
                            return typeof text === 'string' ? text : String(text);
                        });
                        // leftItems = الصور (قابلة للسحب من اليسار)
                        // في البداية: الصور في أماكنها الأصلية (مرتبة حسب pairs)
                        const initialLeftItems = pairs.map((pair, idx) => ({
                            id: `l${idx}`,
                            type: 'image',
                            content: buildFullUrl(pair.image)
                        }));
                        // Convert current answer (if exists) back to leftItems format
                        let currentLeftItems = initialLeftItems;
                        if (currentAnswer && Array.isArray(currentAnswer) && currentAnswer.length > 0) {
                            // Check if it's in matches format [{image, text}]
                            if (currentAnswer[0] && typeof currentAnswer[0] === 'object' && 'image' in currentAnswer[0]) {
                                // Convert from matches format to leftItems format
                                // Map each match to its corresponding position based on text
                                currentLeftItems = rightItemsForMatch.map((text, idx) => {
                                    const match = currentAnswer.find(m => m.text === text);
                                    if (match) {
                                        return {
                                            id: `l${idx}`,
                                            type: 'image',
                                            content: match.image || ''
                                        };
                                    }
                                    // If no match found, use image from initial pool
                                    return initialLeftItems[idx] || {
                                        id: `l${idx}`,
                                        type: 'image',
                                        content: null
                                    };
                                });
                            } else {
                                // Already in leftItems format
                                currentLeftItems = currentAnswer;
                            }
                        }
                        return (
                            <div key={questionId} className="w-full mb-8">
                                <QuestionWrapper
                                    questionId={questionId}
                                    questionType={questionType}
                                    questionContent={content}
                                    answer={currentAnswer}
                                    isConfirmed={isConfirmed}
                                    showCorrectAnswer={showCorrectAnswer}
                                    onConfirm={handleConfirmAnswer}
                                    requiresTeacherReview={requiresReview}
                                >
                                    <DragMatchQuestion
                                        rightItems={rightItemsForMatch}
                                        leftItems={currentLeftItems}
                                        onUpdateLeftItems={(updatedLeftItems) => {
                                            // Convert leftItems array to API format: matches with image and text
                                            // Each match: { image: leftItems[idx].content, text: rightItems[idx] }
                                            const matches = updatedLeftItems.map((item, idx) => ({
                                                image: item.content || '',
                                                text: rightItemsForMatch[idx] || ''
                                            }));
                                            handleAnswerChange(questionId, matches);
                                        }}
                                        onUpdateRightItems={() => {
                                            // rightItems (النصوص) ثابتة، لا حاجة للتحديث
                                        }}
                                        isConfirmed={isConfirmed}
                                        showFeedback={showCorrectAnswer}
                                        correctPairs={pairs}
                                    />
                                </QuestionWrapper>
                            </div>
                        );
                    
                    case 'order_words':
                        return (
                            <div key={questionId} className="w-full mb-8">
                                <QuestionWrapper
                                    questionId={questionId}
                                    questionType={questionType}
                                    questionContent={content}
                                    answer={currentAnswer}
                                    isConfirmed={isConfirmed}
                                    showCorrectAnswer={showCorrectAnswer}
                                    onConfirm={handleConfirmAnswer}
                                    requiresTeacherReview={requiresReview}
                                >
                                    <SentenceBuilderQuestion
                                        questionText={content.text || `السؤال ${index + 1}`}
                                        initialWords={(content.words || []).map((word, idx) => ({
                                            id: `word${idx}`,
                                            text: word
                                        }))}
                                        value={currentAnswer && Array.isArray(currentAnswer) ? currentAnswer : null}
                                        onAnswerChange={(orderedWords) => {
                                            // Store ordered words as array of text
                                            handleAnswerChange(questionId, orderedWords);
                                        }}
                                        correctOrder={content.correctOrder || []}
                                    />
                                </QuestionWrapper>
                            </div>
                        );
                    
                    case 'listen_repeat':
                        return (
                            <div key={questionId} className="w-full mb-8">
                                <QuestionWrapper
                                    questionId={questionId}
                                    questionType={questionType}
                                    questionContent={content}
                                    answer={currentAnswer}
                                    isConfirmed={isConfirmed}
                                    showCorrectAnswer={showCorrectAnswer}
                                    onConfirm={handleConfirmAnswer}
                                    requiresTeacherReview={requiresReview}
                                >
                                    <ListenRepeatQuestion
                                        questionText={content.text || `السؤال ${index + 1}`}
                                        content={buildFullUrl(content.audioUrl) || ''}
                                        contentType="audio"
                                        value={currentAnswer}
                                        onAnswerChange={(audioUrl) => handleAnswerChange(questionId, audioUrl)}
                                    />
                                </QuestionWrapper>
                            </div>
                        );
                    
                    case 'fill_sentence':
                        const fillOptions = content.options || [];
                        const correctFillOption = fillOptions.find(opt => opt.is_correct);
                        return (
                            <div key={questionId} className="w-full mb-8">
                                <QuestionWrapper
                                    questionId={questionId}
                                    questionType={questionType}
                                    questionContent={content}
                                    answer={currentAnswer}
                                    isConfirmed={isConfirmed}
                                    showCorrectAnswer={showCorrectAnswer}
                                    onConfirm={handleConfirmAnswer}
                                    requiresTeacherReview={requiresReview}
                                >
                                    <FillBlankQuestion
                                        questionText={content.text || `السؤال ${index + 1}`}
                                        options={fillOptions.map((opt, idx) => ({
                                            id: opt.text, // Use text as id for correct comparison
                                            label: opt.text,
                                            isCorrect: opt.is_correct || false
                                        }))}
                                        selectedOptionId={currentAnswer}
                                        correctAnswerId={correctFillOption ? correctFillOption.text : ''}
                                        onOptionSelect={(optionId) => handleAnswerChange(questionId, optionId)}
                                    />
                                </QuestionWrapper>
                            </div>
                        );
                    
                    case 'select_image_text':
                        const imageItems = content.items || [];
                        const textOptions = content.options || [];
                        const correctImageText = imageItems[0]?.correctText;
                        return (
                            <div key={questionId} className="w-full mb-8">
                                <QuestionWrapper
                                    questionId={questionId}
                                    questionType={questionType}
                                    questionContent={content}
                                    answer={currentAnswer}
                                    isConfirmed={isConfirmed}
                                    showCorrectAnswer={showCorrectAnswer}
                                    onConfirm={handleConfirmAnswer}
                                    requiresTeacherReview={requiresReview}
                                >
                                    <ImageDescriptionQuestion
                                        questionText={content.text || `السؤال ${index + 1}`}
                                        imageSrc={imageItems[0] ? buildFullUrl(imageItems[0].image) : game4Img}
                                        options={textOptions.map((opt) => ({
                                            id: opt, // Use text as id for correct comparison
                                            text: opt,
                                            isCorrect: opt === correctImageText
                                        }))}
                                        selectedOptionId={currentAnswer}
                                        correctAnswerId={correctImageText || ''}
                                        onOptionSelect={(optionId) => handleAnswerChange(questionId, optionId)}
                                    />
                                </QuestionWrapper>
                            </div>
                        );
                    
                    case 'free_text':
                        return (
                            <div key={questionId} className="w-full mb-8">
                                <QuestionWrapper
                                    questionId={questionId}
                                    questionType={questionType}
                                    questionContent={content}
                                    answer={currentAnswer}
                                    isConfirmed={isConfirmed}
                                    showCorrectAnswer={showCorrectAnswer}
                                    onConfirm={handleConfirmAnswer}
                                    requiresTeacherReview={requiresReview}
                                >
                                    <WritingQuestion
                                        questionText={content.text || `السؤال ${index + 1}`}
                                        placeholder={content.placeholder || 'اكتب إجابتك هنا...'}
                                        value={currentAnswer || ''}
                                        onAnswerChange={(text) => handleAnswerChange(questionId, text)}
                                    />
                                </QuestionWrapper>
                            </div>
                        );
                    
                    case 'compose_word':
                        const letters = (content.letters || []).map((letter, idx) => ({
                            id: `letter${idx}`,
                            text: letter
                        }));
                        return (
                            <div key={questionId} className="w-full mb-8">
                                <QuestionWrapper
                                    questionId={questionId}
                                    questionType={questionType}
                                    questionContent={content}
                                    answer={currentAnswer}
                                    isConfirmed={isConfirmed}
                                    showCorrectAnswer={showCorrectAnswer}
                                    onConfirm={handleConfirmAnswer}
                                    requiresTeacherReview={requiresReview}
                                >
                                    <LetterBuilderQuestion
                                        questionText={content.text || `السؤال ${index + 1}`}
                                        initialLetters={letters}
                                        correctSentence={content.correctWord || ''}
                                        value={currentAnswer}
                                        onAnswerChange={(word) => handleAnswerChange(questionId, word)}
                                    />
                                </QuestionWrapper>
                            </div>
                        );
                    
                    case 'break_word':
                        const correctLetters = content.correctLetters || [];
                        return (
                            <div key={questionId} className="w-full mb-8">
                                <QuestionWrapper
                                    questionId={questionId}
                                    questionType={questionType}
                                    questionContent={content}
                                    answer={currentAnswer}
                                    isConfirmed={isConfirmed}
                                    showCorrectAnswer={showCorrectAnswer}
                                    onConfirm={handleConfirmAnswer}
                                    requiresTeacherReview={requiresReview}
                                >
                                    <BreakWordQuestion
                                        questionText={content.text || `السؤال ${index + 1}`}
                                        word={content.word || ''}
                                        correctLetters={correctLetters}
                                        value={currentAnswer || []}
                                        onAnswerChange={(letters) => handleAnswerChange(questionId, letters)}
                                        isConfirmed={isConfirmed}
                                        showFeedback={showCorrectAnswer}
                                    />
                                </QuestionWrapper>
                            </div>
                        );
                    
                    case 'free_text_upload':
                        return (
                            <div key={questionId} className="w-full mb-8">
                                <QuestionWrapper
                                    questionId={questionId}
                                    questionType={questionType}
                                    questionContent={content}
                                    answer={currentAnswer}
                                    isConfirmed={isConfirmed}
                                    showCorrectAnswer={showCorrectAnswer}
                                    onConfirm={handleConfirmAnswer}
                                    requiresTeacherReview={requiresReview}
                                >
                                    <ImageUploadQuestion
                                        questionText={content.text || `السؤال ${index + 1}`}
                                        placeholder="PNG, JPG, GIF - الحد الأقصى 5 ميجابايت"
                                        value={currentAnswer || ''}
                                        onAnswerChange={(imageUrl) => handleAnswerChange(questionId, imageUrl)}
                                    />
                                </QuestionWrapper>
                            </div>
                        );
                    
                    case 'read_question':
                        return (
                            <div key={questionId} className="w-full mb-8">
                                <QuestionWrapper
                                    questionId={questionId}
                                    questionType={questionType}
                                    questionContent={content}
                                    answer={currentAnswer}
                                    isConfirmed={isConfirmed}
                                    showCorrectAnswer={showCorrectAnswer}
                                    onConfirm={handleConfirmAnswer}
                                    requiresTeacherReview={requiresReview}
                                >
                                    <ReadingQuestion
                                        questionText={content.text || `السؤال ${index + 1}`}
                                        content={content}
                                        value={currentAnswer || ''}
                                        onAnswerChange={(status) => {
                                            handleAnswerChange(questionId, status);
                                            // Automatically confirm read_question when marked as read
                                            if (status === 'read') {
                                                setTimeout(() => handleConfirmAnswer(questionId), 100);
                                            }
                                        }}
                                    />
                                </QuestionWrapper>
                            </div>
                        );
                    
                    case 'write_words':
                        return (
                            <div key={questionId} className="w-full mb-8">
                                <QuestionWrapper
                                    questionId={questionId}
                                    questionType={questionType}
                                    questionContent={content}
                                    answer={currentAnswer}
                                    isConfirmed={isConfirmed}
                                    showCorrectAnswer={showCorrectAnswer}
                                    onConfirm={handleConfirmAnswer}
                                    requiresTeacherReview={requiresReview}
                                >
                                    <WritingQuestion
                                        questionText={content.text || `السؤال ${index + 1}`}
                                        placeholder={content.placeholder || 'اكتب إجابتك هنا...'}
                                        value={currentAnswer || ''}
                                        onAnswerChange={(text) => handleAnswerChange(questionId, text)}
                                    />
                                </QuestionWrapper>
                            </div>
                        );
                    
                    default:
                        return (
                            <div key={questionId} className="w-full mb-8 p-4 border rounded-lg">
                                <p className="font-bold mb-2">{content.text || `السؤال ${index + 1}`}</p>
                                <p className="text-gray-500 text-sm">نوع السؤال: {questionType}</p>
                            </div>
                        );
                }
            };
            
            return (
                <div className="w-full px-4 pb-10 flex flex-col items-start" dir="rtl">
                    {submitSuccess && (
                        <div className="w-full mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
                            تم إرسال الإجابات بنجاح!
                        </div>
                    )}
                    
                    {submitError && (
                        <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                            {submitError}
                        </div>
                    )}
                    
                    {/* Render blocks with textContent and questions */}
                    {assignment.blocks
                        .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
                        .map((block, blockIndex) => (
                            <div key={block.id || blockIndex} className="w-full mb-8">
                                {/* Block Content (text or image) */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <div
                                        className="text-lg font-semibold"
                                        dangerouslySetInnerHTML={{ __html: block.textContent?.text || "" }}
                                    />
                                </div>
                                
                                {block.textContentType === 'image' && block.textContent?.url && (
                                    <div className="mb-6 text-center">
                                        <img 
                                            src={buildFullUrl(block.textContent.url)} 
                                            alt={block.textContent.caption || 'صورة'} 
                                            className="max-w-full h-auto rounded-lg mx-auto"
                                        />
                                        {block.textContent.caption && (
                                            <p className="mt-2 text-sm text-gray-600">{block.textContent.caption}</p>
                                        )}
                                    </div>
                                )}
                                
                                {/* Block Questions */}
                                {block.questions && block.questions.length > 0 && (
                                    <div className="space-y-6">
                                        {/* Display current question only */}
                                        {(() => {
                                            const currentIdx = currentQuestionIndex[block.id] || 0;
                                            const currentQuestion = block.questions[currentIdx];
                                            return currentQuestion ? renderQuestion(currentQuestion, currentIdx) : null;
                                        })()}
                                        
                                        {/* Question Navigation */}
                                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                                            <button
                                                onClick={() => {
                                                    const currentIdx = currentQuestionIndex[block.id] || 0;
                                                    if (currentIdx > 0) {
                                                        setCurrentQuestionIndex(prev => ({
                                                            ...prev,
                                                            [block.id]: currentIdx - 1
                                                        }));
                                                    }
                                                }}
                                                disabled={(currentQuestionIndex[block.id] || 0) === 0}
                                                className={`px-6 py-2 rounded-full font-bold transition-colors ${
                                                    (currentQuestionIndex[block.id] || 0) === 0
                                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                        : 'bg-[#4F67BD] text-white hover:bg-[#3e539a]'
                                                }`}
                                            >
                                                السابق
                                            </button>
                                            
                                            <span className="text-gray-600 font-semibold">
                                                السؤال {(currentQuestionIndex[block.id] || 0) + 1} من {block.questions.length}
                                            </span>
                                            
                                            <button
                                                onClick={() => {
                                                    const currentIdx = currentQuestionIndex[block.id] || 0;
                                                    if (currentIdx < block.questions.length - 1) {
                                                        setCurrentQuestionIndex(prev => ({
                                                            ...prev,
                                                            [block.id]: currentIdx + 1
                                                        }));
                                                    }
                                                }}
                                                disabled={(currentQuestionIndex[block.id] || 0) >= block.questions.length - 1}
                                                className={`px-6 py-2 rounded-full font-bold transition-colors ${
                                                    (currentQuestionIndex[block.id] || 0) >= block.questions.length - 1
                                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                        : 'bg-[#4F67BD] text-white hover:bg-[#3e539a]'
                                                }`}
                                            >
                                                التالي
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    
                    <div className="w-full mt-8 flex flex-col items-center gap-4">
                        {(() => {
                            // Count total questions
                            let totalQuestions = 0;
                            let confirmedCount = 0;
                            
                            if (assignment && assignment.blocks) {
                                assignment.blocks.forEach(block => {
                                    if (block.questions) {
                                        totalQuestions += block.questions.length;
                                        block.questions.forEach(q => {
                                            if (confirmedAnswers[q.id]) {
                                                confirmedCount++;
                                            }
                                        });
                                    }
                                });
                            }
                            
                            const allConfirmed = totalQuestions > 0 && confirmedCount === totalQuestions;
                            const hasAnswers = Object.keys(answers).length > 0;
                            
                            return (
                                <>
                                    {!allConfirmed && hasAnswers && (
                                        <div className="text-center p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-800 max-w-md">
                                            <div className="flex items-center gap-2 justify-center mb-2">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                <span className="font-bold">يرجى تأكيد جميع الإجابات</span>
                                            </div>
                                            <p className="text-sm">
                                                تم تأكيد {confirmedCount} من {totalQuestions} سؤال
                                            </p>
                                        </div>
                                    )}
                                    
                                    <button
                                        onClick={handleSubmitAssignment}
                                        disabled={isSubmitting || !allConfirmed}
                                        className={`px-10 py-4 rounded-full font-bold text-lg transition-all transform ${
                                            isSubmitting || !allConfirmed
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-[#4F67BD] to-[#3e54a3] text-white hover:scale-105 shadow-lg hover:shadow-xl'
                                        }`}
                                        style={{
                                            boxShadow: allConfirmed && !isSubmitting ? '0px 4px 4px 0px #00000040 inset' : 'none',
                                            minWidth: '250px',
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                <span>جاري الإرسال...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-3">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>إرسال جميع الإجابات</span>
                                            </div>
                                        )}
                                    </button>
                                </>
                            );
                        })()}
                    </div>
                </div>
            );
        }
        
        // If no assignment is loaded, show a message.
        return (
            <div className="w-full px-4 pb-10 flex flex-col items-center justify-center" dir="rtl">
                <p className="text-gray-600 text-lg">لا يوجد تدريبات حالياً</p>
            </div>
        );
    }

    // Handle assignment results display
    if (showResults && submissionResult) {
        return (
            <QuizResult
                assignment={assignment}
                submissionResult={submissionResult}
                onClose={() => {
                    setShowResults(false);
                    setSubmissionResult(null);
                }}
                onRetry={() => {
                    setShowResults(false);
                    setSubmissionResult(null);
                    setAnswers({});
                    setConfirmedAnswers({});
                    setShowCorrectAnswers({});
                    setSubmitSuccess(false);
                }}
            />
        );
    }

    if (activeTab === 'games') {
        // Display game embed code from lesson data
        if (lessonData?.game) {
            return (
                <div className="w-full h-full flex items-center justify-center p-4">
                    <div 
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{ __html: lessonData.game }}
                    />
                </div>
            );
        }
        
        // Fallback to existing game content if no embed code
        // Game 1 Content
        const renderGame1 = () => {
            const words1 = ['برتقال', 'سيارة', 'طاولة'];
            const words2 = ['برتقال', 'سيارة', 'طاولة'];

            return (
                <div className="w-full">
                     {/* Header for Games */}
                     <div className="flex justify-start mb-4 w-full">
                        <div className="bg-[#5b72c4] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md">
                            <img src={penIcon} alt="Game" className="w-5 h-5 brightness-0 invert" />
                            <span className="font-bold">تدريب النسخ</span>
                        </div>
                    </div>

                    <div className="w-full">
                        <CopyWordsQuestion 
                            questionText="اكتب الكلمات التالية على الورقة ثم قم بتصويرها ورفعها"
                            words={words1}
                        />
                        <CopyWordsQuestion 
                            questionText="اكتب الكلمات التالية على الورقة ثم قم بتصويرها ورفعها"
                            words={words2}
                        />
                    </div>
                </div>
            );
        };

        // Game 2 Content
        const renderGame2 = () => {
            const letters = [
                { id: 'l1', text: 'ا' },
                { id: 'l2', text: 'ة' },
                { id: 'l3', text: 'ر' },
                { id: 'l4', text: 'ي' },
                { id: 'l5', text: 'س' },
            ];

            return (
                <div className="w-full">
                     {/* Header for Game 2 */}
                     <div className="flex justify-start mb-4 w-full">
                        <div className="bg-[#5b72c4] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md">
                            <img src={penIcon} alt="Game" className="w-5 h-5 brightness-0 invert" />
                            <span className="font-bold">تركيب الاحرف</span>
                        </div>
                    </div>

                    <div className="w-full">
                        <LetterBuilderQuestion 
                            questionText="ركب الاحرف التالية لتكوين جملة"
                            initialLetters={letters}
                            correctSentence="سيارة"
                        />
                         <LetterBuilderQuestion 
                            questionText="ركب الاحرف التالية لتكوين جملة"
                            initialLetters={letters}
                            correctSentence="سيارة"
                        />
                         <LetterBuilderQuestion 
                            questionText="ركب الاحرف التالية لتكوين جملة"
                            initialLetters={letters}
                            correctSentence="سيارة"
                        />
                    </div>
                </div>
            );
        };

        // Game 3 Content
        const renderGame3 = () => {
            const options = [
                { id: 'opt1', label: 'الشارع', isCorrect: false },
                { id: 'opt2', label: 'الحديقة', isCorrect: false },
                { id: 'opt3', label: 'للمدرسة', isCorrect: true }, // Assuming correct answer based on "go to school" context
            ];

            return (
                <div className="w-full">
                     {/* Header for Game 3 */}
                     <div className="flex justify-start mb-4 w-full">
                        <div className="bg-[#5b72c4] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md">
                            <img src={penIcon} alt="Game" className="w-5 h-5 brightness-0 invert" />
                            <span className="font-bold">اكمل الجملة</span>
                        </div>
                    </div>

                    <div className="w-full">
                        <FillBlankQuestion 
                            questionText="يذهب الطفل الى .......... كل صباح"
                            options={options}
                            correctAnswerId="opt3"
                        />
                        <FillBlankQuestion 
                            questionText="يذهب الطفل الى .......... كل صباح"
                            options={options}
                            correctAnswerId="opt3"
                        />
                        <FillBlankQuestion 
                            questionText="يذهب الطفل الى .......... كل صباح"
                            options={options}
                            correctAnswerId="opt3"
                        />
                    </div>
                </div>
            );
        };

        // Game 4 Content
        const renderGame4 = () => {
            const options = [
                { id: 'opt1', text: 'يلعب الولد فوق الطاولة' },
                { id: 'opt2', text: 'يلعب الولد تحت الطاولة' },
                { id: 'opt3', text: 'يقوم بمساعدة اخيه' },
            ];

            return (
                <div className="w-full">
                     {/* Header for Game 4 */}
                     <div className="flex justify-start mb-4 w-full">
                        <div className="bg-[#5b72c4] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md">
                            <img src={penIcon} alt="Game" className="w-5 h-5 brightness-0 invert" />
                            <span className="font-bold">اختر ما يناسب</span>
                        </div>
                    </div>

                    <div className="w-full">
                        <ImageDescriptionQuestion
                            questionText="شاهد الصورة ثم اختر من القائمة ما يصف الصورة"
                            imageSrc={game4Img}
                            options={options}
                            correctAnswerId="opt1"
                        />
                        <ImageDescriptionQuestion
                            questionText="شاهد الصورة ثم اختر من القائمة ما يصف الصورة"
                            imageSrc={game4Img}
                            options={options}
                            correctAnswerId="opt3"
                        />
                        <ImageDescriptionQuestion
                            questionText="شاهد الصورة ثم اختر من القائمة ما يصف الصورة"
                            imageSrc={game4Img}
                            options={options}
                            correctAnswerId="opt1"
                        />
                    </div>
                </div>
            );
        };

        // Game 5 Content
        const renderGame5 = () => {
            return (
                <div className="w-full">
                     {/* Header for Game 5 */}
                     <div className="flex justify-start mb-4 w-full">
                        <div className="bg-[#5b72c4] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md">
                            <img src={penIcon} alt="Game" className="w-5 h-5 brightness-0 invert" />
                            <span className="font-bold">نص تعبيري</span>
                        </div>
                    </div>

                    <div className="w-full">
                        <WritingQuestion
                            questionText="قم بكتابة موضوع تعبيري عن رحلة قمت بها انت مع عائلتك او اصدقائك"
                            placeholder="اكتب النص هنا"
                        />
                    </div>
                </div>
            );
        };

        // Game 6 Content
        const renderGame6 = () => {
            // Add <br> after "التطبيق" and "الموقع" as requested
            const readingText = "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.<br />إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما ولا يحوي أخطاء لغوية، مولد النص العربى مفيد لمصممي المواقع على وجه الخصوص، حيث يحتاج العميل فى كثير من الأحيان أن يطلع على صورة حقيقية لتصميم الموقع.<br />ومن هنا وجب على المصمم أن يضع نصوصا مؤقتة على التصميم ليظهر للعميل الشكل كاملاً، دور مولد النص العربى أن يوفر على المصمم عناء البحث عن نص بديل لا علاقة له بالموضوع الذى يتحدث عنه التصميم فيظهر بشكل لا يليق.";

            return (
                <div className="w-full">
                     {/* Header for Game 6 */}
                     <div className="flex justify-start mb-4 w-full">
                        <div className="bg-[#5b72c4] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md">
                            <img src={penIcon} alt="Game" className="w-5 h-5 brightness-0 invert" />
                            <span className="font-bold">اقراء النص</span>
                        </div>
                    </div>

                    <div className="w-full">
                        <ReadingWritingQuestion
                            questionText="اقراء النص التالي ثم اكتب مافهمت منه"
                            readingText={readingText}
                            placeholder="اكتب النص هنا"
                        />
                    </div>
                </div>
            );
        };

         // Navigation Buttons for Games
         const renderGameNavigation = () => (
            <div className="flex justify-between w-full mt-8 border-t pt-4">
                <button
                    onClick={() => setCurrentGame(prev => Math.max(prev - 1, 1))}
                    disabled={currentGame === 1}
                    className={`px-6 py-2 rounded-full font-bold transition-colors ${currentGame === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#5b72c4] text-white hover:bg-[#4a61b0]'}`}
                >
                    السابق
                </button>

                <span className="font-bold text-gray-600 flex items-center">
                    لعبة {currentGame} من 6
                </span>

                <button
                    onClick={() => setCurrentGame(prev => Math.min(prev + 1, 6))}
                    disabled={currentGame === 6}
                    className={`px-6 py-2 rounded-full font-bold transition-colors ${currentGame === 6 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#5b72c4] text-white hover:bg-[#4a61b0]'}`}
                >
                    التالي
                </button>
            </div>
        );

        return (
             <div className="w-full px-4 pb-10 flex flex-col items-start" dir="rtl">
                {currentGame === 1 && renderGame1()}
                {currentGame === 2 && renderGame2()}
                {currentGame === 3 && renderGame3()}
                {currentGame === 4 && renderGame4()}
                {currentGame === 5 && renderGame5()}
                {currentGame === 6 && renderGame6()}
                
                {renderGameNavigation()}
             </div>
        );
    }

    return (
        <div className="text-center text-gray-500">
            <h2 className="text-2xl font-bold">المحتوى قيد التطوير</h2>
            <p className="mt-2">سيتم إضافة محتوى {activeTab} قريباً.</p>
        </div>
    );
};

export default LessonContent;
