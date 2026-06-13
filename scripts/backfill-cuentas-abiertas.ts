/**
 * Backfill one-off: recalcula totales de cuentas ABIERTA excluyendo pedidos no cobrables.
 *
 * Uso:
 *   DATABASE_URL=postgresql://... npx tsx scripts/backfill-cuentas-abiertas.ts
 *
 * No es una migracion de schema. Ejecutar manualmente tras desplegar la regla
 * que excluye CANCELADO y RECHAZADO_SIN_STOCK del total cobrable.
 */

import { PrismaClient, Prisma } from '../apps/servicio-cuentas/src/generated/prisma';
import { PedidoEstado } from '@org/contracts';

const ESTADOS_NO_COBRABLES = new Set<string>([
  PedidoEstado.Cancelado,
  PedidoEstado.RechazadoSinStock,
]);

function pedidosArray(value: Prisma.JsonValue): Array<{ id?: string; estado?: string; total?: unknown }> {
  return Array.isArray(value) ? value as Array<{ id?: string; estado?: string; total?: unknown }> : [];
}

function totalCobrable(pedidos: Array<{ estado?: string; total?: unknown }>): Prisma.Decimal {
  return pedidos
    .filter((pedido) => !ESTADOS_NO_COBRABLES.has(String(pedido.estado ?? '')))
    .reduce(
      (acc, pedido) => acc.plus(new Prisma.Decimal(String(pedido.total ?? 0))),
      new Prisma.Decimal(0),
    );
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const cuentas = await prisma.cuenta.findMany({
      where: { estado: 'ABIERTA' },
      orderBy: { createdAt: 'asc' },
    });

    let ajustadas = 0;
    for (const cuenta of cuentas) {
      const total = totalCobrable(pedidosArray(cuenta.pedidos));
      const actual = new Prisma.Decimal(cuenta.total);
      if (actual.equals(total)) continue;

      await prisma.cuenta.update({
        where: { id: cuenta.id },
        data: { total },
      });
      ajustadas += 1;
      console.log(
        `[backfill] cuenta=${cuenta.id} mesa=${cuenta.mesaId} total ${actual.toFixed(2)} -> ${total.toFixed(2)}`,
      );
    }

    console.log(`[backfill] cuentas abiertas revisadas=${cuentas.length} ajustadas=${ajustadas}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('[backfill] fallo:', error);
  process.exit(1);
});
