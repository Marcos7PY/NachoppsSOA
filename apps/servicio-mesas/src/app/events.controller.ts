import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { DomainEventEnvelope, CuentaCerradaPayload, CuentaAbiertaPayload, RoutingKeys } from '@org/contracts';
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

  @EventPattern(RoutingKeys.CuentaAbierta)
  async handleCuentaAbierta(
    @Payload() envelope: DomainEventEnvelope<CuentaAbiertaPayload>,
  ) {
    const idempotencyKey = envelope.metadata?.idempotencyKey;
    if (idempotencyKey) {
      const isNew = await this.prisma.$checkAndRecordIdempotencyKey(idempotencyKey);
      if (!isNew) {
        this.logger.warn(`Evento duplicado ignorado: ${idempotencyKey}`);
        return;
      }
    }

    const payload = envelope.data ?? (envelope as unknown as CuentaAbiertaPayload);
    this.logger.log(`Cuenta abierta para mesa ${payload.mesaId}. Ocupando mesa...`);

    await this.appService.actualizarEstado(payload.mesaId, {
      estado: 'OCUPADA',
    });
    this.logger.log(`Mesa ${payload.mesaId} marcada como OCUPADA por CuentaAbierta`);
  }

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
