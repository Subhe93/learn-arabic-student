import React, { useState } from 'react';
import penIcon from '../../assets/icons/pen-line.svg';
import sendIcon from '../../assets/icons/send.svg';

const ReadingWritingQuestion = ({ questionText, readingText, placeholder }) => {
    const [text, setText] = useState('');

    const handleSubmit = () => {
        console.log('Submitted text:', text);
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
                    {/* Use dangerouslySetInnerHTML or simple map if readingText contains <br> string, 
                        but better to use a prop that accepts JSX or split by newlines. 
                        User asked to add <br> in the text. 
                        If I put <br> in the string prop in parent, it will show as text unless I parse it.
                        Instead, I will assume the prop might contain newlines and use pre-wrap, 
                        OR I will parse the <br> tags.
                    */}
                    <span dangerouslySetInnerHTML={{ __html: readingText }} />
                </div>
            </div>

            {/* Writing Text Area */}
            <div className="w-full mb-6">
                <textarea
                    className="outline-none resize-none transition-colors focus:border-[#4F67BD]"
                    placeholder={placeholder}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
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

            {/* Submit Button */}
            <div className="w-full flex justify-start"> 
                <button
                    onClick={handleSubmit}
                    className="flex items-center justify-center gap-2 bg-[#4F67BD] text-white rounded-[60px] px-8 py-3 hover:bg-[#3e54a3] transition-colors shadow-md"
                    style={{
                         boxShadow: '0px 4px 4px 0px #00000040 inset',
                         minWidth: '180px'
                    }}
                >
                     <span className="font-bold text-lg">ارسل للتحقق</span>
                     <img src={sendIcon} alt="Send" className="w-5 h-5 brightness-0 invert" /> 
                </button>
            </div>
        </div>
    );
};

export default ReadingWritingQuestion;
