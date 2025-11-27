import React, { useState } from 'react';
import penIcon from '../../assets/icons/pen-line.svg';
import arrowIcon from '../../assets/images/arow.png';

const MatchCard = ({ item, arrowIcon, isDraggable, onDragStart, onDrop, onDragOver }) => (
  <div 
    className={`flex items-center justify-center relative ${isDraggable ? 'cursor-move' : ''}`}
    style={{ width: '200px' }} // Adjusted width to fit content nicely
    draggable={isDraggable}
    onDragStart={onDragStart}
    onDrop={onDrop}
    onDragOver={onDragOver}
  >
    {/* Card Container */}
    <div className="bg-white border-2 border-[#5f5b5c] rounded-[12px] overflow-hidden w-full shadow-sm flex flex-col">
        
        {/* Image Section */}
        <div className="w-full h-[140px] flex items-center justify-center p-4 bg-white">
             {/* Use item.content as image source. Assuming item.type is 'image' or mixed, but here specifically for the drag question */}
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

    {/* Arrow Icon - To the Right (outside the card) */}
    <div className="absolute -right-10 top-1/2 transform -translate-y-1/2 z-10">
       <img src={arrowIcon} alt="arrow" className="h-6 w-auto" />
    </div>
  </div>
);

const MatchRow = ({ rightItem, leftItem, index, isLast, onDragStart, onDrop, onDragOver }) => (
  <div className="flex flex-col w-full max-w-4xl mx-auto">
    <div className="flex items-center justify-between w-full mb-8 px-4 lg:px-16">
      {/* Right Item (Draggable) */}
      <div className="relative">
         <MatchCard 
            item={rightItem} 
            arrowIcon={arrowIcon} 
            isDraggable={true}
            onDragStart={(e) => onDragStart(e, index, 'right')}
            onDrop={(e) => onDrop(e, index, 'right')}
            onDragOver={onDragOver}
         />
      </div>

      {/* Left Item (Draggable) */}
      <div className="relative">
         <MatchCard 
            item={leftItem} 
            arrowIcon={arrowIcon} 
            isDraggable={true}
            onDragStart={(e) => onDragStart(e, index, 'left')}
            onDrop={(e) => onDrop(e, index, 'left')}
            onDragOver={onDragOver}
         />
      </div>
    </div>

    {/* Separator Line - Only if not the last item */}
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

const DragMatchQuestion = ({ rightItems, leftItems, onUpdateLeftItems, onUpdateRightItems }) => {
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e, index, side) => {
    setDraggedItem({ index, side });
    // Set drag image to the card element if needed, but default usually works
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetIndex, targetSide) => {
    e.preventDefault();
    if (!draggedItem) return;

    const sourceIndex = draggedItem.index;
    const sourceSide = draggedItem.side;

    // 1. Swap within the same side (Left <-> Left or Right <-> Right)
    if (sourceSide === targetSide) {
       if (sourceIndex === targetIndex) return;

       const items = sourceSide === 'left' ? [...leftItems] : [...rightItems];
       const updateFn = sourceSide === 'left' ? onUpdateLeftItems : onUpdateRightItems;

       const temp = items[sourceIndex];
       items[sourceIndex] = items[targetIndex];
       items[targetIndex] = temp;

       updateFn(items);
    } 
    // 2. Swap between sides (Left <-> Right)
    else {
       const newLeftItems = [...leftItems];
       const newRightItems = [...rightItems];
       
       // Get items to swap
       const sourceItem = sourceSide === 'left' ? newLeftItems[sourceIndex] : newRightItems[sourceIndex];
       const targetItem = targetSide === 'left' ? newLeftItems[targetIndex] : newRightItems[targetIndex];

       // Swap logic
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
          />
        ))}
      </div>
    </div>
  );
};

export default DragMatchQuestion;
