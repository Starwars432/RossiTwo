import { create } from 'zustand';
import { supabase } from '../supabase';
import { Block, Component } from '../types/editor';

interface ComponentState {
  components: Component[];
  loading: boolean;
  error: string | null;
  loadComponents: () => Promise<void>;
  saveComponent: (name: string, blocks: Block[], category: string, description?: string) => Promise<void>;
  deleteComponent: (id: string) => Promise<void>;
}

export const useComponentStore = create<ComponentState>((set) => ({
  components: [],
  loading: false,
  error: null,

  loadComponents: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('components')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ components: data || [] });
    } catch (error) {
      console.error('Error loading components:', error);
      set({ error: 'Failed to load components' });
    } finally {
      set({ loading: false });
    }
  },

  saveComponent: async (name, blocks, category, description) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('components')
        .insert({
          name,
          blocks,
          category,
          description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        components: [data, ...state.components]
      }));
    } catch (error) {
      console.error('Error saving component:', error);
      set({ error: 'Failed to save component' });
    } finally {
      set({ loading: false });
    }
  },

  deleteComponent: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('components')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        components: state.components.filter(c => c.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting component:', error);
      set({ error: 'Failed to delete component' });
    } finally {
      set({ loading: false });
    }
  }
}));

// Set up real-time subscriptions
supabase
  .channel('components')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'components' }, () => {
    const store = useComponentStore.getState();
    store.loadComponents();
  })
  .subscribe();