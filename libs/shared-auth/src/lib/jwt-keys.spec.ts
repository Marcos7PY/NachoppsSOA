import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { generateKeyPairSync } from 'crypto';
import * as jwt from 'jsonwebtoken';
import {
  getJwtPublicKey,
  getJwtPrivateKey,
  getServiceJwtSecret,
  makeJwtSecretOrKeyProvider,
} from './jwt-keys';

type Resolved = { err: Error | null; key?: string };
function resolveKey(provider: ReturnType<typeof makeJwtSecretOrKeyProvider>, token: string): Promise<Resolved> {
  return new Promise((resolve) => provider(null, token, (err, key) => resolve({ err, key })));
}

describe('jwt-keys (plan 2.1 RS256 usuario / HS256 servicio)', () => {
  let publicKey: string;
  let privateKey: string;
  const serviceSecret = 'service-secret-xyz';
  const envSnapshot = { ...process.env };

  beforeAll(() => {
    const kp = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    publicKey = kp.publicKey;
    privateKey = kp.privateKey;
  });

  afterAll(() => {
    process.env = { ...envSnapshot };
  });

  it('verifica un token de usuario RS256 con la clave pública', async () => {
    const token = jwt.sign({ sub: 'u1', rol: 'ADMIN' }, privateKey, {
      algorithm: 'RS256',
      issuer: 'nachopps-identidad',
    });
    const { err, key } = await resolveKey(makeJwtSecretOrKeyProvider(publicKey, serviceSecret), token);
    expect(err).toBeNull();
    expect(key).toBe(publicKey);
    expect(() => jwt.verify(token, key!, { algorithms: ['RS256'] })).not.toThrow();
  });

  it('verifica un token de servicio HS256 con el secreto de servicio', async () => {
    const token = jwt.sign({ sub: 'servicio-caja', rol: 'SISTEMA' }, serviceSecret, { algorithm: 'HS256' });
    const { err, key } = await resolveKey(makeJwtSecretOrKeyProvider(publicKey, serviceSecret), token);
    expect(err).toBeNull();
    expect(key).toBe(serviceSecret);
    expect(() => jwt.verify(token, key!, { algorithms: ['HS256'] })).not.toThrow();
  });

  it('bloquea el ataque de confusión RS256→HS256 (HS256 firmado con la pública)', async () => {
    const forged = jwt.sign({ sub: 'attacker', rol: 'ADMIN' }, publicKey, { algorithm: 'HS256' });
    const { key } = await resolveKey(makeJwtSecretOrKeyProvider(publicKey, serviceSecret), forged);
    // Devuelve el secreto de servicio, NO la pública → la verificación falla.
    expect(key).toBe(serviceSecret);
    expect(() => jwt.verify(forged, key!, { algorithms: ['HS256'] })).toThrow();
  });

  it('rechaza algoritmos no soportados', async () => {
    const header = Buffer.from(JSON.stringify({ alg: 'ES512', typ: 'JWT' })).toString('base64url');
    const fake = `${header}.${Buffer.from('{}').toString('base64url')}.sig`;
    const { err, key } = await resolveKey(makeJwtSecretOrKeyProvider(publicKey, serviceSecret), fake);
    expect(err).toBeInstanceOf(Error);
    expect(key).toBeUndefined();
  });

  it('normaliza PEM con \\n escapados desde env', () => {
    process.env.JWT_PUBLIC_KEY = publicKey.trim().replace(/\n/g, '\\n');
    const resolved = getJwtPublicKey();
    expect(resolved).toContain('-----BEGIN PUBLIC KEY-----');
    expect(resolved).toContain('\n');
    expect(resolved).not.toContain('\\n');
  });

  it('lanza si faltan las variables de entorno', () => {
    delete process.env.JWT_PRIVATE_KEY;
    expect(() => getJwtPrivateKey()).toThrow(/JWT_PRIVATE_KEY/);
    delete process.env.SERVICE_JWT_SECRET;
    expect(() => getServiceJwtSecret()).toThrow(/SERVICE_JWT_SECRET/);
  });
});
