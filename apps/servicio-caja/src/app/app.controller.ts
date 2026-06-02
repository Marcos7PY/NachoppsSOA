import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { PagarPedidoCommand, ListarTransaccionesQuery, TransaccionListResponse } from '@org/contracts';

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
  listarTransacciones(@Query() query: ListarTransaccionesQuery): Promise<TransaccionListResponse> {
    return this.appService.listarTransacciones(query);
  }
}
