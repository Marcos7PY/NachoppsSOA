import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CrearPedidoCommand, ActualizarEstadoPedidoCommand, DividirCuentaCommand } from '@org/contracts';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('pedidos')
  crearPedido(@Body() body: CrearPedidoCommand) {
    return this.appService.crearPedido(body);
  }

  @Get('pedidos')
  listarPedidos(@Query('mesaId') mesaId?: string) {
    return this.appService.listarPedidos(mesaId);
  }

  @Patch('pedidos/:id/estado')
  actualizarEstado(@Param('id') id: string, @Body() body: ActualizarEstadoPedidoCommand) {
    return this.appService.actualizarEstado(id, body);
  }

  @Post('pedidos/:id/dividir')
  dividirCuenta(@Param('id') id: string, @Body() body: DividirCuentaCommand) {
    return this.appService.dividirCuenta(id, body);
  }
}
