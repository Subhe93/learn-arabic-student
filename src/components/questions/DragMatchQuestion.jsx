import React, { useState, useRef, useEffect } from 'react';
import penIcon from '../../assets/icons/pen-line.svg';

// Text Card - ثابت على اليمين
const TextCard = ({ text, isCorrect = null, isSelected = false, isHoverable = false, onClick, isConfirmed = false }) => {
  // Extract text value if it's an object
  const textValue = typeof text === 'string' ? text : (text?.text || text?.content || '');
  
  return (
    <div 
      className={`bg-white rounded-[12px] overflow-hidden w-full shadow-sm border-2 ${
        isCorrect === true ? 'border-green-500 ring-2 ring-green-300' : 
        isCorrect === false ? 'border-red-500 ring-2 ring-red-300' : 
        isSelected ? 'border-[#4F67BD] ring-2 ring-[#4F67BD]' :
        'border-[#5f5b5c]'
      } transition-all duration-200 ${isHoverable && !isConfirmed ? 'cursor-pointer hover:border-[#4F67BD] hover:ring-1 hover:ring-[#4F67BD]' : ''}`}
      onClick={onClick}
    >
      <div className="w-full py-4 px-4 text-center bg-white min-h-[80px] flex items-center justify-center">
        <span 
          className="font-bold text-[16px] text-[#000000]"
          style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}
        >
          {textValue}
        </span>
      </div>
    </div>
  );
};

// Image Card - قابل للنقر من اليسار
const ImageCard = ({ item, index, isSelected = false, isCorrect = null, onClick, isConfirmed = false, isHoverable = false }) => {
  return (
    <div 
      className={`flex items-center justify-center relative ${
        !isConfirmed && isCorrect === null ? 'cursor-pointer' : 'cursor-default'
      } w-[110px] md:w-full md:max-w-[200px]`}
      onClick={onClick}
      data-image-index={index}
    >
      <div 
        className={`bg-white rounded-[12px] overflow-hidden w-full shadow-sm 
          ${item.content ? 'sm:scale-100 scale-[0.95]' : ''}
          ${isSelected ? 'border-4 border-[#4F67BD] ring-2 ring-[#4F67BD] scale-105' : ''}
          ${isHoverable ? 'hover:border-[#4F67BD] hover:ring-1 hover:ring-[#4F67BD]' : ''}
          ${isCorrect === true ? 'border-4 border-green-500 ring-2 ring-green-300' : 
            isCorrect === false ? 'border-4 border-red-500 ring-2 ring-red-300' : 
            'border-2 border-[#5f5b5c]'}
          transition-all duration-200`}
      >
        <div className="w-full h-[100px] flex items-center justify-center p-2 md:p-4 bg-white">
          {item.content ? (
            <img 
              src={item.content} 
              alt="Match Item" 
              className="max-w-full max-h-full object-contain pointer-events-none" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-sm">انقر لاختيار الصورة</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Dynamic Arrow Component using SVG with animation
const DynamicArrow = ({ fromElement, toElement, isVisible, containerElement, index }) => {
  const [pathData, setPathData] = useState('');
  const [pathLength, setPathLength] = useState(0);
  const [arrowAngle, setArrowAngle] = useState(0);
  const arrowRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    if (!isVisible || !fromElement || !toElement || !containerElement) {
      setPathData('');
      setPathLength(0);
      return;
    }

    const updateArrow = () => {
      try {
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();
        const containerRect = containerElement.getBoundingClientRect();

        if (!containerRect) return;

        // Calculate points relative to container
        // السهم يبدأ من الإطار المحيط بالنص (الحافة اليسرى) وينتهي عند الإطار المحيط بالصورة (الحافة اليمنى)
        // في RTL: النص على اليمين، الصورة على اليسار
        // من الحافة اليسرى للنص إلى الحافة اليمنى للصورة
        const fromX = fromRect.left - containerRect.left; // الحافة اليسرى للنص
        const fromY = fromRect.top + fromRect.height / 2 - containerRect.top; // مركز النص عمودياً
        const toX = toRect.left + toRect.width - containerRect.left; // الحافة اليمنى للصورة
        const toY = toRect.top + toRect.height / 2 - containerRect.top; // مركز الصورة عمودياً

        // Create curved path (bezier curve) - منحني أكثر
        const controlPoint1X = fromX + (toX - fromX) * 0.4;
        const controlPoint1Y = fromY;
        const controlPoint2X = toX - (toX - fromX) * 0.4;
        const controlPoint2Y = toY;

        // Create path - من النص إلى الصورة
        const path = `M ${fromX} ${fromY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${toX} ${toY}`;

        setPathData(path);
        
        // Calculate path length and angle for animation
        // نستخدم setTimeout لضمان أن path تم إنشاؤه في DOM أولاً
        setTimeout(() => {
          if (pathRef.current) {
            const length = pathRef.current.getTotalLength();
            setPathLength(length);
            
            // حساب الزاوية في نهاية المسار لرأس السهم
            if (length > 0) {
              const endPoint = pathRef.current.getPointAtLength(length);
              const beforeEndPoint = pathRef.current.getPointAtLength(Math.max(0, length - 1));
              const angle = Math.atan2(endPoint.y - beforeEndPoint.y, endPoint.x - beforeEndPoint.x) * (180 / Math.PI);
              setArrowAngle(angle);
            }
          }
        }, 0);
      } catch (error) {
        console.error('Error calculating arrow path:', error);
      }
    };

    // Use requestAnimationFrame for smoother updates
    const rafId = requestAnimationFrame(updateArrow);
    
    // Update on resize
    window.addEventListener('resize', updateArrow);
    window.addEventListener('scroll', updateArrow, true);
    
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateArrow);
      window.removeEventListener('scroll', updateArrow, true);
    };
  }, [isVisible, fromElement, toElement, containerElement]);

  // Update path length and angle when path changes
  useEffect(() => {
    if (pathRef.current && pathData) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
      
      // حساب الزاوية في نهاية المسار
      if (length > 0) {
        const endPoint = pathRef.current.getPointAtLength(length);
        const beforeEndPoint = pathRef.current.getPointAtLength(Math.max(0, length - 1));
        const angle = Math.atan2(endPoint.y - beforeEndPoint.y, endPoint.x - beforeEndPoint.x) * (180 / Math.PI);
        setArrowAngle(angle);
      }
    }
  }, [pathData]);

  if (!isVisible || !pathData) return null;

  return (
    <svg
      ref={arrowRef}
      className="absolute inset-0 pointer-events-none z-20"
      style={{ overflow: 'visible', width: '100%', height: '100%' }}
    >
      <defs>
        <marker
          id={`arrowhead-red-${index || 'default'}`}
          markerWidth="7"
          markerHeight="7"
          refX="6.5"
          refY="3.5"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <polygon
            points="0 0, 7 3.5, 0 7"
            fill="#EF4444"
          />
        </marker>
      </defs>
      <path
        ref={pathRef}
        d={pathData}
        stroke="#EF4444"
        strokeWidth="3"
        fill="none"
        markerEnd={`url(#arrowhead-red-${index || 'default'})`}
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength}
        className="arrow-draw"
        style={{
          animation: 'drawArrow 0.6s ease-out forwards'
        }}
      />
      <style>{`
        @keyframes drawArrow {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </svg>
  );
};

const MatchRow = ({ 
  textItem, 
  imageItem, 
  index,  // textIndex
  imageIndex,  // index of the image being displayed
  isLast, 
  selectedTextIndex,  // تغيير من selectedImageIndex
  matchedImageIndex,  // imageIndex matched to this text
  onImageClick,
  onTextClick,
  isCorrect = null,
  isConfirmed = false,
  allImageRefs = {},  // refs لجميع الصور للربط بين الصفوف
  textRefs = {}  // refs لجميع النصوص
}) => {
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const containerRef = useRef(null);
  
  // Ensure imageItem has required properties
  const safeImageItem = imageItem || { id: `l${imageIndex}`, type: 'image', content: null };
  
  // Ensure textItem is a string
  const safeTextItem = typeof textItem === 'string' ? textItem : (textItem?.text || textItem?.content || '');

  const isTextSelected = selectedTextIndex === index;
  const isImageHoverable = selectedTextIndex !== null && !isConfirmed;
  const isTextMatched = matchedImageIndex !== null;
  
  // حفظ refs
  useEffect(() => {
    if (imageRef.current) {
      allImageRefs[imageIndex] = imageRef.current;
    }
    if (textRef.current) {
      textRefs[index] = textRef.current;
    }
  }, [imageIndex, index]);

  return (
    <div 
      className="flex flex-col w-full md:max-w-4xl mx-auto relative" 
      ref={containerRef}
    >
      <div className="flex items-center justify-center gap-14 sm:gap-8 md:gap-14 lg:gap-40 xl:gap-48 w-full mb-8 px-4 lg:px-16" dir="rtl">
        {/* Right Side - Text (ثابت) */}
        <div 
          className="relative w-[100px] md:w-full md:max-w-[200px] flex-shrink-0"
          ref={textRef}
          data-text-index={index}
        >
          <TextCard 
            text={safeTextItem} 
            isCorrect={isCorrect}
            isSelected={isTextSelected || isTextMatched}
            isHoverable={!isConfirmed}
            onClick={() => onTextClick(index)}
            isConfirmed={isConfirmed}
          />
        </div>


        {/* Left Side - Image (قابل للنقر) */}
        <div 
          className="relative w-[100px] md:w-full md:max-w-[200px] flex-shrink-0"
          ref={imageRef}
        >
          <ImageCard 
            item={safeImageItem} 
            index={imageIndex}
            isSelected={false}
            isHoverable={isImageHoverable}
            isCorrect={isCorrect}
            onClick={() => onImageClick(imageIndex)}
            isConfirmed={isConfirmed}
          />
        </div>
      </div>

      {/* Separator Line */}
      {!isLast && (
        <div 
          className="mx-auto my-4 bg-[#CECECE]"
          style={{
            width: '100%', 
            maxWidth: '722px',
            height: '1px',
            opacity: 1,
          }}
        ></div>
      )}
    </div>
  );
};

const DragMatchQuestion = ({ 
  rightItems,  // النصوص (ثابتة)
  leftItems,   // الصور المطابقة (قابلة للنقر)
  onUpdateLeftItems, 
  onUpdateRightItems,
  isConfirmed = false,
  showFeedback = false,
  correctPairs = []
}) => {
  const [selectedTextIndex, setSelectedTextIndex] = useState(null); // تغيير من selectedImageIndex
  const [matches, setMatches] = useState({}); // { textIndex: imageIndex } - يبدأ فارغاً
  const [displayLeftItems, setDisplayLeftItems] = useState(() => {
    // تهيئة أولية - نسخة عميقة من leftItems
    if (leftItems && leftItems.length > 0) {
      return leftItems.map(item => ({ ...item }));
    }
    return [];
  });
  const imageRefs = useRef({}); // لتخزين refs لجميع الصور
  const isInitialized = useRef(false);
  
  // تهيئة displayLeftItems عند تحميل leftItems لأول مرة فقط
  useEffect(() => {
    if (!isInitialized.current && leftItems && leftItems.length > 0) {
      setDisplayLeftItems(leftItems.map(item => ({ ...item })));
      isInitialized.current = true;
    }
  }, [leftItems]);
  
  // لا نعرض الأسهم بشكل افتراضي - فقط عندما يقوم الطالب بإنشاء match

  // Update parent when matches change - إرسال البيانات مع المحافظة على UX
  useEffect(() => {
    if (!onUpdateLeftItems || !displayLeftItems || displayLeftItems.length === 0) return;
    
    // التحقق من وجود matches فعلية - إذا لم يكن هناك أي match، نرسل مصفوفة فارغة
    const hasMatches = Object.keys(matches).length > 0;
    
    if (!hasMatches) {
      // إذا لم يكن هناك matches، نرسل مصفوفة فارغة لتعطيل زر التأكيد
      onUpdateLeftItems([]);
      return;
    }
    
    // إنشاء updatedLeftItems حيث كل عنصر في الفهرس textIndex يحتوي على الصورة المطابقة
    // هذا للتنسيق المطلوب في LessonContent.jsx
    // نستخدم displayLeftItems (النسخة المحلية) لضمان عدم تأثر العرض
    const updatedLeftItems = rightItems.map((textItem, textIndex) => {
      const matchedImageIndex = matches[textIndex];
      // إذا كان هناك match، نستخدم الصورة المطابقة، وإلا نستخدم الصورة في نفس الفهرس
      if (matchedImageIndex !== undefined && matchedImageIndex !== null && displayLeftItems[matchedImageIndex]) {
        return displayLeftItems[matchedImageIndex];
      }
      // إذا لم يكن هناك match، نستخدم الصورة في نفس الفهرس (أو null)
      return displayLeftItems[textIndex] || { id: `l${textIndex}`, type: 'image', content: null };
    });
    
    // التحقق من أن هناك على الأقل match واحد صحيح قبل الإرسال
    const hasValidMatches = updatedLeftItems.some((item, idx) => {
      const matchedImageIndex = matches[idx];
      return matchedImageIndex !== undefined && matchedImageIndex !== null && item && item.content;
    });
    
    if (!hasValidMatches) {
      // إذا لم يكن هناك matches صحيحة، نرسل مصفوفة فارغة
      onUpdateLeftItems([]);
      return;
    }
    
    // إرسال البيانات إلى المكون الأب فقط إذا كان هناك matches صحيحة
    onUpdateLeftItems(updatedLeftItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches]);

  // Check if a match is correct
  const isMatchCorrect = (textIndex) => {
    if (!showFeedback || !correctPairs || correctPairs.length === 0) return null;
    
    const matchedImageIndex = matches[textIndex];
    if (matchedImageIndex === undefined || matchedImageIndex === null) return null;
    
    const imageItem = displayLeftItems[matchedImageIndex];
    const textItem = rightItems[textIndex];
    
    if (!imageItem || !imageItem.content || !textItem) return null;
    
    // Extract text value if it's an object
    const textValue = typeof textItem === 'string' ? textItem : (textItem?.text || textItem?.content || '');
    
    // Find the correct pair for this text
    const correctPair = correctPairs.find(pair => pair.text === textValue);
    
    if (!correctPair) return null;
    
    // Compare image filenames (extract relative path if needed)
    const imageUrl = imageItem.content;
    const imageFilename = imageUrl.includes('/') ? imageUrl.split('/').pop() : imageUrl;
    const correctImageUrl = correctPair.image || '';
    const correctImageFilename = correctImageUrl.includes('/') ? correctImageUrl.split('/').pop() : correctImageUrl;
    
    return imageFilename === correctImageFilename;
  };

  const handleTextClick = (textIndex) => {
    if (isConfirmed) return;
    
    // If clicking the same text, deselect it
    if (selectedTextIndex === textIndex) {
      setSelectedTextIndex(null);
      return;
    }
    
    // Select the text
    setSelectedTextIndex(textIndex);
  };

  const handleImageClick = (imageIndex) => {
    if (isConfirmed || selectedTextIndex === null) return;
    
    // Check if this image is already matched to another text
    const existingMatch = Object.entries(matches).find(
      ([tIdx, imgIdx]) => imgIdx === imageIndex && parseInt(tIdx) !== selectedTextIndex
    );
    
    // Check if this text already has a match
    const currentMatch = matches[selectedTextIndex];
    
    // If clicking on the same match, remove it
    if (currentMatch === imageIndex) {
      const newMatches = { ...matches };
      delete newMatches[selectedTextIndex];
      setMatches(newMatches);
      setSelectedTextIndex(null);
      return;
    }
    
    // Remove old match for this text if exists
    const newMatches = { ...matches };
    if (currentMatch !== undefined) {
      delete newMatches[selectedTextIndex];
    }
    
    // Remove old match for this image if exists
    Object.keys(newMatches).forEach(key => {
      if (newMatches[key] === imageIndex) {
        delete newMatches[key];
      }
    });
    
    // Create new match
    newMatches[selectedTextIndex] = imageIndex;
    setMatches(newMatches);
    setSelectedTextIndex(null);
  };

  const mainContainerRef = useRef(null);
  const textRefs = useRef({});

  return (
    <div className="w-full mb-8 relative" dir="rtl" ref={mainContainerRef}>
      {/* Header */}
      <div className="flex justify-start mb-6 mr-auto">
        <div 
          className={`px-4 py-2 flex items-center gap-2 shadow-md ${
            isConfirmed ? 'bg-gray-400' : 'bg-[#5b72c4]'
          } text-white`}
          style={{ borderRadius: '4px' }}
        >
          <img src={penIcon} alt="Match" className="w-5 h-5 brightness-0 invert" />
          <span className="font-bold">
            {isConfirmed 
              ? 'تم التأكيد' 
              : selectedTextIndex !== null 
                ? 'انقر على الصورة المطابقة' 
                : 'انقر على النص ثم على الصورة المطابقة'}
          </span>
        </div>
      </div>

      {/* Arrows Container - لرسم جميع الأسهم (تبقى حتى بعد التأكيد) */}
      <div className="absolute inset-0 pointer-events-none z-30" style={{ overflow: 'visible' }}>
        {Object.entries(matches).map(([textIdx, imageIdx]) => {
          const textRef = textRefs.current[textIdx];
          const imageRef = imageRefs.current[imageIdx];
          if (!textRef || !imageRef) return null;
          
          return (
            <DynamicArrow
              key={`arrow-${textIdx}-${imageIdx}`}
              fromElement={textRef}
              toElement={imageRef}
              isVisible={true}
              containerElement={mainContainerRef.current || document.body}
              index={`${textIdx}-${imageIdx}`}
            />
          );
        })}
      </div>

      {/* Pairs Grid */}
      <div className="flex flex-col gap-4 w-full">
        {rightItems.map((textItem, textIndex) => {
          // Ensure textItem is a string
          const safeTextItem = typeof textItem === 'string' ? textItem : (textItem?.text || textItem?.content || '');
          
          // الحصول على الصورة المطابقة لهذا النص
          const matchedImageIndex = matches[textIndex] !== undefined ? matches[textIndex] : null;
          
          // نعرض الصورة في نفس الفهرس (الصور تبقى في أماكنها)
          // نستخدم displayLeftItems (النسخة المحلية) لضمان عدم تأثر العرض
          const displayImageIndex = textIndex;
          const displayImageItem = displayLeftItems && displayLeftItems[displayImageIndex] 
            ? displayLeftItems[displayImageIndex] 
            : { id: `l${displayImageIndex}`, type: 'image', content: null };
          
          return (
            <MatchRow 
              key={textIndex}
              index={textIndex}
              textItem={safeTextItem}
              imageItem={displayImageItem}
              imageIndex={displayImageIndex}
              isLast={textIndex === rightItems.length - 1}
              selectedTextIndex={selectedTextIndex}
              matchedImageIndex={matchedImageIndex}
              onImageClick={handleImageClick}
              onTextClick={handleTextClick}
              isCorrect={isMatchCorrect(textIndex)}
              isConfirmed={isConfirmed}
              allImageRefs={imageRefs.current}
              textRefs={textRefs.current}
            />
          );
        })}
      </div>

    </div>
  );
};

export default DragMatchQuestion;
