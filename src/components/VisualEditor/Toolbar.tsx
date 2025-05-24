import React from 'react';
import { motion } from 'framer-motion';
import { Type, Image, Layout, Undo, Redo } from 'lucide-react';
import { useEditorStore } from '../../lib/stores/editorStore';

const Toolbar: React.FC = () => {
  const { undo, redo, canUndo, canRedo, addBlock } = useEditorStore();

  const tools = [
    { type: 'text', icon: Type, label: 'Add Text' },
    { type: 'image', icon: Image, label: 'Add Image' },
    { type: 'container', icon: Layout, label: 'Add Container' }
  ] as const;

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 bg-black/90 border border-blue-400/30 rounded-r-lg p-2 space-y-2">
      {tools.map(({ type, icon: Icon, label }) => (
        <motion.button
          key={type}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => addBlock({ type, id: crypto.randomUUID() })}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
          title={label}
        >
          <Icon className="w-4 h-4" />
        </motion.button>
      ))}
      <div className="border-t border-blue-400/30 pt-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={undo}
          disabled={!canUndo()}
          className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 disabled:opacity-50 disabled:hover:bg-blue-500/10 mb-2"
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