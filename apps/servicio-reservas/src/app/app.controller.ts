import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CrearReservaCommand } from '@org/contracts';
import { ReservasService } from './reservas.service';

@Controller()
export class AppController {
  constructor(private readonly reservas: ReservasService) {}

  @Get()
  health() {
    return { message: 'Servicio de Reservas activo', service: 'servicio-reservas' };
  }

  @Get('reservas')
  listar() {
    return this.reservas.listar();
  }

  @Get('reservas/disponibilidad')
  disponibilidad(@Query('fecha') fecha: string, @Query('hora') hora: string) {
    return this.reservas.consultarDisponibilidad(fecha, hora);
  }

  @Post('reservas')
  crear(@Body() body: CrearReservaCommand) {
    return this.reservas.crear(body);
  }

  @Patch('reservas/:id/confirmar')
  confirmar(@Param('id') id: string) {
    return this.reservas.confirmar(id);
  }

  @Delete('reservas/:id')
  cancelar(@Param('id') id: string, @Body() body?: { motivo?: string }) {
    return this.reservas.cancelar(id, body?.motivo);
  }
}
