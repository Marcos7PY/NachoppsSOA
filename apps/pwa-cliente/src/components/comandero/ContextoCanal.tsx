// components/comandero/ContextoCanal.tsx — Barra de contexto por canal del Comandero.
// Extraído del Comandero en T-22: mesa/comensales (salón), datos de cliente
// (delivery/llevar) y el stepper de comensales. Solo presentación + estado vía props.

import { Icons } from '../ui/icons';
import type { Canal } from '../../domain/pedido.flow';

const PROVEEDORES = ['Propio', 'Rappi', 'PedidosYa', 'Didi'];

interface ContextoProps {
  canal: Canal;
  mesaLock: boolean;
  mesaNumero?: string;
  mesaZona?: string;
  mesasFisicas: { id: string; numero: string; zona: string }[];
  selMesaId: string;
  setSelMesaId: (id: string) => void;
  comensales: number;
  setComensales: (n: number) => void;
  cliente: string; setCliente: (v: string) => void;
  tel: string; setTel: (v: string) => void;
  dir: string; setDir: (v: string) => void;
  referencia: string; setReferencia: (v: string) => void;
  proveedor: string; setProveedor: (v: string) => void;
  retiro: string; setRetiro: (v: string) => void;
}

function Stepper({ value, onChange, min = 1 }: { value: number; onChange: (n: number) => void; min?: number }) {
  return (
    <div className="stepper">
      <button onClick={() => onChange(Math.max(min, value - 1))}><Icons.Minus s={14} /></button>
      <span className="qv">{value}</span>
      <button onClick={() => onChange(value + 1)}><Icons.Plus s={14} /></button>
    </div>
  );
}

export function ContextoCanal(p: ContextoProps) {
  if (p.mesaLock) {
    return (
      <div className="ctx-row">
        <div className="ctx-stat">
          <span className="ctx-stat-ic" style={{ background: 'var(--accent-soft)', color: 'var(--accent-text)' }}><Icons.Mesas s={16} /></span>
          <div><b>Mesa {p.mesaNumero}</b><small>{p.mesaZona ?? 'Salón'}</small></div>
        </div>
        <div className="ctx-field">
          <label>Comensales</label>
          <Stepper value={p.comensales} onChange={p.setComensales} />
        </div>
        <span className="spacer" />
        <div className="hint" style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Icons.Note s={15} /> Lo que agregues se enviará a cocina y se sumará a la cuenta.</div>
      </div>
    );
  }
  if (p.canal === 'SALON') {
    return (
      <div className="ctx-row">
        <div className="ctx-field">
          <label>Mesa</label>
          <div className="ctx-mesas">
            {p.mesasFisicas.map((m) => (
              <button key={m.id} className={`ctx-mesa ${p.selMesaId === m.id ? 'on' : ''}`} onClick={() => p.setSelMesaId(m.id)} title={`Mesa ${m.numero} · ${m.zona}`}>{m.numero}</button>
            ))}
          </div>
        </div>
        <div className="ctx-field">
          <label>Comensales</label>
          <Stepper value={p.comensales} onChange={p.setComensales} />
        </div>
      </div>
    );
  }
  if (p.canal === 'DELIVERY') {
    return (
      <div className="ctx-row delivery">
        <div className="ctx-field"><label>Proveedor</label>
          <div className="seg sm">{PROVEEDORES.map((x) => <button key={x} className={p.proveedor === x ? 'on' : ''} onClick={() => p.setProveedor(x)}>{x}</button>)}</div>
        </div>
        <div className="ctx-field"><label>Cliente *</label><div className="input"><input value={p.cliente} onChange={(e) => p.setCliente(e.target.value)} placeholder="Nombre" /></div></div>
        <div className="ctx-field"><label>Teléfono</label><div className="input"><input value={p.tel} onChange={(e) => p.setTel(e.target.value)} inputMode="tel" placeholder="9xx xxx xxx" /></div></div>
        <div className="ctx-field grow"><label>Dirección *</label><div className="input"><input value={p.dir} onChange={(e) => p.setDir(e.target.value)} placeholder="Av. / Calle, número" /></div></div>
        <div className="ctx-field grow"><label>Referencia</label><div className="input"><input value={p.referencia} onChange={(e) => p.setReferencia(e.target.value)} placeholder="Color de puerta, piso…" /></div></div>
      </div>
    );
  }
  return (
    <div className="ctx-row">
      <div className="ctx-field"><label>Cliente *</label><div className="input"><input value={p.cliente} onChange={(e) => p.setCliente(e.target.value)} placeholder="Nombre" /></div></div>
      <div className="ctx-field"><label>Teléfono</label><div className="input"><input value={p.tel} onChange={(e) => p.setTel(e.target.value)} inputMode="tel" placeholder="9xx xxx xxx" /></div></div>
      <div className="ctx-field"><label>Hora de retiro</label><div className="input"><input value={p.retiro} onChange={(e) => p.setRetiro(e.target.value)} placeholder="21:30" /></div></div>
    </div>
  );
}
