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
  PedidoActualizadoPayload,
  PedidoCreadoPayload,
  PagoRegistradoPayload,
  PedidoSnapshot,
  PedidoSnapshotItem,
  PedidoEstado,
} from '@org/contracts';
import { Prisma } from '../generated/prisma';
import { v4 as uuidv4 } from 'uuid';

const ESTADOS_NO_COBRABLES = new Set<PedidoEstado>([
  PedidoEstado.Cancelado,
  PedidoEstado.RechazadoSinStock,
]);

type CuentaRecord = {
  id: string;
  mesaId: string;
  pedidos: unknown;
  total: Prisma.Decimal | number | string;
  estado: CuentaEstado;
  ticket?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type DivisionCuentaResult =
  | { metodo: 'IGUALES'; partes: { parte: number; monto: number }[] }
  | { metodo: 'POR_ITEMS'; partes: { comensal: number; monto: number }[] };

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
        pedidos: this.parsePedidosSnapshot(c.pedidos),
        total: Number(c.total),
        estado: c.estado,
        ticket: c.ticket,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      }))
    };
  }

  async abrirCuenta(command: AbrirCuentaCommand, origen: 'manual' | 'fallback' = 'manual'): Promise<{ message: string; cuenta: CuentaDto }> {
    const cuenta = await this.prisma.$transaction(async (prisma) => {
      await prisma.$executeRaw`SELECT pg_advisory_xact_lock(1234, ('x' || substr(md5(${command.mesaId}), 1, 8))::bit(32)::int)`;
      const cuentaExistente = await prisma.cuenta.findFirst({
        where: { mesaId: command.mesaId, estado: CuentaEstado.Abierta }
      });

      if (cuentaExistente) {
        if (origen === 'fallback') return cuentaExistente;
        throw new BadRequestException('La mesa ya tiene una cuenta abierta.');
      }

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

  // A2+M5: idempotencia + advisory lock + recompute Decimal
  async procesarPedidoCreado(payload: PedidoCreadoPayload): Promise<void> {
    const pedidoDto = payload.pedido;
    if (!pedidoDto?.mesaId || !pedidoDto.id) {
      this.logger.warn('PedidoCreado sin mesaId/id — ignorado');
      return;
    }

    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.idempotencyKey.create({ data: { key: `pedido.creado:${pedidoDto.id}` } });
      // M5: advisory lock por mesa (serializa pedidos concurrentes a la misma cuenta)
      // classid 1234 compartido entre servicios A PROPOSITO: cada servicio tiene su propia BD (database-per-service), el espacio de locks no se cruza.
      await prisma.$executeRaw`SELECT pg_advisory_xact_lock(1234, ('x' || substr(md5(${pedidoDto.mesaId}), 1, 8))::bit(32)::int)`;

      let cuenta = await prisma.cuenta.findFirst({
        where: { mesaId: pedidoDto.mesaId, estado: CuentaEstado.Abierta },
      });

      const origenCuentaAbierta = cuenta ? 'reconciliacion-pedido' : 'fallback';

      // Fallback INLINE (misma tx): crea cuenta + reemite CuentaAbierta
      cuenta ??= await prisma.cuenta.create({
        data: { mesaId: pedidoDto.mesaId, estado: CuentaEstado.Abierta, pedidos: [], total: 0 },
      });

      await prisma.outboxEvent.create({
        data: {
          routingKey: RoutingKeys.CuentaAbierta,
          payload: JSON.stringify({
            cuentaId: cuenta.id,
            mesaId: cuenta.mesaId,
            origen: origenCuentaAbierta,
          }),
          status: 'PENDING',
        },
      });

      const snapshot = this.parsePedidosSnapshot(cuenta.pedidos);

      // A2: dedup por pedido.id — una reentrega no duplica el cobro
      if (snapshot.some((p) => p.id === pedidoDto.id)) {
        this.logger.warn(`Pedido ${pedidoDto.id} ya está en la cuenta ${cuenta.id} — ignorado (idempotente)`);
        return;
      }

      snapshot.push(pedidoDto);

      // A3: recompute del total desde el array, con Decimal (no increment ciego)
      const total = snapshot
        .filter((p) => !ESTADOS_NO_COBRABLES.has(p.estado))
        .reduce(
        (acc: Prisma.Decimal, p) => acc.plus(new Prisma.Decimal(p.total ?? 0)),
        new Prisma.Decimal(0),
      );

      await prisma.cuenta.update({
        where: { id: cuenta.id },
        data: { total, pedidos: snapshot },
      });
      });
    } catch (e: unknown) {
      if ((e as { code?: string })?.code === 'P2002') {
        this.logger.warn(`PedidoCreado ${pedidoDto.id} ya procesado — idempotente`);
        return;
      }
      throw e;
    }

    this.logger.log(`Pedido ${pedidoDto.id} consolidado en cuenta de mesa ${pedidoDto.mesaId}`);
  }

  // A2+M5: idempotencia + advisory lock + recompute Decimal para actualizaciones
  async procesarPedidoActualizado(payload: PedidoActualizadoPayload): Promise<void> {
    const pedidoDto = payload.pedido;
    if (!pedidoDto?.mesaId) return;

    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.idempotencyKey.create({ data: { key: `pedido.actualizado:${pedidoDto.id}:${pedidoDto.estado}` } });
        // M5: advisory lock por mesa
      // classid 1234 compartido entre servicios A PROPOSITO: cada servicio tiene su propia BD (database-per-service), el espacio de locks no se cruza.
      await prisma.$executeRaw`SELECT pg_advisory_xact_lock(1234, ('x' || substr(md5(${pedidoDto.mesaId}), 1, 8))::bit(32)::int)`;

      const cuenta = await prisma.cuenta.findFirst({
        where: { mesaId: pedidoDto.mesaId, estado: CuentaEstado.Abierta },
      });
      if (!cuenta) return;

      const snapshot = this.parsePedidosSnapshot(cuenta.pedidos);
      const index = snapshot.findIndex((p) => p.id === pedidoDto.id);

      if (index >= 0) {
        snapshot[index] = pedidoDto;
      } else {
        snapshot.push(pedidoDto);
      }

      // A3: recompute total con Decimal desde el snapshot actualizado
      const total = snapshot
        .filter((p) => !ESTADOS_NO_COBRABLES.has(p.estado))
        .reduce(
        (acc: Prisma.Decimal, p) => acc.plus(new Prisma.Decimal(p.total ?? 0)),
        new Prisma.Decimal(0),
      );

      await prisma.cuenta.update({
        where: { id: cuenta.id },
        data: { total, pedidos: snapshot },
      });
      });
    } catch (e: unknown) {
      if ((e as { code?: string })?.code === 'P2002') {
        this.logger.warn(`PedidoActualizado ${pedidoDto.id} ya procesado — idempotente`);
        return;
      }
      throw e;
    }

    this.logger.log(`Snapshot de pedido ${pedidoDto.id} actualizado en cuenta de mesa ${pedidoDto.mesaId}`);
  }

  async procesarPagoRegistrado(payload: PagoRegistradoPayload): Promise<void> {
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
    const cierre = await this.prisma.$transaction(async (prisma) => {
      const cuentaBase = await prisma.cuenta.findUnique({ where: { id } });
      if (!cuentaBase) throw new NotFoundException(`Cuenta con ID ${id} no encontrada`);
      await prisma.$executeRaw`SELECT pg_advisory_xact_lock(1234, ('x' || substr(md5(${cuentaBase.mesaId}), 1, 8))::bit(32)::int)`;
      
      const cuenta = await prisma.cuenta.findUnique({ where: { id } });
      if (!cuenta) {
        throw new NotFoundException(`Cuenta con ID ${id} no encontrada`);
      }

      if (cuenta.estado !== CuentaEstado.Abierta) {
        throw new BadRequestException(`La cuenta no está abierta. Estado actual: ${cuenta.estado}`);
      }

      const pedidos = this.parsePedidosSnapshot(cuenta.pedidos);

      if (pedidos.length === 0) {
        throw new BadRequestException('La cuenta no tiene pedidos.');
      }

      // A3: aritmética Decimal para el cierre
      const subtotal = new Prisma.Decimal(cuenta.total);
      const descuento = new Prisma.Decimal(command.descuento ?? 0);
      const total = Prisma.Decimal.max(new Prisma.Decimal(0), subtotal.minus(descuento));
      const ticketId = uuidv4();

      const cuentaActualizada = await prisma.cuenta.updateMany({
        where: { id, estado: CuentaEstado.Abierta },
        data: {
          estado: CuentaEstado.Cerrada,
          total,
          ticket: ticketId,
        }
      });

      if (cuentaActualizada.count !== 1) {
        throw new BadRequestException('La cuenta ya fue cerrada por otra operación concurrente.');
      }

      const allItems = pedidos.flatMap((p) => p.items || []);
      const mappedItems = allItems.map((item) => ({
        productoId: item.productoId,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precioUnitario: Number(item.precioUnitario || 0)
      }));
      const meseroCuenta = this.obtenerMeseroCuenta(pedidos);

      const cuentaCerradaPayload: CuentaCerradaPayload = {
        cuentaId: id,
        mesaId: cuenta.mesaId,
        total: total.toNumber(),
        items: mappedItems,
        ...meseroCuenta,
      };

      const ticketGeneradoPayload: TicketGeneradoPayload = {
        ticketId,
        cuentaId: id,
      };

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

      return { cuenta, pedidos, subtotal, descuento, total, ticketId };
    });

    const ticket: TicketDto = {
      id: cierre.ticketId,
      cuentaId: id,
      mesaId: cierre.cuenta.mesaId,
      items: cierre.pedidos.flatMap((p) => p.items || []),
      subtotal: cierre.subtotal.toNumber(),
      descuento: cierre.descuento.toNumber(),
      total: cierre.total.toNumber(),
      fecha: new Date().toISOString()
    };

    this.logger.log(`Cuenta ${id} cerrada. Ticket ${cierre.ticketId} generado. Total: S/ ${cierre.total.toNumber()}`);

    return { message: 'Cuenta cerrada exitosamente', ticket };
  }

  async dividirCuenta(id: string, command: DividirCuentaCommand): Promise<DivisionCuentaResult> {
    const cuenta = await this.obtenerCuenta(id);
    const pedidos = cuenta.pedidos;

    if (!pedidos || pedidos.length === 0) {
      throw new BadRequestException('La cuenta no tiene pedidos para dividir.');
    }

    if (command.metodo === 'IGUALES') {
      const numPartes = command.numPartes || 1;
      // A3: aritmética Decimal para la división
      const montoPorParte = new Prisma.Decimal(cuenta.total).dividedBy(numPartes).toNumber();
      return {
        metodo: 'IGUALES',
        partes: new Array(numPartes).fill(0).map((_, i) => ({
          parte: i + 1,
          monto: montoPorParte
        }))
      };
    }

    if (command.metodo === 'POR_ITEMS') {
      const partes: Record<number, number> = {};
      const allItems = pedidos.flatMap((p) => p.items || []);
      allItems.forEach((item) => {
        const comensal = item.comensal ?? item.identificadorComensal ?? 1;
        // A3: aritmética Decimal por ítem
        const subtotal = new Prisma.Decimal(item.precioUnitario).times(item.cantidad);
        partes[comensal] = new Prisma.Decimal(partes[comensal] ?? 0).plus(subtotal).toNumber();
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

  private mapToDto(c: CuentaRecord): CuentaDto {
    return {
      id: c.id,
      mesaId: c.mesaId,
      pedidos: this.parsePedidosSnapshot(c.pedidos),
      total: Number(c.total),
      estado: c.estado,
      ticket: c.ticket,
      createdAt: this.requireDate(c.createdAt, 'createdAt', c.id).toISOString(),
      updatedAt: this.requireDate(c.updatedAt, 'updatedAt', c.id).toISOString(),
    };
  }

  private obtenerMeseroCuenta(pedidos: PedidoSnapshot[]): { meseroId?: string; meseroNombre?: string } {
    const porMesero = new Map<string, { meseroNombre?: string; total: number; pedidos: number }>();

    for (const pedido of pedidos) {
      const meseroId = typeof pedido?.meseroId === 'string' ? pedido.meseroId.trim() : '';
      if (!meseroId) continue;

      const actual = porMesero.get(meseroId) ?? { total: 0, pedidos: 0 };
      actual.total += Number(pedido.total ?? 0);
      actual.pedidos += 1;
      actual.meseroNombre = actual.meseroNombre ?? pedido.meseroNombre ?? meseroId;
      porMesero.set(meseroId, actual);
    }

    const ganador = Array.from(porMesero.entries()).sort(([, a], [, b]) => {
      const porTotal = b.total - a.total;
      return porTotal === 0 ? b.pedidos - a.pedidos : porTotal;
    })[0];

    if (!ganador) return {};
    const [meseroId, data] = ganador;
    return { meseroId, meseroNombre: data.meseroNombre ?? meseroId };
  }

  private parsePedidosSnapshot(value: unknown): PedidoSnapshot[] {
    const parsed = typeof value === 'string' ? (JSON.parse(value) as unknown) : value;
    if (!Array.isArray(parsed)) return [];

    return parsed.map((pedido, index) => {
      if (!this.isPedidoSnapshot(pedido)) {
        throw new BadRequestException(`Snapshot de pedido invalido en posicion ${index}`);
      }
      return pedido;
    });
  }

  private isPedidoSnapshot(value: unknown): value is PedidoSnapshot {
    if (!value || typeof value !== 'object') return false;
    const pedido = value as Record<string, unknown>;
    return (
      typeof pedido.id === 'string' &&
      typeof pedido.mesaId === 'string' &&
      Array.isArray(pedido.items) &&
      pedido.items.every((item) => this.isPedidoSnapshotItem(item)) &&
      typeof pedido.total === 'number' &&
      typeof pedido.estado === 'string'
    );
  }

  private isPedidoSnapshotItem(value: unknown): value is PedidoSnapshotItem {
    if (!value || typeof value !== 'object') return false;
    const item = value as Record<string, unknown>;
    return (
      typeof item.productoId === 'string' &&
      typeof item.cantidad === 'number' &&
      typeof item.precioUnitario === 'number' &&
      (item.nombre == null || typeof item.nombre === 'string')
    );
  }

  private requireDate(value: unknown, field: 'createdAt' | 'updatedAt', cuentaId: string): Date {
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
    this.logger.error(`Cuenta ${cuentaId} sin ${field} valido`);
    throw new BadRequestException(`Cuenta ${cuentaId} tiene ${field} invalido`);
  }
}
