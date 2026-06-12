// components/ui/StatKpi.tsx — tarjeta KPI compacta reutilizable (icono + label + valor).
// Usa los tokens de color del sistema; comparte el look de .stat de styles.css.

import type { ReactNode } from 'react';
import { Icons, type IconName } from './icons';

const TINT = {
  accent: { bg: 'var(--accent-soft)', fg: 'var(--accent)' },
  ok: { bg: 'var(--ok-soft)', fg: 'var(--ok-text)' },
  warn: { bg: 'var(--warn-soft)', fg: 'var(--warn-text)' },
  danger: { bg: 'var(--danger-soft)', fg: 'var(--danger-text)' },
  info: { bg: 'var(--info-soft)', fg: 'var(--info-text)' },
  purple: { bg: 'var(--purple-soft)', fg: 'var(--purple)' },
  muted: { bg: 'var(--surface-3)', fg: 'var(--text-2)' },
} as const;

export type StatTint = keyof typeof TINT;

interface StatKpiProps {
  icon: IconName;
  tint: StatTint;
  label: string;
  value: ReactNode;
}

export function StatKpi({ icon, tint, label, value }: Readonly<StatKpiProps>) {
  const Ic = Icons[icon];
  const c = TINT[tint];
  return (
    <div className="stat">
      <div className="stat-head">
        <span className="stat-ic" style={{ background: c.bg, color: c.fg }}><Ic s={18} /></span>
        <span className="k">{label}</span>
      </div>
      <div className="vbig">{value}</div>
    </div>
  );
}
