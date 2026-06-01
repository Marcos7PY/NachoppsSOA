// screens/caja/CajaScreen.tsx - Cuenta activa, pagos y cierre

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useMesasQuery } from '../../hooks/queries/useMesasQuery';
import { useCuentasQuery } from '../../hooks/queries/useCuentasQuery';
import type { MetodoPago } from '../../types/cuenta.types';

const METODOS: { value: MetodoPago; label: string }[] = [
  { value: 'EFECTIVO', label: 'Efectivo' },
  { value: 'TARJETA', label: 'Tarjeta' },
  { value: 'TRANSFERENCIA', label: 'Transferencia' },
  { value: 'YAPE', label: 'Yape' },
  { value: 'PLIN', label: 'Plin' },
];

export function CajaScreen() {
  const online = useOnlineStatus();
  const [searchParams] = useSearchParams();
  const { mesas, fetch: fetchMesas } = useMesasQuery();
  const [mesaId, setMesaId] = useState('');
  
  const {
    cuentaActiva,
    loading,
    error,
    success,
    ticket,
    division,
    cargar,
    abrir,
    registrarPago,
    cerrar,
    dividir,
    clearFeedback,
  } = useCuentasQuery(mesaId || undefined);

  const [metodo, setMetodo] = useState<MetodoPago>('EFECTIVO');
  const [monto, setMonto] = useState('');
  const [descuento, setDescuento] = useState('0');
  const [partes, setPartes] = useState('2');

  useEffect(() => {
    if (!mesaId && mesas.length > 0) {
      const mesaFromQuery = searchParams.get('mesaId');
      if (mesaFromQuery && mesas.some((mesa) => mesa.id === mesaFromQuery)) {
        setMesaId(mesaFromQuery);
        return;
      }

      const ocupada = mesas.find((mesa) => mesa.estado === 'OCUPADA');
      setMesaId((ocupada ?? mesas[0]).id);
    }
  }, [mesaId, mesas, searchParams]);

  // La carga inicial de la cuenta ahora es reactiva por useCuentasQuery(mesaId)

  useEffect(() => {
    if (cuentaActiva && !monto) {
      setMonto(cuentaActiva.total.toFixed(2));
    }
  }, [cuentaActiva, monto]);

  const selectedMesa = mesas.find((mesa) => mesa.id === mesaId);
  const totalConDescuento = useMemo(() => {
    const descuentoNumero = Number(descuento) || 0;
    return Math.max(0, (cuentaActiva?.total ?? 0) - descuentoNumero);
  }, [cuentaActiva?.total, descuento]);

  const handlePagar = async () => {
    if (!cuentaActiva || !online) return;
    await registrarPago({
      cuentaId: cuentaActiva.id,
      montoRecibido: Number(monto),
      metodo,
    });
  };

  const handleCerrar = async () => {
    if (!online) return;
    await cerrar(Number(descuento) || 0);
  };

  const handleDividir = async () => {
    if (!online) return;
    await dividir({ metodo: 'IGUALES', numPartes: Math.max(1, Number(partes) || 1) });
  };

  return (
    <div>
      <div className="page-h">
        <div>
          <h1>Caja</h1>
          <div className="sub">Cobros, división y cierre de cuenta</div>
        </div>
        <span className="spacer" />
        <button className="btn btn-ghost btn-sm" onClick={() => mesaId && cargar(mesaId)} title="Refrescar">
          <RefreshIcon />
        </button>
      </div>

      {(error || success) && (
        <div className={`banner ${error ? 'err' : 'ok'}`} style={{ marginBottom: 16 }}>
          {error ? <AlertIcon /> : <CheckIcon />}
          <span>{error ?? success}</span>
          <span className="spacer" />
          <button className="btn btn-sm btn-ghost" onClick={clearFeedback}>Cerrar</button>
        </div>
      )}

      <div className="caja-grid">
        <section className="panel">
          <div className="panel-h">
            <h3>Cuenta activa</h3>
            <span className="spacer" />
            {cuentaActiva && <span className="badge badge-info">{cuentaActiva.estadoLabel}</span>}
          </div>
          <div style={{ padding: 16 }}>
            <div className="field" style={{ marginBottom: 16 }}>
              <label>Mesa</label>
              <div className="input">
                <select value={mesaId} onChange={(event) => setMesaId(event.target.value)}>
                  {mesas.map((mesa) => (
                    <option key={mesa.id} value={mesa.id}>
                      Mesa {mesa.numero} - {mesa.estadoLabel}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading && !cuentaActiva ? (
              <div className="table-wrap">
                {[1, 2, 3].map((row) => (
                  <div key={row} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                    <div className="skel" style={{ width: '70%', height: 16 }} />
                  </div>
                ))}
              </div>
            ) : !cuentaActiva ? (
              <div className="empty">
                <div className="e-ic"><WalletIcon /></div>
                <h3>Sin cuenta abierta</h3>
                <p>{selectedMesa ? `La mesa ${selectedMesa.numero} no tiene cuenta activa.` : 'Selecciona una mesa.'}</p>
                {mesaId && (
                  <button className="btn btn-primary" onClick={() => abrir(mesaId)} disabled={loading || !online}>
                    Abrir cuenta
                  </button>
                )}
              </div>
            ) : (
              <div className="table-wrap">
                <table className="dt">
                  <thead>
                    <tr>
                      <th>Pedido</th>
                      <th>Items</th>
                      <th>Estado</th>
                      <th style={{ textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cuentaActiva.pedidos.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="muted">La cuenta no tiene pedidos consolidados.</td>
                      </tr>
                    ) : (
                      cuentaActiva.pedidos.map((pedido) => (
                        <tr key={pedido.id}>
                          <td><strong>Mesa {pedido.mesaNumero}</strong></td>
                          <td>{pedido.cantidadItems}</td>
                          <td><span className={`badge dot ${pedido.estadoClass}`}>{pedido.estadoLabel}</span></td>
                          <td style={{ textAlign: 'right' }}><strong>S/ {pedido.total.toFixed(2)}</strong></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {cuentaActiva && (
              <div style={{ marginTop: 18, display: 'grid', gap: 10 }}>
                {cuentaActiva.pedidos.flatMap((pedido) =>
                  pedido.items.map((item) => (
                    <div key={`${pedido.id}-${item.id}`} className="kds-item" style={{ justifyContent: 'space-between' }}>
                      <div>
                        <strong>{item.cantidad}x {item.nombre}</strong>
                        {item.notas && <div className="note">{item.notas}</div>}
                      </div>
                      <span className="mono">S/ {item.subtotal.toFixed(2)}</span>
                    </div>
                  )),
                )}
              </div>
            )}
          </div>
        </section>

        <aside style={{ display: 'grid', gap: 13, alignContent: 'start' }}>
          <div className="stat">
            <div className="k">Total cuenta</div>
            <div className="v">S/ {(cuentaActiva?.total ?? 0).toFixed(2)}</div>
            <div className="d">{cuentaActiva?.cantidadItems ?? 0} items</div>
          </div>

          <section className="panel">
            <div className="panel-h"><h3>Pago</h3></div>
            <div style={{ padding: 16, display: 'grid', gap: 12 }}>
              <div className="field">
                <label>Método</label>
                <div className="input">
                  <select value={metodo} onChange={(event) => setMetodo(event.target.value as MetodoPago)}>
                    {METODOS.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Monto recibido</label>
                <div className="input">
                  <input value={monto} onChange={(event) => setMonto(event.target.value)} inputMode="decimal" />
                </div>
              </div>
              <button className="btn btn-primary btn-block" disabled={!cuentaActiva || loading || !online} onClick={handlePagar}>
                {loading ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <CardIcon />}
                Registrar pago
              </button>
            </div>
          </section>

          <section className="panel">
            <div className="panel-h"><h3>Dividir y cerrar</h3></div>
            <div style={{ padding: 16, display: 'grid', gap: 12 }}>
              <div className="field">
                <label>Partes iguales</label>
                <div className="input">
                  <input value={partes} onChange={(event) => setPartes(event.target.value)} inputMode="numeric" />
                </div>
              </div>
              <button className="btn btn-ghost btn-block" disabled={!cuentaActiva || loading || !online} onClick={handleDividir}>
                Dividir cuenta
              </button>
              {division && (
                <div style={{ display: 'grid', gap: 6 }}>
                  {division.partes.map((parte) => (
                    <div key={parte.parte ?? parte.comensal} className="kds-item" style={{ justifyContent: 'space-between' }}>
                      <span>Parte {parte.parte ?? parte.comensal}</span>
                      <strong>S/ {parte.monto.toFixed(2)}</strong>
                    </div>
                  ))}
                </div>
              )}
              <div className="field">
                <label>Descuento</label>
                <div className="input">
                  <input value={descuento} onChange={(event) => setDescuento(event.target.value)} inputMode="decimal" />
                </div>
              </div>
              <div className="kds-item" style={{ justifyContent: 'space-between' }}>
                <span>Total cierre</span>
                <strong>S/ {totalConDescuento.toFixed(2)}</strong>
              </div>
              <button className="btn btn-success btn-block" disabled={!cuentaActiva || loading || !online} onClick={handleCerrar}>
                <CheckIcon /> Cerrar cuenta
              </button>
            </div>
          </section>

          {ticket && (
            <section className="panel">
              <div className="panel-h"><h3>Ticket</h3></div>
              <div style={{ padding: 16, display: 'grid', gap: 8 }}>
                <div className="mono">{ticket.id}</div>
                <strong>S/ {ticket.total.toFixed(2)}</strong>
                <span className="muted">{new Date(ticket.fecha).toLocaleString()}</span>
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

function AlertIcon() {
  return (
    <svg className="ic" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg className="ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
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

function WalletIcon() {
  return (
    <svg className="ic" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3v3a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5" /><path d="M18 12h.01" />
    </svg>
  );
}
