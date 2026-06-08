import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getJwtPublicKey, getServiceJwtSecret } from '@org/shared-auth';

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

      client.data.user = await this.verifyToken(token);
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

  /**
   * Verifica el token del handshake con el MISMO modelo de confianza que el
   * guard HTTP (`jwt-keys.ts`): RS256 → clave pública (tokens de usuario, los que
   * envía la PWA por cookie), HS256 → secreto de servicio (tokens S2S internos).
   *
   * El `JwtService` global está configurado solo para FIRMAR HS256, por eso aquí
   * pasamos la clave y el algoritmo explícitos por llamada. Restringir el `alg`
   * por rama es lo que cierra el ataque de confusión RS256→HS256: nunca se admite
   * un HS256 firmado con la clave pública conocida.
   */
  private verifyToken(token: string): Promise<unknown> {
    const alg = this.readAlg(token);
    if (alg === 'RS256') {
      return this.jwtService.verifyAsync(token, {
        secret: getJwtPublicKey(),
        algorithms: ['RS256'],
      });
    }
    if (alg === 'HS256') {
      return this.jwtService.verifyAsync(token, {
        secret: getServiceJwtSecret(),
        algorithms: ['HS256'],
      });
    }
    throw new Error(`unsupported jwt alg: ${alg}`);
  }

  private readAlg(token: string): string | undefined {
    const headerB64 = token.split('.')[0];
    const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8'));
    return header?.alg;
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
