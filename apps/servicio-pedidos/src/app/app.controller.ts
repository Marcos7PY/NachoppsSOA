import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { EventPattern, Payload,  } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CrearPedidoCommand, ActualizarEstadoPedidoCommand, RoutingKeys, PagoRegistradoPayload } from '@org/contracts';

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

  @Patch('pedidos/items/:itemId/estado')
  actualizarEstadoItem(@Param('itemId') itemId: string, @Body() body: ActualizarEstadoPedidoCommand) {
    return this.appService.actualizarEstadoItem(itemId, body);
  }

  @EventPattern(RoutingKeys.PagoRegistrado)
  async procesarPago(@Payload() payload: PagoRegistradoPayload) {
    try {
      await this.appService.procesarPagoRecibido(payload);
    } catch (error) {
      console.error('Error procesando pago:', error);
    }
  }
}
