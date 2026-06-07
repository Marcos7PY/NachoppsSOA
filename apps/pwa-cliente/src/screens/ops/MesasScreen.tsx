// screens/ops/MesasScreen.tsx — Plano de salón en vivo (rediseño del prototipo).
// Cableado real: useMesasQuery (plano + estados) y useCuentasQuery (cuenta de la
// mesa seleccionada). Lanza el Comandero para tomar/agregar pedido.

import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../components/ui/icons';
import { fmt } from '../../utils/format';
import { useMesasQuery } from '../../hooks/queries/useMesasQuery';
import { useCuentasQuery } from '../../hooks/queries/useCuentasQuery';
import { Comandero } from '../../components/comandero/Comandero';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import type { MesaVM, EstadoMesa } from '../../types/mesa.types';

const EST_META: Record<EstadoMesa, { label: string; cls: string; color: string }> = {
  LIBRE: { label: 'Libre', cls: 'libre', color: 'var(--ok)' },
  OCUPADA: { label: 'Ocupada', cls: 'ocupada', color: 'var(--accent)' },
  RESERVADA: { label: 'Reservada', cls: 'reservada', color: 'var(--info)' },
};

type ComanderoState =
  | { open: true; mesaId?: string; mesaNumero?: string; mesaZona?: string; modoAgregar: boolean }
  | { open: false };

export function MesasScreen() {
  const navigate = useNavigate();
  const { mesas, loading, error, fetch } = useMesasQuery();
  const [zona, setZona] = useState('TODAS');
  const [sel, setSel] = useState<MesaVM | null>(null);
  const [comandero, setComandero] = useState<ComanderoState>({ open: false });

  // Sólo mesas físicas (excluir virtuales 98/99 de delivery/llevar)
  const fisicas = useMemo(() => mesas.filter((m) => m.numeroRaw < 90), [mesas]);

  const zonas = useMemo(
    () => ['TODAS', ...Array.from(new Set(fisicas.map((m) => m.zona)))],
    [fisicas],
  );
  const visibles = fisicas.filter((m) => zona === 'TODAS' || m.zona === zona);

  const resumen = useMemo(() => {
    const r: Record<EstadoMesa, number> = { LIBRE: 0, OCUPADA: 0, RESERVADA: 0 };
    fisicas.forEach((m) => { r[m.estado] = (r[m.estado] ?? 0) + 1; });
    return r;
  }, [fisicas]);

  // ─── Loading ────────────────────────────────────────────────
  if (loading && mesas.length === 0) {
    return (
      <div>
        <div className="page-h"><div><h1>Mesas</h1><div className="sub">Cargando salón…</div></div></div>
        <div className="mesa-floor">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skel" style={{ height: 110, borderRadius: 'var(--r-lg)' }} />
          ))}
        </div>
      </div>
    );
  }

  // ─── Error ──────────────────────────────────────────────────
  if (error) {
    return (
      <div>
        <div className="page-h"><div><h1>Mesas</h1></div></div>
        <div className="banner err" style={{ marginBottom: 16 }}>
          <Icons.Alert s={17} />
          <span>{error}</span>
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
          <h1>Mesas</h1>
          <div className="sub">Salón en vivo · toca una mesa para tomar o agregar pedido</div>
        </div>
        <span className="spacer" />
        <button className="btn btn-ghost btn-sm" onClick={() => fetch()} title="Refrescar"><Icons.Refresh s={16} /></button>
        <button className="btn btn-primary" onClick={() => setComandero({ open: true, modoAgregar: false })}><Icons.Plus s={16} /> Nuevo pedido</button>
      </div>

      {/* Resumen de estados + filtro de zona */}
      <div className="mesa-summary">
        {(Object.keys(EST_META) as EstadoMesa[]).map((k) => (
          <div className="ms-chip" key={k}>
            <span className="ms-dot" style={{ background: EST_META[k].color }} />
            {EST_META[k].label}<b>{resumen[k]}</b>
          </div>
        ))}
        <span className="spacer" />
        <div className="seg sm">
          {zonas.map((z) => (
            <button key={z} className={zona === z ? 'on' : ''} onClick={() => setZona(z)}>{z === 'TODAS' ? 'Todas' : z}</button>
          ))}
        </div>
      </div>

      <div className="mesa-floor">
        {visibles.map((m) => {
          const meta = EST_META[m.estado];
          const ocupada = m.estado === 'OCUPADA';
          return (
            <button key={m.id} className={`mesa-tile ${meta.cls}`} onClick={() => setSel(m)}>
              <div className="mt-top">
                <span className="mt-num">{m.numero}</span>
                <span className="mt-cap"><Icons.Users2 s={12} /> {m.capacidad}</span>
              </div>
              <div className="mt-zone">{m.zona}</div>
              <div className="mt-foot">
                {ocupada
                  ? <span className="mt-state" style={{ color: 'var(--accent-text)' }}>Cuenta abierta</span>
                  : <span className="mt-state">{meta.label}</span>}
              </div>
            </button>
          );
        })}
      </div>

      {sel && (
        <MesaDrawer
          mesa={sel}
          onClose={() => setSel(null)}
          onCobrar={() => { const id = sel.id; setSel(null); navigate(`/app/caja?mesaId=${id}`); }}
          onTomar={() => { setComandero({ open: true, mesaId: sel.id, mesaNumero: sel.numero, mesaZona: sel.zona, modoAgregar: false }); setSel(null); }}
          onAgregar={() => { setComandero({ open: true, mesaId: sel.id, mesaNumero: sel.numero, mesaZona: sel.zona, modoAgregar: true }); setSel(null); }}
        />
      )}

      {comandero.open && (
        <Comandero
          onClose={() => setComandero({ open: false })}
          onCreated={() => fetch()}
          initialCanal="SALON"
          mesaId={comandero.mesaId}
          mesaNumero={comandero.mesaNumero}
          mesaZona={comandero.mesaZona}
          modoAgregar={comandero.modoAgregar}
        />
      )}
    </div>
  );
}

interface MesaDrawerProps {
  mesa: MesaVM;
  onClose: () => void;
  onCobrar: () => void;
  onTomar: () => void;
  onAgregar: () => void;
}

function MesaDrawer({ mesa: m, onClose, onCobrar, onTomar, onAgregar }: MesaDrawerProps) {
  const ocupada = m.estado === 'OCUPADA';
  const { cuentaActiva, loading } = useCuentasQuery(ocupada ? m.id : undefined);
  const meta = EST_META[m.estado];
  const drawerRef = useRef<HTMLElement>(null);
  useFocusTrap(drawerRef, { active: true, onClose });

  const items = cuentaActiva?.pedidos.flatMap((p) => p.items) ?? [];
  const badgeCls = m.estado === 'OCUPADA' ? 'badge-accent' : m.estado === 'RESERVADA' ? 'badge-info' : 'badge-muted';

  return (
    <div className="drawer-wrap">
      <div className="scrim" onClick={onClose} />
      <aside
        className="drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Mesa ${m.numero}`}
      >
        <div className="panel-h" style={{ padding: '16px 20px' }}>
          <span className={`badge dot ${badgeCls}`}>{meta.label}</span>
          <h3 style={{ fontSize: 18, marginLeft: 4 }}>Mesa {m.numero}</h3>
          <span className="muted" style={{ fontSize: 13 }}>· {m.zona} · {m.capacidad} pers</span>
          <span className="spacer" />
          <button className="icon-btn" onClick={onClose}><Icons.Close s={17} /></button>
        </div>
        <div className="drawer-body">
          {ocupada ? (
            loading ? (
              <div className="muted" style={{ padding: 16, textAlign: 'center' }}>Cargando cuenta…</div>
            ) : cuentaActiva ? (
              <>
                <div className="hint" style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', margin: '4px 0 8px' }}>Cuenta actual · {cuentaActiva.cantidadItems} ítems</div>
                <div className="panel" style={{ padding: '4px 14px' }}>
                  {items.length === 0 ? (
                    <div className="muted" style={{ padding: 12, fontSize: 13 }}>Sin ítems registrados.</div>
                  ) : items.map((it) => (
                    <div className="dish-line" key={it.id}>
                      <span className="dish-q">{it.cantidad}</span>
                      <span style={{ flex: 1, fontWeight: 600 }}>{it.nombre}</span>
                      <span className="mono muted">{fmt(it.subtotal)}</span>
                    </div>
                  ))}
                </div>
                <div className="kv" style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <span className="k" style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>Total</span>
                  <span className="v mono" style={{ fontSize: 20, fontWeight: 800 }}>{fmt(cuentaActiva.total)}</span>
                </div>
              </>
            ) : (
              <div className="banner info"><Icons.Receipt s={16} /><span>Mesa ocupada sin cuenta cargada. Toma un pedido para abrirla.</span></div>
            )
          ) : m.estado === 'RESERVADA' ? (
            <div className="banner info"><Icons.Reservas s={16} /><span>Mesa reservada.</span></div>
          ) : (
            <div className="empty" style={{ padding: 28 }}>
              <div className="e-ic"><Icons.Mesas s={24} /></div>
              <h3>Mesa libre</h3>
              <p>Toma un nuevo pedido para abrir la cuenta de esta mesa.</p>
            </div>
          )}
        </div>
        <div className="modal-foot" style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
          {ocupada ? (
            <>
              <button className="btn btn-ghost" onClick={onCobrar}><Icons.Caja s={15} /> Cobrar</button>
              <span className="spacer" />
              <button className="btn btn-primary" onClick={onAgregar}><Icons.Plus s={15} /> Agregar a la cuenta</button>
            </>
          ) : m.estado === 'LIBRE' ? (
            <>
              <span className="spacer" />
              <button className="btn btn-primary" onClick={onTomar}><Icons.Plus s={15} /> Tomar pedido</button>
            </>
          ) : (
            <>
              <span className="spacer" />
              <button className="btn btn-soft" onClick={onClose}>Cerrar</button>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
