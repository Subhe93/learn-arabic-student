import React from 'react';
import videoImg from '../../assets/images/video.png';

const VideoPlayer = ({ videoUrl }) => {
    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-[20px] overflow-hidden shadow-lg border border-gray-200 relative group">
            {/* Video Player */}
            <div className="relative w-full aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                {videoUrl ? (
                    <video 
                        src={videoUrl} 
                        controls 
                        className="w-full h-full object-contain"
                    >
                        متصفحك لا يدعم تشغيل الفيديو.
                    </video>
                ) : (
                    <img src={videoImg} alt="Video Thumbnail" className="w-full h-full object-cover" />
                )}
            </div>

            {/* Video Controls Bar */}
            <div className="bg-white px-6 py-4 flex items-center gap-6 border-t border-gray-100" dir="ltr">
                
                {/* Left: Play & Volume */}
                <div className="flex items-center gap-4">
                    <button className="text-gray-700 hover:text-black transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </button>
                    <button className="text-gray-700 hover:text-black transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                    </button>
                </div>

                {/* Center: Progress Bar */}
                <div className="flex-1 mx-4 relative h-1.5 bg-gray-200 rounded-full cursor-pointer group-hover:h-2 transition-all flex items-center">
                    <div className="absolute left-0 h-full w-[30%] bg-[#2E5C5B] rounded-full"></div> 
                    <div className="absolute left-[30%] top-1/2 transform -translate-y-1/2 w-4 h-4 bg-[#2E5C5B] rounded-full shadow cursor-pointer"></div>
                </div>

                {/* Right: Time, Settings, Fullscreen */}
                <div className="flex items-center gap-4 text-gray-500 text-sm font-medium">
                    <span>7:24</span>
                    <button className="text-gray-700 hover:text-black transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                    <button className="text-gray-700 hover:text-black transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default VideoPlayer;
