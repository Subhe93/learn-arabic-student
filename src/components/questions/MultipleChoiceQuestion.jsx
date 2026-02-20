import React from 'react';
import OptionButton from './OptionButton';

const MultipleChoiceQuestion = ({ 
  questionText, 
  options, 
  selectedOptionId, 
  onOptionSelect,
  isConfirmed = false,
  showFeedback = false,
  allowMultiple = false 
}) => {
  // Determine status for each option
  const getOptionStatus = (option) => {
    const isSelected = Array.isArray(selectedOptionId) 
      ? selectedOptionId.includes(option.id) 
      : selectedOptionId === option.id;
    
    // Before confirmation: show blue if selected, default otherwise
    if (!isConfirmed || !showFeedback) {
      return isSelected ? 'blue' : 'default';
    }
    
    // After confirmation with feedback: show correct/wrong colors
    if (isSelected) {
      return option.isCorrect ? 'correct' : 'wrong';
    }
    
    // If not selected but correct, show it (only after confirmation with feedback)
    if (showFeedback && option.isCorrect) {
      return 'correct';
    }
    
    return 'default';
  };
  
  // Handle option click
  const handleOptionClick = (optionId) => {
    if (isConfirmed) return; // Don't allow changes after confirmation
    
    if (allowMultiple) {
      // Multiple selection mode: toggle
      const currentSelections = Array.isArray(selectedOptionId) ? selectedOptionId : [];
      if (currentSelections.includes(optionId)) {
        // Remove if already selected
        onOptionSelect(currentSelections.filter(id => id !== optionId));
      } else {
        // Add if not selected
        onOptionSelect([...currentSelections, optionId]);
      }
    } else {
      // Single selection mode
      onOptionSelect(optionId);
    }
  };

  return (
    <div className="w-full mb-8" dir="rtl">
      {/* Question Text & Score */}
      <div className="flex items-center justify-between w-full mr-auto mb-6 relative">
        
        {/* Right Side: Question Text Only (No Icon) */}
        <div className="flex items-center gap-2 flex-1">
           <h3 className="text-xl font-bold text-gray-800">{questionText}</h3>
        </div>

        {/* Left Side: Score */}
        <span 
            className="w-[30%] sm:w-auto text-center sm:text-left inline-block"
            style={{
                fontFamily: '"IBM Plex Sans Arabic", sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '100%',
                color: '#848484',
            }}
         >
            5 درجات
         </span>
      </div>
      
      {/* Multiple Selection Hint */}
      {allowMultiple && !isConfirmed && (
        <div className="mb-4 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">يمكنك اختيار أكثر من إجابة صحيحة</span>
        </div>
      )}

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
            status={getOptionStatus(option)}
            onClick={() => handleOptionClick(option.id)}
            withIcon={true} // Enable icon for MultipleChoiceQuestion only (Exercise 1)
          />
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;
