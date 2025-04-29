/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

export default defineConfig(({ command, mode }) => {
  const isVisualEditor = process.env.ENABLE_VISUAL_EDITOR === 'true';
  const isDev = mode === 'development';
  
  return {
    plugins: [
      react({
        babel: {
          plugins: [],
          parserOpts: {
            plugins: ['jsx', 'typescript']
          }
        }
      })
    ],
    base: '/',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html')
        },
        output: {
          manualChunks: {
            'vendor': [
              'react',
              'react-dom',
              'framer-motion',
              '@splinetool/react-spline'
            ],
            'ui': [
              'react-dropzone',
              'react-intersection-observer',
              'lucide-react'
            ]
          }
        }
      },
      assetsDir: 'assets',
      sourcemap: isDev || isVisualEditor,
      manifest: true,
      cssCodeSplit: true,
      minify: !isVisualEditor,
      watch: isVisualEditor ? {
        clearScreen: false,
        include: ['src/**', 'content/**'],
        exclude: ['node_modules/**', 'dist/**']
      } : null,
      reportCompressedSize: !isDev,
      chunkSizeWarningLimit: 1000,
      target: 'esnext'
    },
    css: {
      postcss: true,
      devSourcemap: true,
      modules: {
        generateScopedName: isDev ? '[name]__[local]__[hash:base64:5]' : '[hash:base64:8]'
      }
    },
    server: {
      port: 5175,
      host: true,
      strictPort: false,
      allowedHosts: [
        'devserver-preview--manifestillusions.netlify.app'
      ],
      fs: {
        strict: false,
        allow: ['.']
      },
      watch: {
        ignored: [
          '**/node_modules/**',
          '**/dist/**',
          '**/.git/**',
          '**/tsconfig*.json',
          '**/.vite/**'
        ],
        usePolling: false
      },
      hmr: {
        overlay: true,
        timeout: 5000
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    preview: {
      port: 5175,
      host: true,
      strictPort: false
    },
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
      ],
      exclude: []
    },
    define: {
      'process.env.ENABLE_VISUAL_EDITOR': JSON.stringify(isVisualEditor),
      'process.env.NODE_ENV': JSON.stringify(mode)
    },
    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
      target: 'esnext'
    },
    clearScreen: false,
    appType: 'spa'
  };
});