import { DynamicModule, Inject, Injectable, Logger, Module, Type } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RabbitMQPublisherService } from '@org/shared-rabbitmq';
import { getOrCreateGauge, getOrCreateHistogram } from '@org/observabilidad';
import type { RoutingKey } from '@org/contracts';
import { notifyOutboxFailed } from './outbox-alert';
import { OUTBOX_DB } from './outbox-admin';

/**
 * Procesador del Transactional Outbox (ADR-002), unificado en `libs/resiliencia`.
 *
 * Antes existían 7 copias byte-a-byte (una por servicio productor) que solo
 * diferían en la constante `PRODUCER`. T-07 las consolida aquí sin cambiar la
 * semántica: el `SKIP LOCKED` (T-08) y la purga de idempotency keys (T-06) se
 * abordan en tareas separadas.
 *
 * Cada servicio registra el módulo con `OutboxModule.forService(PrismaService, { producer })`.
 */
export const OUTBOX_CONFIG = Symbol('OUTBOX_CONFIG');

export interface OutboxProcessorConfig {
  /** Nombre del servicio productor (etiqueta de métricas y `x-producer`). */
  producer: string;
  /** Reintentos antes de marcar FAILED (default 5). */
  maxAttempts?: number;
  /** Tamaño de lote por tick (default 50). */
  batchSize?: number;
  /** Retención de eventos PROCESSED en horas (default 24). */
  retencionProcessedHoras?: number;
  /** Retención de eventos FAILED en horas (default 168 = 7 días). */
  retencionFailedHoras?: number;
  /**
   * Si el payload es un objeto, fija `payload.eventId ??= event.id` antes de
   * publicar (lo usaba servicio-inventario para deduplicar en el consumidor).
   */
  injectEventId?: boolean;
}

interface OutboxEventRow {
  id: string;
  routingKey: string;
  payload: string;
  attempts: number;
  createdAt: Date | string;
}

export interface OutboxProcessorDb {
  outboxEvent: {
    count(args: unknown): Promise<number>;
    findMany(args: unknown): Promise<OutboxEventRow[]>;
    update(args: unknown): Promise<unknown>;
    deleteMany(args: unknown): Promise<{ count: number }>;
  };
}

@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);
  private isProcessing = false;

  private readonly producer: string;
  private readonly maxAttempts: number;
  private readonly batchSize: number;
  private readonly retencionProcessedHoras: number;
  private readonly retencionFailedHoras: number;
  private readonly injectEventId: boolean;

  private readonly outboxPendingGauge = getOrCreateGauge(
    'outbox_pending_total',
    'Eventos del outbox pendientes de publicar',
    ['service'],
  );
  private readonly outboxFailedGauge = getOrCreateGauge(
    'outbox_failed_total',
    'Eventos del outbox en estado FAILED (dead-letter en BD)',
    ['service'],
  );

  private readonly outboxPublishLag = getOrCreateHistogram(
    'outbox_publish_lag_seconds',
    'Latencia desde la creación del evento hasta su publicación',
    [0.5, 1, 2, 5, 10, 30, 60, 300],
    ['service'],
  );

  constructor(
    @Inject(OUTBOX_DB) private readonly prisma: OutboxProcessorDb,
    private readonly rabbitmq: RabbitMQPublisherService,
    @Inject(OUTBOX_CONFIG) config: OutboxProcessorConfig,
  ) {
    this.producer = config.producer;
    this.maxAttempts = config.maxAttempts ?? 5;
    this.batchSize = config.batchSize ?? 50;
    this.retencionProcessedHoras = config.retencionProcessedHoras ?? 24;
    this.retencionFailedHoras = config.retencionFailedHoras ?? 168;
    this.injectEventId = config.injectEventId ?? false;
  }

  /**
   * Canario de salud del sistema event-driven: publica la profundidad del outbox
   * como gauges Prometheus por servicio. Alimenta el panel/alerta de
   * outbox_pending_total / outbox_failed_total (plan 3.1).
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
  async refreshOutboxMetrics() {
    try {
      const [pending, failed] = await Promise.all([
        this.prisma.outboxEvent.count({ where: { status: 'PENDING' } }),
        this.prisma.outboxEvent.count({ where: { status: 'FAILED' } }),
      ]);
      this.outboxPendingGauge.set({ service: this.producer }, pending);
      this.outboxFailedGauge.set({ service: this.producer }, failed);
    } catch (error) {
      this.logger.warn(`No se pudieron actualizar métricas de outbox: ${(error as Error).message}`);
    }
  }

  @Cron(CronExpression.EVERY_SECOND)
  async processOutboxEvents() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    try {
      const pendingEvents = await this.prisma.outboxEvent.findMany({
        where: { status: 'PENDING' },
        take: this.batchSize,
        orderBy: { createdAt: 'asc' },
      });

      for (const event of pendingEvents) {
        try {
          const payload = JSON.parse(event.payload);
          if (this.injectEventId && payload && typeof payload === 'object' && !Array.isArray(payload)) {
            payload.eventId ??= event.id;
          }
          await this.rabbitmq.publish(event.routingKey as RoutingKey, payload, this.producer);
          await this.prisma.outboxEvent.update({
            where: { id: event.id },
            data: { status: 'PROCESSED' },
          });
          this.outboxPublishLag.observe(
            { service: this.producer },
            Math.max(0, (Date.now() - new Date(event.createdAt).getTime()) / 1000),
          );
        } catch (error) {
          const attempts = event.attempts + 1;
          if (attempts >= this.maxAttempts) {
            await this.prisma.outboxEvent.update({
              where: { id: event.id },
              data: { status: 'FAILED', attempts },
            });
            this.logger.error(
              `[ALERTA][OUTBOX_FAILED] ${this.producer} evento ${event.id} (${event.routingKey}) marcado FAILED tras ${attempts} intentos`,
              error as Error,
            );
            void notifyOutboxFailed(this.producer, event.id, event.routingKey, attempts);
          } else {
            await this.prisma.outboxEvent.update({
              where: { id: event.id },
              data: { attempts },
            });
            this.logger.warn(`Evento ${event.id} falló (intento ${attempts}/${this.maxAttempts}) — se reintentará`);
          }
        }
      }
    } catch (error) {
      this.logger.error('Error procesando Outbox:', error as Error);
    } finally {
      this.isProcessing = false;
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async purgarOutbox() {
    const cutoffProcessed = new Date(Date.now() - this.retencionProcessedHoras * 3600_000);
    const cutoffFailed = new Date(Date.now() - this.retencionFailedHoras * 3600_000);
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

/**
 * Registra el procesador del outbox para un servicio productor concreto.
 *
 * `prismaService` debe exponer el modelo `outboxEvent` y estar disponible
 * globalmente (PrismaModule @Global) para el `useExisting`.
 */
@Module({})
export class OutboxModule {
  static forService(prismaService: Type<unknown>, config: OutboxProcessorConfig): DynamicModule {
    return {
      module: OutboxModule,
      providers: [
        OutboxProcessor,
        { provide: OUTBOX_DB, useExisting: prismaService },
        { provide: OUTBOX_CONFIG, useValue: config },
      ],
      exports: [OutboxProcessor],
    };
  }
}
