import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ command, mode }) => {
  const isVisualEditor = process.env.ENABLE_VISUAL_EDITOR === 'true';
  const isDev = mode === 'development';
  
  return {
    plugins: [react()],
    base: '/',
    server: {
      port: 5175,
      host: true,
      hmr: {
        overlay: true,
        clientPort: 443,
        path: 'ws'
      }
    },
    preview: {
      port: 5175,
      host: true
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      manifest: true,
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'editor-vendor': [
              'quill',
              '@tiptap/react',
              'grapesjs',
              'grapesjs-preset-webpage'
            ],
            'ui-vendor': [
              'framer-motion',
              'lucide-react'
            ],
          },
        },
      },
      copyPublicDir: true,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    define: {
      '__ENABLE_VISUAL_EDITOR__': JSON.stringify(isVisualEditor)
    }
  };
});