import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PagarPedidoCommand, TransaccionDto, PagoRegistradoPayload, RoutingKeys, MetodoPago } from '@org/contracts';
import { RabbitMQPublisherService } from '@org/shared-rabbitmq';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitmq: RabbitMQPublisherService
  ) {}

  async registrarPago(command: PagarPedidoCommand): Promise<{ message: string; transaccion: TransaccionDto }> {
    const transaccion = await this.prisma.transaccion.create({
      data: {
        pedidoId: command.pedidoId,
        monto: command.monto,
        metodo: command.metodo,
        referencia: command.referencia,
        notas: command.notas
      }
    });

    this.logger.log(`Pago registrado para pedido ${command.pedidoId}: S/ ${command.monto}`);

    // Emitir evento para que Pedidos o Reportes reaccionen
    // Usamos el método publish que ya tiene el envelope
    await this.rabbitmq.publish(RoutingKeys.PagoRegistrado, {
      transaccionId: transaccion.id,
      pedidoId: transaccion.pedidoId,
      monto: Number(transaccion.monto),
      metodo: transaccion.metodo
    }, 'servicio-caja');

    return {
      message: 'Pago registrado exitosamente',
      transaccion: {
        id: transaccion.id,
        pedidoId: transaccion.pedidoId,
        monto: Number(transaccion.monto),
        metodo: transaccion.metodo as MetodoPago,
        referencia: transaccion.referencia,
        notas: transaccion.notas,
        createdAt: transaccion.createdAt.toISOString()
      }
    };
  }

  async listarTransacciones(): Promise<TransaccionDto[]> {
    const data = await this.prisma.transaccion.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return data.map(t => ({
      id: t.id,
      pedidoId: t.pedidoId,
      monto: Number(t.monto),
      metodo: t.metodo as MetodoPago,
      referencia: t.referencia,
      notas: t.notas,
      createdAt: t.createdAt.toISOString()
    }));
  }
}
