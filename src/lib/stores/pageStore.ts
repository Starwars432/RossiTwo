import { create } from 'zustand';
import { supabase } from '../supabase';
import { Page } from '../types/editor';

interface PageState {
  pages: Page[];
  currentPage: Page | null;
  loading: boolean;
  error: string | null;
  loadPages: () => Promise<void>;
  loadPage: (id: string) => Promise<Page | null>;
  savePage: (page: Page) => Promise<void>;
  createPage: (title: string) => Promise<Page>;
  renamePage: (id: string, title: string) => Promise<void>;
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
      set({ pages: data || [], loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load pages';
      set({ error: message, loading: false });
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
      set({ currentPage: data, loading: false });
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load page';
      set({ error: message, loading: false });
      return null;
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
      
      set(state => ({
        currentPage: data,
        pages: state.pages.map(p => p.id === data.id ? data : p),
        loading: false
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save page';
      set({ error: message, loading: false });
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
        is_draft: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('pages')
        .insert(newPage)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from insert');

      set(state => ({
        pages: [data, ...state.pages],
        loading: false
      }));

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create page';
      set({ error: message, loading: false });
      throw error;
    }
  },

  renamePage: async (id, title) => {
    set({ loading: true, error: null });
    try {
      const slug = title.toLowerCase().replace(/\s+/g, '-');
      const { error } = await supabase
        .from('pages')
        .update({ title, slug, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        pages: state.pages.map(p => p.id === id ? { ...p, title, slug } : p),
        currentPage: state.currentPage?.id === id 
          ? { ...state.currentPage, title, slug }
          : state.currentPage,
        loading: false
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to rename page';
      set({ error: message, loading: false });
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

      set(state => ({
        pages: state.pages.filter(p => p.id !== id),
        currentPage: state.currentPage?.id === id ? null : state.currentPage,
        loading: false
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete page';
      set({ error: message, loading: false });
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