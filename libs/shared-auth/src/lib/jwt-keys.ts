/**
 * Claves y algoritmos JWT (plan 2.1).
 *
 * Modelo de confianza:
 *  - Tokens de USUARIO (login): **RS256**. Sólo `servicio-identidad` tiene la
 *    clave privada (`JWT_PRIVATE_KEY`). Todos los servicios + Kong verifican con
 *    la pública (`JWT_PUBLIC_KEY`). Filtrar la pública NO permite forjar tokens.
 *  - Tokens de SERVICIO (S2S interno): **HS256** con `SERVICE_JWT_SECRET`. Nunca
 *    pasan por Kong (son llamadas axios servicio→servicio en la red interna). Es
 *    un secreto distinto al de usuario: su fuga no permite forjar tokens de
 *    usuario, sólo tokens de servicio dentro de la red interna.
 *
 * Antes los 9 servicios compartían el mismo `JWT_SECRET` simétrico: filtrarlo en
 * cualquiera permitía forjar tokens para todos. Eso es lo que esto elimina.
 */

/** Las PEM suelen viajar en .env/compose en una línea con `\n` escapados. */
function normalizePem(value: string): string {
  return value.includes('\\n') ? value.replace(/\\n/g, '\n') : value;
}

export function getJwtPublicKey(): string {
  const k = process.env.JWT_PUBLIC_KEY;
  if (!k) throw new Error('JWT_PUBLIC_KEY env variable is required');
  return normalizePem(k);
}

export function getJwtPrivateKey(): string {
  const k = process.env.JWT_PRIVATE_KEY;
  if (!k) throw new Error('JWT_PRIVATE_KEY env variable is required');
  return normalizePem(k);
}

export function getServiceJwtSecret(): string {
  const s = process.env.SERVICE_JWT_SECRET;
  if (!s) throw new Error('SERVICE_JWT_SECRET env variable is required');
  return s;
}

export type JwtKeyDoneFn = (err: Error | null, key?: string) => void;

/**
 * Resuelve la clave de verificación según el `alg` del header del token:
 *  - `RS256` → clave pública (tokens de usuario).
 *  - `HS256` → secreto de servicio (tokens S2S internos).
 *
 * Devolver un secreto DISTINTO para HS256 (no la pública) cierra el ataque de
 * confusión RS256→HS256: un atacante no puede firmar un HS256 usando la clave
 * pública conocida y hacerse pasar por usuario.
 */
export function makeJwtSecretOrKeyProvider(publicKey: string, serviceSecret: string) {
  return (_req: unknown, rawJwtToken: string, done: JwtKeyDoneFn): void => {
    try {
      const headerB64 = String(rawJwtToken).split('.')[0];
      const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8'));
      if (header.alg === 'RS256') return done(null, publicKey);
      if (header.alg === 'HS256') return done(null, serviceSecret);
      return done(new Error(`Algoritmo JWT no soportado: ${header.alg}`));
    } catch (err) {
      return done(err as Error);
    }
  };
}

export const JWT_VERIFY_ALGORITHMS: ReadonlyArray<'RS256' | 'HS256'> = ['RS256', 'HS256'];
