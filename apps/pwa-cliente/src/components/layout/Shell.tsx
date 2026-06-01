// components/layout/Shell.tsx — App chrome: sidebar + topbar + contenido

import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  const online = useOnlineStatus();

  return (
    <div className="app">
      {!online && (
        <div className="offline-banner">
          <OfflineIcon />
          Sin conexión. Las acciones que modifican datos están pausadas.
        </div>
      )}
      <Sidebar />
      <div className="main">
        <Header />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}

function OfflineIcon() {
  return (
    <svg className="ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 1 23 23" />
      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
      <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
      <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <path d="M12 20h.01" />
    </svg>
  );
}
