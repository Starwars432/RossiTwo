import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import { Block, Breakpoint } from '../../../lib/types/editor';
import TextToolbar from './TextToolbar';
import { useFloating, offset, flip, shift } from '@floating-ui/react';
import { Rnd } from 'react-rnd';

interface TextBlockProps {
  block: Block;
  onUpdate: (updatedBlock: Block) => void;
  isEditing: boolean;
  breakpoint: Breakpoint;
}

const TextBlock: React.FC<TextBlockProps> = ({ block, onUpdate, isEditing, breakpoint }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
    ],
    content: block.content || '<p>Start typing...</p>',
    editable: isEditing,
    onUpdate: ({ editor }) => {
      onUpdate({
        ...block,
        content: editor.getHTML(),
      });
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  });

  const { refs, floatingStyles } = useFloating({
    placement: 'top',
    middleware: [offset(10), flip(), shift()],
  });

  const handleDragStop = (_e: any, d: { x: number; y: number }) => {
    onUpdate({
      ...block,
      styles: {
        ...block.styles,
        transform: `translate(${d.x}px, ${d.y}px)`,
      },
    });
  };

  const handleResizeStop = (_e: any, _direction: any, ref: HTMLElement, _delta: any, position: { x: number; y: number }) => {
    onUpdate({
      ...block,
      styles: {
        ...block.styles,
        width: ref.style.width,
        height: ref.style.height,
        transform: `translate(${position.x}px, ${position.y}px)`,
      },
    });
  };

  const position = block.styles?.transform 
    ? block.styles.transform.match(/translate\((-?\d+(?:\.\d+)?)px,\s*(-?\d+(?:\.\d+)?)px\)/)?.slice(1).map(Number) 
    : [0, 0];

  return (
    <Rnd
      default={{
        x: position?.[0] || 0,
        y: position?.[1] || 0,
        width: block.styles?.width || '100%',
        height: block.styles?.height || 'auto',
      }}
      bounds="parent"
      enableResizing={isEditing}
      disableDragging={!isEditing}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
    >
      <motion.div
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isEditing && isHovered && (
          <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Text Block
          </div>
        )}

        <div ref={refs.setReference}>
          <EditorContent 
            editor={editor} 
            className="prose prose-invert max-w-none focus:outline-none"
          />
        </div>

        {editor && isFocused && isEditing && (
          <TextToolbar
            editor={editor}
            block={block}
            onUpdate={onUpdate}
            breakpoint={breakpoint}
            style={floatingStyles}
            ref={refs.setFloating}
          />
        )}
      </motion.div>
    </Rnd>
  );
};

export default TextBlock;