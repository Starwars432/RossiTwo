import React from 'react';
import { motion } from 'framer-motion';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Block, Breakpoint } from '../../../lib/types/editor';
import FontPicker from '../FontPicker';

interface TextToolbarProps {
  editor: any;
  block: Block;
  onUpdate: (updatedBlock: Block) => void;
  breakpoint: Breakpoint;
  style?: React.CSSProperties;
}

const TextToolbar = React.forwardRef<HTMLDivElement, TextToolbarProps>(
  ({ editor, block, onUpdate, style }, ref) => {
    const tools = [
      { icon: Bold, format: 'bold', label: 'Bold' },
      { icon: Italic, format: 'italic', label: 'Italic' },
      { icon: Underline, format: 'underline', label: 'Underline' },
      { icon: AlignLeft, format: 'left', label: 'Align Left' },
      { icon: AlignCenter, format: 'center', label: 'Align Center' },
      { icon: AlignRight, format: 'right', label: 'Align Right' },
    ];

    const handleFontSelect = (fontFamily: string) => {
      editor.chain().focus().setFontFamily(fontFamily).run();
      onUpdate({
        ...block,
        styles: {
          ...block.styles,
          fontFamily,
        },
      });
    };

    const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const fontSize = `${e.target.value}px`;
      editor.chain().focus().setFontSize(fontSize).run();
      onUpdate({
        ...block,
        styles: {
          ...block.styles,
          fontSize,
        },
      });
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const color = e.target.value;
      editor.chain().focus().setColor(color).run();
      onUpdate({
        ...block,
        styles: {
          ...block.styles,
          color,
        },
      });
    };

    return (
      <div
        ref={ref}
        style={style}
        className="z-50 bg-black/90 border border-blue-400/30 rounded-lg p-2 flex items-center space-x-2"
      >
        <FontPicker onFontSelect={handleFontSelect} currentFont={block.styles?.fontFamily} />
        
        <div className="flex items-center space-x-2 border-l border-blue-400/30 pl-2">
          <input
            type="number"
            min={8}
            max={200}
            value={parseInt(block.styles?.fontSize as string || '16')}
            onChange={handleFontSizeChange}
            className="w-16 bg-black/50 border border-blue-400/30 rounded px-2 py-1 text-sm text-blue-400"
            title="Font size"
          />
          
          <input
            type="color"
            value={block.styles?.color || '#FFFFFF'}
            onChange={handleColorChange}
            className="w-8 h-8 bg-transparent border border-blue-400/30 rounded cursor-pointer"
            title="Text color"
          />
        </div>

        <div className="flex items-center space-x-1 border-l border-blue-400/30 pl-2">
          {tools.map(({ icon: Icon, format, label }) => (
            <motion.button
              key={format}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => editor.chain().focus().toggleFormat(format).run()}
              className={`p-1.5 rounded ${
                editor.isActive(format)
                  ? 'bg-blue-500 text-white'
                  : 'text-blue-400 hover:bg-blue-500/20'
              }`}
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