/**
 * T-19: matriz evento→roles para los rooms de WebSocket. Fuente única alineada con
 * los `@Roles` HTTP. El gateway de notificaciones une cada cliente al room `rol:<ROL>`
 * y emite cada evento solo a los roles que lo necesitan, en vez de un broadcast global.
 *
 * La clave es el prefijo de dominio de la routing key (`pago` en `pago.registrado`).
 */
export const WS_EVENT_ROLES: Record<string, readonly string[]> = {
  // Caja / pagos / cierres
  pago: ['ADMIN', 'CAJERO', 'GERENCIA'],
  arqueo: ['ADMIN', 'CAJERO', 'GERENCIA'],
  ticket: ['ADMIN', 'CAJERO', 'GERENCIA'],
  // Operación de sala
  pedido: ['ADMIN', 'SISTEMA', 'CAJERO', 'MESERO', 'COCINA'],
  mesa: ['ADMIN', 'SISTEMA', 'CAJERO', 'MESERO', 'COCINA'],
  cuenta: ['ADMIN', 'SISTEMA', 'CAJERO', 'MESERO', 'COCINA'],
  // Inventario
  stock: ['ADMIN', 'GERENCIA', 'COCINA'],
  producto: ['ADMIN', 'GERENCIA', 'COCINA'],
  // Reservas
  reserva: ['ADMIN', 'RECEPCION', 'GERENCIA', 'MESERO'],
} as const;

/** Prefijo de room por rol. */
export const wsRoomForRole = (rol: string): string => `rol:${rol}`;

/**
 * Devuelve los rooms (`rol:<ROL>`) que deben recibir un evento según su routing key
 * (`pago.registrado` → roles de `pago`). Si el dominio no está en la matriz, devuelve
 * `[]` (nadie lo recibe) para fallar cerrado en vez de filtrar de más.
 */
export function wsRoomsForPattern(pattern: string): string[] {
  const dominio = pattern.split('.')[0];
  const roles = WS_EVENT_ROLES[dominio] ?? [];
  return roles.map(wsRoomForRole);
}
