import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import { useMediaStore } from '../../../lib/stores/mediaStore';
import { Block, Breakpoint } from '../../../lib/types/editor';

interface ImageBlockProps {
  block: Block;
  onUpdate: (updatedBlock: Block) => void;
  isEditing: boolean;
  breakpoint: Breakpoint;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ block, onUpdate, isEditing }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { uploadFile } = useMediaStore();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadedFile = await uploadFile(file);
      onUpdate({
        ...block,
        src: uploadedFile.url,
        alt: file.name
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const imageStyles: React.CSSProperties = {
    maxWidth: '100%',
    height: 'auto',
    ...(block.styles as React.CSSProperties)
  };

  return (
    <motion.div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={imageStyles}
    >
      {isEditing && isHovered && (
        <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Image Block
        </div>
      )}
      {block.src ? (
        <img
          src={block.src}
          alt={block.alt || ''}
          className="max-w-full h-auto"
          onClick={() => isEditing && document.getElementById(`image-upload-${block.id}`)?.click()}
        />
      ) : (
        <div
          className="flex items-center justify-center bg-blue-500/10 border-2 border-dashed border-blue-400/30 rounded-lg p-8 cursor-pointer"
          onClick={() => isEditing && document.getElementById(`image-upload-${block.id}`)?.click()}
        >
          <ImageIcon className="w-12 h-12 text-blue-400" />
        </div>
      )}
      {isEditing && (
        <input
          type="file"
          id={`image-upload-${block.id}`}
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
      )}
    </motion.div>
  );
};

export default ImageBlock;