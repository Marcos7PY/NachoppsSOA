import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

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
