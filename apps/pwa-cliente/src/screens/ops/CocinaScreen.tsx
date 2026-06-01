// screens/ops/CocinaScreen.tsx — KDS (Kitchen Display System) con columnas por estado

import { useEffect, useState } from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { usePedidosQuery } from '../../hooks/queries/usePedidosQuery';
import type { PedidoVM, PedidoItemVM, EstadoPedido } from '../../types/pedido.types';

const COLUMNAS: { estado: EstadoPedido; label: string; color: string }[] = [
  { estado: 'PENDIENTE', label: 'Pendiente', color: 'var(--warn)' },
  { estado: 'EN_PREPARACION', label: 'En preparación', color: 'var(--info)' },
  { estado: 'LISTO', label: 'Listo', color: 'var(--ok)' },
];

const NEXT_ITEM_ESTADO: Partial<Record<EstadoPedido, EstadoPedido>> = {
  PENDIENTE: 'EN_PREPARACION',
  EN_PREPARACION: 'LISTO',
};

/** Calcular minutos transcurridos */
function minutosDesde(createdAt: string): number {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
}

/** Clase de urgencia por tiempo */
function urgenciaClass(mins: number): string {
  if (mins >= 15) return 'late';
  if (mins >= 10) return 'warn';
  return 'fresh';
}

/** Filtrar ítems de un pedido que pertenecen al área COCINA (o sin área definida) con un estado específico */
function itemsPorEstado(pedido: PedidoVM, estado: EstadoPedido): PedidoItemVM[] {
  return pedido.items.filter(
    (it) => (it.area === 'COCINA' || it.area === 'BAR') && it.estado === estado
  );
}

export function CocinaScreen() {
  const online = useOnlineStatus();
  const { pedidos, loading, error, fetch, avanzarItem } = usePedidosQuery();
  const [areaFiltro, setAreaFiltro] = useState<'TODAS' | 'COCINA' | 'BAR'>('TODAS');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // La carga inicial la maneja usePedidosQuery internamente

  const handleAvanzarItem = async (itemId: string, estado: EstadoPedido) => {
    if (!online) return;
    setActionLoading(itemId);
    try {
      await avanzarItem(itemId, estado);
    } catch {
      // Error handled by store
    } finally {
      setActionLoading(null);
    }
  };

  // ─── Loading ────────────────────────────────────────────────
  if (loading && pedidos.length === 0) {
    return (
      <div>
        <div className="page-h"><div><h1>Cocina (KDS)</h1><div className="sub">Cargando…</div></div></div>
        <div className="kds">
          {COLUMNAS.map((col) => (
            <div key={col.estado} className="kds-col">
              <div className="kds-col-h">
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: col.color }} />
                {col.label}
              </div>
              <div className="kds-list">
                {[1, 2].map((i) => (
                  <div key={i} className="kds-card" style={{ padding: 16 }}>
                    <div className="skel" style={{ width: 80, height: 18, marginBottom: 10 }} />
                    <div className="skel" style={{ width: '100%', height: 14, marginBottom: 6 }} />
                    <div className="skel" style={{ width: '60%', height: 14 }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Error ──────────────────────────────────────────────────
  if (error) {
    return (
      <div>
        <div className="page-h"><div><h1>Cocina (KDS)</h1></div></div>
        <div className="banner err" style={{ marginBottom: 16 }}>
          <AlertIcon />
          <span>{error}</span>
          <span className="spacer" />
          <button className="btn btn-sm btn-ghost" onClick={() => fetch()}>Reintentar</button>
        </div>
      </div>
    );
  }

  // ─── Data: construir tarjetas KDS por columna ───────────────
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="page-h">
        <div>
          <h1>Cocina (KDS)</h1>
          <div className="sub">Vista en tiempo real de pedidos</div>
        </div>
        <span className="spacer" />
        <div className="seg">
          {(['TODAS', 'COCINA', 'BAR'] as const).map((a) => (
            <button key={a} className={areaFiltro === a ? 'on' : ''} onClick={() => setAreaFiltro(a)}>
              {a === 'TODAS' ? 'Todo' : a.charAt(0) + a.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => fetch()} title="Refrescar">
          <RefreshIcon />
        </button>
      </div>

      <div className="kds" style={{ flex: 1 }}>
        {COLUMNAS.map((col) => {
          // Recopilar tarjetas: cada pedido que tenga ítems en este estado
          const tarjetas: { pedido: PedidoVM; items: PedidoItemVM[] }[] = [];
          for (const pedido of pedidos) {
            const items = itemsPorEstado(pedido, col.estado).filter(
              (it) => areaFiltro === 'TODAS' || it.area === areaFiltro,
            );
            if (items.length > 0) {
              tarjetas.push({ pedido, items });
            }
          }

          return (
            <div key={col.estado} className="kds-col">
              <div className="kds-col-h">
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: col.color }} />
                {col.label}
                <span className="cc">{tarjetas.length}</span>
              </div>
              <div className="kds-list">
                {tarjetas.length === 0 ? (
                  <div className="muted" style={{ textAlign: 'center', padding: 24, fontSize: 13 }}>
                    Sin pedidos
                  </div>
                ) : (
                  tarjetas.map(({ pedido, items }) => {
                    const mins = minutosDesde(pedido.createdAt);
                    const nextEstado = NEXT_ITEM_ESTADO[col.estado];

                    return (
                      <div key={`${pedido.id}-${col.estado}`} className={`kds-card ${urgenciaClass(mins)}`}>
                        <h4>
                          Mesa {pedido.mesaNumero}
                          {mins >= 15 ? (
                            <span className="badge badge-danger dot" style={{ marginLeft: 'auto' }}>{mins}m · DEMORA</span>
                          ) : (
                            <span className="muted" style={{ fontSize: 12, fontWeight: 600, marginLeft: 'auto' }}>
                              {mins < 1 ? 'Ahora' : `${mins} min`}
                            </span>
                          )}
                        </h4>
                        <div className="kds-items">
                          {items.map((item) => (
                            <div key={item.id} className="kds-item" style={{ justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', gap: 9 }}>
                                <span className="q">{item.cantidad}×</span>
                                <div>
                                  <span>{item.nombre}</span>
                                  {item.notas && <div className="note"><NoteIcon /> {item.notas}</div>}
                                  {item.modificadores.length > 0 && (
                                    <div className="note">
                                      {item.modificadores.map((m) => m.nombre).join(', ')}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {nextEstado && (
                                <button
                                  className="btn btn-sm btn-soft"
                                  disabled={actionLoading === item.id || !online}
                                  onClick={() => handleAvanzarItem(item.id, nextEstado)}
                                  title={nextEstado === 'EN_PREPARACION' ? 'Iniciar' : 'Listo'}
                                >
                                  {actionLoading === item.id ? (
                                    <span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} />
                                  ) : nextEstado === 'EN_PREPARACION' ? (
                                    <PlayIcon />
                                  ) : (
                                    <CheckIcon />
                                  )}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Inline SVG icons ──────────────────────────────────────────

function AlertIcon() {
  return (
    <svg className="ic" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg className="ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg className="ic" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}
