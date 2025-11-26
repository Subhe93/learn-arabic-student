import React from 'react';
import penIcon from '../../assets/icons/pen-line.svg';
import OptionButton from './OptionButton';

const CopyWordsQuestion = ({ questionText, words }) => {
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

            {/* Words to Copy */}
            <div className="flex flex-wrap justify-start gap-4 mb-6">
                {words.map((word, index) => (
                    <div key={index} className="min-w-[120px]">
                        <OptionButton
                            label={word}
                            status="default"
                        // Using default style for display, customized slightly via inline style if needed or just relying on OptionButton
                        />
                    </div>
                ))}
            </div>

            {/* Upload Section */}
            <div className="w-full flex items-center justify-between px-2 py-2 bg-white rounded-[60px] border-2 border-[#CECECE] shadow-[0px_0px_11px_0px_#00000029,_-10px_5px_0px_0px_#00000024_inset] relative">

                {/* File Info (Placeholder) */}
                <div className="flex items-center gap-4 flex-1 justify-start px-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex flex-col items-end">
                        <span className="text-green-500 text-xs flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            تم رفع الصورة بنجاح
                        </span>
                        <span className="font-bold text-gray-800">8549t8545.png</span>
                    </div>
                </div>

                {/* Upload Button */}
                <button
                    className="bg-[#4F67BD] text-white px-6 py-3 rounded-[60px] flex items-center gap-2 shadow-[0px_4px_4px_0px_#00000040_inset] h-[55px] border-2 border-[#4F67BD]"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="font-bold">اضغط هنا لرفع الصورة</span>

                </button>
            </div>
        </div>
    );
};

export default CopyWordsQuestion;

