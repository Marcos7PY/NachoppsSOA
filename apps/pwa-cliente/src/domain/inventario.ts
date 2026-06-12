import type { CrearProductoPayload } from '../types/inventario.types';

export const STOCK_BAJO = 5;

export const INITIAL_PRODUCT: CrearProductoPayload = {
  categoriaId: '',
  nombre: '',
  descripcion: '',
  precio: 0,
  disponible: true,
  stockActual: 0,
};

export type StockNivel = 'ok' | 'low' | 'out' | 'none';

export function stockNivel(stock: number | null): StockNivel {
  if (stock === null) return 'none';
  if (stock <= 0) return 'out';
  if (stock <= STOCK_BAJO) return 'low';
  return 'ok';
}

export interface InventarioKpis {
  total: number;
  disponibles: number;
  bajo: number;
  agotados: number;
}

export function computeInventarioKpis(
  productos: { disponible: boolean; stockActual: number | null }[],
): InventarioKpis {
  let disponibles = 0, bajo = 0, agotados = 0;
  for (const p of productos) {
    if (p.disponible) disponibles++;
    const nivel = stockNivel(p.stockActual);
    if (nivel === 'low') bajo++;
    if (nivel === 'out') agotados++;
  }
  return { total: productos.length, disponibles, bajo, agotados };
}
