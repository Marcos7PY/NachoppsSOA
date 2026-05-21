import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitMQPublisherService } from '@org/shared-rabbitmq';
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
} from '@org/contracts';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly PEDIDOS_URL = 'http://localhost:3004/api'; // En un entorno real, usar config o service discovery

  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitmq: RabbitMQPublisherService
  ) {}

  async abrirCuenta(command: AbrirCuentaCommand): Promise<{ message: string; cuenta: CuentaDto }> {
    // Validar si la mesa ya tiene una cuenta abierta
    const cuentaExistente = await this.prisma.cuenta.findFirst({
      where: { mesaId: command.mesaId, estado: CuentaEstado.Abierta }
    });

    if (cuentaExistente) {
      throw new BadRequestException('La mesa ya tiene una cuenta abierta.');
    }

    const cuenta = await this.prisma.cuenta.create({
      data: {
        mesaId: command.mesaId,
        estado: CuentaEstado.Abierta,
        pedidos: [],
        total: 0
      }
    });

    this.logger.log(`Cuenta abierta para la mesa ${command.mesaId}`);
    return { message: 'Cuenta abierta exitosamente', cuenta: this.mapToDto(cuenta) };
  }

  async obtenerCuenta(id: string): Promise<CuentaDto> {
    const cuenta = await this.prisma.cuenta.findUnique({ where: { id } });
    if (!cuenta) {
      throw new NotFoundException(`Cuenta con ID ${id} no encontrada`);
    }

    if (cuenta.estado === CuentaEstado.Abierta) {
      // Si está abierta, sincronizar con los pedidos actuales
      const pedidos = await this.fetchPedidosDeMesa(cuenta.mesaId);
      const total = pedidos.reduce((acc, p) => acc + (p.total || 0), 0);
      cuenta.pedidos = pedidos;
      cuenta.total = total;
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

    const pedidos = await this.fetchPedidosDeMesa(cuenta.mesaId);
    
    // Validar que no haya pedidos pendientes o en preparación
    const pedidosIncompletos = pedidos.filter(p => p.estado === 'PENDIENTE' || p.estado === 'EN_PREPARACION');
    if (pedidosIncompletos.length > 0) {
      throw new BadRequestException('No se puede cerrar la cuenta. Hay pedidos pendientes o en preparación.');
    }

    if (pedidos.length === 0) {
      throw new BadRequestException('La cuenta no tiene pedidos.');
    }

    const subtotal = pedidos.reduce((acc, p) => acc + (p.total || 0), 0);
    const descuento = command.descuento || 0;
    const total = Math.max(0, subtotal - descuento);
    const ticketId = uuidv4();

    // Actualizar cuenta en BD
    const cuentaCerrada = await this.prisma.cuenta.update({
      where: { id },
      data: {
        estado: CuentaEstado.Cerrada,
        pedidos: pedidos as any, // Snapshot
        total,
        ticket: ticketId,
      }
    });

    const ticket: TicketDto = {
      id: ticketId,
      cuentaId: id,
      mesaId: cuenta.mesaId,
      items: pedidos.flatMap(p => p.items),
      subtotal,
      descuento,
      total,
      fecha: new Date().toISOString()
    };

    // Publicar Eventos Asíncronos
    const cuentaCerradaPayload: CuentaCerradaPayload = {
      cuentaId: id,
      mesaId: cuenta.mesaId,
      total,
    };
    await this.rabbitmq.publish(RoutingKeys.CuentaCerrada, cuentaCerradaPayload, 'servicio-cuentas');
    
    const ticketGeneradoPayload: TicketGeneradoPayload = {
      ticketId,
      cuentaId: id,
    };
    await this.rabbitmq.publish(RoutingKeys.TicketGenerado, ticketGeneradoPayload, 'servicio-cuentas');

    this.logger.log(`Cuenta ${id} cerrada. Ticket ${ticketId} generado. Total: S/ ${total}`);

    return { message: 'Cuenta cerrada exitosamente', ticket };
  }

  async dividirCuenta(id: string, command: DividirCuentaCommand): Promise<any> {
    const cuenta = await this.obtenerCuenta(id); // Usa el método que sincroniza pedidos si está abierta
    const pedidos = cuenta.pedidos;

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
      const allItems = pedidos.flatMap(p => p.items);
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

  private async fetchPedidosDeMesa(mesaId: string): Promise<any[]> {
    try {
      const res = await axios.get(`${this.PEDIDOS_URL}/pedidos?mesaId=${mesaId}`);
      return res.data.pedidos || [];
    } catch (error) {
      this.logger.error(`Error al obtener pedidos de la mesa ${mesaId}`, error);
      return [];
    }
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
