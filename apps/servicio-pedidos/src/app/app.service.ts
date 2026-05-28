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
import { CircuitBreakerOptions } from '@org/resiliencia';
import axios from 'axios';
import {
  ProductoRemoto,
  PedidoItemMapeado,
  MesaLocalEntity,
  PedidoEntity,
} from './types';

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

  private async validarYMapearItems(itemsToProcess: PedidoItemInput[]): Promise<PedidoItemMapeado[]> {
    return Promise.all(
      itemsToProcess.map(async (item) => {
        try {
          const producto = await this.fetchProducto(item.productoId);

          if (item.cantidad < 1) {
            throw new BadRequestException(`La cantidad para ${producto.nombre} debe ser al menos 1.`);
          }

          if (producto.stockActual !== null && producto.stockActual < item.cantidad) {
            throw new BadRequestException(`Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stockActual}`);
          }

          return {
            productoId: item.productoId,
            nombre: producto.nombre,
            cantidad: item.cantidad,
            precioUnitario: producto.precio,
            area: producto.categoria?.nombre?.toLowerCase().includes('bebida') ? 'BAR' : 'COCINA',
            notas: item.notas,
            comensal: item.identificadorComensal || 1,
            modificadores: item.modificadores || []
          } satisfies PedidoItemMapeado;
        } catch (error: unknown) {
          const axiosError = error as { response?: { status: number }; code?: string; message?: string };

          if (axiosError.response?.status === 404) {
            throw new NotFoundException(`Producto ${item.productoId} no encontrado.`);
          }
          if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
            throw new ServiceUnavailableException('El servicio de inventario no responde. Reintente.');
          }
          if (axiosError.code === 'ECONNREFUSED') {
            throw new ServiceUnavailableException('El servicio de inventario no está disponible.');
          }

          if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ServiceUnavailableException) {
            throw error;
          }

          this.logger.error(`Error inesperado consultando inventario: ${(axiosError as Error).message}`);
          throw new InternalServerErrorException('Error al validar productos. Reintente.');
        }
      })
    );
  }

  private calcularTotal(items: PedidoItemMapeado[]): number {
    return items.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0);
  }

  private async persistirPedido(mesaId: string, numeroMesa: number, items: PedidoItemMapeado[], total: number): Promise<PedidoEntity> {
    return this.prisma.$transaction(async (prisma) => {
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

  private getServiceToken(): string {
    return this.jwtService.sign(
      { sub: 'servicio-pedidos', email: 'pedidos@internal', rol: 'SISTEMA' },
      { expiresIn: '1h' },
    );
  }

  @CircuitBreakerOptions({ timeout: 5000, errorThresholdPercentage: 50, resetTimeout: 30000 })
  private async fetchProducto(productoId: string): Promise<ProductoRemoto> {
    const res = await axios.get<ProductoRemoto>(`${this.INVENTARIO_URL}/productos/${productoId}`, {
      timeout: this.HTTP_TIMEOUT_MS,
      headers: { Authorization: `Bearer ${this.getServiceToken()}` },
    });
    return res.data;
  }

  async upsertMesaLocal(mesa: { id: string; numero: number }): Promise<void> {
    await this.prisma.mesaLocal.upsert({
      where: { id: mesa.id },
      update: { numero: mesa.numero },
      create: { id: mesa.id, numero: mesa.numero }
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
