import React, { useState } from 'react';
import { Block } from '../../../lib/types/editor';
import { motion } from 'framer-motion';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { $getRoot, EditorState } from 'lexical';
import FloatingToolbar from '../FloatingToolbar';

interface TextBlockProps {
  block: Block;
  onUpdate: (updatedBlock: Block) => void;
  isEditing: boolean;
  breakpoint: string;
}

const TextBlock: React.FC<TextBlockProps> = ({ block, onUpdate, isEditing, breakpoint }) => {
  const [isHovered, setIsHovered] = useState(false);

  const initialConfig = {
    namespace: `editor-${block.id}`,
    onError: (error: Error) => {
      console.error('Lexical error:', error);
    },
    editable: isEditing,
    theme: {
      text: {
        base: block.styles?.color ? `text-[${block.styles.color}]` : 'text-white',
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'line-through',
        underlineStrikethrough: 'underline line-through',
      },
      paragraph: 'mb-4 last:mb-0',
      heading: {
        h1: 'text-4xl font-bold mb-4',
        h2: 'text-3xl font-bold mb-3',
        h3: 'text-2xl font-bold mb-2',
      },
      list: {
        ul: 'list-disc ml-6 mb-4',
        ol: 'list-decimal ml-6 mb-4',
        listitem: 'mb-1 last:mb-0',
      },
    },
  };

  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const content = root.getTextContent();
      onUpdate({
        ...block,
        content,
      });
    });
  };

  const textStyles = {
    ...block.styles,
    display: 'block',
    width: block.styles?.width || '100%'
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
      <LexicalComposer initialConfig={initialConfig}>
        {isEditing && <FloatingToolbar block={block} onUpdate={onUpdate} breakpoint={breakpoint} />}
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="outline-none min-h-[1em] text-white"
                spellCheck={false}
              />
            }
            placeholder={
              <div className="absolute top-0 left-0 text-gray-400 pointer-events-none">
                Start typing...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <AutoFocusPlugin />
        <OnChangePlugin onChange={handleChange} />
      </LexicalComposer>
    </motion.div>
  );
};

export default TextBlock;