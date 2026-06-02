import { Controller, Get, Post, Body, Param, Patch, Query, UseInterceptors } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CrearPedidoCommand, ActualizarEstadoPedidoCommand, RoutingKeys, PagoRegistradoPayload, ListarPedidosQuery } from '@org/contracts';
import { RabbitMQRetryInterceptor } from '@org/resiliencia';

@UseInterceptors(RabbitMQRetryInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  crearPedido(@Body() body: CrearPedidoCommand) {
    return this.appService.crearPedido(body);
  }

  @Get()
  listarPedidos(@Query() query: ListarPedidosQuery) {
    return this.appService.listarPedidos(query);
  }

  @Patch(':id/estado')
  actualizarEstado(@Param('id') id: string, @Body() body: ActualizarEstadoPedidoCommand) {
    return this.appService.actualizarEstado(id, body);
  }

  @Patch('items/:itemId/estado')
  actualizarEstadoItem(@Param('itemId') itemId: string, @Body() body: ActualizarEstadoPedidoCommand) {
    return this.appService.actualizarEstadoItem(itemId, body);
  }

  @EventPattern(RoutingKeys.PagoRegistrado)
  async procesarPago(@Payload() payload: PagoRegistradoPayload) {
    await this.appService.procesarPagoRecibido(payload);
  }
}
