// screens/ops/PedidosScreen.tsx — Lista de pedidos activos con filtro por área

import { useEffect, useState } from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { usePedidosQuery } from '../../hooks/queries/usePedidosQuery';
import type { EstadoPedido } from '../../types/pedido.types';

const NEXT_ESTADO: Partial<Record<EstadoPedido, EstadoPedido>> = {
  PENDIENTE: 'EN_PREPARACION',
  EN_PREPARACION: 'LISTO',
  LISTO: 'ENTREGADO',
};

const NEXT_LABEL: Partial<Record<EstadoPedido, string>> = {
  PENDIENTE: 'Preparar',
  EN_PREPARACION: 'Marcar listo',
  LISTO: 'Entregar',
};

const FILTROS_ESTADO: { key: EstadoPedido | 'TODOS'; label: string }[] = [
  { key: 'TODOS', label: 'Todos' },
  { key: 'PENDIENTE', label: 'Pendientes' },
  { key: 'EN_PREPARACION', label: 'En preparación' },
  { key: 'LISTO', label: 'Listos' },
  { key: 'ENTREGADO', label: 'Entregados' },
];

export function PedidosScreen() {
  const online = useOnlineStatus();
  const { pedidos, loading, error, fetch, avanzarEstado } = usePedidosQuery();
  const [filtro, setFiltro] = useState<EstadoPedido | 'TODOS'>('TODOS');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // La carga inicial y re-fetch en foco es manejado automáticamente por React Query.

  const pedidosSalon = pedidos.filter((p) => {
    const num = Number(p.mesaNumero) || 0;
    return num < 90;
  });

  const pedidosFiltrados = filtro === 'TODOS'
    ? pedidosSalon
    : pedidosSalon.filter((p) => p.estado === filtro);


  const handleAvanzar = async (id: string, estado: EstadoPedido) => {
    if (!online) return;
    setActionLoading(id);
    try {
      await avanzarEstado(id, estado);
    } catch {
      // Error se muestra por el store
    } finally {
      setActionLoading(null);
    }
  };

  // ─── Loading ────────────────────────────────────────────────
  if (loading && pedidos.length === 0) {
    return (
      <div>
        <div className="page-h"><div><h1>Pedidos</h1><div className="sub">Cargando…</div></div></div>
        <div className="table-wrap">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 16, alignItems: 'center' }}>
              <div className="skel" style={{ width: 50, height: 18 }} />
              <div className="skel" style={{ width: 80, height: 18 }} />
              <div className="skel" style={{ flex: 1, height: 18 }} />
              <div className="skel" style={{ width: 70, height: 30, borderRadius: 6 }} />
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
        <div className="page-h"><div><h1>Pedidos</h1></div></div>
        <div className="banner err" style={{ marginBottom: 16 }}>
          <AlertIcon />
          <span>{error}</span>
          <span className="spacer" />
          <button className="btn btn-sm btn-ghost" onClick={() => fetch()}>Reintentar</button>
        </div>
      </div>
    );
  }

  // ─── Data ───────────────────────────────────────────────────
  return (
    <div>
      <div className="page-h">
        <div>
          <h1>Pedidos</h1>
          <div className="sub">{pedidosSalon.length} pedidos activos</div>
        </div>
        <span className="spacer" />
        <button className="btn btn-ghost btn-sm" onClick={() => fetch()} title="Refrescar">
          <RefreshIcon />
        </button>
      </div>

      {/* Filtros */}
      <div className="filters" style={{ marginBottom: 18 }}>
        {FILTROS_ESTADO.map((f) => (
          <button
            key={f.key}
            className={`chip ${filtro === f.key ? 'on' : ''}`}
            onClick={() => setFiltro(f.key)}
          >
            {f.label}
            <span className="n">
              {f.key === 'TODOS' ? pedidosSalon.length : pedidosSalon.filter((p) => p.estado === f.key).length}
            </span>
          </button>
        ))}
      </div>


      {pedidosFiltrados.length === 0 ? (
        <div className="empty">
          <div className="e-ic"><ListIcon /></div>
          <h3>Sin pedidos</h3>
          <p>No hay pedidos que coincidan con el filtro seleccionado.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="dt">
            <thead>
              <tr>
                <th>Mesa</th>
                <th>Estado</th>
                <th>Ítems</th>
                <th>Total</th>
                <th>Tiempo</th>
                <th style={{ textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((p) => {
                const next = NEXT_ESTADO[p.estado];
                const nextLabel = NEXT_LABEL[p.estado];
                return (
                  <tr key={p.id}>
                    <td>
                      <strong style={{ fontSize: 16 }}>Mesa {p.mesaNumero}</strong>
                    </td>
                    <td>
                      <span className={`badge dot ${p.estadoClass}`}>{p.estadoLabel}</span>
                    </td>
                    <td>
                      <span className="mono">{p.cantidadItems}</span> ítems
                    </td>
                    <td>
                      <strong className="mono">S/ {p.total.toFixed(2)}</strong>
                    </td>
                    <td>
                      <span className="muted">{p.tiempoTranscurrido}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {next && nextLabel && (
                        <button
                          className="btn btn-sm btn-primary"
                          disabled={actionLoading === p.id || !online}
                          onClick={() => handleAvanzar(p.id, next)}
                        >
                          {actionLoading === p.id ? (
                            <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                          ) : (
                            nextLabel
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
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

function ListIcon() {
  return (
    <svg className="ic" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}
