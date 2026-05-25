import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { DomainEventEnvelope } from '@org/contracts';
import { AppService } from './app.service';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitMQRetryInterceptor } from '@org/resiliencia';

@UseInterceptors(RabbitMQRetryInterceptor)
@Controller()
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @EventPattern("pedido.pagado")
  async handlePedidoPagado(
    @Payload() envelope: DomainEventEnvelope<any>,
  ) {
    const idempotencyKey = envelope.metadata?.idempotencyKey;
    if (idempotencyKey) {
      const isNew = await this.prisma.$checkAndRecordIdempotencyKey(idempotencyKey);
      if (!isNew) {
        this.logger.warn(`Evento duplicado ignorado: ${idempotencyKey}`);
        return;
      }
    }

    const payload = envelope.data ?? (envelope as unknown as any);
    this.logger.log(`Pedido pagado. Sesión ${payload.sesionMesaId}, mesa ${payload.mesaId}`);

    try {
      const cuenta = await this.prisma.cuenta.findFirst({
        where: { mesaId: payload.mesaId, estado: 'ABIERTA' },
      });
      if (cuenta) {
        await this.appService.cerrarCuenta(cuenta.id, {});
        this.logger.log(`Cuenta ${cuenta.id} cerrada por evento pedido.pagado`);
      }
    } catch (error) {
      this.logger.error(`Error cerrando cuenta para mesa ${payload.mesaId}: ${(error as Error).message}`);
      throw error;
    }
  }
}
