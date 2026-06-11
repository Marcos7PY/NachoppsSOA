// screens/caja/MovimientoModal.tsx — Egreso / Ingreso de efectivo.

import { Scrim } from '../../components/ui/Scrim';
import { useRef, useState } from 'react';
import { Icons } from '../../components/ui/icons';
import { fmt } from '../../utils/format';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import type { CrearMovimientoCajaPayload } from '../../types/caja.types';

const CATS: Record<'EGRESO' | 'INGRESO', string[]> = {
  EGRESO: ['Insumos cocina', 'Proveedor', 'Movilidad / delivery', 'Servicios', 'Caja chica', 'Otros'],
  INGRESO: ['Aumento de fondo', 'Reembolso', 'Cambio / sencillo', 'Otros'],
};

interface Props {
  tipoInicial: 'EGRESO' | 'INGRESO';
  onClose: () => void;
  onSave: (mov: CrearMovimientoCajaPayload) => void | Promise<void>;
}

export function MovimientoModal({ tipoInicial, onClose, onSave }: Readonly<Props>) {
  const [tipo, setTipo] = useState<'EGRESO' | 'INGRESO'>(tipoInicial);
  const [monto, setMonto] = useState('');
  const [cat, setCat] = useState(CATS[tipoInicial][0]);
  const [nota, setNota] = useState('');
  const modalRef = useRef<HTMLDialogElement>(null);
  useFocusTrap(modalRef, { active: true, onClose });

  const esEgreso = tipo === 'EGRESO';
  const num = Number(monto || 0);
  const valido = num > 0;

  const switchTipo = (t: 'EGRESO' | 'INGRESO') => { setTipo(t); setCat(CATS[t][0]); };

  const guardar = () => {
    onSave({
      tipo,
      donde: cat,
      motivo: nota || undefined,
      monto: Math.abs(num),
    });
  };

  return (
    <div className="modal-wrap">
      <Scrim onClose={onClose} />
      <dialog
        open
        className="modal wide"
        ref={modalRef}
        aria-modal="true"
        aria-label="Movimiento de efectivo"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div className="panel-h" style={{ padding: '16px 20px' }}>
          <span className="modal-icon" style={{ width: 34, height: 34, margin: 0, borderRadius: 9, background: esEgreso ? 'var(--danger-soft)' : 'var(--ok-soft)', color: esEgreso ? 'var(--danger-text)' : 'var(--ok-text)' }}>
            {esEgreso ? <Icons.ArrowDown s={17} /> : <Icons.ArrowUp s={17} />}
          </span>
          <h3 style={{ fontSize: 18 }}>Movimiento de efectivo</h3>
          <span className="spacer" />
          <button className="icon-btn" onClick={onClose}><Icons.Close s={17} /></button>
        </div>

        <div style={{ padding: 20, display: 'grid', gap: 16 }}>
          <div className="seg" style={{ width: '100%' }}>
            <button className={esEgreso ? 'on' : ''} style={{ flex: 1 }} onClick={() => switchTipo('EGRESO')}>Egreso (sale)</button>
            <button className={esEgreso ? '' : 'on'} style={{ flex: 1 }} onClick={() => switchTipo('INGRESO')}>Ingreso (entra)</button>
          </div>

          <div className="two-up" style={{ gap: 16 }}>
            <div>
              <div className="field" style={{ marginBottom: 10 }}>
                <label htmlFor="mov-monto">Monto</label>
                <div className="input"><span className="muted">S/</span><input id="mov-monto" autoFocus value={monto} onChange={(e) => setMonto(e.target.value.replace(/[^\d.]/g, ''))} inputMode="decimal" placeholder="0.00" style={{ fontSize: 20, fontWeight: 800 }} /></div>
              </div>
              <div className="keypad">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => <button key={d} onClick={() => setMonto((m) => m + d)}>{d}</button>)}
                <button onClick={() => setMonto((m) => (m.includes('.') ? m : (m || '0') + '.'))}>.</button>
                <button onClick={() => setMonto((m) => m + '0')}>0</button>
                <button onClick={() => setMonto('')}>C</button>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
              <div className="field">
                <span className="lbl">Categoría</span>
                <div className="row" style={{ flexWrap: 'wrap', gap: 7 }}>
                  {CATS[tipo].map((c) => (
                    <button key={c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>{c}</button>
                  ))}
                </div>
              </div>
              <div className="field">
                <label htmlFor="mov-nota">Nota (opcional)</label>
                <div className="input"><input id="mov-nota" value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Ej. balón de gas, proveedor de pescado…" /></div>
              </div>
              <div className={`cuadre ${esEgreso ? 'faltante' : 'ok'}`} style={{ padding: '12px 14px' }}>
                <div className="lbl">{esEgreso ? 'Sale de caja' : 'Entra a caja'}</div>
                <div className="big" style={{ fontSize: 26 }}>{esEgreso ? '−' : '+'} {fmt(num)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-foot" style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <span className="spacer" />
          <button className={`btn ${esEgreso ? 'btn-danger' : 'btn-success'}`} disabled={!valido} onClick={guardar}>
            <Icons.Check s={16} /> Registrar {esEgreso ? 'egreso' : 'ingreso'}
          </button>
        </div>
      </dialog>
    </div>
  );
}
