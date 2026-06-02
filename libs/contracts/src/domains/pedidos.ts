import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
  ArrayMinSize,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export const PedidoEstado = {
  Pendiente: 'PENDIENTE',
  EnPreparacion: 'EN_PREPARACION',
  Listo: 'LISTO',
  Entregado: 'ENTREGADO',
  Pagado: 'PAGADO',
  Cancelado: 'CANCELADO',
} as const;

export type PedidoEstado = (typeof PedidoEstado)[keyof typeof PedidoEstado];

export const ItemArea = {
  Cocina: 'COCINA',
  Bar: 'BAR',
} as const;

export type ItemArea = (typeof ItemArea)[keyof typeof ItemArea];

export class ModificadorItem {
  @IsString()
  @IsNotEmpty()
  nombre: string;
  @IsOptional()
  @IsNumber()
  precioExtra?: number;
}

export class PedidoItemDto {
  @IsString()
  id: string;
  @IsString()
  productoId: string;
  @IsString()
  nombre: string;
  @IsNumber()
  cantidad: number;
  @IsNumber()
  precioUnitario: number;
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModificadorItem)
  modificadores?: ModificadorItem[];
  @IsOptional()
  @IsEnum(ItemArea)
  area?: ItemArea;
  @IsOptional()
  @IsString()
  notas?: string;
  @IsOptional()
  @IsEnum(PedidoEstado)
  estado?: PedidoEstado;
}

export class PedidoDto {
  @IsString()
  id: string;
  @IsString()
  mesaId: string;
  @IsOptional()
  @IsNumber()
  numeroMesa?: number;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PedidoItemDto)
  items: PedidoItemDto[];
  @IsNumber()
  total: number;
  @IsEnum(PedidoEstado)
  estado: PedidoEstado;
  @IsOptional()
  @IsString()
  cliente?: string;
  @IsOptional()
  @IsString()
  telefono?: string;
  @IsOptional()
  @IsString()
  direccion?: string;
  @IsOptional()
  @IsString()
  proveedor?: string;
  @IsOptional()
  @IsString()
  modalidad?: string;
  @IsString()
  createdAt: string;
}

export class ListarPedidosQuery {
  @IsOptional()
  @IsString()
  mesaId?: string;
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
  @IsEnum(PedidoEstado)
  estado?: PedidoEstado;
  @IsOptional()
  @IsDateString()
  updatedSince?: string;
}

export class PedidoListResponse {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PedidoDto)
  data: PedidoDto[];
  @IsOptional()
  @IsString()
  nextCursor: string | null;
}

export class PedidoItemInput {
  @IsOptional()
  @IsString()
  id?: string;
  @IsString()
  @IsNotEmpty()
  productoId: string;
  @IsNumber()
  cantidad: number;
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModificadorItem)
  modificadores?: ModificadorItem[];
  @IsOptional()
  @IsEnum(ItemArea)
  area?: ItemArea;
  @IsOptional()
  @IsString()
  notas?: string;
  @IsOptional()
  @IsEnum(PedidoEstado)
  estado?: PedidoEstado;
  @IsOptional()
  @IsNumber()
  identificadorComensal?: number;
}

export class CrearPedidoCommand {
  @IsString()
  @IsNotEmpty()
  mesaId: string;
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PedidoItemInput)
  items: PedidoItemInput[];
  @IsOptional()
  @IsString()
  cliente?: string;
  @IsOptional()
  @IsString()
  telefono?: string;
  @IsOptional()
  @IsString()
  direccion?: string;
  @IsOptional()
  @IsString()
  proveedor?: string;
  @IsOptional()
  @IsString()
  modalidad?: string;
}

export class ActualizarEstadoPedidoCommand {
  @IsEnum(PedidoEstado)
  estado: PedidoEstado;
}

export class PedidoCreadoPayload {
  @Type(() => PedidoDto)
  @ValidateNested()
  pedido: PedidoDto;
}

export class PedidoListoPayload {
  @IsString()
  pedidoId: string;
  @IsString()
  mesaId: string;
}

export class PedidoActualizadoPayload {
  @Type(() => PedidoDto)
  @ValidateNested()
  pedido: PedidoDto;
}
