import { Controller, Logger, Get, UseInterceptors } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CuentaCerradaPayload, RoutingKeys } from '@org/contracts';
import { RabbitMQRetryInterceptor } from '@org/resiliencia';

@UseInterceptors(RabbitMQRetryInterceptor)
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  healthCheck() {
    return { status: 'OK', service: 'Reportes' };
  }

  @Get('resumen')
  async getResumen() {
    return this.appService.obtenerResumenDiario();
  }

  @EventPattern(RoutingKeys.CuentaCerrada)
  async handleCuentaCerrada(@Payload() payload: CuentaCerradaPayload) {
    this.logger.log(`Procesando evento de reporte: ${RoutingKeys.CuentaCerrada}`);
    await this.appService.registrarVenta(payload);
  }
}
