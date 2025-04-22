import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    },
    assetsDir: 'assets',
    sourcemap: true
  },
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    fs: {
      strict: false,
      allow: ['.']
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  preview: {
    port: 5173,
    host: true,
    strictPort: true
  }
});