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
  pedidos: any[]; // Se poblará con detalles de pedidos
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
  items: any[];
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
