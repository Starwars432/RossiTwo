import React, { useState, useRef, useEffect } from 'react';
import { Block, Breakpoint } from '../../../lib/types/editor';
import TextToolbar from './TextToolbar';
import { useFloating, offset, flip, shift } from '@floating-ui/react';
import DraggableBlock from '../DraggableBlock';

interface TextBlockProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  onChildUpdate?: (child: Block) => void;
  isEditing?: boolean;
  breakpoint?: Breakpoint;
}

const TextBlock: React.FC<TextBlockProps> = ({ 
  block, 
  onUpdate,
  onChildUpdate,
  isEditing: isEditingProp = true,
  breakpoint = 'desktop'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const { refs, floatingStyles } = useFloating({
    placement: 'top',
    middleware: [offset(10), flip(), shift()],
  });

  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    setShowToolbar(!!selection && !selection.isCollapsed);
  };

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const handleBlur = () => {
    setTimeout(() => {
      setIsEditing(false);
      setShowToolbar(false);
    }, 200);
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onUpdate({ content: e.currentTarget.innerHTML });
  };

  return (
    <DraggableBlock 
      block={block} 
      onUpdate={onUpdate}
      onChildUpdate={onChildUpdate}
      isEditing={isEditingProp}
      breakpoint={breakpoint}
    >
      <div ref={refs.setReference}>
        <div
          ref={editorRef}
          contentEditable={isEditingProp}
          onFocus={() => setIsEditing(true)}
          onBlur={handleBlur}
          onInput={handleInput}
          className={`outline-none min-h-[1em] w-full ${
            isEditing ? 'ring-2 ring-blue-400 rounded px-1' : ''
          }`}
          dangerouslySetInnerHTML={{ __html: block.content || '' }}
          style={block.style as React.CSSProperties}
        />
      </div>

      {showToolbar && (
        <TextToolbar
          ref={refs.setFloating}
          block={block}
          onUpdate={onUpdate}
          style={floatingStyles}
        />
      )}
    </DraggableBlock>
  );
};

export default TextBlock;