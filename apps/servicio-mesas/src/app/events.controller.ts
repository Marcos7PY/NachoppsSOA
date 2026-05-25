import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { DomainEventEnvelope, CuentaCerradaPayload, RoutingKeys } from '@org/contracts';
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

  @EventPattern(RoutingKeys.CuentaCerrada)
  async handleCuentaCerrada(
    @Payload() envelope: DomainEventEnvelope<CuentaCerradaPayload>,
  ) {
    const idempotencyKey = envelope.metadata?.idempotencyKey;
    if (idempotencyKey) {
      const isNew = await this.prisma.$checkAndRecordIdempotencyKey(idempotencyKey);
      if (!isNew) {
        this.logger.warn(`Evento duplicado ignorado: ${idempotencyKey}`);
        return;
      }
    }

    const payload = envelope.data ?? (envelope as unknown as CuentaCerradaPayload);
    this.logger.log(`Cuenta cerrada para mesa ${payload.mesaId}. Liberando mesa...`);

    await this.appService.actualizarEstado(payload.mesaId, {
      estado: 'LIBRE',
    });
    this.logger.log(`Mesa ${payload.mesaId} liberada.`);
  }
}
