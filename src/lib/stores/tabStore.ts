import { create } from 'zustand';
import { Page } from '../types/editor';

interface TabState {
  openTabs: string[];
  activeTab: string | null;
  pages: Record<string, Page>;
  addTab: (pageId: string, page: Page) => void;
  removeTab: (pageId: string) => void;
  setActiveTab: (pageId: string) => void;
  updatePage: (pageId: string, page: Page) => void;
}

export const useTabStore = create<TabState>((set) => ({
  openTabs: [],
  activeTab: null,
  pages: {},

  addTab: (pageId, page) => {
    set(state => ({
      openTabs: state.openTabs.includes(pageId) 
        ? state.openTabs 
        : [...state.openTabs, pageId],
      activeTab: pageId,
      pages: { ...state.pages, [pageId]: page }
    }));
  },

  removeTab: (pageId) => {
    set(state => {
      const { [pageId]: removed, ...remainingPages } = state.pages;
      const newTabs = state.openTabs.filter(id => id !== pageId);
      
      return {
        openTabs: newTabs,
        activeTab: state.activeTab === pageId 
          ? newTabs[newTabs.length - 1] || null 
          : state.activeTab,
        pages: remainingPages
      };
    });
  },

  setActiveTab: (pageId) => {
    set({ activeTab: pageId });
  },

  updatePage: (pageId, page) => {
    set(state => ({
      pages: { ...state.pages, [pageId]: page }
    }));
  }
}));