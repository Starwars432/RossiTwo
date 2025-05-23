import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Block, Breakpoint } from '../../../lib/types/editor';
import BlockRenderer from '../BlockRenderer';

interface ContainerBlockProps {
  block: Block;
  onUpdate: (updatedBlock: Block) => void;
  isEditing: boolean;
  breakpoint: Breakpoint;
}

const ContainerBlock: React.FC<ContainerBlockProps> = ({ block, onUpdate, isEditing, breakpoint }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleChildUpdate = (index: number, updatedChild: Block) => {
    const updatedChildren = [...(block.children || [])];
    updatedChildren[index] = updatedChild;
    onUpdate({
      ...block,
      children: updatedChildren
    });
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    ...(block.styles as React.CSSProperties)
  };

  return (
    <motion.div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={containerStyles}
    >
      {isEditing && isHovered && (
        <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Container Block
        </div>
      )}
      {block.children?.map((child, index) => (
        <BlockRenderer
          key={child.id}
          block={child}
          onUpdate={(updatedBlock) => handleChildUpdate(index, updatedBlock)}
          isEditing={isEditing}
          breakpoint={breakpoint}
        />
      ))}
    </motion.div>
  );
};

export default ContainerBlock;