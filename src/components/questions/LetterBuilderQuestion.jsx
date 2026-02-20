import React, { useState, useEffect } from 'react';
import OptionButton from './OptionButton';
import rightIcon from '../../assets/icons/right.svg';
import falseIcon from '../../assets/icons/false.svg';

const LetterBuilderQuestion = ({ 
  questionText, 
  initialLetters = [], 
  correctSentence = '', 
  onAnswerChange, 
  value,
  isConfirmed = false,
  showFeedback = false
}) => {
  const [availableLetters, setAvailableLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  
  const isWordCorrect = () => {
    if (!correctSentence || !selectedLetters || selectedLetters.length === 0) return null;
    const word = selectedLetters.map(l => l.text).join('');
    return word === correctSentence;
  };

  // Initialize from initialLetters and value
  useEffect(() => {
    if (!initialLetters || initialLetters.length === 0) {
      setAvailableLetters([]);
      setSelectedLetters([]);
      return;
    }

    if (value) {
      // Restore from saved answer
      // value can be a string (word) or array of letters
      if (typeof value === 'string' && value.length > 0) {
        // Convert string to array of letter objects
        const savedLetters = value.split('').map((char, idx) => {
          const letter = initialLetters.find(l => l.text === char);
          return letter || { id: `saved${idx}`, text: char };
        });
        setSelectedLetters(savedLetters);
        setAvailableLetters(initialLetters.filter(l => !value.includes(l.text)));
      } else if (Array.isArray(value) && value.length > 0) {
        // Array of letters
        const savedLetters = value.map((char, idx) => {
          const letter = initialLetters.find(l => l.text === char);
          return letter || { id: `saved${idx}`, text: char };
        });
        setSelectedLetters(savedLetters);
        setAvailableLetters(initialLetters.filter(l => !value.includes(l.text)));
      } else {
        setAvailableLetters(initialLetters);
        setSelectedLetters([]);
      }
    } else {
      setAvailableLetters(initialLetters);
      setSelectedLetters([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLetters]);

  const notifyAnswerChange = (newSelectedLetters) => {
    if (onAnswerChange) {
      const formedWord = newSelectedLetters.map(l => l.text).join('');
      onAnswerChange(formedWord);
    }
  };

  const handleLetterClick = (letter) => {
    if (isConfirmed) return; // Don't allow changes after confirmation
    
    // Move from available to selected
    setAvailableLetters(prev => prev.filter(l => l.id !== letter.id));
    setSelectedLetters(prev => {
      const newSelected = [...prev, letter];
      notifyAnswerChange(newSelected);
      return newSelected;
    });
  };

  const handleSelectedLetterClick = (letter) => {
    if (isConfirmed) return; // Don't allow changes after confirmation
    
    // Move from selected to available
    setSelectedLetters(prev => {
      const newSelected = prev.filter(l => l.id !== letter.id);
      notifyAnswerChange(newSelected);
      return newSelected;
    });
    setAvailableLetters(prev => [...prev, letter]);
  };

  return (
    <div className="w-full mb-8" dir="rtl">
      {/* Question Text & Score */}
      <div className="flex items-center justify-between w-full mr-auto mb-6 relative">
        <div className="flex items-center gap-2">
           <h3 className="text-xl font-bold text-gray-800">{questionText}</h3>
        </div>
        <span 
            className="whitespace-nowrap w-[30%] sm:w-auto text-center sm:text-right inline-block"
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

      {/* Source Area (Letters Pool) */}
      <div className="flex flex-wrap gap-4 justify-start mb-6" style={{ marginRight: 'auto' }}>
        {availableLetters.map((letter) => (
            <div 
              key={letter.id} 
              onClick={() => handleLetterClick(letter)} 
              className={`w-[calc(50%-0.5rem)] sm:w-auto ${isConfirmed ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
                <OptionButton 
                    label={letter.text} 
                    status="default" // White background for available letters
                />
            </div>
        ))}
      </div>

      {/* Answer Area (Target) */}
      <div 
        className="w-full min-h-[80px] border-2 rounded-[60px] flex items-center justify-start px-4 gap-4 mb-6 transition-colors bg-white shadow-[0px_4px_4px_0px_#00000040_inset]"
        style={{
            borderColor: showFeedback 
              ? (isWordCorrect() ? '#0B5736' : '#6C1C1C')
              : '#CECECE',
            backgroundColor: showFeedback
              ? (isWordCorrect() ? '#F0FDF4' : '#FEF2F2')
              : 'white'
        }}
      >
         {/* Placeholder if empty? */}
         {selectedLetters.length === 0 && (
            <span className="text-gray-300 mr-auto ml-4"></span> 
         )}

         {selectedLetters.map((letter) => {
           const letterStatus = showFeedback 
             ? (isWordCorrect() ? 'correct' : 'wrong')
             : 'blue';
           
           return (
            <OptionButton 
                key={letter.id} 
                label={letter.text} 
                status={letterStatus} 
                onClick={() => handleSelectedLetterClick(letter)}
            />
           );
         })}
      </div>

      {/* Feedback Message - Only show after confirmation */}
      {showFeedback && selectedLetters.length > 0 && (
        <div 
            className={`w-full p-3 rounded-[60px] mb-6 flex items-center justify-start border-2 transition-all duration-300`}
            style={{
                borderColor: isWordCorrect() ? '#49BD8C' : '#B92828', 
                backgroundColor: isWordCorrect() ? '#E8F8F1' : '#FBEAEA',
                color: isWordCorrect() ? '#0B5736' : '#B92828'
            }}
        >
            <span className="font-bold flex items-center gap-2">
                {isWordCorrect() ? (
                    <>
                        <img src={rightIcon} alt="Correct" className="w-6 h-6" />
                        رائع!! إجابتك صحيحة
                    </>
                ) : (
                    <>
                        <img src={falseIcon} alt="Wrong" className="w-6 h-6" />
                        خطأ في تركيب الكلمة. الكلمة الصحيحة: {correctSentence}
                    </>
                )}
            </span>
        </div>
      )}
    </div>
  );
};

export default LetterBuilderQuestion;
