import { NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { OutboxAdminController, OUTBOX_DB } from './outbox-admin';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeDb(overrides: Record<string, unknown> = {}) {
  return {
    outboxEvent: {
      findMany: vi.fn().mockResolvedValue([]),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      ...overrides,
    },
  };
}

function makeController(dbOverrides: Record<string, unknown> = {}) {
  const db = makeDb(dbOverrides);
  // OutboxAdminController usa @Inject(OUTBOX_DB); lo instanciamos manualmente
  const ctrl = new OutboxAdminController(db);
  return { ctrl, db };
}

// ─── listFailed ───────────────────────────────────────────────────────────────

describe('OutboxAdminController — listFailed', () => {
  it('llama findMany con status=FAILED, orderBy createdAt asc, take 100', async () => {
    const { ctrl, db } = makeController();
    const fakeFailed = [{ id: 'e1', status: 'FAILED' }];
    db.outboxEvent.findMany.mockResolvedValue(fakeFailed);

    const result = await ctrl.listFailed();

    expect(result).toEqual(fakeFailed);
    expect(db.outboxEvent.findMany).toHaveBeenCalledWith({
      where: { status: 'FAILED' },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });
  });

  it('devuelve array vacío si no hay eventos FAILED', async () => {
    const { ctrl } = makeController();
    const result = await ctrl.listFailed();
    expect(result).toEqual([]);
  });
});

// ─── retry ────────────────────────────────────────────────────────────────────

describe('OutboxAdminController — retry', () => {
  it('actualiza el evento de FAILED a PENDING y resetea attempts', async () => {
    const { ctrl, db } = makeController();

    const result = await ctrl.retry('evt-abc');

    expect(db.outboxEvent.updateMany).toHaveBeenCalledWith({
      where: { id: 'evt-abc', status: 'FAILED' },
      data: { status: 'PENDING', attempts: 0 },
    });
    expect(result).toMatchObject({ id: 'evt-abc', message: expect.stringContaining('PENDING') as string });
  });

  it('lanza NotFoundException si el evento no existe o no está en FAILED', async () => {
    const { ctrl } = makeController({
      updateMany: vi.fn().mockResolvedValue({ count: 0 }),
    });

    await expect(ctrl.retry('inexistente')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('el mensaje de NotFoundException incluye el id del evento', async () => {
    const { ctrl } = makeController({
      updateMany: vi.fn().mockResolvedValue({ count: 0 }),
    });

    await expect(ctrl.retry('id-especifico')).rejects.toThrow('id-especifico');
  });

  it('retorna mensaje de éxito con el id correcto', async () => {
    const { ctrl } = makeController();
    const result = await ctrl.retry('evt-xyz');
    expect(result).toEqual({ message: 'Evento reencolado (FAILED → PENDING)', id: 'evt-xyz' });
  });
});

// ─── OUTBOX_DB token ──────────────────────────────────────────────────────────

describe('OUTBOX_DB', () => {
  it('es un Symbol con descripción "OUTBOX_DB"', () => {
    expect(typeof OUTBOX_DB).toBe('symbol');
    expect(OUTBOX_DB.toString()).toContain('OUTBOX_DB');
  });
});
