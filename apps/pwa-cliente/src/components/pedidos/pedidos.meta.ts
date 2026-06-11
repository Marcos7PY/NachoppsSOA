import type { IconName } from '../ui/icons';
import type { PedidoVM, EstadoPedido } from '../../types/pedido.types';
import {
  type Canal,
  CANAL_LABEL,
  CANAL_CLS,
  nextEstadoComercial,
  nextLabelComercial,
  PERMITIR_OVERRIDE_PRODUCCION,
} from '../../domain/pedido.flow';

export const CANAL_ICON: Record<Canal, IconName> = {
  SALON: 'Mesas',
  DELIVERY: 'Delivery',
  LLEVAR: 'Bag',
};

export const CANAL_META: Record<Canal, { label: string; cls: string; ic: IconName }> = {
  SALON: { label: CANAL_LABEL.SALON, cls: CANAL_CLS.SALON, ic: CANAL_ICON.SALON },
  DELIVERY: { label: CANAL_LABEL.DELIVERY, cls: CANAL_CLS.DELIVERY, ic: CANAL_ICON.DELIVERY },
  LLEVAR: { label: CANAL_LABEL.LLEVAR, cls: CANAL_CLS.LLEVAR, ic: CANAL_ICON.LLEVAR },
};

export function nextEstadoFor(p: PedidoVM): EstadoPedido | null {
  if (PERMITIR_OVERRIDE_PRODUCCION) {
    if (p.estado === 'PENDIENTE') return 'EN_PREPARACION';
    if (p.estado === 'EN_PREPARACION') return 'LISTO';
  }
  return nextEstadoComercial(p.estado);
}

export function nextLabelFor(p: PedidoVM): string | null {
  if (PERMITIR_OVERRIDE_PRODUCCION) {
    if (p.estado === 'PENDIENTE') return 'Preparar';
    if (p.estado === 'EN_PREPARACION') return 'Marcar listo';
  }
  return nextLabelComercial(p.estado, p.canal);
}

export interface ViewProps {
  pedidos: PedidoVM[];
  onAvanzar: (p: PedidoVM) => void;
  onDetalle: (p: PedidoVM) => void;
  actionLoading: string | null;
  online: boolean;
  now: number;
}
