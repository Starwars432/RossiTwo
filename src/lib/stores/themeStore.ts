import create from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme } from '../types/theme';
import { ThemePreset, defaultPresets } from '../types/theme';
import { supabase } from '../supabase';

interface ThemeState {
  currentTheme: Theme;
  presets: ThemePreset[];
  setTheme: (theme: Theme) => void;
  saveTheme: () => Promise<void>;
  loadTheme: () => Promise<void>;
  savePreset: (name: string, theme: Theme) => Promise<void>;
  deletePreset: (id: string) => Promise<void>;
  applyPreset: (preset: ThemePreset) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: defaultPresets[0].theme,
      presets: defaultPresets,

      setTheme: (theme: Theme) => {
        set({ currentTheme: theme });
        // Apply theme to CSS variables
        Object.entries(theme.colors).forEach(([key, value]) => {
          document.documentElement.style.setProperty(`--color-${key}`, value);
        });
        Object.entries(theme.fonts).forEach(([key, value]) => {
          document.documentElement.style.setProperty(`--font-${key}`, value);
        });
        Object.entries(theme.spacing).forEach(([key, value]) => {
          document.documentElement.style.setProperty(`--spacing-${key}`, value);
        });
      },

      saveTheme: async () => {
        const { currentTheme } = get();
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) return;

        const { error } = await supabase
          .from('editor_settings')
          .upsert({
            user_id: user.id,
            theme: currentTheme,
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error saving theme:', error);
          throw error;
        }
      },

      loadTheme: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) {
          // If no user is logged in, use default theme
          get().setTheme(defaultPresets[0].theme);
          return;
        }

        const { data, error } = await supabase
          .from('editor_settings')
          .select('theme')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading theme:', error);
          // On error, fallback to default theme
          get().setTheme(defaultPresets[0].theme);
          return;
        }

        if (data?.theme) {
          get().setTheme(data.theme as Theme);
        } else {
          // If no theme settings exist for the user, create default settings
          const { error: createError } = await supabase
            .from('editor_settings')
            .insert({
              user_id: user.id,
              theme: defaultPresets[0].theme
            });

          if (createError) {
            console.error('Error creating default theme settings:', createError);
          }
          
          // Use default theme
          get().setTheme(defaultPresets[0].theme);
        }
      },

      savePreset: async (name: string, theme: Theme) => {
        const id = name.toLowerCase().replace(/\s+/g, '-');
        const newPreset: ThemePreset = { id, name, theme };

        const { data, error } = await supabase
          .from('theme_presets')
          .insert({ ...newPreset })
          .select()
          .single();

        if (error) {
          console.error('Error saving preset:', error);
          throw error;
        }

        set(state => ({
          presets: [...state.presets, data]
        }));
      },

      deletePreset: async (id: string) => {
        const { error } = await supabase
          .from('theme_presets')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting preset:', error);
          throw error;
        }

        set(state => ({
          presets: state.presets.filter(preset => preset.id !== id)
        }));
      },

      applyPreset: (preset: ThemePreset) => {
        get().setTheme(preset.theme);
      }
    }),
    {
      name: 'theme-storage',
      getStorage: () => localStorage
    }
  )
);