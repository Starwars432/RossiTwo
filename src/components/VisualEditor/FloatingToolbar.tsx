import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Link,
  Type,
  Image,
  Layout,
  Palette,
  Maximize2,
  Minimize2,
  ChevronDown,
  Smartphone,
  Tablet,
  Monitor,
} from 'lucide-react';
import { Block, Breakpoint } from '../../lib/types/editor';

interface FloatingToolbarProps {
  block: Block;
  onUpdate: (updatedBlock: Block) => void;
  breakpoint: Breakpoint;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ block, onUpdate, breakpoint }) => {
  const [editor] = useLexicalComposerContext();
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activeStyles, setActiveStyles] = useState(new Set());
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [activeBreakpoint, setActiveBreakpoint] = useState<Breakpoint>('desktop');

  useEffect(() => {
    const updateToolbar = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setIsVisible(false);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setPosition({
        x: rect.left + (rect.width / 2) - 150,
        y: rect.top - 60
      });
      setIsVisible(true);
    };

    document.addEventListener('selectionchange', updateToolbar);
    return () => document.removeEventListener('selectionchange', updateToolbar);
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
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

  const updateBlockStyle = (property: string, value: string) => {
    if (activeBreakpoint === 'desktop') {
      onUpdate({
        ...block,
        styles: {
          ...block.styles,
          [property]: value
        }
      });
    } else {
      onUpdate({
        ...block,
        styles: {
          ...block.styles,
          [activeBreakpoint]: {
            ...(block.styles?.[activeBreakpoint] || {}),
            [property]: value
          }
        }
      });
    }
  };

  const getStyleValue = (property: string) => {
    if (activeBreakpoint === 'desktop') {
      return block.styles?.[property];
    }
    return block.styles?.[activeBreakpoint]?.[property];
  };

  const breakpointButtons = [
    { value: 'desktop', icon: Monitor, label: 'Desktop' },
    { value: 'tablet', icon: Tablet, label: 'Tablet' },
    { value: 'mobile', icon: Smartphone, label: 'Mobile' }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
            zIndex: 1000,
          }}
          className="flex flex-col"
        >
          <div className="flex items-center space-x-1 bg-black/90 border border-blue-400/30 rounded-lg p-1.5 shadow-lg">
            <div className="flex items-center space-x-1 border-r border-blue-400/30 pr-2 mr-2">
              {breakpointButtons.map(({ value, icon: Icon, label }) => (
                <motion.button
                  key={value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveBreakpoint(value as Breakpoint)}
                  className={`p-1.5 rounded ${
                    activeBreakpoint === value
                      ? 'bg-blue-500 text-white'
                      : 'text-blue-400 hover:bg-blue-500/20'
                  }`}
                  title={label}
                >
                  <Icon className="w-4 h-4" />
                </motion.button>
              ))}
            </div>

            {block.type === 'text' && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => formatText('bold')}
                  className={`p-1.5 rounded ${
                    activeStyles.has('bold')
                      ? 'bg-blue-500 text-white'
                      : 'text-blue-400 hover:bg-blue-500/20'
                  }`}
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </motion.button>
                {/* Add other text formatting buttons */}
              </>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowStylePanel(!showStylePanel)}
              className="p-1.5 rounded text-blue-400 hover:bg-blue-500/20"
              title="Style Settings"
            >
              {showStylePanel ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </motion.button>
          </div>

          <AnimatePresence>
            {showStylePanel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 bg-black/90 border border-blue-400/30 rounded-lg p-4 shadow-lg"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Width</label>
                    <select
                      value={getStyleValue('width') || '100%'}
                      onChange={(e) => updateBlockStyle('width', e.target.value)}
                      className="w-full bg-black/50 border border-blue-400/30 rounded px-2 py-1 text-sm"
                    >
                      <option value="100%">Full Width</option>
                      <option value="75%">75%</option>
                      <option value="50%">50%</option>
                      <option value="25%">25%</option>
                    </select>
                  </div>

                  {block.type === 'text' && (
                    <>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Font Size</label>
                        <select
                          value={getStyleValue('fontSize') || 'inherit'}
                          onChange={(e) => updateBlockStyle('fontSize', e.target.value)}
                          className="w-full bg-black/50 border border-blue-400/30 rounded px-2 py-1 text-sm"
                        >
                          <option value="inherit">Default</option>
                          <option value="0.875rem">Small</option>
                          <option value="1rem">Medium</option>
                          <option value="1.25rem">Large</option>
                          <option value="1.5rem">Extra Large</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Text Align</label>
                        <select
                          value={getStyleValue('textAlign') || 'left'}
                          onChange={(e) => updateBlockStyle('textAlign', e.target.value)}
                          className="w-full bg-black/50 border border-blue-400/30 rounded px-2 py-1 text-sm"
                        >
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Padding</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['Top', 'Right', 'Bottom', 'Left'].map((side) => (
                        <input
                          key={side}
                          type="number"
                          value={parseInt(getStyleValue(`padding${side}`) || '0')}
                          onChange={(e) => updateBlockStyle(`padding${side}`, `${e.target.value}px`)}
                          className="w-full bg-black/50 border border-blue-400/30 rounded px-2 py-1 text-sm"
                          placeholder={side}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Margin</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['Top', 'Right', 'Bottom', 'Left'].map((side) => (
                        <input
                          key={side}
                          type="number"
                          value={parseInt(getStyleValue(`margin${side}`) || '0')}
                          onChange={(e) => updateBlockStyle(`margin${side}`, `${e.target.value}px`)}
                          className="w-full bg-black/50 border border-blue-400/30 rounded px-2 py-1 text-sm"
                          placeholder={side}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingToolbar;