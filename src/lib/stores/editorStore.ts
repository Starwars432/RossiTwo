import { create } from 'zustand';
import { produce } from 'immer';
import { Block } from '../types/editor';
import { createBlock } from '../utils/blockId';

interface EditorState {
  blocks: Block[];
  selectedBlockId: string | null;
  history: Block[][];
  currentIndex: number;
  addBlock: (blockData: Omit<Block, 'id' | 'order' | 'metadata'>) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  moveBlock: (oldIndex: number, newIndex: number) => void;
  selectBlock: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  blocks: [],
  selectedBlockId: null,
  history: [],
  currentIndex: -1,

  addBlock: (blockData) => {
    set(produce(state => {
      const { id, metadata } = createBlock(blockData.type, state.blocks.length + 1);
      const newBlock: Block = {
        ...blockData,
        id,
        metadata,
        order: state.blocks.length
      };
      state.blocks.push(newBlock);
      
      // Add to history
      state.history = state.history.slice(0, state.currentIndex + 1);
      state.history.push([...state.blocks]);
      state.currentIndex++;
    }));
  },

  updateBlock: (id, updates) => {
    set(produce(state => {
      const blockIndex = state.blocks.findIndex(b => b.id === id);
      if (blockIndex !== -1) {
        state.blocks[blockIndex] = { ...state.blocks[blockIndex], ...updates };
        
        // Add to history
        state.history = state.history.slice(0, state.currentIndex + 1);
        state.history.push([...state.blocks]);
        state.currentIndex++;
      }
    }));
  },

  deleteBlock: (id) => {
    set(produce(state => {
      state.blocks = state.blocks.filter(b => b.id !== id);
      if (state.selectedBlockId === id) {
        state.selectedBlockId = null;
      }
      
      // Add to history
      state.history = state.history.slice(0, state.currentIndex + 1);
      state.history.push([...state.blocks]);
      state.currentIndex++;
    }));
  },

  moveBlock: (oldIndex: number, newIndex: number) => {
    set(produce(state => {
      const block = state.blocks[oldIndex];
      state.blocks.splice(oldIndex, 1);
      state.blocks.splice(newIndex, 0, block);
      
      // Update order property
      state.blocks.forEach((block, index) => {
        block.order = index;
      });
      
      // Add to history
      state.history = state.history.slice(0, state.currentIndex + 1);
      state.history.push([...state.blocks]);
      state.currentIndex++;
    }));
  },

  selectBlock: (id) => {
    set({ selectedBlockId: id });
  },

  undo: () => {
    const { currentIndex, history } = get();
    if (currentIndex > 0) {
      set({
        blocks: [...history[currentIndex - 1]],
        currentIndex: currentIndex - 1
      });
    }
  },

  redo: () => {
    const { currentIndex, history } = get();
    if (currentIndex < history.length - 1) {
      set({
        blocks: [...history[currentIndex + 1]],
        currentIndex: currentIndex + 1
      });
    }
  },

  canUndo: () => get().currentIndex > 0,
  canRedo: () => get().currentIndex < get().history.length - 1,
}));