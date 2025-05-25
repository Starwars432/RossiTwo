import React from 'react';
import { motion } from 'framer-motion';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react';
import { Block, BlockStyle } from '../../../lib/types/editor';

interface TextToolbarProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  style?: React.CSSProperties;
}

const TextToolbar = React.forwardRef<HTMLDivElement, TextToolbarProps>(
  ({ block, onUpdate, style }, ref) => {
    const tools = [
      { icon: Bold, format: 'bold', label: 'Bold' },
      { icon: Italic, format: 'italic', label: 'Italic' },
      { icon: Underline, format: 'underline', label: 'Underline' },
      { icon: AlignLeft, format: 'left', label: 'Align Left' },
      { icon: AlignCenter, format: 'center', label: 'Align Center' },
      { icon: AlignRight, format: 'right', label: 'Align Right' },
    ];

    const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const fontSize = `${e.target.value}px`;
      onUpdate({
        style: {
          ...(block.style as BlockStyle),
          fontSize,
        },
      });
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const color = e.target.value;
      onUpdate({
        style: {
          ...(block.style as BlockStyle),
          color,
        },
      });
    };

    const handleFormatClick = (format: string) => {
      document.execCommand(format, false);
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const content = range.cloneContents();
        const span = document.createElement('span');
        span.appendChild(content);
        range.deleteContents();
        range.insertNode(span);
        selection.removeAllRanges();
      }
    };

    return (
      <div
        ref={ref}
        style={style}
        className="z-50 bg-black/90 border border-blue-400/30 rounded-lg p-2 flex items-center space-x-2"
      >
        <div className="flex items-center space-x-2 border-r border-blue-400/30 pr-2">
          <input
            type="number"
            min={8}
            max={200}
            value={parseInt((block.style?.fontSize as string) || '16')}
            onChange={handleFontSizeChange}
            className="w-16 bg-black/50 border border-blue-400/30 rounded px-2 py-1 text-sm text-blue-400"
            title="Font size"
          />
          
          <input
            type="color"
            value={block.style?.color || '#FFFFFF'}
            onChange={handleColorChange}
            className="w-8 h-8 bg-transparent border border-blue-400/30 rounded cursor-pointer"
            title="Text color"
          />
        </div>

        <div className="flex items-center space-x-1">
          {tools.map(({ icon: Icon, format, label }) => (
            <motion.button
              key={format}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFormatClick(format)}
              className="p-1.5 rounded hover:bg-blue-500/20 text-blue-400"
              title={label}
            >
              <Icon className="w-4 h-4" />
            </motion.button>
          ))}
        </div>
      </div>
    );
  }
);

TextToolbar.displayName = 'TextToolbar';

export default TextToolbar;