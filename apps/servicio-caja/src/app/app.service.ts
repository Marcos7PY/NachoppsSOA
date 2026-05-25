import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PagarPedidoCommand, TransaccionDto,  RoutingKeys, MetodoPago } from '@org/contracts';
import { RabbitMQPublisherService } from '@org/shared-rabbitmq';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitmq: RabbitMQPublisherService
  ) {}

  async registrarPago(command: PagarPedidoCommand): Promise<{ message: string; transacciones: TransaccionDto[] }> {
    const transaccionesProcesadas: TransaccionDto[] = [];
    
    // Si no enviaron pagos en el array
    if (!command.pagos || command.pagos.length === 0) {
      throw new Error('Debe enviar al menos un pago.');
    }

    for (const pago of command.pagos) {
      const transaccion = await this.prisma.transaccion.create({
        data: {
          pedidoId: command.pedidoId,
          monto: pago.monto,
          metodo: pago.metodo,
          referencia: pago.referencia,
          notas: command.notas
        }
      });

      this.logger.log(`Pago registrado para pedido ${command.pedidoId}: S/ ${pago.monto} (${pago.metodo})`);

      // Emitir evento por cada pago (o transacción parcial)
      await this.rabbitmq.publish(RoutingKeys.PagoRegistrado, {
        transaccionId: transaccion.id,
        pedidoId: transaccion.pedidoId,
        monto: Number(transaccion.monto),
        metodo: transaccion.metodo
      }, 'servicio-caja');

      transaccionesProcesadas.push({
        id: transaccion.id,
        pedidoId: transaccion.pedidoId,
        monto: Number(transaccion.monto),
        metodo: transaccion.metodo as MetodoPago,
        referencia: transaccion.referencia || undefined,
        notas: transaccion.notas || undefined,
        createdAt: transaccion.createdAt.toISOString()
      });
    }

    return {
      message: 'Pagos registrados exitosamente',
      transacciones: transaccionesProcesadas
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
      referencia: t.referencia || undefined,
      notas: t.notas || undefined,
      createdAt: t.createdAt.toISOString()
    }));
  }
}
