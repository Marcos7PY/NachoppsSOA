import { IsNumber, IsString, IsOptional, IsNotEmpty, IsInt, Min, Max, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export const MetodoPago = {
  Efectivo: 'EFECTIVO',
  Tarjeta: 'TARJETA',
  Transferencia: 'TRANSFERENCIA',
  Yape: 'YAPE',
  Plin: 'PLIN',
} as const;

export type MetodoPago = (typeof MetodoPago)[keyof typeof MetodoPago];

export class TransaccionDto {
  @IsString()
  id: string;

  @IsString()
  cuentaId: string;

  @IsNumber()
  monto: number;

  @IsNumber()
  descuento: number;

  @IsString()
  metodo: string;

  @IsOptional()
  @IsString()
  referencia?: string;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsString()
  createdAt: string;
}

export class PagarPedidoCommand {
  @IsString()
  @IsNotEmpty()
  cuentaId: string;

  @IsNumber()
  montoRecibido: number;

  @IsString()
  @IsNotEmpty()
  metodo: string;
}

export class PagoRegistradoPayload {
  @IsString()
  transaccionId: string;
  @IsString()
  cuentaId: string;
  @IsString()
  mesaId: string;
  @IsNumber()
  monto: number;
  @IsString()
  metodo: string;
}

export class ArqueoRealizadoPayload {
  @IsString()
  turnoId: string;
  @IsNumber()
  diferencia: number;
}

/* ── Queries ─────────────────────────────────────────── */

export class ListarTransaccionesQuery {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsString()
  metodo?: string;

  @IsOptional()
  @IsDateString()
  updatedSince?: string;
}

/* ── Responses ───────────────────────────────────────── */

export class TransaccionListResponse {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransaccionDto)
  data: TransaccionDto[];

  @IsOptional()
  @IsString()
  nextCursor: string | null;
}
