import React from 'react';
import { Block } from '../../../lib/types/editor';
import DraggableBlock from './DraggableBlock';

interface ContainerBlockProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  onChildUpdate?: (child: Block) => void;
  children?: React.ReactNode;
  isEditing?: boolean;
}

const ContainerBlock: React.FC<ContainerBlockProps> = ({ 
  block, 
  onUpdate,
  onChildUpdate,
  children,
  isEditing = true 
}) => {
  return (
    <DraggableBlock 
      block={block} 
      onUpdate={onUpdate}
      onChildUpdate={onChildUpdate}
      isEditing={isEditing}
    >
      <div className="w-full h-full min-h-[100px] bg-blue-500/10 border-2 border-dashed border-blue-400/30 rounded-lg p-4">
        {children}
        {block.children?.map(child => (
          <div key={child.id} className="mb-4 last:mb-0">
            {/* Child blocks will be rendered here */}
          </div>
        ))}
      </div>
    </DraggableBlock>
  );
};

export default ContainerBlock;