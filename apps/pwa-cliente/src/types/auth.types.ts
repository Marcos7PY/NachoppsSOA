// types/auth.types.ts — DTOs de autenticación

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserDto {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  activo?: boolean;
  createdAt?: string;
}

export interface LoginResponseDto {
  access_token: string;
  usuario: UserDto;
}
