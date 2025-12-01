import React, { useState } from 'react';
import sendIcon from '../../assets/icons/send.svg'; // Ensure this icon exists

const WritingQuestion = ({ questionText, placeholder }) => {
    const [text, setText] = useState('');

    const handleSubmit = () => {
        console.log('Submitted text:', text);
        // Handle submission logic here
    };

    return (
        <div className="w-full mb-12" dir="rtl">
            {/* Header Row: Score (Left) + Text (Right) */}
            <div className="flex items-center justify-between w-full mb-6">
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

            {/* Text Area */}
            <div className="w-full mb-6">
                <textarea
                    className="outline-none resize-none transition-colors focus:border-[#4F67BD]"
                    placeholder={placeholder}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{
                        width: '100%',
                        height: '257px',
                        maxWidth: '100%', // Ensure responsiveness
                        borderRadius: '18px',
                        border: '2px solid #CECECE',
                        paddingTop: '12px',
                        paddingRight: '20px',
                        paddingBottom: '12px',
                        paddingLeft: '30px',
                        // Re-reading prompt: "الايريا تيكست الموجودة باللعبة الخامسة هذه تنسيقاتها ... [list of props]". No shadow mentioned.
                        
                        // Text Styles
                        fontWeight: 500,
                        fontStyle: 'normal', // 'Medium' is usually 500 weight
                        fontSize: '16px',
                        lineHeight: '100%',
                        textAlign: 'right',
                        color: '#939393',
                    }}
                />
            </div>

            {/* Submit Button */}
            <div className="w-full flex justify-start"> {/* justify-start in RTL puts it on the Right */}
            <button
                    onClick={handleSubmit}
                    className="flex items-center justify-center gap-2 bg-[#4F67BD] text-white rounded-[60px] px-8 py-3 hover:bg-[#3e54a3] transition-colors shadow-md"
                    style={{
                         boxShadow: '0px 4px 4px 0px #00000040 inset',
                         minWidth: '180px'
                    }}
                >
                     <span className="font-bold text-lg">ارسل للتحقق</span>
                     <img src={sendIcon} alt="Send" className="w-5 h-5 brightness-0 invert transform " /> 
                </button>
            </div>
        </div>
    );
};

export default WritingQuestion;
