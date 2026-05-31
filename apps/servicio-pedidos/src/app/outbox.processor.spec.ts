import { CronExpression } from '@nestjs/schedule';
import { describe, expect, it, vi } from 'vitest';
import { OutboxProcessor } from './outbox.processor';

const CRON_OPTIONS_METADATA = 'SCHEDULE_CRON_OPTIONS';

function createProcessor() {
  const prisma = {
    outboxEvent: {
      findMany: vi.fn().mockResolvedValue([]),
      deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
    },
    idempotencyKey: {
      deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
    },
  };
  const rabbitmq = { publish: vi.fn().mockResolvedValue(undefined) };
  return {
    prisma,
    processor: new OutboxProcessor(prisma as any, rabbitmq as any),
  };
}

describe('OutboxProcessor - Pedidos', () => {
  it('ejecuta la purga de idempotency_keys con cron propio cada hora', () => {
    const metadata = (Reflect as any).getMetadata(
      CRON_OPTIONS_METADATA,
      OutboxProcessor.prototype.purgarIdempotencyKeys,
    );

    expect(metadata).toMatchObject({ cronTime: CronExpression.EVERY_HOUR });
  });

  it('purga idempotency_keys sin depender de outbox pendiente', async () => {
    const { prisma, processor } = createProcessor();

    await processor.purgarIdempotencyKeys();

    expect(prisma.idempotencyKey.deleteMany).toHaveBeenCalledWith({
      where: { createdAt: { lt: expect.any(Date) } },
    });
    expect(prisma.outboxEvent.findMany).not.toHaveBeenCalled();
  });
});
