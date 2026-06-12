// components/ui/ToastProvider.tsx — toasts globales (reemplazo de window.__toast)

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
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

const sinToast = (prev: ToastItem[], id: string) => prev.filter((t) => t.id !== id);

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

export function ToastProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((opts: ToastOptions) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...opts, id }]);
    setTimeout(() => {
      setToasts((prev) => sinToast(prev, id));
    }, 3600);
  }, []);

  const ctxValue = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={ctxValue}>
      {children}
      <div className="toast-host">
        {toasts.map((t) => <ToastItem key={t.id} t={t} />)}
      </div>
    </ToastContext.Provider>
  );
}
