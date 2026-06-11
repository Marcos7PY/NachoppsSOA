import type { FormEvent } from 'react';
import { Icons } from '../ui/icons';
import type { CrearProductoPayload } from '../../types/inventario.types';

interface CategoriaItem {
  id: string;
  nombre: string;
}

interface NuevoProductoFormProps {
  categorias: CategoriaItem[];
  form: CrearProductoPayload;
  onChange: (key: keyof CrearProductoPayload, value: string | number | boolean) => void;
  onSubmit: (e: FormEvent) => void;
  saving: boolean;
  online: boolean;
}

export function NuevoProductoForm({ categorias, form, onChange, onSubmit, saving, online }: NuevoProductoFormProps) {
  return (
    <aside className="module-side">
      <section className="panel">
        <div className="panel-h">
          <Icons.Plus s={16} />
          <h3>Nuevo producto</h3>
        </div>
        <form className="form-stack" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="np-cat">Categoría</label>
            <div className="input">
              <select
                id="np-cat"
                value={form.categoriaId}
                onChange={(e) => onChange('categoriaId', e.target.value)}
                required
              >
                <option value="">Selecciona</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
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
                value={form.nombre}
                onChange={(e) => onChange('nombre', e.target.value)}
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
                value={form.descripcion}
                onChange={(e) => onChange('descripcion', e.target.value)}
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
                  value={form.precio}
                  onChange={(e) => onChange('precio', Number(e.target.value))}
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
                  value={form.stockActual}
                  onChange={(e) => onChange('stockActual', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          <label className="check-row">
            <input
              checked={form.disponible}
              type="checkbox"
              onChange={(e) => onChange('disponible', e.target.checked)}
            />
            Disponible para pedidos
          </label>
          <button
            className="btn btn-primary btn-block"
            disabled={saving || categorias.length === 0 || !online}
            type="submit"
          >
            {saving ? <span className="spinner" /> : <Icons.Plus s={16} />}
            Crear producto
          </button>
        </form>
      </section>
    </aside>
  );
}
