import React from 'react';
import { Block } from '../../lib/types/editor';
import TextBlock from './blocks/Text';
import ImageBlock from './blocks/Image';
import ContainerBlock from './blocks/Container';

interface BlockRendererProps {
  block: Block;
  onUpdate: (block: Block) => void;
  isEditing?: boolean;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ block, onUpdate, isEditing = true }) => {
  const components = {
    text: TextBlock,
    image: ImageBlock,
    container: ContainerBlock,
    section: ContainerBlock,
    row: ContainerBlock,
    column: ContainerBlock,
  } as const;

  const Component = components[block.type];

  if (!Component) {
    console.warn(`No component found for block type: ${block.type}`);
    return null;
  }

  const handleUpdate = (updates: Partial<Block>) => {
    onUpdate({
      ...block,
      ...updates,
    });
  };

  const handleChildUpdate = (childBlock: Block) => {
    if (!block.children) return;
    
    const updatedChildren = block.children.map(child => 
      child.id === childBlock.id ? childBlock : child
    );

    handleUpdate({ children: updatedChildren });
  };

  return (
    <Component
      block={block}
      onUpdate={handleUpdate}
      onChildUpdate={handleChildUpdate}
      isEditing={isEditing}
    />
  );
};

export default BlockRenderer;