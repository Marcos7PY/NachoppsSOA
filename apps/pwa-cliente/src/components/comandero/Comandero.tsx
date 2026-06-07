// components/comandero/Comandero.tsx — Toma de pedido unificada (Salón/Delivery/Llevar)
// Overlay cableado a APIs reales: productos desde useInventarioQuery, mesas desde
// useMesasQuery, y creación vía usePedidosQuery().crear.
// Nota: el backend (CrearPedidoItemPayload) sólo acepta productoId/cantidad/area/notas;
// no hay modificadores ni descuentos por línea, así que el comandero usa nota de
// cocina por ítem (las "notas rápidas" son constantes de UI).

import { useMemo, useState } from 'react';
import { Icons, type IconName } from '../ui/icons';
import { useToast } from '../ui/ToastProvider';
import { fmt } from '../../utils/format';
import { useInventarioQuery } from '../../hooks/queries/useInventarioQuery';
import { useMesasQuery } from '../../hooks/queries/useMesasQuery';
import { usePedidosQuery } from '../../hooks/queries/usePedidosQuery';
import { NOTAS_RAPIDAS } from '../../data/notas-cocina.const';
import type { ProductoVM } from '../../types/inventario.types';
import type { CrearPedidoItemPayload } from '../../types/pedido.types';

export type Canal = 'SALON' | 'DELIVERY' | 'LLEVAR';

const CANALES: { key: Canal; label: string; ic: IconName }[] = [
  { key: 'SALON', label: 'Salón', ic: 'Mesas' },
  { key: 'DELIVERY', label: 'Delivery', ic: 'Delivery' },
  { key: 'LLEVAR', label: 'Para llevar', ic: 'Bag' },
];

const PROVEEDORES = ['Propio', 'Rappi', 'PedidosYa', 'Didi'];

// Mesas virtuales del backend para canales no-salón
const MESA_DELIVERY_NUM = 99;
const MESA_LLEVAR_NUM = 98;

interface CartLine {
  producto: ProductoVM;
  cantidad: number;
  notas: string;
  noteOpen: boolean;
}

export interface ComanderoProps {
  onClose: () => void;
  /** éxito al enviar (ej. refrescar o navegar) */
  onCreated?: () => void;
  initialCanal?: Canal;
  /** mesa física fijada (modo desde plano de mesas) */
  mesaId?: string;
  mesaNumero?: string;
  mesaZona?: string;
  /** modo "agregar a cuenta abierta" */
  modoAgregar?: boolean;
}

export function Comandero({
  onClose,
  onCreated,
  initialCanal = 'SALON',
  mesaId,
  mesaNumero,
  mesaZona,
  modoAgregar = false,
}: ComanderoProps) {
  const { toast } = useToast();
  const [cat, setCat] = useState<string>('TODAS');
  const [q, setQ] = useState('');
  const search = q.trim();
  const {
    productos,
    categorias,
    loading: loadingInv,
    loadingMore: loadingMoreInv,
    nextCursor,
    fetchMore,
  } = useInventarioQuery(undefined, { limit: 100, search: search || undefined });
  const { mesas } = useMesasQuery();
  const { crear } = usePedidosQuery(mesaId);

  const mesaLock = !!mesaId; // mesa ya definida desde el plano
  const [canal, setCanal] = useState<Canal>(mesaLock ? 'SALON' : initialCanal);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [saving, setSaving] = useState(false);

  // Contexto por canal
  const mesasFisicas = useMemo(
    () => mesas.filter((m) => m.numeroRaw < 90).sort((a, b) => a.numeroRaw - b.numeroRaw),
    [mesas],
  );
  const [selMesaId, setSelMesaId] = useState<string>(mesaId ?? '');
  const [comensales, setComensales] = useState(2);
  const [cliente, setCliente] = useState('');
  const [tel, setTel] = useState('');
  const [dir, setDir] = useState('');
  const [referencia, setReferencia] = useState('');
  const [proveedor, setProveedor] = useState('Propio');
  const [retiro, setRetiro] = useState('');

  // Mesa efectiva por defecto en SALON
  const effectiveMesaId = mesaLock ? mesaId! : selMesaId || mesasFisicas[0]?.id || '';

  const productosFiltrados = useMemo(
    () => productos.filter((p) => {
      const okCat = cat === 'TODAS' || p.categoriaNombre === cat;
      const okQ = !q || p.nombre.toLowerCase().includes(q.toLowerCase());
      return okCat && okQ && p.disponible;
    }),
    [productos, cat, q],
  );

  const cargarMasProductos = nextCursor ? (
    <button className="dish-card" disabled={loadingMoreInv} onClick={() => void fetchMore()}>
      <div className="dish-cat">Catálogo</div>
      <div className="dish-name">{loadingMoreInv ? 'Cargando...' : 'Cargar más productos'}</div>
      <div className="dish-foot">
        <span className="dish-price mono">Más resultados</span>
      </div>
    </button>
  ) : null;

  const subtotal = lines.reduce((s, l) => s + l.producto.precio * l.cantidad, 0);
  const igv = subtotal - subtotal / 1.18;
  const totalItems = lines.reduce((s, l) => s + l.cantidad, 0);

  const addProducto = (prod: ProductoVM) => {
    setLines((ls) => {
      const ex = ls.find((l) => l.producto.id === prod.id);
      if (ex) return ls.map((l) => (l === ex ? { ...l, cantidad: l.cantidad + 1 } : l));
      return [...ls, { producto: prod, cantidad: 1, notas: '', noteOpen: false }];
    });
  };
  const incLine = (id: string, d: number) =>
    setLines((ls) => ls.flatMap((l) => {
      if (l.producto.id !== id) return [l];
      return l.cantidad + d <= 0 ? [] : [{ ...l, cantidad: l.cantidad + d }];
    }));
  const delLine = (id: string) => setLines((ls) => ls.filter((l) => l.producto.id !== id));
  const setNota = (id: string, notas: string) => setLines((ls) => ls.map((l) => (l.producto.id === id ? { ...l, notas } : l)));
  const toggleNote = (id: string) => setLines((ls) => ls.map((l) => (l.producto.id === id ? { ...l, noteOpen: !l.noteOpen } : l)));

  const ctxValido =
    canal === 'SALON' ? !!effectiveMesaId
    : canal === 'DELIVERY' ? cliente.trim() !== '' && dir.trim() !== ''
    : cliente.trim() !== '';
  const puedeEnviar = lines.length > 0 && ctxValido && !saving;

  const enviar = async () => {
    let targetMesaId = '';
    if (canal === 'SALON') {
      targetMesaId = effectiveMesaId;
    } else if (canal === 'DELIVERY') {
      targetMesaId = mesas.find((m) => m.numeroRaw === MESA_DELIVERY_NUM)?.id ?? '';
    } else {
      targetMesaId = mesas.find((m) => m.numeroRaw === MESA_LLEVAR_NUM)?.id ?? '';
    }
    if (!targetMesaId) {
      toast({ title: 'No se pudo enviar', msg: canal === 'SALON' ? 'Selecciona una mesa' : 'Mesa virtual no encontrada (recarga)', icon: 'Alert', kind: 'err' });
      return;
    }

    const items: CrearPedidoItemPayload[] = lines.map((l) => ({
      productoId: l.producto.id,
      cantidad: l.cantidad,
      area: l.producto.categoriaNombre === 'Bebidas' ? 'BAR' : 'COCINA',
      notas: l.notas || '',
    }));

    setSaving(true);
    try {
      await crear({
        mesaId: targetMesaId,
        items,
        cliente: canal !== 'SALON' && cliente.trim() ? cliente.trim() : undefined,
        telefono: canal !== 'SALON' && tel.trim() ? tel.trim() : undefined,
        direccion: canal === 'DELIVERY' && dir.trim() ? dir.trim() : undefined,
        proveedor: canal === 'DELIVERY' ? proveedor : undefined,
        modalidad: canal,
      });
      toast({
        title: modoAgregar ? `Agregado a Mesa ${mesaNumero ?? ''}`.trim() : 'Pedido enviado a cocina',
        msg: `${totalItems} ítem(s) · ${fmt(subtotal)}`,
        icon: 'Check',
      });
      onCreated?.();
      onClose();
    } catch (err) {
      toast({ title: 'Error al enviar', msg: err instanceof Error ? err.message : 'Inténtalo de nuevo', icon: 'Alert', kind: 'err' });
    } finally {
      setSaving(false);
    }
  };

  const titulo = modoAgregar
    ? `Agregar a Mesa ${mesaNumero ?? ''}`.trim()
    : mesaLock ? `Nuevo pedido · Mesa ${mesaNumero ?? ''}`.trim()
    : 'Nuevo pedido';

  return (
    <div className="cmd-overlay">
      <div className="cmd">
        {/* Header */}
        <div className="cmd-head">
          <button className="icon-btn" onClick={onClose} title="Cerrar"><Icons.Close s={18} /></button>
          <h2>{titulo}</h2>
          {mesaLock ? (
            <span className="pill-soft" style={{ marginLeft: 2 }}>{mesaZona ?? 'Salón'}{modoAgregar ? ' · cuenta abierta' : ''}</span>
          ) : (
            <div className="cmd-canal seg">
              {CANALES.map((c) => {
                const Ic = Icons[c.ic];
                return (
                  <button key={c.key} className={canal === c.key ? 'on' : ''} onClick={() => setCanal(c.key)}>
                    <Ic s={15} /> {c.label}
                  </button>
                );
              })}
            </div>
          )}
          <span className="spacer" />
        </div>

        {/* Barra de contexto */}
        <div className="cmd-context">
          <ContextoCanal
            canal={canal}
            mesaLock={mesaLock}
            mesaNumero={mesaNumero}
            mesaZona={mesaZona}
            mesasFisicas={mesasFisicas}
            selMesaId={effectiveMesaId}
            setSelMesaId={setSelMesaId}
            comensales={comensales}
            setComensales={setComensales}
            cliente={cliente} setCliente={setCliente}
            tel={tel} setTel={setTel}
            dir={dir} setDir={setDir}
            referencia={referencia} setReferencia={setReferencia}
            proveedor={proveedor} setProveedor={setProveedor}
            retiro={retiro} setRetiro={setRetiro}
          />
        </div>

        <div className="cmd-body">
          {/* Catálogo */}
          <div className="cmd-catalog">
            <div className="cmd-filters">
              <div className="cmd-cats">
                <button className={`chip ${cat === 'TODAS' ? 'on' : ''}`} onClick={() => setCat('TODAS')}>Todos</button>
                {categorias.map((c) => (
                  <button key={c.id} className={`chip ${cat === c.nombre ? 'on' : ''}`} onClick={() => setCat(c.nombre)}>{c.nombre}</button>
                ))}
              </div>
              <div className="input cmd-search"><Icons.Search s={15} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar plato…" /></div>
            </div>
            <div className="cmd-grid">
              {loadingInv && productos.length === 0 ? (
                <div className="cmd-empty" style={{ gridColumn: '1 / -1' }}><b>Cargando carta…</b></div>
              ) : productosFiltrados.length === 0 ? (
                <>
                  <div className="cmd-empty" style={{ gridColumn: '1 / -1' }}><Icons.Search s={26} /><b>Sin resultados</b><p>Ajusta la categoría o la búsqueda.</p></div>
                  {cargarMasProductos}
                </>
              ) : (
                <>
                  {productosFiltrados.map((p) => {
                    const enCarrito = lines.find((l) => l.producto.id === p.id)?.cantidad ?? 0;
                    return (
                      <button key={p.id} className={`dish-card ${enCarrito ? 'has' : ''}`} onClick={() => addProducto(p)}>
                        {enCarrito > 0 && <span className="dish-badge">{enCarrito}</span>}
                        <div className="dish-cat">{p.categoriaNombre ?? '—'}</div>
                        <div className="dish-name">{p.nombre}</div>
                        <div className="dish-foot">
                          <span className="dish-price mono">{fmt(p.precio)}</span>
                        </div>
                      </button>
                    );
                  })}
                  {cargarMasProductos}
                </>
              )}
            </div>
          </div>

          {/* Comanda */}
          <aside className="cmd-cart">
            <div className="cmd-cart-h">
              <b>{modoAgregar ? 'Nueva ronda' : 'Comanda'}</b>
              {totalItems > 0 && <span className="badge badge-accent">{totalItems} ítems</span>}
              <span className="spacer" />
              {lines.length > 0 && <button className="btn btn-ghost btn-sm" onClick={() => setLines([])}>Vaciar</button>}
            </div>

            <div className="cmd-lines">
              {lines.length === 0 ? (
                <div className="cmd-empty">
                  <Icons.Pedidos s={28} />
                  <b>{modoAgregar ? 'Agrega una nueva ronda' : 'Comanda vacía'}</b>
                  <p>Toca un plato para agregarlo a la comanda.</p>
                </div>
              ) : lines.map((l) => (
                <div className="cmd-line" key={l.producto.id}>
                  <div className="cmd-line-top">
                    <div className="cmd-line-main">
                      <div className="cmd-line-name">{l.producto.nombre}</div>
                      <div className="muted" style={{ fontSize: 11.5, marginTop: 1 }}>{fmt(l.producto.precio)} c/u</div>
                    </div>
                    <span className="cmd-line-price mono">{fmt(l.producto.precio * l.cantidad)}</span>
                  </div>
                  <div className="cmd-line-ctrl">
                    <div className="stepper sm">
                      <button onClick={() => incLine(l.producto.id, -1)}><Icons.Minus s={13} /></button>
                      <span className="qv">{l.cantidad}</span>
                      <button onClick={() => incLine(l.producto.id, 1)}><Icons.Plus s={13} /></button>
                    </div>
                    <button className={`cmd-note-btn ${l.notas ? 'has' : ''}`} onClick={() => toggleNote(l.producto.id)} title="Nota"><Icons.Note s={14} /> Nota</button>
                    <button className="cmd-del" onClick={() => delLine(l.producto.id)} title="Quitar"><Icons.Close s={14} /></button>
                  </div>
                  {(l.noteOpen || l.notas) && (
                    <div className="cmd-note-row">
                      <div className="input" style={{ height: 32 }}>
                        <input value={l.notas} autoFocus={l.noteOpen} onChange={(e) => setNota(l.producto.id, e.target.value)} placeholder="Nota para cocina (ej. sin cebolla)" />
                      </div>
                      <div className="cmd-note-chips">
                        {NOTAS_RAPIDAS.slice(0, 4).map((n) => (
                          <button key={n} className="chip" onClick={() => setNota(l.producto.id, l.notas ? (l.notas.includes(n) ? l.notas : l.notas + ', ' + n) : n)}>{n}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="cmd-cart-foot">
              <div className="kv"><span className="k">Subtotal</span><span className="v mono">{fmt(subtotal)}</span></div>
              <div className="kv"><span className="k">IGV (18%)</span><span className="v mono">{fmt(igv)}</span></div>
              <div className="kv total"><span className="k">Total</span><span className="v mono">{fmt(subtotal)}</span></div>
              <button className="btn btn-primary btn-block" style={{ height: 46, fontSize: 15 }} disabled={!puedeEnviar} onClick={enviar}>
                {saving ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <Icons.Cocina s={17} />}
                {modoAgregar ? ' Agregar a la cuenta' : ' Enviar a cocina'}{totalItems ? ` · ${totalItems}` : ''}
              </button>
              {!ctxValido && lines.length > 0 && (
                <div className="hint" style={{ textAlign: 'center', color: 'var(--danger-text)', marginTop: 8 }}>
                  {canal === 'SALON' ? 'Selecciona una mesa' : canal === 'DELIVERY' ? 'Completa cliente y dirección' : 'Ingresa el nombre del cliente'}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ─── Contexto por canal ─────────────────────────────────────────
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

function ContextoCanal(p: ContextoProps) {
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
