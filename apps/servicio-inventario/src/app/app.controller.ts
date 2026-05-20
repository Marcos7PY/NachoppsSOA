import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CrearCategoriaCommand, CrearProductoCommand } from '@org/contracts';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getHello();
  }

  // --- CATEGORÍAS ---

  @Get('categorias')
  listarCategorias() {
    return this.appService.listarCategorias();
  }

  @Post('categorias')
  crearCategoria(@Body() body: CrearCategoriaCommand) {
    return this.appService.crearCategoria(body);
  }

  // --- PRODUCTOS ---

  @Get('productos')
  listarProductos(@Query('categoriaId') categoriaId?: string) {
    return this.appService.listarProductos(categoriaId);
  }

  @Get('productos/:id')
  obtenerProducto(@Param('id') id: string) {
    return this.appService.obtenerProducto(id);
  }

  @Post('productos')
  crearProducto(@Body() body: CrearProductoCommand) {
    return this.appService.crearProducto(body);
  }

  @Patch('productos/:id/stock')
  actualizarStock(@Param('id') id: string, @Body('stock') stock: number) {
    return this.appService.actualizarStock(id, stock);
  }
}
