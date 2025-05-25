import React from 'react';
import { Block, Breakpoint } from '../../lib/types/editor';
import TextBlock from './blocks/TextBlock';
import ImageBlock from './blocks/Image';
import ContainerBlock from './blocks/Container';

interface BlockRendererProps {
  block: Block;
  onUpdate: (block: Block) => void;
  onChildUpdate?: (child: Block) => void;
  isEditing?: boolean;
  breakpoint?: Breakpoint;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ 
  block, 
  onUpdate, 
  onChildUpdate,
  isEditing = true,
  breakpoint = 'desktop'
}) => {
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

  return (
    <Component
      block={block}
      onUpdate={onUpdate}
      onChildUpdate={onChildUpdate}
      isEditing={isEditing}
      breakpoint={breakpoint}
    />
  );
};

export default BlockRenderer;