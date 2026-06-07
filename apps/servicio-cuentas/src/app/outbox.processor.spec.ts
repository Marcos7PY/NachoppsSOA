import { CronExpression } from '@nestjs/schedule';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { OutboxProcessor } from './outbox.processor';

vi.mock('@org/resiliencia', () => ({
  notifyOutboxFailed: vi.fn().mockResolvedValue(undefined),
}));

import { notifyOutboxFailed } from '@org/resiliencia';

const CRON_OPTIONS_METADATA = 'SCHEDULE_CRON_OPTIONS';

function makeEvent(overrides: Record<string, unknown> = {}) {
  return {
    id: 'evt-1',
    routingKey: 'cuenta.cerrada',
    payload: JSON.stringify({ cuentaId: 'c-1' }),
    attempts: 0,
    status: 'PENDING',
    createdAt: new Date(Date.now() - 2000),
    ...overrides,
  };
}

function createProcessor() {
  const prisma = {
    outboxEvent: {
      count: vi.fn().mockResolvedValue(0),
      findMany: vi.fn().mockResolvedValue([]),
      update: vi.fn().mockResolvedValue({}),
      deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
    },
    idempotencyKey: {
      deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
    },
  };
  const rabbitmq = { publish: vi.fn().mockResolvedValue(undefined) };
  return { prisma, rabbitmq, processor: new OutboxProcessor(prisma as any, rabbitmq as any) };
}

describe('OutboxProcessor (Cuentas) — metadatos de cron', () => {
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

describe('OutboxProcessor (Cuentas) — refreshOutboxMetrics', () => {
  it('consulta pending y failed counts sin lanzar', async () => {
    const { prisma, processor } = createProcessor();
    prisma.outboxEvent.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0);
    await expect(processor.refreshOutboxMetrics()).resolves.toBeUndefined();
    expect(prisma.outboxEvent.count).toHaveBeenCalledWith({ where: { status: 'PENDING' } });
    expect(prisma.outboxEvent.count).toHaveBeenCalledWith({ where: { status: 'FAILED' } });
  });

  it('absorbe errores de BD sin lanzar', async () => {
    const { prisma, processor } = createProcessor();
    prisma.outboxEvent.count.mockRejectedValue(new Error('db down'));
    await expect(processor.refreshOutboxMetrics()).resolves.toBeUndefined();
  });
});

describe('OutboxProcessor (Cuentas) — processOutboxEvents', () => {
  beforeEach(() => { vi.mocked(notifyOutboxFailed).mockClear(); });

  it('sin eventos pendientes no llama publish ni update', async () => {
    const { rabbitmq, prisma, processor } = createProcessor();
    await processor.processOutboxEvents();
    expect(rabbitmq.publish).not.toHaveBeenCalled();
    expect(prisma.outboxEvent.update).not.toHaveBeenCalled();
  });

  it('publica el evento y lo marca PROCESSED', async () => {
    const { prisma, rabbitmq, processor } = createProcessor();
    prisma.outboxEvent.findMany.mockResolvedValue([makeEvent()]);
    await processor.processOutboxEvents();
    expect(rabbitmq.publish).toHaveBeenCalledWith('cuenta.cerrada', { cuentaId: 'c-1' }, 'servicio-cuentas');
    expect(prisma.outboxEvent.update).toHaveBeenCalledWith({ where: { id: 'evt-1' }, data: { status: 'PROCESSED' } });
  });

  it('fallo antes de MAX_ATTEMPTS incrementa attempts sin marcar FAILED', async () => {
    const { prisma, rabbitmq, processor } = createProcessor();
    prisma.outboxEvent.findMany.mockResolvedValue([makeEvent({ attempts: 1 })]);
    rabbitmq.publish.mockRejectedValue(new Error('timeout'));
    await processor.processOutboxEvents();
    expect(prisma.outboxEvent.update).toHaveBeenCalledWith({ where: { id: 'evt-1' }, data: { attempts: 2 } });
    expect(notifyOutboxFailed).not.toHaveBeenCalled();
  });

  it('fallo en MAX_ATTEMPTS marca FAILED y llama notifyOutboxFailed', async () => {
    const { prisma, rabbitmq, processor } = createProcessor();
    prisma.outboxEvent.findMany.mockResolvedValue([makeEvent({ attempts: 4 })]);
    rabbitmq.publish.mockRejectedValue(new Error('broker down'));
    await processor.processOutboxEvents();
    expect(prisma.outboxEvent.update).toHaveBeenCalledWith({ where: { id: 'evt-1' }, data: { status: 'FAILED', attempts: 5 } });
    expect(notifyOutboxFailed).toHaveBeenCalledWith('servicio-cuentas', 'evt-1', 'cuenta.cerrada', 5);
  });

  it('bloqueo concurrente: segunda llamada vuelve sin procesar', async () => {
    const { prisma, processor } = createProcessor();
    (processor as any).isProcessing = true;
    await processor.processOutboxEvents();
    expect(prisma.outboxEvent.findMany).not.toHaveBeenCalled();
  });

  it('libera isProcessing aunque haya error de BD', async () => {
    const { prisma, processor } = createProcessor();
    prisma.outboxEvent.findMany.mockRejectedValue(new Error('boom'));
    await processor.processOutboxEvents();
    expect((processor as any).isProcessing).toBe(false);
  });
});

describe('OutboxProcessor (Cuentas) — purgarOutbox', () => {
  it('elimina PROCESSED (24h) y FAILED (168h)', async () => {
    const { prisma, processor } = createProcessor();
    await processor.purgarOutbox();
    expect(prisma.outboxEvent.deleteMany).toHaveBeenCalledTimes(2);
    const calls = prisma.outboxEvent.deleteMany.mock.calls;
    expect(calls[0][0]).toMatchObject({ where: { status: 'PROCESSED', createdAt: { lt: expect.any(Date) } } });
    expect(calls[1][0]).toMatchObject({ where: { status: 'FAILED', createdAt: { lt: expect.any(Date) } } });
  });
});

