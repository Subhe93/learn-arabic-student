import React from 'react';
import certificateImg from '../../assets/images/image 12.png';
import crownIcon from '../../assets/icons/crown.svg';

const CertificateDisplay = () => {
    return (
        <div className="w-full flex flex-col items-center justify-start py-12">
            {/* Crown Icon */}
            <img src={crownIcon} alt="Crown" className="w-16 h-16 mb-4" />

            {/* Success Text */}
            <h2 
                className="mb-8"
                style={{
                    fontWeight: 600,
                    fontSize: '46px',
                    lineHeight: '100%',
                    textAlign: 'center',
                    color: '#49BD8C'
                }}
            >
                لقد انجزت المستوى الاولى بنجاح
            </h2>

            {/* Certificate Image */}
            <div className="w-full max-w-3xl mb-8 flex justify-center">
                <img 
                    src={certificateImg} 
                    alt="Certificate" 
                    className="w-full h-auto object-contain rounded-lg"
                    style={{ maxHeight: '500px' }} 
                />
            </div>

            {/* Download Button */}
            <button
                className="flex items-center justify-center gap-[10px] text-white transition-opacity hover:opacity-90"
                style={{
                    width: '521px',
                    height: '53px',
                    borderRadius: '60px',
                    padding: '12px 30px',
                    backgroundColor: '#4F67BD',
                    boxShadow: '-3px -5px 4px 0px #FFFFFF40 inset',
                    fontSize: '18px',
                    fontWeight: 'bold'
                }}
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                تحميل الشهادة PDF
            </button>
        </div>
    );
};

export default CertificateDisplay;
