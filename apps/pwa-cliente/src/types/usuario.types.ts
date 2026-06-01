export type RolUsuario =
  | 'ADMIN'
  | 'CAJERO'
  | 'COCINA'
  | 'MESERO'
  | 'RECEPCION'
  | 'GERENCIA'
  | 'SISTEMA';

export interface UsuarioDto {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  activo: boolean;
  createdAt: string;
}

export interface CrearUsuarioPayload {
  nombre: string;
  email: string;
  password: string;
  rol: RolUsuario;
}

export interface CambiarRolPayload {
  rol: RolUsuario;
}

export interface UsuarioVM {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  rolLabel: string;
  activo: boolean;
  estadoLabel: string;
  estadoClass: string;
  createdAt: string;
  createdAtLabel: string;
}
