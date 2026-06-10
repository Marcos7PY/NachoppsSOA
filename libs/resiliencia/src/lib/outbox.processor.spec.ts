import { CronExpression } from '@nestjs/schedule';
import { describe, expect, it, vi, beforeEach } from 'vitest';

// Métricas: stubs que no tocan el registro real de Prometheus.
vi.mock('@org/observabilidad', () => ({
  getOrCreateGauge: () => ({ set: vi.fn() }),
  getOrCreateHistogram: () => ({ observe: vi.fn() }),
}));

// Alerta Slack: la espiamos para verificar el disparo en FAILED.
vi.mock('./outbox-alert', () => ({
  notifyOutboxFailed: vi.fn().mockResolvedValue(undefined),
}));

import { OutboxProcessor, OutboxProcessorConfig } from './outbox.processor';
import { notifyOutboxFailed } from './outbox-alert';

const CRON_OPTIONS_METADATA = 'SCHEDULE_CRON_OPTIONS';
const PRODUCER = 'servicio-pedidos';

function makeEvent(overrides: Record<string, unknown> = {}) {
  return {
    id: 'evt-1',
    routingKey: 'pedido.creado',
    payload: JSON.stringify({ pedidoId: 'p1' }),
    attempts: 0,
    status: 'PENDING',
    createdAt: new Date(Date.now() - 2000),
    ...overrides,
  };
}

function createProcessor(config: Partial<OutboxProcessorConfig> = {}) {
  const prisma = {
    outboxEvent: {
      count: vi.fn().mockResolvedValue(0),
      findMany: vi.fn().mockResolvedValue([]),
      update: vi.fn().mockResolvedValue({}),
      deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
    },
  };
  const rabbitmq = { publish: vi.fn().mockResolvedValue(undefined) };
  return {
    prisma,
    rabbitmq,
    processor: new OutboxProcessor(prisma as any, rabbitmq as any, { producer: PRODUCER, ...config }),
  };
}

// ─── Metadatos de cron ────────────────────────────────────────────────────────

describe('OutboxProcessor — metadatos de cron', () => {
  it('processOutboxEvents corre cada segundo', () => {
    const meta = (Reflect as any).getMetadata(CRON_OPTIONS_METADATA, OutboxProcessor.prototype.processOutboxEvents);
    expect(meta).toMatchObject({ cronTime: CronExpression.EVERY_SECOND });
  });

  it('refreshOutboxMetrics corre cada 10 segundos', () => {
    const meta = (Reflect as any).getMetadata(CRON_OPTIONS_METADATA, OutboxProcessor.prototype.refreshOutboxMetrics);
    expect(meta).toMatchObject({ cronTime: CronExpression.EVERY_10_SECONDS });
  });

  it('purgarOutbox corre cada hora', () => {
    const meta = (Reflect as any).getMetadata(CRON_OPTIONS_METADATA, OutboxProcessor.prototype.purgarOutbox);
    expect(meta).toMatchObject({ cronTime: CronExpression.EVERY_HOUR });
  });
});

// ─── refreshOutboxMetrics ─────────────────────────────────────────────────────

describe('OutboxProcessor — refreshOutboxMetrics', () => {
  it('consulta pending y failed counts sin lanzar', async () => {
    const { prisma, processor } = createProcessor();
    prisma.outboxEvent.count.mockResolvedValueOnce(3).mockResolvedValueOnce(1);

    await expect(processor.refreshOutboxMetrics()).resolves.toBeUndefined();

    expect(prisma.outboxEvent.count).toHaveBeenCalledTimes(2);
    expect(prisma.outboxEvent.count).toHaveBeenCalledWith({ where: { status: 'PENDING' } });
    expect(prisma.outboxEvent.count).toHaveBeenCalledWith({ where: { status: 'FAILED' } });
  });

  it('absorbe errores de BD sin lanzar', async () => {
    const { prisma, processor } = createProcessor();
    prisma.outboxEvent.count.mockRejectedValue(new Error('db down'));

    await expect(processor.refreshOutboxMetrics()).resolves.toBeUndefined();
  });
});

// ─── processOutboxEvents ──────────────────────────────────────────────────────

describe('OutboxProcessor — processOutboxEvents', () => {
  beforeEach(() => {
    vi.mocked(notifyOutboxFailed).mockClear();
  });

  it('sin eventos pendientes no llama publish ni update', async () => {
    const { prisma, rabbitmq, processor } = createProcessor();
    prisma.outboxEvent.findMany.mockResolvedValue([]);

    await processor.processOutboxEvents();

    expect(rabbitmq.publish).not.toHaveBeenCalled();
    expect(prisma.outboxEvent.update).not.toHaveBeenCalled();
  });

  it('respeta batchSize en el take de findMany (default 50)', async () => {
    const { prisma, processor } = createProcessor();
    await processor.processOutboxEvents();
    expect(prisma.outboxEvent.findMany).toHaveBeenCalledWith({
      where: { status: 'PENDING' },
      take: 50,
      orderBy: { createdAt: 'asc' },
    });
  });

  it('publica el evento y lo marca PROCESSED', async () => {
    const { prisma, rabbitmq, processor } = createProcessor();
    prisma.outboxEvent.findMany.mockResolvedValue([makeEvent()]);

    await processor.processOutboxEvents();

    expect(rabbitmq.publish).toHaveBeenCalledWith('pedido.creado', { pedidoId: 'p1' }, PRODUCER);
    expect(prisma.outboxEvent.update).toHaveBeenCalledWith({
      where: { id: 'evt-1' },
      data: { status: 'PROCESSED' },
    });
  });

  it('con injectEventId enriquece el payload antes de publicar', async () => {
    const { prisma, rabbitmq, processor } = createProcessor({ producer: 'servicio-inventario', injectEventId: true });
    prisma.outboxEvent.findMany.mockResolvedValue([
      makeEvent({ routingKey: 'stock.descontado', payload: JSON.stringify({ productoId: 'pr1' }) }),
    ]);

    await processor.processOutboxEvents();

    expect(rabbitmq.publish).toHaveBeenCalledWith(
      'stock.descontado',
      { productoId: 'pr1', eventId: 'evt-1' },
      'servicio-inventario',
    );
  });

  it('sin injectEventId no toca el payload', async () => {
    const { rabbitmq, prisma, processor } = createProcessor();
    prisma.outboxEvent.findMany.mockResolvedValue([makeEvent()]);

    await processor.processOutboxEvents();

    expect(rabbitmq.publish).toHaveBeenCalledWith('pedido.creado', { pedidoId: 'p1' }, PRODUCER);
  });

  it('fallo antes de MAX_ATTEMPTS incrementa attempts sin marcar FAILED', async () => {
    const { prisma, rabbitmq, processor } = createProcessor();
    prisma.outboxEvent.findMany.mockResolvedValue([makeEvent({ attempts: 3 })]); // intento 4 < 5
    rabbitmq.publish.mockRejectedValue(new Error('timeout'));

    await processor.processOutboxEvents();

    expect(prisma.outboxEvent.update).toHaveBeenCalledWith({ where: { id: 'evt-1' }, data: { attempts: 4 } });
    expect(notifyOutboxFailed).not.toHaveBeenCalled();
  });

  it('fallo en MAX_ATTEMPTS marca FAILED y dispara notifyOutboxFailed', async () => {
    const { prisma, rabbitmq, processor } = createProcessor();
    prisma.outboxEvent.findMany.mockResolvedValue([makeEvent({ attempts: 4 })]); // intento 5 = MAX
    rabbitmq.publish.mockRejectedValue(new Error('timeout'));

    await processor.processOutboxEvents();

    expect(prisma.outboxEvent.update).toHaveBeenCalledWith({
      where: { id: 'evt-1' },
      data: { status: 'FAILED', attempts: 5 },
    });
    expect(notifyOutboxFailed).toHaveBeenCalledWith(PRODUCER, 'evt-1', 'pedido.creado', 5);
  });

  it('maxAttempts configurable adelanta el FAILED', async () => {
    const { prisma, rabbitmq, processor } = createProcessor({ maxAttempts: 2 });
    prisma.outboxEvent.findMany.mockResolvedValue([makeEvent({ attempts: 1 })]); // intento 2 = MAX
    rabbitmq.publish.mockRejectedValue(new Error('timeout'));

    await processor.processOutboxEvents();

    expect(prisma.outboxEvent.update).toHaveBeenCalledWith({
      where: { id: 'evt-1' },
      data: { status: 'FAILED', attempts: 2 },
    });
  });

  it('bloqueo concurrente: segunda llamada vuelve sin procesar', async () => {
    const { prisma, processor } = createProcessor();
    (processor as any).isProcessing = true;

    await processor.processOutboxEvents();

    expect(prisma.outboxEvent.findMany).not.toHaveBeenCalled();
  });

  it('error de findMany no lanza (capturado por bloque outer)', async () => {
    const { prisma, processor } = createProcessor();
    prisma.outboxEvent.findMany.mockRejectedValue(new Error('conn error'));

    await expect(processor.processOutboxEvents()).resolves.toBeUndefined();
  });

  it('libera el bloqueo isProcessing aunque haya un fallo interno', async () => {
    const { prisma, processor } = createProcessor();
    prisma.outboxEvent.findMany.mockRejectedValue(new Error('boom'));

    await processor.processOutboxEvents();

    expect((processor as any).isProcessing).toBe(false);
  });
});

// ─── purgarOutbox ─────────────────────────────────────────────────────────────

describe('OutboxProcessor — purgarOutbox', () => {
  it('elimina PROCESSED (24h) y FAILED (168h) con cutoffs correctos', async () => {
    const { prisma, processor } = createProcessor();
    prisma.outboxEvent.deleteMany.mockResolvedValue({ count: 2 });

    await processor.purgarOutbox();

    expect(prisma.outboxEvent.deleteMany).toHaveBeenCalledTimes(2);
    const calls = prisma.outboxEvent.deleteMany.mock.calls;

    expect(calls[0][0]).toMatchObject({ where: { status: 'PROCESSED', createdAt: { lt: expect.any(Date) } } });
    expect(calls[1][0]).toMatchObject({ where: { status: 'FAILED', createdAt: { lt: expect.any(Date) } } });

    // La retención FAILED (168h) debe ser mayor que la de PROCESSED (24h)
    const cutoffProcessed: Date = calls[0][0].where.createdAt.lt;
    const cutoffFailed: Date = calls[1][0].where.createdAt.lt;
    expect(cutoffFailed.getTime()).toBeLessThan(cutoffProcessed.getTime());
  });
});
