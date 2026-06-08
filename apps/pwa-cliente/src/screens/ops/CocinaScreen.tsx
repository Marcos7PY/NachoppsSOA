// screens/ops/CocinaScreen.tsx — Cocina (KDS) mejorado, cableado a usePedidosQuery.
// Columnas por estado de ítem, filtro por área (COCINA/BAR), SLA en vivo, métricas
// y conteo del día.
// Nota: el backend no expone estaciones (CALIENTE/FRIA/…) ni SLA por estación; se
// usa el "área" (COCINA/BAR) del ítem y un SLA fijo basado en createdAt.

import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useNow } from '../../hooks/useNow';
import { usePedidosQuery } from '../../hooks/queries/usePedidosQuery';
import { Icons, type IconName } from '../../components/ui/icons';
import type { PedidoVM, PedidoItemVM, EstadoPedido, EstadoItem, ItemArea } from '../../types/pedido.types';
import {
  ETAPAS_PRODUCCION as COLS,
  ESTADOS_PRODUCCION,
  NEXT_ITEM,
  SLA_MIN,
  slaRatio as ratioOf,
  urgClass,
  CANAL_LABEL,
  CANAL_CLS,
} from '../../domain/pedido.flow';

const AREAS: { key: 'TODAS' | ItemArea; label: string; ic: IconName }[] = [
  { key: 'TODAS', label: 'Todas', ic: 'Layers' },
  { key: 'COCINA', label: 'Cocina', ic: 'Cocina' },
  { key: 'BAR', label: 'Barra', ic: 'Drink' },
];

const elapsedMinF = (iso: string, now: number) => (now - new Date(iso).getTime()) / 60000;

export function CocinaScreen() {
  const online = useOnlineStatus();
  const now = useNow(4000);
  // KDS: carga todos los tickets activos (sin tope de página) para que métricas
  // y conteo del día sean completos.
  const { pedidos, loading, error, fetch, avanzarItem } = usePedidosQuery(undefined, { autoLoadAll: true });
  const [area, setArea] = useState<'TODAS' | ItemArea>('TODAS');
  const [fs, setFs] = useState(false);

  const matchArea = (it: PedidoItemVM) => area === 'TODAS' || it.area === area;

  // Solo pedidos en producción (PENDIENTE/EN_PREPARACION/LISTO). Al despacharse
  // un pedido (LISTO → ENTREGADO desde Pedidos) sale de producción y deja de
  // ocupar el pase del KDS.
  const activos = useMemo(
    () => pedidos.filter((p) => ESTADOS_PRODUCCION.has(p.estado)),
    [pedidos],
  );

  const advanceItem = async (itemId: string, estado: EstadoItem) => {
    if (!online) return;
    const next = NEXT_ITEM[estado];
    if (!next) return;
    try { await avanzarItem(itemId, next); } catch { /* manejado por hook */ }
  };
  const regressItem = async (itemId: string, estado: EstadoItem) => {
    if (!online) return;
    const prev = PREV_ITEM[estado];
    if (!prev) return;
    try { await avanzarItem(itemId, prev); } catch { /* */ }
  };
  const bumpTicket = async (pid: string) => {
    if (!online) return;
    const p = activos.find((x) => x.id === pid);
    if (!p) return;
    const targets = p.items.filter((it) => matchArea(it) && NEXT_ITEM[it.estado]);
    try { await Promise.all(targets.map((it) => avanzarItem(it.id, NEXT_ITEM[it.estado]!))); } catch { /* */ }
  };

  // métricas
  const metrics = useMemo(() => {
    const act = activos.filter((p) => p.items.some((it) => it.estado !== 'LISTO'));
    const tiempos = act.map((p) => elapsedMinF(p.createdAt, now));
    const prom = tiempos.length ? tiempos.reduce((a, b) => a + b, 0) / tiempos.length : 0;
    const demora = act.filter((p) => elapsedMinF(p.createdAt, now) >= SLA_MIN).length;
    const listos = activos.reduce((s, p) => s + p.items.filter((it) => it.estado === 'LISTO').length, 0);
    return { activos: act.length, prom: Math.round(prom), demora, listos };
  }, [activos, now]);

  // conteo del día (ítems no-listos del área activa)
  const allday = useMemo(() => {
    const map: Record<string, number> = {};
    activos.forEach((p) => p.items.forEach((it) => {
      if (it.estado !== 'LISTO' && matchArea(it)) map[it.nombre] = (map[it.nombre] || 0) + it.cantidad;
    }));
    return Object.entries(map).map(([n, q]) => ({ n, q })).sort((a, b) => b.q - a.q);
  }, [activos, area]);

  const areaCounts = useMemo(() => {
    const c: Record<string, number> = { TODAS: 0, COCINA: 0, BAR: 0 };
    activos.forEach((p) => p.items.forEach((it) => {
      if (it.estado !== 'LISTO') { c[it.area] = (c[it.area] || 0) + 1; c.TODAS++; }
    }));
    return c;
  }, [activos]);

  // ─── Loading / Error ────────────────────────────────────────
  if (loading && pedidos.length === 0) {
    return (
      <div>
        <div className="page-h"><div><h1>Cocina · KDS</h1><div className="sub">Cargando…</div></div></div>
        <div className="kds">
          {COLS.map((col) => (
            <div key={col.estado} className="kds-col">
              <div className="kds-col-h"><span style={{ width: 10, height: 10, borderRadius: '50%', background: col.color }} />{col.label}</div>
              <div className="kds-list">{[1, 2].map((i) => <div key={i} className="skel" style={{ height: 120, borderRadius: 'var(--r)' }} />)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <div className="page-h"><div><h1>Cocina · KDS</h1></div></div>
        <div className="banner err" style={{ marginBottom: 16 }}>
          <Icons.Alert s={17} /><span>{error}</span>
          <span className="spacer" />
          <button className="btn btn-sm btn-ghost" onClick={() => fetch()}>Reintentar</button>
        </div>
      </div>
    );
  }

  const stationTabs = (
    <div className="station-tabs">
      {AREAS.map((a) => {
        const Ic = Icons[a.ic];
        return (
          <button key={a.key} className={area === a.key ? 'on' : ''} onClick={() => setArea(a.key)}>
            <Ic s={14} /> {a.label} <span className="cnt">{areaCounts[a.key] || 0}</span>
          </button>
        );
      })}
    </div>
  );

  const body = (
    <>
      <div className="kds-metrics">
        <Metric ic="Receipt" color="var(--accent)" soft="var(--accent-soft)" v={metrics.activos} k="Tickets activos" />
        <Metric ic="Clock" color="var(--info)" soft="var(--info-soft)" v={`${metrics.prom}m`} k="Tiempo promedio" />
        <Metric ic="Alert" alert={metrics.demora > 0} v={metrics.demora} k="En demora (SLA)" />
        <Metric ic="Check" color="var(--ok)" soft="var(--ok-soft)" v={metrics.listos} k="Ítems listos · pase" />
      </div>

      <div className="allday">
        <span className="allday-lbl">Conteo del día</span>
        {allday.length === 0 ? <span className="hint">Sin pendientes en esta área</span> :
          allday.map((d) => <span key={d.n} className={`allday-chip ${d.q >= 3 ? 'hot' : ''}`}><span className="q">{d.q}</span><b>{d.n}</b></span>)}
      </div>

      <div className="kds" style={{ flex: 1, minHeight: 0 }}>
        {COLS.map((col) => {
          const cards: { p: PedidoVM; items: PedidoItemVM[] }[] = [];
          for (const p of activos) {
            const items = p.items.filter((it) => matchArea(it) && it.estado === col.estado);
            if (items.length) cards.push({ p, items });
          }
          return (
            <div key={col.estado} className="kds-col">
              <div className="kds-col-h">
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: col.color }} />
                {col.label}
                <span className="cc">{cards.length}</span>
              </div>
              <div className="kds-list">
                {cards.length === 0 ? <div className="muted" style={{ textAlign: 'center', padding: 24, fontSize: 13 }}>Sin tickets</div> :
                  cards.map(({ p, items }) => (
                    <TicketCard key={`${p.id}-${col.estado}`} p={p} items={items} col={col} now={now}
                      online={online}
                      onAdvance={advanceItem} onRegress={regressItem} onBump={() => bumpTicket(p.id)} />
                  ))}
              </div>
            </div>
          );
        })}
      </div>

    </>
  );

  if (fs) {
    return (
      <div className="kds-fs">
        <div className="row" style={{ marginBottom: 12 }}>
          <h1 style={{ fontSize: 22, margin: 0 }}>Cocina · KDS</h1>
          <span style={{ marginLeft: 14 }}>{stationTabs}</span>
          <span className="spacer" />
          <button className="btn btn-ghost btn-sm" onClick={() => setFs(false)}><Icons.Minimize s={16} /> Salir</button>
        </div>
        {body}
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="page-h" style={{ marginBottom: 14 }}>
        <div>
          <h1>Cocina · KDS</h1>
          <div className="sub">Tiempo real · tablet de cocina</div>
        </div>
        <span className="spacer" />
        {stationTabs}
        <button className="btn btn-ghost btn-sm" onClick={() => fetch()} title="Refrescar" aria-label="Refrescar"><Icons.Refresh s={16} /></button>
        <button className="btn btn-ghost btn-sm" onClick={() => setFs(true)} title="Pantalla completa" aria-label="Pantalla completa"><Icons.Maximize s={16} /></button>
      </div>
      {body}
    </div>
  );
}

function Metric({ ic, color, soft, v, k, alert }: { ic: IconName; color?: string; soft?: string; v: ReactNode; k: string; alert?: boolean }) {
  const Ic = Icons[ic];
  return (
    <div className={`kds-metric ${alert ? 'alert' : ''}`}>
      <span className="km-ic" style={{ background: alert ? 'transparent' : soft, color: alert ? 'var(--danger)' : color }}><Ic s={18} /></span>
      <div><div className="km-v">{v}</div><div className="km-k">{k}</div></div>
    </div>
  );
}

function SlaRing({ el }: { el: number }) {
  const r = ratioOf(el);
  const p = Math.min(100, r * 100);
  return <span className={`sla ${urgClass(r)}`} style={{ ['--p' as string]: p } as CSSProperties}><b>{Math.round(el)}′</b></span>;
}

interface TicketCardProps {
  p: PedidoVM;
  items: PedidoItemVM[];
  col: { estado: EstadoPedido; label: string; color: string };
  now: number;
  online: boolean;
  onAdvance: (itemId: string, estado: EstadoItem) => void;
  onRegress: (itemId: string, estado: EstadoItem) => void;
  onBump: () => void;
}

function TicketCard({ p, items, col, now, online, onAdvance, onRegress, onBump }: TicketCardProps) {
  const el = elapsedMinF(p.createdAt, now);
  const canalCls = CANAL_CLS[p.canal];
  const donde = p.canal === 'SALON' ? `Mesa ${p.mesaNumero}` : (p.cliente ?? 'Cliente');

  return (
    <div className={`kds-card ${urgClass(ratioOf(el))}`}>
      <div className="kds-head">
        {col.estado !== 'LISTO' && <SlaRing el={el} />}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="row" style={{ gap: 7 }}>
            <span className={`tag-canal ${canalCls}`}>{CANAL_LABEL[p.canal]}</span>
            <span className="tk-num">{p.id.slice(0, 6)}</span>
          </div>
          <div className="tk-where">{donde}</div>
        </div>
      </div>

      <div className="kds-items" style={{ marginTop: 12 }}>
        {items.map((it) => {
          const next = NEXT_ITEM[it.estado];
          return (
            <div key={it.id} className={`kds-item ${it.estado === 'LISTO' ? 'done' : ''}`} style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 9, minWidth: 0 }}>
                <span className="q">{it.cantidad}×</span>
                <div style={{ minWidth: 0 }}>
                  <span className="nm">{it.nombre}</span>
                  {it.modificadores.length > 0 && <div className="note">{it.modificadores.map((m) => m.nombre).join(', ')}</div>}
                  {it.notas && <div className="note"><Icons.Note s={12} /> {it.notas}</div>}
                </div>
              </div>
              {col.estado !== 'LISTO' ? (
                <button className="btn btn-soft kds-item-btn" disabled={!online} onClick={(e) => { e.stopPropagation(); onAdvance(it.id, it.estado); }} title={next === 'EN_PREPARACION' ? 'Iniciar' : 'Listo'} aria-label={`${next === 'EN_PREPARACION' ? 'Iniciar' : 'Marcar listo'}: ${it.cantidad}× ${it.nombre}`}>
                  {next === 'EN_PREPARACION' ? <Icons.Play s={16} /> : <Icons.Check s={16} />}
                </button>
              ) : (
                <button className="btn btn-ghost kds-item-btn" disabled={!online} onClick={(e) => { e.stopPropagation(); onRegress(it.id, it.estado); }} title="Regresar" aria-label={`Regresar: ${it.cantidad}× ${it.nombre}`}><Icons.Undo s={16} /></button>
              )}
            </div>
          );
        })}
      </div>

      {col.estado !== 'LISTO' && (
        <button className="btn btn-block kds-bump-btn" style={{ background: col.estado === 'PENDIENTE' ? 'var(--info)' : 'var(--ok)', color: '#fff', marginTop: 4 }} disabled={!online} onClick={(e) => { e.stopPropagation(); onBump(); }}>
          {col.estado === 'PENDIENTE' ? <><Icons.Play s={15} /> Iniciar todo</> : <><Icons.Check s={15} /> Marcar listo</>}
        </button>
      )}
    </div>
  );
}
