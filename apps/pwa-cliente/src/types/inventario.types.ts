// types/inventario.types.ts - DTOs y ViewModels de inventario

export interface CategoriaDto {
  id: string;
  nombre: string;
  descripcion?: string | null;
}

export interface ProductoDto {
  id: string;
  categoriaId: string;
  categoria?: CategoriaDto | null;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  disponible: boolean;
  stockActual?: number | null;
}

export interface ProductoVM {
  id: string;
  categoriaId: string;
  categoriaNombre: string | null;
  nombre: string;
  descripcion: string | null;
  precio: number;
  precioLabel: string;
  disponible: boolean;
  stockActual: number | null;
  stockLabel: string;
  stockClass: string;
}

export interface CrearProductoPayload {
  categoriaId: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  disponible?: boolean;
  stockActual?: number;
}

export interface ProductoResponse {
  message: string;
  producto: ProductoDto;
}

export interface CategoriasResponse {
  categorias: CategoriaDto[];
}

export interface ProductosResponse {
  productos: ProductoDto[];
}
