import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isVisualEditor = process.env.ENABLE_VISUAL_EDITOR === 'true';
  
  return {
    plugins: [react()],
    base: '/',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html')
        }
      },
      assetsDir: 'assets',
      sourcemap: true,
      // Ensure we generate a clean build
      manifest: true,
      // Improve chunking strategy
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true
    },
    css: {
      postcss: true,
      // Enable source maps for CSS in development
      devSourcemap: true
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
    },
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-scroll',
        '@splinetool/react-spline',
        'framer-motion',
        'react-dropzone',
        'react-intersection-observer',
        'lucide-react'
      ]
    }
  };
});