// mappers/pedido.mapper.ts — PedidoDto → PedidoVM

import type { PedidoDto, PedidoVM, PedidoItemDto, PedidoItemVM, EstadoPedido } from '../types/pedido.types';

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

function calcularTiempo(createdAt: string): string {
  const diff = Date.now() - new Date(createdAt).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Ahora';
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m`;
}

function mapItem(dto: PedidoItemDto, pedidoId: string): PedidoItemVM {
  if (!dto.id) {
    throw new Error(
      `Pedido ${pedidoId} contiene un item sin id real del backend`,
    );
  }

  const estado = dto.estado ?? 'PENDIENTE';
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
    estado: estado as EstadoPedido,
    estadoClass: ESTADO_CSS[estado as EstadoPedido] ?? 'badge-muted',
    estadoLabel: ESTADO_LABEL[estado as EstadoPedido] ?? estado,
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
    tiempoTranscurrido: calcularTiempo(dto.createdAt),
    cantidadItems: items.reduce((sum, it) => sum + it.cantidad, 0),
  };
}

export function mapPedidos(dtos: PedidoDto[]): PedidoVM[] {
  return dtos.map(mapPedido);
}
