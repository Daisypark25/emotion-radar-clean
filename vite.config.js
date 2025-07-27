import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    svgr({
      exportAsDefault: false, 
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
  },
});