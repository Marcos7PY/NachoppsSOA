import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CuentaCerradaPayload, CuentaAbiertaPayload, RoutingKeys } from '@org/contracts';
import { AppService } from './app.service';
import { RabbitMQRetryInterceptor } from '@org/resiliencia';

@UseInterceptors(RabbitMQRetryInterceptor)
@Controller()
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    private readonly appService: AppService,
  ) {}

  @EventPattern(RoutingKeys.CuentaAbierta)
  async handleCuentaAbierta(
    @Payload() payload: CuentaAbiertaPayload,
  ) {
    this.logger.log(`Cuenta abierta para mesa ${payload.mesaId} con cuenta ${payload.cuentaId}. Ocupando mesa...`);

    await this.appService.actualizarEstado(payload.mesaId, {
      estado: 'OCUPADA',
      cuentaAsociada: payload.cuentaId,
    });
    this.logger.log(`Mesa ${payload.mesaId} marcada como OCUPADA con cuenta ${payload.cuentaId}`);
  }

  @EventPattern(RoutingKeys.CuentaCerrada)
  async handleCuentaCerrada(
    @Payload() payload: CuentaCerradaPayload,
  ) {
    this.logger.log(`Cuenta cerrada para mesa ${payload.mesaId}. Liberando mesa...`);

    await this.appService.actualizarEstado(payload.mesaId, {
      estado: 'LIBRE',
      cuentaAsociada: null,
    });
    this.logger.log(`Mesa ${payload.mesaId} liberada.`);
  }
}
