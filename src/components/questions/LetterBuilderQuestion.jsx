import React, { useState, useEffect } from 'react';
import OptionButton from './OptionButton';
import rightIcon from '../../assets/icons/right.svg';
import falseIcon from '../../assets/icons/false.svg';

const LetterBuilderQuestion = ({ questionText, initialLetters, correctSentence }) => {
  const [availableLetters, setAvailableLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [feedback, setFeedback] = useState(null); // null, 'correct', 'wrong'

  // Reset state when initialLetters change
  useEffect(() => {
    setAvailableLetters(initialLetters);
    setSelectedLetters([]);
    setFeedback(null);
  }, [initialLetters]);

  const handleLetterClick = (letter) => {
    // Move from available to selected
    setAvailableLetters(prev => prev.filter(l => l.id !== letter.id));
    setSelectedLetters(prev => [...prev, letter]);
    setFeedback(null);
  };

  const handleSelectedLetterClick = (letter) => {
    // Move from selected to available
    setSelectedLetters(prev => prev.filter(l => l.id !== letter.id));
    setAvailableLetters(prev => [...prev, letter]);
    setFeedback(null);
  };

  // Check answer logic (Simple check when all letters are used or specific length reached)
  useEffect(() => {
    if (selectedLetters.length === initialLetters.length) {
      const formedWord = selectedLetters.map(l => l.text).join('');
        
        // Actual logic:
        if (formedWord === correctSentence.replace(/\s/g, '')) {
           setFeedback('correct');
        } else {
           setFeedback('wrong');
        }
    } else {
      setFeedback(null);
    }
  }, [selectedLetters, initialLetters.length, correctSentence]);

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
            <div key={letter.id} onClick={() => handleLetterClick(letter)} className="w-[calc(50%-0.5rem)] sm:w-auto">
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
            borderColor: '#CECECE', // Always gray border for the container itself in image? 
            // Actually in the image, the container seems white/gray always. The feedback is below.
        }}
      >
         {/* Placeholder if empty? */}
         {selectedLetters.length === 0 && (
            <span className="text-gray-300 mr-auto ml-4"></span> 
         )}

         {selectedLetters.map((letter) => (
            <OptionButton 
                key={letter.id} 
                label={letter.text} 
                status={feedback === 'correct' ? 'correct' : feedback === 'wrong' ? 'wrong' : 'blue'} 
                onClick={() => handleSelectedLetterClick(letter)}
            />
         ))}
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
                        رائع!! الجملة هي {correctSentence}
                    </>
                ) : (
                    <>
                        <img src={falseIcon} alt="Wrong" className="w-6 h-6" />
                        خطاء في تركيب الجملة
                    </>
                )}
            </span>
        </div>
      )}
    </div>
  );
};

export default LetterBuilderQuestion;
