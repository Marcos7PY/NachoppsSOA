// screens/inventario/InventarioScreen.tsx - Productos, categorías y reposición

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useInventarioStore } from '../../store/inventario.store';
import type { CrearProductoPayload } from '../../types/inventario.types';

const INITIAL_PRODUCT: CrearProductoPayload = {
  categoriaId: '',
  nombre: '',
  descripcion: '',
  precio: 0,
  disponible: true,
  stockActual: 0,
};

export function InventarioScreen() {
  const online = useOnlineStatus();
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
    reponerStock,
    clearFeedback,
  } = useInventarioStore();
  const [categoriaId, setCategoriaId] = useState('');
  const [productoForm, setProductoForm] = useState<CrearProductoPayload>(INITIAL_PRODUCT);
  const [stockInputs, setStockInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(categoriaId || undefined);
  }, [categoriaId, fetch]);

  const productosPorCategoria = useMemo(() => {
    return categorias.map((categoria) => ({
      categoria,
      productos: productos.filter((producto) => producto.categoriaId === categoria.id),
    }));
  }, [categorias, productos]);

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

  return (
    <div>
      <div className="page-h">
        <div>
          <h1>Inventario</h1>
          <div className="sub">Productos, disponibilidad y reposición de stock</div>
        </div>
        <span className="spacer" />
        <div className="input date-filter">
          <select value={categoriaId} onChange={(event) => setCategoriaId(event.target.value)}>
            <option value="">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => fetch(categoriaId || undefined)} title="Refrescar">
          <RefreshIcon />
        </button>
      </div>

      {(error || success) && (
        <div className={`banner ${error ? 'err' : 'ok'} module-feedback`}>
          {error ? <AlertIcon /> : <CheckIcon />}
          <span>{error ?? success}</span>
          <span className="spacer" />
          <button className="btn btn-sm btn-ghost" onClick={clearFeedback}>Cerrar</button>
        </div>
      )}

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
              <div className="e-ic"><BoxIcon /></div>
              <h3>Inventario vacío</h3>
              <p>Cuando el backend devuelva productos reales, se listarán por categoría.</p>
            </div>
          ) : (
            <div className="inventory-list">
              {(categoriaId
                ? [{ categoria: categorias.find((item) => item.id === categoriaId), productos }]
                : productosPorCategoria
              ).map((group) => (
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
                          <th>Precio</th>
                          <th>Stock</th>
                          <th>Estado</th>
                          <th>Reponer</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.productos.map((producto) => (
                          <tr key={producto.id}>
                            <td>
                              <strong>{producto.nombre}</strong>
                              {producto.descripcion && <div className="muted">{producto.descripcion}</div>}
                            </td>
                            <td><strong>{producto.precioLabel}</strong></td>
                            <td><span className={`badge ${producto.stockClass}`}>{producto.stockLabel}</span></td>
                            <td>
                              <span className={`badge dot ${producto.disponible ? 'badge-ok' : 'badge-danger'}`}>
                                {producto.disponible ? 'Disponible' : 'No disponible'}
                              </span>
                            </td>
                            <td>
                              <div className="stock-action">
                                <div className="input">
                                  <input
                                    min="1"
                                    type="number"
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
                                  className="btn btn-sm btn-ghost"
                                  disabled={saving || !online}
                                  onClick={() => handleReponer(producto.id)}
                                >
                                  Reponer
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
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
            <div className="panel-h"><h3>Nuevo producto</h3></div>
            <form className="form-stack" onSubmit={handleCrear}>
              <div className="field">
                <label>Categoría</label>
                <div className="input">
                  <select
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
                <label>Nombre</label>
                <div className="input">
                  <input
                    required
                    value={productoForm.nombre}
                    onChange={(event) => updateProductoForm('nombre', event.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <label>Descripción</label>
                <div className="input">
                  <textarea
                    rows={3}
                    value={productoForm.descripcion}
                    onChange={(event) => updateProductoForm('descripcion', event.target.value)}
                  />
                </div>
              </div>
              <div className="form-grid-2">
                <div className="field">
                  <label>Precio</label>
                  <div className="input">
                    <input
                      min="0"
                      step="0.01"
                      type="number"
                      value={productoForm.precio}
                      onChange={(event) => updateProductoForm('precio', Number(event.target.value))}
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Stock inicial</label>
                  <div className="input">
                    <input
                      min="0"
                      type="number"
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
                {saving ? <span className="spinner" /> : <BoxIcon />}
                Crear producto
              </button>
            </form>
          </section>
        </aside>
      </div>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="table-wrap table-wrap-flat">
      {[1, 2, 3, 4].map((row) => (
        <div key={row} className="skeleton-row">
          <div className="skel" />
        </div>
      ))}
    </div>
  );
}

function AlertIcon() {
  return <svg className="ic" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>;
}

function BoxIcon() {
  return <svg className="ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>;
}

function CheckIcon() {
  return <svg className="ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>;
}

function RefreshIcon() {
  return <svg className="ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>;
}
