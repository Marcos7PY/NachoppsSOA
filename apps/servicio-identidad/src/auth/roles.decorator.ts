import { SetMetadata } from '@nestjs/common';

/** Decorador para marcar los roles permitidos en un endpoint. */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
