import { create } from 'zustand';
import { supabase } from '../supabase';

interface MediaFile {
  id: string;
  filename: string;
  url: string;
  mime_type: string;
  size: number;
  created_at: string;
}

interface MediaState {
  files: MediaFile[];
  isLoading: boolean;
  error: string | null;
  loadFiles: () => Promise<void>;
  uploadFile: (file: File) => Promise<MediaFile>;
  deleteFile: (id: string, filename: string) => Promise<void>;
}

export const useMediaStore = create<MediaState>((set, get) => ({
  files: [],
  isLoading: false,
  error: null,

  loadFiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ files: data || [] });
    } catch (error) {
      set({ error: 'Failed to load media files' });
      console.error('Error loading media:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  uploadFile: async (file: File) => {
    set({ isLoading: true, error: null });
    try {
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filename, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filename);

      // Create database record
      const { data, error: dbError } = await supabase
        .from('media')
        .insert({
          filename,
          url: publicUrl,
          mime_type: file.type,
          size: file.size
        })
        .select()
        .single();

      if (dbError) throw dbError;
      if (!data) throw new Error('No data returned from insert');

      // Update local state
      const { files } = get();
      set({ files: [data, ...files] });

      return data;
    } catch (error) {
      set({ error: 'Failed to upload file' });
      console.error('Error uploading file:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteFile: async (id: string, filename: string) => {
    set({ isLoading: true, error: null });
    try {
      // Delete from Supabase Storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([filename]);

      if (storageError) throw storageError;

      // Delete database record
      const { error: dbError } = await supabase
        .from('media')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      // Update local state
      const { files } = get();
      set({ files: files.filter(file => file.id !== id) });
    } catch (error) {
      set({ error: 'Failed to delete file' });
      console.error('Error deleting file:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));