import React from 'react';
import play2Icon from '../../assets/icons/play2.svg'; 

const AudioButton = ({ type, text, onClick, icon }) => {
    // type: 'listen' (default) or 'record' (blue)
    const isRecord = type === 'record';
    
    return (
        <button
            onClick={onClick}
            className={`
                relative flex items-center justify-center gap-3 px-6 py-3 rounded-[60px] w-full
                transition-all duration-200 h-full
                bg-white hover:bg-gray-50
            `}
            style={{ 
                minHeight: '45px',
                border: '2px solid #8D8D8D',
                color: isRecord ? 'white' : '#4F67BD', 
                backgroundColor: isRecord ? '#4F67BD' : 'white',
                boxShadow: '0px 0px 11px 0px #00000029, -10px 5px 0px 0px #00000024 inset'
            }}
        >
            {/* Icon based on type */}
            {isRecord ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
            ) : (
                // Use the passed icon or default
                icon ? <img src={icon} alt="icon" className="w-6 h-6" /> :
                <svg className="w-6 h-6 text-[#4F67BD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
            )}
            <span className="text-lg font-bold">{text}</span>
        </button>
    );
};

const ListenRepeatQuestion = ({ questionText, content, contentType = 'text' }) => {
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

      {/* Content Box */}
      <div className="w-full">
         
         {/* Main Content (Text or Image or Audio Player Placeholder) */}
         <div className="mb-6 flex flex-col gap-4">
            {contentType === 'text' && (
                <div className="w-full flex items-center justify-between gap-4">
                    {/* Text Display */}
                    <div className="flex-1 min-h-[55px] flex items-center justify-between py-2 px-2 bg-white rounded-[60px] border-2 border-[#CECECE] shadow-[0px_0px_11px_0px_#00000029,_-10px_5px_0px_0px_#00000024_inset]">
                        <p className="text-right text-gray-700 font-bold text-lg mr-4">{content}</p>
                        
                        <div className="w-[144px] flex-shrink-0">
                            {/* Removed icon={play2Icon} to revert to default SVG icon */}
                            <AudioButton type="listen" text="استمع" onClick={() => {}} />
                        </div>
                    </div>
                </div>
            )}

            {contentType === 'audio' && (
                <div className="w-full min-h-[60px] flex items-center justify-between px-2 bg-white rounded-[60px] border-2 border-[#CECECE] shadow-[0px_0px_11px_0px_#00000029,_-10px_5px_0px_0px_#00000024_inset] py-2">
                    
                    {/* Fake Progress Bar */}
                    <div className="flex-1 lg:mr-4 md:ml-[6rem] sm:mx-4 flex items-center gap-2" dir="ltr">
                        <span className="text-xs text-gray-400 font-medium">1:13</span>
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full relative">
                            <div className="absolute left-0 h-full w-2/3 bg-[#4F67BD] rounded-full"></div>
                            <div className="absolute left-[66%] top-1/2 transform -translate-y-1/2 w-3 h-3 bg-[#4F67BD] rounded-full shadow"></div>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">1:13</span>
                    </div>
                     {/* Play Button */}
                     <div className="w-[144px] flex-shrink-0">
                        <AudioButton type="listen" text="تشغيل" icon={play2Icon} onClick={() => {}} />
                    </div>
                </div>
            )}

            {contentType === 'image' && (
                <div className="flex flex-col items-center gap-4 w-full border-2 border-[#CECECE] rounded-[60px] p-4 shadow-[0px_0px_11px_0px_#00000029,_-10px_5px_0px_0px_#00000024_inset] bg-white">
                    <img src={content} alt="Question Content" className="max-w-md h-auto object-contain" />
                    <div className="w-[144px]">
                        <AudioButton type="listen" text="تشغيل" icon={play2Icon} onClick={() => {}} />
                    </div>
                </div>
            )}
         </div>

         {/* Recording Button */}
         <div className="w-full p-2 border-2 border-[#CECECE] rounded-[60px] bg-white shadow-[0px_0px_11px_0px_#00000029,_-10px_5px_0px_0px_#00000024_inset]">
            <AudioButton type="record" text="تسجيل" onClick={() => {}} />
         </div>

      </div>
    </div>
  );
};

export default ListenRepeatQuestion;
