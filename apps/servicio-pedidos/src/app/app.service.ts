import { Injectable, NotFoundException, BadRequestException, Logger, ServiceUnavailableException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { 
  PedidoDto,
  CrearPedidoCommand,
  ActualizarEstadoPedidoCommand,
  ActualizarEstadoItemCommand,
  PedidoItemInput,
  PedidoEstado,
  EstadoItem,
  ListarPedidosQuery,
  PedidoListResponse,
  ItemArea,
  RoutingKeys,
  PagoRegistradoPayload,
  ProductoCreadoPayload,
  ProductoActualizadoPayload,
  StockInsuficientePayload,
} from '@org/contracts';
import { Prisma } from '../generated/prisma';
import { getOrCreateCounter } from '@org/observabilidad';
import axios from 'axios';
import {
  PedidoItemMapeado,
  MesaLocalEntity,
  PedidoEntity,
} from './types';

interface ProductoRemotoLote {
  id: string;
  nombre: string;
  precio: number;
  stockActual: number | null;
  categoria?: { nombre: string } | null;
  disponible: boolean;
}

interface MeseroPedido {
  id: string;
  nombre?: string | null;
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  // Métricas de negocio (plan 5.2): pedidos/min vía rate(pedidos_creados_total).
  private readonly pedidosCreadosCounter = getOrCreateCounter(
    'pedidos_creados_total', 'Pedidos creados', ['modalidad'],
  );
  private readonly pedidosRechazadosCounter = getOrCreateCounter(
    'pedidos_rechazados_sin_stock_total', 'Ítems/pedidos rechazados por falta de stock',
  );
  private readonly HTTP_TIMEOUT_MS = 5000;
  private readonly INVENTARIO_URL =
    process.env['INVENTARIO_SERVICE_URL'] ?? 'http://servicio-inventario:3000/api';

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async crearPedido(command: CrearPedidoCommand, mesero?: MeseroPedido | null): Promise<{ message: string; pedido: PedidoDto }> {
    const mesaLocal = await this.validarMesa(command.mesaId);
    const itemsProcesados = await this.validarYMapearItems(command.items);
    const total = this.calcularTotal(itemsProcesados);
    const pedido = await this.persistirPedido(
      command.mesaId,
      mesaLocal.numero,
      itemsProcesados,
      total,
      command.cliente,
      command.telefono,
      command.direccion,
      command.proveedor,
      command.modalidad,
      mesero,
    );

    this.logger.log(`Pedido ${pedido.id} creado con eventos en Outbox`);
    this.pedidosCreadosCounter.inc({ modalidad: command.modalidad ?? 'MESA' });
    return {
      message: 'Pedido creado exitosamente',
      pedido: this.mapToDto(pedido)
    };
  }

  private async validarMesa(mesaId: string): Promise<MesaLocalEntity> {
    const mesa = await this.prisma.mesaLocal.findUnique({ where: { id: mesaId } });
    if (!mesa) {
      throw new NotFoundException(`La mesa con ID ${mesaId} no existe o no está sincronizada.`);
    }
    return mesa;
  }

  private async asegurarProductosLocales(productoIds: string[]): Promise<void> {
    const existentes = await this.prisma.productoLocal.findMany({
      where: { id: { in: productoIds } }
    });
    const existentesIds = new Set(existentes.map(p => p.id));
    const faltantes = productoIds.filter(id => !existentesIds.has(id));

    if (faltantes.length > 0) {
      this.logger.warn(`Cold-start: ${faltantes.length} productos no están en proyección local, cargando desde inventario`);
      let token: string;
      try {
        token = this.jwtService.sign(
          { sub: 'servicio-pedidos', email: 'pedidos@internal', rol: 'SISTEMA' },
          { expiresIn: '1h' },
        );
      } catch {
        throw new ServiceUnavailableException('No se pudo generar token para inventario. Reintente.');
      }

      try {
        const { data } = await axios.post<ProductoRemotoLote[]>(
          `${this.INVENTARIO_URL}/productos/lote`,
          { ids: faltantes },
          {
            timeout: this.HTTP_TIMEOUT_MS,
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const productos = Array.isArray(data) ? data : (data as any).productos ?? [];
        for (const p of productos) {
          await this.prisma.productoLocal.upsert({
            where: { id: p.id },
            create: {
              id: p.id,
              nombre: p.nombre,
              precio: p.precio,
              stockActual: p.stockActual ?? null,
              categoriaNombre: p.categoria?.nombre ?? 'COCINA',
              disponible: p.disponible ?? true,
            },
            update: {
              nombre: p.nombre,
              precio: p.precio,
              stockActual: p.stockActual ?? null,
              categoriaNombre: p.categoria?.nombre ?? 'COCINA',
              disponible: p.disponible ?? true,
            },
          });
        }
      } catch (error: unknown) {
        const axiosError = error as { response?: { status: number }; code?: string; message?: string };
        if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
          throw new ServiceUnavailableException('El servicio de inventario no responde. Reintente.');
        }
        if (axiosError.code === 'ECONNREFUSED') {
          throw new ServiceUnavailableException('El servicio de inventario no está disponible.');
        }
        this.logger.error(`Error en cold-start de productos: ${axiosError.message}`);
        throw new InternalServerErrorException('No se pudieron cargar productos desde inventario. Reintente.');
      }
    }
  }

  private async validarYMapearItems(itemsToProcess: PedidoItemInput[]): Promise<PedidoItemMapeado[]> {
    const ids = itemsToProcess.map(i => i.productoId);
    await this.asegurarProductosLocales(ids);

    const productos = await this.prisma.productoLocal.findMany({
      where: { id: { in: ids } }
    });
    const mapa = new Map(productos.map(p => [p.id, p]));

    return itemsToProcess.map(item => {
      const p = mapa.get(item.productoId);
      if (!p) throw new NotFoundException(`Producto ${item.productoId} no encontrado`);
      if (item.cantidad < 1) {
        throw new BadRequestException(`La cantidad para ${p.nombre} debe ser al menos 1.`);
      }
      if (p.stockActual !== null && p.stockActual < item.cantidad) {
        throw new BadRequestException(`Stock insuficiente para ${p.nombre}. Disponible: ${p.stockActual}`);
      }

      return {
        productoId: p.id,
        nombre: p.nombre,
        cantidad: item.cantidad,
        precioUnitario: Number(p.precio),
        stockActual: p.stockActual,
        area: p.categoriaNombre?.toLowerCase().includes('bebida') ? 'BAR' : 'COCINA',
        notas: item.notas,
        comensal: item.identificadorComensal || 1,
        modificadores: item.modificadores || [],
      } satisfies PedidoItemMapeado;
    });
  }

  private calcularTotal(items: PedidoItemMapeado[]): Prisma.Decimal {
    return items.reduce(
      (sum, item) => sum.plus(new Prisma.Decimal(item.precioUnitario).times(item.cantidad)),
      new Prisma.Decimal(0),
    );
  }

  private async persistirPedido(
    mesaId: string,
    numeroMesa: number,
    items: PedidoItemMapeado[],
    total: Prisma.Decimal,
    cliente?: string,
    telefono?: string,
    direccion?: string,
    proveedor?: string,
    modalidad?: string,
    mesero?: MeseroPedido | null,
  ): Promise<PedidoEntity> {
    return this.prisma.$transaction(async (prisma) => {
      const itemsConStockControlado = items.filter((item) => typeof item.stockActual === 'number');
      const cantidadesPorProducto = itemsConStockControlado.reduce((acc, item) => {
        acc.set(item.productoId, (acc.get(item.productoId) ?? 0) + item.cantidad);
        return acc;
      }, new Map<string, number>());

      for (const [productoId, cantidad] of cantidadesPorProducto) {
        await prisma.$executeRaw(Prisma.sql`SELECT pg_advisory_xact_lock(hashtext(${productoId}))`);
        const reservado = await prisma.$queryRaw<{ stockActual: number }[]>(Prisma.sql`
          UPDATE productos_locales
          SET "stockActual" = "stockActual" - ${cantidad}
          WHERE id = ${productoId}
            AND "stockActual" IS NOT NULL
            AND "stockActual" >= ${cantidad}
          RETURNING "stockActual"
        `);

        if (reservado.length === 0) {
          const producto = items.find((item) => item.productoId === productoId);
          throw new BadRequestException(`Stock insuficiente para ${producto?.nombre ?? productoId}.`);
        }
      }

      const pedido = await prisma.pedido.create({
        data: {
          mesaId,
          numeroMesa,
          estado: PedidoEstado.Pendiente,
          total,
          cliente,
          telefono,
          direccion,
          proveedor,
          modalidad: modalidad ?? 'MESA',
          meseroId: mesero?.id,
          meseroNombre: mesero?.nombre ?? mesero?.id,
          items: {
            create: items.map(item => ({
              productoId: item.productoId,
              nombre: item.nombre,
              cantidad: item.cantidad,
              precioUnitario: item.precioUnitario,
              area: item.area,
              notas: item.notas,
              comensal: item.comensal,
              meseroId: mesero?.id,
              meseroNombre: mesero?.nombre ?? mesero?.id,
              modificadores: {
                create: item.modificadores.map(m => ({
                  nombre: m.nombre,
                  precioExtra: m.precioExtra || 0
                }))
              }
            }))
          }
        },
        include: {
          items: {
            include: { modificadores: true }
          }
        }
      });

      const pedidoDto = this.mapToDto(pedido);

      await prisma.outboxEvent.createMany({
        data: [
          {
            routingKey: RoutingKeys.PedidoCreado,
            payload: JSON.stringify({ pedido: pedidoDto }),
            status: 'PENDING',
          },
          {
            routingKey: RoutingKeys.PedidoActualizado,
            payload: JSON.stringify({ pedido: pedidoDto }),
            status: 'PENDING',
          }
        ]
      });

      return pedido;
    });
  }


  async listarPedidos(query: ListarPedidosQuery = {}): Promise<PedidoListResponse> {
    const limit = this.normalizeLimit(query.limit);
    const where: Prisma.PedidoWhereInput = {
      ...(query.mesaId ? { mesaId: query.mesaId } : {}),
      ...(query.estado
        ? { estado: query.estado }
        : { estado: { notIn: [PedidoEstado.Pagado, PedidoEstado.Cancelado] } }),
      ...(query.updatedSince
        ? { updatedAt: { gte: new Date(query.updatedSince) } }
        : {}),
    };
    const pedidos = await this.prisma.pedido.findMany({
      where,
      include: {
        items: {
          include: { modificadores: true }
        }
      },
      take: limit + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }]
    });

    const hasMore = pedidos.length > limit;
    const data = pedidos.slice(0, limit);

    return {
      data: data.map(p => this.mapToDto(p)),
      nextCursor: hasMore ? data[data.length - 1]?.id ?? null : null,
    };
  }

  private normalizeLimit(limit?: number): number {
    const parsed = Number(limit ?? 20);
    if (!Number.isFinite(parsed)) return 20;
    return Math.min(Math.max(Math.trunc(parsed), 1), 100);
  }

  /**
   * Transiciones permitidas del estado *del pedido* vía el endpoint de pedido.
   * "Cocina manda": el tramo de producción (PENDIENTE → EN_PREPARACION → LISTO)
   * se deriva de los ítems (ver `derivarEstadoPedido`), por eso este endpoint
   * existe sobre todo para el tramo comercial (LISTO → ENTREGADO → PAGADO) y
   * cancelaciones. Las transiciones de producción quedan disponibles como
   * override manual, pero la UI por defecto no las expone.
   */
  private static readonly TRANSICIONES: Record<PedidoEstado, PedidoEstado[]> = {
    [PedidoEstado.Pendiente]: [PedidoEstado.EnPreparacion, PedidoEstado.Listo, PedidoEstado.Cancelado],
    [PedidoEstado.EnPreparacion]: [PedidoEstado.Pendiente, PedidoEstado.Listo, PedidoEstado.Cancelado],
    [PedidoEstado.Listo]: [PedidoEstado.EnPreparacion, PedidoEstado.Entregado, PedidoEstado.Cancelado],
    [PedidoEstado.Entregado]: [PedidoEstado.Pagado, PedidoEstado.Cancelado],
    [PedidoEstado.Pagado]: [],
    [PedidoEstado.Cancelado]: [],
    // Estado terminal puesto por la compensación de saga; no es destino de
    // ninguna transición manual vía el endpoint de estado.
    [PedidoEstado.RechazadoSinStock]: [],
  };

  private validarTransicion(actual: PedidoEstado, siguiente: PedidoEstado): void {
    if (actual === siguiente) return;
    const permitidas = AppService.TRANSICIONES[actual] ?? [];
    if (!permitidas.includes(siguiente)) {
      throw new BadRequestException(
        `Transición de estado inválida: ${actual} → ${siguiente}`,
      );
    }
  }

  /**
   * Deriva el estado de producción del pedido a partir de sus ítems.
   * Fuente de verdad de PENDIENTE / EN_PREPARACION / LISTO ("cocina manda").
   * No decide ENTREGADO/PAGADO/CANCELADO: esos son comerciales.
   */
  private derivarEstadoPedido(
    estadosRaw: Array<EstadoItem | PedidoEstado | string>,
  ): PedidoEstado | null {
    // Los ítems rechazados por falta de stock no participan en la derivación de
    // producción ("cocina manda"): un ítem fantasma no debe impedir que el resto
    // del pedido avance a LISTO.
    const estados = estadosRaw.filter((e) => e !== EstadoItem.RechazadoSinStock);
    if (estados.length === 0) return null;
    const todosListos = estados.every(
      (e) => e === EstadoItem.Listo || e === EstadoItem.Entregado,
    );
    if (todosListos) return PedidoEstado.Listo;
    const algunoEnMarcha = estados.some(
      (e) => e === EstadoItem.EnPreparacion || e === EstadoItem.Listo || e === EstadoItem.Entregado,
    );
    if (algunoEnMarcha) return PedidoEstado.EnPreparacion;
    return PedidoEstado.Pendiente;
  }

  async actualizarEstado(id: string, command: ActualizarEstadoPedidoCommand): Promise<{ message: string; pedido: PedidoDto }> {
    const pedido = await this.prisma.$transaction(async (prisma) => {
      const actual = await prisma.pedido.findUnique({ where: { id } });
      if (!actual) {
        throw new NotFoundException(`Pedido ${id} no encontrado`);
      }
      this.validarTransicion(actual.estado as PedidoEstado, command.estado);

      const p = await prisma.pedido.update({
        where: { id },
        data: { estado: command.estado },
        include: { items: { include: { modificadores: true } } }
      });

      const pedidoDto = this.mapToDto(p);
      const outboxData: Array<{ routingKey: string; payload: string; status: string }> = [];

      if (command.estado === PedidoEstado.Listo) {
        outboxData.push({
          routingKey: RoutingKeys.PedidoListo,
          payload: JSON.stringify({
            pedidoId: p.id,
            mesaId: p.mesaId,
          }),
          status: 'PENDING',
        });
      }

      outboxData.push({
        routingKey: RoutingKeys.PedidoActualizado,
        payload: JSON.stringify({ pedido: pedidoDto }),
        status: 'PENDING',
      });

      await prisma.outboxEvent.createMany({ data: outboxData });

      return p;
    });

    return { message: 'Estado del pedido actualizado', pedido: this.mapToDto(pedido) };
  }

  async actualizarEstadoItem(itemId: string, command: ActualizarEstadoItemCommand): Promise<{ message: string }> {
    return this.prisma.$transaction(async (prisma) => {
      const item = await prisma.pedidoItem.update({
        where: { id: itemId },
        data: { estado: command.estado }
      });

      const pedidoId = item.pedidoId;
      const pedidoActual = await prisma.pedido.findUnique({
        where: { id: pedidoId },
        include: { items: { include: { modificadores: true } } },
      });
      if (!pedidoActual) {
        return { message: 'Estado del ítem actualizado exitosamente' };
      }

      // "Cocina manda": derivamos el estado de producción del pedido desde sus
      // ítems. Solo lo aplicamos si el pedido sigue en fase de producción; nunca
      // pisamos un estado comercial (ENTREGADO/PAGADO/CANCELADO).
      const estadoActual = pedidoActual.estado as PedidoEstado;
      const enProduccion =
        estadoActual === PedidoEstado.Pendiente ||
        estadoActual === PedidoEstado.EnPreparacion ||
        estadoActual === PedidoEstado.Listo;
      const derivado = this.derivarEstadoPedido(pedidoActual.items.map((i) => i.estado));

      let pedidoFinal = pedidoActual;
      const cambiaAListo =
        enProduccion && derivado === PedidoEstado.Listo && estadoActual !== PedidoEstado.Listo;

      if (enProduccion && derivado && derivado !== estadoActual) {
        pedidoFinal =
          (await prisma.pedido.update({
            where: { id: pedidoId },
            data: { estado: derivado },
            include: { items: { include: { modificadores: true } } },
          })) ?? pedidoActual;
      }

      const outboxData: Array<{ routingKey: string; payload: string; status: string }> = [];
      if (cambiaAListo) {
        outboxData.push({
          routingKey: RoutingKeys.PedidoListo,
          payload: JSON.stringify({ pedidoId, mesaId: pedidoFinal.mesaId }),
          status: 'PENDING',
        });
      }
      outboxData.push({
        routingKey: RoutingKeys.PedidoActualizado,
        payload: JSON.stringify({ pedido: this.mapToDto(pedidoFinal) }),
        status: 'PENDING',
      });
      await prisma.outboxEvent.createMany({ data: outboxData });

      return { message: 'Estado del ítem actualizado exitosamente' };
    });
  }

  async upsertMesaLocal(mesa: { id: string; numero: number }): Promise<void> {
    await this.prisma.mesaLocal.upsert({
      where: { id: mesa.id },
      update: { numero: mesa.numero },
      create: { id: mesa.id, numero: mesa.numero }
    });
  }

  async upsertProductoLocal(producto: {
    id: string;
    nombre: string;
    precio: number;
    stockActual: number | null;
    categoriaNombre: string;
    disponible: boolean;
    allowStockIncrease?: boolean;
    stockDelta?: number;
    stockSyncMode?: 'REPOSICION' | 'CONSUMO_PEDIDO';
  }): Promise<void> {
    await this.upsertProductoLocalConPrisma(this.prisma, producto);
  }

  async procesarProductoCreado(payload: ProductoCreadoPayload): Promise<void> {
    await this.procesarEventoProducto(
      RoutingKeys.ProductoCreado,
      payload,
      (prisma) => this.upsertProductoLocalConPrisma(prisma, {
        id: payload.id,
        nombre: payload.nombre,
        precio: payload.precio,
        stockActual: payload.stockActual ?? null,
        categoriaNombre: payload.categoriaNombre ?? 'COCINA',
        disponible: payload.disponible,
        allowStockIncrease: false,
      }),
    );
  }

  async procesarProductoActualizado(payload: ProductoActualizadoPayload): Promise<void> {
    await this.procesarEventoProducto(
      RoutingKeys.ProductoActualizado,
      payload,
      (prisma) => this.upsertProductoLocalConPrisma(prisma, {
        id: payload.id,
        nombre: payload.nombre,
        precio: payload.precio,
        stockActual: payload.stockActual ?? null,
        stockDelta: payload.stockDelta,
        stockSyncMode: payload.stockSyncMode,
        categoriaNombre: payload.categoriaNombre ?? 'COCINA',
        disponible: payload.disponible,
        allowStockIncrease: payload.stockSyncMode === 'REPOSICION' && (payload.stockDelta ?? 0) > 0,
      }),
    );
  }

  /**
   * Compensación de la saga de stock. Inventario no pudo descontar el stock real
   * de un producto (la proyección local iba por delante), así que marcamos el/los
   * ítem(s) afectados como RECHAZADO_SIN_STOCK y, si el pedido entero quedó sin
   * stock, el pedido completo. Emite PedidoActualizado para que la UI y demás
   * proyecciones reflejen el rechazo. Idempotente por (pedidoId, productoId).
   */
  async procesarStockInsuficiente(payload: StockInsuficientePayload): Promise<void> {
    const { pedidoId, productoId, solicitado, disponible } = payload;
    if (!pedidoId || !productoId) {
      this.logger.warn('StockInsuficiente sin pedidoId/productoId — ignorado');
      return;
    }
    const idempotencyKey = `${RoutingKeys.StockInsuficiente}:${pedidoId}:${productoId}`;
    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.idempotencyKey.create({ data: { key: idempotencyKey } });

        const rechazados = await prisma.pedidoItem.updateMany({
          where: { pedidoId, productoId, estado: { not: EstadoItem.RechazadoSinStock } },
          data: { estado: EstadoItem.RechazadoSinStock },
        });

        const pedido = await prisma.pedido.findUnique({
          where: { id: pedidoId },
          include: { items: { include: { modificadores: true } } },
        });
        if (!pedido) {
          this.logger.warn(`StockInsuficiente: pedido ${pedidoId} no encontrado`);
          return;
        }

        // Si TODOS los ítems quedaron rechazados, el pedido entero pasa a
        // RECHAZADO_SIN_STOCK (salvo que ya sea terminal comercial).
        const terminalComercial =
          pedido.estado === PedidoEstado.Pagado || pedido.estado === PedidoEstado.Cancelado;
        const todosRechazados =
          pedido.items.length > 0 &&
          pedido.items.every((i) => i.estado === EstadoItem.RechazadoSinStock);

        let pedidoFinal = pedido;
        if (todosRechazados && !terminalComercial && pedido.estado !== PedidoEstado.RechazadoSinStock) {
          pedidoFinal = await prisma.pedido.update({
            where: { id: pedidoId },
            data: { estado: PedidoEstado.RechazadoSinStock },
            include: { items: { include: { modificadores: true } } },
          });
        }

        this.logger.warn(
          `Stock insuficiente para producto ${productoId} en pedido ${pedidoId} ` +
            `(solicitado ${solicitado}, disponible ${disponible}); ${rechazados.count} ítem(s) marcados RECHAZADO_SIN_STOCK`,
        );
        if (rechazados.count > 0) this.pedidosRechazadosCounter.inc(rechazados.count);

        await prisma.outboxEvent.create({
          data: {
            routingKey: RoutingKeys.PedidoActualizado,
            payload: JSON.stringify({ pedido: this.mapToDto(pedidoFinal) }),
            status: 'PENDING',
          },
        });
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        this.logger.warn(`StockInsuficiente ${idempotencyKey} ya procesado — sin cambios`);
        return;
      }
      throw error;
    }
  }

  private async procesarEventoProducto(
    routingKey: string,
    payload: { id: string; eventId?: string; stockSyncMode?: string; stockDelta?: number; stockActual?: number | null },
    apply: (prisma: any) => Promise<void>,
  ): Promise<void> {
    const fallbackKey = routingKey === RoutingKeys.ProductoActualizado
      ? `${payload.id}:${payload.stockSyncMode ?? 'SIN_MODO'}:${payload.stockDelta ?? 'SIN_DELTA'}:${payload.stockActual ?? 'SIN_STOCK'}`
      : payload.id;
    const idempotencyKey = `${routingKey}:${payload.eventId ?? fallbackKey}`;
    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.idempotencyKey.create({ data: { key: idempotencyKey } });
        await apply(prisma);
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        this.logger.warn(`Evento ${idempotencyKey} ya procesado — proyeccion de productos no se aplica de nuevo`);
        return;
      }
      throw error;
    }
  }

  private async upsertProductoLocalConPrisma(prisma: any, producto: {
    id: string;
    nombre: string;
    precio: number;
    stockActual: number | null;
    stockDelta?: number;
    stockSyncMode?: 'REPOSICION' | 'CONSUMO_PEDIDO';
    categoriaNombre: string;
    disponible: boolean;
    allowStockIncrease?: boolean;
  }): Promise<void> {
    await prisma.$executeRaw(Prisma.sql`SELECT pg_advisory_xact_lock(hashtext(${producto.id}))`);
    const existente = await prisma.productoLocal.findUnique({ where: { id: producto.id } });
    let stockActual = producto.stockActual;

    if (existente) {
      stockActual = existente.stockActual;
      if (
        producto.stockSyncMode === 'REPOSICION' &&
        producto.allowStockIncrease &&
        Number.isFinite(producto.stockDelta) &&
        (producto.stockDelta ?? 0) > 0
      ) {
        stockActual = existente.stockActual === null
          ? producto.stockActual
          : existente.stockActual + (producto.stockDelta ?? 0);
      }
    }

    await prisma.productoLocal.upsert({
      where: { id: producto.id },
      update: {
        nombre: producto.nombre,
        precio: producto.precio,
        stockActual,
        categoriaNombre: producto.categoriaNombre,
        disponible: producto.disponible,
      },
      create: {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        stockActual,
        categoriaNombre: producto.categoriaNombre,
        disponible: producto.disponible,
      },
    });
  }

  private mapToDto(p: PedidoEntity): PedidoDto {
    return {
      id: p.id,
      mesaId: p.mesaId,
      numeroMesa: p.numeroMesa ?? undefined,
      estado: p.estado as PedidoEstado,
      total: Number(p.total),
      cliente: p.cliente ?? undefined,
      telefono: p.telefono ?? undefined,
      direccion: p.direccion ?? undefined,
      proveedor: p.proveedor ?? undefined,
      modalidad: p.modalidad ?? undefined,
      meseroId: p.meseroId ?? undefined,
      meseroNombre: p.meseroNombre ?? undefined,
      createdAt: p.createdAt.toISOString(),
      items: p.items.map(i => ({
        id: i.id,
        productoId: i.productoId,
        nombre: i.nombre,
        cantidad: i.cantidad,
        precioUnitario: Number(i.precioUnitario),
        area: (i.area as ItemArea) ?? undefined,
        notas: i.notas ?? undefined,
        estado: i.estado as EstadoItem,
        meseroId: i.meseroId ?? p.meseroId ?? undefined,
        meseroNombre: i.meseroNombre ?? p.meseroNombre ?? undefined,
        modificadores: i.modificadores.map(m => ({
          nombre: m.nombre,
          precioExtra: Number(m.precioExtra)
        }))
      }))
    };
  }

  async procesarPagoRecibido(payload: PagoRegistradoPayload): Promise<void> {
    this.logger.log(`Procesando pago recibido para cuenta ${payload.cuentaId} y mesa ${payload.mesaId}`);
    
    const pedidos = await this.prisma.pedido.findMany({
      where: { mesaId: payload.mesaId, estado: { notIn: [PedidoEstado.Pagado, PedidoEstado.Cancelado] } }
    });

    for (const pedido of pedidos) {
      await this.prisma.pedido.update({
        where: { id: pedido.id },
        data: {
          estado: PedidoEstado.Pagado,
        },
      });
    }
  }
}
