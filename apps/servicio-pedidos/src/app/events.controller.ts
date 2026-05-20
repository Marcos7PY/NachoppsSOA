import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { DomainEventEnvelope, PagoRegistradoPayload, RoutingKeys } from '@org/contracts';
import { AppService } from './app.service';

@Controller()
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly appService: AppService) {}

  @EventPattern(RoutingKeys.PagoRegistrado)
  async handlePagoRegistrado(
    @Payload() envelope: DomainEventEnvelope<PagoRegistradoPayload>,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const payload = envelope.data ?? (envelope as unknown as PagoRegistradoPayload);
      this.logger.log(`Evento pago.registrado recibido para pedido ${payload.pedidoId}`);
      await this.appService.registrarPagoInterno(payload.pedidoId, payload.monto);
      channel.ack(originalMsg);
    } catch (error: unknown) {
      this.logger.error(`Error procesando pago.registrado: ${(error as Error).message}`);
      channel.nack(originalMsg, false, false);
    }
  }
}

