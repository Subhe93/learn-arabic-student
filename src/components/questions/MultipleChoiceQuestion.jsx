import React from 'react';
import OptionButton from './OptionButton';

const MultipleChoiceQuestion = ({ questionText, options, selectedOptionId, onOptionSelect }) => {
  return (
    <div className="w-full mb-8" dir="rtl">
      {/* Question Text & Score */}
      <div className="flex items-center justify-between w-full mr-auto mb-6 relative">
        
        {/* Right Side: Question Text Only (No Icon) */}
        <div className="flex items-center gap-2">
           <h3 className="text-xl font-bold text-gray-800">{questionText}</h3>
        </div>

        {/* Left Side: Score */}
        <span 
            style={{
                fontFamily: '"IBM Plex Sans Arabic", sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '100%',
                color: '#848484',
                textAlign: 'left'
            }}
         >
            5 درجات
         </span>
      </div>

      {/* Options Grid */}
      <div 
        className="flex flex-wrap items-center justify-start gap-3" 
        style={{
            marginRight: 'auto'
        }}
      >
        {options.map((option) => (
          <OptionButton
            key={option.id}
            label={option.label}
            status={
                selectedOptionId === option.id 
                    ? (option.isCorrect ? 'correct' : 'wrong') 
                    : 'default'
            }
            onClick={() => onOptionSelect(option.id)}
            withIcon={true} // Enable icon for MultipleChoiceQuestion only (Exercise 1)
          />
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;
