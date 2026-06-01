import type { NotificacionDto, NotificacionVM, SocketNotificationPayload } from '../types/notificacion.types';

export function mapNotificacion(dto: NotificacionDto): NotificacionVM {
  return {
    id: dto.id,
    titulo: dto.eventoOrigen,
    contenido: dto.contenido,
    canal: dto.canal,
    estado: dto.estado,
    unread: dto.leida === false || dto.estado === 'PENDIENTE',
    timestamp: dto.timestamp,
    timestampLabel: new Date(dto.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}

export function mapNotificaciones(dtos: NotificacionDto[]): NotificacionVM[] {
  return dtos.map(mapNotificacion);
}

export function mapSocketNotification(evento: SocketNotificationPayload): NotificacionVM {
  const pattern = evento.pattern ?? 'evento';
  const dataObj = evento.data && typeof evento.data === 'object' ? (evento.data as Record<string, unknown>) : null;

  return {
    id: dataObj?.notificacionId ? String(dataObj.notificacionId) : `${pattern}-${Date.now()}`,
    titulo: pattern.toUpperCase().replace(/\./g, ' · '),
    contenido: dataObj?.contenido ? String(dataObj.contenido) : 'Actualización recibida en tiempo real.',
    canal: 'UI',
    estado: 'PENDIENTE',
    unread: true,
    timestamp: new Date().toISOString(),
    timestampLabel: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}

