// components/domain/ItemKDS.tsx — KDS card for a pedido in the cocina view

import type { PedidoVM, PedidoItemVM, EstadoPedido } from '../../types/pedido.types';

interface ItemKDSProps {
  pedido: PedidoVM;
  onAvanzarItem?: (itemId: string, estado: EstadoPedido) => void;
}

const ITEM_NEXT: Partial<Record<EstadoPedido, { next: EstadoPedido; label: string }>> = {
  PENDIENTE:      { next: 'EN_PREPARACION', label: 'Preparar' },
  EN_PREPARACION: { next: 'LISTO',          label: 'Listo' },
};

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const NoteIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
  </svg>
);

function getUrgencyClass(createdAt: string): string {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins > 15) return 'late';
  if (mins >= 10) return 'warn';
  return 'fresh';
}

function getElapsedLabel(createdAt: string): string {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'Ahora';
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m`;
}

function ItemRow({
  item,
  onAvanzar,
}: {
  item: PedidoItemVM;
  onAvanzar?: (itemId: string, estado: EstadoPedido) => void;
}) {
  const transition = ITEM_NEXT[item.estado];

  return (
    <div className="kds-item" style={{ alignItems: 'flex-start' }}>
      <span className="q">{item.cantidad}×</span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontWeight: 700 }}>{item.nombre}</span>

        {item.notas && (
          <div className="note"><NoteIcon /> {item.notas}</div>
        )}

        {item.modificadores.length > 0 && (
          <div
            className="muted"
            style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}
          >
            {item.modificadores.map((m) => m.nombre).join(', ')}
          </div>
        )}
      </div>

      {transition && onAvanzar ? (
        <button
          type="button"
          className="btn btn-sm btn-soft"
          onClick={() => onAvanzar(item.id, transition.next)}
          style={{ flexShrink: 0 }}
        >
          {transition.label}
        </button>
      ) : (
        <span
          className="badge badge-ok"
          style={{ flexShrink: 0 }}
        >
          <CheckIcon />
          Listo
        </span>
      )}
    </div>
  );
}

function ItemKDS({ pedido, onAvanzarItem }: ItemKDSProps) {
  const urgency = getUrgencyClass(pedido.createdAt);
  const elapsed = getElapsedLabel(pedido.createdAt);

  return (
    <div className={`kds-card ${urgency}`}>
      <h4>
        Mesa {pedido.mesaNumero}
        <span className="spacer" />
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
          {elapsed}
        </span>
      </h4>

      <div className="kds-items">
        {pedido.items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            onAvanzar={onAvanzarItem}
          />
        ))}
      </div>
    </div>
  );
}

export default ItemKDS;
