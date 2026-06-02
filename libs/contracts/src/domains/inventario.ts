import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StockBajoPayload {
  @IsString()
  productoId: string;
  @IsString()
  nombre: string;
  @IsNumber()
  stockActual: number;
  @IsNumber()
  stockMinimo: number;
}

export class StockDescontadoPayload {
  @IsString()
  productoId: string;
  @IsNumber()
  cantidad: number;
  @IsString()
  motivo: string;
}

export class CategoriaDto {
  @IsString()
  id: string;
  @IsString()
  nombre: string;
  @IsOptional()
  @IsString()
  descripcion?: string | null;
}

export class CrearCategoriaCommand {
  @IsString()
  nombre: string;
  @IsOptional()
  @IsString()
  descripcion?: string;
}

export class ProductoDto {
  @IsString()
  id: string;
  @IsString()
  categoriaId: string;
  @IsOptional()
  @ValidateNested()
  @Type(() => CategoriaDto)
  categoria?: CategoriaDto | null;
  @IsString()
  nombre: string;
  @IsOptional()
  @IsString()
  descripcion?: string | null;
  @IsNumber()
  precio: number;
  @IsBoolean()
  disponible: boolean;
  @IsOptional()
  @IsNumber()
  stockActual?: number | null;
}

export class ListarProductosQuery {
  @IsOptional()
  @IsString()
  categoriaId?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  disponible?: boolean;

  @IsOptional()
  @IsString()
  search?: string;

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
  @IsDateString()
  updatedSince?: string;
}

export class ProductoListResponse {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductoDto)
  data: ProductoDto[];

  @IsOptional()
  @IsString()
  nextCursor: string | null;
}

export class CrearProductoCommand {
  @IsString()
  categoriaId: string;
  @IsString()
  nombre: string;
  @IsOptional()
  @IsString()
  descripcion?: string;
  @IsNumber()
  precio: number;
  @IsOptional()
  @IsBoolean()
  disponible?: boolean;
  @IsOptional()
  @IsNumber()
  stockActual?: number;
}

export class ObtenerProductosLoteCommand {
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('all', { each: true })
  ids: string[];
}

export class ProductoCreadoPayload {
  @IsOptional()
  @IsString()
  eventId?: string;
  @IsString()
  id: string;
  @IsString()
  nombre: string;
  @IsNumber()
  precio: number;
  @IsOptional()
  @IsNumber()
  stockActual?: number | null;
  @IsOptional()
  @IsString()
  categoriaNombre?: string;
  @IsBoolean()
  disponible: boolean;
}

export class ProductoActualizadoPayload {
  @IsOptional()
  @IsString()
  eventId?: string;
  @IsString()
  id: string;
  @IsString()
  nombre: string;
  @IsNumber()
  precio: number;
  @IsOptional()
  @IsNumber()
  stockActual?: number | null;
  @IsOptional()
  @IsString()
  categoriaNombre?: string;
  @IsBoolean()
  disponible: boolean;
  @IsOptional()
  @IsString()
  stockSyncMode?: 'REPOSICION' | 'CONSUMO_PEDIDO';
  @IsOptional()
  @IsNumber()
  stockDelta?: number;
}
