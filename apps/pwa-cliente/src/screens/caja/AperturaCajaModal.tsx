import { useState } from 'react';
import { Icons } from '../../components/ui/icons';
import { fmt } from '../../utils/format';

interface AperturaCajaModalProps {
  loading: boolean;
  onClose: () => void;
  onOpen: (fondoInicial: number) => void | Promise<void>;
}

export function AperturaCajaModal({ loading, onClose, onOpen }: AperturaCajaModalProps) {
  const [fondo, setFondo] = useState('0');
  const monto = Math.max(0, Number(fondo) || 0);

  return (
    <div className="modal-wrap">
      <div className="scrim" onClick={onClose} />
      <div className="modal" style={{ width: 420, position: 'relative', zIndex: 1 }}>
        <div className="panel-h" style={{ padding: '16px 20px' }}>
          <span className="modal-icon" style={{ width: 34, height: 34, margin: 0, borderRadius: 9, background: 'var(--ok-soft)', color: 'var(--ok-text)' }}>
            <Icons.Cash s={17} />
          </span>
          <h3 style={{ fontSize: 17 }}>Abrir caja</h3>
          <span className="spacer" />
          <button className="icon-btn" onClick={onClose}><Icons.Close s={17} /></button>
        </div>
        <div style={{ padding: 20, display: 'grid', gap: 14 }}>
          <div className="field">
            <label>Fondo inicial</label>
            <div className="input">
              <span className="muted">S/</span>
              <input
                value={fondo}
                onChange={(e) => setFondo(e.target.value.replace(/[^\d.]/g, ''))}
                inputMode="decimal"
                style={{ fontSize: 18, fontWeight: 800 }}
              />
            </div>
          </div>
          <div className="muted" style={{ fontSize: 13 }}>Monto: {fmt(monto)}</div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <span className="spacer" />
          <button className="btn btn-primary" disabled={loading} onClick={() => onOpen(monto)}>
            {loading ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <Icons.Cash s={16} />}
            Abrir caja
          </button>
        </div>
      </div>
    </div>
  );
}
