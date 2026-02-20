import React, { useState } from 'react';
import OptionButton from './OptionButton';
import rightIcon from '../../assets/icons/right.svg';
import falseIcon from '../../assets/icons/false.svg';

const FillBlankQuestion = ({ 
  questionText, 
  options, 
  correctAnswerId,
  selectedOptionId = null,
  onOptionSelect,
  isConfirmed = false,
  showFeedback = false
}) => {
  const handleOptionSelect = (id) => {
    if (isConfirmed) return; // Don't allow changes after confirmation
    if (onOptionSelect) {
      onOptionSelect(id);
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
            className="w-[30%] sm:w-auto text-center sm:text-right inline-block"
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
            const isSelected = selectedOptionId === option.id;
            const isCorrectOption = option.id === correctAnswerId;
            
            let status = 'default';
            if (!showFeedback) {
              // Before confirmation: show blue if selected
              status = isSelected ? 'blue' : 'default';
            } else {
              // After confirmation: show correct/wrong colors
              if (isSelected) {
                status = isCorrectOption ? 'correct' : 'wrong';
              } else if (isCorrectOption) {
                // Show correct answer even if not selected
                status = 'correct';
              }
            }

            // Apply custom styles dynamically based on status
            const customStyles = {
                width: '260px',
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
    </div>
  );
};

export default FillBlankQuestion;
