import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Block } from '../../lib/types/editor';
import BlockRenderer from './BlockRenderer';

interface DraggableBlockProps {
  block: Block;
  onUpdate: (updatedBlock: Block) => void;
  isEditing: boolean;
  isDropTarget?: boolean;
}

const DraggableBlock: React.FC<DraggableBlockProps> = ({
  block,
  onUpdate,
  isEditing,
  isDropTarget
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 1 : 'auto'
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`group relative ${isDropTarget ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
      {...attributes}
      whileHover={{ scale: isEditing ? 1.005 : 1 }}
      transition={{ duration: 0.2 }}
    >
      {isEditing && (
        <motion.div
          {...listeners}
          className="absolute -left-6 top-1/2 -translate-y-1/2 p-1 cursor-move opacity-0 group-hover:opacity-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="w-2 h-6 rounded-full bg-blue-400/30"
            whileHover={{ backgroundColor: 'rgba(96, 165, 250, 0.5)' }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
      )}
      <BlockRenderer
        block={block}
        onUpdate={onUpdate}
        isEditing={isEditing}
      />
    </motion.div>
  );
};

export default DraggableBlock;