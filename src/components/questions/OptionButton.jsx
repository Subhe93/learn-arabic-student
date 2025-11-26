import React from 'react';
import rightIcon from '../../assets/icons/right.svg';

const OptionButton = ({ label, status = 'default', onClick, withIcon = false, customStyles = {} }) => {
  // Base styles
  const baseStyles = {
    width: '144px', 
    height: withIcon ? '45px' : '48px', 
    borderRadius: '60px',
    borderWidth: '2px',
    paddingTop: '12px',
    paddingRight: '11px',
    paddingBottom: '12px',
    paddingLeft: '11px',
    gap: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: withIcon ? 'space-between' : 'center', 
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '16px',
    fontWeight: 'bold',
  };

  // State styles
  const stateStyles = {
    default: {
      backgroundColor: 'white',
      color: '#374151', 
      borderColor: '#363636', 
      boxShadow: '0px 0px 11px 0px #00000029, -10px 5px 0px 0px #00000024 inset',
    },
    blue: {
      backgroundColor: '#4F67BD',
      color: 'white',
      borderColor: '#15157F', 
      boxShadow: '0px 0px 11px 0px #4F67BD80, -10px 5px 0px 0px #00000024 inset',
    },
    correct: {
      backgroundColor: '#49BD8C',
      color: 'white',
      borderColor: '#0B5736',
      boxShadow: '0px 0px 16px 0px #49BD8C85, -10px 5px 0px 0px #00000024 inset',
    },
    wrong: {
      backgroundColor: '#B92828',
      color: 'white',
      borderColor: '#6C1C1C',
      boxShadow: '0px 0px 11px 0px #B9282880, -10px 5px 0px 0px #00000024 inset',
    },
  };

  // Merge logic:
  // 1. Base styles
  // 2. Status styles
  // 3. Custom styles (override everything)
  // If customStyles has 'color', it should override status color unless status is strict (like correct/wrong usually white)
  // But user asked to set text color to #4F67BD specifically for FillBlankQuestion.
  // We'll let customStyles override stateStyles.
  
  const currentStyle = { ...baseStyles, ...stateStyles[status], ...customStyles };
  
  // Special case: If status is correct/wrong/blue, usually text is white.
  // If customStyles.color is passed, it will override.
  // User said "اجعل اللون للنص بالزر بصفحة FillBlankQuestion فقط لونه #4F67BD"
  // Assuming this is for the DEFAULT state, or ALL states? 
  // Usually selected/correct/wrong buttons have white text.
  // If user means the default text color should be blueish, we apply it.
  // If user means ALL states, we apply it.
  // Let's assume for 'default' state mainly, but customStyles overrides all.
  // We should be careful if correct/wrong needs to be white.
  // However, CSS cascading in JS object: last one wins.
  
  return (
    <div style={currentStyle} onClick={onClick} className="select-none" dir="rtl">
      {withIcon && (
          <div 
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0`}
            style={{
                borderColor: status === 'default' ? '#000000' : 'white'
            }}
          >
             <img 
                src={rightIcon} 
                alt="Check" 
                className="w-3.5 h-3.5"
                style={{ 
                    opacity: status === 'default' ? 0 : 1,
                    filter: 'brightness(0) invert(1)' 
                }} 
             />
          </div>
      )}
      
      {/* Text Label */}
      <span className={`flex-grow text-center ${withIcon ? '' : ''}`}>{label}</span>
    </div>
  );
};

export default OptionButton;
