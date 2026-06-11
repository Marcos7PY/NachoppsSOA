/**
 * Seed de usuarios iniciales para desarrollo.
 *
 * Uso: npx ts-node prisma/seed.ts
 * (desde la raíz de apps/servicio-identidad)
 */
import { PrismaClient } from '../src/generated/prisma';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config({ path: join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const SALT_ROUNDS = 10;
// Solo para datos demo locales; en entornos reales definir SEED_DEFAULT_PASSWORD.
const DEFAULT_PASSWORD = process.env.SEED_DEFAULT_PASSWORD ?? 'nachopps123';

const usuarios = [
  { nombre: 'Administrador',  email: 'admin@nachopps.pe',      rol: 'ADMIN' },
  { nombre: 'Mesero Demo',    email: 'mesero@nachopps.pe',      rol: 'MESERO' },
  { nombre: 'Cajero Demo',    email: 'cajero@nachopps.pe',      rol: 'CAJERO' },
  { nombre: 'Cocina Demo',    email: 'cocina@nachopps.pe',      rol: 'COCINA' },
  { nombre: 'Recepción Demo', email: 'recepcion@nachopps.pe',   rol: 'RECEPCION' },
  { nombre: 'Gerencia Demo',  email: 'gerencia@nachopps.pe',    rol: 'GERENCIA' },
];

async function main() {
  console.log('🌱 Sembrando usuarios de desarrollo...\n');

  for (const u of usuarios) {
    const existe = await prisma.usuario.findUnique({ where: { email: u.email } });

    if (existe) {
      console.log(`  ⏭️  ${u.email} ya existe, saltando.`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

    await prisma.usuario.create({
      data: {
        nombre: u.nombre,
        email: u.email,
        password: hashedPassword,
        rol: u.rol,
      },
    });

    console.log(`  ✅ ${u.email} (${u.rol})`);
  }

  console.log('\n🎉 Seed completado. Contraseña para todos: nachopps123');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
