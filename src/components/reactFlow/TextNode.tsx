import React, { useState, useRef, useEffect } from 'react';
import './TextNode.css';

const TextNode: React.FC<{
  data: {
    title: string;
    description: string;
    onUpdate: (id: string, title: string, description: string) => void;
    id: string;
  };
}> = ({ data }) => {
  const { title, description, onUpdate, id } = data;

  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [isEditing, setIsEditing] = useState(false);
  const [isBorderVisible, setIsBorderVisible] = useState(true);
  const [size, setSize] = useState({ width: 80, height: 45, });
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleBlur = (e: React.FocusEvent) => {
    if (nodeRef.current && !nodeRef.current.contains(e.relatedTarget)) {
    setIsEditing(false);
    setIsBorderVisible(false);
    onUpdate(id, editedTitle, editedDescription);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur(e as unknown as React.FocusEvent);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event from reaching React Flow

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = nodeRef.current!.offsetWidth;
    const startHeight = nodeRef.current!.offsetHeight;

    const doDrag = (dragEvent: PointerEvent) => {
      dragEvent.preventDefault();
      const newWidth = startWidth + (dragEvent.clientX - startX)
      const newHeight = startHeight + (dragEvent.clientY - startY)
      setSize({ width: newWidth, height: newHeight });
    };

    const stopDrag = () => {
      document.removeEventListener('pointermove', doDrag);
      document.removeEventListener('pointerup', stopDrag);
    };

    // Add pointermove and pointerup listeners
    document.addEventListener('pointermove', doDrag);
    document.addEventListener('pointerup', stopDrag);
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height to auto to calculate scroll height
      const newHeight = textareaRef.current.scrollHeight+10; // Get scroll height
      setSize((prev) => ({ ...prev, height: Math.max(prev.height, newHeight) })); // Update node height if needed
      textareaRef.current.style.height = `${newHeight}px`; // Set height to scroll height
    }
  }, [editedDescription, isEditing]);

  return (
    <div
      ref={nodeRef}
      style={{
        position: 'relative',
        width: size.width,
        height: size.height,
      }}
      className={`text-node ${isBorderVisible && 'border-black-dotted'}`}
    >
      {isEditing ? (
        <div style={{height:'auto', padding:'0px 5px'}}>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleBlur} // Ensure onBlur triggers the update
            onKeyDown={handleKeyDown}
            style={{ boxSizing: 'border-box', maxHeight:'100px', padding:'0px', fontWeight:600,  fontSize: '10px', overflow: 'hidden',
                wordWrap:'break-word' }}
            autoFocus
          />
          <textarea
            ref={textareaRef}
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            onBlur={handleBlur} // Ensure onBlur triggers the update
            onKeyDown={handleKeyDown}
            style={{ width:'100%', fontFamily:'normal', margin:'auto', lineHeight:'1.5', resize: 'none', border:'none', outline:'none', boxSizing: 'border-box', padding:'0px',  fontSize: '10px', overflow: 'hidden',
                wordWrap:'break-word' }}
          />
        </div>
      ) : (
        <div onClick={() => {setIsEditing(true);setIsBorderVisible(true)}} style={{ cursor: 'text', padding:'0px 5px', height: size.height }}>
          <strong style={{ fontSize: '10px', fontFamily:'normal' }}>{editedTitle}</strong>
          <p style={{ fontSize: '10px', margin:'auto' }}>{editedDescription}</p>
        </div>
      )}
      <div
        onPointerDown={handlePointerDown}
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          cursor: 'nwse-resize',
          width: '20px',
          height: '20px',
          background: 'transparent',
          zIndex: 10,
        }}
      />
    </div>
  );
};

export default TextNode;

