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
  mesaUbicacion?: string;
  mesasFisicas: { id: string; numero: string; ubicacion: string }[];
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

function Stepper({ value, onChange, min = 1 }: Readonly<{ value: number; onChange: (n: number) => void; min?: number }>) {
  return (
    <div className="stepper">
      <button onClick={() => onChange(Math.max(min, value - 1))}><Icons.Minus s={14} /></button>
      <span className="qv">{value}</span>
      <button onClick={() => onChange(value + 1)}><Icons.Plus s={14} /></button>
    </div>
  );
}

export function ContextoCanal(p: Readonly<ContextoProps>) {
  if (p.mesaLock) {
    return (
      <div className="ctx-row">
        <div className="ctx-stat">
          <span className="ctx-stat-ic" style={{ background: 'var(--accent-soft)', color: 'var(--accent-text)' }}><Icons.Mesas s={16} /></span>
          <div><b>Mesa {p.mesaNumero}</b><small>{p.mesaUbicacion ?? 'Salón'}</small></div>
        </div>
        <div className="ctx-field">
          <span className="lbl">Comensales</span>
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
          <span className="lbl">Mesa</span>
          <div className="ctx-mesas">
            {p.mesasFisicas.map((m) => (
              <button key={m.id} className={`ctx-mesa ${p.selMesaId === m.id ? 'on' : ''}`} onClick={() => p.setSelMesaId(m.id)} title={`Mesa ${m.numero} · ${m.ubicacion}`}>{m.numero}</button>
            ))}
          </div>
        </div>
        <div className="ctx-field">
          <span className="lbl">Comensales</span>
          <Stepper value={p.comensales} onChange={p.setComensales} />
        </div>
      </div>
    );
  }
  if (p.canal === 'DELIVERY') {
    return (
      <div className="ctx-row delivery">
        <div className="ctx-field"><span className="lbl">Proveedor</span>
          <div className="seg sm">{PROVEEDORES.map((x) => <button key={x} className={p.proveedor === x ? 'on' : ''} onClick={() => p.setProveedor(x)}>{x}</button>)}</div>
        </div>
        <div className="ctx-field"><label htmlFor="ctx-dlv-cliente">Cliente *</label><div className="input"><input id="ctx-dlv-cliente" value={p.cliente} onChange={(e) => p.setCliente(e.target.value)} placeholder="Nombre" /></div></div>
        <div className="ctx-field"><label htmlFor="ctx-dlv-tel">Teléfono</label><div className="input"><input id="ctx-dlv-tel" value={p.tel} onChange={(e) => p.setTel(e.target.value)} inputMode="tel" placeholder="9xx xxx xxx" /></div></div>
        <div className="ctx-field grow"><label htmlFor="ctx-dlv-dir">Dirección *</label><div className="input"><input id="ctx-dlv-dir" value={p.dir} onChange={(e) => p.setDir(e.target.value)} placeholder="Av. / Calle, número" /></div></div>
        <div className="ctx-field grow"><label htmlFor="ctx-dlv-ref">Referencia</label><div className="input"><input id="ctx-dlv-ref" value={p.referencia} onChange={(e) => p.setReferencia(e.target.value)} placeholder="Color de puerta, piso…" /></div></div>
      </div>
    );
  }
  return (
    <div className="ctx-row">
      <div className="ctx-field"><label htmlFor="ctx-llv-cliente">Cliente *</label><div className="input"><input id="ctx-llv-cliente" value={p.cliente} onChange={(e) => p.setCliente(e.target.value)} placeholder="Nombre" /></div></div>
      <div className="ctx-field"><label htmlFor="ctx-llv-tel">Teléfono</label><div className="input"><input id="ctx-llv-tel" value={p.tel} onChange={(e) => p.setTel(e.target.value)} inputMode="tel" placeholder="9xx xxx xxx" /></div></div>
      <div className="ctx-field"><label htmlFor="ctx-llv-retiro">Hora de retiro</label><div className="input"><input id="ctx-llv-retiro" value={p.retiro} onChange={(e) => p.setRetiro(e.target.value)} placeholder="21:30" /></div></div>
    </div>
  );
}
