import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  PedidoDto, 
  CrearPedidoCommand, 
  ActualizarEstadoPedidoCommand,
  PedidoEstado,
  RoutingKeys,
  PagoRegistradoPayload
} from '@org/contracts';
import { RabbitMQPublisherService } from '@org/shared-rabbitmq';
import axios from 'axios';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  // En un entorno real, esto vendría de un Service Discovery o Config
  private readonly INVENTARIO_URL = 'http://localhost:3007/api';
  private readonly MESAS_URL = 'http://localhost:3002/api';
  private readonly CUENTAS_URL = 'http://localhost:3005/api';

  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitmq: RabbitMQPublisherService
  ) {}

  async crearPedido(command: CrearPedidoCommand): Promise<{ message: string; pedido: PedidoDto }> {
    // 1. Obtener detalles de productos desde el microservicio de Inventario
    const itemsProcesados = await Promise.all(
      command.items.map(async (item) => {
        try {
          const res = await axios.get(`${this.INVENTARIO_URL}/productos/${item.productoId}`);
          const producto = res.data;

          // VALIDACIÓN DE CANTIDAD MÍNIMA
          if (item.cantidad < 1) {
            throw new BadRequestException(`La cantidad para ${producto.nombre} debe ser al menos 1.`);
          }

          // VALIDACIÓN DE STOCK
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
          };
        } catch (error: unknown) {
          const axiosError = error as { response?: { status: number }; message?: string };
          if (axiosError.response?.status === 404) {
            throw new NotFoundException(`Producto con ID ${item.productoId} no encontrado en Inventario.`);
          }
          throw error;
        }
      })
    );

    // 2. Obtener número de mesa desde el microservicio de Mesas
    let numeroMesa: number | undefined;
    let estadoMesa: string | undefined;
    try {
      const resMesa = await axios.get(`${this.MESAS_URL}/mesas/${command.mesaId}`);
      numeroMesa = resMesa.data.numero;
      estadoMesa = resMesa.data.estado;
    } catch (error) {
      this.logger.warn(`No se pudo obtener la mesa ${command.mesaId}`);
    }

    // FLUJO IMPLÍCITO: Si la mesa estaba libre, ocuparla y abrir la cuenta
    if (estadoMesa === 'LIBRE') {
      try {
        await axios.patch(`${this.MESAS_URL}/mesas/${command.mesaId}/estado`, { estado: 'OCUPADA' });
        this.logger.log(`Mesa ${command.mesaId} ocupada automáticamente.`);
        
        await axios.post(`${this.CUENTAS_URL}/cuentas`, { mesaId: command.mesaId });
        this.logger.log(`Cuenta abierta automáticamente para la mesa ${command.mesaId}.`);
      } catch (error) {
        this.logger.error(`Error al intentar ocupar mesa o abrir cuenta: ${(error as Error).message}`);
      }
    }

    const total = itemsProcesados.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0);

    // 3. Crear el pedido en la BD
    const pedido = await this.prisma.pedido.create({
      data: {
        mesaId: command.mesaId,
        numeroMesa: numeroMesa,
        estado: PedidoEstado.Pendiente,
        total: total,
        items: {
          create: itemsProcesados.map(item => ({
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

    // 4. Publicar evento de pedido creado para reducción de stock y notificaciones
    try {
      await this.rabbitmq.publish(RoutingKeys.PedidoCreado, {
        id: pedido.id,
        items: pedido.items.map(i => ({
          productoId: i.productoId,
          cantidad: i.cantidad
        })),
        total: Number(pedido.total)
      }, 'servicio-pedidos');
      this.logger.log(`Evento pedido.creado publicado para pedido ${pedido.id}`);
    } catch (error: unknown) {
      this.logger.error(`Error al publicar evento pedido.creado: ${(error as Error).message}`);
    }

    return { 
      message: 'Pedido creado exitosamente', 
      pedido: this.mapToDto(pedido) 
    };
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
    const pedido = await this.prisma.pedido.update({
      where: { id },
      data: { estado: command.estado },
      include: { items: { include: { modificadores: true } } }
    });

    if (command.estado === PedidoEstado.Listo) {
      await this.rabbitmq.publish(RoutingKeys.PedidoListo, {
        pedidoId: pedido.id,
        mesaId: pedido.mesaId,
      }, 'servicio-pedidos');
    }

    await this.rabbitmq.publish(RoutingKeys.PedidoActualizado, {
      pedidoId: pedido.id,
    }, 'servicio-pedidos');

    return { message: 'Estado del pedido actualizado', pedido: this.mapToDto(pedido) };
  }

  async actualizarEstadoItem(itemId: string, command: ActualizarEstadoPedidoCommand): Promise<{ message: string }> {
    const item = await this.prisma.pedidoItem.update({
      where: { id: itemId },
      data: { estado: command.estado }
    });

    // Check if ALL items in the same order are now "LISTO" or beyond
    const pedidoId = item.pedidoId;
    const allItems = await this.prisma.pedidoItem.findMany({ where: { pedidoId } });
    
    const isOrderReady = allItems.every(i => i.estado === PedidoEstado.Listo || i.estado === PedidoEstado.Entregado);
    
    if (isOrderReady) {
      // Auto-update the parent order to LISTO
      await this.actualizarEstado(pedidoId, { estado: PedidoEstado.Listo });
    } else {
      // Notify KDS that an item was updated
      await this.rabbitmq.publish(RoutingKeys.PedidoActualizado, {
        pedidoId: pedidoId,
      }, 'servicio-pedidos');
    }

    return { message: 'Estado del ítem actualizado exitosamente' };
  }

  async registrarPagoInterno(pedidoId: string, monto: number): Promise<void> {
    this.logger.log(`Registrando pago interno para pedido ${pedidoId}, monto: ${monto}`);
    const pedido = await this.prisma.pedido.findUnique({ where: { id: pedidoId } });
    if (!pedido) {
      this.logger.error(`Pedido ${pedidoId} no encontrado al intentar registrar pago`);
      return;
    }

    const nuevoMontoPagado = Number(pedido.montoPagado) + monto;
    const pagadoCompletamente = nuevoMontoPagado >= Number(pedido.total);

    await this.prisma.pedido.update({
      where: { id: pedidoId },
      data: {
        montoPagado: nuevoMontoPagado,
        estado: pagadoCompletamente ? PedidoEstado.Pagado : pedido.estado
      }
    });

    if (pagadoCompletamente) {
      this.logger.log(`Pedido ${pedidoId} pagado completamente. Estado cambiado a PAGADO.`);
    }
  }

  async procesarPagoRecibido(payload: PagoRegistradoPayload): Promise<void> {
    this.logger.log(`Procesando pago recibido para el pedido ${payload.pedidoId}`);
    
    // 1. Registra el pago interno
    await this.registrarPagoInterno(payload.pedidoId, payload.monto);

    // 2. Revisar si la mesa puede ser liberada
    const pedido = await this.prisma.pedido.findUnique({ where: { id: payload.pedidoId } });
    if (!pedido || !pedido.mesaId) return;

    // Verificar si TODOS los pedidos de esta mesa están PAGADOS
    const pedidosActivos = await this.prisma.pedido.findMany({
      where: {
        mesaId: pedido.mesaId,
        estado: { notIn: [PedidoEstado.Pagado] }
      }
    });

    if (pedidosActivos.length === 0) {
      this.logger.log(`Todos los pedidos de la mesa ${pedido.mesaId} están pagados. Liberando mesa...`);
      try {
        await axios.patch(`${this.MESAS_URL}/mesas/${pedido.mesaId}/estado`, { estado: 'LIBRE' });
        this.logger.log(`Mesa ${pedido.mesaId} liberada exitosamente.`);
      } catch (error) {
        this.logger.error(`Error al intentar liberar la mesa: ${(error as Error).message}`);
      }
    }
  }

  private mapToDto(p: any): PedidoDto {
    return {
      id: p.id,
      mesaId: p.mesaId,
      numeroMesa: p.numeroMesa,
      estado: p.estado as PedidoEstado,
      total: Number(p.total),
      createdAt: p.createdAt.toISOString(),
      items: p.items.map((i: any) => ({
        id: i.id,
        productoId: i.productoId,
        nombre: i.nombre,
        cantidad: i.cantidad,
        precioUnitario: Number(i.precioUnitario),
        area: i.area,
        notas: i.notas,
        estado: i.estado as PedidoEstado,
        modificadores: i.modificadores.map((m: any) => ({
          nombre: m.nombre,
          precioExtra: Number(m.precioExtra)
        }))
      }))
    };
  }
}
