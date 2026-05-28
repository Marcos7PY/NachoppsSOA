import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CrearReservaCommand } from '@org/contracts';
import { ReservasService } from './reservas.service';

@Controller()
export class AppController {
  constructor(private readonly reservas: ReservasService) {}

  @Get()
  listar() {
    return this.reservas.listar();
  }

  @Get('disponibilidad')
  disponibilidad(@Query('fecha') fecha: string, @Query('hora') hora: string) {
    return this.reservas.consultarDisponibilidad(fecha, hora);
  }

  @Post()
  crear(@Body() body: CrearReservaCommand) {
    return this.reservas.crear(body);
  }

  @Patch(':id/confirmar')
  confirmar(@Param('id') id: string) {
    return this.reservas.confirmar(id);
  }

  @Delete(':id')
  cancelar(@Param('id') id: string, @Body() body?: { motivo?: string }) {
    return this.reservas.cancelar(id, body?.motivo);
  }
}
