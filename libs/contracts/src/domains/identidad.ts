export const RolUsuario = {
  Admin: 'ADMIN',
  Cajero: 'CAJERO',
  Cocina: 'COCINA',
  Mesero: 'MESERO',
  Recepcion: 'RECEPCION',
  Gerencia: 'GERENCIA',
} as const;

export type RolUsuario = (typeof RolUsuario)[keyof typeof RolUsuario];

export interface UsuarioAutenticadoPayload {
  userId: string;
  rol: RolUsuario;
  email: string;
}
