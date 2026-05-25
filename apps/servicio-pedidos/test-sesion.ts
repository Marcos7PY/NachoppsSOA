import { PrismaClient } from './src/generated/prisma';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = 'postgresql://nachopps:secret@localhost:5434/pedidos_db?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const result = await prisma.sesionMesa.findFirst({
    where: { mesaId: '1', estado: 'ABIERTA' },
    include: {
      pedidos: {
        include: { items: { include: { modificadores: true } } },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  console.log('Sesión:', JSON.stringify(result, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
