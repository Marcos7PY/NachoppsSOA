import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { PagarPedidoCommand } from '@org/contracts';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('pagos')
  registrarPago(@Body() body: PagarPedidoCommand) {
    return this.appService.registrarPago(body);
  }

  @Get('transacciones')
  listarTransacciones() {
    return this.appService.listarTransacciones();
  }
}
