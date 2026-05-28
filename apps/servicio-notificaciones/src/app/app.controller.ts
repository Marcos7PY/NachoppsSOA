import { Controller, Get, Logger, UseInterceptors } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import {
  DomainEventEnvelope,
  PedidoCreadoPayload,
  PedidoActualizadoPayload,
  ReservaCreadaPayload,
  RoutingKeys,
} from '@org/contracts';
import { RabbitMQRetryInterceptor } from '@org/resiliencia';
import { AppService } from './app.service';
import { NotificationsGateway } from './notifications.gateway';

@UseInterceptors(RabbitMQRetryInterceptor)
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    private readonly gateway: NotificationsGateway
  ) {}

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

  @EventPattern(RoutingKeys.PedidoActualizado)
  async handlePedidoActualizado(
    @Payload() payload: DomainEventEnvelope<PedidoActualizadoPayload> | PedidoActualizadoPayload,
    @Ctx() context: RmqContext,
  ) {
    const data = payload && 'data' in payload ? payload.data : payload;
    await this.handleEvent(RoutingKeys.PedidoActualizado, data, context);
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
    _context: RmqContext,
  ): Promise<void> {
    this.logger.log(`✅ Evento recibido: ${pattern}`);
    this.logger.log(` Datos: ${JSON.stringify(data)}`);

    this.gateway.emitPedidoUpdate({ pattern, data });
  }
}
