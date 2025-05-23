import { create } from 'zustand';
import { produce } from 'immer';
import { Block, Page } from '../types/editor';

interface EditorState {
  page: Page | null;
  history: Page[];
  currentIndex: number;
  setPage: (page: Page) => void;
  updateBlock: (blockIndex: number, updatedBlock: Block) => void;
  addBlock: (block: Block) => void;
  removeBlock: (blockIndex: number) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  page: null,
  history: [],
  currentIndex: -1,

  setPage: (page) => {
    set({
      page,
      history: [page],
      currentIndex: 0
    });
  },

  updateBlock: (blockIndex, updatedBlock) => {
    const { page, history, currentIndex } = get();
    if (!page) return;

    const newPage = produce(page, draft => {
      draft.blocks[blockIndex] = updatedBlock;
      draft.updated_at = new Date().toISOString();
    });

    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newPage);

    set({
      page: newPage,
      history: newHistory,
      currentIndex: newHistory.length - 1
    });
  },

  addBlock: (block) => {
    const { page, history, currentIndex } = get();
    if (!page) return;

    const newPage = produce(page, draft => {
      draft.blocks.push(block);
      draft.updated_at = new Date().toISOString();
    });

    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newPage);

    set({
      page: newPage,
      history: newHistory,
      currentIndex: newHistory.length - 1
    });
  },

  removeBlock: (blockIndex) => {
    const { page, history, currentIndex } = get();
    if (!page) return;

    const newPage = produce(page, draft => {
      draft.blocks.splice(blockIndex, 1);
      draft.updated_at = new Date().toISOString();
    });

    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newPage);

    set({
      page: newPage,
      history: newHistory,
      currentIndex: newHistory.length - 1
    });
  },

  moveBlock: (fromIndex, toIndex) => {
    const { page, history, currentIndex } = get();
    if (!page) return;

    const newPage = produce(page, draft => {
      const [movedBlock] = draft.blocks.splice(fromIndex, 1);
      draft.blocks.splice(toIndex, 0, movedBlock);
      draft.updated_at = new Date().toISOString();
    });

    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newPage);

    set({
      page: newPage,
      history: newHistory,
      currentIndex: newHistory.length - 1
    });
  },

  undo: () => {
    const { history, currentIndex } = get();
    if (currentIndex <= 0) return;

    set({
      page: history[currentIndex - 1],
      currentIndex: currentIndex - 1
    });
  },

  redo: () => {
    const { history, currentIndex } = get();
    if (currentIndex >= history.length - 1) return;

    set({
      page: history[currentIndex + 1],
      currentIndex: currentIndex + 1
    });
  },

  canUndo: () => {
    const { currentIndex } = get();
    return currentIndex > 0;
  },

  canRedo: () => {
    const { history, currentIndex } = get();
    return currentIndex < history.length - 1;
  },

  clearHistory: () => {
    const { page } = get();
    set({
      history: page ? [page] : [],
      currentIndex: 0
    });
  }
}));