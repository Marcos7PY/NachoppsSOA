import { PrismaClient } from './src/generated/prisma';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = 'postgresql://nachopps:secret@localhost:5434/pedidos_db?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- TEST DE PEDIDO HUÉRFANO ---');
  const mesaId = '1';

  console.log('1. Simulando mesa 1 Ocupada y Pedido ENTREGADO (sesión vieja)');
  const sesionVieja = await prisma.sesionMesa.create({
    data: { mesaId, estado: 'CERRADA', total: 100 }
  });
  
  const pedidoHuerfano = await prisma.pedido.create({
    data: {
      mesaId,
      sesionMesaId: sesionVieja.id,
      estado: 'ENTREGADO', // NO PAGADO!
      total: 100,
      numeroMesa: 1
    }
  });

  console.log(`Pedido huérfano creado: ${pedidoHuerfano.id} (Estado: ENTREGADO) en sesión CERRADA.`);

  console.log('2. Ocupamos de nuevo la mesa y creamos nueva sesión ABIERTA');
  const sesionNueva = await prisma.sesionMesa.create({
    data: { mesaId, estado: 'ABIERTA', total: 0 }
  });

  console.log(`Nueva sesión creada: ${sesionNueva.id}`);

  console.log('3. Frontend llama a PedidosApi.obtenerSesionActiva("1")');
  const result = await prisma.sesionMesa.findFirst({
    where: { mesaId, estado: 'ABIERTA' },
    include: { pedidos: true }
  });

  console.log('Resultado de Sesión Activa:', JSON.stringify(result, null, 2));

  if (result && result.pedidos.length === 0 && Number(result.total) === 0) {
    console.log('✅ ÉXITO: La sesión activa está en S/ 0.00 y no trae el pedido huérfano.');
  } else {
    console.log('❌ FALLO: La sesión activa trajo datos residuales.');
  }

  // Cleanup para no ensuciar BD
  await prisma.pedido.delete({ where: { id: pedidoHuerfano.id } });
  await prisma.sesionMesa.delete({ where: { id: sesionVieja.id } });
  await prisma.sesionMesa.delete({ where: { id: sesionNueva.id } });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
