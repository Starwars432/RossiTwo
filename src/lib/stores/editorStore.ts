import { create } from 'zustand';
import { produce } from 'immer';
import { Block } from '../types/editor';

interface EditorState {
  blocks: Block[];
  selectedBlockId: string | null;
  history: Block[][];
  currentIndex: number;
  addBlock: (block: Omit<Block, 'id' | 'order'>) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  moveBlock: (id: string, newParentId?: string, newOrder?: number) => void;
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
      const newBlock: Block = {
        id: crypto.randomUUID(),
        order: state.blocks.length,
        ...blockData,
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

  moveBlock: (id, newParentId, newOrder) => {
    set(produce(state => {
      const block = state.blocks.find(b => b.id === id);
      if (!block) return;

      if (newParentId) {
        block.parentId = newParentId;
      }
      
      if (typeof newOrder === 'number') {
        block.order = newOrder;
        // Reorder other blocks
        state.blocks
          .filter(b => b.parentId === block.parentId && b.id !== id)
          .forEach((b, i) => {
            if (b.order >= newOrder) {
              b.order = newOrder + i + 1;
            }
          });
      }
      
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