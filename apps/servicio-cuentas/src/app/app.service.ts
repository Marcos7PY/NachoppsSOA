import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CuentaDto,
  TicketDto,
  AbrirCuentaCommand,
  CerrarCuentaCommand,
  DividirCuentaCommand,
  CuentaEstado,
  RoutingKeys,
  CuentaCerradaPayload,
  TicketGeneradoPayload,
  DomainEventEnvelope,
  PagoRegistradoPayload,
} from '@org/contracts';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async listarCuentas(): Promise<{ cuentas: CuentaDto[] }> {
    const cuentas = await this.prisma.cuenta.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return {
      cuentas: cuentas.map(c => ({
        id: c.id,
        mesaId: c.mesaId,
        pedidos: c.pedidos as any[],
        total: Number(c.total),
        estado: c.estado as CuentaEstado,
        ticket: c.ticket,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      }))
    };
  }

  async abrirCuenta(command: AbrirCuentaCommand, origen: 'manual' | 'fallback' = 'manual'): Promise<{ message: string; cuenta: CuentaDto }> {
    const cuentaExistente = await this.prisma.cuenta.findFirst({
      where: { mesaId: command.mesaId, estado: CuentaEstado.Abierta }
    });

    if (cuentaExistente) {
      if (origen === 'fallback') {
        return { message: 'Cuenta ya existe.', cuenta: this.mapToDto(cuentaExistente) };
      }
      throw new BadRequestException('La mesa ya tiene una cuenta abierta.');
    }

    const cuenta = await this.prisma.$transaction(async (prisma) => {
      const c = await prisma.cuenta.create({
        data: {
          mesaId: command.mesaId,
          estado: CuentaEstado.Abierta,
          pedidos: [],
          total: 0
        }
      });

      await prisma.outboxEvent.create({
        data: {
          routingKey: RoutingKeys.CuentaAbierta,
          payload: JSON.stringify({
            cuentaId: c.id,
            mesaId: c.mesaId,
            origen,
          }),
          status: 'PENDING',
        }
      });

      return c;
    });

    this.logger.log(`Cuenta abierta para la mesa ${command.mesaId} (origen: ${origen})`);
    return { message: 'Cuenta abierta exitosamente', cuenta: this.mapToDto(cuenta) };
  }

  async procesarPedidoCreado(envelope: DomainEventEnvelope<any>): Promise<void> {
    const payload = envelope.data ?? envelope;
    const pedidoDto = payload.pedido;
    if (!pedidoDto || !pedidoDto.mesaId) {
      this.logger.warn('PedidoCreado sin mesaId — ignorado');
      return;
    }

    let cuenta = await this.prisma.cuenta.findFirst({
      where: { mesaId: pedidoDto.mesaId, estado: CuentaEstado.Abierta }
    });

    if (!cuenta) {
      const resultado = await this.abrirCuenta({ mesaId: pedidoDto.mesaId }, 'fallback');
      cuenta = await this.prisma.cuenta.findUnique({ where: { id: resultado.cuenta.id } });
    }
    if (!cuenta) return;

    const snapshotActual = Array.isArray(cuenta.pedidos) ? cuenta.pedidos : [];
    snapshotActual.push(pedidoDto);

    await this.prisma.cuenta.update({
      where: { id: cuenta.id },
      data: {
        total: { increment: pedidoDto.total },
        pedidos: snapshotActual as any
      },
    });
    this.logger.log(`Añadido pedido ${pedidoDto.id} a la cuenta ${cuenta.id}`);
  }

  async procesarPedidoActualizado(envelope: DomainEventEnvelope<any>): Promise<void> {
    const payload = envelope.data ?? envelope;
    const pedidoDto = payload.pedido;
    if (!pedidoDto || !pedidoDto.mesaId) return;

    const cuenta = await this.prisma.cuenta.findFirst({
      where: { mesaId: pedidoDto.mesaId, estado: CuentaEstado.Abierta }
    });
    if (!cuenta) return;

    const snapshotActual = Array.isArray(cuenta.pedidos) ? cuenta.pedidos : [];
    const index = snapshotActual.findIndex((p: any) => p.id === pedidoDto.id);
    
    let deltaTotal = 0;
    if (index >= 0) {
      deltaTotal = pedidoDto.total - ((snapshotActual[index] as any).total || 0);
      snapshotActual[index] = pedidoDto;
    } else {
      deltaTotal = pedidoDto.total;
      snapshotActual.push(pedidoDto);
    }

    await this.prisma.cuenta.update({
      where: { id: cuenta.id },
      data: {
        total: { increment: deltaTotal },
        pedidos: snapshotActual as any
      },
    });
    this.logger.log(`Snapshot de pedido ${pedidoDto.id} actualizado en cuenta ${cuenta.id}`);
  }

  async procesarPagoRegistrado(envelope: DomainEventEnvelope<PagoRegistradoPayload>): Promise<void> {
    const payload = envelope.data ?? (envelope as unknown as PagoRegistradoPayload);

    const cuenta = await this.prisma.cuenta.findUnique({
      where: { id: payload.cuentaId },
    });

    if (!cuenta) {
      this.logger.warn(`Cuenta ${payload.cuentaId} no encontrada — ignorado`);
      return;
    }

    if (cuenta.estado !== CuentaEstado.Abierta) {
      this.logger.warn(
        `Cuenta ${payload.cuentaId} ya está ${cuenta.estado} — ignorado`
      );
      return;
    }

    await this.cerrarCuenta(cuenta.id, {});
    this.logger.log(
      `Cuenta ${cuenta.id} cerrada automáticamente por PagoRegistrado`
    );
  }

  async obtenerCuenta(id: string): Promise<CuentaDto> {
    const cuenta = await this.prisma.cuenta.findUnique({ where: { id } });
    if (!cuenta) {
      throw new NotFoundException(`Cuenta con ID ${id} no encontrada`);
    }

    return this.mapToDto(cuenta);
  }

  async obtenerCuentaPorMesa(mesaId: string): Promise<CuentaDto> {
    const cuenta = await this.prisma.cuenta.findFirst({
      where: { mesaId, estado: CuentaEstado.Abierta }
    });
    if (!cuenta) {
      throw new NotFoundException(`No hay cuenta abierta para la mesa ${mesaId}`);
    }
    return this.obtenerCuenta(cuenta.id);
  }

  async cerrarCuenta(id: string, command: CerrarCuentaCommand): Promise<{ message: string; ticket: TicketDto }> {
    const cuenta = await this.prisma.cuenta.findUnique({ where: { id } });
    if (!cuenta) {
      throw new NotFoundException(`Cuenta con ID ${id} no encontrada`);
    }

    if (cuenta.estado !== CuentaEstado.Abierta) {
      throw new BadRequestException(`La cuenta no está abierta. Estado actual: ${cuenta.estado}`);
    }

    const pedidos = Array.isArray(cuenta.pedidos) ? cuenta.pedidos : [];

    if (pedidos.length === 0) {
      throw new BadRequestException('La cuenta no tiene pedidos.');
    }

    const subtotal = Number(cuenta.total);
    const descuento = command.descuento || 0;
    const total = Math.max(0, subtotal - descuento);
    const ticketId = uuidv4();

    const cuentaCerradaPayload: CuentaCerradaPayload = {
      cuentaId: id,
      mesaId: cuenta.mesaId,
      total,
    };
    
    const ticketGeneradoPayload: TicketGeneradoPayload = {
      ticketId,
      cuentaId: id,
    };

    await this.prisma.$transaction(async (prisma) => {
      await prisma.cuenta.update({
        where: { id },
        data: {
          estado: CuentaEstado.Cerrada,
          total,
          ticket: ticketId,
        }
      });

      await prisma.outboxEvent.createMany({
        data: [
          {
            routingKey: RoutingKeys.CuentaCerrada,
            payload: JSON.stringify(cuentaCerradaPayload),
            status: 'PENDING',
          },
          {
            routingKey: RoutingKeys.TicketGenerado,
            payload: JSON.stringify(ticketGeneradoPayload),
            status: 'PENDING',
          }
        ]
      });
    });

    const ticket: TicketDto = {
      id: ticketId,
      cuentaId: id,
      mesaId: cuenta.mesaId,
      items: pedidos.flatMap((p: any) => p.items || []),
      subtotal,
      descuento,
      total,
      fecha: new Date().toISOString()
    };

    this.logger.log(`Cuenta ${id} cerrada. Ticket ${ticketId} generado. Total: S/ ${total}`);

    return { message: 'Cuenta cerrada exitosamente', ticket };
  }

  async dividirCuenta(id: string, command: DividirCuentaCommand): Promise<any> {
    const cuenta = await this.obtenerCuenta(id);
    const pedidos = Array.isArray(cuenta.pedidos) ? cuenta.pedidos : [];

    if (!pedidos || pedidos.length === 0) {
      throw new BadRequestException('La cuenta no tiene pedidos para dividir.');
    }

    if (command.metodo === 'IGUALES') {
      const numPartes = command.numPartes || 1;
      const montoPorParte = cuenta.total / numPartes;
      return {
        metodo: 'IGUALES',
        partes: Array(numPartes).fill(0).map((_, i) => ({
          parte: i + 1,
          monto: montoPorParte
        }))
      };
    }

    if (command.metodo === 'POR_ITEMS') {
      const partes: Record<number, number> = {};
      const allItems = pedidos.flatMap((p: any) => p.items || []);
      allItems.forEach(item => {
        const comensal = item.comensal || 1;
        const subtotal = Number(item.precioUnitario) * item.cantidad;
        partes[comensal] = (partes[comensal] || 0) + subtotal;
      });

      return {
        metodo: 'POR_ITEMS',
        partes: Object.entries(partes).map(([comensal, monto]) => ({
          comensal: Number(comensal),
          monto
        }))
      };
    }

    throw new BadRequestException('Método de división no soportado');
  }

  private mapToDto(c: any): CuentaDto {
    return {
      id: c.id,
      mesaId: c.mesaId,
      pedidos: typeof c.pedidos === 'string' ? JSON.parse(c.pedidos) : c.pedidos,
      total: Number(c.total),
      estado: c.estado as CuentaEstado,
      ticket: c.ticket,
      createdAt: c.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: c.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }
}
