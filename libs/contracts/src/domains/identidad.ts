export const RolUsuario = {
  Admin: 'ADMIN',
  Cajero: 'CAJERO',
  Cocina: 'COCINA',
  Mesero: 'MESERO',
  Recepcion: 'RECEPCION',
  Gerencia: 'GERENCIA',
} as const;

export type RolUsuario = (typeof RolUsuario)[keyof typeof RolUsuario];

/* ── DTOs ────────────────────────────────────────────── */

export interface UsuarioDto {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  activo: boolean;
  createdAt: string;
}

/* ── Commands ────────────────────────────────────────── */

export interface LoginCommand {
  email: string;
  password: string;
}

export interface CrearUsuarioCommand {
  nombre: string;
  email: string;
  password: string;
  rol: RolUsuario;
}

export interface CambiarRolCommand {
  rol: RolUsuario;
}

/* ── Responses ───────────────────────────────────────── */

export interface LoginResponseDto {
  access_token: string;
  usuario: Omit<UsuarioDto, 'activo' | 'createdAt'>;
}

/* ── Event payloads ──────────────────────────────────── */

export interface UsuarioAutenticadoPayload {
  userId: string;
  rol: RolUsuario;
  email: string;
}
