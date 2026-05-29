import { Injectable, NotFoundException, BadRequestException, Logger, ServiceUnavailableException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { 
  PedidoDto, 
  CrearPedidoCommand,
  ActualizarEstadoPedidoCommand,
  PedidoItemInput,
  PedidoEstado,
  ItemArea,
  RoutingKeys,
  PagoRegistradoPayload
} from '@org/contracts';
import { Prisma } from '../generated/prisma';
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

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly HTTP_TIMEOUT_MS = 5000;
  private readonly INVENTARIO_URL =
    process.env['INVENTARIO_SERVICE_URL'] ?? 'http://servicio-inventario:3000/api';

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async crearPedido(command: CrearPedidoCommand): Promise<{ message: string; pedido: PedidoDto }> {
    const mesaLocal = await this.validarMesa(command.mesaId);
    const itemsProcesados = await this.validarYMapearItems(command.items);
    const total = this.calcularTotal(itemsProcesados);
    const pedido = await this.persistirPedido(command.mesaId, mesaLocal.numero, itemsProcesados, total);

    this.logger.log(`Pedido ${pedido.id} creado con eventos en Outbox`);
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

  private async persistirPedido(mesaId: string, numeroMesa: number, items: PedidoItemMapeado[], total: Prisma.Decimal): Promise<PedidoEntity> {
    return this.prisma.$transaction(async (prisma) => {
      const cantidadesPorProducto = items.reduce((acc, item) => {
        if (item.stockActual !== null && item.stockActual !== undefined) {
          acc.set(item.productoId, (acc.get(item.productoId) ?? 0) + item.cantidad);
        }
        return acc;
      }, new Map<string, number>());

      for (const [productoId, cantidad] of cantidadesPorProducto) {
        const reservado = await prisma.productoLocal.updateMany({
          where: {
            id: productoId,
            stockActual: { gte: cantidad },
          },
          data: {
            stockActual: { decrement: cantidad },
          },
        });

        if (reservado.count === 0) {
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
          items: {
            create: items.map(item => ({
              productoId: item.productoId,
              nombre: item.nombre,
              cantidad: item.cantidad,
              precioUnitario: item.precioUnitario,
              area: item.area,
              notas: item.notas,
              comensal: item.comensal,
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


  async listarPedidos(mesaId?: string): Promise<{ pedidos: PedidoDto[] }> {
    const where = mesaId ? { mesaId } : {};
    const pedidos = await this.prisma.pedido.findMany({
      where,
      include: {
        items: {
          include: { modificadores: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return { pedidos: pedidos.map(p => this.mapToDto(p)) };
  }

  async actualizarEstado(id: string, command: ActualizarEstadoPedidoCommand): Promise<{ message: string; pedido: PedidoDto }> {
    const pedido = await this.prisma.$transaction(async (prisma) => {
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

  async actualizarEstadoItem(itemId: string, command: ActualizarEstadoPedidoCommand): Promise<{ message: string }> {
    return this.prisma.$transaction(async (prisma) => {
      const item = await prisma.pedidoItem.update({
        where: { id: itemId },
        data: { estado: command.estado }
      });

      const pedidoId = item.pedidoId;
      const allItems = await prisma.pedidoItem.findMany({ where: { pedidoId } });
      
      const isOrderReady = allItems.every(i => i.estado === PedidoEstado.Listo || i.estado === PedidoEstado.Entregado);
      
      if (isOrderReady) {
        await prisma.pedido.update({
          where: { id: pedidoId },
          data: { estado: PedidoEstado.Listo }
        });

        const pedidoCompleto = await prisma.pedido.findUnique({
          where: { id: pedidoId },
          include: { items: { include: { modificadores: true } } }
        });

        if (pedidoCompleto) {
          await prisma.outboxEvent.createMany({
            data: [
              {
                routingKey: RoutingKeys.PedidoListo,
                payload: JSON.stringify({
                  pedidoId: pedidoId,
                  mesaId: pedidoCompleto.mesaId,
                }),
                status: 'PENDING',
              },
              {
                routingKey: RoutingKeys.PedidoActualizado,
                payload: JSON.stringify({ pedido: this.mapToDto(pedidoCompleto) }),
                status: 'PENDING',
              }
            ]
          });
        }
      } else {
        const pedido = await prisma.pedido.findUnique({
          where: { id: pedidoId },
          include: { items: { include: { modificadores: true } } }
        });
        if (pedido) {
          await prisma.outboxEvent.create({
            data: {
              routingKey: RoutingKeys.PedidoActualizado,
              payload: JSON.stringify({ pedido: this.mapToDto(pedido) }),
              status: 'PENDING',
            }
          });
        }
      }

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
  }): Promise<void> {
    await this.prisma.productoLocal.upsert({
      where: { id: producto.id },
      update: {
        nombre: producto.nombre,
        precio: producto.precio,
        stockActual: producto.stockActual,
        categoriaNombre: producto.categoriaNombre,
        disponible: producto.disponible,
      },
      create: {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        stockActual: producto.stockActual,
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
      createdAt: p.createdAt.toISOString(),
      items: p.items.map(i => ({
        id: i.id,
        productoId: i.productoId,
        nombre: i.nombre,
        cantidad: i.cantidad,
        precioUnitario: Number(i.precioUnitario),
        area: (i.area as ItemArea) ?? undefined,
        notas: i.notas ?? undefined,
        estado: i.estado as PedidoEstado,
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
