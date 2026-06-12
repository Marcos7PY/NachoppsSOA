export interface NotificacionDto {
  id: string;
  eventoOrigen: string;
  destinatario: string;
  canal: string;
  contenido: string;
  estado: string;
  intentos: number;
  timestamp: string;
  leida?: boolean;
}

export interface NotificacionesResponse {
  notificaciones: NotificacionDto[];
}

export interface SocketNotificationPayload {
  pattern?: string;
  data?: unknown;
}

export interface NotificacionVM {
  id: string;
  titulo: string;
  contenido: string;
  canal: string;
  estado: string;
  unread: boolean;
  timestamp: string;
  timestampLabel: string;
}
