import { Controller, Get, Post, Body, Param, Patch, ParseUUIDPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { CrearMesaCommand, ActualizarEstadoMesaCommand } from '@org/contracts';

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

  @Post()
  crearMesa(@Body() body: CrearMesaCommand) {
    return this.appService.crearMesa(body);
  }

  @Patch(':id/estado')
  actualizarEstado(@Param('id', ParseUUIDPipe) id: string, @Body() body: ActualizarEstadoMesaCommand) {
    return this.appService.actualizarEstado(id, body);
  }
}
