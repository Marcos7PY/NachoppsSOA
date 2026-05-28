import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { PagarPedidoCommand } from '@org/contracts';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  healthCheck() {
    return { status: 'OK', service: 'Caja' };
  }

  @Post('pagos')
  registrarPago(@Body() body: PagarPedidoCommand) {
    return this.appService.registrarPago(body);
  }

  @Get()
  listarTransacciones() {
    return this.appService.listarTransacciones();
  }
}
