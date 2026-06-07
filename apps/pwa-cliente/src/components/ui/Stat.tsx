// components/ui/Stat.tsx — tarjetas KPI reutilizables (MiniStat / HeroStat)

import type { ReactNode } from 'react';
import { Icons, type IconName } from './icons';

interface MiniStatProps {
  icon: IconName;
  color: string;
  soft: string;
  k: ReactNode;
  v: ReactNode;
  d?: ReactNode;
}

export function MiniStat({ icon, color, soft, k, v, d }: MiniStatProps) {
  const Ic = Icons[icon];
  return (
    <div className="stat">
      <div className="stat-head">
        <span className="stat-ic" style={{ background: soft, color }}><Ic s={17} /></span>
        <div className="k" style={{ margin: 0 }}>{k}</div>
      </div>
      <div className="vbig">{v}</div>
      {d != null && <div className="d" style={{ color: 'var(--muted)' }}>{d}</div>}
    </div>
  );
}

interface HeroStatProps {
  icon: IconName;
  color: string;
  soft: string;
  k: ReactNode;
  v: ReactNode;
  sub?: ReactNode;
  delta?: ReactNode;
  up?: boolean;
  children?: ReactNode;
}

export function HeroStat({ icon, color, soft, k, v, sub, delta, up, children }: HeroStatProps) {
  const Ic = Icons[icon];
  return (
    <div className="stat">
      <div className="stat-head">
        <span className="stat-ic" style={{ background: soft, color }}><Ic s={17} /></span>
        <div className="k" style={{ margin: 0 }}>{k}</div>
      </div>
      <div className="row" style={{ alignItems: 'baseline', gap: 9 }}>
        <div className="vbig">{v}</div>
        {delta && (
          <span className={`d ${up ? 'up' : 'down'}`} style={{ marginTop: 0 }}>
            {up ? <Icons.ArrowUp s={13} /> : <Icons.ArrowDown s={13} />}{delta}
          </span>
        )}
      </div>
      {children}
      {sub && <div className="d" style={{ color: 'var(--muted)' }}>{sub}</div>}
    </div>
  );
}
