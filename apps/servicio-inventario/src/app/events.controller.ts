import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AppService } from './app.service';
import { RoutingKeys } from '@org/contracts';

@Controller()
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly appService: AppService) {}

  @EventPattern(RoutingKeys.PedidoCreado)
  async handlePedidoCreado(@Payload() payload: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      // Manejar tanto el formato con envelope como el raw
      const data = payload.data || payload;
      this.logger.log(`Evento pedido.creado recibido. Reduciendo stock...`);
      
      if (data.items && Array.isArray(data.items)) {
        for (const item of data.items) {
          await this.appService.reducirStockAutomatico(item.productoId, item.cantidad);
        }
      }

      channel.ack(originalMsg);
    } catch (error: unknown) {
      this.logger.error(`Error al procesar pedido.creado: ${(error as Error).message}`);
      // En caso de error, no reencolamos para evitar bucles infinitos si es un error de lógica
      channel.nack(originalMsg, false, false);
    }
  }
}
