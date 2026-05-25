import { PrismaClient } from './src/generated/prisma';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = 'postgresql://nachopps:secret@localhost:5434/pedidos_db?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando migración de datos hacia SesionMesa...');
  const pedidos = await prisma.pedido.findMany();
  
  if (pedidos.length === 0) {
    console.log('No hay pedidos que migrar.');
    return;
  }

  // Agrupar pedidos por mesa
  const pedidosPorMesa: Record<string, any[]> = {};
  pedidos.forEach(p => {
    if (!pedidosPorMesa[p.mesaId]) pedidosPorMesa[p.mesaId] = [];
    pedidosPorMesa[p.mesaId].push(p);
  });

  let migradas = 0;

  for (const mesaId of Object.keys(pedidosPorMesa)) {
    const pedidosMesa = pedidosPorMesa[mesaId];
    
    // Los pedidos PAGADOS irán a sesiones CERRADAS, los NO PAGADOS irán a una sesión ABIERTA.
    const pagados = pedidosMesa.filter(p => p.estado === 'PAGADO');
    const activos = pedidosMesa.filter(p => p.estado !== 'PAGADO');

    // 1. Crear sesiones CERRADAS por cada pedido pagado (o agruparlos por día, pero para simplificar, una sesión legacy)
    if (pagados.length > 0) {
      const sesionLegacy = await prisma.sesionMesa.create({
        data: {
          mesaId,
          estado: 'CERRADA',
          fechaApertura: pagados[0].createdAt,
          fechaCierre: new Date(),
          total: pagados.reduce((sum, p) => sum + Number(p.total), 0)
        }
      });
      await prisma.pedido.updateMany({
        where: { id: { in: pagados.map(p => p.id) } },
        data: { sesionMesaId: sesionLegacy.id }
      });
      migradas += pagados.length;
    }

    // 2. Crear una única sesión ABIERTA para los pedidos activos de la mesa
    if (activos.length > 0) {
      const sesionActiva = await prisma.sesionMesa.create({
        data: {
          mesaId,
          estado: 'ABIERTA',
          fechaApertura: activos[0].createdAt,
          total: activos.reduce((sum, p) => sum + Number(p.total), 0)
        }
      });
      await prisma.pedido.updateMany({
        where: { id: { in: activos.map(p => p.id) } },
        data: { sesionMesaId: sesionActiva.id }
      });
      migradas += activos.length;
    }
  }

  console.log(`Migración exitosa. Pedidos vinculados a sesiones: ${migradas}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
