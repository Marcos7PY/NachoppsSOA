// mappers/pedido.mapper.ts — PedidoDto → PedidoVM

import type { PedidoDto, PedidoVM, PedidoItemDto, PedidoItemVM, EstadoPedido, EstadoItem } from '../types/pedido.types';
import { canalFromModalidad } from '../domain/pedido.flow';

const ESTADO_CSS: Record<EstadoPedido, string> = {
  PENDIENTE: 'badge-warn',
  EN_PREPARACION: 'badge-info',
  LISTO: 'badge-ok',
  ENTREGADO: 'badge-accent',
  PAGADO: 'badge-muted',
  CANCELADO: 'badge-danger',
};

const ESTADO_LABEL: Record<EstadoPedido, string> = {
  PENDIENTE: 'Pendiente',
  EN_PREPARACION: 'En preparación',
  LISTO: 'Listo',
  ENTREGADO: 'Entregado',
  PAGADO: 'Pagado',
  CANCELADO: 'Cancelado',
};

/** Clase CSS del badge para un estado de pedido/ítem. */
export function estadoClassOf(estado: EstadoPedido | EstadoItem): string {
  return ESTADO_CSS[estado as EstadoPedido] ?? 'badge-muted';
}

/** Etiqueta legible para un estado de pedido/ítem. */
export function estadoLabelOf(estado: EstadoPedido | EstadoItem): string {
  return ESTADO_LABEL[estado as EstadoPedido] ?? estado;
}

function mapItem(dto: PedidoItemDto, pedidoId: string): PedidoItemVM {
  if (!dto.id) {
    throw new Error(
      `Pedido ${pedidoId} contiene un item sin id real del backend`,
    );
  }

  const estado = (dto.estado ?? 'PENDIENTE') as EstadoItem;
  return {
    id: dto.id,
    productoId: dto.productoId,
    nombre: dto.nombre,
    cantidad: dto.cantidad,
    precioUnitario: dto.precioUnitario,
    subtotal: dto.cantidad * dto.precioUnitario,
    modificadores: dto.modificadores ?? [],
    area: dto.area ?? 'COCINA',
    notas: dto.notas ?? '',
    estado,
    estadoClass: estadoClassOf(estado),
    estadoLabel: estadoLabelOf(estado),
  };
}

export function mapPedido(dto: PedidoDto): PedidoVM {
  const items = Array.isArray(dto.items)
    ? dto.items.map((item) => mapItem(item, dto.id))
    : [];
  return {
    id: dto.id,
    mesaId: dto.mesaId,
    mesaNumero: dto.numeroMesa != null ? String(dto.numeroMesa).padStart(2, '0') : '??',
    items,
    total: dto.total,
    estado: dto.estado,
    estadoClass: ESTADO_CSS[dto.estado] ?? 'badge-muted',
    estadoLabel: ESTADO_LABEL[dto.estado] ?? dto.estado,
    createdAt: dto.createdAt,
    cliente: dto.cliente ?? undefined,
    telefono: dto.telefono ?? undefined,
    direccion: dto.direccion ?? undefined,
    proveedor: dto.proveedor ?? undefined,
    modalidad: dto.modalidad ?? undefined,
    canal: canalFromModalidad(dto.modalidad ?? undefined),
    cantidadItems: items.reduce((sum, it) => sum + it.cantidad, 0),
  };
}

export function mapPedidos(dtos: PedidoDto[]): PedidoVM[] {
  return dtos.map(mapPedido);
}
