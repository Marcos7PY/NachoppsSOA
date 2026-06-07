import { describe, expect, it, vi, afterEach } from 'vitest';
import { notifyOutboxFailed } from './outbox-alert';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const WEBHOOK_URL = 'https://hooks.slack.com/services/TEST/WEBHOOK';

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.SLACK_WEBHOOK_URL;
});

// ─── Sin SLACK_WEBHOOK_URL configurado ───────────────────────────────────────

describe('notifyOutboxFailed — sin SLACK_WEBHOOK_URL', () => {
  it('no lanza y no llama fetch cuando SLACK_WEBHOOK_URL no está definida', async () => {
    delete process.env.SLACK_WEBHOOK_URL;
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({} as any);

    await expect(notifyOutboxFailed('servicio-pedidos', 'evt-1', 'pedido.creado', 5)).resolves.toBeUndefined();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

// ─── Con SLACK_WEBHOOK_URL configurado ───────────────────────────────────────

describe('notifyOutboxFailed — con SLACK_WEBHOOK_URL', () => {
  it('llama fetch con la URL del webhook', async () => {
    process.env.SLACK_WEBHOOK_URL = WEBHOOK_URL;
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({} as any);

    await notifyOutboxFailed('servicio-pedidos', 'evt-1', 'pedido.creado', 5);

    expect(fetchSpy).toHaveBeenCalledWith(
      WEBHOOK_URL,
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('envía Content-Type application/json', async () => {
    process.env.SLACK_WEBHOOK_URL = WEBHOOK_URL;
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({} as any);

    await notifyOutboxFailed('servicio-pedidos', 'evt-1', 'pedido.creado', 5);

    const [, init] = fetchSpy.mock.calls[0];
    expect((init as RequestInit).headers).toMatchObject({ 'Content-Type': 'application/json' });
  });

  it('el body contiene el producer, eventId, routingKey y attempts', async () => {
    process.env.SLACK_WEBHOOK_URL = WEBHOOK_URL;
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({} as any);

    await notifyOutboxFailed('servicio-pedidos', 'evt-abc', 'pedido.creado', 3);

    const [, init] = fetchSpy.mock.calls[0];
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.text).toContain('servicio-pedidos');
    expect(body.text).toContain('evt-abc');
    expect(body.text).toContain('pedido.creado');
    expect(body.text).toContain('3');
  });

  it('el body incluye la URL de retry del endpoint', async () => {
    process.env.SLACK_WEBHOOK_URL = WEBHOOK_URL;
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({} as any);

    await notifyOutboxFailed('servicio-pedidos', 'evt-retry', 'pedido.creado', 5);

    const [, init] = fetchSpy.mock.calls[0];
    const body = JSON.parse((init as RequestInit).body as string);
    // El endpoint de retry reemplaza 'servicio-' por '' para el path
    expect(body.text).toContain('pedidos/outbox/evt-retry/retry');
  });

  it('no lanza si fetch falla (fire-and-forget)', async () => {
    process.env.SLACK_WEBHOOK_URL = WEBHOOK_URL;
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network error'));

    await expect(
      notifyOutboxFailed('servicio-pedidos', 'evt-1', 'pedido.creado', 5),
    ).resolves.toBeUndefined();
  });

  it('retorna undefined (fire-and-forget, sin valor de retorno)', async () => {
    process.env.SLACK_WEBHOOK_URL = WEBHOOK_URL;
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({} as any);

    const result = await notifyOutboxFailed('servicio-mesas', 'evt-2', 'mesa.liberada', 2);
    expect(result).toBeUndefined();
  });
});
