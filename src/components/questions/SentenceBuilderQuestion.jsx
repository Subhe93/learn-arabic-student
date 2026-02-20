import React, { useState, useEffect, useRef } from 'react';
import OptionButton from './OptionButton';
import rightIcon from '../../assets/icons/right.svg';
import falseIcon from '../../assets/icons/false.svg';

const SentenceBuilderQuestion = ({ 
  questionText, 
  initialWords, 
  onAnswerChange, 
  value,
  isConfirmed = false,
  showFeedback = false,
  correctOrder = null
}) => {
  const [availableWords, setAvailableWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [feedback, setFeedback] = useState(null); // null, 'correct', 'wrong'
  const isInternalUpdate = useRef(false);
  
  // Check if the current order is correct
  const isOrderCorrect = () => {
    if (!correctOrder || !selectedWords || selectedWords.length === 0) return null;
    if (selectedWords.length !== correctOrder.length) return false;
    return selectedWords.every((word, idx) => word.text === correctOrder[idx]);
  };

  // Initialize from initialWords only (to avoid infinite loops)
  useEffect(() => {
    if (!initialWords || initialWords.length === 0) {
      setAvailableWords([]);
      setSelectedWords([]);
      return;
    }

    // Initialize with value if provided, otherwise start fresh
    if (value && Array.isArray(value) && value.length > 0) {
      // Restore selected words from saved answer
      const savedWords = value.map((wordText, idx) => {
        const word = initialWords.find(w => w.text === wordText);
        return word || { id: `saved${idx}`, text: wordText };
      });
      setSelectedWords(savedWords);
      setAvailableWords(initialWords.filter(w => !value.includes(w.text)));
    } else {
      setAvailableWords(initialWords);
      setSelectedWords([]);
    }
    setFeedback(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialWords]);

  const handleWordClick = (word) => {
    if (isConfirmed) return; // Don't allow changes after confirmation
    
    // Move from available to selected
    setAvailableWords(prev => prev.filter(w => w.id !== word.id));
    const newSelected = [...selectedWords, word];
    setSelectedWords(newSelected);
    setFeedback(null);
    
    // Notify parent after state update
    if (onAnswerChange) {
      const orderedWords = newSelected.map(w => w.text);
      onAnswerChange(orderedWords);
    }
  };

  const handleSelectedWordClick = (word) => {
    if (isConfirmed) return; // Don't allow changes after confirmation
    
    // Move from selected to available
    const newSelected = selectedWords.filter(w => w.id !== word.id);
    setSelectedWords(newSelected);
    setAvailableWords(prev => [...prev, word]);
    setFeedback(null);
    
    // Notify parent after state update
    if (onAnswerChange) {
      const orderedWords = newSelected.map(w => w.text);
      onAnswerChange(orderedWords);
    }
  };

  // Check answer logic - removed hardcoded check
  // Feedback will be handled by the parent component or API response
  // useEffect(() => {
  //   if (selectedWords.length === initialWords.length) {
  //     // All words are selected, could check answer here if needed
  //   }
  // }, [selectedWords, initialWords]);

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

      {/* Source Area (Words Pool) - Positioned ABOVE the Answer Area */}
      <div className="flex flex-wrap gap-4 justify-start mb-4" style={{ marginRight: 'auto' }}>
        {availableWords.map((word) => (
            <div 
              key={word.id} 
              onClick={() => handleWordClick(word)}
              className={isConfirmed ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            >
                <OptionButton 
                    label={word.text} 
                    status="blue"
                />
            </div>
        ))}
      </div>

      {/* Answer Area (Target) */}
      <div 
        className="w-full min-h-[80px] border-2 rounded-[60px] flex items-center justify-start px-4 gap-4 mb-6 transition-colors"
        style={{
            borderColor: showFeedback 
              ? (isOrderCorrect() ? '#0B5736' : '#6C1C1C')
              : '#CECECE',
            backgroundColor: showFeedback 
              ? (isOrderCorrect() ? '#F0FDF4' : '#FEF2F2')
              : 'white', 
            boxShadow: '0px 4px 4px 0px #00000040 inset'
        }}
      >
         {selectedWords.map((word, idx) => {
           // Check if this word is in the correct position
           const isWordCorrect = showFeedback && correctOrder && word.text === correctOrder[idx];
           const isWordWrong = showFeedback && correctOrder && word.text !== correctOrder[idx];
           
           return (
            <OptionButton 
                key={word.id} 
                label={word.text} 
                status={isWordCorrect ? 'correct' : isWordWrong ? 'wrong' : 'default'}
                onClick={() => handleSelectedWordClick(word)}
            />
           );
         })}
         
         {/* Placeholder text if empty */}
         {selectedWords.length === 0 && (
            <span className="text-gray-400 mr-4">اضغط على الكلمات لترتيبها هنا</span>
         )}
      </div>
    </div>
  );
};

export default SentenceBuilderQuestion;
