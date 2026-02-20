import React, { useState, useEffect, useRef } from 'react';

function BreakWordQuestion({ 
  questionText, 
  word, 
  correctLetters, 
  value, 
  onAnswerChange,
  isConfirmed,
  showFeedback 
}) {
  const [letters, setLetters] = useState([]);
  const inputRefs = useRef([]);
  const isInitialized = useRef(false);
  const prevValueRef = useRef(null);

  // Generate random keyboard with 10 letters including correct ones
  const generateKeyboard = React.useMemo(() => {
    if (!correctLetters || correctLetters.length === 0) return [];
    
    const keyboard = [...correctLetters]; // Start with correct letters
    
    // Add random Arabic letters to reach 10 total
    const arabicLetters = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
    const usedLetters = new Set(correctLetters);
    
    while (keyboard.length < 10) {
      const randomIndex = Math.floor(Math.random() * arabicLetters.length);
      const randomLetter = arabicLetters[randomIndex];
      
      if (!usedLetters.has(randomLetter)) {
        keyboard.push(randomLetter);
        usedLetters.add(randomLetter);
      }
    }
    
    // Shuffle the keyboard
    for (let i = keyboard.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [keyboard[i], keyboard[j]] = [keyboard[j], keyboard[i]];
    }
    
    return keyboard;
  }, [correctLetters]);

  // Initialize letters array from value or empty (only once or when value changes externally)
  useEffect(() => {
    // Check if value changed externally (not from our own updates)
    const valueChanged = JSON.stringify(value) !== JSON.stringify(prevValueRef.current);
    
    if (!isInitialized.current || valueChanged) {
      if (value && Array.isArray(value) && value.length > 0) {
        setLetters(value);
        prevValueRef.current = value;
      } else if (correctLetters && correctLetters.length > 0) {
        const emptyLetters = new Array(correctLetters.length).fill('');
        setLetters(emptyLetters);
        prevValueRef.current = emptyLetters;
      } else if (word && word.length > 0) {
        // Fallback: use word length if correctLetters not provided
        const emptyLetters = new Array(word.length).fill('');
        setLetters(emptyLetters);
        prevValueRef.current = emptyLetters;
      }
      isInitialized.current = true;
    }
  }, [correctLetters, word]); // Removed 'value' from dependencies to avoid loop

  // Sync with external value changes (when coming from parent)
  useEffect(() => {
    if (value && Array.isArray(value) && JSON.stringify(value) !== JSON.stringify(letters)) {
      const valueStr = JSON.stringify(value);
      const lettersStr = JSON.stringify(letters);
      // Only update if value is different and not empty
      if (valueStr !== lettersStr && value.length > 0) {
        setLetters(value);
        prevValueRef.current = value;
      }
    }
  }, [value]);

  // Update parent when letters change (but avoid if value is already the same)
  useEffect(() => {
    if (letters.length > 0 && onAnswerChange) {
      const lettersStr = JSON.stringify(letters);
      const prevValueStr = JSON.stringify(prevValueRef.current);
      
      // Only call onAnswerChange if letters actually changed
      if (lettersStr !== prevValueStr) {
        onAnswerChange(letters);
        prevValueRef.current = letters;
      }
    }
  }, [letters]); // Removed onAnswerChange from dependencies

  // Handle letter click from keyboard
  const handleLetterClick = (letter) => {
    if (isConfirmed) return;
    
    // Find first empty slot
    const emptyIndex = letters.findIndex(l => !l || l === '');
    
    if (emptyIndex !== -1) {
      const newLetters = [...letters];
      newLetters[emptyIndex] = letter;
      setLetters(newLetters);
    }
  };

  // Handle remove letter (click on filled box)
  const handleRemoveLetter = (index) => {
    if (isConfirmed) return;
    
    const newLetters = [...letters];
    newLetters[index] = '';
    setLetters(newLetters);
  };

  const getLetterStatus = (index) => {
    if (!showFeedback || !correctLetters) return null;
    
    const userLetter = letters[index];
    const correctLetter = correctLetters[index];
    
    if (!userLetter) return null;
    
    return userLetter === correctLetter ? 'correct' : 'wrong';
  };

  return (
    <div className="w-full">
      {/* Question Text */}
      <div className="mb-6">
        <p className="text-lg font-bold text-gray-800 mb-2">{questionText}</p>
        {word && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
            <p className="text-center text-2xl font-bold text-blue-900">{word}</p>
          </div>
        )}
      </div>

      {/* Letter Input Boxes */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6" dir="rtl">
        {letters.map((letter, index) => {
          const status = getLetterStatus(index);
          
          let borderColor = 'border-gray-300';
          let bgColor = 'bg-white';
          
          if (isConfirmed && showFeedback) {
            if (status === 'correct') {
              borderColor = 'border-green-500 bg-green-50';
              bgColor = 'bg-green-50';
            } else if (status === 'wrong') {
              borderColor = 'border-red-500 bg-red-50';
              bgColor = 'bg-red-50';
            }
          }

          return (
            <div key={index} className="relative">
              <div
                onClick={() => handleRemoveLetter(index)}
                className={`
                  w-16 h-16 flex items-center justify-center text-2xl font-bold rounded-xl
                  border-2 ${borderColor} ${bgColor}
                  transition-all duration-200
                  ${isConfirmed ? 'cursor-default' : letter ? 'cursor-pointer hover:bg-gray-100' : 'cursor-default'}
                `}
                style={{ direction: 'rtl' }}
              >
                {letter || ''}
              </div>
              
              {/* Feedback Icons */}
              {isConfirmed && showFeedback && status && (
                <div className="absolute -top-2 -right-2 z-10">
                  {status === 'correct' ? (
                    <div className="bg-green-500 text-white rounded-full p-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="bg-red-500 text-white rounded-full p-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              )}
              
              {/* Letter Number Label */}
              <div className="text-center mt-1">
                <span className="text-xs text-gray-500">{index + 1}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Keyboard */}
      {!isConfirmed && generateKeyboard.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-bold text-gray-700 mb-3 text-center">اختر الحروف:</p>
          <div className="flex flex-wrap items-center justify-center gap-3" dir="rtl">
            {generateKeyboard.map((letter, index) => {
              // Check if letter is used
              const isUsed = letters.includes(letter);
              const usedCount = letters.filter(l => l === letter).length;
              const availableInKeyboard = generateKeyboard.filter(l => l === letter).length;
              const isDisabled = isUsed && usedCount >= availableInKeyboard;
              
              return (
                <button
                  key={index}
                  onClick={() => !isDisabled && handleLetterClick(letter)}
                  disabled={isDisabled || isConfirmed}
                  className={`
                    w-14 h-14 flex items-center justify-center text-2xl font-bold rounded-xl
                    border-2 transition-all duration-200
                    ${isDisabled 
                      ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'border-blue-400 bg-blue-50 text-blue-900 hover:bg-blue-100 hover:scale-105 active:scale-95 cursor-pointer'
                    }
                    shadow-sm
                  `}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Correct Answer Display */}
      {isConfirmed && showFeedback && correctLetters && (
        <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-xl p-4">
          <p className="text-sm font-bold text-green-800 mb-2">الإجابة الصحيحة:</p>
          <div className="flex flex-wrap items-center justify-center gap-3" dir="rtl">
            {correctLetters.map((letter, index) => (
              <div key={index} className="w-16 h-16 flex items-center justify-center bg-white border-2 border-green-500 rounded-xl text-2xl font-bold text-green-700">
                {letter}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      {!isConfirmed && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            انقر على الحرف من الكيبورد لإضافته، وانقر على المربع لإزالة الحرف
          </p>
        </div>
      )}
    </div>
  );
}

export default BreakWordQuestion;
