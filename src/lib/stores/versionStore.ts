import { create } from 'zustand';
import { supabase } from '../supabase';

interface PageVersion {
  id: string;
  page_id: string;
  version: number;
  content: any;
  metadata: any;
  created_at: string;
  created_by: string;
  comment: string;
}

interface VersionState {
  versions: PageVersion[];
  loading: boolean;
  error: string | null;
  loadVersions: (pageId: string) => Promise<void>;
  revertToVersion: (pageId: string, versionId: string) => Promise<void>;
}

export const useVersionStore = create<VersionState>((set) => ({
  versions: [],
  loading: false,
  error: null,

  loadVersions: async (pageId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('page_versions')
        .select('*')
        .eq('page_id', pageId)
        .order('version', { ascending: false });

      if (error) throw error;
      set({ versions: data || [] });
    } catch (error) {
      console.error('Error loading versions:', error);
      set({ error: 'Failed to load versions' });
    } finally {
      set({ loading: false });
    }
  },

  revertToVersion: async (pageId: string, versionId: string) => {
    set({ loading: true, error: null });
    try {
      // Get version data
      const { data: version, error: versionError } = await supabase
        .from('page_versions')
        .select('content, metadata')
        .eq('id', versionId)
        .single();

      if (versionError) throw versionError;

      // Update page with version data
      const { error: updateError } = await supabase
        .from('pages')
        .update({
          content: version.content,
          metadata: version.metadata,
          updated_at: new Date().toISOString()
        })
        .eq('id', pageId);

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error reverting version:', error);
      set({ error: 'Failed to revert version' });
    } finally {
      set({ loading: false });
    }
  }
}));