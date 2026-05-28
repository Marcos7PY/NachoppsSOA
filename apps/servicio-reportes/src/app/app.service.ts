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
      },
      update: {
        total: data.total,
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

    return {
      fecha: hoy,
      totalVentas: ventas.length,
      ingresosTotales: totalIngresos,
    };
  }
}
