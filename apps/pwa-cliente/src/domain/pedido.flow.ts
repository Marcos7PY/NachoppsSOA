// domain/pedido.flow.ts — Lógica de flujo de pedidos compartida por PedidosScreen
// (gestión comercial, por pedido/canal) y CocinaScreen (KDS, por ítem/área).
// Única fuente de verdad en el frontend para transiciones, etiquetas y umbrales,
// de modo que ambas pantallas no diverjan.

import type { EstadoPedido, EstadoItem } from '../types/pedido.types';

// ─── Canal / modalidad ──────────────────────────────────────────
export type Canal = 'SALON' | 'DELIVERY' | 'LLEVAR';

export function canalFromModalidad(modalidad?: string): Canal {
  const m = (modalidad ?? 'SALON').toUpperCase();
  return m === 'DELIVERY' ? 'DELIVERY' : m === 'LLEVAR' ? 'LLEVAR' : 'SALON';
}

export const CANAL_LABEL: Record<Canal, string> = {
  SALON: 'Salón',
  DELIVERY: 'Delivery',
  LLEVAR: 'Llevar',
};

export const CANAL_CLS: Record<Canal, string> = {
  SALON: 'salon',
  DELIVERY: 'delivery',
  LLEVAR: 'llevar',
};

// ─── Etapas de producción (tablero de Pedidos + columnas del KDS) ─
export const ETAPAS_PRODUCCION: { estado: EstadoPedido; label: string; color: string }[] = [
  { estado: 'PENDIENTE', label: 'Nuevos', color: 'var(--warn)' },
  { estado: 'EN_PREPARACION', label: 'En preparación', color: 'var(--info)' },
  { estado: 'LISTO', label: 'Listos · pase', color: 'var(--ok)' },
];

/** Estados de producción visibles en los tableros activos. */
export const ESTADOS_PRODUCCION = new Set<EstadoPedido>([
  'PENDIENTE',
  'EN_PREPARACION',
  'LISTO',
]);

// ─── Timeline comercial completo (drawer de Pedidos) ─────────────
export const FLOW_PEDIDO: { estado: EstadoPedido; label: string }[] = [
  { estado: 'PENDIENTE', label: 'Recibido' },
  { estado: 'EN_PREPARACION', label: 'En cocina' },
  { estado: 'LISTO', label: 'Listo' },
  { estado: 'ENTREGADO', label: 'Entregado' },
];

// ─── Flujo de ítem (cocina manda) ───────────────────────────────
export const NEXT_ITEM: Partial<Record<EstadoItem, EstadoItem>> = {
  PENDIENTE: 'EN_PREPARACION',
  EN_PREPARACION: 'LISTO',
};
export const PREV_ITEM: Partial<Record<EstadoItem, EstadoItem>> = {
  LISTO: 'EN_PREPARACION',
  EN_PREPARACION: 'PENDIENTE',
};

// ─── Tramo comercial del pedido (lo que cocina NO maneja) ────────
// Con "cocina manda", el tramo de producción (PENDIENTE→EN_PREPARACION→LISTO)
// lo derivan los ítems en el backend. Pedidos solo avanza LISTO → ENTREGADO.
export function nextEstadoComercial(estado: EstadoPedido): EstadoPedido | null {
  return estado === 'LISTO' ? 'ENTREGADO' : null;
}

export function nextLabelComercial(estado: EstadoPedido, canal: Canal): string | null {
  if (estado !== 'LISTO') return null;
  return canal === 'SALON' ? 'Entregar' : 'Despachar';
}

/**
 * Override manual de producción desde la pantalla Pedidos. Desactivado por
 * defecto ("cocina manda"); puede activarse para roles admin/cajero o escenarios
 * borde (pedido solo-bebida, cocina caída).
 */
export const PERMITIR_OVERRIDE_PRODUCCION = false;

/**
 * Deriva el estado de producción de un pedido a partir de los estados de sus
 * ítems. Espejo de la lógica del backend ("cocina manda"), usado para las
 * actualizaciones optimistas en el cliente. Devuelve null si no hay ítems.
 */
export function derivarEstadoProduccion(estados: EstadoItem[]): EstadoPedido | null {
  if (estados.length === 0) return null;
  if (estados.every((e) => e === 'LISTO' || e === 'ENTREGADO')) return 'LISTO';
  if (estados.some((e) => e === 'EN_PREPARACION' || e === 'LISTO' || e === 'ENTREGADO'))
    return 'EN_PREPARACION';
  return 'PENDIENTE';
}

// ─── SLA (umbral único compartido) ──────────────────────────────
export const SLA_MIN = 15;
export const slaRatio = (elapsedMinutes: number) => elapsedMinutes / SLA_MIN;
export const urgClass = (ratio: number): 'fresh' | 'warn' | 'late' =>
  ratio >= 1 ? 'late' : ratio >= 0.7 ? 'warn' : 'fresh';
