// api/inventario.api.ts - Llamadas al servicio de inventario

import { client } from './client';
import { unwrapArray, unwrapEntity } from './response';
import type {
  CategoriaDto,
  CategoriasResponse,
  CrearProductoPayload,
  ProductoDto,
  ProductoResponse,
  ProductosResponse,
} from '../types/inventario.types';

export async function getCategorias(): Promise<CategoriaDto[]> {
  const response = await client.get<CategoriasResponse | CategoriaDto[]>('/inventario/categorias');
  return unwrapArray<CategoriaDto>(response, 'categorias');
}

export async function getProductos(categoriaId?: string): Promise<ProductoDto[]> {
  const query = categoriaId ? `?categoriaId=${encodeURIComponent(categoriaId)}` : '';
  const response = await client.get<ProductosResponse | ProductoDto[]>(`/inventario/productos${query}`);
  return unwrapArray<ProductoDto>(response, 'productos');
}

export async function crearProducto(payload: CrearProductoPayload): Promise<ProductoDto> {
  const response = await client.post<ProductoResponse | ProductoDto>('/inventario/productos', payload);
  return unwrapEntity<ProductoDto>(response, 'producto');
}

export async function reponerStock(id: string, cantidad: number): Promise<ProductoDto> {
  const response = await client.patch<ProductoResponse | ProductoDto>(`/inventario/productos/${id}/stock`, {
    stock: cantidad,
  });
  return unwrapEntity<ProductoDto>(response, 'producto');
}
