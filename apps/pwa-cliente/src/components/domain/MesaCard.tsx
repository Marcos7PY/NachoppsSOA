// components/domain/MesaCard.tsx — Card for a mesa in the restaurant grid

import type { MesaVM } from '../../types/mesa.types';

interface MesaCardProps {
  mesa: MesaVM;
  selected?: boolean;
  onClick?: (mesa: MesaVM) => void;
}

const PeopleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ReceiptIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2-3-2Z" />
    <path d="M8 10h8" />
    <path d="M8 14h4" />
  </svg>
);

function MesaCard({ mesa, selected = false, onClick }: MesaCardProps) {
  const rootClass = [
    'mesa-card',
    mesa.estadoClass,
    selected ? 'sel' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const badgeClass = mesa.estadoClass === 'libre'
    ? 'badge badge-ok'
    : mesa.estadoClass === 'ocup'
      ? 'badge badge-accent'
      : mesa.estadoClass === 'resv'
        ? 'badge badge-info'
        : 'badge badge-muted';

  return (
    <button
      type="button"
      className={rootClass}
      onClick={() => onClick?.(mesa)}
      aria-label={`Mesa ${mesa.numero} — ${mesa.estadoLabel}`}
    >
      <div className="mesa-top">
        <div>
          <div className="mesa-num">{mesa.numero}</div>
          <div className="mesa-cap">
            <PeopleIcon />
            {mesa.capacidad}
          </div>
        </div>
        <span className={badgeClass}>{mesa.estadoLabel}</span>
      </div>

      <div className="mesa-meta">
        <div className="mesa-mi">
          <div className="k">Zona</div>
          <div className="v">{mesa.zona}</div>
        </div>

        {mesa.cuentaAsociada && (
          <div className="mesa-mi">
            <div className="k">Cuenta</div>
            <div className="v" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <ReceiptIcon />
              Activa
            </div>
          </div>
        )}
      </div>
    </button>
  );
}

export default MesaCard;
