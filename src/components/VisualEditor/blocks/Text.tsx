import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import { Block, Breakpoint } from '../../../lib/types/editor';
import TextToolbar from './TextToolbar';
import { useFloating, offset, flip, shift } from '@floating-ui/react';

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

  const textStyles: React.CSSProperties = {
    display: 'block',
    width: '100%',
    ...(block.styles as React.CSSProperties),
  };

  return (
    <motion.div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={textStyles}
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
  );
};

export default TextBlock;