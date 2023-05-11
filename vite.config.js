import { defineConfig } from 'vite';

export default defineConfig({
  root: 'client',
  build: {
    // Relative to the root
    outDir: '../dist',
  },
  define: {
    '__VERSION__': JSON.stringify(process.env.npm_package_version),
  }
});
