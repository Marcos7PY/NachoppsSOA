import { Injectable, NotFoundException, BadRequestException, ServiceUnavailableException, Logger } from '@nestjs/common';
import { ServiceTokenService } from '@org/shared-auth';
import { PrismaService } from '../prisma/prisma.service';
import { PagarPedidoCommand, TransaccionDto, RoutingKeys, PagoRegistradoPayload } from '@org/contracts';
import { CircuitBreakerOptions } from '@org/resiliencia';
import axios from 'axios';

interface CuentaRemota {
  id: string;
  mesaId: string;
  total: number;
  estado: string;
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly CUENTAS_URL =
    process.env['CUENTAS_SERVICE_URL'] ?? 'http://servicio-cuentas:3000/api';
  private readonly HTTP_TIMEOUT_MS = 5000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly serviceTokenService: ServiceTokenService,
  ) {}

  private getServiceToken(): string {
    return this.serviceTokenService.generateServiceToken('servicio-caja');
  }

  @CircuitBreakerOptions({ timeout: 5000, errorThresholdPercentage: 50, resetTimeout: 30000 })
  private async fetchCuenta(cuentaId: string): Promise<CuentaRemota> {
    const res = await axios.get<CuentaRemota>(`${this.CUENTAS_URL}/${cuentaId}`, {
      timeout: this.HTTP_TIMEOUT_MS,
      headers: { Authorization: `Bearer ${this.getServiceToken()}` },
    });
    return res.data;
  }

  async registrarPago(command: PagarPedidoCommand): Promise<{ message?: string; transaccion: TransaccionDto }> {
    const transaccion = await this.prisma.$transaction(async (prisma) => {
      await prisma.$executeRaw`SELECT pg_advisory_xact_lock(1234, ('x' || substr(md5(${command.cuentaId}), 1, 8))::bit(32)::int)`;

      let cuenta = await prisma.cuentaAbierta.findUnique({
        where: { cuentaId: command.cuentaId },
      });

      let cuentaRemota: CuentaRemota;
      try {
        cuentaRemota = await this.fetchCuenta(command.cuentaId);
      } catch (error: unknown) {
        const axiosError = error as { response?: { status: number }; code?: string };
        if (axiosError.response?.status === 404) {
          throw new NotFoundException(`Cuenta ${command.cuentaId} no encontrada.`);
        }
        throw new ServiceUnavailableException('No se pudo obtener la cuenta. Reintente.');
      }

      cuenta = await prisma.cuentaAbierta.upsert({
        where: { cuentaId: command.cuentaId },
        create: {
          cuentaId: cuentaRemota.id,
          mesaId: cuentaRemota.mesaId,
          total: cuentaRemota.total,
          estado: cuentaRemota.estado,
        },
        update: {
          total: cuentaRemota.total,
          estado: cuentaRemota.estado,
        },
      });

      if (cuenta.estado !== 'ABIERTA') {
        throw new BadRequestException(`La cuenta ya está ${cuenta.estado.toLowerCase()}.`);
      }

      const pagosPrevios = await prisma.transaccion.aggregate({
        where: { cuentaId: command.cuentaId },
        _sum: { monto: true }
      });
      const montoTotalPagado = Number(pagosPrevios._sum.monto || 0);

      if (montoTotalPagado + command.montoRecibido > Number(cuenta.total)) {
        throw new BadRequestException(
          `Pago duplicado o excedente. Total de cuenta: ${cuenta.total}, Ya pagado: ${montoTotalPagado}, Intentando pagar: ${command.montoRecibido}.`
        );
      }

      if (montoTotalPagado + command.montoRecibido < Number(cuenta.total)) {
        throw new BadRequestException(
          `Pago insuficiente. Total de cuenta: ${cuenta.total}, Ya pagado: ${montoTotalPagado}, Intentando pagar: ${command.montoRecibido}. Faltan: ${Number(cuenta.total) - (montoTotalPagado + command.montoRecibido)}.`
        );
      }

      const tx = await prisma.transaccion.create({
        data: {
          cuentaId: command.cuentaId,
          monto: command.montoRecibido,
          metodo: command.metodo,
        }
      });

      const payload: PagoRegistradoPayload = {
        transaccionId: tx.id,
        cuentaId: command.cuentaId,
        mesaId: cuenta.mesaId,
        monto: command.montoRecibido,
        metodo: command.metodo,
      };

      await prisma.outboxEvent.create({
        data: {
          routingKey: RoutingKeys.PagoRegistrado,
          payload: JSON.stringify(payload),
          status: 'PENDING',
        }
      });

      return tx;
    });

    const transaccionDto: TransaccionDto = {
      id: transaccion.id,
      cuentaId: transaccion.cuentaId,
      monto: Number(transaccion.monto),
      metodo: transaccion.metodo,
      referencia: transaccion.referencia || undefined,
      notas: transaccion.notas || undefined,
      createdAt: transaccion.createdAt.toISOString()
    };

    this.logger.log(`Pago registrado para cuenta ${command.cuentaId}`);
    return { message: 'Pago registrado y evento encolado', transaccion: transaccionDto };
  }

  async listarTransacciones(): Promise<TransaccionDto[]> {
    const data = await this.prisma.transaccion.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return data.map(t => ({
      id: t.id,
      cuentaId: t.cuentaId,
      monto: Number(t.monto),
      metodo: t.metodo,
      referencia: t.referencia || undefined,
      notas: t.notas || undefined,
      createdAt: t.createdAt.toISOString()
    }));
  }
}
