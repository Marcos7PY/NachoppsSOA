// components/ui/ToastProvider.tsx — toasts globales (reemplazo de window.__toast)

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { Icons, type IconName } from './icons';

export type ToastKind = 'ok' | 'err' | 'info';

export interface ToastOptions {
  title: string;
  msg?: string;
  icon?: IconName;
  kind?: ToastKind;
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  toast: (opts: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const KIND_COLOR: Record<ToastKind, string> = {
  ok: 'var(--ok)',
  err: 'var(--danger)',
  info: 'var(--info)',
};

function ToastItem({ t }: Readonly<{ t: ToastItem }>) {
  const Ic = Icons[t.icon ?? 'Check'];
  const kind = t.kind ?? 'ok';
  return (
    <div className={`toast ${kind}`}>
      <span className="t-ic" style={{ color: KIND_COLOR[kind] }}>
        <Ic s={18} />
      </span>
      <div>
        <b>{t.title}</b>
        {t.msg && <p>{t.msg}</p>}
      </div>
    </div>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((opts: ToastOptions) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...opts, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-host">
        {toasts.map((t) => <ToastItem key={t.id} t={t} />)}
      </div>
    </ToastContext.Provider>
  );
}
