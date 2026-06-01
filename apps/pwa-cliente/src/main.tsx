// main.tsx — Bootstrap de la aplicación NachoPps
// 1. Restaurar tema guardado
// 2. Intentar restaurar sesión (GET /me)
// 3. Montar React
// 4. El router decide si mostrar login o app

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { useAuthStore } from './store/auth.store';
import { AppRouter } from './router/index';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './api/queryClient';
import './styles.css';

// ─── Restaurar tema persistido ──────────────────────────────────
const savedTheme = localStorage.getItem('nachopps-theme');
if (savedTheme === 'dark' || savedTheme === 'light') {
  document.documentElement.setAttribute('data-theme', savedTheme);
}

// ─── Escuchar auth:expired para forzar logout ───────────────────
window.addEventListener('auth:expired', () => {
  useAuthStore.getState().logout();
});

// ─── Restaurar sesión e iniciar app ─────────────────────────────
async function bootstrap() {
  // Intentar restaurar sesión con cookie existente
  await useAuthStore.getState().restore();

  // Registrar Service Worker para soporte Offline PWA
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Registro de SW omitido:', err);
      });
    });
  }

  // Montar React
  const root = createRoot(document.getElementById('root')!);

  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      </QueryClientProvider>
    </StrictMode>,
  );
}

bootstrap();
