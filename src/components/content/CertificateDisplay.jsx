import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import certificateImg from '../../assets/images/image 12.png';
import crownIcon from '../../assets/icons/crown.svg';

const CertificateDisplay = ({ levelId, levelName }) => {
    const [certificates, setCertificates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentCertificate, setCurrentCertificate] = useState(null);

    useEffect(() => {
        loadCertificates();
    }, []);

    const loadCertificates = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await studentService.getCertificates();
            
            const certs = Array.isArray(response) 
                ? response 
                : Array.isArray(response?.data) 
                  ? response.data 
                  : response?.data?.certificates || [];
            
            setCertificates(certs);
            
            // If levelId is provided, find certificate for that level
            if (levelId) {
                const cert = certs.find(c => c.levelId === parseInt(levelId) || c.level?.id === parseInt(levelId));
                if (cert) {
                    setCurrentCertificate(cert);
                } else if (certs.length > 0) {
                    setCurrentCertificate(certs[0]);
                }
            } else if (certs.length > 0) {
                setCurrentCertificate(certs[0]);
            }
        } catch (err) {
            console.error('Error loading certificates:', err);
            setError(err.message || 'فشل تحميل الشهادات');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (currentCertificate?.pdfUrl || currentCertificate?.certificateUrl) {
            const url = currentCertificate.pdfUrl || currentCertificate.certificateUrl;
            let fullUrl;
            if (url.startsWith('http')) {
                fullUrl = url;
            } else {
                // Remove leading slash if exists to avoid double slashes
                const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
                // Ensure /uploads is included after domain
                if (cleanUrl.startsWith('uploads/')) {
                    fullUrl = `https://learnarabic.iwings-digital.com/${cleanUrl}`;
                } else {
                    fullUrl = `https://learnarabic.iwings-digital.com/uploads/${cleanUrl}`;
                }
            }
            window.open(fullUrl, '_blank');
        } else {
            alert('رابط التحميل غير متاح حالياً');
        }
    };

    if (isLoading) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-12" dir="rtl">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F67BD] mb-4"></div>
                <p className="text-gray-600">جاري تحميل الشهادات...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-12" dir="rtl">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={loadCertificates}
                    className="bg-[#4F67BD] text-white font-bold py-2 px-6 rounded-full hover:bg-[#3e539a] transition-colors"
                >
                    إعادة المحاولة
                </button>
            </div>
        );
    }

    if (certificates.length === 0) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-12" dir="rtl">
                <p className="text-gray-600 text-lg">لا توجد شهادات متاحة حالياً</p>
            </div>
        );
    }

    const displayLevelName = currentCertificate?.level?.name || levelName || currentCertificate?.levelName || 'المستوى';

    return (
        <div className="w-full flex flex-col items-center justify-start py-12">
            {/* Crown Icon */}
            <img src={crownIcon} alt="Crown" className="w-16 h-16 mb-4" />

            {/* Success Text */}
            <h2 
                className="mb-8 text-[40px] md:text-[46px]"
                style={{
                    fontWeight: 600,
                    lineHeight: '100%',
                    textAlign: 'center',
                    color: '#49BD8C',
                    paddingLeft: '5px',
                    paddingRight: '5px',
                }}
            >
                لقد انجزت {displayLevelName} بنجاح
            </h2>

            {/* Certificate Image */}
            <div className="w-full max-w-3xl mb-8 flex justify-center">
                <img 
                    src={currentCertificate?.imageUrl ? 
                        (currentCertificate.imageUrl.startsWith('http') ? 
                            currentCertificate.imageUrl : 
                            (() => {
                                const url = currentCertificate.imageUrl;
                                const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
                                if (cleanUrl.startsWith('uploads/')) {
                                    return `https://learnarabic.iwings-digital.com/${cleanUrl}`;
                                }
                                return `https://learnarabic.iwings-digital.com/uploads/${cleanUrl}`;
                            })()) 
                        : certificateImg} 
                    alt="Certificate" 
                    className="w-full h-auto object-contain rounded-lg"
                    style={{ padding: '0px 10px', maxHeight: '500px' }}
                    onError={(e) => {
                        e.target.src = certificateImg;
                    }}
                />
            </div>

            {/* Certificate Selector if multiple certificates */}
            {certificates.length > 1 && (
                <div className="mb-6 flex flex-wrap gap-2 justify-center">
                    {certificates.map((cert) => (
                        <button
                            key={cert.id}
                            onClick={() => setCurrentCertificate(cert)}
                            className={`px-4 py-2 rounded-full font-bold transition-colors ${
                                currentCertificate?.id === cert.id
                                    ? 'bg-[#4F67BD] text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {cert.level?.name || cert.levelName || `الشهادة ${cert.id}`}
                        </button>
                    ))}
                </div>
            )}

            {/* Download Button */}
            <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-[10px] text-white transition-opacity hover:opacity-90 w-[322px] md:w-[521px]"
                style={{
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
