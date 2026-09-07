import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    rollupOptions: {
      input: 'index.html'
    }
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {}
  }
});
