import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitMQPublisherService } from '@org/shared-rabbitmq';

const PRODUCER = 'servicio-reservas';
const MAX_ATTEMPTS = 5;
const RETENCION_PROCESSED_HORAS = 24;
const RETENCION_FAILED_HORAS = 168; // 7 días

@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);
  private isProcessing = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitmq: RabbitMQPublisherService,
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  async processOutboxEvents() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    try {
      const pendingEvents = await this.prisma.outboxEvent.findMany({
        where: { status: 'PENDING' },
        take: 50,
        orderBy: { createdAt: 'asc' },
      });

      for (const event of pendingEvents) {
        try {
          const payload = JSON.parse(event.payload);
          await this.rabbitmq.publish(event.routingKey as any, payload, PRODUCER);
          await this.prisma.outboxEvent.update({
            where: { id: event.id },
            data: { status: 'PROCESSED' },
          });
        } catch (error) {
          const attempts = event.attempts + 1;
          if (attempts >= MAX_ATTEMPTS) {
            await this.prisma.outboxEvent.update({
              where: { id: event.id },
              data: { status: 'FAILED', attempts },
            });
            this.logger.error(
              `[ALERTA][OUTBOX_FAILED] ${PRODUCER} evento ${event.id} (${event.routingKey}) marcado FAILED tras ${attempts} intentos`,
              error as any,
            );
          } else {
            await this.prisma.outboxEvent.update({
              where: { id: event.id },
              data: { attempts },
            });
            this.logger.warn(`Evento ${event.id} falló (intento ${attempts}/${MAX_ATTEMPTS}) — se reintentará`);
          }
        }
      }
    } catch (error) {
      this.logger.error('Error procesando Outbox:', error as any);
    } finally {
      this.isProcessing = false;
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async purgarOutbox() {
    const cutoffProcessed = new Date(Date.now() - RETENCION_PROCESSED_HORAS * 3600_000);
    const cutoffFailed = new Date(Date.now() - RETENCION_FAILED_HORAS * 3600_000);
    const r1 = await this.prisma.outboxEvent.deleteMany({
      where: { status: 'PROCESSED', createdAt: { lt: cutoffProcessed } },
    });
    const r2 = await this.prisma.outboxEvent.deleteMany({
      where: { status: 'FAILED', createdAt: { lt: cutoffFailed } },
    });
    if (r1.count + r2.count > 0) {
      this.logger.log(`Purga outbox: ${r1.count} PROCESSED + ${r2.count} FAILED eliminados`);
    }
  }
}
