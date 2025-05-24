import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface EditableTextProps {
  content: string;
  onChange: (newContent: string) => void;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
}

const EditableText: React.FC<EditableTextProps> = ({ 
  content, 
  onChange, 
  className = '',
  tag: Tag = 'div'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.focus();
      // Place cursor at the end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (editedContent !== content) {
      onChange(editedContent);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setEditedContent(e.currentTarget.textContent || '');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      editorRef.current?.blur();
    }
  };

  return (
    <Tag className={className}>
      <motion.div
        ref={editorRef}
        contentEditable={isEditing}
        onDoubleClick={() => setIsEditing(true)}
        onBlur={handleBlur}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className={`outline-none ${isEditing ? 'ring-2 ring-blue-400 rounded px-1' : ''}`}
        dangerouslySetInnerHTML={{ __html: editedContent }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      />
    </Tag>
  );
};

export default EditableText;