// screens/caja/CajaScreen.tsx — Caja: dashboard de turno + cobro de mesa + cierre operativo.

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Icons } from '../../components/ui/icons';
import { MiniStat } from '../../components/ui/Stat';
import { useToast } from '../../components/ui/ToastProvider';
import { useAuthStore } from '../../store/auth.store';
import { useMesasQuery } from '../../hooks/queries/useMesasQuery';
import { useCajaQuery } from '../../hooks/queries/useCajaQuery';
import { fmt, horaOf } from '../../utils/format';
import { METODO_META, METODOS_ORDEN, computeKpis } from './cajaMeta';
import { MovimientoModal } from './MovimientoModal';
import { CierreDrawer } from './CierreDrawer';
import { CobroMesaDrawer } from './CobroMesaDrawer';
import { AperturaCajaModal } from './AperturaCajaModal';
import type { MovimientoCajaDto } from '../../types/caja.types';

type Modal = null | 'apertura' | 'cierre' | 'egreso' | 'ingreso';

interface CobroState { mesaId: string; mesaNumero?: string }

export function CajaScreen() {
  const { toast } = useToast();
  const cajero = useAuthStore((s) => s.user);
  const { mesas } = useMesasQuery();
  const { resumen, turno, loading, error, abrirTurno, crearMovimiento, cerrarTurno } = useCajaQuery();
  const [searchParams, setSearchParams] = useSearchParams();

  const [modal, setModal] = useState<Modal>(null);
  const [cobro, setCobro] = useState<CobroState | null>(null);
  const [cobroPicker, setCobroPicker] = useState(false);

  const movs = resumen?.movimientos ?? [];
  const k = useMemo(() => computeKpis(movs, resumen?.efectivoEsperado ?? 0), [movs, resumen?.efectivoEsperado]);
  const cajeroNombre = cajero?.nombre ?? 'Cajero';

  // Mesas ocupadas (para cobrar)
  const ocupadas = useMemo(() => mesas.filter((m) => m.numeroRaw < 90 && m.estado === 'OCUPADA'), [mesas]);

  // ?mesaId en la URL (desde Mesas → "Cobrar")
  useEffect(() => {
    const mid = searchParams.get('mesaId');
    if (mid && !cobro) {
      const mesa = mesas.find((m) => m.id === mid);
      setCobro({ mesaId: mid, mesaNumero: mesa?.numero });
    }
  }, [searchParams, mesas]);

  const closeCobro = () => {
    setCobro(null);
    if (searchParams.get('mesaId')) {
      searchParams.delete('mesaId');
      setSearchParams(searchParams, { replace: true });
    }
  };

  const abrirCaja = async (fondoInicial: number) => {
    await abrirTurno({ fondoInicial, cajeroNombre });
    setModal(null);
    toast({ title: 'Caja abierta', msg: `Fondo inicial ${fmt(fondoInicial)}`, icon: 'Cash', kind: 'ok' });
  };

  return (
    <div>
      <div className="page-h">
        <div>
          <h1>Caja</h1>
          <div className="sub">Turno, cobros y cierre Z</div>
        </div>
        <span className="spacer" />
        {!turno && <button className="btn btn-primary" disabled={loading} onClick={() => setModal('apertura')}><Icons.Cash s={16} /> Abrir caja</button>}
        <button className="btn btn-soft" disabled={!turno || loading} onClick={() => setModal('cierre')}><Icons.Lock s={16} /> Cerrar caja</button>
        <button className="btn btn-primary" disabled={!turno || loading} onClick={() => setCobroPicker(true)}><Icons.Plus s={16} /> Cobrar cuenta</button>
      </div>

      {error && (
        <div className="banner err" style={{ marginBottom: 14 }}>
          <Icons.Alert s={16} /><span>{error}</span>
        </div>
      )}

      {!turno && !loading && (
        <section className="panel" style={{ padding: 24, marginBottom: 16 }}>
          <div className="empty" style={{ padding: 18 }}>
            <div className="e-ic"><Icons.Cash s={26} /></div>
            <h3>Abre un turno de caja</h3>
            <p>Los cobros, ingresos, egresos y el arqueo se registran contra el turno activo.</p>
            <button className="btn btn-primary" onClick={() => setModal('apertura')}><Icons.Cash s={16} /> Abrir caja</button>
          </div>
        </section>
      )}

      {/* Estado del turno */}
      <div className="turno-bar">
        <div className="turno-state"><span className="pip" /> {turno ? 'Caja abierta' : 'Sin turno abierto'}</div>
        <div style={{ width: 1, height: 26, background: 'var(--border)' }} />
        <div className="turno-meta">
          <div className="turno-mi"><div className="k">Apertura</div><div className="v">{turno ? `${horaOf(turno.abiertoAt)} · ${fmt(turno.fondoInicial)}` : 'Pendiente'}</div></div>
          <div className="turno-mi"><div className="k">Cajero</div><div className="v">{cajeroNombre}</div></div>
          <div className="turno-mi"><div className="k">Cuentas cobradas</div><div className="v">{k.comprobantes}</div></div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid-stats" style={{ marginBottom: 16 }}>
        <MiniStat icon="Trend" color="var(--accent)" soft="var(--accent-soft)" k="Ventas del turno" v={fmt(k.totalVentas)} d={`${k.ventas.length} cuentas cerradas`} />
        <MiniStat icon="Cash" color="var(--ok)" soft="var(--ok-soft)" k="Efectivo esperado en caja" v={fmt(k.efectivoEsperado)} d="Fondo, ventas, propinas y movimientos en efectivo" />
        <MiniStat icon="Coins" color="var(--warn)" soft="var(--warn-soft)" k="Propinas acumuladas" v={fmt(k.propinas)} d="Pendiente de repartir" />
        <MiniStat icon="Receipt" color="var(--info)" soft="var(--info-soft)" k="Tickets internos" v={k.comprobantes} d="Cuentas cobradas en el turno" />
      </div>

      <div className="module-grid">
        {/* Movimientos */}
        <section className="panel">
          <div className="panel-h">
            <h3>Movimientos del turno</h3>
            <span className="spacer" />
            <span className="pill-soft">{movs.length} registros</span>
          </div>
          <div className="table-wrap table-wrap-flat">
            <table className="dt">
              <thead>
                <tr><th>Hora</th><th>Detalle</th><th>TX</th><th>Método</th><th style={{ textAlign: 'right' }}>Monto</th></tr>
              </thead>
              <tbody>
                {movs.map((m) => <MovRow key={m.id} m={m} />)}
              </tbody>
            </table>
          </div>
        </section>

        {/* Lateral */}
        <aside className="module-side">
          {/* Desglose por método */}
          <section className="panel">
            <div className="panel-h"><h3>Ingresos por método</h3></div>
            <div className="pay-rows">
              {METODOS_ORDEN.map((key) => {
                const meta = METODO_META[key];
                const val = k.porMetodo[key];
                const pct = k.totalVentas ? (val / k.totalVentas) * 100 : 0;
                return (
                  <div className="pay-row" key={key}>
                    <span className={`pay-ic ${meta.cls}`}>{meta.abbr}</span>
                    <div className="pay-bar-wrap">
                      <div className="pay-bar-top"><b>{meta.label}</b><span className="muted">{pct.toFixed(0)}%</span></div>
                      <div className="pay-track"><div className="pay-fill" style={{ width: `${pct}%`, background: meta.color }} /></div>
                    </div>
                    <span className="pay-amt">{fmt(val)}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Acciones rápidas */}
          <section className="panel">
            <div className="panel-h"><h3>Acciones</h3></div>
            <div className="qa-grid">
              <button className="qa" onClick={() => setCobroPicker(true)}>
                <span className="qa-ic" style={{ background: 'var(--accent-soft)', color: 'var(--accent-text)' }}><Icons.Plus s={16} /></span>
                <b>Cobrar cuenta</b><small>Boleta / Factura</small>
              </button>
              <button className="qa" onClick={() => setModal('egreso')}>
                <span className="qa-ic" style={{ background: 'var(--danger-soft)', color: 'var(--danger-text)' }}><Icons.ArrowDown s={16} /></span>
                <b>Registrar egreso</b><small>Gastos del turno</small>
              </button>
              <button className="qa" onClick={() => setModal('ingreso')}>
                <span className="qa-ic" style={{ background: 'var(--ok-soft)', color: 'var(--ok-text)' }}><Icons.ArrowUp s={16} /></span>
                <b>Ingreso de efectivo</b><small>Vuelto / fondo</small>
              </button>
              <button className="qa" onClick={() => setModal('cierre')}>
                <span className="qa-ic" style={{ background: 'var(--surface-3)', color: 'var(--text-2)' }}><Icons.Lock s={16} /></span>
                <b>Cierre interno</b><small>Arqueo del turno</small>
              </button>
            </div>
          </section>

          {/* Tickets internos */}
          <section className="panel">
            <div className="panel-h"><h3>Tickets internos</h3><span className="spacer" /><span className="badge badge-ok dot">Operativo</span></div>
            <div style={{ padding: '8px 16px 16px' }}>
              <div className="kv" style={{ borderBottom: '1px solid var(--border)' }}><span className="k">Cuentas cobradas</span><span className="v">{k.comprobantes}</span></div>
              <div className="kv" style={{ borderBottom: '1px solid var(--border)' }}><span className="k">Turno</span><span className="v">{turno?.cajaNombre ?? 'Sin turno'}</span></div>
              <div className="kv"><span className="k">Estado</span><span className="v"><span className={`badge ${turno ? 'badge-ok' : 'badge-muted'} dot`}>{turno ? 'Abierto' : 'Pendiente'}</span></span></div>
            </div>
          </section>
        </aside>
      </div>

      {/* Selector de mesa para cobrar */}
      {cobroPicker && (
        <div className="modal-wrap">
          <div className="scrim" onClick={() => setCobroPicker(false)} />
          <div className="modal" style={{ width: 460, position: 'relative', zIndex: 1 }}>
            <div className="panel-h" style={{ padding: '16px 20px' }}>
              <h3 style={{ fontSize: 17 }}>Cobrar cuenta · elegir mesa</h3>
              <span className="spacer" />
              <button className="icon-btn" onClick={() => setCobroPicker(false)}><Icons.Close s={17} /></button>
            </div>
            <div style={{ padding: 20, display: 'grid', gap: 9, maxHeight: '60vh', overflowY: 'auto' }}>
              {ocupadas.length === 0 ? (
                <div className="muted" style={{ fontSize: 13, padding: 8 }}>No hay mesas ocupadas con cuenta para cobrar.</div>
              ) : ocupadas.map((m) => (
                <button key={m.id} className="rep-opt" onClick={() => { setCobro({ mesaId: m.id, mesaNumero: m.numero }); setCobroPicker(false); }}>
                  <span className="prov-ava" style={{ width: 38, height: 38, fontSize: 13 }}>{m.numero}</span>
                  <div style={{ flex: 1, textAlign: 'left' }}><b style={{ fontSize: 14 }}>Mesa {m.numero}</b><div className="muted" style={{ fontSize: 12 }}>{m.ubicacion} · {m.capacidad} pers</div></div>
                  <Icons.ArrowDown s={14} style={{ transform: 'rotate(-90deg)' }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {cobro && (
        <CobroMesaDrawer
          mesaId={cobro.mesaId}
          mesaNumero={cobro.mesaNumero}
          onClose={closeCobro}
          onPaid={() => toast({ title: 'Pago registrado correctamente.', msg: `Mesa ${cobro.mesaNumero ?? ''}`.trim(), icon: 'Receipt', kind: 'ok' })}
        />
      )}

      {modal === 'apertura' && (
        <AperturaCajaModal loading={loading} onClose={() => setModal(null)} onOpen={abrirCaja} />
      )}

      {(modal === 'egreso' || modal === 'ingreso') && (
        <MovimientoModal
          tipoInicial={modal === 'egreso' ? 'EGRESO' : 'INGRESO'}
          onClose={() => setModal(null)}
          onSave={async (mov) => {
            if (!turno) return;
            await crearMovimiento(turno.id, mov);
            setModal(null);
            toast({ title: mov.tipo === 'EGRESO' ? 'Egreso registrado' : 'Ingreso registrado', msg: `${mov.donde} · ${fmt(Math.abs(mov.monto))}`, icon: mov.tipo === 'EGRESO' ? 'ArrowDown' : 'ArrowUp', kind: mov.tipo === 'EGRESO' ? 'info' : 'ok' });
          }}
        />
      )}

      {modal === 'cierre' && turno && (
        <CierreDrawer
          k={k}
          cajeroNombre={cajeroNombre}
          onClose={() => setModal(null)}
          onDone={async (denominaciones) => {
            await cerrarTurno(turno.id, { denominaciones });
            setModal(null);
            toast({ title: 'Caja cerrada', msg: 'Turno cerrado y arqueo guardado', icon: 'Lock' });
          }}
        />
      )}
    </div>
  );
}

function MovRow({ m }: { m: MovimientoCajaDto }) {
  const apertura = m.tipo === 'APERTURA';
  const egreso = m.tipo === 'EGRESO';
  const ingreso = m.tipo === 'INGRESO';
  const meta = METODO_META[m.metodo];
  return (
    <tr>
      <td className="mono muted" style={{ whiteSpace: 'nowrap' }}>{horaOf(m.createdAt)}</td>
      <td>
        <div className="row" style={{ gap: 8 }}>
          {apertura ? <span className="badge badge-muted">Apertura</span>
            : egreso ? <span className="badge badge-danger dot">Egreso</span>
            : ingreso ? <span className="badge badge-ok dot">Ingreso</span>
            : <span className="tag-canal salon">Cobro</span>}
          <strong>{m.donde}</strong>
          {m.motivo && <span className="muted" style={{ fontSize: 12 }}>· {m.motivo}</span>}
          {m.descuento ? <span className="muted" style={{ fontSize: 12 }}>· Desc. {fmt(m.descuento)}</span> : null}
        </div>
      </td>
      <td>
        {m.transaccionId ? <span className="mono muted">{m.transaccionId.slice(0, 8)}</span> : <span className="muted">—</span>}
      </td>
      <td>{apertura ? <span className="muted">—</span> : <span className="row" style={{ gap: 7 }}><span className={`pay-ic ${meta.cls}`} style={{ width: 20, height: 20, fontSize: 10 }}>{meta.abbr}</span>{meta.label}</span>}</td>
      <td className="num">
        <span className="monto" style={egreso ? { color: 'var(--danger-text)' } : ingreso ? { color: 'var(--ok-text)' } : undefined}>{egreso ? '−' : ingreso ? '+' : ''}{fmt(Math.abs(m.monto))}</span>
        {m.descuento ? <div className="muted" style={{ fontSize: 11 }}>Subtotal {fmt(Math.abs(m.monto) + m.descuento)}</div> : null}
        {m.propina ? <div className="muted" style={{ fontSize: 11 }}>+{fmt(m.propina)} prop.</div> : null}
      </td>
    </tr>
  );
}
