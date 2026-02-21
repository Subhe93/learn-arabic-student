import React, { useState, useRef, useMemo } from 'react';
import { studentService } from '../../services/studentService';
import { API_BASE_URL } from '../../config/api';

const ImageUploadQuestion = ({ 
  questionText, 
  placeholder, 
  value, 
  onAnswerChange,
  isConfirmed = false
}) => {
    const [imageUrl, setImageUrl] = useState(value || '');
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Update local state when value prop changes
    React.useEffect(() => {
        if (value !== undefined) {
            setImageUrl(value);
        }
    }, [value]);

    const buildFullUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http') || url.startsWith('blob:')) return url;
        const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
        if (cleanUrl.startsWith('uploads/')) {
            return `${API_BASE_URL}/${cleanUrl}`;
        }
        return `${API_BASE_URL}/uploads/${cleanUrl}`;
    };

    const fullImageUrl = useMemo(() => buildFullUrl(imageUrl), [imageUrl]);

    const handleImageUpload = async (file) => {
        if (!file || isConfirmed) return;

        if (!file.type.startsWith('image/')) {
            alert('يرجى رفع صورة فقط');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت');
            return;
        }

        setIsUploading(true);
        try {
            const response = await studentService.uploadImage(file);
            const serverUrl = response.url;
            setImageUrl(serverUrl);
            if (onAnswerChange) {
                onAnswerChange(serverUrl);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('فشل رفع الصورة');
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        handleImageUpload(file);
    };

    const handleDragEnter = (e) => {
        if (isConfirmed) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        if (isConfirmed) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        if (isConfirmed) return;
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        if (isConfirmed) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleImageUpload(files[0]);
        }
    };

    const handleButtonClick = () => {
        if (isConfirmed) return; // Don't allow changes after confirmation
        fileInputRef.current?.click();
    };

    const handleRemoveImage = () => {
        if (isConfirmed) return; // Don't allow changes after confirmation
        setImageUrl('');
        if (onAnswerChange) {
            onAnswerChange('');
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full mb-12" dir="rtl">
            {/* Header Row: Question Text & Score */}
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

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isConfirmed}
            />

            {/* Upload Area */}
            {!imageUrl ? (
                <div
                    className={`w-full transition-all duration-300 ${
                        isDragging 
                            ? 'border-[#4F67BD] bg-blue-50' 
                            : 'border-[#CECECE] bg-white hover:border-[#4F67BD]'
                    }`}
                    style={{
                        minHeight: '300px',
                        borderRadius: '18px',
                        border: '2px dashed',
                        boxShadow: isDragging ? '0px 0px 20px 0px rgba(79, 103, 189, 0.2)' : 'none',
                        cursor: isConfirmed ? 'not-allowed' : 'pointer',
                    }}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleButtonClick}
                >
                    <div className="flex flex-col items-center justify-center h-full py-12 px-4">
                        {isUploading ? (
                            <>
                                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#4F67BD] mb-4"></div>
                                <p className="text-gray-600 font-medium">جاري رفع الصورة...</p>
                            </>
                        ) : (
                            <>
                                {/* Upload Icon */}
                                <div className="w-20 h-20 rounded-full bg-[#4F67BD] bg-opacity-10 flex items-center justify-center mb-4">
                                    <svg 
                                        className="w-10 h-10 text-[#4F67BD]" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                                        />
                                    </svg>
                                </div>

                                {/* Main Text */}
                                <h4 className="text-xl font-bold text-gray-800 mb-2">
                                    {isDragging ? 'أفلت الصورة هنا' : 'اسحب وأفلت الصورة هنا'}
                                </h4>
                                
                                <p className="text-gray-500 mb-6">أو</p>

                                {/* Upload Button */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleButtonClick();
                                    }}
                                    disabled={isConfirmed}
                                    className="flex items-center justify-center gap-3 bg-[#4F67BD] text-white rounded-[60px] px-8 py-3 hover:bg-[#3e54a3] transition-all transform hover:scale-105 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    style={{
                                        boxShadow: '0px 4px 4px 0px #00000040 inset',
                                        minWidth: '200px'
                                    }}
                                >
                                    <svg 
                                        className="w-5 h-5" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                                        />
                                    </svg>
                                    <span className="font-bold text-lg">اختر صورة</span>
                                </button>

                                {/* Helper Text */}
                                <p className="text-gray-400 text-sm mt-6 text-center">
                                    {placeholder || 'PNG, JPG, GIF - الحد الأقصى 5 ميجابايت'}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                /* Image Preview */
                <div 
                    className="w-full bg-white rounded-[18px] border-2 border-[#CECECE] p-4 transition-all"
                    style={{
                        boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    {/* Preview Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="font-bold text-gray-800">تم رفع الصورة بنجاح</span>
                        </div>
                        
                        {!isConfirmed && (
                            <button
                                onClick={handleRemoveImage}
                                className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                                title="حذف الصورة"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Image Display */}
                    <div className="flex justify-center">
                        <img 
                            src={fullImageUrl} 
                            alt="الصورة المرفوعة" 
                            className="max-w-full max-h-96 rounded-lg shadow-md object-contain"
                        />
                    </div>

                    {/* Change Image Button */}
                    {!isConfirmed && (
                        <div className="mt-4 flex justify-center">
                            <button
                                onClick={handleButtonClick}
                                className="flex items-center gap-2 text-[#4F67BD] hover:text-[#3e54a3] font-bold transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>تغيير الصورة</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImageUploadQuestion;

