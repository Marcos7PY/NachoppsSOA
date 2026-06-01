import { Controller, Get, Logger, UseInterceptors } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import {
  PedidoCreadoPayload,
  PedidoActualizadoPayload,
  CuentaAbiertaPayload,
  CuentaCerradaPayload,
  MesaActualizadaPayload,
  ReservaCanceladaPayload,
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
  async obtenerNotificaciones() {
    return this.appService.obtenerNotificaciones();
  }

  @EventPattern(RoutingKeys.PedidoCreado)
  async handlePedidoCreado(
    @Payload() payload: PedidoCreadoPayload,
    @Ctx() context: RmqContext,
  ) {
    await this.handleEvent(RoutingKeys.PedidoCreado, payload, context);
  }

  @EventPattern(RoutingKeys.PedidoActualizado)
  async handlePedidoActualizado(
    @Payload() payload: PedidoActualizadoPayload,
    @Ctx() context: RmqContext,
  ) {
    await this.handleEvent(RoutingKeys.PedidoActualizado, payload, context);
  }

  @EventPattern(RoutingKeys.CuentaAbierta)
  async handleCuentaAbierta(
    @Payload() payload: CuentaAbiertaPayload,
    @Ctx() context: RmqContext,
  ) {
    await this.handleEvent(RoutingKeys.CuentaAbierta, payload, context);
  }

  @EventPattern(RoutingKeys.CuentaCerrada)
  async handleCuentaCerrada(
    @Payload() payload: CuentaCerradaPayload,
    @Ctx() context: RmqContext,
  ) {
    await this.handleEvent(RoutingKeys.CuentaCerrada, payload, context);
  }

  @EventPattern(RoutingKeys.MesaActualizada)
  async handleMesaActualizada(
    @Payload() payload: MesaActualizadaPayload,
    @Ctx() context: RmqContext,
  ) {
    await this.handleEvent(RoutingKeys.MesaActualizada, payload, context);
  }

  @EventPattern(RoutingKeys.ReservaCreada)
  async handleReservaCreada(
    @Payload() payload: ReservaCreadaPayload,
    @Ctx() context: RmqContext,
  ) {
    await this.handleEvent(RoutingKeys.ReservaCreada, payload, context);
  }

  @EventPattern(RoutingKeys.ReservaCancelada)
  async handleReservaCancelada(
    @Payload() payload: ReservaCanceladaPayload,
    @Ctx() context: RmqContext,
  ) {
    await this.handleEvent(RoutingKeys.ReservaCancelada, payload, context);
  }

  private async handleEvent(
    pattern: string,
    data: unknown,
    _context: RmqContext,
  ): Promise<void> {
    this.logger.log(`✅ Evento recibido: ${pattern}`);
    this.logger.log(` Datos: ${JSON.stringify(data)}`);

    // Guardar en la base de datos de manera persistente
    const notif = await this.appService.registrarNotificacion(pattern, data);

    // Emitir por WebSocket para tiempo real
    this.gateway.emitPedidoUpdate({ 
      pattern, 
      data: {
        ...(typeof data === 'object' ? data : {}),
        notificacionId: notif?.id,
        contenido: notif?.contenido
      }
    });
  }

}
