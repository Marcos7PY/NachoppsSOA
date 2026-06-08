import { describe, expect, it, beforeAll, vi } from 'vitest';
import { generateKeyPairSync } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { NotificationsGateway } from './notifications.gateway';

// ── Claves de prueba (mismo modelo que producción) ──────────────────────────
// RS256: par de claves; el privado firma tokens de USUARIO, el público verifica.
// HS256: secreto simétrico para tokens de SERVICIO (S2S).
const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});
const SERVICE_SECRET = 'test-service-secret';

beforeAll(() => {
  process.env.JWT_PUBLIC_KEY = publicKey;
  process.env.SERVICE_JWT_SECRET = SERVICE_SECRET;
});

function userToken(payload: Record<string, unknown> = { sub: 'user-1', rol: 'COCINA' }) {
  return jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '5m' });
}

function serviceToken() {
  return jwt.sign({ sub: 'servicio-x', rol: 'SISTEMA' }, SERVICE_SECRET, {
    algorithm: 'HS256',
    expiresIn: '5m',
  });
}

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
  // JwtService REAL (no mock): el módulo solo firma HS256, pero el gateway pasa
  // la clave/algoritmo por llamada. Así el test ejerce la verificación de verdad.
  const gateway = new NotificationsGateway(new JwtService({}));

  it('desconecta conexiones sin token', async () => {
    const client = createClient();

    await gateway.handleConnection(client);

    expect(client.emit).toHaveBeenCalledWith('auth:error', { message: 'unauthorized' });
    expect(client.disconnect).toHaveBeenCalledWith(true);
  });

  it('acepta un token de USUARIO RS256 válido por cookie access_token', async () => {
    const client = createClient({
      cookie: `theme=dark; access_token=${encodeURIComponent(userToken())}`,
    });

    await gateway.handleConnection(client);

    expect(client.data.user).toMatchObject({ sub: 'user-1', rol: 'COCINA' });
    expect(client.emit).not.toHaveBeenCalled();
    expect(client.disconnect).not.toHaveBeenCalled();
  });

  it('acepta un token de SERVICIO HS256 válido por handshake.auth', async () => {
    const client = createClient({ authToken: serviceToken() });

    await gateway.handleConnection(client);

    expect(client.data.user).toMatchObject({ sub: 'servicio-x', rol: 'SISTEMA' });
    expect(client.disconnect).not.toHaveBeenCalled();
  });

  it('rechaza un RS256 firmado con otra clave', async () => {
    const { privateKey: otherKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      publicKeyEncoding: { type: 'spki', format: 'pem' },
    });
    const forged = jwt.sign({ sub: 'evil' }, otherKey, { algorithm: 'RS256' });
    const client = createClient({ authToken: forged });

    await gateway.handleConnection(client);

    expect(client.emit).toHaveBeenCalledWith('auth:error', { message: 'unauthorized' });
    expect(client.disconnect).toHaveBeenCalledWith(true);
  });

  it('rechaza el ataque de confusión: HS256 firmado con la clave pública', async () => {
    // Un atacante con la clave pública (no secreta) intenta firmar un HS256.
    // Restringir el algoritmo por rama lo impide.
    const forged = jwt.sign({ sub: 'evil', rol: 'ADMIN' }, publicKey, { algorithm: 'HS256' });
    const client = createClient({ authToken: forged });

    await gateway.handleConnection(client);

    expect(client.emit).toHaveBeenCalledWith('auth:error', { message: 'unauthorized' });
    expect(client.disconnect).toHaveBeenCalledWith(true);
  });

  it('rechaza tokens malformados', async () => {
    const client = createClient({ authToken: 'no-es-un-jwt' });

    await gateway.handleConnection(client);

    expect(client.emit).toHaveBeenCalledWith('auth:error', { message: 'unauthorized' });
    expect(client.disconnect).toHaveBeenCalledWith(true);
  });
});
