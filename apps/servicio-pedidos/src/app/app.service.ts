import { Injectable } from '@nestjs/common';
import {
  CrearPedidoCommand,
  PedidoCreadoPayload,
  PedidoEstado,
  RoutingKeys,
} from '@org/contracts';
import { RabbitMQPublisherService } from '@org/shared-rabbitmq';
import { PrismaService } from '../prisma/prisma.service';
import { toPedidoDto } from './pedidos.mapper';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly publisher: RabbitMQPublisherService,
  ) {}

  getData(): { message: string } {
    return { message: 'Servicio de Pedidos activo' };
  }

  async crearPedido(command: CrearPedidoCommand) {
    const pedido = await this.prisma.pedido.create({
      data: {
        mesaId: command.mesaId,
        items: command.items,
        estado: PedidoEstado.Pendiente,
      },
    });

    const dto = toPedidoDto(pedido);
    const payload: PedidoCreadoPayload = { pedido: dto };

    await this.publisher.publish(RoutingKeys.PedidoCreado, payload, 'servicio-pedidos');

    return { message: 'Pedido creado', pedido: dto };
  }
}
