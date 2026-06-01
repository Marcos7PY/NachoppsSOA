// screens/ops/DeliveryScreen.tsx — Gestión de Delivery, Llevar y Pedidos en Mesa (Salón)
import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { usePedidosStore } from '../../store/pedidos.store';
import { useMesasStore } from '../../store/mesas.store';
import { useInventarioStore } from '../../store/inventario.store';
import type { CrearPedidoItemPayload } from '../../types/pedido.types';
import type { ProductoVM } from '../../types/inventario.types';

export function DeliveryScreen() {
  const online = useOnlineStatus();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramMesaId = searchParams.get('mesaId');
  const paramCanal = searchParams.get('canal');

  // Stores
  const {
    pedidos,
    loading: loadingPedidos,
    fetch: fetchPedidos,
    avanzarEstado,
    crear: crearPedido,
  } = usePedidosStore();
  const { mesas, fetch: fetchMesas } = useMesasStore();
  const {
    productos,
    categorias,
    loading: loadingInv,
    fetch: fetchInventario,
  } = useInventarioStore();

  // Estados locales para el Formulario de Creación
  const [tipo, setTipo] = useState<'SALON' | 'DELIVERY' | 'LLEVAR'>('DELIVERY');
  const [selectedMesaId, setSelectedMesaId] = useState<string>('');
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteTelefono, setClienteTelefono] = useState('');
  const [clienteDireccion, setClienteDireccion] = useState('');
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('TODAS');

  // Canasta del pedido temporal
  const [carrito, setCarrito] = useState<
    Record<string, { producto: ProductoVM; cantidad: number; notas: string }>
  >({});

  // UI Feedbacks
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const [successLocal, setSuccessLocal] = useState<string | null>(null);

  useEffect(() => {
    fetchPedidos();
    fetchMesas();
    fetchInventario();
  }, [fetchPedidos, fetchMesas, fetchInventario]);

  // Mesas físicas ordenadas secuencialmente
  const mesasFisicas = useMemo(() => {
    return [...mesas.filter((m) => m.numeroRaw < 90)].sort(
      (a, b) => a.numeroRaw - b.numeroRaw,
    );
  }, [mesas]);

  // Sincronizar parámetros de mesa si vienen de MesasScreen
  useEffect(() => {
    if (paramCanal === 'SALON' || paramMesaId) {
      setTipo('SALON');
    }
    if (paramMesaId) {
      setSelectedMesaId(paramMesaId);
    } else if (tipo === 'SALON' && !selectedMesaId && mesasFisicas.length > 0) {
      setSelectedMesaId(mesasFisicas[0].id);
    }
  }, [paramMesaId, paramCanal, tipo, mesasFisicas, selectedMesaId]);

  // Encontrar las mesas virtuales 99 (Delivery) y 98 (Para Llevar)
  const mesaDelivery = mesas.find((m) => m.numeroRaw === 99);
  const mesaLlevar = mesas.find((m) => m.numeroRaw === 98);

  // Filtrar pedidos que pertenecen a Delivery o Llevar
  const pedidosDeliveryLlevar = pedidos.filter(
    (p) => p.mesaNumero === '99' || p.mesaNumero === '98',
  );

  // Filtrar productos por búsqueda y categoría
  const productosFiltrados = productos.filter((p) => {
    const matchesSearch = p.nombre
      .toLowerCase()
      .includes(busquedaProducto.toLowerCase());
    const matchesCategory =
      categoriaSeleccionada === 'TODAS' ||
      p.categoriaNombre === categoriaSeleccionada;
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
    0,
  );

  const handleAvanzarEstado = async (id: string, next: any) => {
    if (!online) return;
    setActionLoading(id);
    try {
      await avanzarEstado(id, next);
    } catch {
      // Handled by store
    } finally {
      setActionLoading(null);
    }
  };

  // Crear Pedido (Salón, Delivery o Para Llevar)
  const handleCrearPedido = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorLocal(null);
    setSuccessLocal(null);

    let targetMesa;
    if (tipo === 'SALON') {
      targetMesa = mesasFisicas.find((m) => m.id === selectedMesaId);
    } else if (tipo === 'DELIVERY') {
      targetMesa = mesaDelivery;
    } else {
      targetMesa = mesaLlevar;
    }

    if (!targetMesa) {
      setErrorLocal(
        tipo === 'SALON'
          ? 'Selecciona una mesa de salón válida.'
          : 'Mesa virtual para pedido no encontrada. Por favor, recarga.',
      );
      return;
    }

    const itemsCanasta = Object.values(carrito);
    if (itemsCanasta.length === 0) {
      setErrorLocal('Selecciona al menos un producto para el pedido.');
      return;
    }

    if (
      tipo !== 'SALON' &&
      (!clienteNombre.trim() || !clienteTelefono.trim())
    ) {
      setErrorLocal('El nombre y teléfono del cliente son requeridos.');
      return;
    }

    if (tipo === 'DELIVERY' && !clienteDireccion.trim()) {
      setErrorLocal('La dirección de entrega es obligatoria para Delivery.');
      return;
    }

    setSaving(true);
    try {
      let itemsPayload: CrearPedidoItemPayload[];

      if (tipo === 'SALON') {
        itemsPayload = itemsCanasta.map((it) => ({
          productoId: it.producto.id,
          cantidad: it.cantidad,
          area: it.producto.categoriaNombre === 'Bebidas' ? 'BAR' : 'COCINA',
          notas: it.notas || '',
        }));
      } else {
        // Serializar datos del cliente en las notas de los ítems para que la cocina y caja las visualicen directamente
        const headerStr =
          tipo === 'DELIVERY'
            ? `[DELIVERY] Cliente: ${clienteNombre.trim()} | Tel: ${clienteTelefono.trim()} | Dir: ${clienteDireccion.trim()}`
            : `[LLEVAR] Cliente: ${clienteNombre.trim()} | Tel: ${clienteTelefono.trim()}`;

        itemsPayload = itemsCanasta.map((it, idx) => ({
          productoId: it.producto.id,
          cantidad: it.cantidad,
          area: it.producto.categoriaNombre === 'Bebidas' ? 'BAR' : 'COCINA',
          // Inyectar cabecera de cliente en el primer item, y notas particulares en los demás
          notas:
            idx === 0
              ? `${headerStr}${it.notas ? ` | Nota: ${it.notas}` : ''}`
              : it.notas || '',
        }));
      }

      await crearPedido({
        mesaId: targetMesa.id,
        items: itemsPayload,
      });

      // Si es Salón, marcar optimísticamente la mesa como ocupada en el store local para feedback inmediato
      if (tipo === 'SALON') {
        const { optimisticCambiarEstado } = useMesasStore.getState();
        if (targetMesa.estado !== 'OCUPADA') {
          await optimisticCambiarEstado(targetMesa.id, 'OCUPADA');
        }
      }

      setSuccessLocal(`Pedido de ${tipo.toLowerCase()} creado con éxito.`);
      setCarrito({});
      setClienteNombre('');
      setClienteTelefono('');
      setClienteDireccion('');

      if (tipo === 'SALON') {
        // Redirigir al salón después de crear pedido en mesa física para ver el grid de mesas
        setTimeout(() => {
          navigate('/app/mesas');
        }, 1000);
      }
    } catch (err) {
      setErrorLocal(
        err instanceof Error ? err.message : 'Error al crear el pedido.',
      );
    } finally {
      setSaving(false);
    }
  };

  const getSiguienteEstado = (
    estado: string,
  ): { key: string; label: string } | null => {
    if (estado === 'PENDIENTE')
      return { key: 'EN_PREPARACION', label: 'Preparar' };
    if (estado === 'EN_PREPARACION')
      return { key: 'LISTO', label: 'Marcar Listo' };
    if (estado === 'LISTO') return { key: 'ENTREGADO', label: 'Entregar' };
    return null;
  };

  const loading = (loadingPedidos || loadingInv) && pedidos.length === 0;

  if (loading) {
    return (
      <div>
        <div className="page-h">
          <div>
            <h1>Pedidos</h1>
            <div className="sub">Cargando catálogo y pedidos…</div>
          </div>
        </div>
        <div className="module-grid">
          <div className="panel" style={{ flex: 1, height: 400 }} />
          <div className="panel" style={{ width: 400, height: 400 }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="page-h">
        <div>
          <h1>Pedidos y Despacho</h1>
          <div className="sub">
            {pedidosDeliveryLlevar.length} despachos activos en panel
          </div>
        </div>
        <span className="spacer" />
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => fetchPedidos()}
          title="Refrescar"
        >
          Refrescar
        </button>
      </div>

      {(errorLocal || successLocal) && (
        <div
          className={`banner ${errorLocal ? 'err' : 'ok'}`}
          style={{ marginBottom: 16 }}
        >
          <span>{errorLocal ?? successLocal}</span>
          <span className="spacer" />
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => {
              setErrorLocal(null);
              setSuccessLocal(null);
            }}
          >
            Cerrar
          </button>
        </div>
      )}

      <div
        className="module-grid"
        style={{ flex: 1, display: 'flex', gap: 18, alignItems: 'stretch' }}
      >
        {/* PANEL IZQUIERDO: LISTA DE DESPACHOS ACTIVOS (DELIVERY/LLEVAR) */}
        <section
          className="panel"
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          <div className="panel-h">
            <h3>Despachos Activos</h3>
            <span className="badge badge-accent">
              {pedidosDeliveryLlevar.length} pedidos
            </span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            {pedidosDeliveryLlevar.length === 0 ? (
              <div className="empty">
                <h3>Sin despachos activos</h3>
                <p>
                  Usa el formulario de la derecha para registrar un pedido
                  rápido de salón, delivery o para llevar.
                </p>
              </div>
            ) : (
              <div className="table-wrap table-wrap-flat">
                <table className="dt">
                  <thead>
                    <tr>
                      <th>Cliente / Dirección</th>
                      <th>Tipo</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th style={{ textAlign: 'right' }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidosDeliveryLlevar.map((p) => {
                      const next = getSiguienteEstado(p.estado);
                      // Extraer cabecera del cliente desde las notas del primer ítem
                      const primerItemNotas = p.items[0]?.notas || '';
                      const esDelivery = p.mesaNumero === '99';

                      return (
                        <tr key={p.id}>
                          <td style={{ maxWidth: 300 }}>
                            <strong style={{ fontSize: 13.5 }}>
                              {primerItemNotas.includes('Cliente:')
                                ? primerItemNotas
                                    .split('|')[0]
                                    .replace(
                                      /\[DELIVERY\]|\[LLEVAR\]|Cliente:/g,
                                      '',
                                    )
                                    .trim()
                                : `Cliente Mesa ${p.mesaNumero}`}
                            </strong>
                            <div
                              className="note"
                              style={{ whiteSpace: 'normal', marginTop: 4 }}
                            >
                              {primerItemNotas.includes('Dir:')
                                ? primerItemNotas
                                    .split('|')
                                    .find((s) => s.includes('Dir:'))
                                    ?.replace('Dir:', '')
                                    .trim()
                                : esDelivery
                                  ? 'Dirección no especificada'
                                  : 'Retiro en local'}
                            </div>
                            {p.items[0]?.notas &&
                              !p.items[0].notas.includes('Cliente:') && (
                                <div className="note">
                                  <svg
                                    className="ic"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 16v-4M12 8h.01" />
                                  </svg>{' '}
                                  {p.items[0].notas}
                                </div>
                              )}
                          </td>
                          <td>
                            <span
                              className={`badge ${esDelivery ? 'badge-info' : 'badge-warn'}`}
                            >
                              {esDelivery ? 'DELIVERY' : 'LLEVAR'}
                            </span>
                          </td>
                          <td>
                            <strong className="mono">
                              S/ {Number(p.total).toFixed(2)}
                            </strong>
                          </td>
                          <td>
                            <span className={`badge dot ${p.estadoClass}`}>
                              {p.estadoLabel}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {next ? (
                              <button
                                className="btn btn-sm btn-primary"
                                disabled={actionLoading === p.id || !online}
                                onClick={() =>
                                  handleAvanzarEstado(p.id, next.key)
                                }
                              >
                                {actionLoading === p.id
                                  ? 'Cargando…'
                                  : next.label}
                              </button>
                            ) : (
                              <span className="muted" style={{ fontSize: 12 }}>
                                Listo para cerrar
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* PANEL DERECHO: FORMULARIO DE REGISTRO */}
        <aside
          className="module-side"
          style={{ width: 440, display: 'flex', flexDirection: 'column' }}
        >
          <section
            className="panel"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div className="panel-h">
              <h3>Registrar Pedido</h3>
            </div>

            <form
              onSubmit={handleCrearPedido}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                padding: 16,
              }}
            >
              {/* Selector Tipo */}
              <div
                className="seg"
                style={{ marginBottom: 12, alignSelf: 'stretch' }}
              >
                <button
                  type="button"
                  className={tipo === 'SALON' ? 'on' : ''}
                  onClick={() => setTipo('SALON')}
                  style={{ flex: 1 }}
                >
                  Salón
                </button>
                <button
                  type="button"
                  className={tipo === 'DELIVERY' ? 'on' : ''}
                  onClick={() => setTipo('DELIVERY')}
                  style={{ flex: 1 }}
                >
                  Delivery
                </button>
                <button
                  type="button"
                  className={tipo === 'LLEVAR' ? 'on' : ''}
                  onClick={() => setTipo('LLEVAR')}
                  style={{ flex: 1 }}
                >
                  Para Llevar
                </button>
              </div>

              {/* Campos condicionales según tipo */}
              <div style={{ display: 'grid', gap: 10, marginBottom: 12 }}>
                {tipo === 'SALON' ? (
                  <div className="field">
                    <label>Mesa de Salón</label>
                    <div className="input">
                      <select
                        required
                        value={selectedMesaId}
                        onChange={(e) => setSelectedMesaId(e.target.value)}
                        style={{
                          width: '100%',
                          height: 38,
                          padding: '0 10px',
                          fontSize: 13.5,
                          background: 'var(--surface-3)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--r)',
                        }}
                      >
                        <option value="">-- Seleccionar Mesa --</option>
                        {mesasFisicas.map((m) => (
                          <option key={m.id} value={m.id}>
                            Mesa {m.numero} ({m.zona}) - {m.estadoLabel}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="field">
                      <label>Nombre del Cliente</label>
                      <div className="input">
                        <input
                          required
                          value={clienteNombre}
                          onChange={(e) => setClienteNombre(e.target.value)}
                          placeholder="Ej. Juan Pérez"
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label>Teléfono</label>
                      <div className="input">
                        <input
                          required
                          type="tel"
                          value={clienteTelefono}
                          onChange={(e) => setClienteTelefono(e.target.value)}
                          placeholder="Ej. 987654321"
                        />
                      </div>
                    </div>
                    {tipo === 'DELIVERY' && (
                      <div className="field">
                        <label>Dirección de Entrega</label>
                        <div className="input">
                          <input
                            required
                            value={clienteDireccion}
                            onChange={(e) =>
                              setClienteDireccion(e.target.value)
                            }
                            placeholder="Ej. Av. Larco 123, Dpto 402"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Catálogo de Productos */}
              <div
                className="field"
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <label>Seleccionar Ítems</label>

                {/* Filtro y Búsqueda */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <div className="input" style={{ flex: 1 }}>
                    <input
                      value={busquedaProducto}
                      onChange={(e) => setBusquedaProducto(e.target.value)}
                      placeholder="Buscar producto…"
                      style={{ height: 32 }}
                    />
                  </div>
                  <div className="input" style={{ width: 120 }}>
                    <select
                      value={categoriaSeleccionada}
                      onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                      style={{ height: 32, padding: '0 8px' }}
                    >
                      <option value="TODAS">Todos</option>
                      {categorias.map((c) => (
                        <option key={c.id} value={c.nombre}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Lista de productos para agregar */}
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r)',
                    padding: 8,
                    display: 'grid',
                    gap: 6,
                    maxHeight: 150,
                  }}
                >
                  {productosFiltrados.length === 0 ? (
                    <div
                      className="muted"
                      style={{ textAlign: 'center', padding: 8 }}
                    >
                      No hay productos
                    </div>
                  ) : (
                    productosFiltrados.map((prod) => {
                      const cant = carrito[prod.id]?.cantidad || 0;
                      return (
                        <div
                          key={prod.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '6px 8px',
                            background: 'var(--surface-2)',
                            borderRadius: 'var(--r-sm)',
                          }}
                        >
                          <div>
                            <strong>{prod.nombre}</strong>
                            <div className="muted" style={{ fontSize: 11 }}>
                              S/ {Number(prod.precio).toFixed(2)}
                            </div>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                          >
                            {cant > 0 && (
                              <>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-ghost"
                                  onClick={() => quitarDelCarrito(prod.id)}
                                  style={{ width: 24, height: 24, padding: 0 }}
                                >
                                  -
                                </button>
                                <span
                                  className="mono"
                                  style={{ fontWeight: 'bold' }}
                                >
                                  {cant}
                                </span>
                              </>
                            )}
                            <button
                              type="button"
                              className="btn btn-sm btn-soft"
                              onClick={() => agregarAlCarrito(prod)}
                              style={{
                                height: 24,
                                padding: '0 8px',
                                fontSize: 12,
                              }}
                            >
                              + Agregar
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Canasta / Resumen */}
              <div
                style={{
                  marginTop: 12,
                  borderTop: '1px solid var(--border)',
                  paddingTop: 10,
                }}
              >
                <h4 style={{ margin: '0 0 8px 0' }}>Canasta</h4>
                <div
                  style={{
                    display: 'grid',
                    gap: 6,
                    maxHeight: 120,
                    overflowY: 'auto',
                    marginBottom: 10,
                  }}
                >
                  {Object.values(carrito).length === 0 ? (
                    <div className="muted" style={{ fontSize: 12 }}>
                      El carrito está vacío.
                    </div>
                  ) : (
                    Object.values(carrito).map((item) => (
                      <div
                        key={item.producto.id}
                        style={{
                          fontSize: 12.5,
                          display: 'grid',
                          gap: 4,
                          background: 'var(--surface-3)',
                          padding: 8,
                          borderRadius: 'var(--r-sm)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>
                            <strong>{item.cantidad}x</strong>{' '}
                            {item.producto.nombre}
                          </span>
                          <strong className="mono">
                            S/{' '}
                            {(
                              Number(item.producto.precio) * item.cantidad
                            ).toFixed(2)}
                          </strong>
                        </div>
                        <input
                          placeholder="Notas (ej. sin salsas, término medio)"
                          value={item.notas}
                          onChange={(e) =>
                            actualizarNotasItem(
                              item.producto.id,
                              e.target.value,
                            )
                          }
                          style={{
                            height: 24,
                            fontSize: 11,
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: 4,
                            padding: '0 6px',
                          }}
                        />
                      </div>
                    ))
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}
                >
                  <strong>Total:</strong>
                  <strong
                    className="mono"
                    style={{ fontSize: 18, color: 'var(--accent)' }}
                  >
                    S/ {Number(totalCarrito).toFixed(2)}
                  </strong>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={
                    saving || !online || Object.values(carrito).length === 0
                  }
                  style={{ height: 38 }}
                >
                  {saving
                    ? 'Procesando…'
                    : `Crear Pedido (${tipo === 'SALON' ? 'Salón' : tipo})`}
                </button>
              </div>
            </form>
          </section>
        </aside>
      </div>
    </div>
  );
}
