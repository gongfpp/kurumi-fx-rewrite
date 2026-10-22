import { defineConfig } from 'vite';

// GitHub Pages project site: https://<owner>.github.io/kurumi-fx-rewrite/
export default defineConfig({
  base: '/kurumi-fx-rewrite/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
});