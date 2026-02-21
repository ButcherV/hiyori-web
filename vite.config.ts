import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // three.js 生态单独一包（最重，约 900KB）
          if (id.includes('three') || id.includes('@react-three')) {
            return 'chunk-three';
          }
          // framer-motion 单独一包
          if (id.includes('framer-motion')) {
            return 'chunk-motion';
          }
          // React 核心单独一包
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router')
          ) {
            return 'chunk-react';
          }
        },
      },
    },
  },
});
