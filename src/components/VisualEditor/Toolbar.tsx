import React from 'react';
import { motion } from 'framer-motion';
import { Type, Image, Layout, Plus, Undo, Redo } from 'lucide-react';
import { Block } from '../../lib/types/editor';
import { useEditorStore } from '../../lib/stores/editorStore';

interface ToolbarProps {
  onAddBlock?: (blockType: Block['type']) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddBlock }) => {
  const { undo, redo, canUndo, canRedo } = useEditorStore();

  const blockTypes = [
    { type: 'text', icon: Type, label: 'Add Text' },
    { type: 'image', icon: Image, label: 'Add Image' },
    { type: 'container', icon: Layout, label: 'Add Container' }
  ] as const;

  return (
    <div className="border-t border-blue-400/30 px-6 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {blockTypes.map(({ type, icon: Icon, label }) => (
          <motion.button
            key={type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddBlock?.(type)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
            title={label}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm">{label}</span>
          </motion.button>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={undo}
          disabled={!canUndo()}
          className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 disabled:opacity-50 disabled:hover:bg-blue-500/10"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={redo}
          disabled={!canRedo()}
          className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 disabled:opacity-50 disabled:hover:bg-blue-500/10"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

export default Toolbar;