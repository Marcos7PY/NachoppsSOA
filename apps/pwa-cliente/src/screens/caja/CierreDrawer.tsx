// screens/caja/CierreDrawer.tsx — Cierre operativo: arqueo → propinas → reporte interno.

import { Fragment, useMemo, useRef, useState } from 'react';
import { Icons } from '../../components/ui/icons';
import { fmt } from '../../utils/format';
import { BILLETES, MONEDAS, DENOM_COLOR, RESTO_FISCAL } from './cajaConstants';
import { METODO_META, METODOS_ORDEN, type CajaKpis } from './cajaMeta';
import { useFocusTrap } from '../../hooks/useFocusTrap';

const STEPS = ['Arqueo de efectivo', 'Propinas', 'Reporte interno'];

const emptyCounts = () =>
  [...BILLETES, ...MONEDAS].reduce<Record<number, number>>((acc, d) => {
    acc[d] = 0;
    return acc;
  }, {});

interface Props {
  k: CajaKpis;
  cajeroNombre: string;
  onClose: () => void;
  onDone: (denominaciones: Record<string, number>) => void | Promise<void>;
}

export function CierreDrawer({ k, cajeroNombre, onClose, onDone }: Props) {
  const [step, setStep] = useState(1);
  const [counts, setCounts] = useState<Record<number, number>>(() => emptyCounts());
  const [generado, setGenerado] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, { active: true, onClose });

  const contado = useMemo(
    () => [...BILLETES, ...MONEDAS].reduce((s, d) => s + d * (counts[d] || 0), 0),
    [counts],
  );
  const esperado = k.efectivoEsperado;
  const descuadre = +(contado - esperado).toFixed(2);
  const estado: 'ok' | 'faltante' | 'sobrante' = Math.abs(descuadre) < 0.005 ? 'ok' : descuadre < 0 ? 'faltante' : 'sobrante';

  const set = (d: number, q: number) => setCounts((c) => ({ ...c, [d]: Math.max(0, q) }));
  const denominaciones = () => Object.fromEntries(
    Object.entries(counts).map(([d, q]) => [String(d), q]),
  );

  return (
    <div className="modal-wrap">
      <div className="scrim" onClick={onClose} />
      <div
        className="modal xwide"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Cierre de caja"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div className="panel-h" style={{ padding: '16px 20px' }}>
          <span className="modal-icon" style={{ width: 34, height: 34, margin: 0, borderRadius: 9, background: 'var(--surface-3)' }}><Icons.Lock s={17} /></span>
          <h3 style={{ fontSize: 18 }}>Cierre de caja · Reporte interno</h3>
          <span className="spacer" />
          <button className="icon-btn" onClick={onClose}><Icons.Close s={17} /></button>
        </div>

        <div style={{ padding: '14px 22px 4px' }}>
          <div className="steps">
            {STEPS.map((s, i) => {
              const n = i + 1;
              const cls = step === n ? 'on' : step > n ? 'done' : '';
              return (
                <Fragment key={s}>
                  <div className={`step ${cls}`}><span className="si">{step > n ? <Icons.Check s={13} /> : n}</span>{s}</div>
                  {i < STEPS.length - 1 && <div className={`step-sep ${step > n ? 'done' : ''}`} />}
                </Fragment>
              );
            })}
          </div>
        </div>

        <div className="modal-scroll" style={{ padding: 22 }}>
          {step === 1 && (
            <div className="arqueo-grid">
              <div>
                <div className="hint" style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10 }}>Billetes</div>
                <div className="denoms">{BILLETES.map((d) => <DenomRow key={d} d={d} bill counts={counts} set={set} />)}</div>
                <div className="hint" style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', margin: '18px 0 10px' }}>Monedas</div>
                <div className="denoms">{MONEDAS.map((d) => <DenomRow key={d} d={d} counts={counts} set={set} />)}</div>
              </div>
              <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
                <div className="panel" style={{ padding: 16 }}>
                  <div className="kv" style={{ borderBottom: '1px solid var(--border)' }}><span className="k">Efectivo esperado</span><span className="v mono">{fmt(esperado)}</span></div>
                  <div className="kv"><span className="k">Efectivo contado</span><span className="v mono" style={{ fontSize: 17 }}>{fmt(contado)}</span></div>
                </div>
                <div className={`cuadre ${estado}`}>
                  <div className="lbl">{estado === 'ok' ? 'Caja cuadrada' : estado === 'faltante' ? 'Faltante' : 'Sobrante'}</div>
                  <div className="big">{descuadre > 0 ? '+' : ''}{fmt(descuadre)}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, opacity: 0.85 }}>{estado === 'ok' ? 'El conteo coincide con lo esperado.' : 'Revisa el conteo o registra la diferencia con una nota.'}</div>
                </div>
                <div className="hint" style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}><Icons.Note s={15} /> Cuenta el efectivo físico del cajón. El fondo inicial se separa para el siguiente turno.</div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="two-up">
              <div>
                <div className="stat" style={{ marginBottom: 14 }}>
                  <div className="k">Propinas del turno</div>
                  <div className="vbig">{fmt(k.propinas)}</div>
                  <div className="d muted">Repartición por puntos según rol</div>
                </div>
                <div className="hint" style={{ display: 'flex', gap: 8 }}><Icons.Users2 s={15} /> Pozo común registrado desde los cobros del turno.</div>
              </div>
              <div className="panel">
                <div className="panel-h"><h3>Control</h3></div>
                <div style={{ padding: '10px 16px 16px', display: 'grid', gap: 10 }}>
                  <div className="kv" style={{ borderBottom: '1px solid var(--border)' }}><span className="k">Propinas registradas</span><span className="v mono">{fmt(k.propinas)}</span></div>
                  <div className="kv"><span className="k">Estado</span><span className="v"><span className="badge badge-ok dot">Listo para cierre</span></span></div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="two-up" style={{ alignItems: 'start' }}>
              <div>
                <div className="hint" style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10 }}>Resumen del turno</div>
                <div className="panel" style={{ padding: '6px 16px' }}>
                  <div className="kv" style={{ borderBottom: '1px solid var(--border)' }}><span className="k">Ventas totales</span><span className="v mono">{fmt(k.totalVentas)}</span></div>
                  {METODOS_ORDEN.map((mk) => (
                    <div className="kv" key={mk} style={{ borderBottom: '1px solid var(--border)' }}><span className="k">· {METODO_META[mk].label}</span><span className="v mono">{fmt(k.porMetodo[mk])}</span></div>
                  ))}
                  <div className="kv" style={{ borderBottom: '1px solid var(--border)' }}><span className="k">Egresos</span><span className="v mono" style={{ color: 'var(--danger-text)' }}>{fmt(k.totalEgresos)}</span></div>
                  <div className="kv" style={{ borderBottom: '1px solid var(--border)' }}><span className="k">Propinas</span><span className="v mono">{fmt(k.propinas)}</span></div>
                  <div className="kv"><span className="k">Descuadre de caja</span><span className="v mono" style={{ color: estado === 'ok' ? 'var(--ok-text)' : estado === 'faltante' ? 'var(--danger-text)' : 'var(--warn-text)' }}>{descuadre > 0 ? '+' : ''}{fmt(descuadre)}</span></div>
                </div>
              </div>

              <div className="zwrap">
                <ZTicket k={k} esperado={esperado} contado={contado} descuadre={descuadre} estado={estado} cajeroNombre={cajeroNombre} />
              </div>
            </div>
          )}
        </div>

        <div className="modal-foot" style={{ borderTop: '1px solid var(--border)', paddingTop: 16, alignItems: 'center' }}>
          {step > 1 ? <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>Atrás</button> : <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>}
          <span className="spacer" />
          {step === 1 && <span className={`badge dot ${estado === 'ok' ? 'badge-ok' : estado === 'faltante' ? 'badge-danger' : 'badge-warn'}`} style={{ marginRight: 6 }}>{estado === 'ok' ? 'Cuadrado' : estado === 'faltante' ? `Faltan ${fmt(Math.abs(descuadre))}` : `Sobran ${fmt(descuadre)}`}</span>}
          {step < 3 ? (
            <button className="btn btn-primary" onClick={() => setStep(step + 1)}>Siguiente</button>
          ) : !generado ? (
            <button className="btn btn-primary" onClick={() => setGenerado(true)}><Icons.Lock s={16} /> Generar cierre Z</button>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={() => window.print()}><Icons.Print s={16} /> Imprimir</button>
              <button className="btn btn-success" onClick={() => onDone(denominaciones())}><Icons.Check s={16} /> Confirmar y cerrar turno</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DenomRow({ d, bill, counts, set }: { d: number; bill?: boolean; counts: Record<number, number>; set: (d: number, q: number) => void }) {
  const q = counts[d] || 0;
  const label = d >= 1 ? `S/ ${d}` : `${(d * 100).toFixed(0)}¢`;
  const color = DENOM_COLOR[d] || 'var(--text-2)';
  return (
    <div className="denom">
      <div className="denom-face">
        {bill ? <span className="denom-pill" style={{ background: color }}>{d}</span> : <span className="denom-coin" style={{ border: `2px solid ${color}`, color }}>{d >= 1 ? d : '¢'}</span>}
        <span className="hint" style={{ fontWeight: 700 }}>{label}</span>
      </div>
      <div className="denom-stepper">
        <button onClick={() => set(d, q - 1)}>−</button>
        <input value={q} onChange={(e) => set(d, parseInt(e.target.value.replace(/\D/g, '') || '0', 10))} inputMode="numeric" />
        <button onClick={() => set(d, q + 1)}>+</button>
      </div>
      <div className="denom-sub">{fmt(d * q)}</div>
    </div>
  );
}

function ZTicket({ k, esperado, contado, descuadre, estado, cajeroNombre }: { k: CajaKpis; esperado: number; contado: number; descuadre: number; estado: string; cajeroNombre: string }) {
  const now = new Date();
  const Row = ({ l, v, bold }: { l: string; v: string; bold?: boolean }) => <div className={`zrow ${bold ? 'bold' : ''}`}><span>{l}</span><span>{v}</span></div>;
  return (
    <div className="zticket">
      <div className="zc">
        <h4>{RESTO_FISCAL.nombre.toUpperCase()}</h4>
        <div style={{ fontSize: 11 }}>{RESTO_FISCAL.dir}</div>
        <div style={{ fontSize: 11 }}>RUC {RESTO_FISCAL.ruc}</div>
      </div>
      <hr className="zhr" />
      <div className="zc"><div className="zlbl">Reporte interno · Cierre de caja</div><div style={{ fontWeight: 800, fontSize: 14 }}>Terminal 01</div></div>
      <Row l="Fecha" v={now.toLocaleDateString('es-PE')} />
      <Row l="Cierre" v={now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })} />
      <Row l="Cajero" v={cajeroNombre} />
      <hr className="zhr" />
      <div className="zlbl" style={{ marginBottom: 4 }}>Ventas por método</div>
      {METODOS_ORDEN.map((mk) => <Row key={mk} l={METODO_META[mk].label} v={fmt(k.porMetodo[mk])} />)}
      <hr className="zhr" />
      <Row l="Ventas totales" v={fmt(k.totalVentas)} bold />
      <Row l="Egresos" v={fmt(k.totalEgresos)} />
      <Row l="Propinas" v={fmt(k.propinas)} />
      <hr className="zhr" />
      <div className="zlbl" style={{ marginBottom: 4 }}>Arqueo de efectivo</div>
      <Row l="Esperado" v={fmt(esperado)} />
      <Row l="Contado" v={fmt(contado)} />
      <Row l={estado === 'ok' ? 'Cuadre' : estado === 'faltante' ? 'Faltante' : 'Sobrante'} v={`${descuadre > 0 ? '+' : ''}${fmt(descuadre)}`} bold />
      <hr className="zhr" />
      <Row l="Tickets internos" v={`${k.comprobantes}`} />
      <hr className="zhr" />
      <div className="zc" style={{ fontSize: 11, marginTop: 4 }}>Documento interno de control · no válido como comprobante de pago</div>
    </div>
  );
}
