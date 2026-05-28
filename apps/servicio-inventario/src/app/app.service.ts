import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CategoriaDto, 
  ProductoDto, 
  CrearCategoriaCommand, 
  CrearProductoCommand 
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
      include: { categoria: true }, // Incluir categoría para agrupar en el front
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
    return producto;
  }

  async crearProducto(command: CrearProductoCommand): Promise<{ message: string; producto: ProductoDto }> {
    const categoria = await this.prisma.categoria.findUnique({ where: { id: command.categoriaId } });
    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${command.categoriaId} no encontrada`);
    }

    const producto = await this.prisma.producto.create({
      data: {
        categoriaId: command.categoriaId,
        nombre: command.nombre,
        descripcion: command.descripcion,
        precio: command.precio,
        disponible: command.disponible ?? true,
        stockActual: command.stockActual ?? null,
      }
    });
    
    return { message: 'Producto creado exitosamente', producto };
  }

  async actualizarStock(id: string, cantidad: number): Promise<{ message: string; producto: ProductoDto }> {
    const producto = await this.prisma.producto.findUnique({ where: { id } });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    const stockBase = producto.stockActual ?? 0;
    const nuevoStock = Math.max(0, stockBase + cantidad);

    const actualizado = await this.prisma.producto.update({
      where: { id },
      data: { stockActual: nuevoStock }
    });
    return { message: 'Stock actualizado', producto: actualizado };
  }

  async reducirStockAutomatico(id: string, cantidad: number): Promise<void> {
    const producto = await this.prisma.producto.findUnique({ where: { id } });
    
    if (!producto) {
      this.logger.warn(`Producto ${id} no encontrado para reducción de stock`);
      return;
    }

    // Lógica clave: Si es null, es un plato o item sin control de stock
    if (producto.stockActual === null) {
      return;
    }

    // Update condicional atómico: solo decrementa si hay stock suficiente
    const actualizado = await this.prisma.producto.updateMany({
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

    const productoDespues = await this.prisma.producto.findUnique({ where: { id } });
    if (productoDespues && productoDespues.stockActual === 0 && productoDespues.disponible) {
      await this.prisma.producto.update({
        where: { id },
        data: { disponible: false }
      });
    }

    this.logger.log(`Stock reducido para ${productoDespues?.nombre ?? id}: -> ${productoDespues?.stockActual}`);
  }
}
