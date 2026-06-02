import { describe, expect, it, vi } from 'vitest';
import { NotificationsGateway } from './notifications.gateway';

function createClient({
  authToken,
  cookie,
}: {
  authToken?: string;
  cookie?: string;
} = {}) {
  return {
    id: 'socket-1',
    data: {},
    handshake: {
      auth: authToken ? { token: authToken } : {},
      headers: cookie ? { cookie } : {},
    },
    emit: vi.fn(),
    disconnect: vi.fn(),
  } as any;
}

describe('NotificationsGateway', () => {
  it('desconecta conexiones sin token', async () => {
    const jwtService = { verifyAsync: vi.fn() };
    const gateway = new NotificationsGateway(jwtService as any);
    const client = createClient();

    await gateway.handleConnection(client);

    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
    expect(client.emit).toHaveBeenCalledWith('auth:error', {
      message: 'unauthorized',
    });
    expect(client.disconnect).toHaveBeenCalledWith(true);
  });

  it('acepta conexiones con cookie access_token válida', async () => {
    const payload = { sub: 'user-1', rol: 'COCINA' };
    const jwtService = { verifyAsync: vi.fn().mockResolvedValue(payload) };
    const gateway = new NotificationsGateway(jwtService as any);
    const client = createClient({
      cookie: 'theme=dark; access_token=valid%20token',
    });

    await gateway.handleConnection(client);

    expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid token');
    expect(client.data.user).toEqual(payload);
    expect(client.emit).not.toHaveBeenCalled();
    expect(client.disconnect).not.toHaveBeenCalled();
  });

  it('emite auth:error y desconecta cuando el token es inválido', async () => {
    const jwtService = {
      verifyAsync: vi.fn().mockRejectedValue(new Error('invalid token')),
    };
    const gateway = new NotificationsGateway(jwtService as any);
    const client = createClient({ authToken: 'bad-token' });

    await gateway.handleConnection(client);

    expect(jwtService.verifyAsync).toHaveBeenCalledWith('bad-token');
    expect(client.emit).toHaveBeenCalledWith('auth:error', {
      message: 'unauthorized',
    });
    expect(client.disconnect).toHaveBeenCalledWith(true);
  });
});
