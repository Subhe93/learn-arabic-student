import React, { useState } from 'react';
import penIcon from '../../assets/icons/pen-line.svg';

const ReadingWritingQuestion = ({ 
  questionText, 
  readingText, 
  placeholder, 
  value, 
  onAnswerChange,
  isConfirmed = false
}) => {
    const [text, setText] = useState(value || '');

    // Update local state when value prop changes
    React.useEffect(() => {
        if (value !== undefined) {
            setText(value);
        }
    }, [value]);

    const handleTextChange = (e) => {
        const newText = e.target.value;
        setText(newText);
        if (onAnswerChange) {
            onAnswerChange(newText);
        }
    };

    return (
        <div className="w-full mb-12" dir="rtl">
            {/* Question Text & Score */}
            <div className="flex items-center justify-between w-full mb-6">
                 <h3 className="text-xl font-bold text-gray-800 text-right flex-1">{questionText}</h3>
                
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

            {/* Reading Text Box */}
            <div className="w-full mb-8 bg-[#F5F5F5] rounded-[20px] p-6 border border-[#E5E5E5]">
                <div 
                    className="text-right leading-relaxed"
                    style={{
                        fontWeight: 600, 
                        fontSize: '16px',
                        lineHeight: '1.8',
                        color: '#000000'
                    }}
                >
                    <span dangerouslySetInnerHTML={{ __html: readingText }} />
                </div>
            </div>

            {/* Writing Text Area */}
            <div className="w-full">
                <textarea
                    className="outline-none resize-none transition-colors focus:border-[#4F67BD]"
                    placeholder={placeholder}
                    value={text}
                    onChange={handleTextChange}
                    disabled={isConfirmed}
                    style={{
                        width: '100%',
                        height: '257px',
                        maxWidth: '100%',
                        borderRadius: '18px',
                        border: '2px solid #CECECE',
                        paddingTop: '12px',
                        paddingRight: '20px',
                        paddingBottom: '12px',
                        paddingLeft: '30px',
                        fontWeight: 500,
                        fontStyle: 'normal',
                        fontSize: '16px',
                        lineHeight: '100%',
                        textAlign: 'right',
                        color: '#939393',
                    }}
                />
            </div>
        </div>
    );
};

export default ReadingWritingQuestion;
