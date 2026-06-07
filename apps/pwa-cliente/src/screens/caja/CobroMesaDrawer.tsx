// screens/caja/CobroMesaDrawer.tsx — Cobro de una cuenta de mesa (REAL).
// Cableado a useCuentasQuery: registrarPago. El backend registra el pago y cierra la cuenta.

import { useEffect, useMemo, useRef, useState } from 'react';
import { Icons, type IconName } from '../../components/ui/icons';
import { fmt } from '../../utils/format';
import { useCuentasQuery } from '../../hooks/queries/useCuentasQuery';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import type { MetodoPago } from '../../types/cuenta.types';

const METODOS: { value: MetodoPago; label: string; ic: IconName; color: string }[] = [
  { value: 'EFECTIVO', label: 'Efectivo', ic: 'Cash', color: 'var(--ok)' },
  { value: 'TARJETA', label: 'Tarjeta', ic: 'Card', color: 'var(--info)' },
  { value: 'YAPE', label: 'Yape', ic: 'Wallet', color: '#6c2bd9' },
  { value: 'PLIN', label: 'Plin', ic: 'Wallet', color: '#0aa3c2' },
  { value: 'TRANSFERENCIA', label: 'Transferencia', ic: 'Coins', color: 'var(--text-2)' },
];

interface Props {
  mesaId: string;
  mesaNumero?: string;
  onClose: () => void;
  onPaid?: () => void;
}

export function CobroMesaDrawer({ mesaId, mesaNumero, onClose, onPaid }: Props) {
  const online = useOnlineStatus();
  const {
    cuentaActiva, loading, error, success,
    registrarPago, clearFeedback,
  } = useCuentasQuery(mesaId);
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, { active: true, onClose });

  const [metodo, setMetodo] = useState<MetodoPago>('EFECTIVO');
  const [recibido, setRecibido] = useState('');
  const [descuento, setDescuento] = useState('0');
  const [propina, setPropina] = useState('0');

  const subtotal = cuentaActiva?.total ?? 0;
  const desc = Number(descuento) || 0;
  const tip = Number(propina) || 0;
  const totalBase = Math.max(0, subtotal - desc);
  const totalCobro = totalBase + tip;
  const igv = totalBase - totalBase / 1.18;
  const recNum = Number(recibido || 0);
  const vuelto = metodo === 'EFECTIVO' ? Math.max(0, recNum - totalCobro) : 0;
  const faltaPago = metodo === 'EFECTIVO' && recNum < totalCobro;

  const items = useMemo(() => cuentaActiva?.pedidos.flatMap((p) => p.items) ?? [], [cuentaActiva]);

  useEffect(() => {
    if (cuentaActiva && !recibido) setRecibido(cuentaActiva.total.toFixed(2));
  }, [cuentaActiva?.id]);

  const key = (d: string) =>
    setRecibido((r) => (d === 'C' ? '' : d === '.' ? (r.includes('.') ? r : (r || '0') + '.') : r + d));

  const handlePagar = async () => {
    if (!cuentaActiva || !online) return;
    await registrarPago({ cuentaId: cuentaActiva.id, montoRecibido: totalBase, metodo, descuento: desc, propina: tip, mesaNumero });
    onPaid?.();
    onClose();
  };

  return (
    <div className="modal-wrap">
      <div className="scrim" onClick={onClose} />
      <div
        className="modal xwide"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Cobrar cuenta"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div className="panel-h" style={{ padding: '16px 20px' }}>
          <h3 style={{ fontSize: 18 }}>Cobrar cuenta</h3>
          <span className="tag-canal salon" style={{ marginLeft: 4 }}>Mesa {mesaNumero ?? cuentaActiva?.mesaId ?? ''}</span>
          {cuentaActiva && <span className="muted" style={{ fontSize: 13 }}>· {cuentaActiva.cantidadItems} ítems</span>}
          <span className="spacer" />
          <button className="icon-btn" onClick={onClose}><Icons.Close s={17} /></button>
        </div>

        {(error || success) && (
          <div className={`banner ${error ? 'err' : 'ok'}`} style={{ margin: '12px 20px 0' }}>
            {error ? <Icons.Alert s={16} /> : <Icons.Check s={16} />}
            <span>{error ?? success}</span>
            <span className="spacer" />
            <button className="btn btn-sm btn-ghost" onClick={clearFeedback}>Cerrar</button>
          </div>
        )}

        <div className="modal-scroll">
          {loading && !cuentaActiva ? (
            <div style={{ padding: 40, textAlign: 'center' }} className="muted">Cargando cuenta…</div>
          ) : !cuentaActiva ? (
            <div className="empty" style={{ padding: 36 }}>
              <div className="e-ic"><Icons.Wallet s={26} /></div>
              <h3>Sin cuenta abierta</h3>
              <p>Esta mesa no tiene una cuenta activa.</p>
              <button className="btn btn-ghost" onClick={onClose}>Cerrar</button>
            </div>
          ) : (
            <div className="two-up" style={{ padding: 20, gap: 22 }}>
              {/* Detalle de la cuenta */}
              <div>
                <div className="hint" style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Detalle de la cuenta</div>
                <div className="panel" style={{ padding: '4px 14px' }}>
                  {items.length === 0 ? (
                    <div className="muted" style={{ padding: 12, fontSize: 13 }}>La cuenta no tiene ítems.</div>
                  ) : items.map((it) => (
                    <div className="dish-line" key={it.id}>
                      <span className="dish-q">{it.cantidad}</span>
                      <span style={{ flex: 1, fontWeight: 600 }}>{it.nombre}</span>
                      <span className="mono" style={{ fontWeight: 700 }}>{fmt(it.subtotal)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '14px 4px 0' }}>
                  <div className="kv"><span className="k">Subtotal</span><span className="v mono">{fmt(subtotal)}</span></div>
                  <div className="kv"><span className="k">Descuento</span>
                    <span className="v"><span className="input" style={{ padding: '4px 8px', width: 110 }}><span className="muted">S/</span><input value={descuento} onChange={(e) => setDescuento(e.target.value.replace(/[^\d.]/g, ''))} inputMode="decimal" style={{ textAlign: 'right' }} /></span></span>
                  </div>
                  <div className="kv"><span className="k">Propina</span>
                    <span className="v"><span className="input" style={{ padding: '4px 8px', width: 110 }}><span className="muted">S/</span><input value={propina} onChange={(e) => setPropina(e.target.value.replace(/[^\d.]/g, ''))} inputMode="decimal" style={{ textAlign: 'right' }} /></span></span>
                  </div>
                  <div className="kv" style={{ borderTop: '1px solid var(--border)', marginTop: 10, paddingTop: 12 }}>
                    <span className="k" style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>Total</span>
                    <span className="v mono" style={{ fontSize: 22, fontWeight: 800 }}>{fmt(totalCobro)}</span>
                  </div>
                  <div className="hint" style={{ textAlign: 'right', marginTop: 4 }}>Incluye IGV (18%): {fmt(igv)}</div>
                </div>
              </div>

              {/* Pago */}
              <div style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
                <div>
                  <div className="hint" style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Método de pago</div>
                  <div className="method-grid">
                    {METODOS.map((m) => {
                      const Ic = Icons[m.ic];
                      return (
                        <button key={m.value} className={`method-opt ${metodo === m.value ? 'on' : ''}`} onClick={() => setMetodo(m.value)}>
                          <span className="m-ic" style={{ background: m.color }}><Ic s={16} /></span>{m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {metodo === 'EFECTIVO' ? (
                  <div className="two-up" style={{ gap: 14 }}>
                    <div>
                      <div className="field" style={{ marginBottom: 8 }}><label>Recibido</label><div className="input"><span className="muted">S/</span><input value={recibido} onChange={(e) => setRecibido(e.target.value.replace(/[^\d.]/g, ''))} inputMode="decimal" style={{ fontSize: 18, fontWeight: 800 }} /></div></div>
                      <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
                        {['exacto', 50, 100, 200].map((c) => <button key={c} className="chip" onClick={() => setRecibido(c === 'exacto' ? totalCobro.toFixed(2) : String(c))}>{c === 'exacto' ? 'Exacto' : 'S/ ' + c}</button>)}
                      </div>
                      <div className={`cuadre ${vuelto > 0 ? 'sobrante' : 'ok'}`} style={{ marginTop: 12, padding: '12px 14px' }}>
                        <div className="lbl">Vuelto</div><div className="big" style={{ fontSize: 26 }}>{fmt(vuelto)}</div>
                      </div>
                    </div>
                    <div className="keypad">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => <button key={d} onClick={() => key(d)}>{d}</button>)}
                      <button onClick={() => key('.')}>.</button>
                      <button onClick={() => key('0')}>0</button>
                      <button onClick={() => key('C')}>C</button>
                    </div>
                  </div>
                ) : null}

                <div style={{ display: 'grid', gap: 8 }}>
                  <button className="btn btn-primary btn-block" disabled={!cuentaActiva || loading || !online || faltaPago} onClick={handlePagar}>
                    {loading ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <Icons.Card s={16} />} Registrar pago y cerrar cuenta
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
