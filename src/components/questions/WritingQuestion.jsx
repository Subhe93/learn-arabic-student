import React, { useState } from 'react';

const WritingQuestion = ({ 
  questionText, 
  placeholder, 
  value, 
  onAnswerChange, 
  allowImageUpload,
  isConfirmed = false
}) => {
    const [text, setText] = useState(value || '');
    const [imageUrl, setImageUrl] = useState('');

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

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // In production, you would upload the file and get the URL
            // For now, we'll use a placeholder
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageDataUrl = reader.result;
                setImageUrl(imageDataUrl);
                if (onAnswerChange) {
                    onAnswerChange(imageDataUrl);
                }
            };
            reader.readAsDataURL(file);
        }
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

            {/* Image Upload (if allowed) */}
            {allowImageUpload && (
                <div className="w-full mb-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id={`image-upload-${questionText}`}
                    />
                    <label
                        htmlFor={`image-upload-${questionText}`}
                        className="inline-block bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer transition-colors"
                    >
                        {imageUrl ? 'تم رفع الصورة' : 'رفع صورة'}
                    </label>
                    {imageUrl && (
                        <img src={imageUrl} alt="Uploaded" className="mt-2 max-w-xs rounded-lg" />
                    )}
                </div>
            )}

            {/* Text Area */}
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
                        maxWidth: '100%', // Ensure responsiveness
                        borderRadius: '18px',
                        border: '2px solid #CECECE',
                        paddingTop: '12px',
                        paddingRight: '20px',
                        paddingBottom: '12px',
                        paddingLeft: '30px',
                        
                        // Text Styles
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

export default WritingQuestion;
