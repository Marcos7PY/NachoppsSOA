import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateKeyPairSync } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const secretsDir = path.join(root, 'infra', 'secrets');
const target = path.join(secretsDir, 'jwt-dev.env');

fs.mkdirSync(secretsDir, { recursive: true });

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

const esc = (pem) => pem.trim().replace(/\n/g, '\\n');
const publicEscaped = esc(publicKey);

fs.writeFileSync(
  target,
  [
    `JWT_PRIVATE_KEY=${esc(privateKey)}`,
    `JWT_PUBLIC_KEY=${publicEscaped}`,
    `KONG_JWT_PUBLIC_KEY=${publicEscaped}`,
  ].join('\n') + '\n',
);

console.error(`Claves JWT dev escritas en ${path.relative(root, target)}`);
