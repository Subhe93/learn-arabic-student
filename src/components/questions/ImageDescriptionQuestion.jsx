import React, { useState } from 'react';
import rightIcon from '../../assets/icons/right.svg';
import falseIcon from '../../assets/icons/false.svg';

const CustomDropdown = ({ options, selectedOptionId, onSelect, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find(opt => opt.id === selectedOptionId);

    return (
        <div className="relative w-full max-w-[338px]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full"
                style={{
                    height: '48px',
                    gap: '8px',
                    borderRadius: '60px',
                    borderWidth: '2px',
                    paddingTop: '12px',
                    paddingRight: '18px',
                    paddingBottom: '12px',
                    paddingLeft: '18px',
                    borderColor: isOpen ? '#4F67BD' : '#CECECE',
                    boxShadow: isOpen 
                        ? '0px 0px 11px 0px #4F67BD80, -7px 3px 0px 0px #0000000F inset' 
                        : '0px 0px 11px 0px #00000029, -7px 3px 0px 0px #0000000F inset',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                }}
            >
                {/* Text (Right) */}
                <span 
                    style={{
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '100%',
                        letterSpacing: '0%',
                        textAlign: 'right',
                        color: '#737373'
                    }}
                >
                    {selectedOption ? selectedOption.text : placeholder}
                </span>

                 {/* Arrow Icon (Left) */}
                 <svg 
                    className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-[20px] shadow-lg overflow-hidden z-50 border border-gray-100">
                    {options.map((option) => (
                        <div
                            key={option.id}
                            onClick={() => {
                                onSelect(option.id);
                                setIsOpen(false);
                            }}
                            className="px-6 py-3 hover:bg-gray-50 cursor-pointer text-right font-bold text-gray-700 border-b border-gray-100 last:border-0"
                        >
                            {option.text}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const ImageDescriptionQuestion = ({ 
  questionText, 
  imageSrc, 
  options, 
  correctAnswerId, 
  selectedOptionId = null,
  onOptionSelect,
  isConfirmed = false,
  showFeedback = false
}) => {
    const handleSelect = (id) => {
        if (isConfirmed) return; // Don't allow changes after confirmation
        if (onOptionSelect) {
            onOptionSelect(id);
        }
    };

    return (
        <div className="w-full mb-12" dir="rtl">
            {/* Header Row: Score (Left) + Text (Right) */}
            <div className="flex items-center justify-between w-full mb-6">
                {/* Empty div or spacer if needed, but justified between pushes items to edges */}
                 <h3 className="text-lg font-bold text-gray-800 text-right flex-1">{questionText}</h3>
                
                       <span
                           className="w-[30%] sm:w-auto text-center sm:text-right inline-block"
                           style={{
                               fontWeight: 600,
                               fontSize: '14px',
                               color: '#848484',
                               marginLeft: '10px'
                           }}
                       >
                           5 درجات
                       </span>
            </div>

            {/* Content Row: Dropdown (Left) + Image (Right) */}
            {/* In RTL: First item is Right, Second is Left. We want Image on Right, Dropdown on Left. */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-6">
                
                {/* Image Container (Right Side in RTL) */}
                <div className="flex-shrink-0">
                    <img 
                        src={imageSrc} 
                        alt="Question" 
                        className="w-[200px] h-auto rounded-lg object-contain"
                    />
                </div>

                {/* Dropdown Container (Left Side in RTL) */}
                <div className="flex-1 flex justify-center md:justify-end w-full md:w-auto">
                   {!showFeedback ? (
                     <CustomDropdown 
                          options={options}
                          selectedOptionId={selectedOptionId}
                          onSelect={handleSelect}
                          placeholder="اختر الاجابة الصحيحة"
                     />
                   ) : (
                     /* Show selected answer with color */
                     <div className={`w-full max-w-[338px] p-4 rounded-[60px] border-2 ${
                       selectedOptionId === correctAnswerId ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
                     }`}>
                       <p className={`text-center font-bold text-lg ${
                         selectedOptionId === correctAnswerId ? 'text-green-700' : 'text-red-700'
                       }`}>
                         {options.find(opt => opt.id === selectedOptionId)?.text || 'لم يتم الاختيار'}
                       </p>
                     </div>
                   )}
                </div>
            </div>
        </div>
    );
};

export default ImageDescriptionQuestion;
