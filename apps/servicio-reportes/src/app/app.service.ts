import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CuentaCerradaPayload } from '@org/contracts';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly prisma: PrismaService) {}

  async registrarVenta(data: CuentaCerradaPayload) {
    this.logger.log(`Registrando venta para cuenta ${data.cuentaId} (Mesa ${data.mesaId}) por total $${data.total}`);

    await this.prisma.ventaDiaria.upsert({
      where: { cuentaId: data.cuentaId },
      create: {
        cuentaId: data.cuentaId,
        mesaId: data.mesaId,
        total: data.total,
        items: data.items ? JSON.parse(JSON.stringify(data.items)) : [],
      },
      update: {
        total: data.total,
        items: data.items ? JSON.parse(JSON.stringify(data.items)) : [],
      },
    });
  }

  async obtenerResumenDiario() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const ventas = await this.prisma.ventaDiaria.findMany({
      where: {
        fecha: {
          gte: hoy,
        },
      },
    });

    const totalIngresos = ventas.reduce((acc: number, v: any) => acc + Number(v.total), 0);

    // 1. Agrupar Ventas por Hora reales del día
    const horasMap = new Map<string, number>();
    // Inicializar horas comunes de almuerzo y cena
    for (let h = 12; h <= 22; h++) {
      horasMap.set(`${String(h).padStart(2, '0')}:00`, 0);
    }
    
    for (const v of ventas) {
      const fechaVenta = new Date(v.fecha);
      const hora = fechaVenta.getHours();
      const horaKey = `${String(hora).padStart(2, '0')}:00`;
      
      horasMap.set(horaKey, (horasMap.get(horaKey) || 0) + Number(v.total));
    }

    const ventasPorHora = Array.from(horasMap.entries()).map(([hora, total]) => ({
      hora,
      total,
    }));

    // 2. Generar Ranking de Productos determinista según ventas reales del día
    const productStats = new Map<string, { nombre: string; cantidad: number; ingresos: number }>();

    for (const v of ventas) {
      if (Array.isArray(v.items)) {
        for (const item of v.items as any[]) {
          const pid = item.productoId;
          if (!pid) continue;
          const current = productStats.get(pid) || { nombre: item.nombre || pid, cantidad: 0, ingresos: 0 };
          current.cantidad += Number(item.cantidad || 0);
          current.ingresos += Number(item.cantidad || 0) * Number(item.precioUnitario || 0);
          productStats.set(pid, current);
        }
      }
    }

    const topProductos = Array.from(productStats.entries())
      .map(([productoId, stats]) => ({
        productoId,
        nombre: stats.nombre,
        cantidad: stats.cantidad,
        ingresos: stats.ingresos,
      }))
      .filter(p => p.cantidad > 0)
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 10);

    return {
      fecha: hoy,
      totalVentas: ventas.length,
      ingresosTotales: totalIngresos,
      ventasPorHora,
      topProductos,
    };
  }

}
