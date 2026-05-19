import { Body, Controller, Get, Post } from '@nestjs/common';
import { CrearPedidoCommand } from '@org/contracts';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('pedidos')
  crearPedido(@Body() body: CrearPedidoCommand) {
    return this.appService.crearPedido(body);
  }
}
