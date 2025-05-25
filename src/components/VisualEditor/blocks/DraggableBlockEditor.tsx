import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rnd } from 'react-rnd';
import { XCircle, GripVertical } from 'lucide-react';

interface DraggableItem {
  id: string;
  text: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface DraggableBlockEditorProps {
  items?: DraggableItem[];
  onChange?: (items: DraggableItem[]) => void;
}

const DraggableBlockEditor: React.FC<DraggableBlockEditorProps> = ({ items = [], onChange }) => {
  const [boxes, setBoxes] = useState<DraggableItem[]>(items);

  // Sync boxes state when items prop changes
  useEffect(() => {
    if (JSON.stringify(boxes) !== JSON.stringify(items)) {
      setBoxes(items);
    }
  }, [items]);

  const addBox = () => {
    const newBox: DraggableItem = {
      id: `box-${Date.now()}`,
      text: `Box ${boxes.length + 1}`,
      position: { x: 0, y: 0 },
      size: { width: 200, height: 100 }
    };
    const updatedBoxes = [...boxes, newBox];
    setBoxes(updatedBoxes);
    onChange?.(updatedBoxes);
  };

  const removeBox = (id: string) => {
    const updatedBoxes = boxes.filter(box => box.id !== id);
    setBoxes(updatedBoxes);
    onChange?.(updatedBoxes);
  };

  const updateBox = (id: string, updates: Partial<DraggableItem>) => {
    const updatedBoxes = boxes.map(box => 
      box.id === id ? { ...box, ...updates } : box
    );
    setBoxes(updatedBoxes);
    onChange?.(updatedBoxes);
  };

  return (
    <div className="relative w-full h-[400px] bg-black/50 rounded-lg border border-blue-400/30 p-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={addBox}
        className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Add Box
      </motion.button>

      <AnimatePresence>
        {boxes.map(box => (
          <DraggableBox
            key={box.id}
            item={box}
            onUpdate={(updates) => updateBox(box.id, updates)}
            onRemove={() => removeBox(box.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface DraggableBoxProps {
  item: DraggableItem;
  onUpdate: (updates: Partial<DraggableItem>) => void;
  onRemove: () => void;
}

const DraggableBox: React.FC<DraggableBoxProps> = ({
  item,
  onUpdate,
  onRemove
}) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Rnd
      position={item.position}
      size={item.size}
      onDragStart={() => setIsDragging(true)}
      onDragStop={(e, d) => {
        setIsDragging(false);
        onUpdate({ position: { x: d.x, y: d.y } });
      }}
      onResize={(e, direction, ref, delta, position) => {
        onUpdate({
          size: {
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height)
          },
          position
        });
      }}
      bounds="parent"
      dragHandleClassName="drag-handle"
      resizeHandleClasses={{
        top: 'resize-handle top',
        right: 'resize-handle right',
        bottom: 'resize-handle bottom',
        left: 'resize-handle left',
        topRight: 'resize-handle top-right',
        bottomRight: 'resize-handle bottom-right',
        bottomLeft: 'resize-handle bottom-left',
        topLeft: 'resize-handle top-left'
      }}
      className={`group ${isDragging ? 'z-50' : 'z-0'}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`relative w-full h-full bg-blue-500/20 border border-blue-400/30 rounded-lg p-4 ${
          isDragging ? 'opacity-50' : ''
        }`}
      >
        <div className="drag-handle absolute top-2 left-2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-4 h-4 text-blue-400" />
        </div>

        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 text-red-400 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100"
        >
          <XCircle className="w-5 h-5" />
        </button>

        <motion.div
          className="w-full h-full flex items-center justify-center"
          animate={{ scale: isDragging ? 1.1 : 1 }}
        >
          <input
            type="text"
            value={item.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            className="bg-transparent text-white text-center border-none outline-none w-full"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      </motion.div>
    </Rnd>
  );
};

export default DraggableBlockEditor;