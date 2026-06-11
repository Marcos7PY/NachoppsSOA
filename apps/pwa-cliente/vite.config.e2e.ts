/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración usada por el harness e2e de Playwright (pnpm nx e2e pwa-cliente).
// Sirve la PWA en same-origin (:4200) y proxea /v1 y /notificaciones a Kong (:8000),
// evitando el bloqueo CORS del cross-origin directo :4200→:8000.
// VITE_API_BASE_URL se inyecta como '' desde playwright.config.ts (webServer.env).
export default defineConfig({
  cacheDir: '../../node_modules/.vite/apps/pwa-cliente',
  server: {
    port: 4200,
    host: 'localhost',
    proxy: {
      '/v1': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/notificaciones': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
  preview: { port: 4200, host: 'localhost' },
  plugins: [react()],
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: { transformMixedEsModules: true },
  },
  define: { 'import.meta.vitest': undefined },
});
