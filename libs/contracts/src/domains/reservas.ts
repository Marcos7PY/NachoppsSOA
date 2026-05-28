import { IsString, IsNumber, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export const ReservaEstado = {
  Pendiente: 'PENDIENTE',
  Confirmada: 'CONFIRMADA',
  Cancelada: 'CANCELADA',
  Expirada: 'EXPIRADA',
} as const;

export type ReservaEstado = (typeof ReservaEstado)[keyof typeof ReservaEstado];

export class ReservaDto {
  @IsString()
  id: string;
  @IsString()
  clienteId: string;
  @IsString()
  clienteNombre: string;
  @IsString()
  clienteTelefono: string;
  @IsString()
  fecha: string;
  @IsString()
  hora: string;
  @IsOptional()
  @IsString()
  mesaPreferida?: string | null;
  @IsNumber()
  numComensales: number;
  @IsEnum(ReservaEstado)
  estado: ReservaEstado;
  @IsString()
  createdAt: string;
}

export class CrearReservaCommand {
  @IsOptional()
  @IsString()
  clienteId?: string;

  @IsOptional()
  @IsString()
  @Transform(({ obj, value }) => value ?? obj.nombreCliente)
  clienteNombre?: string;

  @IsOptional()
  @IsString()
  clienteTelefono?: string;

  @IsString()
  @IsNotEmpty()
  fecha: string;

  @IsString()
  @IsNotEmpty()
  hora: string;

  @IsOptional()
  @IsString()
  mesaPreferida?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ obj, value }) => value ?? obj.personas)
  numComensales?: number;
}

export class ReservaCreadaPayload {
  @IsNotEmpty()
  reserva: ReservaDto;
}

export class ReservaCanceladaPayload {
  @IsString()
  reservaId: string;
  @IsOptional()
  @IsString()
  motivo?: string;
}
