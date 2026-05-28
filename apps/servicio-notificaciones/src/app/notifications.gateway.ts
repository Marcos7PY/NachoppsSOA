import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

export interface NotificacionEvento {
  pattern: string;
  data: unknown;
}

@WebSocketGateway({
  cors: {
    origin: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',') 
      : ['http://localhost:3000', 'http://localhost:4200'],
    credentials: true,
  },
  // Kong enrutará `/notificaciones/socket.io` hacia este path base:
  path: '/api/socket.io'
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Cliente KDS conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente KDS desconectado: ${client.id}`);
  }

  // Método público para emitir eventos de pedidos a todos los clientes (cocina)
  emitPedidoUpdate(evento: NotificacionEvento) {
    this.logger.log('Emitiendo evento pedidoUpdate por WebSocket...');
    this.server.emit('pedidoUpdate', evento);
  }
}
