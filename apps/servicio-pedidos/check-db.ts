import { PrismaClient } from './src/generated/prisma';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = 'postgresql://nachopps:secret@localhost:5434/pedidos_db?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const peds = await prisma.pedido.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log(peds.map(p => ({ id: p.id, sesion: p.sesionMesaId, items: p.items })));
}

main().finally(() => prisma.$disconnect());
