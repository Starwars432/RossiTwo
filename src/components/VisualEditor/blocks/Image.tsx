import React, { useRef } from 'react';
import { ImageIcon } from 'lucide-react';
import { Block } from '../../../lib/types/editor';
import DraggableBlock from './DraggableBlock';

interface ImageBlockProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ block, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onUpdate({ 
        content: reader.result as string,
        style: {
          ...block.style,
          backgroundImage: `url(${reader.result})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <DraggableBlock block={block} onUpdate={onUpdate}>
      {block.content ? (
        <img
          src={block.content}
          alt="Uploaded content"
          className="max-w-full h-auto cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        />
      ) : (
        <div
          className="flex items-center justify-center bg-blue-500/10 border-2 border-dashed border-blue-400/30 rounded-lg p-8 cursor-pointer w-full h-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="w-12 h-12 text-blue-400" />
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />
    </DraggableBlock>
  );
};

export default ImageBlock;