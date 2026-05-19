import { Controller, Get, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import {
  DomainEventEnvelope,
  PedidoCreadoPayload,
  ReservaCreadaPayload,
  RoutingKeys,
} from '@org/contracts';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @EventPattern(RoutingKeys.PedidoCreado)
  async handlePedidoCreado(
    @Payload() payload: DomainEventEnvelope<PedidoCreadoPayload> | PedidoCreadoPayload,
    @Ctx() context: RmqContext,
  ) {
    const data = 'data' in payload && payload.data ? payload.data : payload;
    await this.handleEvent(RoutingKeys.PedidoCreado, data, context);
  }

  @EventPattern(RoutingKeys.ReservaCreada)
  async handleReservaCreada(
    @Payload() payload: DomainEventEnvelope<ReservaCreadaPayload> | ReservaCreadaPayload,
    @Ctx() context: RmqContext,
  ) {
    const data = 'data' in payload && payload.data ? payload.data : payload;
    await this.handleEvent(RoutingKeys.ReservaCreada, data, context);
  }

  @EventPattern(RoutingKeys.ReservaCancelada)
  async handleReservaCancelada(
    @Payload() payload: DomainEventEnvelope<{ reservaId: string }>,
    @Ctx() context: RmqContext,
  ) {
    const data = payload?.data ?? payload;
    await this.handleEvent(RoutingKeys.ReservaCancelada, data, context);
  }

  private async handleEvent(
    pattern: string,
    data: unknown,
    context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(`✅ Evento recibido: ${pattern}`);
      this.logger.log(` Datos: ${JSON.stringify(data)}`);
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(`Error procesando ${pattern}`, error);
      channel.nack(originalMsg, false, true);
    }
  }
}
