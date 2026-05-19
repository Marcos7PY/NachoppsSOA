/**
 * Routing keys AMQP (topic). Convención: dominio.accion en minúsculas.
 * Nombres de evento de negocio (APF2) en PascalCase viven en tipos/payloads.
 */
export const RoutingKeys = {
  // Reservas
  ReservaCreada: 'reserva.creada',
  ReservaCancelada: 'reserva.cancelada',
  ReservaConfirmada: 'reserva.confirmada',

  // Mesas
  MesaAsignada: 'mesa.asignada',
  MesaLiberada: 'mesa.liberada',

  // Pedidos
  PedidoCreado: 'pedido.creado',
  PedidoListo: 'pedido.listo',

  // Cuentas
  CuentaCerrada: 'cuenta.cerrada',
  TicketGenerado: 'ticket.generado',

  // Caja
  PagoRegistrado: 'pago.registrado',
  ArqueoRealizado: 'arqueo.realizado',

  // Inventario
  StockBajo: 'stock.bajo',
  StockDescontado: 'stock.descontado',

  // Identidad
  UsuarioAutenticado: 'usuario.autenticado',
} as const;

export type RoutingKey = (typeof RoutingKeys)[keyof typeof RoutingKeys];

/** Binding de cola consumidor amplio (desarrollo / notificaciones). */
export const CONSUMER_BINDING_ALL_DOMAIN_EVENTS = '*.*' as const;
