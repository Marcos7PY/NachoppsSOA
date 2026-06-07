// screens/inventario/InventarioScreen.tsx — Productos, disponibilidad y reposición.
// Cableado real: useInventarioQuery (categorías + productos paginados + mutaciones).

import { useMemo, useState, type FormEvent } from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useInventarioQuery } from '../../hooks/queries/useInventarioQuery';
import { Icons } from '../../components/ui/icons';
import { StatKpi } from '../../components/ui/StatKpi';
import type { CrearProductoPayload, ProductoVM } from '../../types/inventario.types';

const INITIAL_PRODUCT: CrearProductoPayload = {
  categoriaId: '',
  nombre: '',
  descripcion: '',
  precio: 0,
  disponible: true,
  stockActual: 0,
};

const STOCK_BAJO = 5;

/** Clasificación de stock para resaltar filas y contar KPIs (null = sin control). */
function stockNivel(stock: number | null): 'ok' | 'low' | 'out' | 'none' {
  if (stock === null) return 'none';
  if (stock <= 0) return 'out';
  if (stock <= STOCK_BAJO) return 'low';
  return 'ok';
}

export function InventarioScreen() {
  const online = useOnlineStatus();
  const [categoriaId, setCategoriaId] = useState('');
  const [search, setSearch] = useState('');
  const {
    categorias,
    productos,
    nextCursor,
    loading,
    loadingMore,
    saving,
    error,
    success,
    fetch,
    fetchMore,
    crearProducto,
    actualizarProducto,
    reponerStock,
    clearFeedback,
  } = useInventarioQuery(categoriaId || undefined, { conStock: true, search: search.trim() || undefined });
  const [productoForm, setProductoForm] = useState<CrearProductoPayload>(INITIAL_PRODUCT);
  const [stockInputs, setStockInputs] = useState<Record<string, string>>({});

  const productosPorCategoria = useMemo(() => {
    return categorias.map((categoria) => ({
      categoria,
      productos: productos.filter((producto) => producto.categoriaId === categoria.id),
    }));
  }, [categorias, productos]);

  const kpis = useMemo(() => {
    let disponibles = 0;
    let bajo = 0;
    let agotados = 0;
    for (const p of productos) {
      if (p.disponible) disponibles += 1;
      const nivel = stockNivel(p.stockActual);
      if (nivel === 'low') bajo += 1;
      if (nivel === 'out') agotados += 1;
    }
    return { total: productos.length, disponibles, bajo, agotados };
  }, [productos]);

  const handleCrear = async (event: FormEvent) => {
    event.preventDefault();
    if (!online) return;
    const fallbackCategoria = categorias[0]?.id;
    await crearProducto({
      ...productoForm,
      categoriaId: productoForm.categoriaId || fallbackCategoria,
      nombre: productoForm.nombre.trim(),
      descripcion: productoForm.descripcion?.trim() || undefined,
      precio: Number(productoForm.precio) || 0,
      stockActual: Number(productoForm.stockActual) || 0,
    });
    setProductoForm(INITIAL_PRODUCT);
  };

  const updateProductoForm = (key: keyof CrearProductoPayload, value: string | number | boolean) => {
    setProductoForm((current) => ({ ...current, [key]: value }));
  };

  const handleReponer = async (productoId: string) => {
    const cantidad = Number(stockInputs[productoId]) || 0;
    if (cantidad <= 0 || !online) return;
    await reponerStock(productoId, cantidad);
    setStockInputs((current) => ({ ...current, [productoId]: '' }));
  };

  const handleReponerQuick = async (productoId: string, cantidad: number) => {
    if (!online) return;
    await reponerStock(productoId, cantidad);
  };

  const handleToggleDisponible = async (producto: ProductoVM) => {
    if (!online || saving) return;
    await actualizarProducto(producto.id, { disponible: !producto.disponible });
  };

  const grupos = categoriaId
    ? [{ categoria: categorias.find((item) => item.id === categoriaId), productos }]
    : productosPorCategoria;

  return (
    <div>
      <div className="page-h">
        <div>
          <h1>Inventario</h1>
          <div className="sub">Productos, disponibilidad y reposición de stock</div>
        </div>
        <span className="spacer" />
        <button className="btn btn-ghost btn-sm" onClick={() => fetch()} title="Refrescar" aria-label="Refrescar inventario">
          <Icons.Refresh s={16} />
        </button>
      </div>

      {!online && (
        <div className="banner warn module-feedback" role="status">
          <Icons.Alert s={17} />
          <span>Sin conexión. Las mutaciones están deshabilitadas.</span>
        </div>
      )}

      {(error || success) && (
        <div className={`banner ${error ? 'err' : 'ok'} module-feedback`} role="alert">
          {error ? <Icons.Alert s={17} /> : <Icons.Check s={16} />}
          <span>{error ?? success}</span>
          <span className="spacer" />
          <button className="btn btn-sm btn-ghost" onClick={clearFeedback}>Cerrar</button>
        </div>
      )}

      {/* KPIs */}
      <div className="grid-stats" style={{ marginBottom: 16 }}>
        <StatKpi icon="Inventario" tint="accent" label="En esta vista" value={kpis.total} />
        <StatKpi icon="Check" tint="ok" label="Disponibles" value={kpis.disponibles} />
        <StatKpi icon="Alert" tint="warn" label={`Stock bajo (≤${STOCK_BAJO})`} value={kpis.bajo} />
        <StatKpi icon="Alert" tint="danger" label="Agotados" value={kpis.agotados} />
      </div>

      {/* Toolbar */}
      <div className="module-toolbar">
        <div className="search-box">
          <Icons.Search s={16} />
          <input
            type="search"
            placeholder="Buscar producto…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Buscar productos"
          />
        </div>
        <span className="spacer" />
        <div className="input" style={{ width: 210 }}>
          <select value={categoriaId} onChange={(event) => setCategoriaId(event.target.value)} aria-label="Filtrar por categoría">
            <option value="">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="module-grid">
        <section className="panel">
          <div className="panel-h">
            <h3>Productos</h3>
            <span className="spacer" />
            <span className="badge badge-info">{productos.length} productos</span>
          </div>

          {loading ? (
            <LoadingRows />
          ) : productos.length === 0 ? (
            <div className="empty">
              <div className="e-ic"><Icons.Inventario s={24} /></div>
              <h3>Inventario vacío</h3>
              <p>No hay productos que coincidan con la búsqueda o la categoría seleccionada.</p>
              {(search || categoriaId) && (
                <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setCategoriaId(''); }}>
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="inventory-list">
              {grupos.map((group) => (
                <div key={group.categoria?.id ?? 'sin-categoria'} className="inventory-group">
                  <div className="inventory-group-h">
                    <strong>{group.categoria?.nombre ?? 'Sin categoría'}</strong>
                    <span className="muted">{group.productos.length} productos</span>
                  </div>
                  <div className="table-wrap table-wrap-flat">
                    <table className="dt">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th className="num">Precio</th>
                          <th>Stock</th>
                          <th>Disponible</th>
                          <th>Reponer</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.productos.map((producto) => {
                          const nivel = stockNivel(producto.stockActual);
                          const rowCls = nivel === 'out' ? 'row-out' : nivel === 'low' ? 'row-low' : '';
                          return (
                            <tr key={producto.id} className={rowCls}>
                              <td>
                                <strong>{producto.nombre}</strong>
                                {producto.descripcion && <div className="muted">{producto.descripcion}</div>}
                              </td>
                              <td className="num"><span className="monto">{producto.precioLabel}</span></td>
                              <td>
                                <div className="stock-cell">
                                  <span className={`badge ${producto.stockClass}`}>{producto.stockLabel}</span>
                                  {nivel === 'out' && <span className="sc-note out">Agotado</span>}
                                  {nivel === 'low' && <span className="sc-note low">Stock bajo</span>}
                                </div>
                              </td>
                              <td>
                                <div className="avail-cell">
                                  <button
                                    type="button"
                                    role="switch"
                                    aria-checked={producto.disponible}
                                    aria-label={`${producto.disponible ? 'Marcar no disponible' : 'Marcar disponible'}: ${producto.nombre}`}
                                    className={`toggle ${producto.disponible ? 'on' : ''}`}
                                    disabled={saving || !online}
                                    onClick={() => handleToggleDisponible(producto)}
                                  >
                                    <span className="knob" />
                                  </button>
                                  <span className={`av-lbl ${producto.disponible ? '' : 'off'}`}>
                                    {producto.disponible ? 'Sí' : 'No'}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div className="repo-cell">
                                  <div className="repo-quick">
                                    <button disabled={saving || !online} aria-label={`Reponer 5 de ${producto.nombre}`} onClick={() => handleReponerQuick(producto.id, 5)}>+5</button>
                                    <button disabled={saving || !online} aria-label={`Reponer 10 de ${producto.nombre}`} onClick={() => handleReponerQuick(producto.id, 10)}>+10</button>
                                  </div>
                                  <div className="input">
                                    <input
                                      min="1"
                                      type="number"
                                      inputMode="numeric"
                                      placeholder="Cant."
                                      aria-label={`Cantidad a reponer de ${producto.nombre}`}
                                      value={stockInputs[producto.id] ?? ''}
                                      onChange={(event) =>
                                        setStockInputs((current) => ({
                                          ...current,
                                          [producto.id]: event.target.value,
                                        }))
                                      }
                                    />
                                  </div>
                                  <button
                                    className="btn btn-sm btn-soft"
                                    disabled={saving || !online || !(Number(stockInputs[producto.id]) > 0)}
                                    onClick={() => handleReponer(producto.id)}
                                  >
                                    Reponer
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
              {nextCursor && (
                <div className="row center" style={{ padding: '12px' }}>
                  <button className="btn btn-ghost btn-sm" disabled={loadingMore} onClick={fetchMore}>
                    {loadingMore ? <span className="spinner" /> : null}
                    Cargar más
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        <aside className="module-side">
          <section className="panel">
            <div className="panel-h">
              <Icons.Plus s={16} />
              <h3>Nuevo producto</h3>
            </div>
            <form className="form-stack" onSubmit={handleCrear}>
              <div className="field">
                <label htmlFor="np-cat">Categoría</label>
                <div className="input">
                  <select
                    id="np-cat"
                    value={productoForm.categoriaId}
                    onChange={(event) => updateProductoForm('categoriaId', event.target.value)}
                    required
                  >
                    <option value="">Selecciona</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="np-nombre">Nombre</label>
                <div className="input">
                  <input
                    id="np-nombre"
                    required
                    value={productoForm.nombre}
                    onChange={(event) => updateProductoForm('nombre', event.target.value)}
                    placeholder="Nombre del producto"
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="np-desc">Descripción</label>
                <div className="input">
                  <textarea
                    id="np-desc"
                    rows={3}
                    value={productoForm.descripcion}
                    onChange={(event) => updateProductoForm('descripcion', event.target.value)}
                    placeholder="Opcional"
                  />
                </div>
              </div>
              <div className="form-grid-2">
                <div className="field">
                  <label htmlFor="np-precio">Precio</label>
                  <div className="input">
                    <input
                      id="np-precio"
                      min="0"
                      step="0.01"
                      type="number"
                      inputMode="decimal"
                      value={productoForm.precio}
                      onChange={(event) => updateProductoForm('precio', Number(event.target.value))}
                    />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="np-stock">Stock inicial</label>
                  <div className="input">
                    <input
                      id="np-stock"
                      min="0"
                      type="number"
                      inputMode="numeric"
                      value={productoForm.stockActual}
                      onChange={(event) => updateProductoForm('stockActual', Number(event.target.value))}
                    />
                  </div>
                </div>
              </div>
              <label className="check-row">
                <input
                  checked={productoForm.disponible}
                  type="checkbox"
                  onChange={(event) => updateProductoForm('disponible', event.target.checked)}
                />
                Disponible para pedidos
              </label>
              <button className="btn btn-primary btn-block" disabled={saving || categorias.length === 0 || !online} type="submit">
                {saving ? <span className="spinner" /> : <Icons.Plus s={16} />}
                Crear producto
              </button>
            </form>
          </section>
        </aside>
      </div>
    </div>
  );
}

// ─── Componentes auxiliares ─────────────────────────────────

function LoadingRows() {
  return (
    <div className="table-wrap table-wrap-flat">
      <table className="dt">
        <thead>
          <tr>
            <th>Producto</th>
            <th className="num">Precio</th>
            <th>Stock</th>
            <th>Disponible</th>
            <th>Reponer</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i}>
              <td><div className="skel" style={{ width: 120, height: 16 }} /></td>
              <td><div className="skel" style={{ width: 60, height: 16, marginLeft: 'auto' }} /></td>
              <td><div className="skel" style={{ width: 40, height: 16 }} /></td>
              <td><div className="skel" style={{ width: 48, height: 24 }} /></td>
              <td><div className="skel" style={{ width: 150, height: 30 }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
