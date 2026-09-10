/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: Number(process.env.PORT) || 5173,
    strictPort: false,
    proxy: {
      '/pedidos': process.env.VITE_API_URL || 'http://localhost:3001',
      '/repartidores': process.env.VITE_API_URL || 'http://localhost:3001',
      '/metricas': process.env.VITE_API_URL || 'http://localhost:3001',
      '/zonas': process.env.VITE_API_URL || 'http://localhost:3001',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
});
