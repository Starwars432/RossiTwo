import React from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor, rectIntersection } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { motion, AnimatePresence } from 'framer-motion';
import { Block } from '../../lib/types/editor';
import { useEditorStore } from '../../lib/stores/editorStore';
import DraggableBlock from './DraggableBlock';
import BlockRenderer from './BlockRenderer';
import Toolbar from './Toolbar';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { useBreakpoint } from '../../contexts/BreakpointContext';

interface CanvasProps {
  isEditing: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ isEditing }) => {
  const { page, addBlock, moveBlock, updateBlock, undo, redo } = useEditorStore();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [dropTarget, setDropTarget] = React.useState<string | null>(null);
  const { breakpoint, setBreakpoint } = useBreakpoint();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !page) return;

    const activeBlock = page.blocks.find(block => block.id === active.id);
    const overBlock = page.blocks.find(block => block.id === over.id);

    if (!activeBlock || !overBlock) return;

    if (overBlock.type === 'container') {
      setDropTarget(over.id as string);
    } else {
      setDropTarget(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && page) {
      const activeBlock = page.blocks.find(block => block.id === active.id);
      const overBlock = page.blocks.find(block => block.id === over.id);

      if (activeBlock && overBlock) {
        if (overBlock.type === 'container' && dropTarget === over.id) {
          const updatedOverBlock = {
            ...overBlock,
            children: [...(overBlock.children || []), activeBlock]
          };
          updateBlock(page.blocks.indexOf(overBlock), updatedOverBlock);
          
          const activeIndex = page.blocks.indexOf(activeBlock);
          if (activeIndex !== -1) {
            const newBlocks = [...page.blocks];
            newBlocks.splice(activeIndex, 1);
          }
        } else if (active.id !== over.id) {
          const oldIndex = page.blocks.findIndex(block => block.id === active.id);
          const newIndex = page.blocks.findIndex(block => block.id === over.id);

          if (oldIndex !== undefined && newIndex !== undefined) {
            moveBlock(oldIndex, newIndex);
          }
        }
      }
    }

    setActiveId(null);
    setDropTarget(null);
  };

  const handleAddBlock = (blockType: Block['type']) => {
    const newBlock: Block = {
      id: crypto.randomUUID(),
      type: blockType,
      content: '',
      styles: {}
    };

    addBlock(newBlock);
  };

  if (!page) return null;

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
        <Toolbar onAddBlock={handleAddBlock} />
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
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
            collisionDetection={rectIntersection}
          >
            <SortableContext
              items={page.blocks.map(block => block.id)}
              strategy={verticalListSortingStrategy}
            >
              <AnimatePresence>
                {page.blocks.map((block) => (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DraggableBlock
                      block={block}
                      onUpdate={(updatedBlock) => {
                        const index = page.blocks.findIndex(b => b.id === block.id);
                        if (index !== -1) {
                          updateBlock(index, updatedBlock);
                        }
                      }}
                      isEditing={isEditing}
                      isDropTarget={dropTarget === block.id}
                      breakpoint={breakpoint}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <motion.div 
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.02 }}
                  className="opacity-50"
                >
                  <BlockRenderer
                    block={page.blocks.find(block => block.id === activeId)!}
                    onUpdate={() => {}}
                    isEditing={false}
                    breakpoint={breakpoint}
                  />
                </motion.div>
              ) : null}
            </DragOverlay>
          </DndContext>

          {page.blocks.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-center py-12 text-gray-400"
            >
              <p>Add blocks using the toolbar above</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Canvas;