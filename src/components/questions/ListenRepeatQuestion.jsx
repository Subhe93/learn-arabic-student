import React, { useState, useRef, useMemo } from 'react';
import play2Icon from '../../assets/icons/play2.svg'; 
import { studentService } from '../../services/studentService';
import { API_BASE_URL } from '../../config/api';

const AudioButton = ({ type, text, onClick, icon, disabled, isLoading }) => {
    const isRecord = type === 'record';
    
    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`
                relative flex items-center justify-center gap-3 px-6 py-3 rounded-[60px] w-full
                transition-all duration-200 h-full
                ${(disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
            `}
            style={{ 
                minHeight: '45px',
                border: '2px solid #8D8D8D',
                color: isRecord ? 'white' : '#4F67BD', 
                backgroundColor: isRecord ? '#4F67BD' : 'white',
                boxShadow: '0px 0px 11px 0px #00000029, -10px 5px 0px 0px #00000024 inset'
            }}
        >
            {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
                <>
                    {isRecord ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    ) : (
                        icon ? <img src={icon} alt="icon" className="w-6 h-6" /> :
                        <svg className="w-6 h-6 text-[#4F67BD]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                    )}
                </>
            )}
            <span className="text-lg font-bold">{text}</span>
        </button>
    );
};

const ListenRepeatQuestion = ({ 
  questionText, 
  content, 
  contentType = 'text', 
  value,
  onAnswerChange,
  isConfirmed = false
}) => {
  const [audioUrl, setAudioUrl] = useState(value || '');
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMyAudioPlaying, setIsMyAudioPlaying] = useState(false);
  
  const audioRef = useRef(null); // For the original audio
  const myAudioRef = useRef(null); // For the user's recorded audio
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  
    const buildFullUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http') || url.startsWith('blob:')) return url;
        const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
        if (cleanUrl.startsWith('uploads/')) {
            return `${API_BASE_URL}/${cleanUrl}`;
        }
        return `${API_BASE_URL}/uploads/${cleanUrl}`;
    };

    const fullMyAudioUrl = useMemo(() => buildFullUrl(audioUrl), [audioUrl]);

  // Update when value changes
  React.useEffect(() => {
    if (value !== undefined) {
      setAudioUrl(value);
    }
  }, [value]);

  // Cleanup audio on unmount
  React.useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (myAudioRef.current) {
        myAudioRef.current.pause();
        myAudioRef.current = null;
      }
    };
  }, []);

  // Play the original audio
  const handlePlayAudio = () => {
    if (!content || isConfirmed) return;
    
    if (myAudioRef.current && isMyAudioPlaying) {
        myAudioRef.current.pause();
        setIsMyAudioPlaying(false);
    }
    
    if (!audioRef.current) {
      audioRef.current = new Audio(content);
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    }
    
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
        alert('خطأ في تشغيل الملف الصوتي');
      });
      setIsPlaying(true);
    }
  };

  const handlePlayMyAudio = () => {
    if (!fullMyAudioUrl || isConfirmed) return;

    if (audioRef.current && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
    }

    if (!myAudioRef.current) {
        myAudioRef.current = new Audio(fullMyAudioUrl);
        myAudioRef.current.addEventListener('ended', () => setIsMyAudioPlaying(false));
    }

    if (isMyAudioPlaying) {
        myAudioRef.current.pause();
        myAudioRef.current.currentTime = 0;
        setIsMyAudioPlaying(false);
    } else {
        myAudioRef.current.play().catch(err => {
            console.error('Error playing my audio:', err);
            alert('خطأ في تشغيل التسجيل الخاص بك');
        });
        setIsMyAudioPlaying(true);
    }
  };

  const handleRecord = async () => {
    if (isConfirmed || isUploading) return;
    
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      setAudioUrl('');
      if (myAudioRef.current) {
          myAudioRef.current.pause();
          myAudioRef.current = null;
          setIsMyAudioPlaying(false);
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
          
          setIsUploading(true);
          try {
            const response = await studentService.uploadAudio(audioFile);
            const serverUrl = response.url;
            setAudioUrl(serverUrl);
            
            if (onAnswerChange) {
              onAnswerChange(serverUrl);
            }
          } catch (error) {
            console.error('Error uploading audio:', error);
            alert('فشل رفع التسجيل الصوتي');
          } finally {
            setIsUploading(false);
          }
          
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error accessing microphone:', err);
        alert('لا يمكن الوصول إلى الميكروفون. الرجاء التحقق من الأذونات.');
      }
    }
  };

  return (
    <div className="w-full mb-8" dir="rtl">
      {/* Question Text & Score */}
      <div className="flex items-center justify-between w-full mr-auto mb-6 relative">
        <div className="flex items-center gap-2">
           <h3 className="text-xl font-bold text-gray-800">{questionText}</h3>
        </div>
        <span 
            className="whitespace-nowrap w-[30%] sm:w-auto text-center sm:text-right inline-block"
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
         
         {/* Main Content */}
         <div className="mb-6 flex flex-col gap-4">
            {contentType === 'audio' && (
                <div className="w-full min-h-[60px] flex items-center justify-between px-2 bg-white rounded-[60px] border-2 border-[#CECECE] shadow-[0px_0px_11px_0px_#00000029,_-10px_5px_0px_0px_#00000024_inset] py-2">
                    <div className="flex-1 lg:mr-4 md:ml-[6rem] sm:mx-4 flex items-center gap-2" dir="ltr">
                        <div className="flex-1 flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#4F67BD] rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-600">ملف صوتي</span>
                        </div>
                    </div>
                     <div className="w-[144px] flex-shrink-0">
                        <AudioButton 
                            type="listen" 
                            text={isPlaying ? "إيقاف" : "تشغيل"} 
                            icon={play2Icon} 
                            onClick={handlePlayAudio}
                            disabled={!content || isConfirmed}
                        />
                    </div>
                </div>
            )}
         </div>

         {/* Recording Button */}
         <div className="w-full p-2 border-2 border-[#CECECE] rounded-[60px] bg-white shadow-[0px_0px_11px_0px_#00000029,_-10px_5px_0px_0px_#00000024_inset]">
            <AudioButton 
                type="record" 
                text={isUploading ? "جاري الرفع..." : isRecording ? "إيقاف التسجيل" : (audioUrl ? "إعادة التسجيل" : "تسجيل")} 
                onClick={handleRecord}
                disabled={isConfirmed}
                isLoading={isUploading}
            />
         </div>
         
         {/* Show recording status and play button */}
         {audioUrl && !isUploading && (
            <div className="mt-4 p-3 bg-green-50 border-2 border-green-500 rounded-lg flex items-center justify-center gap-4">
                <span className="text-green-700 font-bold">✓ تم التسجيل بنجاح</span>
                <button
                    onClick={handlePlayMyAudio}
                    className="flex items-center gap-2 text-sm text-green-800 font-semibold bg-green-200 hover:bg-green-300 px-3 py-1 rounded-full transition-colors"
                >
                    {isMyAudioPlaying ? (
                        <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 6a1 1 0 011-1h2a1 1 0 110 2H6a1 1 0 01-1-1zm4 0a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm5 0a1 1 0 00-1 1v2a1 1 0 102 0V7a1 1 0 00-1-1z"></path><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                            إيقاف
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path></svg>
                            تشغيل التسجيل
                        </>
                    )}
                </button>
            </div>
         )}
      </div>
    </div>
  );
};

export default ListenRepeatQuestion;
