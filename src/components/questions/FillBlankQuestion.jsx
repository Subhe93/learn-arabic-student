import React, { useState } from 'react';
import OptionButton from './OptionButton';
import rightIcon from '../../assets/icons/right.svg';
import falseIcon from '../../assets/icons/false.svg';

const FillBlankQuestion = ({ questionText, options, correctAnswerId }) => {
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [feedback, setFeedback] = useState(null); // null, 'correct', 'wrong'

  const handleOptionSelect = (id) => {
    setSelectedOptionId(id);
    if (id === correctAnswerId) {
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }
  };

  return (
    <div className="w-full mb-8" dir="rtl">
      {/* Question Text & Score */}
      <div className="flex items-center justify-between w-full mr-auto mb-6 relative">
        <div className="flex items-center gap-2">
           <h3 className="text-xl font-bold text-gray-800">{questionText}</h3>
        </div>
        <span 
            style={{
                fontFamily: '"IBM Plex Sans Arabic", sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                color: '#848484',
            }}
         >
            5 درجات
         </span>
      </div>

      {/* Options */}
      <div className="flex flex-wrap justify-start gap-4 mb-6" style={{ marginRight: 'auto' }}>
        {options.map((option) => {
            const status = selectedOptionId === option.id 
                ? (feedback === 'correct' ? 'correct' : 'wrong') 
                : 'default';

            // Apply custom styles dynamically based on status
            const customStyles = {
                width: '260px',
                // Only apply custom blue color if status is default
                // If status is correct/wrong, let OptionButton's default style (white) take over
                color: status === 'default' ? '#4F67BD' : 'white'
            };

            return (
                <OptionButton 
                    key={option.id}
                    label={option.label}
                    status={status}
                    onClick={() => handleOptionSelect(option.id)}
                    customStyles={customStyles}
                />
            );
        })}
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div 
            className={`w-full p-3 rounded-[60px] mb-6 flex items-center justify-start border-2 transition-all duration-300`}
            style={{
                borderColor: feedback === 'correct' ? '#49BD8C' : '#B92828', 
                backgroundColor: feedback === 'correct' ? '#E8F8F1' : '#FBEAEA', // Very light green/red
                color: feedback === 'correct' ? '#0B5736' : '#B92828'
            }}
        >
            <span className="font-bold flex items-center gap-2">
                {feedback === 'correct' ? (
                    <>
                        <img src={rightIcon} alt="Correct" className="w-6 h-6" />
                        جميل !! اجابة صحية
                    </>
                ) : (
                    <>
                        <img src={falseIcon} alt="Wrong" className="w-6 h-6" />
                        اجابة خطأئة!! حاول مرة اخرى
                    </>
                )}
            </span>
        </div>
      )}
    </div>
  );
};

export default FillBlankQuestion;
