import { SetMetadata } from '@nestjs/common';

/** Clave de metadata donde se guardan los roles permitidos de un endpoint. */
export const ROLES_KEY = 'roles';

/**
 * Marca los roles que pueden acceder a un endpoint o controller.
 * Se evalúa con {@link RolesGuard}. Aplicado a nivel de método sobrescribe
 * lo declarado a nivel de clase.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
