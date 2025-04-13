import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5555',
      '/socket.io': {
        target: 'http://localhost:5555',
        ws: true,
      },
    },
  },
});