import React from 'react';
import rightIcon from '../../assets/icons/right.svg';
import rightWhiteIcon from '../../assets/icons/rightwhite.svg';

const OptionButton = ({ label, status = 'default', onClick, withIcon = false, customStyles = {} }) => {
  // Base styles
  const baseStyles = {
    width: withIcon ? '155px' : '144px', 
    height: withIcon ? '55px' : '48px', 
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
      // If withIcon is true (Exercise 1), use #CECECE border. Otherwise use #363636.
      borderColor: withIcon ? '#CECECE' : '#363636', 
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

  const currentStyle = { ...baseStyles, ...stateStyles[status], ...customStyles };
  
  // Logic to determine which icon to show
  const iconSrc = status === 'default' ? rightIcon : rightWhiteIcon;

  return (
    <div style={currentStyle} onClick={onClick} className="select-none" dir="rtl">
      {withIcon && (
          <div 
            className={`w-6 h-6 rounded-full  flex items-center justify-center flex-shrink-0`}
            
          >
             <img 
                src={iconSrc} 
                alt="Check" 
                className="w-full h-full"
                style={{ 
                    opacity: 1,
                    filter: 'none'
                }} 
             />
          </div>
      )}
      
      <span className={`flex-grow  ${withIcon ? 'text-right' : 'text-center'}`}>{label}</span>
    </div>
  );
};

export default OptionButton;
