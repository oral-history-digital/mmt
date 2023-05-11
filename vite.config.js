import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

console.log(path.resolve(__dirname, 'client/modules'))

export default defineConfig({
  plugins: [
    // …
    react({
      // Use React plugin in all *.jsx and *.tsx files
      include: '**/*.{jsx,tsx}',
    }),
  ],
  root: 'client',
  build: {
    // Relative to the root
    outDir: '../dist',
  },
  define: {
    '__VERSION__': JSON.stringify(process.env.npm_package_version),
  },
  server: {
    port: 4000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        //secure: false,
      },
    },
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'client'),
      modules: path.resolve(__dirname, 'client/modules'),
    },
  },
});
