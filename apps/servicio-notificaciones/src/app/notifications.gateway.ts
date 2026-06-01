import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface NotificacionEvento {
  pattern: string;
  data: unknown;
}

@WebSocketGateway({
  cors: {
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : [
          'http://localhost:3000',
          'http://localhost:4200',
          'http://localhost:4201',
          'http://localhost:5173',
          'http://127.0.0.1:4200',
          'http://127.0.0.1:4201',
          'http://127.0.0.1:5173',
        ],
    credentials: true,
  },
  // Kong enrutará `/notificaciones/socket.io` hacia este path base:
  path: '/api/socket.io',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  @WebSocketServer()
  server!: Server;

  async handleConnection(client: Socket) {
    try {
      const token = this.extractToken(client);
      if (!token) throw new Error('missing token');

      client.data.user = await this.jwtService.verifyAsync(token);
      this.logger.log(`Cliente KDS conectado: ${client.id}`);
    } catch {
      this.logger.warn(`Conexión WebSocket no autorizada: ${client.id}`);
      client.emit('auth:error', { message: 'unauthorized' });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente KDS desconectado: ${client.id}`);
  }

  // Método público para emitir eventos de pedidos a todos los clientes (cocina)
  emitPedidoUpdate(evento: NotificacionEvento) {
    this.logger.log('Emitiendo evento pedidoUpdate por WebSocket...');
    this.server.emit('pedidoUpdate', evento);
  }

  private extractToken(client: Socket): string | undefined {
    const authToken = client.handshake.auth?.token;
    if (typeof authToken === 'string' && authToken.length > 0) return authToken;

    const cookieHeader = client.handshake.headers.cookie ?? '';
    const cookie = cookieHeader
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith('access_token='));

    return cookie
      ? decodeURIComponent(cookie.slice('access_token='.length))
      : undefined;
  }
}
