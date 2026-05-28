import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { DomainEventEnvelope, RoutingKeys } from '@org/contracts';
import { RabbitMQRetryInterceptor } from '@org/resiliencia';

@UseInterceptors(RabbitMQRetryInterceptor)
@Controller()
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly appService: AppService) {}

  @EventPattern(RoutingKeys.PedidoCreado)
  async handlePedidoCreado(
    @Payload() envelope: DomainEventEnvelope<any>,
  ) {
    const payload = envelope.data ?? envelope;
    
    const pedido = payload.pedido ?? payload;
    
    if (!pedido.items || !Array.isArray(pedido.items)) {
      this.logger.warn('PedidoCreado sin items. Ignorando.');
      return;
    }

    this.logger.log(`Procesando pedido.creado con ${pedido.items.length} items`);
    
    for (const item of pedido.items) {
      if (item.productoId && item.cantidad) {
        await this.appService.reducirStockAutomatico(item.productoId, item.cantidad);
        this.logger.log(`Stock reducido: ${item.productoId} (-${item.cantidad})`);
      }
    }
  }
}
