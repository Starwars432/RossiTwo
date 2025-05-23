import React from 'react';
import { motion } from 'framer-motion';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Type,
} from 'lucide-react';

const TextToolbar: React.FC = () => {
  const [editor] = useLexicalComposerContext();
  const [isActive, setIsActive] = React.useState(false);
  const [activeStyles, setActiveStyles] = React.useState(new Set());

  React.useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setIsActive(!selection.isCollapsed());
          const styles = new Set();
          if (selection.hasFormat('bold')) styles.add('bold');
          if (selection.hasFormat('italic')) styles.add('italic');
          if (selection.hasFormat('underline')) styles.add('underline');
          if (selection.hasFormat('strikethrough')) styles.add('strikethrough');
          setActiveStyles(styles);
        }
        return false;
      },
      []
    );
  }, [editor]);

  const formatText = (format: string) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const tools = [
    { icon: Bold, format: 'bold', label: 'Bold' },
    { icon: Italic, format: 'italic', label: 'Italic' },
    { icon: Underline, format: 'underline', label: 'Underline' },
    { icon: Strikethrough, format: 'strikethrough', label: 'Strikethrough' },
    { icon: AlignLeft, format: 'left', label: 'Align Left' },
    { icon: AlignCenter, format: 'center', label: 'Align Center' },
    { icon: AlignRight, format: 'right', label: 'Align Right' },
    { icon: List, format: 'bullet', label: 'Bullet List' },
    { icon: ListOrdered, format: 'number', label: 'Numbered List' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -10 }}
      className="absolute -top-12 left-0 z-10 flex items-center space-x-1 bg-black/90 border border-blue-400/30 rounded-lg p-1"
    >
      {tools.map(({ icon: Icon, format, label }) => (
        <motion.button
          key={format}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => formatText(format)}
          className={`p-1.5 rounded ${
            activeStyles.has(format)
              ? 'bg-blue-500 text-white'
              : 'text-blue-400 hover:bg-blue-500/20'
          }`}
          title={label}
        >
          <Icon className="w-4 h-4" />
        </motion.button>
      ))}
      <select
        className="bg-black/90 text-blue-400 border border-blue-400/30 rounded px-2 py-1 text-sm"
        onChange={(e) => formatText(`heading-${e.target.value}`)}
      >
        <option value="">Normal</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>
    </motion.div>
  );
};

export default TextToolbar;