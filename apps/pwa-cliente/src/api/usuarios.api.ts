import { client } from './client';
import { unwrapArray, unwrapEntity } from './response';
import type { CambiarRolPayload, CrearUsuarioPayload, UsuarioDto } from '../types/usuario.types';

export async function getAll(): Promise<UsuarioDto[]> {
  const response = await client.get<UsuarioDto[] | { usuarios: UsuarioDto[] }>('/identidad/usuarios');
  return unwrapArray<UsuarioDto>(response, 'usuarios');
}

export async function crear(payload: CrearUsuarioPayload): Promise<UsuarioDto> {
  const response = await client.post<UsuarioDto | { usuario: UsuarioDto }>('/identidad/usuarios', payload);
  return unwrapEntity<UsuarioDto>(response, 'usuario');
}

export async function cambiarRol(id: string, payload: CambiarRolPayload): Promise<UsuarioDto> {
  const response = await client.patch<UsuarioDto | { usuario: UsuarioDto }>(
    `/identidad/usuarios/${id}/rol`,
    payload,
  );
  return unwrapEntity<UsuarioDto>(response, 'usuario');
}
