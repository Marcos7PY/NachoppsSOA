// screens/ops/PedidosScreen.tsx — Hub unificado de Pedidos (Salón + Delivery + Llevar).
// Rediseño del prototipo, cableado a usePedidosQuery. El "canal" se deriva de
// pedido.modalidad. Avance de etapa real vía avanzarEstado.
// Nota: el backend no tiene etapa EN_CAMINO ni asignación de repartidor; para
// delivery/llevar, LISTO → ENTREGADO ("Despachar").

import { useEffect, useMemo, useState } from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useNow } from '../../hooks/useNow';
import { usePedidosQuery } from '../../hooks/queries/usePedidosQuery';
import { Icons, type IconName } from '../../components/ui/icons';
import { fmt, elapsedMin, elapsedLabel } from '../../utils/format';
import { Comandero } from '../../components/comandero/Comandero';
import type { PedidoVM, EstadoPedido } from '../../types/pedido.types';
import {
  type Canal,
  CANAL_LABEL,
  CANAL_CLS,
  ETAPAS_PRODUCCION as ETAPAS,
  ESTADOS_PRODUCCION as ESTADOS_VISIBLES,
  FLOW_PEDIDO,
  SLA_MIN,
  nextEstadoComercial,
  nextLabelComercial,
  PERMITIR_OVERRIDE_PRODUCCION,
} from '../../domain/pedido.flow';

const CANAL_ICON: Record<Canal, IconName> = {
  SALON: 'Mesas',
  DELIVERY: 'Delivery',
  LLEVAR: 'Bag',
};
const CANAL_META: Record<Canal, { label: string; cls: string; ic: IconName }> = {
  SALON: { label: CANAL_LABEL.SALON, cls: CANAL_CLS.SALON, ic: CANAL_ICON.SALON },
  DELIVERY: { label: CANAL_LABEL.DELIVERY, cls: CANAL_CLS.DELIVERY, ic: CANAL_ICON.DELIVERY },
  LLEVAR: { label: CANAL_LABEL.LLEVAR, cls: CANAL_CLS.LLEVAR, ic: CANAL_ICON.LLEVAR },
};

/**
 * Siguiente estado accionable desde la pantalla Pedidos. "Cocina manda": la
 * producción la derivan los ítems, así que por defecto Pedidos solo avanza el
 * tramo comercial (LISTO → ENTREGADO). El override de producción es opt-in.
 */
function nextEstadoFor(p: PedidoVM): EstadoPedido | null {
  if (PERMITIR_OVERRIDE_PRODUCCION) {
    if (p.estado === 'PENDIENTE') return 'EN_PREPARACION';
    if (p.estado === 'EN_PREPARACION') return 'LISTO';
  }
  return nextEstadoComercial(p.estado);
}

function nextLabelFor(p: PedidoVM): string | null {
  if (PERMITIR_OVERRIDE_PRODUCCION) {
    if (p.estado === 'PENDIENTE') return 'Preparar';
    if (p.estado === 'EN_PREPARACION') return 'Marcar listo';
  }
  return nextLabelComercial(p.estado, p.canal);
}

type CanalFiltro = Canal | 'TODOS';

export function PedidosScreen() {
  const online = useOnlineStatus();
  const now = useNow();
  const { pedidos, nextCursor, loading, loadingMore, error, fetch, fetchMore, avanzarEstado } = usePedidosQuery();
  const [canal, setCanal] = useState<CanalFiltro>('TODOS');
  const [vista, setVista] = useState<'tablero' | 'lista'>('tablero');
  const [detalle, setDetalle] = useState<PedidoVM | null>(null);
  const [comandero, setComandero] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const visibles = useMemo(
    () => pedidos.filter((p) => ESTADOS_VISIBLES.has(p.estado) && (canal === 'TODOS' || p.canal === canal)),
    [pedidos, canal],
  );
  const countCanal = (c: CanalFiltro) =>
    pedidos.filter((p) => ESTADOS_VISIBLES.has(p.estado) && (c === 'TODOS' || p.canal === c)).length;

  const avanzar = async (p: PedidoVM) => {
    const next = nextEstadoFor(p);
    if (!next || !online) return;
    setActionLoading(p.id);
    try {
      await avanzarEstado(p.id, next);
      setDetalle(null);
    } catch {
      /* el error se muestra vía estado del hook */
    } finally {
      setActionLoading(null);
    }
  };

  // ─── Loading ────────────────────────────────────────────────
  if (loading && pedidos.length === 0) {
    return (
      <div>
        <div className="page-h"><div><h1>Pedidos</h1><div className="sub">Cargando…</div></div></div>
        <div className="ped-board">
          {ETAPAS.map((e) => (
            <div className="ped-col" key={e.estado}>
              <div className="ped-col-h"><span className="dot" style={{ background: e.color }} />{e.label}</div>
              <div className="ped-col-body">
                {[1, 2].map((i) => <div key={i} className="skel" style={{ height: 120, borderRadius: 'var(--r)' }} />)}
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
        <div className="page-h"><div><h1>Pedidos</h1></div></div>
        <div className="banner err" style={{ marginBottom: 16 }}>
          <Icons.Alert s={17} /><span>{error}</span>
          <span className="spacer" />
          <button className="btn btn-sm btn-ghost" onClick={() => fetch()}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="page-h">
        <div>
          <h1>Pedidos</h1>
          <div className="sub">{visibles.length} pedidos activos · Salón, delivery y para llevar</div>
        </div>
        <span className="spacer" />
        <div className="seg sm" style={{ marginRight: 4 }}>
          <button className={vista === 'tablero' ? 'on' : ''} onClick={() => setVista('tablero')}><Icons.Layers s={14} /> Tablero</button>
          <button className={vista === 'lista' ? 'on' : ''} onClick={() => setVista('lista')}><Icons.Pedidos s={14} /> Lista</button>
        </div>
        <button className="btn btn-primary" onClick={() => setComandero(true)}><Icons.Plus s={16} /> Nuevo pedido</button>
      </div>

      {/* Lente de canal */}
      <div className="canal-tabs">
        {(['TODOS', 'SALON', 'DELIVERY', 'LLEVAR'] as CanalFiltro[]).map((c) => {
          const meta = c === 'TODOS' ? null : CANAL_META[c];
          const Ic = meta ? Icons[meta.ic] : Icons.Layers;
          return (
            <button key={c} className={`canal-tab ${canal === c ? 'on' : ''} ${meta ? meta.cls : ''}`} onClick={() => setCanal(c)}>
              <Ic s={15} /> {meta ? meta.label : 'Todos'}
              <span className="ct-count">{countCanal(c)}</span>
            </button>
          );
        })}
        <span className="spacer" />
        <button className="btn btn-ghost btn-sm" onClick={() => fetch()} title="Refrescar"><Icons.Refresh s={15} /></button>
      </div>

      {vista === 'tablero' ? (
        <TableroView pedidos={visibles} onAvanzar={avanzar} onDetalle={setDetalle} actionLoading={actionLoading} online={online} now={now} />
      ) : (
        <ListaView pedidos={visibles} onAvanzar={avanzar} onDetalle={setDetalle} actionLoading={actionLoading} online={online} now={now} />
      )}

      {nextCursor && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 12, flex: 'none' }}>
          <button className="btn btn-ghost btn-sm" disabled={loadingMore} onClick={fetchMore}>
            {loadingMore ? <span className="spinner" /> : null} Cargar más
          </button>
        </div>
      )}

      {detalle && (
        <DetallePedido
          pedido={detalle}
          onClose={() => setDetalle(null)}
          onAvanzar={avanzar}
          actionLoading={actionLoading}
          online={online}
          now={now}
        />
      )}

      {comandero && (
        <Comandero
          onClose={() => setComandero(false)}
          onCreated={() => fetch()}
          initialCanal={canal === 'TODOS' ? 'SALON' : canal}
        />
      )}
    </div>
  );
}

interface ViewProps {
  pedidos: PedidoVM[];
  onAvanzar: (p: PedidoVM) => void;
  onDetalle: (p: PedidoVM) => void;
  actionLoading: string | null;
  online: boolean;
  now: number;
}

function TableroView({ pedidos, onAvanzar, onDetalle, actionLoading, online, now }: ViewProps) {
  return (
    <div className="ped-board">
      {ETAPAS.map((et) => {
        const cards = pedidos.filter((p) => p.estado === et.estado);
        return (
          <div className="ped-col" key={et.estado}>
            <div className="ped-col-h">
              <span className="dot" style={{ background: et.color }} />
              {et.label}
              <span className="cc">{cards.length}</span>
            </div>
            <div className="ped-col-body">
              {cards.length === 0 ? (
                <div className="ped-col-empty">Sin pedidos</div>
              ) : cards.map((p) => (
                <PedidoCard key={p.id} p={p} onAvanzar={onAvanzar} onDetalle={onDetalle} actionLoading={actionLoading} online={online} now={now} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function destino(p: PedidoVM) {
  if (p.canal === 'SALON') return <><b>Mesa {p.mesaNumero}</b></>;
  return <><b>{p.cliente ?? 'Cliente'}</b>{p.direccion && <div className="pc-sub"><Icons.Delivery s={12} /> {p.direccion}</div>}</>;
}

function PedidoCard({ p, onAvanzar, onDetalle, actionLoading, online, now }: { p: PedidoVM } & Omit<ViewProps, 'pedidos'>) {
  const meta = CANAL_META[p.canal];
  const mins = elapsedMin(p.createdAt, now);
  const tardio = mins >= SLA_MIN;
  const nextLabel = nextLabelFor(p);
  const Ic = Icons[meta.ic];

  return (
    <div className={`ped-card ${meta.cls}`} onClick={() => onDetalle(p)}>
      <div className="pc-top">
        <span className={`tag-canal ${meta.cls}`}><Ic s={12} /> {meta.label}</span>
        <span className="pc-id mono">{p.id.slice(0, 6)}</span>
        <span className="spacer" />
        <span className={`pc-time ${tardio ? 'late' : ''}`}>
          <Icons.Clock s={12} /> {elapsedLabel(p.createdAt, now)}{tardio ? <span className="sr-only"> · en demora</span> : null}
        </span>
      </div>
      <div className="pc-where">{destino(p)}</div>
      <div className="pc-items">
        {p.items.slice(0, 3).map((it) => (
          <div className="pc-item" key={it.id}><span className="pc-q">{it.cantidad}×</span><span className="pc-n">{it.nombre}</span></div>
        ))}
        {p.items.length > 3 && <div className="pc-more">+{p.items.length - 3} más</div>}
      </div>
      <div className="pc-foot">
        {p.canal === 'DELIVERY' && p.proveedor
          ? <span className="pill-soft">{p.proveedor}</span>
          : <span className="mono pc-total">{fmt(p.total)}</span>}
        <span className="spacer" />
        {nextLabel && (
          <button className="btn btn-sm btn-primary" aria-label={`${nextLabel} pedido ${p.id.slice(0, 6)}`} disabled={actionLoading === p.id || !online} onClick={(e) => { e.stopPropagation(); onAvanzar(p); }}>
            {actionLoading === p.id ? <span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} /> : nextLabel}
          </button>
        )}
      </div>
    </div>
  );
}

function ListaView({ pedidos, onAvanzar, onDetalle, actionLoading, online, now }: ViewProps) {
  return (
    <div className="table-wrap" style={{ flex: 1, overflowY: 'auto' }}>
      <table className="dt">
        <thead>
          <tr><th>Pedido</th><th>Canal</th><th>Destino / Cliente</th><th>Ítems</th><th>Total</th><th>Tiempo</th><th>Estado</th><th style={{ textAlign: 'right' }}>Acción</th></tr>
        </thead>
        <tbody>
          {pedidos.map((p) => {
            const meta = CANAL_META[p.canal];
            const Ic = Icons[meta.ic];
            const nextLabel = nextLabelFor(p);
            return (
              <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => onDetalle(p)}>
                <td className="mono"><strong>{p.id.slice(0, 6)}</strong></td>
                <td><span className={`tag-canal ${meta.cls}`}><Ic s={12} /> {meta.label}</span></td>
                <td>
                  {p.canal === 'SALON'
                    ? <strong>Mesa {p.mesaNumero}</strong>
                    : <><strong>{p.cliente ?? 'Cliente'}</strong>{p.direccion && <div className="note" style={{ whiteSpace: 'normal' }}>{p.direccion}</div>}</>}
                </td>
                <td><span className="mono">{p.cantidadItems}</span></td>
                <td><strong className="mono">{fmt(p.total)}</strong></td>
                <td><span className="muted">{elapsedLabel(p.createdAt, now)}</span></td>
                <td><span className={`badge dot ${p.estadoClass}`}>{p.estadoLabel}</span></td>
                <td style={{ textAlign: 'right' }}>
                  {nextLabel && (
                    <button className="btn btn-sm btn-primary" aria-label={`${nextLabel} pedido ${p.id.slice(0, 6)}`} disabled={actionLoading === p.id || !online} onClick={(e) => { e.stopPropagation(); onAvanzar(p); }}>
                      {actionLoading === p.id ? <span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} /> : nextLabel}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DetallePedido({ pedido: p, onClose, onAvanzar, actionLoading, online, now }: { pedido: PedidoVM; onClose: () => void; onAvanzar: (p: PedidoVM) => void; actionLoading: string | null; online: boolean; now: number }) {
  const meta = CANAL_META[p.canal];
  const Ic = Icons[meta.ic];
  const nextLabel = nextLabelFor(p);
  const curIdx = FLOW_PEDIDO.findIndex((f) => f.estado === p.estado);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="drawer-wrap" role="dialog" aria-modal="true" aria-label={`Detalle del pedido ${p.id.slice(0, 8)}`}>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer">
        <div className="panel-h" style={{ padding: '16px 20px' }}>
          <span className={`tag-canal ${meta.cls}`}><Ic s={12} /> {meta.label}</span>
          <h3 style={{ fontSize: 17, marginLeft: 4 }}>{p.id.slice(0, 8)}</h3>
          <span className="spacer" />
          <button className="icon-btn" aria-label="Cerrar detalle" onClick={onClose}><Icons.Close s={17} /></button>
        </div>
        <div className="drawer-body">
          {/* destino */}
          <div className="panel" style={{ padding: 16, marginBottom: 14 }}>
            {p.canal === 'SALON' ? (
              <div className="row" style={{ gap: 12 }}><b style={{ fontSize: 20 }}>Mesa {p.mesaNumero}</b><span className="muted">{p.cantidadItems} ítems</span></div>
            ) : (
              <div>
                <b style={{ fontSize: 17 }}>{p.cliente ?? 'Cliente'}</b>
                {p.telefono && <div className="kv" style={{ marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 8 }}><span className="k">Teléfono</span><span className="v">{p.telefono}</span></div>}
                {p.direccion && <div className="kv"><span className="k">Dirección</span><span className="v" style={{ textAlign: 'right', maxWidth: 220 }}>{p.direccion}</span></div>}
                {p.proveedor && <div className="kv"><span className="k">Proveedor</span><span className="v">{p.proveedor}</span></div>}
              </div>
            )}
          </div>

          {/* timeline */}
          <div className="flow">
            {FLOW_PEDIDO.map((st, i) => (
              <div className={`flow-step ${i < curIdx ? 'done' : i === curIdx ? 'on' : ''}`} key={st.estado}>
                <span className="flow-dot">{i < curIdx ? <Icons.Check s={11} /> : i + 1}</span>
                <span className="flow-lbl">{st.label}</span>
              </div>
            ))}
          </div>

          {/* items */}
          <div className="hint" style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', margin: '6px 0 8px' }}>Ítems · {elapsedLabel(p.createdAt, now)}</div>
          <div className="panel" style={{ padding: '4px 14px' }}>
            {p.items.map((it) => (
              <div className="dish-line" key={it.id} style={{ alignItems: 'flex-start' }}>
                <span className="dish-q">{it.cantidad}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600 }}>{it.nombre}</span>
                  {it.modificadores.length > 0 && <div className="cmd-line-mods" style={{ marginTop: 2 }}>{it.modificadores.map((m) => m.nombre).join(' · ')}</div>}
                  {it.notas && <div className="cmd-line-mods" style={{ marginTop: 2 }}><Icons.Note s={11} /> {it.notas}</div>}
                </div>
                <span className="mono muted">{fmt(it.subtotal)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-foot" style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
          <div><div className="hint">Total</div><b className="mono" style={{ fontSize: 18 }}>{fmt(p.total)}</b></div>
          <span className="spacer" />
          {nextLabel && (
            <button className="btn btn-primary" aria-label={`${nextLabel} pedido ${p.id.slice(0, 6)}`} disabled={actionLoading === p.id || !online} onClick={() => onAvanzar(p)}>
              {actionLoading === p.id ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : nextLabel}
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
