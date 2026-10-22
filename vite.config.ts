/**
 * Configurazione Vite.
 * Plugin: React (JSX), Tailwind CSS v4.
 * Alias: "@/" punta a "src/" per import corti.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
});
