import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateBlockId, BlockMetadata } from '../utils/blockId';
import { BlockType } from '../types/editor';

interface BlockInstanceState {
  counters: Record<string, number>;
  createBlock: (type: BlockType) => { 
    id: string;
    metadata: BlockMetadata;
  };
  reset: () => void;
}

export const useBlockInstanceStore = create<BlockInstanceState>()(
  persist(
    (set, get) => ({
      counters: {},
      createBlock: (type: BlockType) => {
        const { counters } = get();
        const nextInstance = (counters[type] || 0) + 1;
        set({ counters: { ...counters, [type]: nextInstance } });
        return generateBlockId(type, nextInstance);
      },
      reset: () => set({ counters: {} })
    }),
    {
      name: 'block-instance-storage',
      version: 1
    }
  )
);