import React from 'react';
import { checkAnswerCorrectness, getCorrectAnswer, requiresTeacherReview, buildFullUrl } from '../../utils/questionAnswerHelpers';

/**
 * مكون لعرض مراجعة الإجابة
 * يعرض إجابة الطالب والإجابة الصحيحة والنتيجة
 */
function AnswerReview({ question, studentAnswer, isCorrect, points, teacherNotes, reviewedById }) {
  const { type, content, points: maxPoints, requiresTeacherReview: needsReview } = question;
  
  const needsManualReview = requiresTeacherReview(type, needsReview);
  const correctAnswer = getCorrectAnswer(type, content);
  
  // Check if teacher has reviewed this answer
  // If reviewedById is null or undefined, the answer hasn't been reviewed yet
  const isReviewedByTeacher = reviewedById !== null && reviewedById !== undefined;

  // Helper to render answer based on type
  const renderAnswer = (answer, isStudent = false) => {
    if (!answer) return <span className="text-gray-400">لا توجد إجابة</span>;

    // Extract actual answer value from object if needed
    let actualAnswer = answer;
    if (typeof answer === 'object' && !Array.isArray(answer)) {
      // Extract based on question type
      if (answer.selectedOptions) actualAnswer = answer.selectedOptions;
      else if (answer.text) actualAnswer = answer.text;
      else if (answer.word) actualAnswer = answer.word;
      else if (answer.letters) actualAnswer = answer.letters;
      else if (answer.orderedWords) actualAnswer = answer.orderedWords;
      else if (answer.matches) actualAnswer = answer.matches;
      else if (answer.imageUrl) actualAnswer = answer.imageUrl;
      else if (answer.audioUrl) actualAnswer = answer.audioUrl;
    }

    switch (type) {
      case 'mcq_single':
      case 'draw_circle_single':
      case 'fill_sentence': {
        const selectedOption = Array.isArray(actualAnswer) ? actualAnswer[0] : actualAnswer;
        return <span className="font-medium">{selectedOption}</span>;
      }

      case 'mcq_multiple':
      case 'draw_circle_multiple': {
        const options = Array.isArray(actualAnswer) ? actualAnswer : [actualAnswer];
        return (
          <div className="flex flex-wrap gap-2">
            {options.map((opt, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {opt}
              </span>
            ))}
          </div>
        );
      }

      case 'select_image_text': {
        const selections = Array.isArray(actualAnswer) ? actualAnswer : [actualAnswer];
        return (
          <div className="space-y-2">
            {selections.map((sel, idx) => (
              <div key={idx} className="text-sm">
                {content.items?.[idx] && (
                  <div className="flex items-center gap-2">
                    <img 
                      src={buildFullUrl(content.items[idx].image)} 
                      alt="" 
                      className="w-12 h-12 object-cover rounded"
                    />
                    <span className="font-medium">{sel}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      }

      case 'match_image_text': {
        const matches = Array.isArray(actualAnswer) ? actualAnswer : [];
        return (
          <div className="space-y-2">
            {matches.map((match, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm">
                <img 
                  src={buildFullUrl(match.image)} 
                  alt="" 
                  className="w-12 h-12 object-cover rounded"
                />
                <span>↔️</span>
                <span className="font-medium">{match.text}</span>
              </div>
            ))}
          </div>
        );
      }

      case 'order_words': {
        const words = Array.isArray(actualAnswer) ? actualAnswer : [];
        return (
          <div className="flex flex-wrap gap-2">
            {words.map((word, idx) => (
              <span key={idx} className="bg-gray-100 px-3 py-1 rounded text-sm">
                {idx + 1}. {word}
              </span>
            ))}
          </div>
        );
      }

      case 'compose_word': {
        const word = Array.isArray(actualAnswer) ? actualAnswer.join('') : actualAnswer;
        return <span className="font-bold text-lg">{word}</span>;
      }

      case 'break_word': {
        const letters = typeof actualAnswer === 'string' ? actualAnswer.split('') : (Array.isArray(actualAnswer) ? actualAnswer : []);
        return (
          <div className="flex gap-2">
            {letters.map((letter, idx) => (
              <span key={idx} className="bg-gray-100 px-3 py-2 rounded font-bold">
                {letter}
              </span>
            ))}
          </div>
        );
      }

      case 'free_text': {
        return <p className="text-gray-800 whitespace-pre-wrap">{actualAnswer}</p>;
      }

      case 'free_text_upload': {
        const imageUrl = typeof actualAnswer === 'string' ? actualAnswer : actualAnswer?.imageUrl || actualAnswer;
        // Image is in base64 format, no need for buildFullUrl
        return (
          <div>
            <img 
              src={typeof imageUrl === 'string' ? imageUrl : ''} 
              alt="إجابة الطالب" 
              className="max-w-md rounded-lg shadow-md"
            />
          </div>
        );
      }

      case 'write_words': {
        return <p className="text-gray-800 whitespace-pre-wrap">{actualAnswer}</p>;
      }

      case 'read_question': {
        return (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">تم إتمام القراءة بنجاح</span>
          </div>
        );
      }

      case 'listen_repeat': {
        const audioUrl = typeof actualAnswer === 'string' ? actualAnswer : actualAnswer?.audioUrl || actualAnswer;
        return (
          <div>
            <audio controls className="w-full max-w-md">
              <source src={typeof audioUrl === 'string' ? buildFullUrl(audioUrl) : ''} type="audio/mpeg" />
              المتصفح لا يدعم عنصر الصوت.
            </audio>
          </div>
        );
      }

      default:
        return <span className="text-gray-600">{JSON.stringify(actualAnswer)}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 space-y-4" dir="rtl">
      {/* Question Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-bold text-gray-800 text-lg mb-2">{content.text}</h4>
          {content.imageUrl && (
            <img 
              src={buildFullUrl(content.imageUrl)} 
              alt="صورة السؤال" 
              className="mt-2 max-w-sm rounded-lg"
            />
          )}
        </div>
        
        {/* Score Badge */}
        <div className="flex flex-col items-center gap-2">
          <div className={`px-4 py-2 rounded-full font-bold text-lg ${
            needsManualReview 
              ? 'bg-gray-100 text-gray-600'
              : isCorrect 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
          }`}>
            {points !== null ? `${points}/${maxPoints}` : `${maxPoints} نقطة`}
          </div>
          
          {!needsManualReview && (
            <div className="flex items-center gap-1">
              {isCorrect ? (
                <>
                  <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-700 font-medium text-sm">صحيح</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-700 font-medium text-sm">خطأ</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Student Answer */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h5 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          إجابتك:
        </h5>
        <div className="text-blue-800">
          {renderAnswer(studentAnswer, true)}
        </div>
      </div>

      {/* Correct Answer (if applicable) */}
      {!needsManualReview && correctAnswer !== null && !isCorrect && (
        <div className="bg-green-50 rounded-lg p-4">
          <h5 className="font-bold text-green-900 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            الإجابة الصحيحة:
          </h5>
          <div className="text-green-800">
            {renderAnswer(correctAnswer, false)}
          </div>
        </div>
      )}

      {/* Teacher Review Status */}
      {needsManualReview && (
        <div className={`${isReviewedByTeacher ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} border-2 rounded-lg p-4`}>
          <div className={`flex items-center gap-2 ${isReviewedByTeacher ? 'text-green-800' : 'text-yellow-800'}`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              {isReviewedByTeacher ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              )}
            </svg>
            <span className="font-medium">
              {isReviewedByTeacher ? 'تمت المراجعة من المعلم' : 'في انتظار مراجعة المعلم'}
            </span>
            {isReviewedByTeacher && points !== null && (
              <span className="mr-auto font-bold">{points} / {maxPoints}</span>
            )}
          </div>
        </div>
      )}

      {/* Teacher Notes */}
      {teacherNotes && (
        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
          <h5 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            ملاحظات المعلم:
          </h5>
          <p className="text-purple-800">{teacherNotes}</p>
        </div>
      )}
    </div>
  );
}

export default AnswerReview;

