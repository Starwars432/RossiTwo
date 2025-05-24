import React from 'react';
import { DndContext, DragEndEvent, DragOverEvent, useSensor, useSensors, PointerSensor, rectIntersection } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { useEditorStore } from '../../lib/stores/editorStore';
import { useTabStore } from '../../lib/stores/tabStore';
import Toolbar from './Toolbar';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { useBreakpoint } from '../../contexts/BreakpointContext';

interface CanvasProps {
  isEditing: boolean;
  children: React.ReactNode;
}

const Canvas: React.FC<CanvasProps> = ({ isEditing, children }) => {
  const { activeTab, pages } = useTabStore();
  const activePage = activeTab ? pages[activeTab] : null;
  const { moveBlock } = useEditorStore();
  const [dropTarget, setDropTarget] = React.useState<string | null>(null);
  const { breakpoint, setBreakpoint } = useBreakpoint();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !activePage) return;

    const activeBlock = activePage.blocks.find(block => block.id === active.id);
    const overBlock = activePage.blocks.find(block => block.id === over.id);

    if (!activeBlock || !overBlock) return;

    if (overBlock.type === 'container') {
      setDropTarget(over.id as string);
    } else {
      setDropTarget(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && activePage) {
      const activeBlock = activePage.blocks.find(block => block.id === active.id);
      const overBlock = activePage.blocks.find(block => block.id === over.id);

      if (activeBlock && overBlock && active.id !== over.id) {
        const oldIndex = activePage.blocks.findIndex(block => block.id === active.id);
        const newIndex = activePage.blocks.findIndex(block => block.id === over.id);

        if (oldIndex !== undefined && newIndex !== undefined) {
          moveBlock(oldIndex, newIndex);
        }
      }
    }

    setDropTarget(null);
  };

  const getPreviewWidth = () => {
    switch (breakpoint) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      default:
        return 'max-w-[1200px]';
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-blue-400/30 p-4 bg-black/50 flex items-center justify-between">
        <Toolbar />
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setBreakpoint('mobile')}
            className={`p-2 rounded ${
              breakpoint === 'mobile' ? 'bg-blue-500 text-white' : 'text-blue-400 hover:bg-blue-500/20'
            }`}
            title="Mobile preview"
          >
            <Smartphone className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setBreakpoint('tablet')}
            className={`p-2 rounded ${
              breakpoint === 'tablet' ? 'bg-blue-500 text-white' : 'text-blue-400 hover:bg-blue-500/20'
            }`}
            title="Tablet preview"
          >
            <Tablet className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setBreakpoint('desktop')}
            className={`p-2 rounded ${
              breakpoint === 'desktop' ? 'bg-blue-500 text-white' : 'text-blue-400 hover:bg-blue-500/20'
            }`}
            title="Desktop preview"
          >
            <Monitor className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <motion.div 
          className={`mx-auto transition-all duration-300 ${getPreviewWidth()}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DndContext
            sensors={sensors}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            modifiers={[]}
            collisionDetection={rectIntersection}
          >
            {children}
          </DndContext>
        </motion.div>
      </div>
    </div>
  );
};

export default Canvas;