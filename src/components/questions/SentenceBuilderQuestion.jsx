import React, { useState, useEffect } from 'react';
import OptionButton from './OptionButton';
import rightIcon from '../../assets/icons/right.svg';
import falseIcon from '../../assets/icons/false.svg';

const SentenceBuilderQuestion = ({ questionText, initialWords }) => {
  const [availableWords, setAvailableWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [feedback, setFeedback] = useState(null); // null, 'correct', 'wrong'

  // Reset state when initialWords change
  useEffect(() => {
    setAvailableWords(initialWords);
    setSelectedWords([]);
    setFeedback(null);
  }, [initialWords]);

  const handleWordClick = (word) => {
    // Move from available to selected
    setAvailableWords(prev => prev.filter(w => w.id !== word.id));
    setSelectedWords(prev => [...prev, word]);
    setFeedback(null);
  };

  const handleSelectedWordClick = (word) => {
    // Move from selected to available
    setSelectedWords(prev => prev.filter(w => w.id !== word.id));
    setAvailableWords(prev => [...prev, word]);
    setFeedback(null);
  };

  // Check answer logic
  useEffect(() => {
    if (selectedWords.length === 3) {
      const sentence = selectedWords.map(w => w.text).join(' ');
      
      if (sentence === "الفأر يحب الجبن") {
        setFeedback('correct');
      } else {
        setFeedback('wrong');
      }
    } else {
      setFeedback(null);
    }
  }, [selectedWords]);

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

      {/* Source Area (Words Pool) - Positioned ABOVE the Answer Area */}
      <div className="flex flex-wrap gap-4 justify-start mb-4" style={{ marginRight: 'auto' }}>
        {availableWords.map((word) => (
            <div key={word.id} onClick={() => handleWordClick(word)}>
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
            borderColor: feedback === 'correct' ? '#0B5736' : feedback === 'wrong' ? '#6C1C1C' : '#CECECE',
            backgroundColor: feedback === 'correct' ? '#F0FDF4' : feedback === 'wrong' ? '#FEF2F2' : 'white', 
            boxShadow: '0px 4px 4px 0px #00000040 inset'
        }}
      >
         {selectedWords.map((word) => (
            <OptionButton 
                key={word.id} 
                label={word.text} 
                status={feedback === 'correct' ? 'correct' : feedback === 'wrong' ? 'wrong' : 'default'}
                onClick={() => handleSelectedWordClick(word)}
            />
         ))}
         
         {/* Placeholder text if empty */}
         {selectedWords.length === 0 && (
            <span className="text-gray-400 mr-4">اضغط على الكلمات لترتيبها هنا</span>
         )}
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div 
            className={`w-full p-4 rounded-[60px] mb-6 flex items-center justify-start border-2`}
            style={{
                borderColor: feedback === 'correct' ? '#0B5736' : '#6C1C1C', // Matching button border colors
                backgroundColor: feedback === 'correct' ? '#D1FAE5' : '#FEE2E2',
                color: feedback === 'correct' ? '#065F46' : '#991B1B'
            }}
        >
            <span className="font-bold flex items-center gap-2">
                {feedback === 'correct' ? (
                    <>
                        <img src={rightIcon} alt="Correct" className="w-6 h-6" />
                        رائع!! اجابة صحيحة
                    </>
                ) : (
                    <>
                        <img src={falseIcon} alt="Wrong" className="w-6 h-6" />
                        خطأ في تركيب الجملة
                    </>
                )}
            </span>
        </div>
      )}
    </div>
  );
};

export default SentenceBuilderQuestion;
