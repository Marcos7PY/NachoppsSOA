import { IsString, IsNumber, IsOptional, IsArray, IsEnum } from 'class-validator';

export const CuentaEstado = {
  Abierta: 'ABIERTA',
  Cerrada: 'CERRADA',
  Pagada: 'PAGADA',
} as const;

export type CuentaEstado = (typeof CuentaEstado)[keyof typeof CuentaEstado];

export class CuentaAbiertaPayload {
  @IsString()
  cuentaId: string;
  @IsString()
  mesaId: string;
}

export class CuentaCerradaPayload {
  @IsString()
  cuentaId: string;
  @IsString()
  mesaId: string;
  @IsNumber()
  total: number;
  @IsOptional()
  @IsArray()
  items?: { productoId: string; nombre?: string; cantidad: number; precioUnitario: number }[];
  // Reportes por mesero (plan 6.3). Opcional: lo poblará cuentas cuando propague
  // el mesero del pedido; el read-model de reportes ya agrupa por este campo.
  @IsOptional()
  @IsString()
  meseroId?: string;
  @IsOptional()
  @IsString()
  meseroNombre?: string;
}

export class TicketGeneradoPayload {
  @IsString()
  ticketId: string;
  @IsString()
  cuentaId: string;
}

export class CuentaDto {
  @IsString()
  id: string;
  @IsString()
  mesaId: string;
  @IsArray()
  pedidos: unknown[];
  @IsNumber()
  total: number;
  @IsEnum(CuentaEstado)
  estado: CuentaEstado;
  @IsOptional()
  @IsString()
  ticket?: string | null;
  @IsString()
  createdAt: string;
  @IsString()
  updatedAt: string;
}

export class TicketDto {
  @IsString()
  id: string;
  @IsString()
  cuentaId: string;
  @IsString()
  mesaId: string;
  @IsArray()
  items: unknown[];
  @IsNumber()
  subtotal: number;
  @IsNumber()
  descuento: number;
  @IsNumber()
  total: number;
  @IsString()
  fecha: string;
}

export class AbrirCuentaCommand {
  @IsString()
  mesaId: string;
}

export class CerrarCuentaCommand {
  @IsOptional()
  @IsNumber()
  descuento?: number;
}

export class DividirCuentaCommand {
  @IsString()
  metodo: 'IGUALES' | 'POR_ITEMS';
  @IsOptional()
  @IsNumber()
  numPartes?: number;
}
