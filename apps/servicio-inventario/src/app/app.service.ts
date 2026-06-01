import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CategoriaDto, 
  ProductoDto, 
  CrearCategoriaCommand, 
  CrearProductoCommand,
  RoutingKeys,
  ProductoCreadoPayload,
  ProductoActualizadoPayload,
} from '@org/contracts';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly prisma: PrismaService) {}

  getHello(): { message: string; service: string } {
    return { message: 'Servicio de Inventario activo', service: 'servicio-inventario' };
  }

  // --- CATEGORÍAS ---

  async listarCategorias(): Promise<{ categorias: CategoriaDto[] }> {
    const categorias = await this.prisma.categoria.findMany({
      orderBy: { nombre: 'asc' }
    });
    return { categorias };
  }

  async crearCategoria(command: CrearCategoriaCommand): Promise<{ message: string; categoria: CategoriaDto }> {
    const categoria = await this.prisma.categoria.create({
      data: {
        nombre: command.nombre,
        descripcion: command.descripcion,
      }
    });
    return { message: 'Categoría creada exitosamente', categoria };
  }

  // --- PRODUCTOS ---

  async listarProductos(categoriaId?: string): Promise<{ productos: ProductoDto[] }> {
    const where = categoriaId ? { categoriaId } : {};
    const productos = await this.prisma.producto.findMany({
      where,
      include: { categoria: true },
      orderBy: { nombre: 'asc' }
    });
    return { productos: productos as unknown as ProductoDto[] };
  }

  async obtenerProducto(id: string): Promise<ProductoDto> {
    const producto = await this.prisma.producto.findUnique({
      where: { id },
      include: { categoria: true }
    });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return { ...producto, precio: producto.precio.toNumber() } as unknown as ProductoDto;
  }

  async obtenerProductosLote(ids: string[]): Promise<{ productos: ProductoDto[] }> {
    const productos = await this.prisma.producto.findMany({
      where: { id: { in: ids } },
      include: { categoria: true },
    });
    return { productos: productos as unknown as ProductoDto[] };
  }

  async crearProducto(command: CrearProductoCommand): Promise<{ message: string; producto: ProductoDto }> {
    const categoria = await this.prisma.categoria.findUnique({ where: { id: command.categoriaId } });
    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${command.categoriaId} no encontrada`);
    }

    const producto = await this.prisma.$transaction(async (prisma) => {
      const p = await prisma.producto.create({
        data: {
          categoriaId: command.categoriaId,
          nombre: command.nombre,
          descripcion: command.descripcion,
          precio: command.precio,
          disponible: command.disponible ?? true,
          stockActual: command.stockActual ?? null,
        }
      });

      const payload: ProductoCreadoPayload = {
        id: p.id,
        nombre: p.nombre,
        precio: p.precio.toNumber(),
        stockActual: p.stockActual,
        categoriaNombre: categoria.nombre,
        disponible: p.disponible,
      };

      await prisma.outboxEvent.create({
        data: {
          routingKey: RoutingKeys.ProductoCreado,
          payload: JSON.stringify(payload),
          status: 'PENDING',
        }
      });

      return p;
    });
    
    return { message: 'Producto creado exitosamente', producto: { ...producto, precio: producto.precio.toNumber() } as unknown as ProductoDto };
  }

  async actualizarStock(id: string, cantidad: number): Promise<{ message: string; producto: ProductoDto }> {
    const actualizado = await this.prisma.$transaction(async (prisma) => {
      await prisma.$executeRaw`SELECT pg_advisory_xact_lock(1234, ('x' || substr(md5(${id}), 1, 8))::bit(32)::int)`;

      const producto = await prisma.producto.findUnique({ where: { id }, include: { categoria: true } });
      if (!producto) throw new NotFoundException('Producto no encontrado');

      const stockBase = producto.stockActual ?? 0;
      const nuevoStock = Math.max(0, stockBase + cantidad);
      const disponibleFinal = nuevoStock === 0 ? false : producto.disponible;

      const p = await prisma.producto.update({
        where: { id },
        data: {
          stockActual: nuevoStock,
          disponible: disponibleFinal,
        }
      });

      const payload: ProductoActualizadoPayload = {
        id: p.id,
        nombre: p.nombre,
        precio: p.precio.toNumber(),
        stockActual: p.stockActual,
        categoriaNombre: producto.categoria?.nombre,
        disponible: disponibleFinal,
        stockSyncMode: cantidad > 0 ? 'REPOSICION' : 'CONSUMO_PEDIDO',
        stockDelta: cantidad,
      };

      await prisma.outboxEvent.create({
        data: {
          routingKey: RoutingKeys.ProductoActualizado,
          payload: JSON.stringify(payload),
          status: 'PENDING',
        }
      });

      return p;
    });

    return { message: 'Stock actualizado', producto: { ...actualizado, precio: actualizado.precio.toNumber() } as unknown as ProductoDto };
  }

  async reducirStockAutomatico(id: string, cantidad: number): Promise<void> {
    await this.reducirStockAutomaticoConPrisma(this.prisma, id, cantidad);
  }

  private async reducirStockAutomaticoConPrisma(prisma: any, id: string, cantidad: number): Promise<void> {
    const producto = await prisma.producto.findUnique({ where: { id }, include: { categoria: true } });
    
    if (!producto) {
      this.logger.warn(`Producto ${id} no encontrado para reducción de stock`);
      return;
    }

    if (producto.stockActual === null) {
      return;
    }

    const actualizado = await prisma.producto.updateMany({
      where: {
        id,
        stockActual: { gte: cantidad }
      },
      data: { 
        stockActual: { decrement: cantidad }
      }
    });

    if (actualizado.count === 0) {
      this.logger.warn(`Stock insuficiente para producto ${id} — no se pudo decrementar ${cantidad}`);
      return;
    }

    const productoDespues = await prisma.producto.findUnique({ where: { id } });
    let productoFinal = productoDespues;
    if (productoDespues && productoDespues.stockActual === 0 && productoDespues.disponible) {
      productoFinal = await prisma.producto.update({
        where: { id },
        data: { disponible: false }
      });
    }

    await prisma.outboxEvent.create({
      data: {
        routingKey: RoutingKeys.ProductoActualizado,
        payload: JSON.stringify({
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio.toNumber(),
          stockActual: productoFinal?.stockActual,
          categoriaNombre: producto.categoria?.nombre,
          disponible: productoFinal?.disponible ?? producto.disponible,
          stockSyncMode: 'CONSUMO_PEDIDO',
          stockDelta: -cantidad,
        } satisfies ProductoActualizadoPayload),
        status: 'PENDING',
      }
    });

    this.logger.log(`Stock reducido para ${productoFinal?.nombre ?? id}: -> ${productoFinal?.stockActual}`);
  }

  // A2: idempotencia por pedido.id — reclama la clave atómicamente
  async procesarPedidoCreado(pedido: any): Promise<void> {
    if (!pedido?.id || !Array.isArray(pedido.items)) {
      this.logger.warn('PedidoCreado sin id/items — ignorado');
      return;
    }
    if (pedido.items.some((item: any) => item?.notas === '__QA_INVENTARIO_FORCE_DLQ__')) {
      throw new Error(`Fallo QA controlado para pedido ${pedido.id}`);
    }
    const key = `pedido.creado:${pedido.id}`;

    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.idempotencyKey.create({ data: { key } });

        for (const item of pedido.items) {
          if (item.productoId && item.cantidad) {
            await this.reducirStockAutomaticoConPrisma(prisma, item.productoId, item.cantidad);
          }
        }
      });
    } catch (e: any) {
      if (e?.code === 'P2002') {
        this.logger.warn(`Pedido ${pedido.id} ya procesado — stock no se reduce de nuevo`);
        return;
      }
      throw e;
    }
  }
}
