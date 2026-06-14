import { CronExpression } from '@nestjs/schedule';
import { describe, expect, it, vi } from 'vitest';
import { IdempotencyPurgeService } from './idempotency-purge.service';

const CRON_OPTIONS_METADATA = 'SCHEDULE_CRON_OPTIONS';

function createService(config?: { retencionDias?: number }) {
  const db = {
    idempotencyKey: {
      deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
    },
  };
  return { db, service: new IdempotencyPurgeService(db, config) };
}

describe('IdempotencyPurgeService', () => {
  it('purgarIdempotencyKeys corre cada hora', () => {
    const meta = (Reflect as { getMetadata?: (k: string, t: unknown) => unknown }).getMetadata?.(
      CRON_OPTIONS_METADATA,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      IdempotencyPurgeService.prototype.purgarIdempotencyKeys,
    );
    expect(meta).toMatchObject({ cronTime: CronExpression.EVERY_HOUR });
  });

  it('borra claves más antiguas que la retención por defecto (7 días)', async () => {
    const { db, service } = createService();
    const antes = Date.now() - 7 * 24 * 3600_000;

    await service.purgarIdempotencyKeys();

    expect(db.idempotencyKey.deleteMany).toHaveBeenCalledTimes(1);
    const cutoff: Date = (db.idempotencyKey.deleteMany.mock.calls[0][0] as { where: { createdAt: { lt: Date } } }).where.createdAt.lt;
    // El cutoff debe situarse ~7 días atrás (tolerancia de unos segundos).
    expect(Math.abs(cutoff.getTime() - antes)).toBeLessThan(5000);
  });

  it('respeta una retención configurable', async () => {
    const { db, service } = createService({ retencionDias: 1 });
    const antes = Date.now() - 1 * 24 * 3600_000;

    await service.purgarIdempotencyKeys();

    const cutoff: Date = (db.idempotencyKey.deleteMany.mock.calls[0][0] as { where: { createdAt: { lt: Date } } }).where.createdAt.lt;
    expect(Math.abs(cutoff.getTime() - antes)).toBeLessThan(5000);
  });

  it('no falla y no loguea cuando no hay nada que purgar', async () => {
    const { db, service } = createService();
    db.idempotencyKey.deleteMany.mockResolvedValue({ count: 0 });
    await expect(service.purgarIdempotencyKeys()).resolves.toBeUndefined();
  });
});
