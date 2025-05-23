import React from 'react';
import { Block, Breakpoint } from '../../lib/types/editor';
import TextBlock from './blocks/Text';
import ImageBlock from './blocks/Image';
import ContainerBlock from './blocks/Container';

interface BlockRendererProps {
  block: Block;
  onUpdate: (updatedBlock: Block) => void;
  isEditing: boolean;
  breakpoint: Breakpoint;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ block, onUpdate, isEditing, breakpoint }) => {
  const components = {
    text: TextBlock,
    image: ImageBlock,
    container: ContainerBlock,
    row: ContainerBlock,
    column: ContainerBlock,
    section: ContainerBlock,
    component: ContainerBlock
  } as const;

  const Component = components[block.type];
  if (!Component) {
    console.warn(`No component found for block type: ${block.type}`);
    return null;
  }

  // Merge responsive styles based on breakpoint
  const getResponsiveStyles = () => {
    const baseStyles = { ...block.styles };
    if (!baseStyles) return {};
    
    const { mobile, tablet, ...rest } = baseStyles;
    
    if (breakpoint === 'mobile' && mobile) {
      return { ...rest, ...mobile };
    }
    if (breakpoint === 'tablet' && tablet) {
      return { ...rest, ...tablet };
    }
    return rest;
  };

  const blockWithResponsiveStyles = {
    ...block,
    styles: getResponsiveStyles()
  };

  return <Component 
    block={blockWithResponsiveStyles} 
    onUpdate={onUpdate} 
    isEditing={isEditing} 
    breakpoint={breakpoint} 
  />;
};

export default BlockRenderer;