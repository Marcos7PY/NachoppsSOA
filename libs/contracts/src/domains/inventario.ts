export interface StockBajoPayload {
  productoId: string;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
}

export interface StockDescontadoPayload {
  productoId: string;
  cantidad: number;
  motivo: string;
}

export interface CategoriaDto {
  id: string;
  nombre: string;
  descripcion?: string | null;
}

export interface CrearCategoriaCommand {
  nombre: string;
  descripcion?: string;
}

export interface ProductoDto {
  id: string;
  categoriaId: string;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  disponible: boolean;
  stockActual?: number | null;
}

export interface CrearProductoCommand {
  categoriaId: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  disponible?: boolean;
  stockActual?: number;
}
