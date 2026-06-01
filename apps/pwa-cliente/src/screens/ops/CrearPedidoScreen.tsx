// screens/ops/CrearPedidoScreen.tsx — Catálogo y Formulario Unificado de Creación de Pedidos
import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { usePedidosQuery } from '../../hooks/queries/usePedidosQuery';
import { useMesasQuery } from '../../hooks/queries/useMesasQuery';
import { useCuentasQuery } from '../../hooks/queries/useCuentasQuery';
import { useInventarioQuery } from '../../hooks/queries/useInventarioQuery';
import type { CrearPedidoItemPayload } from '../../types/pedido.types';
import type { ProductoVM } from '../../types/inventario.types';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const ESTADOS_PEDIDO_CERRADO = new Set(['PAGADO', 'CANCELADO']);

function pedidoEstaActivo(pedido: { estado: string }) {
  return !ESTADOS_PEDIDO_CERRADO.has(pedido.estado);
}

export function CrearPedidoScreen() {
  const online = useOnlineStatus();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramMesaId = searchParams.get('mesaId');
  const paramCanal = searchParams.get('canal');

  // Stores
  // UI Feedbacks y Local State
  const [selectedMesaId, setSelectedMesaId] = useState<string>('');

  // Stores (React Query)
  const { pedidos: pedidosMesa, crear: crearPedido } = usePedidosQuery(selectedMesaId || undefined);
  const { mesas } = useMesasQuery();
  const { cuentaActiva } = useCuentasQuery(selectedMesaId || undefined);
  const { productos, categorias, loading: loadingInv } = useInventarioQuery();

  // Estados locales
  const [tipo, setTipo] = useState<'SALON' | 'DELIVERY' | 'LLEVAR'>('SALON');
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteTelefono, setClienteTelefono] = useState('');
  const [clienteDireccion, setClienteDireccion] = useState('');
  const [proveedorDelivery, setProveedorDelivery] = useState<'Rappi' | 'Mostrador' | 'App'>('Rappi');
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('TODAS');
  
  // Canasta del pedido
  const [carrito, setCarrito] = useState<Record<string, { producto: ProductoVM; cantidad: number; notas: string }>>({});
  
  // UI Feedbacks
  const [saving, setSaving] = useState(false);
  const [sincronizandoMesa, setSincronizandoMesa] = useState(false);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const [successLocal, setSuccessLocal] = useState<string | null>(null);


  // Mesas físicas
  const mesasFisicas = useMemo(() => {
    return [...mesas.filter((m) => m.numeroRaw < 90)].sort((a, b) => a.numeroRaw - b.numeroRaw);
  }, [mesas]);

  // Sincronizar parámetros de consulta
  useEffect(() => {
    if (paramCanal) {
      setTipo(paramCanal as any);
    } else if (paramMesaId) {
      setTipo('SALON');
    }

    if (paramMesaId) {
      setSelectedMesaId(paramMesaId);
    } else if (tipo === 'SALON' && !selectedMesaId && mesasFisicas.length > 0) {
      setSelectedMesaId(mesasFisicas[0].id);
    }
  }, [paramMesaId, paramCanal, tipo, mesasFisicas, selectedMesaId]);

  // Encontrar mesas virtuales
  const mesaDelivery = mesas.find((m) => m.numeroRaw === 99);
  const mesaLlevar = mesas.find((m) => m.numeroRaw === 98);

  // Filtrar productos
  const productosFiltrados = productos.filter((p) => {
    const matchesSearch = p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase());
    const matchesCategory = categoriaSeleccionada === 'TODAS' || p.categoriaNombre === categoriaSeleccionada;
    return matchesSearch && matchesCategory && p.disponible;
  });

  // Métodos de Carrito
  const agregarAlCarrito = (prod: ProductoVM) => {
    setCarrito((curr) => {
      const exist = curr[prod.id];
      return {
        ...curr,
        [prod.id]: {
          producto: prod,
          cantidad: exist ? exist.cantidad + 1 : 1,
          notas: exist ? exist.notas : '',
        },
      };
    });
  };

  const quitarDelCarrito = (prodId: string) => {
    setCarrito((curr) => {
      const exist = curr[prodId];
      if (!exist) return curr;
      if (exist.cantidad === 1) {
        const copy = { ...curr };
        delete copy[prodId];
        return copy;
      }
      return {
        ...curr,
        [prodId]: {
          ...exist,
          cantidad: exist.cantidad - 1,
        },
      };
    });
  };

  const actualizarNotasItem = (prodId: string, notas: string) => {
    setCarrito((curr) => {
      if (!curr[prodId]) return curr;
      return {
        ...curr,
        [prodId]: {
          ...curr[prodId],
          notas,
        },
      };
    });
  };

  const totalCarrito = Object.values(carrito).reduce(
    (sum, item) => sum + Number(item.producto.precio) * item.cantidad,
    0
  );

  const totalItems = Object.values(carrito).reduce((sum, item) => sum + item.cantidad, 0);
  const pedidosSesion = tipo === 'SALON'
    ? cuentaActiva?.mesaId === selectedMesaId
      ? cuentaActiva.pedidos
      : pedidosMesa.filter((pedido) => pedido.mesaId === selectedMesaId && pedidoEstaActivo(pedido))
    : [];
  const itemsSesion = pedidosSesion.flatMap((pedido) => pedido.items);
  const totalSesion = cuentaActiva?.mesaId === selectedMesaId
    ? cuentaActiva.total
    : pedidosSesion.reduce((sum, pedido) => sum + Number(pedido.total), 0);

  // Crear Pedido
  const handleCrearPedido = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorLocal(null);
    setSuccessLocal(null);

    let targetMesa;
    if (tipo === 'SALON') {
      targetMesa = mesasFisicas.find(m => m.id === selectedMesaId);
    } else if (tipo === 'DELIVERY') {
      targetMesa = mesaDelivery;
    } else {
      targetMesa = mesaLlevar;
    }

    if (!targetMesa) {
      setErrorLocal(tipo === 'SALON' ? 'Selecciona una mesa de salón válida.' : 'Mesa virtual para pedido no encontrada. Por favor, recarga.');
      return;
    }

    const itemsCanasta = Object.values(carrito);
    if (itemsCanasta.length === 0) {
      setErrorLocal('Selecciona al menos un producto para el pedido.');
      return;
    }

    if (tipo !== 'SALON' && !clienteNombre.trim()) {
      setErrorLocal('El nombre del cliente es requerido.');
      return;
    }

    if (tipo === 'DELIVERY' && !clienteDireccion.trim()) {
      setErrorLocal('La dirección de entrega es obligatoria para Delivery.');
      return;
    }

    setSaving(true);
    try {
      const itemsPayload: CrearPedidoItemPayload[] = itemsCanasta.map((it) => ({
        productoId: it.producto.id,
        cantidad: it.cantidad,
        area: it.producto.categoriaNombre === 'Bebidas' ? 'BAR' : 'COCINA',
        notas: it.notas || '',
      }));

      await crearPedido({
        mesaId: targetMesa.id,
        items: itemsPayload,
        cliente: tipo !== 'SALON' && clienteNombre.trim() ? clienteNombre.trim() : undefined,
        telefono: tipo !== 'SALON' && clienteTelefono.trim() ? clienteTelefono.trim() : undefined,
        direccion: tipo === 'DELIVERY' && clienteDireccion.trim() ? clienteDireccion.trim() : undefined,
        proveedor: tipo === 'DELIVERY' ? proveedorDelivery : undefined,
        modalidad: tipo,
      });

      setSuccessLocal(`Pedido de ${tipo.toLowerCase()} enviado con éxito.`);
      setCarrito({});
      setClienteNombre('');
      setClienteTelefono('');
      setClienteDireccion('');

      // Redirección según mockup
      setTimeout(() => {
        if (tipo === 'SALON') {
          navigate('/app/mesas');
        } else {
          navigate('/app/pedidos');
        }
      }, 1000);
    } catch (err) {
      setErrorLocal(err instanceof Error ? err.message : 'Error al enviar el pedido.');
    } finally {
      setSincronizandoMesa(false);
      setSaving(false);
    }
  };

  if (loadingInv && productos.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>Cargando catálogo de productos…</div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* BANNER FEEDBACK */}
      {(errorLocal || successLocal || sincronizandoMesa) && (
        <div className={`banner ${errorLocal ? 'err' : 'ok'}`} style={{ marginBottom: 16 }}>
          <span>{sincronizandoMesa ? 'Pedido enviado. Sincronizando mesa y cuenta…' : (errorLocal ?? successLocal)}</span>
          <span className="spacer" />
          {!sincronizandoMesa && (
            <button className="btn btn-sm btn-ghost" onClick={() => { setErrorLocal(null); setSuccessLocal(null); }}>Cerrar</button>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: 18, height: '100%', alignItems: 'stretch' }}>
        
        {/* PANEL IZQUIERDO: CATÁLOGO */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          
          <div className="page-h" style={{ paddingBottom: 10 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate(tipo === 'SALON' ? '/app/mesas' : '/app/pedidos')} style={{ marginRight: 12 }}>
              Volver
            </button>
            <div>
              <h1>Nuevo Pedido</h1>
              <p className="sub">
                {tipo === 'SALON' && selectedMesaId
                  ? `Mesa ${mesasFisicas.find(m => m.id === selectedMesaId)?.numero || ''} · Canal Salón`
                  : tipo === 'DELIVERY' ? 'Canal Delivery' : 'Canal Para Llevar'
                }
              </p>
            </div>
          </div>

          {/* SELECTOR DE CANAL Y CAMPOS */}
          <div className="panel" style={{ padding: 16, marginBottom: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                <span className="muted" style={{ fontSize: 13, fontWeight: 'bold' }}>Canal</span>
                <div className="seg">
                  <button type="button" className={tipo === 'SALON' ? 'on' : ''} onClick={() => setTipo('SALON')}>Salón</button>
                  <button type="button" className={tipo === 'DELIVERY' ? 'on' : ''} onClick={() => setTipo('DELIVERY')}>Delivery</button>
                  <button type="button" className={tipo === 'LLEVAR' ? 'on' : ''} onClick={() => setTipo('LLEVAR')}>Para Llevar</button>
                </div>

                {tipo === 'SALON' && (
                  <div className="input" style={{ width: 'auto', padding: '0 8px', height: 32 }}>
                    <select 
                      value={selectedMesaId} 
                      onChange={(e) => setSelectedMesaId(e.target.value)} 
                      style={{ fontWeight: 700, border: 0, background: 'transparent', height: '100%', fontSize: 13 }}
                    >
                      {mesasFisicas.map((m) => (
                        <option key={m.id} value={m.id}>Mesa {m.numero} · {m.zona}</option>
                      ))}
                    </select>
                  </div>
                )}

                {tipo === 'LLEVAR' && (
                  <div className="input" style={{ width: 220, padding: '0 10px', height: 32 }}>
                    <input 
                      value={clienteNombre} 
                      onChange={(e) => setClienteNombre(e.target.value)} 
                      placeholder="Cliente (opcional)" 
                      style={{ border: 0, background: 'transparent', width: '100%', height: '100%', fontSize: 12.5 }}
                    />
                  </div>
                )}
              </div>

              {tipo === 'DELIVERY' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                  <div className="seg" style={{ height: 32 }}>
                    <button type="button" className={proveedorDelivery === 'Rappi' ? 'on' : ''} onClick={() => setProveedorDelivery('Rappi')}>Rappi</button>
                    <button type="button" className={proveedorDelivery === 'Mostrador' ? 'on' : ''} onClick={() => setProveedorDelivery('Mostrador')}>Mostrador</button>
                    <button type="button" className={proveedorDelivery === 'App' ? 'on' : ''} onClick={() => setProveedorDelivery('App')}>App</button>
                  </div>
                  <div className="input" style={{ width: 170, padding: '0 10px', height: 32 }}>
                    <input 
                      value={clienteNombre} 
                      onChange={(e) => setClienteNombre(e.target.value)} 
                      placeholder="Cliente *" 
                      style={{ border: 0, background: 'transparent', width: '100%', height: '100%', fontSize: 12.5 }}
                    />
                  </div>
                  <div className="input" style={{ flex: 1, minWidth: 200, padding: '0 10px', height: 32 }}>
                    <input 
                      value={clienteDireccion} 
                      onChange={(e) => setClienteDireccion(e.target.value)} 
                      placeholder="Dirección de entrega *" 
                      style={{ border: 0, background: 'transparent', width: '100%', height: '100%', fontSize: 12.5 }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FILTRO CATEGORÍAS Y BÚSQUEDA */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
            <div className="filters" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
              <button type="button" className={`chip ${categoriaSeleccionada === 'TODAS' ? 'on' : ''}`} onClick={() => setCategoriaSeleccionada('TODAS')}>
                Todos
              </button>
              {categorias.map((c) => (
                <button type="button" key={c.id} className={`chip ${categoriaSeleccionada === c.nombre ? 'on' : ''}`} onClick={() => setCategoriaSeleccionada(c.nombre)}>
                  {c.nombre}
                </button>
              ))}
            </div>
            <div className="input" style={{ width: 200, height: 32, padding: '0 10px' }}>
              <input 
                value={busquedaProducto} 
                onChange={(e) => setBusquedaProducto(e.target.value)} 
                placeholder="Buscar producto…" 
                style={{ border: 0, background: 'transparent', width: '100%', height: '100%', fontSize: 12.5 }}
              />
            </div>
          </div>

          {/* GRID DE PRODUCTOS */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div className="mesa-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, paddingBottom: 16 }}>
              {productosFiltrados.length === 0 ? (
                <div className="empty" style={{ gridColumn: '1 / -1', padding: 32 }}>
                  <h3>No hay productos</h3>
                  <p>Ningún producto coincide con la categoría o búsqueda seleccionada.</p>
                </div>
              ) : (
                productosFiltrados.map((p) => {
                  const cant = carrito[p.id]?.cantidad || 0;
                  const stockOut = p.stockActual !== null && p.stockActual <= 0;
                  return (
                    <button 
                      type="button"
                      key={p.id} 
                      className={`mesa-card ${stockOut ? 'limpieza' : 'libre'} ${cant > 0 ? 'sel' : ''}`}
                      disabled={!p.disponible || stockOut}
                      onClick={() => agregarAlCarrito(p)}
                      style={{ minHeight: 110, padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'left' }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="badge badge-muted" style={{ fontSize: 9.5 }}>{p.categoriaNombre}</span>
                          {cant > 0 && <span className="badge badge-accent" style={{ fontSize: 10, fontWeight: 'bold' }}>{cant}x</span>}
                        </div>
                        <strong style={{ display: 'block', marginTop: 8, fontSize: 13.5 }}>{p.nombre}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                        <span className="mono" style={{ fontWeight: 'bold' }}>S/ {Number(p.precio).toFixed(2)}</span>
                        {stockOut && <span className="badge badge-danger" style={{ fontSize: 9 }}>Agotado</span>}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* PANEL DERECHO: CARRITO */}
        <aside className="panel" style={{ width: 348, flex: 'none', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* Consumo de la Sesión Activa de la Mesa */}
          {tipo === 'SALON' && itemsSesion.length > 0 && (
            <div style={{ borderBottom: '2px solid var(--border)', background: 'var(--surface-2)', display: 'flex', flexDirection: 'column', maxHeight: '45%' }}>
              <div className="panel-h" style={{ padding: '8px 16px', background: 'var(--surface-3)', borderBottom: '1px solid var(--border-soft)' }}>
                <h4 style={{ margin: 0, fontSize: 13, color: 'var(--accent-text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ReceiptIcon /> Consumo Sesión (Mesa {mesasFisicas.find(m => m.id === selectedMesaId)?.numero})
                </h4>
                <span className="badge badge-info dot" style={{ fontSize: 10 }}>
                  {cuentaActiva?.mesaId === selectedMesaId ? 'Cuenta' : 'Pedido'}
                </span>
              </div>
              <div style={{ padding: '10px 16px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {itemsSesion.map((it, idx) => (
                  <div key={it.id || idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, borderBottom: '1px solid var(--border-soft)', paddingBottom: 4 }}>
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '75%' }}>
                      <strong style={{ color: 'var(--accent-text)' }}>{it.cantidad}×</strong> {it.nombre}
                    </span>
                    <span className="mono" style={{ fontWeight: '600' }}>
                      S/ {(Number(it.precioUnitario) * it.cantidad).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 12.5, marginTop: 4, paddingTop: 4, borderTop: '1px solid var(--border)', alignItems: 'center' }}>
                  <div>
                    <span>Total Previo:</span>
                    <span className="mono" style={{ color: 'var(--accent)', marginLeft: 6 }}>
                      S/ {Number(totalSesion).toFixed(2)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    onClick={() => navigate(`/app/caja?mesaId=${selectedMesaId}`)}
                    style={{ fontSize: 11, padding: '2px 8px', height: 22 }}
                  >
                    Ver Caja
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="panel-h">
            <h3>Pedido Nuevo</h3>
            {totalItems > 0 && <span className="badge badge-accent">{totalItems} ítems</span>}
          </div>

          {Object.values(carrito).length === 0 ? (
            <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center' }}>
              <div className="muted">
                <p style={{ fontSize: 14, fontWeight: 'bold', margin: '0 0 4px 0' }}>Carrito vacío</p>
                <p style={{ fontSize: 12, margin: 0 }}>Toca un producto de la izquierda para agregarlo al pedido.</p>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto', padding: '4px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Object.values(carrito).map((item) => (
                <div key={item.producto.id} style={{ display: 'flex', flexDirection: 'column', gap: 6, background: 'var(--surface-2)', padding: 10, borderRadius: 'var(--r-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, marginRight: 8 }}>
                      <strong style={{ fontSize: 13 }}>{item.producto.nombre}</strong>
                      <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
                        S/ {Number(item.producto.precio).toFixed(2)} c/u
                      </div>
                    </div>
                    <span className="mono" style={{ fontWeight: 'bold', fontSize: 13 }}>
                      S/ {(Number(item.producto.precio) * item.cantidad).toFixed(2)}
                    </span>
                  </div>
                  
                  {/* Stepper & Note Row */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                    <input
                      placeholder="Nota (ej. sin cebolla)"
                      value={item.notas}
                      onChange={(e) => actualizarNotasItem(item.producto.id, e.target.value)}
                      style={{ flex: 1, height: 26, fontSize: 11.5, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, padding: '0 6px' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button type="button" className="btn btn-sm btn-ghost" onClick={() => quitarDelCarrito(item.producto.id)} style={{ width: 22, height: 22, padding: 0 }}>-</button>
                      <span className="mono" style={{ fontWeight: 'bold', fontSize: 12.5 }}>{item.cantidad}</span>
                      <button type="button" className="btn btn-sm btn-ghost" onClick={() => agregarAlCarrito(item.producto)} style={{ width: 22, height: 22, padding: 0 }}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ padding: 16, borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <strong>Total (IGV incl.):</strong>
              <strong className="mono" style={{ fontSize: 18, color: 'var(--accent)' }}>S/ {totalCarrito.toFixed(2)}</strong>
            </div>

            <button
              onClick={handleCrearPedido}
              className="btn btn-primary btn-block"
              disabled={saving || !online || Object.values(carrito).length === 0}
              style={{ height: 40 }}
            >
              {sincronizandoMesa ? 'Sincronizando…' : saving ? 'Enviando…' : 'Enviar pedido'}
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
}

function ReceiptIcon() {
  return (
    <svg className="ic" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2-3-2Z" /><path d="M8 10h8" /><path d="M8 14h4" />
    </svg>
  );
}
