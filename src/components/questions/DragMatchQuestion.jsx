import React, { useState, useRef } from 'react';
import penIcon from '../../assets/icons/pen-line.svg';
import arrowIcon from '../../assets/images/arow.png';

const MatchCard = ({ item, arrowIcon, isDraggable, onDragStart, onDrop, onDragOver, onTouchStart, onTouchMove, onTouchEnd, index, side, isDragging }) => (
  <div 
    className={`flex items-center justify-center relative ${isDraggable ? 'cursor-move' : ''}`}
    style={{ width: '100%', maxWidth: '200px' }} 
    draggable={isDraggable}
    onDragStart={onDragStart}
    onDrop={onDrop}
    onDragOver={onDragOver}
    onTouchStart={onTouchStart}
    onTouchMove={onTouchMove}
    onTouchEnd={onTouchEnd}
    data-index={index}
    data-side={side}
    data-match-card="true"
  >
    {/* Card Container */}
    <div 
        className={`bg-white border-2 border-[#5f5b5c] rounded-[12px] overflow-hidden w-full shadow-sm flex flex-col 
        ${item.type === 'image' || item.content ? 'sm:scale-100 scale-[0.95]' : ''}
        ${isDragging ? 'opacity-50 scale-105 ring-4 ring-[#4F67BD] z-50' : ''}
        transition-all duration-200
        `}
    >
        
        {/* Image Section */}
        <div className="w-full h-[140px] flex items-center justify-center p-4 bg-white">
             <img 
                src={item.content} 
                alt="Match Item" 
                className="max-w-full max-h-full object-contain pointer-events-none" 
             />
        </div>

        {/* Separator Line */}
        <div className="w-full h-[1px] bg-[#5f5b5c]"></div>

        {/* Text Section */}
        <div className="w-full py-3 text-center bg-white">
            <span 
                className="font-bold text-[16px] text-[#000000] pointer-events-none"
                style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}
            >
                {item.text}
            </span>
        </div>
    </div>

    {/* Arrow Icon */}
    <div className={`absolute top-1/2 transform -translate-y-1/2 z-10 -right-4 sm:-right-10`}>
       <img src={arrowIcon} alt="arrow" className="h-6 w-auto" />
    </div>
  </div>
);

const MatchRow = ({ rightItem, leftItem, index, isLast, onDragStart, onDrop, onDragOver, onTouchStart, onTouchMove, onTouchEnd, draggedItem }) => {
    const isRightDragging = draggedItem && draggedItem.index === index && draggedItem.side === 'right';
    const isLeftDragging = draggedItem && draggedItem.index === index && draggedItem.side === 'left';

    return (
  <div className="flex flex-col w-full max-w-4xl mx-auto">
    <div className="flex items-center justify-between w-full mb-8 px-4 lg:px-16">
      {/* Right Item */}
      <div className="relative">
         <MatchCard 
            item={rightItem} 
            arrowIcon={arrowIcon} 
            isDraggable={true}
            onDragStart={(e) => onDragStart(e, index, 'right')}
            onDrop={(e) => onDrop(e, index, 'right')}
            onDragOver={onDragOver}
            onTouchStart={(e) => onTouchStart(e, index, 'right')}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            index={index}
            side="right"
            isDragging={isRightDragging}
         />
      </div>

      {/* Left Item */}
      <div className="relative">
         <MatchCard 
            item={leftItem} 
            arrowIcon={arrowIcon} 
            isDraggable={true}
            onDragStart={(e) => onDragStart(e, index, 'left')}
            onDrop={(e) => onDrop(e, index, 'left')}
            onDragOver={onDragOver}
            onTouchStart={(e) => onTouchStart(e, index, 'left')}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            index={index}
            side="left"
            isDragging={isLeftDragging}
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
)};

const DragMatchQuestion = ({ rightItems, leftItems, onUpdateLeftItems, onUpdateRightItems }) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const longPressTimer = useRef(null);
  const isLongPress = useRef(false);

  const handleDragStart = (e, index, side) => {
    setDraggedItem({ index, side });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetIndex, targetSide) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!draggedItem) return;

    const sourceIndex = draggedItem.index;
    const sourceSide = draggedItem.side;

    if (sourceSide === targetSide) {
       if (sourceIndex === targetIndex) {
           setDraggedItem(null);
           return;
       }

       const items = sourceSide === 'left' ? [...leftItems] : [...rightItems];
       const updateFn = sourceSide === 'left' ? onUpdateLeftItems : onUpdateRightItems;

       const temp = items[sourceIndex];
       items[sourceIndex] = items[targetIndex];
       items[targetIndex] = temp;

       updateFn(items);
    } 
    else {
       const newLeftItems = [...leftItems];
       const newRightItems = [...rightItems];
       
       const sourceItem = sourceSide === 'left' ? newLeftItems[sourceIndex] : newRightItems[sourceIndex];
       const targetItem = targetSide === 'left' ? newLeftItems[targetIndex] : newRightItems[targetIndex];

       if (sourceSide === 'left') {
          newLeftItems[sourceIndex] = targetItem;
          newRightItems[targetIndex] = sourceItem;
       } else {
          newRightItems[sourceIndex] = targetItem;
          newLeftItems[targetIndex] = sourceItem;
       }

       onUpdateLeftItems(newLeftItems);
       onUpdateRightItems(newRightItems);
    }
    
    setDraggedItem(null);
  };

  // Touch Handlers for Mobile (Long Press)
  const handleTouchStart = (e, index, side) => {
      // Clear any existing timer
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
      isLongPress.current = false;

      longPressTimer.current = setTimeout(() => {
          isLongPress.current = true;
          setDraggedItem({ index, side });
          // Haptic feedback if supported
          if (navigator.vibrate) navigator.vibrate(50);
      }, 600); // 600ms hold to pick up
  };

  const handleTouchMove = (e) => {
      if (isLongPress.current && draggedItem) {
         e.preventDefault(); // Prevent scrolling only if we are effectively dragging
      } else {
          // If user moves before long press triggers, cancel the timer (it's a scroll)
          if (longPressTimer.current) {
              clearTimeout(longPressTimer.current);
              longPressTimer.current = null;
          }
      }
  };

  const handleTouchEnd = (e) => {
      if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
      }

      if (!isLongPress.current || !draggedItem) {
          isLongPress.current = false;
          return;
      }
      
      const touch = e.changedTouches[0];
      const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
      
      if (targetElement) {
          const cardWrapper = targetElement.closest('[data-match-card="true"]');
          
          if (cardWrapper) {
              const targetIndex = parseInt(cardWrapper.getAttribute('data-index'), 10);
              const targetSide = cardWrapper.getAttribute('data-side');
              handleDrop(null, targetIndex, targetSide);
          }
      }
      
      setDraggedItem(null);
      isLongPress.current = false;
  };

  return (
    <div className="w-full mb-8">
       {/* Header */}
       <div className="flex justify-start mb-6 mr-auto">
        <div 
            className="bg-[#5b72c4] text-white px-4 py-2 flex items-center gap-2 shadow-md"
            style={{ borderRadius: '4px' }}
        >
          <img src={penIcon} alt="Drag Match" className="w-5 h-5 brightness-0 invert" />
          <span className="font-bold">اسحب ثم افلت</span>
        </div>
      </div>

      {/* Pairs Grid */}
      <div className="flex flex-col gap-4 w-full">
        {rightItems.map((rightItem, index) => (
          <MatchRow 
            key={index}
            index={index}
            rightItem={rightItem} 
            leftItem={leftItems[index]} 
            isLast={index === rightItems.length - 1}
            
            // Pass handlers
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            draggedItem={draggedItem}
          />
        ))}
      </div>
    </div>
  );
};

export default DragMatchQuestion;
