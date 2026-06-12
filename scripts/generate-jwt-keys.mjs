// Genera un par de claves RSA para los JWT de usuario (RS256, plan 2.1).
//
//   node scripts/generate-jwt-keys.mjs
//
// Imprime las claves en una línea con `\n` escapados, listas para pegar en un
// gestor de secretos o en variables de entorno (JWT_PRIVATE_KEY / JWT_PUBLIC_KEY
// / KONG_JWT_PUBLIC_KEY). La privada vive SOLO en servicio-identidad; la pública
// va a todos los servicios y a Kong. Para rotar: generar par nuevo, desplegar la
// pública en todos primero, luego la privada en identidad.
import { generateKeyPairSync } from 'crypto';
import fs from 'fs';

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

const esc = (pem) => pem.trim().replace(/\n/g, '\\n');

const out = {
  JWT_PRIVATE_KEY: esc(privateKey),
  JWT_PUBLIC_KEY: esc(publicKey),
  KONG_JWT_PUBLIC_KEY: esc(publicKey),
};

const target = process.argv[2];
if (target) {
  fs.writeFileSync(target, Object.entries(out).map(([k, v]) => `${k}=${v}`).join('\n') + '\n');
  console.error(`Escrito ${target}`);
} else {
  for (const [k, v] of Object.entries(out)) console.log(`${k}=${v}`);
}
