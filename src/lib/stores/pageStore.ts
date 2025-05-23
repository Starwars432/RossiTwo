import { create } from 'zustand';
import { supabase } from '../supabase';
import { Page } from '../types/editor';

interface PageState {
  pages: Page[];
  currentPage: Page | null;
  loading: boolean;
  error: string | null;
  loadPages: () => Promise<void>;
  loadPage: (id: string) => Promise<void>;
  savePage: (page: Page) => Promise<void>;
  createPage: (title: string) => Promise<Page>;
  deletePage: (id: string) => Promise<void>;
}

export const usePageStore = create<PageState>((set, get) => ({
  pages: [],
  currentPage: null,
  loading: false,
  error: null,

  loadPages: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ pages: data || [] });
    } catch (error) {
      console.error('Error loading pages:', error);
      set({ error: 'Failed to load pages' });
    } finally {
      set({ loading: false });
    }
  },

  loadPage: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ currentPage: data });
    } catch (error) {
      console.error('Error loading page:', error);
      set({ error: 'Failed to load page' });
    } finally {
      set({ loading: false });
    }
  },

  savePage: async (page) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('pages')
        .upsert({
          ...page,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      // Update local state
      set(state => ({
        currentPage: data,
        pages: state.pages.map(p => p.id === data.id ? data : p)
      }));
    } catch (error) {
      console.error('Error saving page:', error);
      set({ error: 'Failed to save page' });
    } finally {
      set({ loading: false });
    }
  },

  createPage: async (title) => {
    set({ loading: true, error: null });
    try {
      const slug = title.toLowerCase().replace(/\s+/g, '-');
      const newPage = {
        title,
        slug,
        blocks: [],
        metadata: {},
        is_draft: true
      };

      const { data, error } = await supabase
        .from('pages')
        .insert(newPage)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      set(state => ({
        pages: [data, ...state.pages]
      }));

      return data;
    } catch (error) {
      console.error('Error creating page:', error);
      set({ error: 'Failed to create page' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deletePage: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      set(state => ({
        pages: state.pages.filter(p => p.id !== id),
        currentPage: state.currentPage?.id === id ? null : state.currentPage
      }));
    } catch (error) {
      console.error('Error deleting page:', error);
      set({ error: 'Failed to delete page' });
    } finally {
      set({ loading: false });
    }
  }
}));

// Set up real-time subscriptions
supabase
  .channel('pages')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'pages' }, (payload) => {
    const store = usePageStore.getState();
    
    switch (payload.eventType) {
      case 'INSERT':
        store.loadPages();
        break;
      case 'UPDATE':
        if (store.currentPage?.id === payload.new.id) {
          store.loadPage(payload.new.id);
        }
        store.loadPages();
        break;
      case 'DELETE':
        store.loadPages();
        break;
    }
  })
  .subscribe();