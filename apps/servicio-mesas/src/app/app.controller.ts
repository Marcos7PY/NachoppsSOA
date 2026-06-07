import { Controller, Get, Post, Body, Param, Patch, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Roles, RolesGuard } from '@org/shared-auth';
import { AppService } from './app.service';
import { CrearMesaCommand, ActualizarEstadoMesaCommand } from '@org/contracts';

// Salón: lo consultan/operan mesero, cajero y recepción (mapa de roles del PWA).
@UseGuards(RolesGuard)
@Roles('ADMIN', 'SISTEMA', 'CAJERO', 'MESERO', 'RECEPCION')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  listarMesas() {
    return this.appService.listarMesas();
  }

  @Get(':id')
  obtenerMesa(@Param('id', ParseUUIDPipe) id: string) {
    return this.appService.obtenerMesa(id);
  }

  // Alta de mesas = configuración del salón, reservada a administración.
  @Roles('ADMIN', 'SISTEMA')
  @Post()
  crearMesa(@Body() body: CrearMesaCommand) {
    return this.appService.crearMesa(body);
  }

  @Patch(':id/estado')
  actualizarEstado(@Param('id', ParseUUIDPipe) id: string, @Body() body: ActualizarEstadoMesaCommand) {
    return this.appService.actualizarEstado(id, body);
  }
}
