// components/domain/PedidoRow.tsx — Row component for a pedido in a list

import type { PedidoVM, EstadoPedido } from '../../types/pedido.types';

interface PedidoRowProps {
  pedido: PedidoVM;
  onAvanzar?: (id: string, estado: EstadoPedido) => void;
}

const NEXT_ESTADO: Partial<Record<EstadoPedido, { next: EstadoPedido; label: string }>> = {
  PENDIENTE:       { next: 'EN_PREPARACION', label: 'Preparar' },
  EN_PREPARACION:  { next: 'LISTO',          label: 'Listo' },
  LISTO:           { next: 'ENTREGADO',      label: 'Entregar' },
  ENTREGADO:       { next: 'PAGADO',         label: 'Cobrar' },
};

const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const formatCurrency = (amount: number): string =>
  `S/ ${amount.toFixed(2)}`;

function PedidoRow({ pedido, onAvanzar }: PedidoRowProps) {
  const transition = NEXT_ESTADO[pedido.estado];

  return (
    <div
      className="row"
      style={{
        padding: '12px 0',
        borderBottom: '1px solid var(--border)',
        gap: 16,
        flexWrap: 'wrap',
      }}
    >
      {/* Mesa number */}
      <span
        style={{
          fontWeight: 800,
          fontSize: 15,
          minWidth: 52,
        }}
      >
        Mesa {pedido.mesaNumero}
      </span>

      {/* Estado badge */}
      <span className={`badge ${pedido.estadoClass}`}>
        {pedido.estadoLabel}
      </span>

      {/* Item count */}
      <span
        className="muted"
        style={{ fontSize: 13, fontWeight: 600 }}
      >
        {pedido.cantidadItems} ítems
      </span>

      {/* Total */}
      <span
        className="mono"
        style={{ fontWeight: 700, fontSize: 14 }}
      >
        {formatCurrency(pedido.total)}
      </span>

      {/* Time elapsed */}
      <span
        className="muted"
        style={{
          fontSize: 12,
          fontWeight: 600,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <ClockIcon />
        {pedido.tiempoTranscurrido}
      </span>

      <span className="spacer" />

      {/* Advance button */}
      {transition && onAvanzar && (
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={() => onAvanzar(pedido.id, transition.next)}
        >
          {transition.label}
          <ChevronRightIcon />
        </button>
      )}
    </div>
  );
}

export default PedidoRow;
